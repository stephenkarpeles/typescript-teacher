import type { Module } from './types'

function eq(actual: unknown, expected: unknown, label?: string) {
  const same =
    actual === expected ||
    (Number.isNaN(actual as number) && Number.isNaN(expected as number)) ||
    JSON.stringify(actual) === JSON.stringify(expected)
  if (!same) {
    const prefix = label ? `${label}: ` : ''
    const typeNote =
      typeof actual !== typeof expected
        ? ` (got type ${typeof actual}, expected ${typeof expected})`
        : ''
    throw new Error(
      `${prefix}expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}${typeNote}`,
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
let label = "Alex"
label = 42  // oops, still allowed in JS

// TypeScript — you declare the shape
let label: string = "Alex"
// label = 42  // TypeScript error: number is not a string`
      },
      {
        id: 'welcome-first-challenge',
        title: 'Challenge: say hello with a type',
        minutes: 10,
        content: `A type annotation sits after the variable name, with a colon:

\`let label: string = "hi"\`

Read it left to right: declare \`label\`, say it must be a \`string\`, then give it a value.

Rules that matter right away:
- \`string\` values use quotes: \`"hello"\`
- \`number\` values do **not** use quotes: \`2026\` (not \`"2026"\`)
- Spelling and capitalization of string values must match exactly what is asked

You can use \`let\` or \`const\`. For this first challenge either is fine — focus on getting the types and values right.

When you click **Start challenge**, this lesson hides so you are not staring at the teaching text while you code. The challenge prompt has the exact names and values.`,
        challenge: {
          id: 'ch-hello',
          title: 'Hello variables',
          prompt:
            'Declare `greeting` with an explicit `string` type equal to "Hello, TypeScript", and `year` with an explicit `number` type equal to 2026. (Not plain JavaScript — type annotations required.)',
          starterCode: `// Write your code below.

`,
          exports: ['greeting', 'year'],
          expectedTypes: { greeting: 'string', year: 'number' },
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
              description: 'year equals 2026',
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
        content: `TypeScript’s everyday primitives:

- \`string\` — text in quotes: \`"hello"\`
- \`number\` — integers and decimals: \`3\`, \`3.14\` (there is no separate \`int\` / \`float\`)
- \`boolean\` — \`true\` or \`false\` (no quotes)

**Inference:** if you write \`let age = 30\`, TypeScript figures out it is a number.

**Annotation:** you write the type yourself: \`let age: number = 30\`.

Both are valid TypeScript. In this course, challenges require **explicit** annotations even when inference would work. That is practice for interviews, where saying the type out loud matters.

Wrong type → error:

\`\`\`
let title: string = "Engineer"
// title = 3  // error: number is not assignable to string
\`\`\``,
        example: `let title: string = "Engineer"
let level: number = 3
let hired: boolean = true`,
      },
      {
        id: 'prim-const',
        title: 'let vs const',
        minutes: 8,
        content: `Two ways to declare a variable:

- \`let\` — you can assign a new value later
- \`const\` — you cannot reassign that name (use this when the value should stay fixed)

Both take the same type annotation style:

\`\`\`
const pi: number = 3.14
let count: number = 0
count = 1  // ok with let
// pi = 3  // error: const cannot be reassigned
\`\`\`

\`const\` only blocks reassignment of the binding. For objects and arrays you can still change properties inside (you will see that later). For primitives like strings and numbers, \`const\` means the value stays put.

Interview habit: default to \`const\`, switch to \`let\` only when you know you will reassign.`,
        challenge: {
          id: 'ch-primitives',
          title: 'Annotate three values',
          prompt:
            'Declare three variables with explicit types: `productName` (string "Widget", must be `const`), `inStock` (boolean `true`, use `let`), and `quantity` (number `12`, use `let`).',
          starterCode: `// Write your code below.

`,
          exports: ['productName', 'inStock', 'quantity'],
          expectedTypes: {
            productName: 'string',
            inStock: 'boolean',
            quantity: 'number',
          },
          requireConst: ['productName'],
          hints: [
            'One name never changes — that one needs `const`. The other two need `let`.',
            'Put a type after each name with a colon: string, boolean, or number.',
            'Check the prompt again for the exact values of each variable.',
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
        content: `Two primitives show up constantly:

- \`boolean\` — only \`true\` or \`false\` (no quotes)
- \`string\` — text in quotes: \`"paused"\`, \`"ready"\`

Examples:

\`\`\`
let ready: boolean = true
ready = false  // still a boolean

let mode: string = "idle"
mode = "running"
\`\`\`

Common mistakes:
- Writing \`"true"\` (a string) when you meant \`true\` (a boolean)
- Forgetting the type annotation in this course — we want \`let ready: boolean = true\`, not bare JavaScript

You will declare one boolean and one string next. Names and exact values are on the challenge screen.`,
        challenge: {
          id: 'ch-status',
          title: 'Active flag + status',
          prompt:
            'Declare `isActive` as a boolean set to false, and `status` as a string set to "paused". Explicit type annotations required.',
          starterCode: `// Write your code below.

`,
          exports: ['isActive', 'status'],
          expectedTypes: { isActive: 'boolean', status: 'string' },
          hints: [
            '`isActive` is a yes/no value. `status` is text.',
            'Annotate with `boolean` and `string`. Boolean literals have no quotes; string literals do.',
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
        content: `An array type says “a list of this kind of thing”:

\`\`\`
const scores: number[] = [90, 85, 100]
const cities: string[] = ["Austin", "Denver"]
\`\`\`

The \`[]\` after the type means “array of.” So \`number[]\` is an array of numbers, \`string[]\` is an array of strings.

Order matters when tests check the whole array — \`[1, 2]\` is not the same as \`[2, 1]\`.

You can also write \`Array<number>\` instead of \`number[]\`. Same meaning. This course uses the shorter \`number[]\` form.

Empty arrays usually need an annotation, or TypeScript falls back to \`any[]\`:

\`const ids: number[] = []\`

Next you will create two annotated arrays. Exact values are on the challenge screen.`,
        challenge: {
          id: 'ch-arrays',
          title: 'temps and cities',
          prompt:
            'Create `temps` as a number array containing 72, 68, and 75. Create `cities` as a string array containing "Austin" and "Denver". Explicit array type annotations required.',
          starterCode: `// Write your code below.

`,
          exports: ['temps', 'cities'],
          expectedTypes: { temps: 'number[]', cities: 'string[]' },
          hints: [
            'Array types look like `number[]` or `string[]`.',
            'Use square brackets for the values, in the order listed in the prompt.',
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
        content: `Real apps pass around objects: users, products, API responses. TypeScript lets you describe the **shape** — which fields exist and what type each is.

**Inline** (fine for a one-off):

\`\`\`
const user: { name: string; age: number } = {
  name: "Sam",
  age: 28,
}
\`\`\`

**Type alias** (better when you reuse the shape):

\`\`\`
type User = {
  name: string
  age: number
}

const user: User = { name: "Sam", age: 28 }
\`\`\`

The colon after \`user\` is not a function call. It means “this value must match \`User\`.”

Rules TypeScript enforces:
- Required fields must be present
- Field types must match (\`age: "28"\` fails if \`age\` is \`number\`)
- Extra unknown fields are usually errors

Semicolons between fields in an inline type (\`{ name: string; age: number }\`) are normal. In a \`type\` block, newlines between fields are enough.`,
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
        content: `A **type alias** names an object shape so you can reuse it:

\`\`\`
type Product = {
  id: number
  title: string
}

const item: Product = {
  id: 1,
  title: "Mug",
}
\`\`\`

Steps:
1. Write \`type SomeName = { ... }\` with each field and its type
2. Create a value annotated with that name: \`const x: SomeName = { ... }\`

TypeScript checks that every required field is present and has the right type. Extra unknown fields are also errors.

You do **not** call or invoke the type. The colon (\`: Product\`) is an annotation, same idea as \`: number\` on a variable.

The challenge asks you to define one alias and one value that uses it. Exact field names and values are on the challenge screen.`,
        challenge: {
          id: 'ch-person',
          title: 'Person type + player',
          prompt:
            'Define a type alias `Person` with fields `name` (string) and `score` (number). Then create a `const` `player` of type `Person` with name "Riley" and score 42.',
          starterCode: `// Write your code below.

`,
          exports: ['player'],
          expectedTypes: { player: 'Person' },
          requireTypeAlias: ['Person'],
          requireConst: ['player'],
          hints: [
            'First define a `type` alias with two fields, then create a value that uses it.',
            'The fields are `name` (string) and `score` (number).',
            'Annotate `player` as `Person`, and match the name/score values from the prompt.',
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
        content: `Functions are where most live coding time goes. Annotate each parameter and the return type:

\`\`\`
function add(a: number, b: number): number {
  return a + b
}
\`\`\`

Reading the signature:
- Inputs: \`a\` and \`b\` must be numbers
- Output: whatever you \`return\` must be a number (the \`): number\` after the \`)\`)

Arrow function form is the same idea:

\`\`\`
const add = (a: number, b: number): number => a + b
\`\`\`

If you return a string from a function typed to return \`number\`, TypeScript errors before you run anything. That is the point of the annotations.`,
        example: `function greet(name: string): string {
  return "Hi, " + name
}

greet("Dev") // "Hi, Dev"`,
      },
      {
        id: 'fn-challenge-add',
        title: 'Challenge: multiply',
        minutes: 12,
        content: `A typed function has types on the inputs **and** on the output:

\`\`\`
function add(a: number, b: number): number {
  return a + b
}
\`\`\`

- \`a: number\` and \`b: number\` — what you pass in
- \`): number\` after the parameter list — what \`return\` must produce

If the body returns the wrong type (or returns nothing when a type was promised), TypeScript errors.

In the challenge you will type the **whole function** yourself: name, parameter types, return type, and body. The prompt lists the required signature.`,
        challenge: {
          id: 'ch-multiply',
          title: 'multiply(a, b)',
          prompt: 'Write `function multiply(a: number, b: number): number` that returns the product of `a` and `b`.',
          starterCode: `// Write your full function below (name, params, types, and body).

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
        content: `Functions that build text usually return \`string\`.

Two ways to combine pieces into one string:

**1. Concatenation with \`+\`**

\`\`\`
function label(name: string, n: number): string {
  return name + " (" + n + ")"
}
\`\`\`

**2. Template literals** (usually cleaner)

Wrap the string in **backticks** (\`...\`), not quotes. Inside, \`\${expression}\` inserts a value:

\`\`\`
function label(name: string, n: number): string {
  return \`\${name} (\${n})\`
}
\`\`\`

Things to watch:
- Backticks look like quotes but are a different key
- Spaces and punctuation inside the backticks are kept exactly — \`"Task (3)"\` is not the same as \`"Task(3)"\`
- \`\${n}\` works for numbers; TypeScript still checks that the whole return is a \`string\`

The challenge gives you a function signature. Fill in the return so the format matches what the prompt describes.`,
        challenge: {
          id: 'ch-format',
          title: 'formatLabel',
          prompt:
            'Write `function formatLabel(name: string, count: number): string` that returns a string like "Task (3)" — the name, a space, then the count in parentheses.',
          starterCode: `// Write your full function below (name, params, types, and body).

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
        title: 'Challenge: union status helper',
        minutes: 10,
        content: `A quick note on optionals: \`nickname?: string\` means the property may be missing. You will use that more later.

This lesson’s challenge is about **string literal unions** — a type that allows only a fixed set of strings:

\`\`\`
type LoadState = "idle" | "loading" | "error"

let state: LoadState = "idle"
state = "loading"  // ok
// state = "banana"  // error — not in the union
\`\`\`

Why interviewers like this: it documents the allowed states and catches typos.

You will also write a small helper that takes a \`LoadState\` and returns a \`boolean\` — for example, whether the current state is the loading one. Comparing with \`===\` already produces a boolean, so you can return that comparison directly.`,
        challenge: {
          id: 'ch-union-status',
          title: 'Status union helper',
          prompt:
            'Define `type LoadState = "idle" | "loading" | "error"`. Write `function isLoading(state: LoadState): boolean` that returns true only when `state` is "loading".',
          starterCode: `// Write your full function below (name, params, types, and body).

`,
          exports: ['isLoading'],
          requireTypeAlias: ['LoadState'],
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
        content: `\`map\` transforms every item in an array and returns a **new** array. The original is left alone.

\`\`\`
const nums = [1, 2, 3]
const doubled = nums.map((n) => n * 2)  // [2, 4, 6]
\`\`\`

How to read it: “for each \`n\` in \`nums\`, produce \`n * 2\`, collect those results.”

In TypeScript you can annotate the callback when you want to be explicit:

\`nums.map((n: number): number => n * 2)\`

Often inference is enough: TypeScript already knows \`nums\` is \`number[]\`, so \`n\` is a number.

Interview habit: prefer \`map\` over a manual \`for\` loop when you are building a new array of the same length. Do not push into the original array and return it — return what \`map\` gives you.`,
        example: `const prices = [10, 20]
const withTax = prices.map((p: number) => p * 1.1)`,
      },
      {
        id: 'map-challenge',
        title: 'Challenge: doubleAll',
        minutes: 12,
        content: `Practice \`map\` on a typed function.

You will write a full function that takes \`number[]\` and returns \`number[]\`. Inside, use \`map\` so each value becomes twice itself. An empty input should return an empty array (\`map\` does that for free). Type the whole signature yourself from the challenge prompt.`,
        challenge: {
          id: 'ch-double-all',
          title: 'doubleAll',
          prompt: 'Write `function doubleAll(nums: number[]): number[]` that returns a new array where each number is doubled.',
          starterCode: `// Write your full function below (name, params, types, and body).

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
        content: `\`filter\` keeps only the items that pass a test. It returns a **new** array.

\`\`\`
const nums = [1, 2, 3, 4]
const evens = nums.filter((n) => n % 2 === 0)  // [2, 4]
\`\`\`

The callback must return a boolean (or something TypeScript treats as yes/no):
- \`true\` → keep that item
- \`false\` → drop it

\`%\` is remainder. \`n % 2 === 0\` means “\`n\` divides evenly by 2,” i.e. even.

Unlike \`map\`, the result can be shorter than the input. If nothing passes, you get \`[]\`.`,
        challenge: {
          id: 'ch-evens',
          title: 'onlyEvens',
          prompt: 'Write `function onlyEvens(nums: number[]): number[]` that returns only the even numbers from `nums`.',
          starterCode: `// Write your full function below (name, params, types, and body).

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
        content: `Coding tests often ask you to **chain** array methods: filter first, then map.

Example with books:

\`\`\`
type Book = { title: string; inPrint: boolean }

function printedTitles(books: Book[]): string[] {
  return books
    .filter((b) => b.inPrint)
    .map((b) => b.title)
}
\`\`\`

Order matters:
1. \`filter\` — keep only the objects you care about
2. \`map\` — pull out the field you want (often a string)

Chaining reads left to right and returns one final array. You will do the same pattern with users who have a name and an active flag — details on the challenge screen.`,
        challenge: {
          id: 'ch-active-names',
          title: 'activeNames',
          prompt:
            'Define `type User = { name: string; active: boolean }`. Write `function activeNames(users: User[]): string[]` that returns the names of active users.',
          starterCode: `// Write your full function below (name, params, types, and body).

`,
          exports: ['activeNames'],
          requireTypeAlias: ['User'],
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
        content: `Three related array methods for searching:

- \`find\` — returns the **first** matching item, or \`undefined\` if none match
- \`some\` — returns \`true\` if **any** item passes the test
- \`every\` — returns \`true\` if **all** items pass the test

\`\`\`
const users = [{ id: 1 }, { id: 2 }]
users.find((u) => u.id === 2)  // { id: 2 }
users.find((u) => u.id === 9)  // undefined
users.some((u) => u.id === 9)  // false
users.every((u) => u.id > 0)   // true
\`\`\`

Return type for \`find\` is often a union: \`Item | undefined\`. That is honest — the item might not be there. Callers should handle the missing case.

The challenge asks you to find by \`id\`. Prefer \`find\` over writing your own loop when you only need the first match.`,
        challenge: {
          id: 'ch-find-by-id',
          title: 'findById',
          prompt:
            'Define `type Item = { id: number; label: string }`. Write `function findById(items: Item[], id: number): Item | undefined` that returns the matching item or `undefined`.',
          starterCode: `// Write your full function below (name, params, types, and body).

`,
          exports: ['findById'],
          requireTypeAlias: ['Item'],
          hints: [
            'Look for an array method that returns the first matching element (or undefined).',
            "Compare each item's `id` to the `id` argument.",
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
        minutes: 18,
        content: `\`map\` and \`filter\` return arrays. **\`reduce\` returns one value** — a sum, a string, an object, whatever you build.

Think of it as a running total you update once per item.

**Same idea as a loop**

\`\`\`
let total = 0
for (const n of [1, 2, 3]) {
  total = total + n
}
// total is 6
\`\`\`

With \`reduce\`:

\`\`\`
const sum = [1, 2, 3].reduce((total, n) => total + n, 0)
// 6
\`\`\`

**What each piece means**

\`array.reduce((accumulator, current) => nextAccumulator, initialValue)\`

- \`initialValue\` (\`0\` above) — where the running result starts, **before** any items
- \`accumulator\` (\`total\`) — the running result so far
- \`current\` (\`n\`) — the item you are looking at right now
- whatever you **return** from the callback becomes the \`accumulator\` for the next item

**Step by step for \`[1, 2, 3]\` starting at \`0\`**

1. Start: \`total = 0\`
2. See \`1\` → return \`0 + 1\` → \`total\` is now \`1\`
3. See \`2\` → return \`1 + 2\` → \`total\` is now \`3\`
4. See \`3\` → return \`3 + 3\` → \`total\` is now \`6\`
5. Done — \`reduce\` returns \`6\`

**Always pass an initial value for sums**

\`\`\`
[].reduce((total, n) => total + n, 0)  // 0 — good
// [].reduce((total, n) => total + n)  // throws — no starting value
\`\`\`

Common initial values:
- \`0\` for adding numbers
- \`""\` for building a string
- \`{}\` for building an object
- \`[]\` for building an array by hand

Next: write a function that sums a number array with \`reduce\`.`,
        example: `// Read it as: start at 0, keep adding each number
[10, 5, 2].reduce((total, n) => total + n, 0)  // 17`,
        challenge: {
          id: 'ch-sum',
          title: 'sumNumbers',
          prompt: 'Write `function sumNumbers(nums: number[]): number` that returns the sum of all numbers. An empty array should return 0.',
          starterCode: `// Write your full function below (name, params, types, and body).

`,
          exports: ['sumNumbers'],
          hints: [
            'Call `nums.reduce(...)` and return what it gives you.',
            'The callback should add the current number to the running total.',
            'Pass `0` as the initial value so an empty array still returns 0.',
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
        content: `If a value is a union like \`string | number\`, TypeScript will not let you treat it as only one of those until you prove which it is. That proof is called **narrowing**.

The usual tool for primitives is \`typeof\`:

\`\`\`
function label(value: string | number): string {
  if (typeof value === "string") {
    return value.toUpperCase()  // string here
  }
  return String(value)          // number here
}
\`\`\`

Inside the \`if\`, TypeScript narrows to that branch. After the \`if\`, it knows it must be the other branch.

**Why \`typeof\` fails for arrays vs objects**

\`typeof\` returns a short string like \`"string"\`, \`"number"\`, \`"boolean"\`, \`"object"\`.

In JavaScript, **arrays are objects under the hood**. So:

\`\`\`
typeof { name: "Sam" }  // "object"
typeof [1, 2, 3]        // "object"  ← same answer!
typeof null             // "object"  ← weird historical quirk
\`\`\`

You cannot write \`if (typeof value === "array")\` — that never works. Both a plain object and an array report \`"object"\`.

**Use \`Array.isArray\` when one branch is an array**

\`\`\`
function len(value: string | string[]): number {
  if (typeof value === "string") {
    return value.length
  }
  // Here value must be string[]
  return value.length
}

function first(value: { id: number } | number[]): number | undefined {
  if (Array.isArray(value)) {
    return value[0]      // number[] here
  }
  return value.id        // { id: number } here
}
\`\`\`

Rule of thumb:
- string / number / boolean → \`typeof\`
- array vs object → \`Array.isArray\`

Next you will narrow \`string | number\` and always return a \`string\`.`,
        challenge: {
          id: 'ch-to-string',
          title: 'asString',
          prompt:
            'Write `function asString(value: string | number): string`. If the value is a number, return it as a string; if it is already a string, return it unchanged.',
          starterCode: `// Write your full function below (name, params, types, and body).

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
        content: `\`interface\` is another way to name an object shape — very similar to \`type\`:

\`\`\`
interface Animal {
  name: string
}

const dog: Animal = { name: "Rex" }
\`\`\`

For plain object shapes in interviews, \`interface\` and \`type\` are usually interchangeable. Follow whatever the prompt or codebase uses.

**Generics** are for functions that should work with many types without losing type info. \`T\` is a placeholder:

\`\`\`
function first<T>(items: T[]): T | undefined {
  return items[0]
}

first(["a", "b"])  // string | undefined
first([1, 2])      // number | undefined
\`\`\`

When you call \`first\` with strings, \`T\` becomes \`string\`. With numbers, \`T\` becomes \`number\`. One function, many safe uses — better than writing everything as \`any\`.`,
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
        content: `Two classic generic helpers show up in interviews:

**identity** — take a value of type \`T\`, return that same value (still typed as \`T\`). The body is tiny; the point is getting comfortable with \`<T>\` on the function.

**first item** — take an array \`T[]\`, return the element at index \`0\`. Empty arrays give \`undefined\` at index \`0\`, so the return type is usually \`T | undefined\`.

Type both full function signatures yourself (including \`<T>\`), then fill in each body. Do not overthink — these are about the generic shape, not tricky logic.`,
        challenge: {
          id: 'ch-generics',
          title: 'identity + firstItem',
          prompt:
            'Write `function identity<T>(value: T): T` and `function firstItem<T>(items: T[]): T | undefined`.',
          starterCode: `// Write your full function below (name, params, types, and body).

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
    id: 'loops-lists',
    title: 'Module 11 — Loops, push & lists',
    subtitle: 'for loops, building arrays, mapping data to UI lists',
    lessons: [
      {
        id: 'loop-intro',
        title: 'for and for...of',
        minutes: 14,
        content: `You already used \`map\` / \`filter\`. Live tests also expect plain loops.

**\`for...of\`** — walk each value in an array:

\`\`\`
const nums = [10, 20, 30]
for (const n of nums) {
  console.log(n)
}
\`\`\`

**Classic \`for\`** — when you need an index or a counted range:

\`\`\`
for (let i = 0; i < nums.length; i++) {
  console.log(i, nums[i])
}

let total = 0
for (let i = 1; i <= 5; i++) {
  total += i  // 1+2+3+4+5
}
\`\`\`

When to use which:
- Transform every item → often \`map\`
- Keep some items → often \`filter\`
- Build a result with custom logic, early \`break\`, or indexes → \`for\` / \`for...of\`

Next you will build a new array inside a loop.`,
        example: `const words = ["a", "bb", "ccc"]
for (const w of words) {
  console.log(w.length)
}`,
      },
      {
        id: 'loop-push-challenge',
        title: 'Challenge: loop + push',
        minutes: 15,
        content: `\`push\` adds an item to the **end** of an array (and mutates that array):

\`\`\`
const result: number[] = []
result.push(1)
result.push(3)
// result is [1, 3]
\`\`\`

A common pattern in interviews:

\`\`\`
const out: number[] = []
for (const n of nums) {
  if (/* some test */) {
    out.push(n)
  }
}
return out
\`\`\`

You annotate the empty array (\`number[]\`) so TypeScript knows what you are collecting.

\`filter\` can do the same job in one line. Learning the loop + \`push\` version still matters — many take-homes mix both styles.`,
        challenge: {
          id: 'ch-collect-odds',
          title: 'collectOdds',
          prompt:
            'Write `function collectOdds(nums: number[]): number[]` that returns only the odd numbers, in order. Use a loop and `push` (not `filter`).',
          starterCode: `// Write your full function below (name, params, types, and body).

`,
          exports: ['collectOdds'],
          hints: [
            'Start with an empty typed array, then loop over `nums`.',
            'A number is odd when `n % 2 !== 0` (remainder is not zero).',
            '`push` each odd value onto your result array, then return it.',
          ],
          tests: [
            {
              description: 'collectOdds([1, 2, 3, 4, 5])',
              run: (s) => {
                const collectOdds = s.collectOdds as (n: number[]) => number[]
                eq(collectOdds([1, 2, 3, 4, 5]), [1, 3, 5])
              },
            },
            {
              description: 'collectOdds([2, 4]) is empty',
              run: (s) => {
                const collectOdds = s.collectOdds as (n: number[]) => number[]
                eq(collectOdds([2, 4]), [])
              },
            },
          ],
        },
      },
      {
        id: 'map-dataset',
        title: 'Map a dataset into a list',
        minutes: 14,
        content: `UI code constantly turns raw data into a list of display strings (sidebar items, dropdown labels, table cells).

Example dataset:

\`\`\`
type Product = { name: string; price: number }

const products: Product[] = [
  { name: "Mug", price: 12 },
  { name: "Tea", price: 4 },
]
\`\`\`

Map each object into one label string:

\`\`\`
products.map((p) => \`\${p.name}: $\${p.price}\`)
// ["Mug: $12", "Tea: $4"]
\`\`\`

That is the same \`map\` you already know — the output is \`string[]\` instead of numbers. Spacing and punctuation in the template must match what the prompt asks for.`,
        challenge: {
          id: 'ch-product-labels',
          title: 'productLabels',
          prompt:
            'Define `type Product = { name: string; price: number }`. Write `function productLabels(products: Product[]): string[]` so each product becomes a string like "Mug — $12".',
          starterCode: `// Write your full function below (name, params, types, and body).

`,
          exports: ['productLabels'],
          requireTypeAlias: ['Product'],
          hints: [
            'Use `map` to turn each product into one string.',
            'Build the string from `product.name` and `product.price`.',
            'The separator is a space, an em dash (—), then another space before the `$`.',
          ],
          tests: [
            {
              description: 'formats two products',
              run: (s) => {
                const productLabels = s.productLabels as (
                  products: { name: string; price: number }[],
                ) => string[]
                eq(productLabels([
                  { name: 'Mug', price: 12 },
                  { name: 'Tea', price: 4 },
                ]), ['Mug — $12', 'Tea — $4'])
              },
            },
            {
              description: 'empty list',
              run: (s) => {
                const productLabels = s.productLabels as (
                  products: { name: string; price: number }[],
                ) => string[]
                eq(productLabels([]), [])
              },
            },
          ],
        },
      },
      {
        id: 'crud-add',
        title: 'Add to a list (button-click pattern)',
        minutes: 15,
        content: `In a UI, “click Add” usually means: take the current list, produce a **new** list with one more item, then render that.

In TypeScript (and React state), prefer **not** mutating the original array:

\`\`\`
function addTask(tasks: Task[], task: Task): Task[] {
  return [...tasks, task]
}
\`\`\`

\`[...tasks, task]\` copies every existing task, then puts the new one at the end.

Mutating with \`tasks.push(task)\` changes the old array in place. That breaks React state updates and surprises callers who still hold a reference to the old list.

Interview phrasing: “I’ll return a new array so the previous state stays unchanged.”`,
        example: `type Task = { id: number; title: string }

const before: Task[] = [{ id: 1, title: "Write tests" }]
const after = [...before, { id: 2, title: "Ship it" }]
// before is still length 1; after has 2 items`,
        challenge: {
          id: 'ch-add-task',
          title: 'addTask',
          prompt:
            'Define `type Task = { id: number; title: string }`. Write `function addTask(tasks: Task[], task: Task): Task[]` that returns a new array with `task` appended. Do not mutate the original array.',
          starterCode: `// Write your full function below (name, params, types, and body).

`,
          exports: ['addTask'],
          requireTypeAlias: ['Task'],
          hints: [
            'Return a new array that contains every existing task plus the new one.',
            'Spread helps: `[...tasks, task]`.',
            'Avoid `tasks.push(task)` — that mutates the original list.',
          ],
          tests: [
            {
              description: 'appends the task',
              run: (s) => {
                const addTask = s.addTask as (
                  tasks: { id: number; title: string }[],
                  task: { id: number; title: string },
                ) => { id: number; title: string }[]
                eq(addTask([{ id: 1, title: 'A' }], { id: 2, title: 'B' }), [
                  { id: 1, title: 'A' },
                  { id: 2, title: 'B' },
                ])
              },
            },
            {
              description: 'does not mutate the original',
              run: (s) => {
                const addTask = s.addTask as (
                  tasks: { id: number; title: string }[],
                  task: { id: number; title: string },
                ) => { id: number; title: string }[]
                const original = [{ id: 1, title: 'A' }]
                const snapshot = JSON.stringify(original)
                addTask(original, { id: 2, title: 'B' })
                eq(JSON.stringify(original), snapshot, 'original tasks')
              },
            },
            {
              description: 'empty start',
              run: (s) => {
                const addTask = s.addTask as (
                  tasks: { id: number; title: string }[],
                  task: { id: number; title: string },
                ) => { id: number; title: string }[]
                eq(addTask([], { id: 1, title: 'First' }), [
                  { id: 1, title: 'First' },
                ])
              },
            },
          ],
        },
      },
      {
        id: 'crud-update-delete',
        title: 'Update & delete by id (CRUD)',
        minutes: 18,
        content: `CRUD on a list in memory:

- **Create** — add an item (previous lesson)
- **Update** — change one item, usually by \`id\`
- **Delete** — remove one item by \`id\`
- **Read** — find / filter (you already practiced)

**Update** without mutating:

\`\`\`
items.map((item) =>
  item.id === id ? { ...item, label: newLabel } : item
)
\`\`\`

Spread \`{ ...item, label: newLabel }\` copies the object and overrides \`label\`.

**Delete** without mutating:

\`\`\`
items.filter((item) => item.id !== id)
\`\`\`

Keep every item whose id is **not** the one you want to remove.

These two helpers are what sit behind “edit” and “delete” buttons in a lot of UI code.`,
        challenge: {
          id: 'ch-crud-items',
          title: 'updateLabel + removeById',
          prompt:
            'Define `type Item = { id: number; label: string }`. Write `updateLabel(items, id, label): Item[]` and `removeById(items, id): Item[]`. Do not mutate the originals.',
          starterCode: `// Write your full function below (name, params, types, and body).

`,
          exports: ['updateLabel', 'removeById'],
          requireTypeAlias: ['Item'],
          hints: [
            '`updateLabel`: map over items; when `id` matches, return a new object with the new label.',
            'Object spread helps for the updated copy: `{ ...item, label }`.',
            '`removeById`: filter out the item whose `id` matches.',
          ],
          tests: [
            {
              description: 'updateLabel changes the matching item',
              run: (s) => {
                const updateLabel = s.updateLabel as (
                  items: { id: number; label: string }[],
                  id: number,
                  label: string,
                ) => { id: number; label: string }[]
                eq(
                  updateLabel(
                    [
                      { id: 1, label: 'A' },
                      { id: 2, label: 'B' },
                    ],
                    2,
                    'Beta',
                  ),
                  [
                    { id: 1, label: 'A' },
                    { id: 2, label: 'Beta' },
                  ],
                )
              },
            },
            {
              description: 'removeById drops the matching item',
              run: (s) => {
                const removeById = s.removeById as (
                  items: { id: number; label: string }[],
                  id: number,
                ) => { id: number; label: string }[]
                eq(
                  removeById(
                    [
                      { id: 1, label: 'A' },
                      { id: 2, label: 'B' },
                    ],
                    1,
                  ),
                  [{ id: 2, label: 'B' }],
                )
              },
            },
            {
              description: 'updateLabel does not mutate',
              run: (s) => {
                const updateLabel = s.updateLabel as (
                  items: { id: number; label: string }[],
                  id: number,
                  label: string,
                ) => { id: number; label: string }[]
                const original = [{ id: 1, label: 'A' }]
                const snapshot = JSON.stringify(original)
                updateLabel(original, 1, 'Z')
                eq(JSON.stringify(original), snapshot, 'original items')
              },
            },
          ],
        },
      },
    ],
  },
  {
    id: 'interview-drills',
    title: 'Module 12 — Interview drills',
    subtitle: 'Put it together under pressure',
    lessons: [
      {
        id: 'drill-cart',
        title: 'Drill: cart total',
        minutes: 20,
        content: `Interview shape: typed objects in, one number out.

You get cart lines with a price and an in-stock flag. Sum the prices of items that are in stock. Ignore the rest. Empty list → \`0\`.

Approach to practice saying out loud:
1. Keep only in-stock items (\`filter\`)
2. Add up their prices (\`reduce\` starting at \`0\`)

You could also loop with \`for...of\`. Either works; filter + reduce is short and common in take-homes.

Write the \`CartItem\` type and the full \`inStockTotal\` function yourself from the challenge prompt.`,
        challenge: {
          id: 'ch-cart-total',
          title: 'inStockTotal',
          prompt:
            'Define `type CartItem = { name: string; price: number; inStock: boolean }`. Write `function inStockTotal(items: CartItem[]): number` that sums `price` for in-stock items only. Empty list → 0.',
          starterCode: `// Write your full function below (name, params, types, and body).

`,
          exports: ['inStockTotal'],
          requireTypeAlias: ['CartItem'],
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
        content: `You have posts. Each post has a list of tags. You need one flat list of every tag, with duplicates removed, keeping first-seen order.

Two steps:
1. **Flatten** — turn \`string[][]\` into \`string[]\`. \`flatMap((p) => p.tags)\` (or \`map\` then \`flat\`) does this.
2. **Dedupe** — a \`Set\` keeps unique values in insertion order; \`Array.from(new Set(...))\` turns it back into an array.

\`\`\`
const nested = [["a", "b"], ["b", "c"]]
const flat = nested.flatMap((tags) => tags)  // ["a", "b", "b", "c"]
const unique = Array.from(new Set(flat))     // ["a", "b", "c"]
\`\`\`

The challenge uses posts with an \`id\` and \`tags\`. Same idea.`,
        challenge: {
          id: 'ch-unique-tags',
          title: 'uniqueTags',
          prompt:
            'Define `type Post = { id: number; tags: string[] }`. Write `function uniqueTags(posts: Post[]): string[]` that flattens all tags and removes duplicates (first-seen order).',
          starterCode: `// Write your full function below (name, params, types, and body).

`,
          exports: ['uniqueTags'],
          requireTypeAlias: ['Post'],
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
        content: `Group a list of people by role into an object:

- Keys = role strings (\`"dev"\`, \`"design"\`, …)
- Values = arrays of names in that role

Example:

Input: \`[{ name: "A", role: "dev" }, { name: "B", role: "design" }, { name: "C", role: "dev" }]\`

Output: \`{ dev: ["A", "C"], design: ["B"] }\`

A solid approach:
1. Start with an empty object typed as \`Record<string, string[]>\`
2. For each person, make sure \`result[person.role]\` exists as an array
3. Push \`person.name\` into that array
4. Return the object

You can use a \`for...of\` loop or \`reduce\`. Empty input should return \`{}\`.

The return type \`Record<string, string[]>\` means “an object whose keys are strings and whose values are string arrays.”`,
        challenge: {
          id: 'ch-group-by-role',
          title: 'groupByRole',
          prompt:
            'Define `type Person = { name: string; role: string }`. Write `function groupByRole(people: Person[]): Record<string, string[]>` grouping names by role.',
          starterCode: `// Write your full function below (name, params, types, and body).

`,
          exports: ['groupByRole'],
          requireTypeAlias: ['Person'],
          hints: [
            'Build an object whose keys are roles and whose values are arrays of names.',
            'Loop (or reduce): for each person, make sure that role key exists as an array.',
            "Push the person's name into the array for their role, then return the object.",
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
- for loops, push, and building lists
- CRUD-style add / update / remove on arrays
- Mapping datasets into display lists
- Narrowing
- Light generics
- Small data-transform drills

For the next few days before your test:
1. Re-do any challenge without looking at hints
2. Time yourself on Module 12 (aim under 15 minutes each)
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
