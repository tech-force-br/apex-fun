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

## Save rules

Blocked until filled:

- English and Portuguese for every theory card body
- English and Portuguese for every exercise prompt
- English and Portuguese student messages on **every** hidden test
- At least one hidden test per exercise

Apex samples and hidden-check Apex stay English.

## Builder fields on an exercise (v1)

- Prompt EN / Prompt pt-BR
- Hidden tests (one or more), each with:
  - Mode: run-clean or compile-fail
  - Check Apex (English)
  - Compile-fail match text (if that mode)
  - Student message EN
  - Student message pt-BR
- Preview box (sample student code + last run result)

No debug-match switch.

## Related

Back: [07-student-ui.md](07-student-ui.md)
Next: [09-languages.md](09-languages.md)
