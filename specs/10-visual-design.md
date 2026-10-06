# 10 — Visual design

## Direction

The whole site is one light learning page meant to feel familiar to Salesforce users: a light gray page, white cards, near-black type, and one Salesforce blue accent. Study, admin, the editor, and the signed-out homepage share that look. Controls are flat, with small corners. The site does not use a mascot, the Salesforce cloud logo, or any other Salesforce trademark artwork.

Older “outer space” theme and the older “Salesforce-blue admin Setup clone” are superseded. We do not load the full Salesforce Lightning Design System. The site may use the public blue, navy, and gray colors below. It must not copy Salesforce product UI beyond those colors and the flat, lightly rounded controls.

## CSS

Tailwind plus a custom theme.

Every page, including its header and the site footer, uses light surfaces. The page background is `#f3f3f3`, cards are white, and borders are `#dddbda`. Primary actions are `#0176d3` with a white label and darken to `#014486` on hover and press. They have no thick bottom edge. Blue text, including the wordmark, uses `#032d60`, which is darker than the button fill so it stays readable. Highlights, such as the current study row and the sample check bar, use the light blue tint `#eaf5fe`. Secondary actions and the language control stay light, with a visible border. Corners are about 4–8px. The language control may stay a pill.

Lessons and the editor keep high contrast on those same light surfaces. There is no star field, and no characters sit on top of code.

The favicon is a plain white letter A on `#0176d3`, with the same small corners as the controls. It is not a Salesforce logo.

## Login

The login card sits on the light homepage, centered, and stays easy to read.

## Characters

Do not use official Salesforce mascots (Astro, Codey, Cloudy, and the rest) unless Salesforce gives written permission.

## Buttons

Every button uses a pointer cursor (`cursor: pointer` / Tailwind `cursor-pointer`). That includes disabled buttons. Set it in the global theme on the `button` element so new buttons inherit it. Do not leave the browser default arrow on buttons.

## Devices

Desktop first. Phone usable.

## Related

Back: [09-languages.md](09-languages.md)
Next: [11-tech-architecture.md](11-tech-architecture.md)
