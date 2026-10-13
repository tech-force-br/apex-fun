# 11 — Tech architecture

## Shape

ApexFun is a **standalone website**. It is not built on Salesforce. Students never need an org.

```
Browser (React / Next.js)
    └── Server Actions on Vercel
            ├── Supabase (Auth + Postgres)
            └── HTTPS → runner box
                            └── aer exec
```

## Locked stack

| Piece | Choice |
|---|---|
| Web app | Next.js + TypeScript (React) |
| Styles | Tailwind + custom theme |
| Auth | Supabase Auth (email/password + Google) |
| Database | Supabase Postgres |
| Student editor | CodeMirror 6 |
| Site host | Vercel (Hobby while private; plan Pro for a public product) |
| Runner host | Small always-on box (Fly.io, Railway, or VPS) |
| Runner app | TypeScript service that shells to `aer` |
| Repo | One monorepo: `apps/web`, `apps/runner` |

## Why aer is not on Vercel

aer is an installed program. Vercel Server Actions are short functions with no safe place to run strangers’ Apex next to accounts. Server Actions **call** the runner. They do not **be** the runner.

Do not run student Apex in Supabase Edge Functions either.

## Build path

1. Laptop: Next.js + local aer (free)
2. Private preview: Vercel Hobby + small runner box when a shared URL is needed
3. Public: Vercel Pro-class site + sized runner + aer license from October Swimmer

## Server Action on Run

1. Confirm the user is logged in
2. Load the exercise, its run-clean hidden tests, and the shared compile-fail list
3. Compile the student snippet on its own. If it does not compile, match the shared compile-fail list and stop. If it compiles, run the card's run-clean tests in card order until one fails. An empty shared list still stops on a compile error and shows the Apex error only.
4. For each test, until one fails: build that test's program (see [13-runner.md](13-runner.md)), POST it to the runner with a shared secret, and score it.
5. Save pass / first-try / passing code in Supabase
6. Return log + pass/fail + the first student message if any

Laptop slice: the action reads the mock session cookie, loads the seed exercise (or, for owner preview, the draft test). Owner preview of a run-clean test also receives the compile-fail list saved in the tab. The action calls the local runner and returns the log. It does not write Supabase. The page marks the card finished only after a pass, in tab memory.

## Related

Back: [10-visual-design.md](10-visual-design.md)
Next: [12-data-model.md](12-data-model.md)
