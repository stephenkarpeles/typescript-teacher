import { modules } from '../src/curriculum/modules'
import {
  intentionalFailures,
  solutions,
} from '../src/curriculum/solutions'
import { runChallenge } from '../src/lib/runner'

let failed = 0

function fail(msg: string) {
  failed += 1
  console.error(`FAIL: ${msg}`)
}

function ok(msg: string) {
  console.log(`ok: ${msg}`)
}

const challenges = modules.flatMap((m) =>
  m.lessons.flatMap((l) => (l.challenge ? [l.challenge] : [])),
)

async function main() {
  console.log(`Auditing ${challenges.length} challenges...\n`)

  for (const challenge of challenges) {
    const solution = solutions[challenge.id]
    if (!solution) {
      fail(`${challenge.id}: missing canonical solution`)
      continue
    }

    const pass = await runChallenge(solution, challenge)
    if (!pass.ok) {
      fail(
        `${challenge.id}: solution did not pass\n${pass.compileError ?? ''}\n${pass.runtimeError ?? ''}\n${JSON.stringify(pass.results, null, 2)}`,
      )
    } else {
      ok(`${challenge.id}: solution passes`)
    }

    const negatives = intentionalFailures[challenge.id] ?? []
    for (const neg of negatives) {
      const outcome = await runChallenge(neg.code, challenge)
      if (outcome.ok) {
        fail(`${challenge.id}: expected failure (${neg.reason}) but passed`)
      } else {
        ok(`${challenge.id}: correctly rejects — ${neg.reason}`)
      }
    }
  }

  // Every challenge id in failures/solutions should exist
  for (const id of Object.keys(solutions)) {
    if (!challenges.some((c) => c.id === id)) {
      fail(`solutions has unknown id ${id}`)
    }
  }
  for (const id of Object.keys(intentionalFailures)) {
    if (!challenges.some((c) => c.id === id)) {
      fail(`intentionalFailures has unknown id ${id}`)
    }
  }

  console.log(`\n${failed === 0 ? 'ALL AUDITS PASSED' : `${failed} FAILURE(S)`}`)
  process.exit(failed === 0 ? 0 : 1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
