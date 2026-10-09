# 08 — Content admin

## Who

Only the site owner is admin in v1. No other teachers.

## Admin can

- Add and edit theory cards
- Add and edit exercise cards
- Reorder cards inside a module
- Add topic folders inside a module
- Create new modules
- View a student’s progress
- Paste freely while writing content
- Preview an exercise against sample student code
- Open every module, topic, and card on the study map, including modules marked coming later. This does not mark them finished

## Save rules

Blocked until filled:

- English and Portuguese for every theory card body
- English and Portuguese for every exercise prompt
- English and Portuguese student messages on every run-clean test, and on every compile-fail match set
- At least one match set on every compile-fail test, each with match text
- At least one hidden test per exercise

Apex samples and run-clean hidden-check Apex stay English. Compile-fail tests have no check Apex.

## Builder fields on an exercise (v1)

- Prompt EN / Prompt pt-BR
- Hidden tests (one or more), each with:
  - Mode: run-clean or compile-fail
  - Run-clean: Check Apex (English), student message EN, student message pt-BR
  - Compile-fail: one or more sets of compile-fail match text, student message EN, and student message pt-BR. The owner can add another set.
  - Preview box (sample student code + last run result), same box on both modes

No debug-match switch.

## Current slice (2026-09-18)

Owner admin lives at `/admin` after mock sign-in. The builder creates and edits modules, topic folders, theory cards, and exercise cards. Cards can be reordered inside a topic. Save still follows the bilingual / hidden-test rules above.

Edits apply only in the browser tab’s memory. Refresh restores the seed curriculum. Not stored in Supabase yet.

Not in this slice: student progress view, live preview against the runner (each hidden test has a preview box; Run preview does not call aer yet).

## Related

Back: [07-student-ui.md](07-student-ui.md)
Next: [09-languages.md](09-languages.md)
