import { useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'
import {
  solutionExplanations,
  solutions,
} from '../curriculum/solutions'
import type { Challenge, TestResult } from '../curriculum/types'
import { configurePlaygroundMonaco } from '../lib/monaco'
import { runChallenge } from '../lib/runner'
import { ConfettiBurst } from './ConfettiBurst'

type Props = {
  challenge: Challenge
  savedCode?: string
  onCodeChange: (code: string) => void
  onPassed: () => void
}

export function ChallengePanel({
  challenge,
  savedCode,
  onCodeChange,
  onPassed,
}: Props) {
  const [code, setCode] = useState(savedCode ?? challenge.starterCode)
  const [hintLevel, setHintLevel] = useState(0)
  const [answerRevealed, setAnswerRevealed] = useState(false)
  const [results, setResults] = useState<TestResult[] | null>(null)
  const [compileError, setCompileError] = useState<string | null>(null)
  const [runtimeError, setRuntimeError] = useState<string | null>(null)
  const [passed, setPassed] = useState(false)
  const [running, setRunning] = useState(false)
  const [celebrate, setCelebrate] = useState(false)
  const [shake, setShake] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const allHintsShown =
    challenge.hints.length > 0 && hintLevel >= challenge.hints.length
  const answerCode = solutions[challenge.id]
  const answerExplanation = solutionExplanations[challenge.id]
  const canRevealAnswer = allHintsShown && Boolean(answerCode)

  useEffect(() => {
    setCode(savedCode ?? challenge.starterCode)
    setHintLevel(0)
    setAnswerRevealed(false)
    setResults(null)
    setCompileError(null)
    setRuntimeError(null)
    setPassed(false)
    setCelebrate(false)
    setAttempts(0)
  }, [challenge.id, challenge.starterCode, savedCode])

  function updateCode(next: string) {
    setCode(next)
    onCodeChange(next)
  }

  async function handleRun() {
    setRunning(true)
    setCompileError(null)
    setRuntimeError(null)
    setCelebrate(false)
    try {
      const outcome = await runChallenge(code, challenge)
      setAttempts((n) => n + 1)

      if (outcome.compileError) {
        setResults(null)
        setCompileError(outcome.compileError)
        pulseShake()
        return
      }
      if (outcome.runtimeError) {
        setResults(null)
        setRuntimeError(outcome.runtimeError)
        pulseShake()
        return
      }

      setResults(outcome.results)
      if (outcome.ok) {
        setPassed(true)
        setCelebrate(true)
        onPassed()
      } else {
        setPassed(false)
        pulseShake()
      }
    } finally {
      setRunning(false)
    }
  }

  function pulseShake() {
    setShake(true)
    window.setTimeout(() => setShake(false), 450)
  }

  function showHint() {
    setHintLevel((n) => Math.min(n + 1, challenge.hints.length))
  }

  function revealAnswer() {
    setAnswerRevealed(true)
  }

  function fillAnswer() {
    if (!answerCode) return
    updateCode(answerCode)
  }

  return (
    <div className={`challenge-grid ${shake ? 'is-shake' : ''}`}>
      <ConfettiBurst active={celebrate} />

      <div className="panel challenge-meta">
        <div className="panel-kicker">
          <span className="chip chip-play">Challenge</span>
          {attempts > 0 && (
            <span className="soft-meta">
              {attempts} attempt{attempts === 1 ? '' : 's'}
            </span>
          )}
        </div>
        <h2>{challenge.title}</h2>
        <div className="prompt">{challenge.prompt}</div>

        <div className="editor-wrap">
          <div className="editor-chrome">
            <span className="dot red" />
            <span className="dot amber" />
            <span className="dot green" />
            <span className="editor-chrome-title">playground.ts</span>
          </div>
          <Editor
            height="320px"
            defaultLanguage="typescript"
            path={`file:///playground/${challenge.id}.ts`}
            theme="vs-dark"
            value={code}
            onChange={(v) => updateCode(v ?? '')}
            beforeMount={configurePlaygroundMonaco}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: 'IBM Plex Mono, monospace',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              padding: { top: 12 },
              wordWrap: 'on',
              // Let the page scroll when the editor has nothing left to scroll.
              scrollbar: {
                alwaysConsumeMouseWheel: false,
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10,
              },
            }}
          />
        </div>

        <div className="editor-toolbar">
          <button
            className={`btn btn-primary btn-run ${running ? 'is-running' : ''}`}
            onClick={handleRun}
            disabled={running}
          >
            {running ? 'Running…' : 'Run tests'}
          </button>
          <button
            className="btn btn-amber"
            onClick={showHint}
            type="button"
            disabled={allHintsShown}
          >
            {hintLevel === 0
              ? 'Get hint'
              : allHintsShown
                ? 'All hints shown'
                : 'Next hint'}
          </button>
          {canRevealAnswer && !answerRevealed && (
            <button className="btn btn-answer" onClick={revealAnswer} type="button">
              Show me the answer
            </button>
          )}
          <button
            className="btn btn-ghost"
            type="button"
            onClick={() => updateCode(challenge.starterCode)}
          >
            Reset code
          </button>
        </div>
      </div>

      <div className={`panel results-panel ${passed ? 'is-win' : ''}`}>
        <div className="panel-kicker">
          <span className="chip">Results</span>
        </div>
        <h2 className="sr-only">Test results</h2>

        {compileError && (
          <div className="error-banner">
            Compile error{'\n'}
            {compileError}
          </div>
        )}
        {runtimeError && (
          <div className="error-banner">
            Runtime error{'\n'}
            {runtimeError}
          </div>
        )}

        {passed && (
          <div className="success-banner pop-in">
            All tests passed. You can move on to the next lesson.
          </div>
        )}

        {results && (
          <div className="results" style={{ marginTop: passed ? '0.75rem' : 0 }}>
            {results.map((r, i) => (
              <div
                key={r.description}
                className={`result-row ${r.passed ? 'pass' : 'fail'} pop-in`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className="badge">{r.passed ? 'PASS' : 'FAIL'}</span>
                <div>
                  <div>{r.description}</div>
                  {r.error && (
                    <div style={{ marginTop: 4, opacity: 0.9 }}>{r.error}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!results && !compileError && !runtimeError && (
          <div className="idle-results">
            <p>
              Write your solution, then click <strong>Run tests</strong>. You
              need to pass every check before the next lesson unlocks.
            </p>
          </div>
        )}

        {hintLevel > 0 && (
          <div className="hint-box pop-in" style={{ marginTop: '1rem' }}>
            <strong>
              Hint{hintLevel > 1 ? 's' : ''} ({hintLevel}/{challenge.hints.length})
            </strong>
            <ol>
              {challenge.hints.slice(0, hintLevel).map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ol>
          </div>
        )}

        {answerRevealed && answerCode && (
          <div className="answer-box pop-in" style={{ marginTop: '1rem' }}>
            <strong>Answer</strong>
            {answerExplanation && <p className="answer-explain">{answerExplanation}</p>}
            <pre className="answer-code">
              <code>{answerCode.trimEnd()}</code>
            </pre>
            <button className="btn btn-ghost btn-fill-answer" type="button" onClick={fillAnswer}>
              Fill editor with answer
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
