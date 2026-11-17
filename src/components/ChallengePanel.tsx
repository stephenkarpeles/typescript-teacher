import { useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'
import type { Challenge, TestResult } from '../curriculum/types'
import { runChallenge } from '../lib/runner'

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

  useEffect(() => {
    setCode(savedCode ?? challenge.starterCode)
    setHintLevel(0)
    setResults(null)
    setCompileError(null)
    setRuntimeError(null)
    setPassed(false)
  }, [challenge.id, challenge.starterCode, savedCode])

  function updateCode(next: string) {
    setCode(next)
    onCodeChange(next)
  }

  async function handleRun() {
    setRunning(true)
    setCompileError(null)
    setRuntimeError(null)
    try {
      const outcome = await runChallenge(code, challenge)

      if (outcome.compileError) {
        setResults(null)
        setCompileError(outcome.compileError)
        return
      }
      if (outcome.runtimeError) {
        setResults(null)
        setRuntimeError(outcome.runtimeError)
        return
      }

      setResults(outcome.results)
      if (outcome.ok) {
        setPassed(true)
        onPassed()
      } else {
        setPassed(false)
      }
    } finally {
      setRunning(false)
    }
  }

  function showHint() {
    setHintLevel((n) => Math.min(n + 1, challenge.hints.length))
  }

  return (
    <div className="challenge-grid">
      <div className="panel challenge-meta">
        <h2>{challenge.title}</h2>
        <div className="prompt">{challenge.prompt}</div>

        <div className="editor-wrap">
          <Editor
            height="340px"
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
          <button className="btn btn-primary" onClick={handleRun} disabled={running}>
            {running ? 'Running…' : 'Run tests'}
          </button>
          <button className="btn btn-amber" onClick={showHint} type="button">
            Get hint
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

      <div className="panel">
        <h2>Results</h2>

        {compileError && (
          <div className="error-banner">Compile error{'\n'}{compileError}</div>
        )}
        {runtimeError && (
          <div className="error-banner">Runtime error{'\n'}{runtimeError}</div>
        )}

        {passed && (
          <div className="success-banner">
            All tests passed. You can move to the next lesson.
          </div>
        )}

        {results && (
          <div className="results" style={{ marginTop: '0.75rem' }}>
            {results.map((r) => (
              <div
                key={r.description}
                className={`result-row ${r.passed ? 'pass' : 'fail'}`}
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
          <p style={{ color: 'var(--muted)', margin: 0 }}>
            Write your solution, then hit <strong>Run tests</strong>. You must
            pass every check to unlock the next lesson.
          </p>
        )}

        {hintLevel > 0 && (
          <div className="hint-box" style={{ marginTop: '1rem' }}>
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
      </div>
    </div>
  )
}
