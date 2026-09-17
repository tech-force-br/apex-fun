# 06 — Exercise checks

## What can pass an exercise (v1)

1. The glued program **compiles and runs with no error** (always required).
2. **Every hidden test** on that card passes.

There is **no debug-match** switch in the v1 builder. `System.debug` is taught as theory (topic 5). Students may still print to the log. The log never decides pass/fail in v1.

Older notes that said debug-match was required or optional per card are superseded.

## Every Run shows the log

Always show:

- Compile errors, if any
- Any `System.debug` lines the student wrote

The log is a tool.

## Check order

Stop at the first problem. The student sees only that first problem.

1. Compile the glued program
2. Hidden tests, in admin order

(Debug-match is gone, so it is not in this list.)

## Hidden tests — required

Every exercise card must have **at least one** hidden test. The builder will not save an exercise without one.

A card may have many hidden tests. Each has its own student-facing messages (English and Portuguese). Save is blocked if either language message is blank.

Hidden-check Apex stays English.

## How a hidden test is written

Admin writes a **small snippet** that runs **after** the student snippet, in the **same scope**, so it can read the student’s variables.

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

Admin pastes a short piece of the Apex error text. If the real error **contains** that text, the test passes.

Owner idea for “did they declare this name?”: the check tries to declare the same name. A duplicate-declaration error means they declared it. Use compile-fail mode and match that error text.

### If the hidden check itself cannot run

Missing name, duplicate name, or other compile problem **in that check**: treat it as **that hidden test failing**. Show only that test’s student message.

## Fail messages the student sees

| Situation | What to show |
|---|---|
| Compile error (student code) | Apex error + short plain-language explanation |
| Hidden test fails | That test’s student message only |
| After 2 failed Runs | Also suggest opening the Theory pane |

Do not dump later checks after the first failure.

## Preview in the builder

Admin pastes sample student code, runs it, and sees:

- Which hidden test would pass or fail
- Which student message would show

## Related

Back: [05-cards-and-navigation.md](05-cards-and-navigation.md)
Next: [07-student-ui.md](07-student-ui.md)
