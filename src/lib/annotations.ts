type TsModule = typeof import('typescript')

export type AnnotationIssue = {
  name: string
  kind: 'variable' | 'function' | 'undeclared'
  /** Best-guess type for the hint example, when we can tell from the initializer. */
  suggestedType?: string
}

/** Finds exports that are missing an explicit TypeScript type annotation. */
export function findAnnotationIssues(
  tsApi: TsModule,
  code: string,
  exportNames: string[],
): AnnotationIssue[] {
  const sourceFile = tsApi.createSourceFile(
    'student.ts',
    code,
    tsApi.ScriptTarget.ES2020,
    true,
    tsApi.ScriptKind.TS,
  )

  const annotated = new Set<string>()
  const kinds = new Map<string, 'variable' | 'function'>()
  const suggested = new Map<string, string>()

  function markTyped(name: string) {
    if (exportNames.includes(name)) annotated.add(name)
  }

  function functionIsFullyTyped(fn: {
    parameters: readonly { type?: unknown }[]
    type?: unknown
  }): boolean {
    return fn.parameters.every((p) => p.type != null) && fn.type != null
  }

  function suggestFromInitializer(
    ts: TsModule,
    init: import('typescript').Expression | undefined,
  ): string | undefined {
    if (!init) return undefined
    if (ts.isStringLiteral(init) || ts.isNoSubstitutionTemplateLiteral(init)) {
      return 'string'
    }
    if (ts.isNumericLiteral(init)) return 'number'
    if (
      init.kind === ts.SyntaxKind.TrueKeyword ||
      init.kind === ts.SyntaxKind.FalseKeyword
    ) {
      return 'boolean'
    }
    if (ts.isArrayLiteralExpression(init)) {
      const first = init.elements[0]
      if (!first) return undefined
      if (ts.isStringLiteral(first)) return 'string[]'
      if (ts.isNumericLiteral(first)) return 'number[]'
      return undefined
    }
    return undefined
  }

  function visit(node: import('typescript').Node) {
    if (tsApi.isFunctionDeclaration(node) && node.name) {
      const name = node.name.text
      if (exportNames.includes(name)) {
        kinds.set(name, 'function')
        if (functionIsFullyTyped(node)) markTyped(name)
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
        kinds.set(name, 'function')
        if (functionIsFullyTyped(node.initializer) || node.type) markTyped(name)
      } else {
        kinds.set(name, 'variable')
        const guess = suggestFromInitializer(tsApi, node.initializer)
        if (guess) suggested.set(name, guess)
        if (node.type) markTyped(name)
      }
    }

    tsApi.forEachChild(node, visit)
  }

  visit(sourceFile)

  return exportNames
    .filter((name) => !annotated.has(name))
    .map((name) => ({
      name,
      kind: kinds.get(name) ?? 'undeclared',
      suggestedType: suggested.get(name),
    }))
}

export function annotationErrorMessage(issue: AnnotationIssue): string {
  if (issue.kind === 'function') {
    return `Add explicit parameter types and a return type on \`${issue.name}\`.`
  }

  if (issue.suggestedType) {
    return `Add a type annotation after the name, e.g. \`let ${issue.name}: ${issue.suggestedType} = ...\`.`
  }

  return `Add an explicit type after the name, e.g. \`let ${issue.name}: <type> = ...\`.`
}
