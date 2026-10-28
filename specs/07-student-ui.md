# 07 — Student UI

## Devices

Desktop first. Phone must work. The editor may feel cramped on a phone.

## Accounts

Required. Email/password and Google. Progress is stored on the account.

Language is chosen at signup. Change later in settings and from a control on every page.

## Exercise screen (desktop)

- **Topic card list** on the left. Every card in the current topic. See [05-cards-and-navigation.md](05-cards-and-navigation.md).
- **Theory pane** starts **closed**. Open it with a **Theory** button. It is a reference next to the lesson, separate from the card list.
- **Editor + log** on the right of the lesson.
- Editor stays usable while Theory is open.

### What the Theory pane lists

On a normal Variables exercise: current topic’s theory cards **plus** all earlier Variables theory topics. Student can switch among them without leaving the editor.

On mixed review: **all** Variables theory topics.

Short reminders of earlier theory live in this pane. They are not extra theory written onto the exercise card.

## Editor

- CodeMirror 6
- Line numbers and simple highlighting
- Starts empty
- Student types the full snippet
- Copy and paste blocked in the editor, in prompts, and in theory samples

Admin screens may paste.

## Log

Under the editor. Updates on every Run. See [06-exercise-checks.md](06-exercise-checks.md).

While a Run is in progress, the editor is read-only and the Validate button shows a spinner. The editor accepts typing again when the run returns.

## Results and complete screens

See [04-progress-and-scoring.md](04-progress-and-scoring.md).

## Footer (every public page)

Short line: ApexFun is not affiliated with, endorsed by, or sponsored by Salesforce, Inc. Salesforce and Apex are trademarks of Salesforce, Inc.

## Related

Back: [06-exercise-checks.md](06-exercise-checks.md)
Next: [08-content-admin.md](08-content-admin.md)
