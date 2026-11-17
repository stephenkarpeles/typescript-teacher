type TsModule = typeof import('typescript')

export type AnnotationIssue = {
  name: string
  kind: 'variable' | 'function' | 'undeclared'
  /** Type text found on the declaration, if any. */
  actualType?: string
  /** Expected type from the challenge, if provided. */
  expectedType?: string
  problem:
    | 'missing'
    | 'wrong-type'
    | 'missing-function-types'
    | 'undeclared'
}

function normalizeType(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

function typesCompatible(actual: string, expected: string): boolean {
  const a = normalizeType(actual)
  const e = normalizeType(expected)
  if (a === e) return true
  // Allow Array<number> vs number[]
  const arrayUnwrap = (t: string) => {
    const m = /^Array<(.+)>$/.exec(t)
    return m ? `${m[1]}[]` : t
  }
  return arrayUnwrap(a) === arrayUnwrap(e)
}

/** Finds exports that are missing or have the wrong explicit type annotation. */
export function findAnnotationIssues(
  tsApi: TsModule,
  code: string,
  exportNames: string[],
  expectedTypes: Record<string, string> = {},
): AnnotationIssue[] {
  const sourceFile = tsApi.createSourceFile(
    'student.ts',
    code,
    tsApi.ScriptTarget.ES2020,
    true,
    tsApi.ScriptKind.TS,
  )

  type DeclInfo = {
    kind: 'variable' | 'function'
    typeText?: string
    fullyTypedFunction: boolean
  }

  const decls = new Map<string, DeclInfo>()

  function functionIsFullyTyped(fn: {
    parameters: readonly { type?: unknown }[]
    type?: unknown
  }): boolean {
    return fn.parameters.every((p) => p.type != null) && fn.type != null
  }

  function visit(node: import('typescript').Node) {
    if (tsApi.isFunctionDeclaration(node) && node.name) {
      const name = node.name.text
      if (exportNames.includes(name)) {
        decls.set(name, {
          kind: 'function',
          typeText: node.type?.getText(sourceFile),
          fullyTypedFunction: functionIsFullyTyped(node),
        })
      }
    }

    if (tsApi.isVariableDeclaration(node) && tsApi.isIdentifier(node.name)) {
      const name = node.name.text
      if (!exportNames.includes(name)) {
        // skip
      } else if (
        node.initializer &&
        (tsApi.isArrowFunction(node.initializer) ||
          tsApi.isFunctionExpression(node.initializer))
      ) {
        const fn = node.initializer
        decls.set(name, {
          kind: 'function',
          typeText: node.type?.getText(sourceFile) ?? fn.type?.getText(sourceFile),
          fullyTypedFunction: !!node.type || functionIsFullyTyped(fn),
        })
      } else {
        decls.set(name, {
          kind: 'variable',
          typeText: node.type?.getText(sourceFile),
          fullyTypedFunction: false,
        })
      }
    }

    tsApi.forEachChild(node, visit)
  }

  visit(sourceFile)

  const issues: AnnotationIssue[] = []

  for (const name of exportNames) {
    const expectedType = expectedTypes[name]
    const decl = decls.get(name)

    if (!decl) {
      issues.push({
        name,
        kind: 'undeclared',
        expectedType,
        problem: 'undeclared',
      })
      continue
    }

    if (decl.kind === 'function') {
      if (!decl.fullyTypedFunction) {
        issues.push({
          name,
          kind: 'function',
          actualType: decl.typeText,
          expectedType,
          problem: 'missing-function-types',
        })
      }
      continue
    }

    if (!decl.typeText) {
      issues.push({
        name,
        kind: 'variable',
        expectedType,
        problem: 'missing',
      })
      continue
    }

    if (expectedType && !typesCompatible(decl.typeText, expectedType)) {
      issues.push({
        name,
        kind: 'variable',
        actualType: decl.typeText,
        expectedType,
        problem: 'wrong-type',
      })
    }
  }

  return issues
}

export function annotationErrorMessage(issue: AnnotationIssue): string {
  if (issue.problem === 'undeclared') {
    return `Could not find a declaration named \`${issue.name}\`.`
  }

  if (issue.problem === 'missing-function-types') {
    return `Add explicit parameter types and a return type on \`${issue.name}\`.`
  }

  if (issue.problem === 'wrong-type' && issue.expectedType) {
    return `\`${issue.name}\` is annotated as \`${issue.actualType}\`, but it should be \`${issue.expectedType}\`.`
  }

  if (issue.expectedType) {
    return `Add a type annotation after the name: \`let ${issue.name}: ${issue.expectedType} = ...\`.`
  }

  return `Add an explicit type after the name, e.g. \`let ${issue.name}: <type> = ...\`.`
}

export function findMissingConsts(
  tsApi: TsModule,
  code: string,
  names: string[],
): string[] {
  if (names.length === 0) return []
  const sourceFile = tsApi.createSourceFile(
    'student.ts',
    code,
    tsApi.ScriptTarget.ES2020,
    true,
    tsApi.ScriptKind.TS,
  )
  const constNames = new Set<string>()

  function visit(node: import('typescript').Node) {
    if (tsApi.isVariableStatement(node)) {
      const isConst = node.declarationList.flags & tsApi.NodeFlags.Const
      if (isConst) {
        for (const decl of node.declarationList.declarations) {
          if (tsApi.isIdentifier(decl.name)) constNames.add(decl.name.text)
        }
      }
    }
    tsApi.forEachChild(node, visit)
  }

  visit(sourceFile)
  return names.filter((n) => !constNames.has(n))
}

export function findMissingTypeAliases(
  tsApi: TsModule,
  code: string,
  names: string[],
): string[] {
  if (names.length === 0) return []
  const sourceFile = tsApi.createSourceFile(
    'student.ts',
    code,
    tsApi.ScriptTarget.ES2020,
    true,
    tsApi.ScriptKind.TS,
  )
  const found = new Set<string>()

  function visit(node: import('typescript').Node) {
    if (tsApi.isTypeAliasDeclaration(node)) found.add(node.name.text)
    if (tsApi.isInterfaceDeclaration(node)) found.add(node.name.text)
    tsApi.forEachChild(node, visit)
  }

  visit(sourceFile)
  return names.filter((n) => !found.has(n))
}
