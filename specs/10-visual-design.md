# 10 — Visual design

## Direction

Outer **space**. Friendly, calm, readable.

Older “Salesforce-blue admin Setup clone” is superseded. We do not load the full Salesforce Lightning Design System.

## CSS

Tailwind plus a custom theme (dark space colors, one accent, clear type).

Inside lessons and the editor: high contrast. Stars and characters stay in the background, not on top of code.

## Login

Dark space background. Login card sits in the center and stays easy to read.

## Characters

Do not use official Salesforce mascots (Astro, Codey, Cloudy, and the rest) unless Salesforce gives written permission.

## Buttons

Every button uses a pointer cursor (`cursor: pointer` / Tailwind `cursor-pointer`). That includes disabled buttons. Set it in the global theme on the `button` element so new buttons inherit it. Do not leave the browser default arrow on buttons.

## Devices

Desktop first. Phone usable.

## Related

Back: [09-languages.md](09-languages.md)
Next: [11-tech-architecture.md](11-tech-architecture.md)
