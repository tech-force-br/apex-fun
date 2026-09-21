# 04 — Progress and scoring

## Moving forward

- An exercise can be retried until it passes.
- The next card unlocks when this exercise **passes**, not when a score is high enough.
- The next topic unlocks when the student finishes the last card in the current topic.
- That last card is whichever theory or exercise card is last. The owner can add or remove cards, and the new last card is the one that opens the next topic.
- A topic with no cards is not finished.
- The last topic in the module has no next topic.
- Finished topics stay fully open. Students can re-read theory and Retry old exercises.

## What “passed” means during the module

Students only see **passed** or **not passed**.

They do not see first-try percent until the end results page.

## Clean first try

An exercise is a **clean pass** only if the **first Run** on that exercise is correct.

Not a clean pass if they needed extra Runs.

(There are no hints in v1. If hints return later, a hint would also make it not clean.)

## 90% check

Checked once: after the last card of the module.

Every exercise card in the module counts. The total is however many exercise cards exist.

- **90% or higher**, rounded up when that is not a whole number → module complete
- **Under that** → they must start the module again from the first topic

Superseded: a fixed Variables total of 110 exercises and a complete line of 99 / 110.

On restart:

- Treat the module as if for the first time
- Wipe all saved passing code for that module
- Mixed review order stays the same

## Results page

Always shown after the last card of the module.

Shows:

- Percent
- Count (clean first tries out of total exercises)

Does **not** list which exercises were not clean.

## After a complete module

1. Complete screen
2. Then the map
3. Variables stays open for theory and Retry
4. Other modules stay locked with “Coming later”

## Retry on a passed card

- Button: Retry
- Clears the editor only in the browser
- Server keeps the last passing code until a new pass replaces it
- Card stays completed if the retry fails
- Refresh without a new pass restores the saved passing code
- Retry does not change first-try / 90% scoring

## What we save

- Save **passing** code only. No drafts.
- Progress is tied to the account.

## Related

Back: [03-curriculum-variables.md](03-curriculum-variables.md)
Next: [05-cards-and-navigation.md](05-cards-and-navigation.md)
