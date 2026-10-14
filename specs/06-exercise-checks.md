# 06 — Exercise checks

## What can pass an exercise (v1)

The student snippet compiles, and **every run-clean hidden test** on that card passes.

Compile-fail tests are one shared list. Every exercise uses that list. They explain a compile error. They do not have to fail for the exercise to pass. A run-clean test passes when that test's glued program compiles and runs with no error.

The site does not invent compile-fail tests. An empty shared list means a compile error shows the Apex error only.

There is **no debug-match** switch in the v1 builder. `System.debug` is taught as theory (topic 5). Students may still print to the log. The log never decides pass/fail in v1.

Older notes that said debug-match was required or optional per card are superseded.

## Every Run shows the log

Always show:

- Compile errors, if any
- Any `System.debug` lines the student wrote

The log is a tool.

## Check order

Stop at the first problem. The student sees only that first problem.

1. Compile the student snippet on its own. If it does not compile, stop. Walk the shared compile-fail tests in list order, and each test's match sets in order. The student sees the Apex error and the first set whose match text is contained in that error. If no set matches, the student sees the Apex error only. An empty snippet does not compile, so the run-clean tests do not run.
2. Run-clean tests, in their order on the card. These run only after the student snippet compiles.

Each run-clean test is its own program. See [13-runner.md](13-runner.md).

(Debug-match is gone, so it is not in this list.)

## Hidden tests — required

Every exercise card must have **at least one** run-clean hidden test. The builder will not save an exercise without one.

A card may have many run-clean tests. Save is blocked when a required student message is blank.

A run-clean test has one student message in English and one in Portuguese. Hidden-check Apex stays English.

Compile-fail tests are not stored on the card.

## How a run-clean test is written

Admin writes a **small snippet** that runs **after** the student snippet, in the **same scope**, so it can read the student’s variables.

The site wraps student code + check in one method. Admin does not write a full test method.

Typical shape:

```apex
if (someCondition) {
    System.assert(false);
}
```

Later modules may wrap as a class or method without changing this v1 rule.

## Shared compile-fail tests

One list for the whole site. The owner adds, edits, reorders, and removes tests in that list's own place in the content admin. Not on an exercise card.

A test has one or more match sets. Each set is:

- Compile-fail match text
- Student message (English)
- Student message (Portuguese)

The builder will not save a test with no set, or with a blank match text or blank message. The list itself may be empty.

No check Apex. The match is against the compiler text from the student snippet alone.

The student sees the matching set's own message, not the first set on the test unless that set is the one that matched.

Superseded: a compile-fail mode on each hidden test that passed only when the code failed to compile. A correct solution compiles, so that mode could not be shared by every exercise. Superseded: a compile-fail check that declares the same name again to force a duplicate-variable error.

### If the hidden check itself cannot run

This applies to run-clean checks only, and only after the student snippet has compiled. Missing name, duplicate name, or other compile problem **in that check**: treat it as **that hidden test failing**. Show only that test’s student message.

## Fail messages the student sees

| Situation | What to show |
|---|---|
| Compile error (student code) | Apex error. When a shared match set hits, also that set's student message |
| Hidden test fails | That run-clean test’s student message only |

Do not dump later checks after the first failure.

## Preview in the builder

Every run-clean hidden test has a preview box: sample student code, a Run preview control, and the last result. That preview follows the check order above for the sample and that one test. It uses the compile-fail list saved in this tab. A compile error stops on the first matching set and does not run the check. The check runs only after the sample compiles.

Every shared compile-fail test has the same box. Run preview compiles that sample alone and scores that test only. If a match set on that test hits, the result shows that set's student message. If the sample compiles, the result says this explanation would be skipped. If the sample fails and no match text on that test is in the error, the result says so.

Run preview uses the same runner as a student check. While the preview runs, the sample editor and the check editor on that screen are read-only, and the button shows a spinner.

## Related

Back: [05-cards-and-navigation.md](05-cards-and-navigation.md)
Next: [07-student-ui.md](07-student-ui.md)
