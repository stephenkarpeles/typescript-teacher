import type { Module } from './types'

function eq(actual: unknown, expected: unknown, label?: string) {
  const same =
    actual === expected ||
    (Number.isNaN(actual as number) && Number.isNaN(expected as number)) ||
    JSON.stringify(actual) === JSON.stringify(expected)
  if (!same) {
    throw new Error(
      `${label ? label + ': ' : ''}expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
    )
  }
}

export const modules: Module[] = [
  {
    id: 'welcome',
    title: 'Module 1 — What is TypeScript?',
    subtitle: 'Orientation. Zero assumptions.',
    lessons: [
      {
        id: 'welcome-what',
        title: 'JavaScript… with seatbelts',
        minutes: 8,
        content: `You used to know JavaScript. TypeScript is still JavaScript — it runs the same way in the browser and Node.

The difference: you add **types**. Types describe what kind of value something is supposed to be (a string, a number, an array of users, and so on).

Why use types?
- Catch bugs before you run the code
- Better autocomplete while you type
- Coding interviews and most codebases expect TypeScript

How this course works:
1. Read a short lesson
2. Write TypeScript in the editor
3. Run tests — you must pass before the next lesson unlocks
4. Use **Get hint** if you are stuck

We start from the absolute basics.`,
        example: `// Plain JavaScript — easy to mess up later
let name = "Alex"
name = 42  // oops, still allowed in JS

// TypeScript — you declare the shape
let name: string = "Alex"
// name = 42  // TypeScript error: number is not a string`,
      },
      {
        id: 'welcome-first-challenge',
        title: 'Challenge: say hello with a type',
        minutes: 10,
        content: `Your first hands-on task.

Create a **string** variable named \`greeting\` with the exact value \`"Hello, TypeScript"\`.

Then create a **number** variable named \`year\` with the value \`2026\`.

You write types after a colon: \`let x: string = "hi"\`.`,
        challenge: {
          id: 'ch-hello',
          title: 'Hello variables',
          prompt:
            'Declare `greeting` with an explicit `string` type equal to "Hello, TypeScript", and `year` with an explicit `number` type equal to 2026. (Not plain JavaScript — type annotations required.)',
          starterCode: `// Write your code below.

`,
          exports: ['greeting', 'year'],
          hints: [
            'Put the type after the variable name with a colon, like `name: type`.',
            '`greeting` needs type `string`. `year` needs type `number` — and 2026 should not be in quotes.',
            'Match the text exactly for greeting, including the comma and space.',
          ],
          tests: [
            {
              description: 'greeting equals "Hello, TypeScript"',
              run: (s) => eq(s.greeting, 'Hello, TypeScript', 'greeting'),
            },
            {
              description: 'year equals 2026 (number, not string)',
              run: (s) => eq(s.year, 2026, 'year'),
            },
          ],
        },
      },
    ],
  },
  {
    id: 'primitives',
    title: 'Module 2 — Primitive types',
    subtitle: 'string, number, boolean, and annotations',
    lessons: [
      {
        id: 'prim-basics',
        title: 'The three everyday types',
        minutes: 10,
        content: `TypeScript's most common primitives:

- \`string\` — text: \`"hello"\`
- \`number\` — integers and decimals: \`3\`, \`3.14\` (no separate int/float)
- \`boolean\` — \`true\` or \`false\`

You can let TypeScript **infer** the type:
\`let age = 30\` → TypeScript knows it is a number

Or you can **annotate** explicitly:
\`let age: number = 30\`

In interviews and learning, annotations make your intent obvious. We will use them a lot.`,
        example: `let title: string = "Engineer"
let level: number = 3
let hired: boolean = true`,
      },
      {
        id: 'prim-const',
        title: 'let vs const',
        minutes: 8,
        content: `\`let\` — you can reassign later.
\`const\` — you cannot reassign the variable itself (preferred when the value should not change).

Both can have type annotations:

\`const pi: number = 3.14\`
\`let count: number = 0\`
\`count = 1\` // ok with let`,
        challenge: {
          id: 'ch-primitives',
          title: 'Annotate three values',
          prompt:
            'Create const productName: string = "Widget", let inStock: boolean = true, and let quantity: number = 12.',
          starterCode: `// Write your code below.

`,
          exports: ['productName', 'inStock', 'quantity'],
          hints: [
            'One of these should use `const` (it never changes). The other two should use `let`.',
            'Annotate each one: string, boolean, and number.',
            'Values: "Widget", true, and 12.',
          ],
          tests: [
            {
              description: 'productName is "Widget"',
              run: (s) => eq(s.productName, 'Widget'),
            },
            {
              description: 'inStock is true',
              run: (s) => eq(s.inStock, true),
            },
            {
              description: 'quantity is 12',
              run: (s) => eq(s.quantity, 12),
            },
          ],
        },
      },
      {
        id: 'prim-union-preview',
        title: 'Challenge: type a status flag',
        minutes: 10,
        content: `Booleans are great for yes/no. Create a boolean \`isActive\` set to \`false\`, and a string \`status\` set to \`"paused"\`.`,
        challenge: {
          id: 'ch-status',
          title: 'Active flag + status',
          prompt: 'Declare isActive: boolean = false and status: string = "paused".',
          starterCode: ``,
          exports: ['isActive', 'status'],
          hints: [
            '`isActive` is a yes/no value. `status` is text.',
            'Use `boolean` and `string` annotations. `false` has no quotes; `"paused"` does.',
          ],
          tests: [
            { description: 'isActive is false', run: (s) => eq(s.isActive, false) },
            { description: 'status is "paused"', run: (s) => eq(s.status, 'paused') },
          ],
        },
      },
    ],
  },
  {
    id: 'arrays',
    title: 'Module 3 — Arrays',
    subtitle: 'Lists of values with one element type',
    lessons: [
      {
        id: 'arr-intro',
        title: 'Typed arrays',
        minutes: 10,
        content: `An array is a list. In TypeScript you say what each element is.

Two equivalent spellings:
- \`number[]\` — array of numbers
- \`Array<number>\` — same thing (generic form)

Examples:
\`const scores: number[] = [90, 85, 100]\`
\`const tags: string[] = ["ts", "react"]\`

Empty array often needs a type, or TypeScript thinks \`any[]\`:
\`const ids: number[] = []\``,
        example: `const names: string[] = ["Ada", "Lin"]
names.push("Grace")
// names.push(99) // error: not a string`,
      },
      {
        id: 'arr-challenge-build',
        title: 'Challenge: build two arrays',
        minutes: 12,
        content: `Create:
- \`temps\` — a \`number[]\` with values \`72, 68, 75\`
- \`cities\` — a \`string[]\` with \`"Austin"\`, \`"Denver"\``,
        challenge: {
          id: 'ch-arrays',
          title: 'temps and cities',
          prompt: 'Create temps: number[] = [72, 68, 75] and cities: string[] = ["Austin", "Denver"].',
          starterCode: ``,
          exports: ['temps', 'cities'],
          hints: [
            'Array types look like `number[]` or `string[]`.',
            'Fill `temps` with three numbers and `cities` with two city names from the lesson.',
            'Order matters for the tests.',
          ],
          tests: [
            { description: 'temps matches', run: (s) => eq(s.temps, [72, 68, 75]) },
            {
              description: 'cities matches',
              run: (s) => eq(s.cities, ['Austin', 'Denver']),
            },
          ],
        },
      },
    ],
  },
  {
    id: 'objects',
    title: 'Module 4 — Objects & type aliases',
    subtitle: 'Describe the shape of data',
    lessons: [
      {
        id: 'obj-intro',
        title: 'Object types',
        minutes: 12,
        content: `Real apps pass around objects: users, products, API responses.

You can annotate an object inline:

\`\`\`
const user: { name: string; age: number } = {
  name: "Sam",
  age: 28,
}
\`\`\`

For reuse, create a **type alias**:

\`\`\`
type User = {
  name: string
  age: number
}

const user: User = { name: "Sam", age: 28 }
\`\`\`

Property names and types must match. Extra or missing required properties are errors.`,
        example: `type Product = {
  id: number
  title: string
  price: number
}

const item: Product = {
  id: 1,
  title: "Mug",
  price: 12,
}`,
      },
      {
        id: 'obj-challenge',
        title: 'Challenge: type a user',
        minutes: 15,
        content: `1. Define a type alias \`Person\` with \`name: string\` and \`score: number\`.
2. Create a constant \`player\` of type \`Person\` with name \`"Riley"\` and score \`42\`.`,
        challenge: {
          id: 'ch-person',
          title: 'Person type + player',
          prompt:
            'Define type Person = { name: string; score: number } and const player: Person = { name: "Riley", score: 42 }.',
          starterCode: `// Write your code below.

`,
          exports: ['player'],
          hints: [
            'First define a `type` alias with two fields, then create a value that uses it.',
            'The fields are `name` (string) and `score` (number).',
            'Create `player` with name "Riley" and score 42, typed as `Person`.',
          ],
          tests: [
            {
              description: 'player.name is Riley',
              run: (s) => {
                const player = s.player as { name: string; score: number }
                eq(player?.name, 'Riley')
              },
            },
            {
              description: 'player.score is 42',
              run: (s) => {
                const player = s.player as { name: string; score: number }
                eq(player?.score, 42)
              },
            },
          ],
        },
      },
    ],
  },
  {
    id: 'functions',
    title: 'Module 5 — Functions',
    subtitle: 'Parameter types and return types',
    lessons: [
      {
        id: 'fn-intro',
        title: 'Typing functions',
        minutes: 12,
        content: `Functions are where interviews live. Annotate parameters and the return type:

\`\`\`
function add(a: number, b: number): number {
  return a + b
}
\`\`\`

Arrow form:

\`\`\`
const add = (a: number, b: number): number => a + b
\`\`\`

If you return the wrong type, TypeScript complains. That is the point.`,
        example: `function greet(name: string): string {
  return "Hi, " + name
}

greet("Dev") // "Hi, Dev"`,
      },
      {
        id: 'fn-challenge-add',
        title: 'Challenge: multiply',
        minutes: 12,
        content: `Write a function \`multiply\` that takes two \`number\` parameters and returns their product as a \`number\`.`,
        challenge: {
          id: 'ch-multiply',
          title: 'multiply(a, b)',
          prompt: 'Implement function multiply(a: number, b: number): number',
          starterCode: `function multiply(a: number, b: number): number {

}

`,
          exports: ['multiply'],
          hints: [
            'The body only needs to return the product of the two parameters.',
            'Use `*` and make sure the function name is exactly `multiply`.',
          ],
          tests: [
            {
              description: 'multiply(3, 4) === 12',
              run: (s) => {
                const multiply = s.multiply as (a: number, b: number) => number
                eq(multiply(3, 4), 12)
              },
            },
            {
              description: 'multiply(-2, 5) === -10',
              run: (s) => {
                const multiply = s.multiply as (a: number, b: number) => number
                eq(multiply(-2, 5), -10)
              },
            },
          ],
        },
      },
      {
        id: 'fn-challenge-format',
        title: 'Challenge: format label',
        minutes: 12,
        content: `Write \`formatLabel(name: string, count: number): string\` that returns a string like \`"Task (3)"\` when name is \`"Task"\` and count is \`3\`.

Use template literals: \`\` \`\${name} (\${count})\` \`\``,
        challenge: {
          id: 'ch-format',
          title: 'formatLabel',
          prompt: 'Return `${name} (${count})` from formatLabel.',
          starterCode: `function formatLabel(name: string, count: number): string {
  
}

`,
          exports: ['formatLabel'],
          hints: [
            'Build one string that includes both the name and the count.',
            'A template literal helps: backticks with `${...}` inside.',
            'There should be a space before the opening parenthesis: "Task (3)".',
          ],
          tests: [
            {
              description: 'formatLabel("Task", 3)',
              run: (s) => {
                const formatLabel = s.formatLabel as (n: string, c: number) => string
                eq(formatLabel('Task', 3), 'Task (3)')
              },
            },
            {
              description: 'formatLabel("Item", 0)',
              run: (s) => {
                const formatLabel = s.formatLabel as (n: string, c: number) => string
                eq(formatLabel('Item', 0), 'Item (0)')
              },
            },
          ],
        },
      },
    ],
  },
  {
    id: 'unions-optional',
    title: 'Module 6 — Unions & optionals',
    subtitle: 'Values that can be more than one shape',
    lessons: [
      {
        id: 'union-intro',
        title: 'Union types',
        minutes: 12,
        content: `A **union** means "one of these types":

\`type Id = string | number\`
\`let id: Id = 7\`
\`id = "abc"\` // also ok

Common interview pattern — status strings:

\`type Status = "idle" | "loading" | "error"\`

Only those three string literals are allowed.`,
        example: `type Status = "idle" | "loading" | "done"

function setStatus(s: Status) {
  // ...
}

setStatus("loading")
// setStatus("banana") // error`,
      },
      {
        id: 'optional-intro',
        title: 'Optional properties',
        minutes: 10,
        content: `Put \`?\` after a property name to make it optional:

\`\`\`
type User = {
  name: string
  nickname?: string
}
\`\`\`

\`nickname\` may be missing. When you read it, it might be \`string | undefined\`.`,
        challenge: {
          id: 'ch-union-status',
          title: 'Status union helper',
          prompt:
            'Create type LoadState = "idle" | "loading" | "error". Then write function isLoading(state: LoadState): boolean that returns true only for "loading".',
          starterCode: `type LoadState = "idle" | "loading" | "error"

function isLoading(state: LoadState): boolean {

}

`,
          exports: ['isLoading'],
          hints: [
            'You only need to check whether `state` equals one specific string.',
            'A comparison like `===` already returns a boolean — you can return that directly.',
          ],
          tests: [
            {
              description: 'isLoading("loading") is true',
              run: (s) => {
                const isLoading = s.isLoading as (x: string) => boolean
                eq(isLoading('loading'), true)
              },
            },
            {
              description: 'isLoading("idle") is false',
              run: (s) => {
                const isLoading = s.isLoading as (x: string) => boolean
                eq(isLoading('idle'), false)
              },
            },
            {
              description: 'isLoading("error") is false',
              run: (s) => {
                const isLoading = s.isLoading as (x: string) => boolean
                eq(isLoading('error'), false)
              },
            },
          ],
        },
      },
    ],
  },
  {
    id: 'map-filter',
    title: 'Module 7 — map & filter',
    subtitle: 'The array tools every coding test expects',
    lessons: [
      {
        id: 'map-intro',
        title: 'map — transform every item',
        minutes: 15,
        content: `\`map\` builds a **new array** by running a function on each element.

\`\`\`
const nums = [1, 2, 3]
const doubled = nums.map((n) => n * 2) // [2, 4, 6]
\`\`\`

In TypeScript, annotate the callback parameter when inference is unclear:

\`nums.map((n: number): number => n * 2)\`

You almost never mutate the original array in interview solutions — return a new one.`,
        example: `const prices = [10, 20]
const withTax = prices.map((p: number) => p * 1.1)`,
      },
      {
        id: 'map-challenge',
        title: 'Challenge: doubleAll',
        minutes: 12,
        content: `Write \`doubleAll(nums: number[]): number[]\` that returns each number doubled.`,
        challenge: {
          id: 'ch-double-all',
          title: 'doubleAll',
          prompt: 'Use map to return nums with each value * 2.',
          starterCode: `function doubleAll(nums: number[]): number[] {
  
}

`,
          exports: ['doubleAll'],
          hints: [
            'Use an array method that transforms every element into a new array.',
            'In the callback, multiply each number by 2.',
          ],
          tests: [
            {
              description: 'doubleAll([1, 2, 3])',
              run: (s) => {
                const doubleAll = s.doubleAll as (n: number[]) => number[]
                eq(doubleAll([1, 2, 3]), [2, 4, 6])
              },
            },
            {
              description: 'doubleAll([])',
              run: (s) => {
                const doubleAll = s.doubleAll as (n: number[]) => number[]
                eq(doubleAll([]), [])
              },
            },
          ],
        },
      },
      {
        id: 'filter-intro',
        title: 'filter — keep some items',
        minutes: 15,
        content: `\`filter\` returns a **new array** with only the items that pass a test.

\`\`\`
const nums = [1, 2, 3, 4]
const evens = nums.filter((n) => n % 2 === 0) // [2, 4]
\`\`\`

Callback returns a boolean. \`true\` keeps the item.`,
        challenge: {
          id: 'ch-evens',
          title: 'onlyEvens',
          prompt: 'Write onlyEvens(nums: number[]): number[] using filter.',
          starterCode: `function onlyEvens(nums: number[]): number[] {
  
}

`,
          exports: ['onlyEvens'],
          hints: [
            'Use an array method that keeps only some elements.',
            'Keep a number when dividing by 2 leaves no remainder (`%`).',
          ],
          tests: [
            {
              description: 'onlyEvens([1,2,3,4,5])',
              run: (s) => {
                const onlyEvens = s.onlyEvens as (n: number[]) => number[]
                eq(onlyEvens([1, 2, 3, 4, 5]), [2, 4])
              },
            },
            {
              description: 'onlyEvens([1, 3])',
              run: (s) => {
                const onlyEvens = s.onlyEvens as (n: number[]) => number[]
                eq(onlyEvens([1, 3]), [])
              },
            },
          ],
        },
      },
      {
        id: 'map-filter-combo',
        title: 'Challenge: filter then map (classic)',
        minutes: 18,
        content: `Interview classic: chain \`filter\` and \`map\`.

Write \`activeNames(users)\` where each user is \`{ name: string; active: boolean }\`.
Return the names of users where \`active\` is \`true\`.`,
        challenge: {
          id: 'ch-active-names',
          title: 'activeNames',
          prompt: 'Filter active users, then map to their name strings.',
          starterCode: `type User = { name: string; active: boolean }

function activeNames(users: User[]): string[] {
  
}

`,
          exports: ['activeNames'],
          hints: [
            'You need two steps: keep only active users, then get their names.',
            'Chain `filter` and then `map` on the result.',
            'Filter with `u.active`, map with `u.name`.',
          ],
          tests: [
            {
              description: 'returns only active names',
              run: (s) => {
                const activeNames = s.activeNames as (
                  u: { name: string; active: boolean }[],
                ) => string[]
                eq(
                  activeNames([
                    { name: 'A', active: true },
                    { name: 'B', active: false },
                    { name: 'C', active: true },
                  ]),
                  ['A', 'C'],
                )
              },
            },
            {
              description: 'empty when none active',
              run: (s) => {
                const activeNames = s.activeNames as (
                  u: { name: string; active: boolean }[],
                ) => string[]
                eq(activeNames([{ name: 'X', active: false }]), [])
              },
            },
          ],
        },
      },
    ],
  },
  {
    id: 'find-reduce',
    title: 'Module 8 — find, some, reduce',
    subtitle: 'Search and aggregate — coding-test staples',
    lessons: [
      {
        id: 'find-intro',
        title: 'find, some, every',
        minutes: 12,
        content: `- \`find\` — first match, or \`undefined\`
- \`some\` — \`true\` if **any** item passes
- \`every\` — \`true\` if **all** items pass

\`\`\`
const users = [{ id: 1 }, { id: 2 }]
users.find((u) => u.id === 2) // { id: 2 }
users.some((u) => u.id === 9) // false
\`\`\``,
        challenge: {
          id: 'ch-find-by-id',
          title: 'findById',
          prompt:
            'Write findById(items: { id: number; label: string }[], id: number) that returns the matching item or undefined.',
          starterCode: `type Item = { id: number; label: string }

function findById(items: Item[], id: number): Item | undefined {
  
}

`,
          exports: ['findById'],
          hints: [
            'Look for an array method that returns the first matching element (or undefined).',
            'Compare each item's `id` to the `id` argument.',
          ],
          tests: [
            {
              description: 'finds the item',
              run: (s) => {
                const findById = s.findById as (
                  items: { id: number; label: string }[],
                  id: number,
                ) => { id: number; label: string } | undefined
                eq(findById([{ id: 1, label: 'a' }, { id: 2, label: 'b' }], 2), {
                  id: 2,
                  label: 'b',
                })
              },
            },
            {
              description: 'undefined when missing',
              run: (s) => {
                const findById = s.findById as (
                  items: { id: number; label: string }[],
                  id: number,
                ) => { id: number; label: string } | undefined
                eq(findById([{ id: 1, label: 'a' }], 9), undefined)
              },
            },
          ],
        },
      },
      {
        id: 'reduce-intro',
        title: 'reduce — fold into one value',
        minutes: 15,
        content: `\`reduce\` turns an array into a single value (sum, object, string…).

\`\`\`
const sum = [1, 2, 3].reduce((total, n) => total + n, 0)
// 6
\`\`\`

Arguments: \`(accumulator, currentValue) => nextAccumulator\`, plus an **initial value**.

Interview tip: start with \`0\` for sums, \`{}\` for grouping, \`[]\` for building arrays.`,
        challenge: {
          id: 'ch-sum',
          title: 'sumNumbers',
          prompt: 'Write sumNumbers(nums: number[]): number using reduce. Empty array → 0.',
          starterCode: `function sumNumbers(nums: number[]): number {
  
}

`,
          exports: ['sumNumbers'],
          hints: [
            'Use `reduce` to fold the array into one number.',
            'Start the accumulator at 0 so an empty array still works.',
          ],
          tests: [
            {
              description: 'sumNumbers([1,2,3]) === 6',
              run: (s) => {
                const sumNumbers = s.sumNumbers as (n: number[]) => number
                eq(sumNumbers([1, 2, 3]), 6)
              },
            },
            {
              description: 'sumNumbers([]) === 0',
              run: (s) => {
                const sumNumbers = s.sumNumbers as (n: number[]) => number
                eq(sumNumbers([]), 0)
              },
            },
          ],
        },
      },
    ],
  },
  {
    id: 'narrowing',
    title: 'Module 9 — Narrowing',
    subtitle: 'Prove to TypeScript what a value is',
    lessons: [
      {
        id: 'narrow-intro',
        title: 'typeof checks',
        minutes: 12,
        content: `When a value is a union, you **narrow** it before using it as one branch.

\`\`\`
function len(value: string | string[]): number {
  if (typeof value === "string") {
    return value.length // string here
  }
  return value.length // string[] here
}
\`\`\`

\`typeof\` works for primitives. For objects/arrays you may use \`Array.isArray\`.`,
        challenge: {
          id: 'ch-to-string',
          title: 'asString',
          prompt:
            'Write asString(value: string | number): string — if number, convert with String(value); if string, return as-is.',
          starterCode: `function asString(value: string | number): string {
  
}

`,
          exports: ['asString'],
          hints: [
            'Narrow with `typeof` so you know whether you have a number or a string.',
            'If it is a number, convert it to a string (for example with `String(...)`).',
            'If it is already a string, return it unchanged.',
          ],
          tests: [
            {
              description: 'asString("hi")',
              run: (s) => {
                const asString = s.asString as (v: string | number) => string
                eq(asString('hi'), 'hi')
              },
            },
            {
              description: 'asString(42)',
              run: (s) => {
                const asString = s.asString as (v: string | number) => string
                eq(asString(42), '42')
              },
            },
          ],
        },
      },
    ],
  },
  {
    id: 'interfaces-generics',
    title: 'Module 10 — Interfaces & generics lite',
    subtitle: 'Reusable shapes and flexible functions',
    lessons: [
      {
        id: 'interface-intro',
        title: 'interface vs type',
        minutes: 10,
        content: `\`interface\` is another way to name an object shape:

\`\`\`
interface Animal {
  name: string
}
\`\`\`

For object shapes, \`interface\` and \`type\` are often interchangeable in interviews. Prefer whichever the codebase uses.

**Generics** let a function work with many types safely:

\`\`\`
function first<T>(items: T[]): T | undefined {
  return items[0]
}
\`\`\`

\`T\` is a placeholder filled in when you call the function.`,
        example: `function wrap<T>(value: T): T[] {
  return [value]
}

wrap("x") // string[]
wrap(1)   // number[]`,
      },
      {
        id: 'generic-challenge',
        title: 'Challenge: identity & first',
        minutes: 15,
        content: `Write a generic function \`identity<T>(value: T): T\` that returns the value unchanged.

Then write \`firstItem<T>(items: T[]): T | undefined\` that returns the first element (or undefined if empty).`,
        challenge: {
          id: 'ch-generics',
          title: 'identity + firstItem',
          prompt: 'Implement identity<T> and firstItem<T>.',
          starterCode: `function identity<T>(value: T): T {
  
}

function firstItem<T>(items: T[]): T | undefined {
  
}

`,
          exports: ['identity', 'firstItem'],
          hints: [
            '`identity` should return whatever it received, unchanged.',
            '`firstItem` should return the element at index 0.',
            'For an empty array, index 0 is `undefined` — that is fine.',
          ],
          tests: [
            {
              description: 'identity preserves value',
              run: (s) => {
                const identity = s.identity as <T>(v: T) => T
                eq(identity('z'), 'z')
                eq(identity(9), 9)
              },
            },
            {
              description: 'firstItem works',
              run: (s) => {
                const firstItem = s.firstItem as <T>(items: T[]) => T | undefined
                eq(firstItem(['a', 'b']), 'a')
                eq(firstItem([]), undefined)
              },
            },
          ],
        },
      },
    ],
  },
  {
    id: 'interview-drills',
    title: 'Module 11 — Interview drills',
    subtitle: 'Put it together under pressure',
    lessons: [
      {
        id: 'drill-cart',
        title: 'Drill: cart total',
        minutes: 20,
        content: `You are given cart line items. Compute the total price for items that are in stock only.

This is a typical take-home / live-test shape: typed data in, number out, use filter + map/reduce.`,
        challenge: {
          id: 'ch-cart-total',
          title: 'inStockTotal',
          prompt:
            'type CartItem = { name: string; price: number; inStock: boolean }. Write inStockTotal(items: CartItem[]): number — sum price for inStock items only.',
          starterCode: `type CartItem = {
  name: string
  price: number
  inStock: boolean
}

function inStockTotal(items: CartItem[]): number {
  
}

`,
          exports: ['inStockTotal'],
          hints: [
            'Ignore items that are not in stock first.',
            'Then add up the `price` values of what remains.',
            'A `filter` followed by `reduce` (starting at 0) is a solid approach.',
          ],
          tests: [
            {
              description: 'sums in-stock only',
              run: (s) => {
                const inStockTotal = s.inStockTotal as (
                  items: { name: string; price: number; inStock: boolean }[],
                ) => number
                eq(
                  inStockTotal([
                    { name: 'A', price: 10, inStock: true },
                    { name: 'B', price: 5, inStock: false },
                    { name: 'C', price: 2, inStock: true },
                  ]),
                  12,
                )
              },
            },
            {
              description: 'empty → 0',
              run: (s) => {
                const inStockTotal = s.inStockTotal as (
                  items: { name: string; price: number; inStock: boolean }[],
                ) => number
                eq(inStockTotal([]), 0)
              },
            },
          ],
        },
      },
      {
        id: 'drill-group',
        title: 'Drill: pluck and unique',
        minutes: 20,
        content: `Write \`uniqueTags(posts)\` where each post is \`{ id: number; tags: string[] }\`.

Return a \`string[]\` of all tags across posts with duplicates removed (first occurrence order).`,
        challenge: {
          id: 'ch-unique-tags',
          title: 'uniqueTags',
          prompt: 'Flatten tags from all posts, then dedupe preserving order.',
          starterCode: `type Post = { id: number; tags: string[] }

function uniqueTags(posts: Post[]): string[] {
  
}

`,
          exports: ['uniqueTags'],
          hints: [
            'First collect every tag from every post into one list.',
            '`flatMap` (or map + flat) helps flatten the nested tag arrays.',
            'Then remove duplicates while keeping first-seen order (a `Set` can help).',
          ],
          tests: [
            {
              description: 'flattens and dedupes',
              run: (s) => {
                const uniqueTags = s.uniqueTags as (
                  posts: { id: number; tags: string[] }[],
                ) => string[]
                eq(
                  uniqueTags([
                    { id: 1, tags: ['ts', 'react'] },
                    { id: 2, tags: ['react', 'node'] },
                  ]),
                  ['ts', 'react', 'node'],
                )
              },
            },
            {
              description: 'empty posts',
              run: (s) => {
                const uniqueTags = s.uniqueTags as (
                  posts: { id: number; tags: string[] }[],
                ) => string[]
                eq(uniqueTags([]), [])
              },
            },
          ],
        },
      },
      {
        id: 'drill-groupby',
        title: 'Final drill: group by key',
        minutes: 25,
        content: `Harder interview favorite.

Write \`groupByRole(people)\` where person is \`{ name: string; role: string }\`.

Return an object whose keys are roles and values are arrays of names.

Example input:
\`[{ name: "A", role: "dev" }, { name: "B", role: "design" }, { name: "C", role: "dev" }]\`

Example output:
\`{ dev: ["A", "C"], design: ["B"] }\``,
        challenge: {
          id: 'ch-group-by-role',
          title: 'groupByRole',
          prompt: 'Return Record<string, string[]> grouping names by role.',
          starterCode: `type Person = { name: string; role: string }

function groupByRole(people: Person[]): Record<string, string[]> {
  
}

`,
          exports: ['groupByRole'],
          hints: [
            'Build an object whose keys are roles and whose values are arrays of names.',
            'Loop (or reduce): for each person, make sure that role key exists as an array.',
            'Push the person's name into the array for their role, then return the object.',
          ],
          tests: [
            {
              description: 'groups names by role',
              run: (s) => {
                const groupByRole = s.groupByRole as (
                  people: { name: string; role: string }[],
                ) => Record<string, string[]>
                eq(
                  groupByRole([
                    { name: 'A', role: 'dev' },
                    { name: 'B', role: 'design' },
                    { name: 'C', role: 'dev' },
                  ]),
                  { dev: ['A', 'C'], design: ['B'] },
                )
              },
            },
            {
              description: 'empty input',
              run: (s) => {
                const groupByRole = s.groupByRole as (
                  people: { name: string; role: string }[],
                ) => Record<string, string[]>
                eq(groupByRole([]), {})
              },
            },
          ],
        },
      },
      {
        id: 'graduation',
        title: 'You made it — keep drilling',
        minutes: 5,
        content: `You just covered what most live coding screens expect from TypeScript:

- Primitive annotations
- Arrays & object types
- Functions with params/returns
- Unions & optionals
- map / filter / find / reduce
- Narrowing
- Light generics
- Small data-transform drills

For the next few days before your test:
1. Re-do any challenge without looking at hints
2. Time yourself on Module 11 (aim under 15 minutes each)
3. Say your types out loud as you type — interviewers listen for that fluency

Reset progress anytime from the header if you want a clean run.`,
      },
    ],
  },
]

