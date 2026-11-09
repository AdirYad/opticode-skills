# Renderer and QA

Turns frame markup into 1080x1920 PNGs that look native to Instagram, and tests each one first. `<skill>` is this skill's folder.

## Making a frame
1. Copy a starting point from `templates/` into the story folder. `magnet` has an ask for a reply word, `qa` has a question card with its answer, `cta` is text only and also serves daily frames, `photo-card` holds a person in a contained card.
2. Change only the content. Each visible line in a box is one `<span>`. Emoji are written as `<img class="emo" src="emo:NAME">`; the names live in the `EMOJI` map in `render.mjs`, and new ones can be added there.
3. Run `node <skill>/lib/render.mjs <dir> --sheet <dir>/sheet.png`. A folder argument means all of its `.html` files.
4. Anything not printing PASS gets fixed before the buyer sees it.

## What story.css gives you
| class | use |
|---|---|
| `.stack` (+ `.top` `.bottom` `.spread`) | container for the safe area 64/250/340, all content goes in it. A short frame uses plain `.stack` and sits centred; `.spread` needs enough lines to fill the height |
| `.box.blue` / `.box.white` (+ `.big`) | native text box; its lines meet with concave joins |
| `.plain` (`.sm`) | a bare white line under or between boxes |
| `.ink` | blue text, no box, for a word or short title |
| `.shot` (+ `.face` if a person appears) | contained photo or video card with no border; text stays off it |
| `.full` (+ `.dim` if the screen is bright) | screenshot filling the whole background. Not for a photo of a person |
| `.qc > .qh + .qb` | question card; the question goes in exactly as sent |
| `.grp` | keeps lines close together as one unit |
| `data-rotate="-4"` | rotates an element once layout has finished |

## What makes a frame FAIL
Outside the safe zone. Text on a `.face`. Text on text. A box line over 952 wide (split it). Box lines that don't touch. Any border or frame. An emoji knocked off its text line. A missing image or font. An en dash, em dash or maqaf. A background other than black. Box-fit: text or emoji not sitting evenly inside its drawn background, measured in pixels (`BOXFIT_DEBUG=1` prints the gaps). A box that melts into what's behind it (contrast under 1.6). White text on a light area (contrast under 3).

After changing anything in this folder, `node <skill>/lib/tests/test.mjs` has to print ALL TESTS PASS.

Rubik font: SIL Open Font License, see `fonts/OFL.txt`.
