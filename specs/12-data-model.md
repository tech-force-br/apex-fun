# 12 — Data model (v1 sketch)

Store in Supabase Postgres. Exact column names can change at implement time. Meaning must not.

## Identity

- Supabase Auth users
- Profile row: language (`en` | `pt-BR`), `is_admin` (only the owner)

Row Level Security: a student reads and writes only their own progress. Admin bypasses for the progress view.

## Content (owner-edited)

- `modules` — name EN/PT, sort order, locked flag / coming-later flag
- `topics` — module id, name EN/PT, sort order
- `cards` — topic id, type (`theory` | `exercise`), sort order
- `theory_cards` — body EN/PT, optional image refs, optional read-only Apex sample
- `exercises` — prompt EN/PT
- `hidden_tests` — exercise id, sort order, mode (`run_clean` | `compile_fail`), check Apex, match text, message EN/PT

## Progress

- `exercise_progress`
  - user id, exercise id
  - `passed` (stays true after first pass)
  - `first_run_clean` (set on first Run only; never changed by Retry)
  - `attempt_count`
  - `passing_code` (last successful snippet; null if never passed)
  - timestamps

On module restart for under 90%: delete that user’s progress and passing code for every exercise in the module.

## What we do not store

- Draft editor text
- Which exercises were not clean, as a student-facing list (we may still have `first_run_clean` in the database for the results count)

## Related

Back: [11-tech-architecture.md](11-tech-architecture.md)
Next: [13-runner.md](13-runner.md)
