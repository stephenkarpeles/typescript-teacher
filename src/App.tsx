import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { ChallengePanel } from './components/ChallengePanel'
import { LessonContent } from './components/LessonContent'
import {
  flattenLessons,
  getLessonById,
  getNextLessonId,
  getPrevLessonId,
  isLessonUnlocked,
  modules,
} from './curriculum/modules'
import { levelTitle } from './lib/copy'
import {
  defaultProgress,
  loadProgress,
  saveProgress,
  totalChallengeCount,
  totalLessonCount,
} from './lib/progress'
import type { ProgressState } from './curriculum/types'

function App() {
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress())
  const [ready, setReady] = useState(false)
  const [contentKey, setContentKey] = useState(0)

  useEffect(() => {
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready) saveProgress(progress)
  }, [progress, ready])

  const current = useMemo(
    () => getLessonById(progress.currentLessonId) ?? flattenLessons()[0],
    [progress.currentLessonId],
  )

  const { lesson, module } = current
  const allLessons = flattenLessons()
  const lessonNumber =
    allLessons.findIndex((x) => x.lesson.id === lesson.id) + 1

  const completedLessons = progress.completedLessonIds.length
  const completedChallenges = progress.completedChallengeIds.length
  const lessonPct = Math.round((completedLessons / totalLessonCount()) * 100)

  function goTo(lessonId: string) {
    if (
      !isLessonUnlocked(
        lessonId,
        progress.completedLessonIds,
        progress.completedChallengeIds,
      )
    ) {
      return
    }
    setProgress((p) => ({ ...p, currentLessonId: lessonId }))
    setContentKey((k) => k + 1)
  }

  function markChallengePassed(challengeId: string) {
    setProgress((p) => {
      const completedChallengeIds = p.completedChallengeIds.includes(challengeId)
        ? p.completedChallengeIds
        : [...p.completedChallengeIds, challengeId]
      const completedLessonIds = p.completedLessonIds.includes(lesson.id)
        ? p.completedLessonIds
        : [...p.completedLessonIds, lesson.id]
      return { ...p, completedChallengeIds, completedLessonIds }
    })
  }

  const challengeDone =
    !lesson.challenge ||
    progress.completedChallengeIds.includes(lesson.challenge.id)

  const lessonDone = progress.completedLessonIds.includes(lesson.id) && challengeDone

  const nextId = getNextLessonId(lesson.id)
  const prevId = getPrevLessonId(lesson.id)

  function continueNext() {
    const completedLessonIds = progress.completedLessonIds.includes(lesson.id)
      ? progress.completedLessonIds
      : [...progress.completedLessonIds, lesson.id]
    const completedChallengeIds = progress.completedChallengeIds

    if (lesson.challenge && !completedChallengeIds.includes(lesson.challenge.id)) {
      return
    }

    if (!nextId) {
      setProgress((p) => ({ ...p, completedLessonIds }))
      return
    }

    if (isLessonUnlocked(nextId, completedLessonIds, completedChallengeIds)) {
      setProgress((p) => ({
        ...p,
        completedLessonIds,
        currentLessonId: nextId,
      }))
      setContentKey((k) => k + 1)
    }
  }

  function resetAll() {
    if (!confirm('Start fresh? Progress and saved code will clear.')) {
      return
    }
    const fresh = defaultProgress()
    setProgress(fresh)
    saveProgress(fresh)
    setContentKey((k) => k + 1)
  }

  const showWelcomeHero = lesson.id === modules[0].lessons[0].id

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-row">
            <div className="mascot" aria-hidden>
              <span className="mascot-face">:</span>
              <span className="mascot-face">)</span>
            </div>
            <div>
              <div className="brand-mark">TS Refresh</div>
              <div className="brand-tag">Type. Run. High-five yourself.</div>
            </div>
          </div>
        </div>

        <div className="progress-block">
          <div className="level-pill">{levelTitle(lessonPct)}</div>
          <div className="progress-label">
            <span>Vibe check</span>
            <span>
              {completedLessons}/{totalLessonCount()} · {lessonPct}%
            </span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${lessonPct}%` }}
            />
          </div>
          <div className="progress-label">
            <span>Challenges crushed</span>
            <span>
              {completedChallenges}/{totalChallengeCount()}
            </span>
          </div>
        </div>

        <div className="module-list">
          {modules.map((m, mi) => (
            <div key={m.id} className="module-group">
              <div className="module-title">
                <span className="module-index">{String(mi + 1).padStart(2, '0')}</span>
                {m.title.replace(/^Module \d+ — /, '')}
              </div>
              {m.lessons.map((l) => {
                const unlocked = isLessonUnlocked(
                  l.id,
                  progress.completedLessonIds,
                  progress.completedChallengeIds,
                )
                const done =
                  progress.completedLessonIds.includes(l.id) &&
                  (!l.challenge ||
                    progress.completedChallengeIds.includes(l.challenge.id))
                const active = l.id === lesson.id
                return (
                  <button
                    key={l.id}
                    className={`lesson-btn ${active ? 'active' : ''} ${done ? 'done-row' : ''}`}
                    disabled={!unlocked}
                    onClick={() => goTo(l.id)}
                    type="button"
                  >
                    <span
                      className={`lesson-status ${done ? 'done' : ''} ${!unlocked ? 'lock' : ''}`}
                    >
                      {done ? '✓' : !unlocked ? '' : ''}
                    </span>
                    <span className="lesson-copy">
                      <strong>{l.title}</strong>
                      <span>
                        ~{l.minutes} min
                        {l.challenge ? ' · code it' : ' · read'}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div>
            <p className="top-eyebrow">
              Stop {lessonNumber} of {allLessons.length}
            </p>
            <h1>{lesson.title}</h1>
            <p>
              {module.subtitle} · about {lesson.minutes} min of fun
            </p>
          </div>
          <div className="topbar-actions">
            <button className="btn btn-ghost" type="button" onClick={resetAll}>
              Start over
            </button>
          </div>
        </header>

        <div className="content" key={contentKey}>
          {showWelcomeHero && (
            <section className="welcome-hero float-in">
              <div className="hero-blobs" aria-hidden>
                <span />
                <span />
              </div>
              <p className="eyebrow">Welcome back to TypeScript</p>
              <h1>Rusty is temporary. Fluency is a few reps away.</h1>
              <p>
                Short lessons, tiny wins, and challenges that unlock like a
                game. No judgment if you smash the hint button — that is also
                studying.
              </p>
              <div className="hero-pills">
                <span>Basics first</span>
                <span>Hands-on coding</span>
                <span>~6–8 hours total</span>
              </div>
            </section>
          )}

          <section className="panel float-in learn-panel">
            <div className="panel-kicker">
              <span className="chip chip-learn">Learn</span>
              <span className="soft-meta">Snack-sized, promise</span>
            </div>
            <h2 className="sr-only">Lesson</h2>
            <LessonContent content={lesson.content} />
            {lesson.example && (
              <pre className="example-block" style={{ marginTop: '1rem' }}>
                <code>{lesson.example}</code>
              </pre>
            )}
          </section>

          {lesson.challenge && (
            <ChallengePanel
              challenge={lesson.challenge}
              savedCode={progress.codeByChallengeId[lesson.challenge.id]}
              onCodeChange={(code) =>
                setProgress((p) => ({
                  ...p,
                  codeByChallengeId: {
                    ...p.codeByChallengeId,
                    [lesson.challenge!.id]: code,
                  },
                }))
              }
              onPassed={() => markChallengePassed(lesson.challenge!.id)}
            />
          )}

          <div className="nav-row panel float-in">
            <button
              className="btn"
              type="button"
              disabled={!prevId}
              onClick={() => prevId && goTo(prevId)}
            >
              ← Back a step
            </button>

            {!lesson.challenge && !lessonDone && (
              <button
                className="btn btn-primary"
                type="button"
                onClick={continueNext}
              >
                Got it — next →
              </button>
            )}

            {(lessonDone || (lesson.challenge && challengeDone)) && nextId && (
              <button
                className="btn btn-primary"
                type="button"
                onClick={continueNext}
              >
                Keep the streak going →
              </button>
            )}

            {lesson.challenge && !challengeDone && (
              <button className="btn btn-wait" type="button" disabled>
                Pass the challenge to unlock next
              </button>
            )}

            {!nextId && lessonDone && (
              <button className="btn btn-primary" type="button" disabled>
                You finished the gym. Go crush that test.
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
