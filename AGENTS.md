# ApexFun

Product and tech rules live in `specs/`. Start at `specs/00-index.md`. Do not invent answers to `specs/15-open-questions.md`.

Do not make any change that contradicts the specs. If a change would contradict them, stop, tell the owner what you want to do and which spec it conflicts with, and wait for a yes or no. On yes, edit the spec first so it matches the new decision, then make the change. On no, leave both the spec and the code as they are.

Next.js-specific agent notes: `apps/web/AGENTS.md`.

## Stack (locked)

| Piece | Choice |
|---|---|
| Web | `apps/web` — Next.js + TypeScript |
| Styles | Tailwind + custom space theme |
| Auth / DB | Supabase Auth + Postgres |
| Editor | CodeMirror 6 |
| Runner | `apps/runner` — TypeScript service that will shell to `aer` |
| Repo | one npm workspaces monorepo |

Server Actions on the Next.js site must call the runner over HTTP. They must not run `aer` on Vercel or in Supabase Edge Functions.

## aer license

Use aer only to build and test privately. Before any public launch, get a license from October Swimmer that covers the site. Do not fork aer to dodge the license.

## Commands

```bash
npm install
npm run dev          # Next.js at http://localhost:3000
npm run dev:runner   # runner at http://127.0.0.1:8787
npm run build
```
