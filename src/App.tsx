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
    }
  }

  function resetAll() {
    if (
      !confirm(
        'Reset all progress and saved code? This cannot be undone.',
      )
    ) {
      return
    }
    const fresh = defaultProgress()
    setProgress(fresh)
    saveProgress(fresh)
  }

  const showWelcomeHero = lesson.id === modules[0].lessons[0].id

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">TS Refresh</div>
          <div className="brand-tag">Hands-on TypeScript, from zero</div>
        </div>

        <div className="progress-block">
          <div className="progress-label">
            <span>Course progress</span>
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
            <span>Challenges cleared</span>
            <span>
              {completedChallenges}/{totalChallengeCount()}
            </span>
          </div>
        </div>

        <div className="module-list">
          {modules.map((m) => (
            <div key={m.id}>
              <div className="module-title">{m.title}</div>
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
                    className={`lesson-btn ${active ? 'active' : ''}`}
                    disabled={!unlocked}
                    onClick={() => goTo(l.id)}
                    type="button"
                  >
                    <span
                      className={`lesson-status ${done ? 'done' : ''} ${!unlocked ? 'lock' : ''}`}
                    >
                      {done ? '✓' : !unlocked ? '·' : ''}
                    </span>
                    <span className="lesson-copy">
                      <strong>{l.title}</strong>
                      <span>
                        ~{l.minutes} min
                        {l.challenge ? ' · challenge' : ''}
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
            <h1>
              Lesson {lessonNumber}: {lesson.title}
            </h1>
            <p>
              {module.subtitle} · ~{lesson.minutes} min
            </p>
          </div>
          <div className="topbar-actions">
            <button className="btn btn-ghost" type="button" onClick={resetAll}>
              Reset progress
            </button>
          </div>
        </header>

        <div className="content">
          {showWelcomeHero && (
            <section className="welcome-hero">
              <p className="eyebrow">TS Refresh</p>
              <h1>Get fluent again by writing TypeScript, not watching it.</h1>
              <p>
                Absolute basics first. Then short challenges you must pass
                before moving on. About 6–8 hours to interview-ready muscle
                memory — map, filter, types, and the drills that show up live.
              </p>
            </section>
          )}

          <section className="panel">
            <h2>Learn</h2>
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

          <div className="nav-row panel">
            <button
              className="btn"
              type="button"
              disabled={!prevId}
              onClick={() => prevId && goTo(prevId)}
            >
              ← Previous
            </button>

            {!lesson.challenge && !lessonDone && (
              <button
                className="btn btn-primary"
                type="button"
                onClick={continueNext}
              >
                Mark read & continue →
              </button>
            )}

            {(lessonDone || (lesson.challenge && challengeDone)) && nextId && (
              <button
                className="btn btn-primary"
                type="button"
                onClick={continueNext}
              >
                Next lesson →
              </button>
            )}

            {lesson.challenge && !challengeDone && (
              <button className="btn" type="button" disabled>
                Pass the challenge to continue
              </button>
            )}

            {!nextId && lessonDone && (
              <button className="btn btn-primary" type="button" disabled>
                Course complete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
