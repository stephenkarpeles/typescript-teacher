import type { Challenge, TestResult } from '../curriculum/types'

export type RunOutcome = {
  ok: boolean
  compileError?: string
  runtimeError?: string
  results: TestResult[]
}

export async function runChallenge(
  code: string,
  challenge: Challenge,
): Promise<RunOutcome> {
  const ts = await import('typescript')
  let js: string
  try {
    const output = ts.transpileModule(code, {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2020,
        strict: true,
      },
      reportDiagnostics: true,
    })

    const diags = (output.diagnostics ?? []).filter(
      (d) => d.category === ts.DiagnosticCategory.Error,
    )
    if (diags.length > 0) {
      const msg = diags
        .map((d) => {
          const text = ts.flattenDiagnosticMessageText(d.messageText, '\n')
          if (d.file && d.start != null) {
            const { line } = d.file.getLineAndCharacterOfPosition(d.start)
            return `Line ${line + 1}: ${text}`
          }
          return text
        })
        .join('\n')
      return { ok: false, compileError: msg, results: [] }
    }

    js = output.outputText
  } catch (err) {
    return {
      ok: false,
      compileError: err instanceof Error ? err.message : String(err),
      results: [],
    }
  }

  // Strip export keywords so we can capture bindings via return.
  const cleaned = js
    .replace(/\bexport\s+default\s+/g, '')
    .replace(/\bexport\s+/g, '')

  const exportList = challenge.exports.map((name) => `${name}`).join(', ')
  const wrapped = `"use strict";\n${cleaned}\nreturn { ${exportList} };`

  let scope: Record<string, unknown>
  try {
    // Student code runs in a Function sandbox (no DOM access by default beyond what we pass).
    const factory = new Function(wrapped)
    scope = factory() as Record<string, unknown>
  } catch (err) {
    return {
      ok: false,
      runtimeError: err instanceof Error ? err.message : String(err),
      results: [],
    }
  }

  for (const name of challenge.exports) {
    if (scope[name] === undefined) {
      return {
        ok: false,
        runtimeError: `Missing \`${name}\`. Make sure you declared it with that exact name.`,
        results: [],
      }
    }
  }

  const results: TestResult[] = challenge.tests.map((test) => {
    try {
      test.run(scope)
      return { description: test.description, passed: true }
    } catch (err) {
      return {
        description: test.description,
        passed: false,
        error: err instanceof Error ? err.message : String(err),
      }
    }
  })

  return {
    ok: results.every((r) => r.passed),
    results,
  }
}
