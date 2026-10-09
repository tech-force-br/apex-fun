# 06 — Exercise checks

## What can pass an exercise (v1)

**Every hidden test** on that card passes.

A compile-fail test runs only when the owner created one. The site does not add one on its own. A run-clean test passes when that test's glued program compiles and runs with no error.

There is **no debug-match** switch in the v1 builder. `System.debug` is taught as theory (topic 5). Students may still print to the log. The log never decides pass/fail in v1.

Older notes that said debug-match was required or optional per card are superseded.

## Every Run shows the log

Always show:

- Compile errors, if any
- Any `System.debug` lines the student wrote

The log is a tool.

## Check order

Stop at the first problem. The student sees only that first problem.

1. Compile-fail tests, in their order on the card. Skip this when the card has none. These run before every run-clean test, even when a run-clean test is higher in the list.
2. Run-clean tests, in their order on the card.

Each test is its own program. See [13-runner.md](13-runner.md).

(Debug-match is gone, so it is not in this list.)

## Hidden tests — required

Every exercise card must have **at least one** hidden test. The builder will not save an exercise without one.

A card may have many hidden tests. Save is blocked when a required student message is blank.

A run-clean test has one student message in English and one in Portuguese. A compile-fail test has those two messages on every match set.

Hidden-check Apex stays English. Compile-fail tests do not have check Apex.

## How a run-clean test is written

Admin writes a **small snippet** that runs **after** the student snippet, in the **same scope**, so it can read the student’s variables. Compile-fail tests do not use this snippet.

The site wraps student code + check in one method. Admin does not write a full test method.

Typical shape:

```apex
if (someCondition) {
    System.assert(false);
}
```

Later modules may wrap as a class or method without changing this v1 rule.

## Two modes

Each hidden test has a mode:

1. **Pass if this Apex runs clean**
2. **Pass if this Apex fails to compile** — must match a **specific** error, not any failure

### Compile-fail mode

No check Apex. The student’s code is compiled on its own.

The test has one or more match sets. Each set is:

- Compile-fail match text
- Student message (English)
- Student message (Portuguese)

The builder will not save a compile-fail test with no set, or with a blank match text or blank message.

The test passes when the compiler error **contains** any set’s match text. If the code compiles, or the error contains none of those texts, the test fails. The student sees only the first set’s student message.

Superseded: a compile-fail check that declares the same name again to force a duplicate-variable error. Compile-fail tests no longer glue a second snippet.

### If the hidden check itself cannot run

This applies to run-clean checks only. Missing name, duplicate name, or other compile problem **in that check**: treat it as **that hidden test failing**. Show only that test’s student message.

## Fail messages the student sees

| Situation | What to show |
|---|---|
| Compile error (student code) | Apex error + short plain-language explanation |
| Hidden test fails | Run-clean: that test’s student message only. Compile-fail: the first match set’s student message only |
| After 2 failed Runs | Also suggest opening the Theory pane |

Do not dump later checks after the first failure.

## Preview in the builder

Every hidden test, run-clean or compile-fail, has the same preview box: sample student code, a Run preview control, and the last result.

Run preview does not call aer yet. The control does not run the sample.

## Related

Back: [05-cards-and-navigation.md](05-cards-and-navigation.md)
Next: [07-student-ui.md](07-student-ui.md)
