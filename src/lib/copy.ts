export const WIN_LINES = [
  'Nice. Your types are behaving.',
  'Clean pass. Fluency unlocked a notch.',
  'That compiled and the tests smiled.',
  'You just taught the computer what you meant.',
  'Interview you: 1. Rusty brain: 0.',
  'Smooth. Keep that muscle memory warm.',
  'Boom — correct on purpose, not by accident.',
]

export const NUDGE_LINES = [
  'No rush. Hints exist for a reason.',
  'Stuck is part of the workout.',
  'Read the failing test — it’s trying to help.',
  'One small change often fixes the whole thing.',
  'Type it out loud. Seriously, it helps.',
]

export const FAIL_LINES = [
  'Not yet — close though. Peek at what failed.',
  'Tests said nope. Totally normal. Try again.',
  'Bug spotted! That’s the point of practice.',
  'Almost. Adjust and hit Run again.',
]

export const HINT_QUIPS = [
  'Okay, a little nudge…',
  'Here’s a breadcrumb…',
  'Last resort mode engaged…',
]

export function pick<T>(items: T[], salt = 0): T {
  const i = Math.abs(salt) % items.length
  return items[i]!
}

export function levelTitle(pct: number): string {
  if (pct >= 100) return 'TypeScript menace'
  if (pct >= 75) return 'Getting dangerous'
  if (pct >= 50) return 'Warming up fast'
  if (pct >= 25) return 'Rust shaking off'
  if (pct > 0) return 'First reps in'
  return 'Fresh start'
}
