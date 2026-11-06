# 10 — Visual design

## Direction

The whole site is one light learning page meant to feel familiar to Salesforce users: a light gray page, white cards, near-black type, and one Salesforce blue accent. Study, admin, the editor, and the signed-out homepage share that look. Controls are flat, with small corners. The site does not use a mascot, the Salesforce cloud logo, or any other Salesforce trademark artwork.

Older “outer space” theme and the older “Salesforce-blue admin Setup clone” are superseded. We do not load the full Salesforce Lightning Design System. The site may use the public blue, navy, and gray colors below. It must not copy Salesforce product UI beyond those colors and the flat, lightly rounded controls.

## CSS

Tailwind plus a custom theme.

Every page, including its header and the site footer, uses light surfaces. The page background is `#f3f3f3`, cards are white, and borders are `#dddbda`. Primary actions are `#0176d3` with a white label and darken to `#014486` on hover and press. They have no thick bottom edge. Blue text, including the wordmark, uses `#032d60`, which is darker than the button fill so it stays readable. Highlights, such as the card on screen and the sample check bar, use the light blue tint `#eaf5fe`. The current topic on the topic list uses a white surface and the same border as the other cards, `#dddbda`. Secondary actions and the language control stay light, with a visible border. Corners are about 4–8px. The language control may stay a pill.

Lessons and the editor keep high contrast on those same light surfaces. There is no star field, and no characters sit on top of code.

The favicon is a plain white letter A on `#0176d3`, with the same small corners as the controls. It is not a Salesforce logo.

## Login

The login card sits on the light homepage, centered, and stays easy to read.

## Characters

Do not use official Salesforce mascots (Astro, Codey, Cloudy, and the rest) unless Salesforce gives written permission.

## Completed module, topic, and card

A completed module uses a light green surface `#e7f6ee`, the same border `#dddbda` as the other stops, and a green circle with a white check. While the pointer is over that module, the border turns `#1f7a4d`. It does not show a Completed tag. A finished topic uses that same green surface and that same border, and that same green border while the pointer is over it. The topic icon uses the green `#1f7a4d`. The finished topic shows a green circle with a white check. It does not show a Completed tag. This green is only for completed items. The pass results title uses it. A passed Validate result uses that same light green surface and that same dark green text. A failed Validate result stays on white, and its message uses `#ba0517`, the same red as the miss results title.

Each module on the map shows a picture of that module. Variables is an x in braces. Operators is plus and times. If and else is a branch. Lists is a bulleted list. Sets is two overlapping circles. Loops is a circular arrow. sObjects is a record. Maps is a key pointing at a value. SOQL is a magnifying glass. DML is a database. Methods is a pair of parentheses. Classes is a divided box. A module without its own picture shows a book.

Each Variables topic has its own mark, and that mark pictures the topic: an x in braces, the letters Aa, the declaration x;, an equals sign, a log window, the digits 123, a single-quoted letter, a true/false switch, the digits 1.5, a calendar, two values joined by a plus, and 1+a. A finished topic icon uses this green. A topic without its own picture shows a folder. A locked module or topic does not add a second small lock on that picture. The lock icon stays in the white circle on the row.

On the module list, open modules that are not complete stay white and show how many of their topics are finished, divided by the number of topics in the module, as a whole percent at or below the exact rate. A topic is finished when every card on it is finished. A module with no finished topics shows 0%. A module with no topics shows 0%. They do not show an Open tag. A coming-later module uses the light gray surface `#f7f7f7` and shows a lock icon in a white circle. It does not show the words Coming later. The owner can still open it. Hovering a module that is locked for the learner shows the not-allowed cursor: a red circle with a diagonal line. Dotted accent connectors join the modules. They do not show an arrow.

On the topic list, the current topic uses a white surface and the border `#dddbda`. It shows how many of its cards are finished, divided by the number of cards in the topic, as a whole percent at or below the exact rate. A topic with no finished cards shows 0%. A topic with no cards shows 0%. It does not show a Current tag. An open topic that is not finished uses the light gray surface `#f7f7f7` and shows a lock icon in a white circle. It does not show an Open tag. The owner can still open it. A locked topic uses that same gray surface and lock icon in a white circle. It does not show a Locked tag. Hovering a topic that is locked for the learner shows the not-allowed cursor: a red circle with a diagonal line.

On the card list beside a lesson, a finished card keeps the plain row. The row shows Theory or Exercise. It does not say Completed, Doing, or Locked. The circle is green with a white check. The card on screen stays on the light blue highlight. The first unfinished card shows a blue circle. It does not show a Current tag. A card after that shows a lock icon. The owner can still open that card. A card that is locked for a student stays gray and is not a link. Hovering that card shows the not-allowed cursor: a red circle with a diagonal line.

## Motion

Study moves use the View Transitions API. A move is either a page slide or a card slide. The header and the footer stay fixed on both. The browser’s own back and forward buttons carry no direction, so they do not play the directional slide. While a view transition runs, the page does not accept pointer input. `prefers-reduced-motion: reduce` plays every view transition with no duration.

The current module on the module list is the first open module that is not finished. It eases up a few pixels and back down, and it does not show a Current tag. A soft shadow sits under that card and eases with the lift. `prefers-reduced-motion: reduce` keeps that module still and leaves the shadow in place.

The current topic on the topic list is the first topic that is not finished. It eases the same way, and it does not show a Current tag. The same soft shadow sits under that topic card and under its icon, and eases with the lift. The line between topics stays still. `prefers-reduced-motion: reduce` keeps that topic still and leaves the shadow in place.

A page slide moves about 48px over 280ms, with a short fade. Going deeper slides the old page out to the left and the new page in from the right. That is opening a module on the map, opening a topic, and Next topic. Going back slides the other way. That is the back link, the wordmark while the path is under `/study/`, and Home and Restart on the results modal. On a page slide, the topic list, the lesson, the back link, and Continue move with the page.

A card slide is Continue moving to the next card in the same topic. It slides forward. A card list link does not play that slide. The link for the card already on screen does not start a slide. The page itself stays put on a card slide. The lesson body slides the same 48px and fade as a page slide. That body is the theory text and sample, or the exercise prompt, editor, and result. The topic card list, the back link, the progress track, and the percent stay where they are. Continue is hidden for the whole card slide, including while the percent fill is still easing, and appears when that transition ends and the button accepts clicks. When the percent goes up, the blue fill eases to the new width over 500ms while the lesson slides. Opening an earlier card leaves the percent where it is, so the fill does not move. The bar’s width ease is the same 500ms ease on the card itself when the last card is finished and the page does not change.

## Buttons

Every button uses a pointer cursor (`cursor: pointer` / Tailwind `cursor-pointer`). That includes disabled buttons. Set it in the global theme on the `button` element so new buttons inherit it. Do not leave the browser default arrow on buttons. A module, topic, or card that is locked for the learner is the exception: hovering that row uses the not-allowed cursor (`cursor: not-allowed`), a red circle with a diagonal line. A row the learner can open keeps the pointer, including a row that still shows a lock icon.

## Devices

Desktop first. Phone usable.

## Related

Back: [09-languages.md](09-languages.md)
Next: [11-tech-architecture.md](11-tech-architecture.md)
