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
            
            `Create two typed variables:

1. \`greeting\` — a string whose value is exactly "Hello, TypeScript"
2. \`year\` — a number whose value is 2026

Use explicit type annotations (not bare JavaScript). Spelling and punctuation for \`greeting\` must match exactly.`,
          starterCode: `// Write your code below.

`,
          exports: ['greeting', 'year'],
          expectedTypes: { greeting: 'string', year: 'number' },
          hints: [
            'Annotate each variable with a type after the name (colon + type).',
            '`greeting` is text; `year` is a numeric value — numbers are not written in quotes.',
            'Re-check the exact greeting text, including the comma and space.',
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

If the type is wrong, TypeScript reports an error:

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

\`const\` only stops you from assigning a new value to that name. You can still change the fields inside an object or array (you will see that later). For strings and numbers, \`const\` means the value stays put.

In an interview, start with \`const\`. Use \`let\` only when you know you will assign a new value later.`,
        challenge: {
          id: 'ch-primitives',
          title: 'Annotate three values',
          prompt:
            
            `Create three typed variables with these exact names and values:

- \`productName\` — the text "Widget" (this one should not be reassigned later)
- \`inStock\` — the boolean true (may be reassigned later)
- \`quantity\` — the number 12 (may be reassigned later)

Choose \`const\` vs \`let\` appropriately, and include explicit type annotations.`,
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
            'Pick `const` for the name that should never be reassigned; use `let` for the other two.',
            'Each declaration needs a type annotation: string, boolean, or number.',
            'Match the three values from the prompt exactly.',
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
            
            `Create two typed variables:

- \`isActive\` — a boolean set to false
- \`status\` — a string set to "paused"

Include explicit type annotations on both.`,
          starterCode: `// Write your code below.

`,
          exports: ['isActive', 'status'],
          expectedTypes: { isActive: 'boolean', status: 'string' },
          hints: [
            '`isActive` is a yes/no value; `status` is text in quotes.',
            'Boolean literals are not quoted; string literals are.',
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

An empty array often needs a type. Otherwise TypeScript treats it as \`any[]\`:
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
            
            `Create two typed arrays:

- \`temps\` — numbers in this order: 72, 68, 75
- \`cities\` — strings in this order: "Austin", "Denver"

Annotate each with an array type (not just a bare list).`,
          starterCode: `// Write your code below.

`,
          exports: ['temps', 'cities'],
          expectedTypes: { temps: 'number[]', cities: 'string[]' },
          hints: [
            'Array types name the element type, then show it is a list.',
            'Put the values in square brackets, in the order listed above.',
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
            
            `Do two things:

1. Define a type alias named \`Person\` with fields \`name\` (string) and \`score\` (number).
2. Create a \`const\` named \`player\`, annotated as \`Person\`, with name "Riley" and score 42.`,
          starterCode: `// Write your code below.

`,
          exports: ['player'],
          expectedTypes: { player: 'Person' },
          requireTypeAlias: ['Person'],
          requireConst: ['player'],
          hints: [
            'Define the type alias first, then create a value that uses it.',
            'The object fields must be named `name` and `score`.',
            'Annotate `player` with your `Person` type and match the values from the prompt.',
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

If you return a string from a function that is supposed to return a \`number\`, TypeScript reports an error before you run anything. That is the point of the annotations.`,
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

If the body returns the wrong type, or returns nothing when you said it would return a value, TypeScript reports an error.

In the challenge you will type the **whole function** yourself: name, parameter types, return type, and body. The prompt describes what the function must do — you choose how to write it.`,
        challenge: {
          id: 'ch-multiply',
          title: 'multiply(a, b)',
          prompt: 
            `Create a function named \`multiply\`.

It takes two numbers and returns a number: the product of those two inputs.

Type both parameters and the return value. Examples the tests check: multiply(3, 4) → 12, multiply(-2, 5) → -10.`,
          starterCode: `// Write your full function below (name, params, types, and body).

`,
          exports: ['multiply'],
          hints: [
            'Name the function exactly `multiply`.',
            'The body should return the product of the two parameters.',
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

You will write the whole function. The string you return has to match the format in the prompt.`,
        challenge: {
          id: 'ch-format',
          title: 'formatLabel',
          prompt:
            
            `Create a function named \`formatLabel\`.

It takes a name (string) and a count (number), and returns one string shaped like:

- formatLabel("Task", 3) → "Task (3)"
- formatLabel("Item", 0) → "Item (0)"

That is: the name, a space, then the count inside parentheses. Type the parameters and the return value.`,
          starterCode: `// Write your full function below (name, params, types, and body).

`,
          exports: ['formatLabel'],
          hints: [
            'Build a single string that includes both inputs.',
            'Watch spacing: there is a space before the opening parenthesis.',
            'Template literals (backticks) or concatenation both work — match the format exactly.',
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
            
            `1. Define a type alias \`LoadState\` that allows only these three strings: "idle", "loading", "error".
2. Create a function \`isLoading\` that takes a \`LoadState\` and returns a boolean: true only when the state is "loading", otherwise false.

Examples: isLoading("loading") → true; isLoading("idle") → false.`,
          starterCode: `// Write your full function below (name, params, types, and body).

`,
          exports: ['isLoading'],
          requireTypeAlias: ['LoadState'],
          hints: [
            'A string literal union lists the allowed values separated by `|`.',
            'You only need to check whether the input equals one specific string.',
            'A comparison already produces a boolean — you can return that result.',
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

In an interview, use \`map\` when you are building a new array of the same length. Don't push into the original array and hand that back. Return the array that \`map\` gives you.`,
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
          prompt: 
            `Create a function named \`doubleAll\`.

It takes an array of numbers and returns a new array where each number is doubled.

Examples: doubleAll([1, 2, 3]) → [2, 4, 6]; doubleAll([]) → []. Type the parameter and return value.`,
          starterCode: `// Write your full function below (name, params, types, and body).

`,
          exports: ['doubleAll'],
          hints: [
            'Use an array method that turns every item into a new value and returns a new array.',
            'Each output element should be twice the corresponding input.',
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

\`%\` is the remainder. \`n % 2 === 0\` means dividing \`n\` by 2 leaves nothing left over, so \`n\` is even.

Unlike \`map\`, the result can be shorter than the input. If nothing passes, you get \`[]\`.`,
        challenge: {
          id: 'ch-evens',
          title: 'onlyEvens',
          prompt: 
            `Create a function named \`onlyEvens\`.

It takes an array of numbers and returns a new array containing only the even numbers, in the same order.

Examples: onlyEvens([1, 2, 3, 4, 5]) → [2, 4]; onlyEvens([1, 3]) → []. Type the parameter and return value.`,
          starterCode: `// Write your full function below (name, params, types, and body).

`,
          exports: ['onlyEvens'],
          hints: [
            'Use an array method that keeps only some of the items.',
            'A number is even when dividing by 2 leaves no remainder.',
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
            
            `1. Define a type alias \`User\` with fields \`name\` (string) and \`active\` (boolean).
2. Create a function \`activeNames\` that takes an array of \`User\` and returns a string array: the names of users where \`active\` is true, in original order.

Example: if the users are A (active), B (not active), and C (active), return ["A", "C"].`,
          starterCode: `// Write your full function below (name, params, types, and body).

`,
          exports: ['activeNames'],
          requireTypeAlias: ['User'],
          hints: [
            'Two steps: keep only active users, then collect their names.',
            'You can chain those steps with the array methods from this module.',
            'Use the `active` field to decide who stays; use the `name` field for the output.',
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

\`find\` often returns \`Item | undefined\`, because the item might not be there. Whatever uses that result has to handle the missing case.

The challenge asks you to find an item by \`id\`. Use \`find\` when you only need the first match, instead of writing your own loop.`,
        challenge: {
          id: 'ch-find-by-id',
          title: 'findById',
          prompt:
            
            `1. Define a type alias \`Item\` with fields \`id\` (number) and \`label\` (string).
2. Create a function \`findById\` that takes an array of \`Item\` and an \`id\` number.
   Return the matching item, or \`undefined\` if none match.

Type the return as “item or undefined.”`,
          starterCode: `// Write your full function below (name, params, types, and body).

`,
          exports: ['findById'],
          requireTypeAlias: ['Item'],
          hints: [
            'Look for an array method that returns the first match, or undefined when nothing matches.',
            'Compare each item’s `id` to the `id` you were given.',
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

Next, you will write a function that sums an array of numbers with \`reduce\`.`,
        example: `// Read it as: start at 0, keep adding each number
[10, 5, 2].reduce((total, n) => total + n, 0)  // 17`,
        challenge: {
          id: 'ch-sum',
          title: 'sumNumbers',
          prompt: 
            `Create a function named \`sumNumbers\`.

It takes an array of numbers and returns their sum as a number. An empty array should return 0.

Examples: sumNumbers([1, 2, 3]) → 6; sumNumbers([]) → 0. Type the parameter and return value.`,
          starterCode: `// Write your full function below (name, params, types, and body).

`,
          exports: ['sumNumbers'],
          hints: [
            'Use the array method from this lesson that folds many values into one.',
            'Keep a running total and add each number into it.',
            'Start the total at 0 so an empty list still works.',
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
            
            `Create a function named \`asString\`.

It takes one value that may be either a string or a number, and always returns a string.

Behavior:
- If the value is a number, return it as text (example: 42 → "42").
- If the value is already a string, return it unchanged (example: "hi" → "hi").

Type the parameter as a union, type the return as string, and narrow before you treat the value as one type or the other.`,
          starterCode: `// Write your full function below (name, params, types, and body).

`,
          exports: ['asString'],
          hints: [
            'Use the narrowing tool from the lesson for primitives.',
            'Handle the number case by producing text; handle the string case by returning the same value.',
            'After you prove which branch you are in, TypeScript will treat the value as that type.',
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

Type both full function signatures yourself (including \`<T>\`), then fill in each body. Don't overthink it. The point is the generic type, not tricky logic.`,
        challenge: {
          id: 'ch-generics',
          title: 'identity + firstItem',
          prompt:
            
            `Create two generic functions:

1. \`identity\` — takes a value of some type \`T\` and returns that same value (still typed as \`T\`).
2. \`firstItem\` — takes an array of \`T\` and returns the first element, or \`undefined\` if the array is empty.

Both functions should use a type parameter \`<T>\`. Keep the bodies simple; the point is the generic signatures.`,
          starterCode: `// Write your full function below (name, params, types, and body).

`,
          exports: ['identity', 'firstItem'],
          hints: [
            '`identity` returns whatever it received, unchanged.',
            '`firstItem` returns the element at index 0.',
            'For an empty array, index 0 is `undefined` — that is expected.',
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
        content: `You already used \`map\` and \`filter\`. Coding tests also expect you to write ordinary loops.

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
        content: `\`push\` adds an item to the **end** of an array, and it changes that array:

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

\`filter\` can do the same job in one line. The loop and \`push\` version still matters, because a lot of interview exercises use both.`,
        challenge: {
          id: 'ch-collect-odds',
          title: 'collectOdds',
          prompt:
            
            `Create a function named \`collectOdds\`.

It takes an array of numbers and returns only the odd numbers, in order.

Build the result with a loop and \`push\`. Don't use \`filter\`.

Examples: collectOdds([1, 2, 3, 4, 5]) → [1, 3, 5]; collectOdds([2, 4]) → [].`,
          starterCode: `// Write your full function below (name, params, types, and body).

`,
          exports: ['collectOdds'],
          hints: [
            'Start with an empty typed result array, then walk the input.',
            'Decide whether each number is odd before adding it.',
            'Push matching values onto your result, then return it.',
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
            
            `1. Define a type alias \`Product\` with fields \`name\` (string) and \`price\` (number).
2. Create a function \`productLabels\` that takes an array of \`Product\` and returns a string array — one label per product.

Format each label like: "Mug — $12" (name, space, em dash —, space, dollar sign, price).

Example: a Mug that costs 12 and a Tea that costs 4 become ["Mug — $12", "Tea — $4"].`,
          starterCode: `// Write your full function below (name, params, types, and body).

`,
          exports: ['productLabels'],
          requireTypeAlias: ['Product'],
          hints: [
            'Transform each product into one string.',
            'Pull the name and price from each product object.',
            'Match the separator exactly: space, em dash (—), space, then `$` and the price.',
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
        content: `When someone clicks Add in a UI, you take the current list, make a **new** list that includes one more item, and show that new list.

Don't change the original array. Make a new one:

\`\`\`
function addTask(tasks: Task[], task: Task): Task[] {
  return [...tasks, task]
}
\`\`\`

\`[...tasks, task]\` copies every existing task, then puts the new one at the end.

\`tasks.push(task)\` changes the array you already have. React often won't notice, because you handed it the same array as before. Anyone else who still has that array will see the new item too.

If an interviewer asks, you can say: “I'll return a new array so the old list stays the same.”`,
        example: `type Task = { id: number; title: string }

const before: Task[] = [{ id: 1, title: "Write tests" }]
const after = [...before, { id: 2, title: "Ship it" }]
// before is still length 1; after has 2 items`,
        challenge: {
          id: 'ch-add-task',
          title: 'addTask',
          prompt:
            
            `1. Define a type alias \`Task\` with fields \`id\` (number) and \`title\` (string).
2. Create a function \`addTask\` that takes the current task list and a new task, and returns a new array with that task appended.

Don't change the original array. If you start with [{id:1,title:"A"}] and add {id:2,title:"B"}, the result should contain both tasks, and the array you were given should still contain only the first one.`,
          starterCode: `// Write your full function below (name, params, types, and body).

`,
          exports: ['addTask'],
          requireTypeAlias: ['Task'],
          hints: [
            'Return a brand-new array that contains the old tasks plus the new one.',
            'Don\'t use `push`, or anything else that changes the list you were given.',
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
              description: 'leaves the original list unchanged',
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
        content: `A list in memory usually needs four operations. People call this CRUD:

- **Create** — add an item (you did that in the last lesson)
- **Read** — find or filter items (you already practiced this)
- **Update** — change one item, usually by looking up its \`id\`
- **Delete** — remove one item by its \`id\`

To update one item, build a new array. Copy the matching object and change its label:

\`\`\`
items.map((item) =>
  item.id === id ? { ...item, label: newLabel } : item
)
\`\`\`

\`{ ...item, label: newLabel }\` copies the object and replaces \`label\` on the copy.

To delete one item, build a new array that leaves that item out:

\`\`\`
items.filter((item) => item.id !== id)
\`\`\`

Keep every item whose id is **not** the one you want to remove.

These are the two helpers behind Edit and Delete buttons in a lot of UI code.`,
        challenge: {
          id: 'ch-crud-items',
          title: 'updateLabel + removeById',
          prompt:
            
            `1. Define a type alias \`Item\` with fields \`id\` (number) and \`label\` (string).
2. Create \`updateLabel(items, id, label)\` — return a new array where the item with that \`id\` has the new \`label\`. Other items stay the same.
3. Create \`removeById(items, id)\` — return a new array without the item that has that \`id\`.

Don't change the arrays you were given, or the objects inside them.`,
          starterCode: `// Write your full function below (name, params, types, and body).

`,
          exports: ['updateLabel', 'removeById'],
          requireTypeAlias: ['Item'],
          hints: [
            'To update: go through every item. When the id matches, return a copy with the new label.',
            'The copy should keep the other fields and only change `label`.',
            'To delete: keep every item whose id is not the one you want to remove.',
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
              description: 'updateLabel leaves the original list unchanged',
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
        content: `This is a common interview question. You get typed objects, and you return one number.

Each cart line has a price and a flag for whether it is in stock. Add up the prices of the items that are in stock, and skip the rest. If the list is empty, return \`0\`.

Practice saying the steps out loud:
1. Keep only the in-stock items (\`filter\`)
2. Add up their prices (\`reduce\`, starting at \`0\`)

You could also use a \`for...of\` loop. Either way works. \`filter\` plus \`reduce\` is short, and it shows up a lot in take-home exercises.

Write the \`CartItem\` type and the full \`inStockTotal\` function yourself from the challenge prompt.`,
        challenge: {
          id: 'ch-cart-total',
          title: 'inStockTotal',
          prompt:
            
            `1. Define a type alias \`CartItem\` with fields \`name\` (string), \`price\` (number), and \`inStock\` (boolean).
2. Create a function \`inStockTotal\` that takes an array of \`CartItem\` and returns a number: the sum of \`price\` for items that are in stock. Skip items that are out of stock. If the list is empty, return 0.`,
          starterCode: `// Write your full function below (name, params, types, and body).

`,
          exports: ['inStockTotal'],
          requireTypeAlias: ['CartItem'],
          hints: [
            'First ignore items that are not in stock.',
            'Then add up the prices of what remains.',
            'Make sure an empty list still returns 0.',
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
            
            `1. Define a type alias \`Post\` with fields \`id\` (number) and \`tags\` (string array).
2. Create a function \`uniqueTags\` that takes an array of posts and returns one string array: every tag from every post, with duplicates removed, keeping first-seen order.

Example: one post tagged ["ts","react"], then another tagged ["react","node"], returns ["ts","react","node"].`,
          starterCode: `// Write your full function below (name, params, types, and body).

`,
          exports: ['uniqueTags'],
          requireTypeAlias: ['Post'],
          hints: [
            'First gather every tag from every post into one flat list.',
            'Then remove duplicates while preserving the order they first appeared.',
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
            
            `1. Define a type alias \`Person\` with fields \`name\` (string) and \`role\` (string).
2. Create a function \`groupByRole\` that takes an array of people and returns an object:
   - keys are role strings
   - values are arrays of names in that role, in the order you first see them

Example: A has the role dev, B has the role design, and C has the role dev. The result is { dev: ["A","C"], design: ["B"] }. An empty list returns {}.

Type the return value as an object whose keys are strings and whose values are arrays of strings.`,
          starterCode: `// Write your full function below (name, params, types, and body).

`,
          exports: ['groupByRole'],
          requireTypeAlias: ['Person'],
          hints: [
            'Build an object whose keys are roles and whose values are name lists.',
            'For each person, make sure that role already has an array, then add their name.',
            'Return the finished object.',
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
    ],
  },
  {
    id: 'optionals-callbacks',
    title: 'Module 13 — Optionals, nullish & callbacks',
    subtitle: '?, ??, optional chaining, and functions as values',
    lessons: [
      {
        id: 'optional-params',
        title: 'Optional properties and parameters',
        minutes: 14,
        content: `A \`?\` means “this might be missing.”

**On an object field:**

\`\`\`
type User = {
  name: string
  nickname?: string
}
\`\`\`

\`nickname\` can be left out. When you read it, the type is \`string | undefined\`.

**On a function parameter:**

\`\`\`
function greet(name: string, title?: string): string {
  if (title) {
    return title + " " + name
  }
  return name
}

greet("Sam")        // "Sam"
greet("Sam", "Dr.") // "Dr. Sam"
\`\`\`

Optional parameters must come **after** required ones.

Next you will write a greeting helper that uses an optional title.`,
        challenge: {
          id: 'ch-greet-optional',
          title: 'greet',
          prompt:
            
            `Create a function named \`greet\`.

It takes a required \`name\` (string) and an optional \`title\` (string), and returns a string:

- If a title is provided: title, then a space, then name (example: "Dr." + "Sam" → "Dr. Sam")
- If no title: just the name (example: greet("Sam") → "Sam")

Mark the title parameter as optional and type the return as string.`,
          starterCode: `// Write your full function below (name, params, types, and body).

`,
          exports: ['greet'],
          hints: [
            'Optional parameters are marked with `?` and come after required ones.',
            'Branch on whether a title was provided.',
            'When joining title and name, put a single space between them.',
          ],
          tests: [
            {
              description: 'greet("Sam")',
              run: (s) => {
                const greet = s.greet as (name: string, title?: string) => string
                eq(greet('Sam'), 'Sam')
              },
            },
            {
              description: 'greet("Sam", "Dr.")',
              run: (s) => {
                const greet = s.greet as (name: string, title?: string) => string
                eq(greet('Sam', 'Dr.'), 'Dr. Sam')
              },
            },
          ],
        },
      },
      {
        id: 'nullish-optional-chain',
        title: '?? and optional chaining',
        minutes: 14,
        content: `**Nullish coalescing (\`??\`)** picks the right side only when the left is \`null\` or \`undefined\`:

\`\`\`
const label = name ?? "Guest"
// null/undefined → "Guest"
// "" stays ""
// 0 stays 0
\`\`\`

That is different from \`||\`, which also treats \`""\` and \`0\` as missing.

**Optional chaining (\`?.\`)** safely reads a nested field that might not exist:

\`\`\`
user.profile?.email
// if profile is undefined → undefined (no crash)
\`\`\`

You can combine them:

\`\`\`
user.profile?.email ?? "none"
\`\`\`

Next, you will return a display name when the name might be missing or null.`,
        challenge: {
          id: 'ch-display-name',
          title: 'displayName',
          prompt:
            
            `Create a function named \`displayName\`.

It takes a \`user\` object that may have a \`name\` field (string, null, or missing). Return a string:

- If \`name\` is a real string, return it
- Otherwise return "Guest"

Use \`??\` from this lesson.`,
          starterCode: `// Write your full function below (name, params, types, and body).

`,
          exports: ['displayName'],
          hints: [
            'Read `user.name` and supply a fallback when it is missing.',
            'Nullish coalescing treats only null/undefined as missing (empty string stays).',
            'The fallback text must be exactly "Guest".',
          ],
          tests: [
            {
              description: 'uses the name when present',
              run: (s) => {
                const displayName = s.displayName as (u: {
                  name?: string | null
                }) => string
                eq(displayName({ name: 'Riley' }), 'Riley')
              },
            },
            {
              description: 'Guest when missing',
              run: (s) => {
                const displayName = s.displayName as (u: {
                  name?: string | null
                }) => string
                eq(displayName({}), 'Guest')
              },
            },
            {
              description: 'Guest when null',
              run: (s) => {
                const displayName = s.displayName as (u: {
                  name?: string | null
                }) => string
                eq(displayName({ name: null }), 'Guest')
              },
            },
          ],
        },
      },
      {
        id: 'callback-params',
        title: 'Functions as parameters (callbacks)',
        minutes: 15,
        content: `In TypeScript you can type a parameter that is itself a function:

\`\`\`
function applyAll(
  nums: number[],
  fn: (n: number) => number,
): number[] {
  return nums.map(fn)
}
\`\`\`

Read \`fn: (n: number) => number\` as: “a function that takes a number and returns a number.”

You pass that behavior in when you call the function:

\`\`\`
applyAll([1, 2, 3], (n) => n * 10)  // [10, 20, 30]
\`\`\`

This is how \`map\`, \`filter\`, and \`reduce\` are typed under the hood.

Next you will write \`applyAll\` yourself.`,
        challenge: {
          id: 'ch-apply-all',
          title: 'applyAll',
          prompt:
            
            `Create a function named \`applyAll\`.

It takes:
- an array of numbers
- a callback function that takes a number and returns a number

Return a new number array by applying that callback to every element.

Example: applyAll([1, 2, 3], n => n * 2) → [2, 4, 6]. Type the callback parameter as a function type.`,
          starterCode: `// Write your full function below (name, params, types, and body).

`,
          exports: ['applyAll'],
          hints: [
            'The second parameter’s type should describe “a function from number to number.”',
            'Apply the callback to each element and return the resulting array.',
          ],
          tests: [
            {
              description: 'doubles with a callback',
              run: (s) => {
                const applyAll = s.applyAll as (
                  nums: number[],
                  fn: (n: number) => number,
                ) => number[]
                eq(
                  applyAll([1, 2, 3], (n) => n * 2),
                  [2, 4, 6],
                )
              },
            },
            {
              description: 'empty array',
              run: (s) => {
                const applyAll = s.applyAll as (
                  nums: number[],
                  fn: (n: number) => number,
                ) => number[]
                eq(
                  applyAll([], (n) => n + 1),
                  [],
                )
              },
            },
          ],
        },
      },
    ],
  },
  {
    id: 'disc-unions-utils',
    title: 'Module 14 — Discriminated unions & Partial',
    subtitle: 'Tagged states and patch updates',
    lessons: [
      {
        id: 'disc-union-intro',
        title: 'Discriminated unions',
        minutes: 16,
        content: `A **discriminated union** (tagged union) is a union of objects that share one literal field — the tag — so TypeScript can tell the branches apart.

\`\`\`
type Result =
  | { ok: true; data: string }
  | { ok: false; error: string }
\`\`\`

Check the tag, then use the fields for that branch:

\`\`\`
function messageFrom(result: Result): string {
  if (result.ok) {
    return result.data
  }
  return result.error
}
\`\`\`

After \`if (result.ok)\`, TypeScript knows \`data\` exists. In the else branch, \`error\` exists.

This pattern shows up everywhere: loading/success/error UI state, API responses, Redux-style actions.`,
        example: `type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number }

function area(shape: Shape): number {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius * shape.radius
  }
  return shape.size * shape.size
}`,
        challenge: {
          id: 'ch-result-message',
          title: 'messageFrom',
          prompt:
            
            `1. Define a discriminated union type \`Result\`:
   - success: \`ok\` is true and there is a \`data\` string
   - failure: \`ok\` is false and there is an \`error\` string
2. Create a function \`messageFrom\` that takes a \`Result\` and returns a string: the \`data\` on success, or the \`error\` on failure.

Narrow on the \`ok\` tag before reading the branch-specific field.`,
          starterCode: `// Write your full type + function below.

`,
          exports: ['messageFrom'],
          requireTypeAlias: ['Result'],
          hints: [
            'Model success and failure as two object shapes that share an `ok` field.',
            'Check `ok` first so TypeScript knows which other field exists.',
            'Return the success payload or the error message depending on the branch.',
          ],
          tests: [
            {
              description: 'success branch',
              run: (s) => {
                const messageFrom = s.messageFrom as (
                  r: { ok: true; data: string } | { ok: false; error: string },
                ) => string
                eq(messageFrom({ ok: true, data: 'saved' }), 'saved')
              },
            },
            {
              description: 'error branch',
              run: (s) => {
                const messageFrom = s.messageFrom as (
                  r: { ok: true; data: string } | { ok: false; error: string },
                ) => string
                eq(messageFrom({ ok: false, error: 'nope' }), 'nope')
              },
            },
          ],
        },
      },
      {
        id: 'partial-patch',
        title: 'Partial for updates',
        minutes: 14,
        content: `\`Partial<T>\` makes every property of \`T\` optional. This is the usual type when an update only includes some of the fields:

\`\`\`
type User = { id: number; name: string; email: string }

function applyPatch(user: User, patch: Partial<User>): User {
  return { ...user, ...patch }
}
\`\`\`

You can pass only the fields that should change:

\`\`\`
applyPatch(user, { name: "Alex" })
\`\`\`

\`id\` and \`email\` stay the same. Because \`patch\` comes second, its fields replace the matching ones from the original user.

Don't change \`user\`. Return a new object.`,
        challenge: {
          id: 'ch-apply-patch',
          title: 'applyPatch',
          prompt:
            
            `1. Define a type alias \`User\` with fields \`id\` (number), \`name\` (string), and \`email\` (string).
2. Create a function \`applyPatch\` that takes a full \`User\` and a \`Partial<User>\` patch, and returns a new \`User\` with any provided patch fields applied on top.

Don't change the original user. If the patch is only \`{ name: "Alex" }\`, the id and email stay the same.`,
          starterCode: `// Write your full type + function below.

`,
          exports: ['applyPatch'],
          requireTypeAlias: ['User'],
          hints: [
            'Combine the original user with the patch into a new object.',
            'Fields from the patch should override matching fields from the user.',
            'Return the new object; do not assign into the original.',
          ],
          tests: [
            {
              description: 'patches name only',
              run: (s) => {
                const applyPatch = s.applyPatch as (
                  user: { id: number; name: string; email: string },
                  patch: Partial<{ id: number; name: string; email: string }>,
                ) => { id: number; name: string; email: string }
                eq(
                  applyPatch(
                    { id: 1, name: 'Sam', email: 's@x.com' },
                    { name: 'Alex' },
                  ),
                  { id: 1, name: 'Alex', email: 's@x.com' },
                )
              },
            },
            {
              description: 'empty patch returns same fields',
              run: (s) => {
                const applyPatch = s.applyPatch as (
                  user: { id: number; name: string; email: string },
                  patch: Partial<{ id: number; name: string; email: string }>,
                ) => { id: number; name: string; email: string }
                eq(
                  applyPatch({ id: 2, name: 'Jo', email: 'j@x.com' }, {}),
                  { id: 2, name: 'Jo', email: 'j@x.com' },
                )
              },
            },
          ],
        },
      },
    ],
  },
  {
    id: 'real-problems',
    title: 'Module 15 — Real problems',
    subtitle: 'Practice problems that look like work / interviews',
    lessons: [
      {
        id: 'real-search',
        title: 'Problem: search products',
        minutes: 20,
        content: `Searching a product list is a normal feature in a UI.

Each product has a \`name\` and a \`price\`. Return the products whose name contains the search text, ignoring capitalization. If a maximum price was provided, also leave out anything more expensive than that.

One way to do it:
1. Make the query lowercase with \`toLowerCase()\`
2. Use \`filter\` to keep products where \`name.toLowerCase().includes(query)\`
3. If \`maxPrice\` was provided, also keep only products where \`price <= maxPrice\`

This uses an optional parameter, string methods, and \`filter\`.`,
        challenge: {
          id: 'ch-search-products',
          title: 'searchProducts',
          prompt:
            
            `1. Define a type alias \`Product\` with fields \`name\` (string) and \`price\` (number).
2. Create a function \`searchProducts\` that takes products, a query string, and an optional \`maxPrice\` number.
   Return products whose name contains the query (case-insensitive). If \`maxPrice\` is provided, also require \`price <= maxPrice\`. Keep original order.`,
          starterCode: `// Write your full type + function below.

`,
          exports: ['searchProducts'],
          requireTypeAlias: ['Product'],
          hints: [
            'Normalize casing before comparing name text to the query.',
            'Only enforce the price limit when `maxPrice` was actually passed.',
            'Keep products that pass the checks, in the same order they appeared.',
          ],
          tests: [
            {
              description: 'filters by query',
              run: (s) => {
                const searchProducts = s.searchProducts as (
                  products: { name: string; price: number }[],
                  query: string,
                  maxPrice?: number,
                ) => { name: string; price: number }[]
                eq(
                  searchProducts(
                    [
                      { name: 'Green Tea', price: 4 },
                      { name: 'Coffee', price: 5 },
                      { name: 'Black Tea', price: 3 },
                    ],
                    'tea',
                  ),
                  [
                    { name: 'Green Tea', price: 4 },
                    { name: 'Black Tea', price: 3 },
                  ],
                )
              },
            },
            {
              description: 'applies maxPrice when provided',
              run: (s) => {
                const searchProducts = s.searchProducts as (
                  products: { name: string; price: number }[],
                  query: string,
                  maxPrice?: number,
                ) => { name: string; price: number }[]
                eq(
                  searchProducts(
                    [
                      { name: 'Green Tea', price: 4 },
                      { name: 'Black Tea', price: 3 },
                    ],
                    'tea',
                    3,
                  ),
                  [{ name: 'Black Tea', price: 3 }],
                )
              },
            },
          ],
        },
      },
      {
        id: 'real-paginate',
        title: 'Problem: paginate a list',
        minutes: 18,
        content: `APIs and tables often show one “page” of a list.

For 1-based \`page\` and a \`pageSize\`:

- page 1 → items \`0\` through \`pageSize - 1\`
- page 2 → next \`pageSize\` items
- Use \`slice(start, end)\`

\`\`\`
const start = (page - 1) * pageSize
items.slice(start, start + pageSize)
\`\`\`

If the page is past the end, \`slice\` just returns \`[]\`.`,
        challenge: {
          id: 'ch-paginate',
          title: 'paginate',
          prompt:
            
            `Create a generic function named \`paginate\`.

It takes an array of \`T\`, a 1-based \`page\` number, and a \`pageSize\`, and returns that page’s slice of items (still typed as \`T[]\`).

Examples with ["a","b","c","d"], pageSize 2:
- page 1 → ["a","b"]
- page 2 → ["c","d"]
- a page past the end → []`,
          starterCode: `// Write your full function below (name, params, types, and body).

`,
          exports: ['paginate'],
          hints: [
            'Page 1 starts at index 0; page 2 starts after one pageSize of items.',
            'Compute a start index from page and pageSize, then take that many items.',
            'Use the array method that copies a section of the list and leaves the original alone.',
          ],
          tests: [
            {
              description: 'page 1',
              run: (s) => {
                const paginate = s.paginate as <T>(
                  items: T[],
                  page: number,
                  pageSize: number,
                ) => T[]
                eq(paginate(['a', 'b', 'c', 'd'], 1, 2), ['a', 'b'])
              },
            },
            {
              description: 'page 2',
              run: (s) => {
                const paginate = s.paginate as <T>(
                  items: T[],
                  page: number,
                  pageSize: number,
                ) => T[]
                eq(paginate(['a', 'b', 'c', 'd'], 2, 2), ['c', 'd'])
              },
            },
            {
              description: 'past the end',
              run: (s) => {
                const paginate = s.paginate as <T>(
                  items: T[],
                  page: number,
                  pageSize: number,
                ) => T[]
                eq(paginate(['a'], 3, 2), [])
              },
            },
          ],
        },
      },
      {
        id: 'real-merge',
        title: 'Problem: merge records by id',
        minutes: 20,
        content: `You have a local list and a newer list from the server. Combine them by \`id\`. If an incoming item has the same id as one you already have, use the incoming version. If the id is new, add it at the end.

One way to do it:
1. Start from a copy of the existing list, so you don't change the original.
2. For each incoming item, replace the match if that id is already there. Otherwise, add the item.

You can also build an object keyed by id. Put the existing items in first, then the incoming ones, and then turn the values back into an array.

Keep the existing items in their original order. After those, add any new ids in the order they show up in the incoming list.`,
        challenge: {
          id: 'ch-merge-by-id',
          title: 'mergeById',
          prompt:
            
            `1. Define a type alias \`Item\` with fields \`id\` (number) and \`label\` (string).
2. Create a function \`mergeById\` that takes \`existing\` and \`incoming\` item arrays and returns a merged array:
   - If an incoming item shares an id with an existing one, replace it with the incoming version
   - If the id is new, append it
   - Keep existing order for old ids; append brand-new ids in incoming order

Don't change either of the arrays you were given.`,
          starterCode: `// Write your full type + function below.

`,
          exports: ['mergeById'],
          requireTypeAlias: ['Item'],
          hints: [
            'Work from a copy (or build a new list) so the originals stay unchanged.',
            'For each incoming item, decide: replace a matching id, or append as new.',
          ],
          tests: [
            {
              description: 'overwrites matching id and appends new',
              run: (s) => {
                const mergeById = s.mergeById as (
                  existing: { id: number; label: string }[],
                  incoming: { id: number; label: string }[],
                ) => { id: number; label: string }[]
                eq(
                  mergeById(
                    [
                      { id: 1, label: 'A' },
                      { id: 2, label: 'B' },
                    ],
                    [
                      { id: 2, label: 'B2' },
                      { id: 3, label: 'C' },
                    ],
                  ),
                  [
                    { id: 1, label: 'A' },
                    { id: 2, label: 'B2' },
                    { id: 3, label: 'C' },
                  ],
                )
              },
            },
            {
              description: 'leaves the existing list unchanged',
              run: (s) => {
                const mergeById = s.mergeById as (
                  existing: { id: number; label: string }[],
                  incoming: { id: number; label: string }[],
                ) => { id: number; label: string }[]
                const existing = [{ id: 1, label: 'A' }]
                const snapshot = JSON.stringify(existing)
                mergeById(existing, [{ id: 1, label: 'Z' }])
                eq(JSON.stringify(existing), snapshot, 'existing')
              },
            },
          ],
        },
      },
      {
        id: 'real-leaderboard',
        title: 'Problem: top N leaderboard',
        minutes: 18,
        content: `You get a list of names and scores. Return the names of the top \`n\`, with the highest score first.

Do it in four steps:
1. Copy the array before you sort it. \`sort\` changes the array you call it on.
2. Sort from high score to low: \`(a, b) => b.score - a.score\`
3. Keep the first \`n\` items with \`slice(0, n)\`
4. Turn those items into names with \`map\`

If two scores are equal, either order is fine. These tests use different scores.`,
        challenge: {
          id: 'ch-top-n',
          title: 'topNames',
          prompt:
            
            `1. Define a type alias \`Entry\` with fields \`name\` (string) and \`score\` (number).
2. Create a function \`topNames\` that takes entries and a number \`n\`, and returns the names of the top \`n\` scores, highest first.

Don't change the array you were given. For example, if A scored 3, B scored 9, and C scored 6, and n is 2, return ["B", "C"].`,
          starterCode: `// Write your full type + function below.

`,
          exports: ['topNames'],
          requireTypeAlias: ['Entry'],
          hints: [
            'Sort by score from high to low, but do not mutate the original list.',
            'After sorting, keep only the first `n` entries.',
            'Return just their names.',
          ],
          tests: [
            {
              description: 'returns top 2 names',
              run: (s) => {
                const topNames = s.topNames as (
                  entries: { name: string; score: number }[],
                  n: number,
                ) => string[]
                eq(
                  topNames(
                    [
                      { name: 'A', score: 3 },
                      { name: 'B', score: 9 },
                      { name: 'C', score: 6 },
                    ],
                    2,
                  ),
                  ['B', 'C'],
                )
              },
            },
            {
              description: 'n larger than length',
              run: (s) => {
                const topNames = s.topNames as (
                  entries: { name: string; score: number }[],
                  n: number,
                ) => string[]
                eq(topNames([{ name: 'A', score: 1 }], 5), ['A'])
              },
            },
          ],
        },
      },
      {
        id: 'graduation',
        title: 'You made it — keep drilling',
        minutes: 5,
        content: `You covered beginner through intermediate TypeScript for live coding:

- Primitive annotations, let / const
- Arrays, objects, type aliases
- Functions (params, returns, callbacks, generics)
- Unions, optionals, \`??\`, optional chaining
- Discriminated unions and \`Partial\` patches
- map / filter / find / reduce / sort / slice
- for loops, push, list CRUD
- Real problems: search, pagination, merge-by-id, leaderboard

For the next few days before your test:
1. Redo Module 12 and Module 15 with a timer (aim for under 15–20 minutes each)
2. Say the types out loud as you type
3. When an answer looks like UI state, return a new array or object (\`map\` or spread) instead of changing the one you were given

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
