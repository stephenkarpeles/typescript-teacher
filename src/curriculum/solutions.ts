/** Canonical solutions + explanations — revealed in the UI only after all hints. */
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

  'ch-greet-optional': `function greet(name: string, title?: string): string {
  if (title) {
    return title + " " + name
  }
  return name
}
`,

  'ch-display-name': `function displayName(user: { name?: string | null }): string {
  return user.name ?? "Guest"
}
`,

  'ch-apply-all': `function applyAll(nums: number[], fn: (n: number) => number): number[] {
  return nums.map(fn)
}
`,

  'ch-result-message': `type Result =
  | { ok: true; data: string }
  | { ok: false; error: string }

function messageFrom(result: Result): string {
  if (result.ok) {
    return result.data
  }
  return result.error
}
`,

  'ch-apply-patch': `type User = { id: number; name: string; email: string }

function applyPatch(user: User, patch: Partial<User>): User {
  return { ...user, ...patch }
}
`,

  'ch-search-products': `type Product = { name: string; price: number }

function searchProducts(
  products: Product[],
  query: string,
  maxPrice?: number,
): Product[] {
  const q = query.toLowerCase()
  return products.filter((p) => {
    const matchesName = p.name.toLowerCase().includes(q)
    if (maxPrice === undefined) return matchesName
    return matchesName && p.price <= maxPrice
  })
}
`,

  'ch-paginate': `function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize
  return items.slice(start, start + pageSize)
}
`,

  'ch-merge-by-id': `type Item = { id: number; label: string }

function mergeById(existing: Item[], incoming: Item[]): Item[] {
  const result = existing.map((item) => ({ ...item }))
  for (const item of incoming) {
    const idx = result.findIndex((e) => e.id === item.id)
    if (idx >= 0) {
      result[idx] = item
    } else {
      result.push(item)
    }
  }
  return result
}
`,

  'ch-top-n': `type Entry = { name: string; score: number }

function topNames(entries: Entry[], n: number): string[] {
  return [...entries]
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((e) => e.name)
}
`,
}

/** Short teaching notes shown with the revealed solution. */
export const solutionExplanations: Record<string, string> = {
  'ch-hello':
    'Type annotations sit after the name (`name: type`). Strings use quotes; numbers do not. The greeting must match the prompt character-for-character.',
  'ch-primitives':
    '`productName` is fixed, so use `const`. `inStock` and `quantity` can change, so `let` is fine. Each binding still gets an explicit type.',
  'ch-status':
    'Booleans are `true` / `false` with no quotes. Annotating `isActive: boolean` lets you assign `false` safely; `status` is ordinary text.',
  'ch-arrays':
    '`number[]` and `string[]` mean “array of that element type.” Write the values in square brackets with commas between them.',
  'ch-person':
    'Declare a `Person` type alias with the shape, then annotate `player` as `Person`. That teaches reusable object shapes instead of one-off inline types.',
  'ch-multiply':
    'Parameter and return types go on the function signature. Inside the body you just multiply and return — TypeScript already knows the result is a `number`.',
  'ch-format':
    'A template literal (`\`...\${...}\``) builds the label string. Both parameters are typed so callers cannot pass the wrong kinds of values.',
  'ch-union-status':
    'A string-literal union limits `LoadState` to three exact values. `isLoading` is a simple equality check against `"loading"`.',
  'ch-double-all':
    '`map` walks every element and returns a new array. Multiplying by 2 keeps the array length the same while transforming each number.',
  'ch-evens':
    '`filter` keeps only items that pass a test. `n % 2 === 0` is the usual “even number” check.',
  'ch-active-names':
    'Chain `filter` then `map`: first drop inactive users, then project each remaining user down to just their `name`.',
  'ch-find-by-id':
    '`find` returns the first match or `undefined`. The return type `Item | undefined` reflects that the id might not exist.',
  'ch-sum':
    '`reduce` folds an array into one value. Start the accumulator at `0`, then add each number as you go.',
  'ch-to-string':
    'Narrow the union with `typeof`. Once you know it is a `number`, convert it; otherwise it is already a `string` and you can return it.',
  'ch-generics':
    '`<T>` is a type parameter: whatever type goes in comes back out. `firstItem` returns `T | undefined` because an empty array has no first element.',
  'ch-collect-odds':
    'A manual loop builds a new array. Push only when `n % 2 !== 0` so you collect odds without mutating the input.',
  'ch-product-labels':
    '`map` turns each product into a display string. The template literal inserts `name` and `price` in the required format.',
  'ch-add-task':
    'Spread (`...tasks`) copies the old list into a new array, then appends `task`. That avoids mutating the original array with `push`.',
  'ch-crud-items':
    '`updateLabel` uses `map` plus a spread to replace one item immutably. `removeById` uses `filter` to drop the matching id.',
  'ch-cart-total':
    'Filter to in-stock items first, then `reduce` their prices. Splitting the steps keeps the intent clear: select, then sum.',
  'ch-unique-tags':
    '`flatMap` gathers every tag into one list; `Set` removes duplicates; `Array.from` turns the set back into an array.',
  'ch-group-by-role':
    'Build a `Record<string, string[]>` while iterating. Initialize each role’s array the first time you see it, then push names into that bucket.',
  'ch-greet-optional':
    '`title?` means the argument may be omitted. If it is present (truthy), prefix the name; otherwise return the name alone.',
  'ch-display-name':
    'Nullish coalescing (`??`) falls back only for `null` or `undefined`, so an empty string would still count as a provided name — here we treat missing names as `"Guest"`.',
  'ch-apply-all':
    'Higher-order functions take a callback. Passing `fn` straight into `map` applies that transformer to every number.',
  'ch-result-message':
    'A discriminated union uses `ok` as the tag. Checking `result.ok` narrows the type so TypeScript knows whether `data` or `error` exists.',
  'ch-apply-patch':
    '`Partial<User>` makes every field optional. Spreading `user` then `patch` overlays only the fields the patch actually provided.',
  'ch-search-products':
    'Normalize the query with `toLowerCase`, then filter. If `maxPrice` is omitted, name match alone is enough; otherwise also enforce the price cap.',
  'ch-paginate':
    'Page 1 starts at index 0. The start index is `(page - 1) * pageSize`, and `slice` returns that window of the array.',
  'ch-merge-by-id':
    'Copy `existing` first so you do not mutate inputs. For each incoming item, replace by id if found; otherwise append it.',
  'ch-top-n':
    'Copy before sorting so the original stays intact. Sort by score descending, take the first `n` with `slice`, then map to names.',
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
