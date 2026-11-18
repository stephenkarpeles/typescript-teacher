type TsModule = typeof import('typescript')

/**
 * Semantic typecheck in the browser without shipping full lib.d.ts.
 * Uses TypeScript's checker on a virtual file plus a tiny ambient lib
 * covering what our challenges need (arrays, Object, String, etc.).
 */
const AMBIENT_LIB = `
interface Boolean {}
interface Function {}
interface CallableFunction {}
interface NewableFunction {}
interface IArguments {}
interface Number {}
interface Object {}
interface RegExp {}
interface String {
  readonly length: number
  toLowerCase(): string
  toUpperCase(): string
  trim(): string
  includes(searchString: string, position?: number): boolean
}
interface Array<T> {
  readonly length: number
  [n: number]: T
  [Symbol.iterator](): Iterator<T>
  map<U>(callbackfn: (value: T, index: number, array: T[]) => U): U[]
  filter(predicate: (value: T, index: number, array: T[]) => unknown): T[]
  find(predicate: (value: T, index: number, array: T[]) => unknown): T | undefined
  findIndex(predicate: (value: T, index: number, array: T[]) => unknown): number
  some(predicate: (value: T, index: number, array: T[]) => unknown): boolean
  every(predicate: (value: T, index: number, array: T[]) => unknown): boolean
  reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue: T): T
  reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U
  push(...items: T[]): number
  flatMap<U>(callbackfn: (value: T, index: number, array: T[]) => U | readonly U[]): U[]
  flat<D extends number = 1>(depth?: D): any[]
  indexOf(searchElement: T, fromIndex?: number): number
  includes(searchElement: T, fromIndex?: number): boolean
  slice(start?: number, end?: number): T[]
  sort(compareFn?: (a: T, b: T) => number): T[]
  join(separator?: string): string
}
interface ReadonlyArray<T> {
  readonly length: number
  [n: number]: T
}
interface ConciseBody {}
declare function String(value?: unknown): string
declare class Set<T> {
  constructor(values?: readonly T[] | null)
  add(value: T): this
  has(value: T): boolean
  [Symbol.iterator](): Iterator<T>
}
interface ArrayConstructor {
  new <T>(...items: T[]): T[]
  isArray(arg: unknown): arg is unknown[]
  from<T>(arrayLike: ArrayLike<T> | Iterable<T>): T[]
}
declare var Array: ArrayConstructor
interface ArrayLike<T> { readonly length: number; readonly [n: number]: T }
interface Iterable<T> { [Symbol.iterator](): Iterator<T> }
interface Iterator<T> { next(): IteratorResult<T> }
interface IteratorResult<T> { done?: boolean; value: T }
interface SymbolConstructor { readonly iterator: unique symbol }
declare var Symbol: SymbolConstructor
declare var console: { log(...args: unknown[]): void }
declare var Math: {
  floor(x: number): number
  ceil(x: number): number
  min(...values: number[]): number
  max(...values: number[]): number
  abs(x: number): number
}
interface ObjectConstructor {
  keys(o: object): string[]
  values<T>(o: { [s: string]: T }): T[]
  entries<T>(o: { [s: string]: T }): [string, T][]
}
declare var Object: ObjectConstructor
type Record<K extends keyof any, T> = { [P in K]: T }
type Partial<T> = { [P in keyof T]?: T[P] }
type Pick<T, K extends keyof T> = { [P in K]: T[P] }
`

export function typecheckStudentCode(
  ts: TsModule,
  code: string,
): string | null {
  const fileName = 'student.ts'
  const libName = 'lib.d.ts'
  const files = new Map<string, string>([
    [fileName, code],
    [libName, AMBIENT_LIB],
  ])

  const options: import('typescript').CompilerOptions = {
    strict: true,
    noImplicitReturns: true,
    noFallthroughCasesInSwitch: true,
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    skipLibCheck: true,
    noEmit: true,
    lib: [],
  }

  const host: import('typescript').CompilerHost = {
    getSourceFile: (name, languageVersion) => {
      const text = files.get(name)
      if (text == null) return undefined
      return ts.createSourceFile(name, text, languageVersion, true)
    },
    writeFile: () => {},
    getCurrentDirectory: () => '/',
    getDirectories: () => [],
    fileExists: (name) => files.has(name),
    readFile: (name) => files.get(name),
    getCanonicalFileName: (name) => name,
    useCaseSensitiveFileNames: () => true,
    getNewLine: () => '\n',
    getDefaultLibFileName: () => libName,
  }

  const program = ts.createProgram([fileName, libName], options, host)
  const diagnostics = [
    ...program.getSyntacticDiagnostics(),
    ...program.getSemanticDiagnostics(),
  ].filter((d) => d.file?.fileName === fileName)

  if (diagnostics.length === 0) return null

  return diagnostics
    .map((d) => {
      const text = ts.flattenDiagnosticMessageText(d.messageText, '\n')
      if (d.file && d.start != null) {
        const { line } = d.file.getLineAndCharacterOfPosition(d.start)
        return `Line ${line + 1}: ${text}`
      }
      return text
    })
    .join('\n')
}

export function hasForbiddenEscapeHatches(code: string): string | null {
  if (/@ts-(ignore|expect-error|nocheck)\b/.test(code)) {
    return 'Do not use @ts-ignore / @ts-expect-error / @ts-nocheck in these challenges.'
  }
  if (/\bas\s+any\b/.test(code) || /\bas\s+unknown\b/.test(code)) {
    return 'Do not use `as any` or `as unknown` — add real types instead.'
  }
  return null
}
