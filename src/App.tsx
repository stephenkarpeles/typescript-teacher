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

type Phase = 'learn' | 'challenge'

const SIDEBAR_KEY = 'ts-refresh-sidebar-open'

function readSidebarOpen(): boolean {
  try {
    const raw = localStorage.getItem(SIDEBAR_KEY)
    if (raw === null) return true
    return raw === '1'
  } catch {
    return true
  }
}

function App() {
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress())
  const [ready, setReady] = useState(false)
  const [contentKey, setContentKey] = useState(0)
  const [phase, setPhase] = useState<Phase>('learn')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    setSidebarOpen(readSidebarOpen())
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready) saveProgress(progress)
  }, [progress, ready])

  useEffect(() => {
    if (!ready) return
    try {
      localStorage.setItem(SIDEBAR_KEY, sidebarOpen ? '1' : '0')
    } catch {
      // ignore
    }
  }, [sidebarOpen, ready])

  function toggleSidebar() {
    setSidebarOpen((open) => !open)
  }

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

  const hasChallenge = Boolean(lesson.challenge)
  const showingChallenge = hasChallenge && phase === 'challenge'
  const showingLearn = !showingChallenge

  function goTo(lessonId: string, nextPhase: Phase = 'learn') {
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
    setPhase(nextPhase)
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
      setPhase('learn')
      setContentKey((k) => k + 1)
    }
  }

  function startChallenge() {
    setPhase('challenge')
    setContentKey((k) => k + 1)
  }

  function backFromChallenge() {
    setPhase('learn')
    setContentKey((k) => k + 1)
  }

  function handlePrevious() {
    if (showingChallenge) {
      backFromChallenge()
      return
    }
    if (prevId) goTo(prevId)
  }

  function resetAll() {
    if (!confirm('Reset all progress and saved code?')) {
      return
    }
    const fresh = defaultProgress()
    setProgress(fresh)
    saveProgress(fresh)
    setPhase('learn')
    setContentKey((k) => k + 1)
  }

  const showWelcomeHero =
    showingLearn && lesson.id === modules[0].lessons[0].id

  return (
    <div className={`app-shell ${sidebarOpen ? '' : 'sidebar-collapsed'}`.trim()}>
      <aside id="course-sidebar" className="sidebar" aria-hidden={!sidebarOpen}>
        <div className="brand">
          <div className="brand-row">
            <div className="brand-mark-block">
              <div className="brand-mark">TS Refresh</div>
              <div className="brand-tag">Learn TypeScript by writing it</div>
            </div>
            <button
              className="btn btn-ghost sidebar-hide"
              type="button"
              onClick={toggleSidebar}
              aria-label="Hide sidebar"
              title="Hide sidebar"
            >
              ← Hide
            </button>
          </div>
        </div>

        <div className="progress-block">
          <div className="progress-label">
            <span>Progress</span>
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
            <span>Challenges completed</span>
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
                    onClick={() => goTo(l.id, 'learn')}
                    type="button"
                  >
                    <span
                      className={`lesson-status ${done ? 'done' : ''} ${!unlocked ? 'lock' : ''}`}
                    >
                      {done ? '✓' : ''}
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
            <p className="top-eyebrow">
              Lesson {lessonNumber} of {allLessons.length}
              {hasChallenge
                ? showingChallenge
                  ? ' · Challenge'
                  : ' · Read first'
                : ''}
            </p>
            <h1>
              {showingChallenge && lesson.challenge
                ? lesson.challenge.title
                : lesson.title}
            </h1>
            <p>
              {module.subtitle} · ~{lesson.minutes} min
            </p>
          </div>
          <div className="topbar-actions">
            <button
              className="btn btn-ghost"
              type="button"
              onClick={toggleSidebar}
              aria-expanded={sidebarOpen}
              aria-controls="course-sidebar"
            >
              {sidebarOpen ? '← Hide sidebar' : 'Show sidebar →'}
            </button>
            <button className="btn btn-ghost" type="button" onClick={resetAll}>
              Reset progress
            </button>
          </div>
        </header>

        <div className="content" key={contentKey}>
          {showWelcomeHero && (
            <section className="welcome-hero float-in">
              <p className="eyebrow">TS Refresh</p>
              <h1>Practice TypeScript from the basics.</h1>
              <p>
                Short lessons, then coding challenges you run and test here.
                Pass each challenge to unlock the next. Use hints if you get
                stuck. Plan on about 6–8 hours to get through the course.
              </p>
            </section>
          )}

          {showingLearn && (
            <section className="panel float-in learn-panel">
              <div className="panel-kicker">
                <span className="chip chip-learn">Lesson</span>
              </div>
              <h2 className="sr-only">Lesson</h2>
              <LessonContent content={lesson.content} />
              {lesson.example && (
                <pre className="example-block" style={{ marginTop: '1rem' }}>
                  <code>{lesson.example}</code>
                </pre>
              )}
            </section>
          )}

          {showingChallenge && lesson.challenge && (
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
              disabled={!showingChallenge && !prevId}
              onClick={handlePrevious}
            >
              {showingChallenge ? 'Back to lesson' : 'Previous'}
            </button>

            {showingLearn && hasChallenge && (
              <button
                className="btn btn-primary"
                type="button"
                onClick={startChallenge}
              >
                Start challenge
              </button>
            )}

            {showingLearn && !hasChallenge && !lessonDone && (
              <button
                className="btn btn-primary"
                type="button"
                onClick={continueNext}
              >
                Continue
              </button>
            )}

            {showingChallenge && challengeDone && nextId && (
              <button
                className="btn btn-primary"
                type="button"
                onClick={continueNext}
              >
                Next lesson
              </button>
            )}

            {showingLearn && !hasChallenge && lessonDone && nextId && (
              <button
                className="btn btn-primary"
                type="button"
                onClick={continueNext}
              >
                Next lesson
              </button>
            )}

            {showingChallenge && !challengeDone && (
              <button className="btn btn-wait" type="button" disabled>
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
