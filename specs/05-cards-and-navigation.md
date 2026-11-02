# 05 — Cards and navigation

## Content tree

```
Module (folder)
  └── Topic (folder)
        └── Card (one thing)
              ├── Theory card
              └── or Exercise card
```

The map shows module folders. Opening a module folder shows its topic folders.

v1 rule: **one card = one thing**.

- Never theory + exercise on the same card
- Never a list of exercises on one card
- Each exercise is its own card

## Student path

After a successful sign-in, the student is taken to `/study` (the map).

1. Map of module folders
2. Open the Variables folder
3. See topic folders. Current topic is open. Later topics locked.
4. Opening a topic opens its doing card. That card is the first unfinished card. When every card is finished, the topic opens its first card. There is no card list page.
5. Finished cards can be opened again from the list beside the lesson
6. The next unfinished card is available
7. Later cards in that topic stay locked
8. Finish the last card in the topic → the next topic unlocks. Adding or removing cards changes which card that is
9. Finished topics stay fully open

On the topic list, a finished topic uses the completed color from [10-visual-design.md](10-visual-design.md) and a green circle with a white check. The current topic shows the share of its cards that are finished, as a whole percent, from that same spec. A topic that is not finished and is not current shows a lock icon. The owner can still open a topic that is open.

A topic address with no card opens that topic’s doing card. A topic with no cards returns to the module list. The back link on a card returns to that module’s topic list and uses the module name.

## Topic cards while you are on a card

On a theory card and on an exercise card, a pane on the left lists every card in that topic. Each row shows the card title and Theory or Exercise. The title is the first paragraph of a theory card, or the exercise prompt. A long title wraps onto extra lines. It is not cut off. The row does not continue into the rest of the card. A finished card shows a green circle with a check, as in [10-visual-design.md](10-visual-design.md). The first unfinished card shows a blue circle. It does not show a Current tag. Cards after that show a lock icon. Rows do not say Completed, Doing, or Locked. A completed card and the next unfinished card are links. Locked cards stay in the list and are not links for a student. The card on screen is marked. The owner can open every card, including locked ones, the same way as on the map.

On a phone the list sits above the lesson and scrolls on its own.

This list is not the theory reference pane. See [07-student-ui.md](07-student-ui.md).

## Progress on a card

Continue to another card in the same topic plays the card slide in [10-visual-design.md](10-visual-design.md). A list link does not play that slide. Opening a module, opening a topic, Next topic, and the back link play the page slide in that same section.

On a card, a progress bar sits under the back link. It shows the furthest card reached in its topic. The first card is 0%, and a later card is its index divided by the number of cards in the topic, as a whole percent. A topic with two cards shows 0% on the first card and 50% once the second card is reached. Opening an earlier card leaves the bar at that percent. Once the last card is finished, the bar shows 100% on every card in the topic, including an earlier card the student opens again. When the percent increases, the bar eases to the new width. The bar is on theory cards and exercise cards. It is not on the map or the module list.

Continue shows only on the current card. That card is the first unfinished card in the topic. A finished card opened again does not show it. A later card does not show it, including one the owner opens. On that current card the button says Continue. When it is not the last card, Continue opens the next card and the bar starts easing to that card’s percent on that click. On the last card of an earlier topic, Continue starts filling the bar to 100% on that click and shows confetti from that button. The page stays on that card. Continue is replaced by a Next topic button: same size, with a white face, accent text, and an accent border. The student clicks it when ready, and it opens the doing card of the next topic. On the last topic in the module, Continue starts filling the bar to 100% on that click and shows confetti from that button. The results modal in [04-progress-and-scoring.md](04-progress-and-scoring.md) opens after that fill starts. There is no Topics button. Once a topic is at 100%, no card in that topic shows Continue. The bar stays at 100%.

On an exercise that is the current card, Continue appears after Validate passes. If the student validates again and that run fails, Continue, Next topic, or the results modal stays on the card. A failed retry does not take it away.

## Exercise card

Exactly:

- One prompt (English + Portuguese)
- One editor
- One set of run-clean hidden tests
- Compile always on. Compile-fail explanations are one shared list, not stored on the card. See [06-exercise-checks.md](06-exercise-checks.md)

## Theory card

May include:

- Text
- Images
- A short read-only Apex sample

Theory is also available as a **pane** on exercise screens. That pane is a reference, not a second card glued onto the exercise.

## Map after Variables is complete

Variables remains open. A completed module shows a Completed tag and the completed color from [10-visual-design.md](10-visual-design.md). Open modules that are not complete keep the Open tag.

Locked modules show the name and “Coming later”.

The owner is the exception in [08-content-admin.md](08-content-admin.md). Their map opens every module, topic, and card. Coming-later modules still show that label, and the owner can open them.

## Related

Back: [04-progress-and-scoring.md](04-progress-and-scoring.md)
Next: [06-exercise-checks.md](06-exercise-checks.md)
