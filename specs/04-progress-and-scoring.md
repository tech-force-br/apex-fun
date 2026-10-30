# 04 — Progress and scoring

## Moving forward

- An exercise can be retried until it passes.
- The next card unlocks when this exercise **passes**, not when a score is high enough.
- The next topic unlocks when the student finishes the last card in the current topic.
- That last card is whichever theory or exercise card is last. The owner can add or remove cards, and the new last card is the one that opens the next topic.
- A topic with no cards is not finished.
- The last topic in the module has no next topic.
- Finished topics stay fully open. Students can re-read theory and Retry old exercises.

The site owner is not held to these locks. On the study map, every module, topic, and card is open for the owner, including modules marked coming later. A student account still follows the locks above. Opening a card this way does not mark it finished.

## What “passed” means during the module

Students only see **passed** or **not passed**.

They do not see first-try percent until the results modal.

## Clean first try

An exercise is a **clean pass** only if the **first Run** on that exercise is correct.

Not a clean pass if they needed extra Runs.

(There are no hints in v1. If hints return later, a hint would also make it not clean.)

## 90% check

Checked once: the student clicks Continue on the last card of the last topic.

Every exercise card in the module counts. The total is however many exercise cards exist. An exercise that was never run counts as not clean.

The pass line is 90% of that total. When that is not a whole number, round up. That many clean first tries completes the module. Fewer resets it. A module with no exercise cards is complete.

The first Run is the first Validate that returns passed or not passed. A check that returns neither does not count, and a later Run does not change it.

Superseded: a fixed Variables total of 110 exercises and a complete line of 99 / 110.

On restart:

- Treat the module as if for the first time
- Wipe finished cards, first-try records, progress bars, and saved passing code for that module
- The reset happens when the modal opens, before the student leaves the card
- Mixed review order stays the same

## Results modal

On that Continue click, the topic bar eases to 100% and confetti plays from the Continue button. This happens on a pass and on a miss. The results modal opens after that fill has started, about 500ms later, the same time as the bar ease. The page stays on the card until the student leaves it.

The reset happens when the modal opens, before the student leaves the card. Until the student leaves, the topic bar stays at 100% on that card.

The modal shows:

- Percent, as a whole number at or below the exact rate, so a miss never shows 90% or higher
- Count (clean first tries out of total exercises)
- Each topic that has exercise cards, with that topic’s clean-first-try percent, in curriculum order, on a pass and on a miss. Same whole-number rule as the module percent. Next to it, that topic’s clean count out of its exercise cards. A topic with no exercise cards is left off the list.

It does **not** list which exercises were not clean.

- **Pass** → the modal congratulates the student. The bar is already at 100% and confetti from the Continue button has already played. When this modal opens, confetti falls from the top of the screen to the bottom. It does not play on a miss, and it skips prefers-reduced-motion. Two buttons. Module list opens the module list. Share sits beside it and does nothing yet. Sharing is not wired.
- **Miss** → the modal says this module starts again, and the restart above runs when the modal opens. Confetti has already played. The modal has:
  - Home, with a house icon, in the darker blue `#032d60`. It opens the module list.
  - Restart, with a restart icon, in the normal blue `#0176d3`, at the far right. It opens this module’s topic list.
  - An X at the top right. It closes the modal and stays on the card. Continue does not come back. The bar stays at 100% until the student leaves.

## After a complete module

1. The congratulations modal
2. Then the module list
3. The completed module stays open for theory and Retry. It shows a Completed tag in the completed color from [10-visual-design.md](10-visual-design.md)
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
