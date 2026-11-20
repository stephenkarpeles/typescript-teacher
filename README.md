# TS Refresh

A hands-on TypeScript teaching gym.

## How to use

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

1. Read each short lesson (assumes zero TypeScript knowledge).
2. Complete the challenge in the editor.
3. Hit **Run tests** — you must pass to unlock the next lesson.
4. Use **Get hint** if you are stuck (hints reveal one at a time).

Progress and your code drafts are saved in the browser (`localStorage`).

## Course arc (~6–8 hours)

1. What TypeScript is  
2. Primitive types & `let` / `const`  
3. Arrays  
4. Objects & type aliases  
5. Functions  
6. Unions & optionals  
7. `map` / `filter`  
8. `find` / `reduce`  
9. Narrowing  
10. Interfaces & light generics  
11. Loops, `push`, mapping datasets, list CRUD (add / update / delete)  
12. Interview drills (cart total, unique tags, group by)  
13. Optionals, `??`, optional chaining, callbacks  
14. Discriminated unions & `Partial` patches  
15. Real problems (search, paginate, merge-by-id, leaderboard)

## Scripts

- `npm run dev` — local teaching app
- `npm run build` — production build
- `npm run preview` — preview the build
- `npm run audit:challenges` — verify every challenge solution passes and known wrong answers fail
