import { modules } from '../curriculum/modules'
import type { ProgressState } from '../curriculum/types'

const KEY = 'ts-refresh-progress-v1'

const firstLessonId = modules[0].lessons[0].id

export function defaultProgress(): ProgressState {
  return {
    completedLessonIds: [],
    completedChallengeIds: [],
    currentLessonId: firstLessonId,
    codeByChallengeId: {},
  }
}

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultProgress()
    const parsed = JSON.parse(raw) as ProgressState
    return {
      ...defaultProgress(),
      ...parsed,
      codeByChallengeId: parsed.codeByChallengeId ?? {},
      completedLessonIds: parsed.completedLessonIds ?? [],
      completedChallengeIds: parsed.completedChallengeIds ?? [],
    }
  } catch {
    return defaultProgress()
  }
}

export function saveProgress(state: ProgressState) {
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function totalLessonCount() {
  return modules.reduce((n, m) => n + m.lessons.length, 0)
}

export function totalChallengeCount() {
  return modules.reduce(
    (n, m) => n + m.lessons.filter((l) => l.challenge).length,
    0,
  )
}
