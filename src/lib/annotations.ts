type TsModule = typeof import('typescript')

/** Returns which export names are missing an explicit type annotation in the source. */
export function missingTypeAnnotations(
  tsApi: TsModule,
  code: string,
  exportNames: string[],
): string[] {
  const sourceFile = tsApi.createSourceFile(
    'student.ts',
    code,
    tsApi.ScriptTarget.ES2020,
    true,
    tsApi.ScriptKind.TS,
  )

  const annotated = new Set<string>()

  function markIfTyped(name: string, typed: boolean) {
    if (!exportNames.includes(name)) return
    if (typed) annotated.add(name)
  }

  function functionIsFullyTyped(fn: {
    parameters: readonly { type?: unknown }[]
    type?: unknown
  }): boolean {
    const paramsTyped = fn.parameters.every((p) => p.type != null)
    const returnTyped = fn.type != null
    return paramsTyped && returnTyped
  }

  function visit(node: import('typescript').Node) {
    if (tsApi.isFunctionDeclaration(node) && node.name) {
      markIfTyped(node.name.text, functionIsFullyTyped(node))
    }

    if (tsApi.isVariableDeclaration(node) && tsApi.isIdentifier(node.name)) {
      const name = node.name.text
      if (exportNames.includes(name)) {
        if (node.type) {
          annotated.add(name)
        } else if (
          node.initializer &&
          (tsApi.isArrowFunction(node.initializer) ||
            tsApi.isFunctionExpression(node.initializer))
        ) {
          markIfTyped(name, functionIsFullyTyped(node.initializer))
        }
      }
    }

    tsApi.forEachChild(node, visit)
  }

  visit(sourceFile)

  return exportNames.filter((name) => !annotated.has(name))
}
