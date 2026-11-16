# 12 — Data model (v1 sketch)

Store in Supabase Postgres. Content and progress column names can change at implement time. Meaning must not. The login columns in this file are fixed.

## Build order

Login first. Create `public.profiles` and its access rules before the content tables and before `exercise_progress`.

## Identity

Supabase Auth owns login. The app does not add a `students` table or an `admins` table, and it does not change `auth.users`.

One account is one `auth.users` row and one `public.profiles` row. A student and the owner are the same kind of account. `is_admin` is true only for the owner. The student-view switch in [08-content-admin.md](08-content-admin.md) is UI state on that account. It is not a second row and not a second role.

Email/password and Google are two sign-in methods on that account. The same verified email stays one user, so progress stays on one profile. The JWT `role` claim stays `authenticated`. That claim means the person is logged in. Admin is `profiles.is_admin`.

`public.profiles` is the only login table the app adds. Supabase does not create it.

| Column | Meaning |
|---|---|
| `id` | Same uuid as `auth.users.id`. Primary key. `on delete cascade`. |
| `language` | `en` or `pt-BR`. Chosen at signup. The learner can change it later. See [09-languages.md](09-languages.md). |
| `is_admin` | `false` on every signup. `true` only for the owner. |
| `email` | Copy of `auth.users.email`, kept in sync when the auth email is inserted or changed. The admin screen finds a student from this column. `auth.users` is not on the API. |
| `created_at` | When the profile was created. |

Signup collects `en` or `pt-BR`. A trigger on insert into `auth.users` inserts the profile with `is_admin = false` and that language. User metadata may carry the language into the trigger. That metadata is only a hint for this insert. Later language changes are written on `profiles` and are not overwritten from metadata. The learner does not reach the study map without a language on the profile.

The browser cannot set `is_admin`. Ignore any `is_admin` value in user metadata. There is no screen that grants admin. After the owner account exists, set `is_admin` once in SQL.

Row level security is on.

- A learner can read their own profile and can update `language`. They cannot change `is_admin` or `email`.
- Inserts into `profiles` come from the signup trigger. The client does not insert or delete profiles.
- `is_admin()` is a `security definer` function that reads `profiles` for `auth.uid()`. Policies use it so the owner can read every profile and, once progress exists, every progress row.
- A student reads and writes only their own progress. The owner bypasses that for the progress view.
- The service-role key stays on the server. A logged-in session plus these policies is how the site checks who is signed in.

## Content (owner-edited)

- `modules` — name EN/PT, sort order, locked flag / coming-later flag
- `topics` — module id, name EN/PT, sort order
- `cards` — topic id, type (`theory` | `exercise`), sort order
- `theory_cards` — rich-text body EN/PT (paragraphs, bullets, bold, italic, underline, inline images), optional read-only Apex sample
- `exercises` — rich-text prompt EN/PT (paragraphs, bullets, bold, italic, underline, inline images)
- `hidden_tests` — exercise id, sort order, check Apex, message EN/PT, sample preview code, value replacements (variable name, new Apex value). Run-clean only. An empty replacement list leaves the student snippet unchanged
- `compile_fail_tests` — site-wide, no exercise id, sort order, sample preview code, exactly one match (match text, message EN/PT). No check Apex. Every exercise uses this list

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

- Draft editor text. The open tab may keep it until a reload. It is not written to the account.
- Which exercises were not clean, as a student-facing list (we may still have `first_run_clean` in the database for the results count)

## Related

Back: [11-tech-architecture.md](11-tech-architecture.md)
Next: [13-runner.md](13-runner.md)
