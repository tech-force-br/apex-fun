# 08 — Content admin

## Who

Only the site owner is admin in v1. No other teachers.

## Admin can

- Add and edit theory cards
- Add and edit exercise cards
- Add and edit the shared compile-fail tests
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
- English and Portuguese student messages on every run-clean test, and on every compile-fail test
- Match text on every compile-fail test that exists
- At least one run-clean hidden test per exercise

The shared compile-fail list may be empty. Apex samples and run-clean hidden-check Apex stay English. Compile-fail tests have no check Apex.

## Builder fields on an exercise (v1)

- Prompt EN / Prompt pt-BR
- Run-clean hidden tests (one or more), each with:
  - Check Apex (English), student message EN, student message pt-BR
  - Preview box (sample student code + last run result)

No debug-match switch. No compile-fail mode on the card.

## Shared compile-fail tests (v1)

Their own place in the content admin, separate from modules, topics, and cards. The owner can add, edit, reorder, and remove tests there. Every exercise uses the saved list.

Each test has:

- Exactly one compile-fail match: match text, student message EN, and student message pt-BR. The owner cannot add another match on the same test.
- Preview box (sample student code + last run result)

## Current slice (2026-09-18)

Owner admin lives at `/admin` after mock sign-in. The builder creates and edits modules, topic folders, theory cards, and exercise cards. Cards can be reordered inside a topic. The shared compile-fail list has its own screen in that builder. Save still follows the bilingual / hidden-test rules above.

Edits apply only in the browser tab’s memory. Refresh restores the seed curriculum, including the seed compile-fail list. Not stored in Supabase yet.

Run preview of a shared compile-fail test sends that draft and scores that test only. Run preview of a run-clean test sends that draft and the compile-fail list saved in this tab, then follows the check order in [06-exercise-checks.md](06-exercise-checks.md) for that sample and that one test.

Not in this slice: student progress view. Edits are still tab memory, so preview sends the draft test to the action. A student check loads the seed card and the seed compile-fail list on the server and does not use unsaved admin edits.

## Related

Back: [07-student-ui.md](07-student-ui.md)
Next: [09-languages.md](09-languages.md)
