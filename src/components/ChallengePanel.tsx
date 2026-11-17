import { useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'
import type { Challenge, TestResult } from '../curriculum/types'
import { FAIL_LINES, HINT_QUIPS, NUDGE_LINES, WIN_LINES, pick } from '../lib/copy'
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
  const [results, setResults] = useState<TestResult[] | null>(null)
  const [compileError, setCompileError] = useState<string | null>(null)
  const [runtimeError, setRuntimeError] = useState<string | null>(null)
  const [passed, setPassed] = useState(false)
  const [running, setRunning] = useState(false)
  const [celebrate, setCelebrate] = useState(false)
  const [shake, setShake] = useState(false)
  const [banner, setBanner] = useState<string | null>(null)
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    setCode(savedCode ?? challenge.starterCode)
    setHintLevel(0)
    setResults(null)
    setCompileError(null)
    setRuntimeError(null)
    setPassed(false)
    setCelebrate(false)
    setBanner(null)
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
        setBanner(pick(FAIL_LINES, attempts + 1))
        pulseShake()
        return
      }
      if (outcome.runtimeError) {
        setResults(null)
        setRuntimeError(outcome.runtimeError)
        setBanner(pick(FAIL_LINES, attempts + 2))
        pulseShake()
        return
      }

      setResults(outcome.results)
      if (outcome.ok) {
        setPassed(true)
        setBanner(pick(WIN_LINES, challenge.id.length + attempts))
        setCelebrate(true)
        onPassed()
      } else {
        setPassed(false)
        setBanner(pick(FAIL_LINES, attempts + 3))
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

  const nudge = pick(NUDGE_LINES, challenge.id.length)

  return (
    <div className={`challenge-grid ${shake ? 'is-shake' : ''}`}>
      <ConfettiBurst active={celebrate} />

      <div className="panel challenge-meta">
        <div className="panel-kicker">
          <span className="chip chip-play">Your turn</span>
          <span className="soft-meta">
            {attempts === 0
              ? 'First try energy welcome'
              : `${attempts} run${attempts === 1 ? '' : 's'} so far`}
          </span>
        </div>
        <h2>{challenge.title}</h2>
        <div className="prompt">
          <span className="prompt-label">Mission</span>
          {challenge.prompt}
        </div>

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
            theme="vs-dark"
            value={code}
            onChange={(v) => updateCode(v ?? '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: 'IBM Plex Mono, monospace',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              padding: { top: 12 },
            }}
          />
        </div>

        <div className="editor-toolbar">
          <button
            className={`btn btn-primary btn-run ${running ? 'is-running' : ''}`}
            onClick={handleRun}
            disabled={running}
          >
            {running ? 'Checking…' : 'Run tests'}
          </button>
          <button className="btn btn-amber" onClick={showHint} type="button">
            {hintLevel === 0
              ? 'Stuck? Get a hint'
              : hintLevel >= challenge.hints.length
                ? 'All hints shown'
                : 'Another hint'}
          </button>
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
          <span className="chip">Scoreboard</span>
        </div>
        <h2>Results</h2>

        {banner && (
          <div
            className={`mood-banner ${passed ? 'win' : 'try'}`}
            key={banner + String(passed)}
          >
            {banner}
          </div>
        )}

        {compileError && (
          <div className="error-banner">
            Compile hiccup{'\n'}
            {compileError}
          </div>
        )}
        {runtimeError && (
          <div className="error-banner">
            Runtime hiccup{'\n'}
            {runtimeError}
          </div>
        )}

        {passed && (
          <div className="success-banner pop-in">
            All green. Next lesson is unlocked — go enjoy the win.
          </div>
        )}

        {results && (
          <div className="results" style={{ marginTop: '0.75rem' }}>
            {results.map((r, i) => (
              <div
                key={r.description}
                className={`result-row ${r.passed ? 'pass' : 'fail'} pop-in`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className="badge">{r.passed ? 'YES' : 'NOPE'}</span>
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
            <div className="idle-orb" aria-hidden />
            <p>
              Write something, then hit <strong>Run tests</strong>.
            </p>
            <p className="idle-nudge">{nudge}</p>
          </div>
        )}

        {hintLevel > 0 && (
          <div className="hint-box pop-in" style={{ marginTop: '1rem' }}>
            <strong>
              {pick(HINT_QUIPS, Math.max(0, hintLevel - 1))} ({hintLevel}/
              {challenge.hints.length})
            </strong>
            <ol>
              {challenge.hints.slice(0, hintLevel).map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  )
}
