/** Canonical solutions for audit only — never shown in the UI. */
export const solutions: Record<string, string> = {
  'ch-hello': `let greeting: string = "Hello, TypeScript"
let year: number = 2026
`,

  'ch-primitives': `const productName: string = "Widget"
let inStock: boolean = true
let quantity: number = 12
`,

  'ch-status': `let isActive: boolean = false
let status: string = "paused"
`,

  'ch-arrays': `const temps: number[] = [72, 68, 75]
const cities: string[] = ["Austin", "Denver"]
`,

  'ch-person': `type Person = {
  name: string
  score: number
}

const player: Person = {
  name: "Riley",
  score: 42,
}
`,

  'ch-multiply': `function multiply(a: number, b: number): number {
  return a * b
}
`,

  'ch-format': `function formatLabel(name: string, count: number): string {
  return \`\${name} (\${count})\`
}
`,

  'ch-union-status': `type LoadState = "idle" | "loading" | "error"

function isLoading(state: LoadState): boolean {
  return state === "loading"
}
`,

  'ch-double-all': `function doubleAll(nums: number[]): number[] {
  return nums.map((n) => n * 2)
}
`,

  'ch-evens': `function onlyEvens(nums: number[]): number[] {
  return nums.filter((n) => n % 2 === 0)
}
`,

  'ch-active-names': `type User = { name: string; active: boolean }

function activeNames(users: User[]): string[] {
  return users.filter((u) => u.active).map((u) => u.name)
}
`,

  'ch-find-by-id': `type Item = { id: number; label: string }

function findById(items: Item[], id: number): Item | undefined {
  return items.find((item) => item.id === id)
}
`,

  'ch-sum': `function sumNumbers(nums: number[]): number {
  return nums.reduce((total, n) => total + n, 0)
}
`,

  'ch-to-string': `function asString(value: string | number): string {
  if (typeof value === "number") {
    return String(value)
  }
  return value
}
`,

  'ch-generics': `function identity<T>(value: T): T {
  return value
}

function firstItem<T>(items: T[]): T | undefined {
  return items[0]
}
`,

  'ch-collect-odds': `function collectOdds(nums: number[]): number[] {
  const result: number[] = []
  for (const n of nums) {
    if (n % 2 !== 0) {
      result.push(n)
    }
  }
  return result
}
`,

  'ch-product-labels': `type Product = { name: string; price: number }

function productLabels(products: Product[]): string[] {
  return products.map((p) => \`\${p.name} — $\${p.price}\`)
}
`,

  'ch-add-task': `type Task = { id: number; title: string }

function addTask(tasks: Task[], task: Task): Task[] {
  return [...tasks, task]
}
`,

  'ch-crud-items': `type Item = { id: number; label: string }

function updateLabel(items: Item[], id: number, label: string): Item[] {
  return items.map((item) =>
    item.id === id ? { ...item, label } : item,
  )
}

function removeById(items: Item[], id: number): Item[] {
  return items.filter((item) => item.id !== id)
}
`,

  'ch-cart-total': `type CartItem = {
  name: string
  price: number
  inStock: boolean
}

function inStockTotal(items: CartItem[]): number {
  return items
    .filter((item) => item.inStock)
    .reduce((sum, item) => sum + item.price, 0)
}
`,

  'ch-unique-tags': `type Post = { id: number; tags: string[] }

function uniqueTags(posts: Post[]): string[] {
  return Array.from(new Set(posts.flatMap((p) => p.tags)))
}
`,

  'ch-group-by-role': `type Person = { name: string; role: string }

function groupByRole(people: Person[]): Record<string, string[]> {
  const result: Record<string, string[]> = {}
  for (const person of people) {
    if (!result[person.role]) {
      result[person.role] = []
    }
    result[person.role].push(person.name)
  }
  return result
}
`,
}

/** Known incorrect snippets that must fail. */
export const intentionalFailures: Record<
  string,
  { code: string; reason: string }[]
> = {
  'ch-hello': [
    {
      reason: 'untyped JS should fail',
      code: `let greeting = "Hello, TypeScript"
let year = 2026
`,
    },
    {
      reason: 'wrong string case should fail',
      code: `let greeting: string = "Hello, Typescript"
let year: number = 2026
`,
    },
    {
      reason: 'string assigned to number should fail typecheck',
      code: `let greeting: string = "Hello, TypeScript"
let year: number = "2026"
`,
    },
    {
      reason: 'wrong annotation type on year should fail',
      code: `let greeting: string = "Hello, TypeScript"
let year: string = "2026"
`,
    },
    {
      reason: 'as any escape hatch should fail',
      code: `let greeting: string = "Hello, TypeScript"
let year: number = "2026" as any
`,
    },
  ],
  'ch-status': [
    {
      reason: 'false must be allowed and typed',
      code: `let isActive = false
let status: string = "paused"
`,
    },
  ],
  'ch-primitives': [
    {
      reason: 'productName must be const',
      code: `let productName: string = "Widget"
let inStock: boolean = true
let quantity: number = 12
`,
    },
  ],
  'ch-person': [
    {
      reason: 'inline object type without Person alias should fail',
      code: `const player: { name: string; score: number } = {
  name: "Riley",
  score: 42,
}
`,
    },
  ],
  'ch-multiply': [
    {
      reason: 'untyped function params should fail',
      code: `function multiply(a, b) {
  return a * b
}
`,
    },
  ],
  'ch-double-all': [
    {
      reason: 'wrong doubling logic should fail',
      code: `function doubleAll(nums: number[]): number[] {
  return nums.map((n) => n + 2)
}
`,
    },
  ],
  'ch-add-task': [
    {
      reason: 'mutating push should fail non-mutation test',
      code: `type Task = { id: number; title: string }

function addTask(tasks: Task[], task: Task): Task[] {
  tasks.push(task)
  return tasks
}
`,
    },
  ],
  'ch-collect-odds': [
    {
      reason: 'keeping evens should fail',
      code: `function collectOdds(nums: number[]): number[] {
  const result: number[] = []
  for (const n of nums) {
    if (n % 2 === 0) {
      result.push(n)
    }
  }
  return result
}
`,
    },
  ],
}
