# ApexFun

Website that teaches Salesforce Apex with short theory and many small, checked exercises. Specs: [`specs/00-index.md`](specs/00-index.md).

## Apps

- `apps/web` — Next.js + TypeScript + Tailwind
- `apps/runner` — TypeScript service that will run student Apex with [aer](https://github.com/octoberswimmer/aer-dist)

## Setup

Requires Node.js 20.9 or later (this machine has 22).

```bash
npm install
cp .env.example apps/web/.env.local
cp .env.example apps/runner/.env
```

Fill Supabase keys when you have a project. `RUNNER_SECRET` is a shared string the site and runner both know.

```bash
npm run dev
```

http://localhost:3000

```bash
npm run dev:runner
```

http://127.0.0.1:8787/health

## aer (private use)

Download the Windows build from [aer-dist releases](https://github.com/octoberswimmer/aer-dist/releases) (`aer_windows_amd64_v1.4.9.zip` or newer), put `aer.exe` in `tools/aer/`, and set `AER_BIN` if the runner should not use `aer` from `PATH`.

aer is proprietary. Use it only to build and test privately until October Swimmer licenses public use.

## Not decided yet

See `specs/15-open-questions.md` — including which i18n library to use, exact aer CLI flags, and runner timeout.