export function flattenLessons() {
  return modules.flatMap((m) =>
    m.lessons.map((lesson, index) => ({
      module: m,
      lesson,
      moduleIndex: modules.indexOf(m),
      lessonIndex: index,
    })),
  )
}

export function getLessonById(id: string) {
  return flattenLessons().find((x) => x.lesson.id === id)
}

export function getNextLessonId(currentId: string): string | null {
  const all = flattenLessons()
  const idx = all.findIndex((x) => x.lesson.id === currentId)
  if (idx < 0 || idx >= all.length - 1) return null
  return all[idx + 1].lesson.id
}

export function getPrevLessonId(currentId: string): string | null {
  const all = flattenLessons()
  const idx = all.findIndex((x) => x.lesson.id === currentId)
  if (idx <= 0) return null
  return all[idx - 1].lesson.id
}

export function isLessonUnlocked(
  lessonId: string,
  completedLessonIds: string[],
  completedChallengeIds: string[],
): boolean {
  const all = flattenLessons()
  const idx = all.findIndex((x) => x.lesson.id === lessonId)
  if (idx <= 0) return true

  for (let i = 0; i < idx; i++) {
    const prev = all[i].lesson
    if (!completedLessonIds.includes(prev.id)) return false
    if (prev.challenge && !completedChallengeIds.includes(prev.challenge.id)) {
      return false
    }
  }
  return true
}
