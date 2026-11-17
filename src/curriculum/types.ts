export type TestResult = {
  description: string
  passed: boolean
  error?: string
}

export type ChallengeTest = {
  description: string
  /** Receives the values named in `exports` from the student's code. */
  run: (scope: Record<string, unknown>) => void
}

export type Challenge = {
  id: string
  title: string
  prompt: string
  starterCode: string
  /** Names that must exist after the student code runs. */
  exports: string[]
  /**
   * Expected explicit type text per export (normalized loosely).
   * Examples: "string", "number[]", "Person", "(a: number, b: number) => number"
   * For functions we mainly enforce via starter + typecheck; this is used for variables.
   */
  expectedTypes?: Record<string, string>
  /** These bindings must be declared with `const`. */
  requireConst?: string[]
  /** These type/interface names must be declared in the source. */
  requireTypeAlias?: string[]
  hints: string[]
  tests: ChallengeTest[]
}

export type Lesson = {
  id: string
  title: string
  minutes: number
  /** Short teaching content. Supports simple markdown-ish paragraphs. */
  content: string
  /** Optional tiny example shown in a read-only block. */
  example?: string
  challenge?: Challenge
}

export type Module = {
  id: string
  title: string
  subtitle: string
  lessons: Lesson[]
}

export type ProgressState = {
  completedLessonIds: string[]
  completedChallengeIds: string[]
  currentLessonId: string
  codeByChallengeId: Record<string, string>
}
