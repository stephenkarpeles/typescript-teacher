import type { Challenge, TestResult } from '../curriculum/types'
import {
  annotationErrorMessage,
  findAnnotationIssues,
  findMissingConsts,
  findMissingTypeAliases,
} from './annotations'
import { hasForbiddenEscapeHatches, typecheckStudentCode } from './typecheck'

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

  const escapeHatch = hasForbiddenEscapeHatches(code)
  if (escapeHatch) {
    return { ok: false, compileError: escapeHatch, results: [] }
  }

  const typeError = typecheckStudentCode(ts, code)
  if (typeError) {
    return { ok: false, compileError: typeError, results: [] }
  }

  let js: string
  try {
    const output = ts.transpileModule(code, {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2020,
        strict: true,
      },
    })
    js = output.outputText
  } catch (err) {
    return {
      ok: false,
      compileError: err instanceof Error ? err.message : String(err),
      results: [],
    }
  }

  const cleaned = js
    .replace(/\bexport\s+default\s+/g, '')
    .replace(/\bexport\s+/g, '')

  const exportList = challenge.exports.map((name) => `${name}`).join(', ')
  const wrapped = `"use strict";\n${cleaned}\nreturn { ${exportList} };`

  let scope: Record<string, unknown>
  try {
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
    if (!(name in scope)) {
      return {
        ok: false,
        runtimeError: `Missing \`${name}\`. Make sure you declared it with that exact name.`,
        results: [],
      }
    }
    // false / 0 / '' are valid. Uninitialized bindings are undefined.
    // Function exports are always function objects when declared.
    if (scope[name] === undefined) {
      return {
        ok: false,
        runtimeError: `\`${name}\` is declared but has no value yet. Initialize it.`,
        results: [],
      }
    }
  }

  const results: TestResult[] = []

  const missingAliases = findMissingTypeAliases(
    ts,
    code,
    challenge.requireTypeAlias ?? [],
  )
  for (const alias of missingAliases) {
    results.push({
      description: `defines type/interface \`${alias}\``,
      passed: false,
      error: `Declare \`type ${alias} = { ... }\` (or an interface with that name) before using it.`,
    })
  }
  for (const alias of challenge.requireTypeAlias ?? []) {
    if (!missingAliases.includes(alias)) {
      results.push({
        description: `defines type/interface \`${alias}\``,
        passed: true,
      })
    }
  }

  const missingConsts = findMissingConsts(ts, code, challenge.requireConst ?? [])
  for (const name of missingConsts) {
    results.push({
      description: `${name} is declared with const`,
      passed: false,
      error: `Use \`const\` for \`${name}\` (it should not be reassigned).`,
    })
  }
  for (const name of challenge.requireConst ?? []) {
    if (!missingConsts.includes(name)) {
      results.push({
        description: `${name} is declared with const`,
        passed: true,
      })
    }
  }

  const issues = findAnnotationIssues(
    ts,
    code,
    challenge.exports,
    challenge.expectedTypes ?? {},
  )
  const issueByName = new Map(issues.map((i) => [i.name, i]))

  for (const name of challenge.exports) {
    const issue = issueByName.get(name)
    if (!issue) {
      results.push({
        description: `${name} has the correct explicit type`,
        passed: true,
      })
    } else {
      results.push({
        description: `${name} has the correct explicit type`,
        passed: false,
        error: annotationErrorMessage(issue),
      })
    }
  }

  for (const test of challenge.tests) {
    try {
      test.run(scope)
      results.push({ description: test.description, passed: true })
    } catch (err) {
      results.push({
        description: test.description,
        passed: false,
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }

  return {
    ok: results.every((r) => r.passed),
    results,
  }
}
