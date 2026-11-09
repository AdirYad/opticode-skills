# Mechanism catalogue

Every section proves its claim with a visual mechanism. A section with only a heading and paragraphs is unfinished. Pick from this table first. Build something new only if nothing here proves the claim, and build it in the same language (tokens, `.reveal`, `clamp()`, the 5 frames).

**Where the code is.** Markup for every ready block is in `kit/sections.html`, by block number. CSS is `kit/blocks.css` (blocks 1-17) and `kit/stages.css` (blocks 18-24, add it only when used). `kit/stages.js` is needed only by the switcher, the one-command demo and the wipe. "Build:" means there is no ready code and the cell says how to make it.

## By section job

| Section job | Mechanism | Kit block or selector, or Build | Images it needs |
|---|---|---|---|
| **Hero: who + promise + one action** | Poster headline, one line, button, cut-out standing on a printed sun, press belt along the bottom edge | Block 1, `.front` `.sun` `.belt` `.marquee` | 1 cut-out (RGBA, ~530×860), 6-8 press logos, light on transparent |
| Hero, proving the result | Cut-out next to a leaning phone that plays the result, small live chips stuck on top | Block 18, `.duo` `.phone` `.chip--ping` `.chip--count` `.chip--done` | 1 cut-out, 1 loop video |
| Hero with no person | The sun alone with the brand wordmark set on it, or the headline over `.tx-rays` | Build, with `.sun__disc` | the wordmark |
| **Pain story / identification** | Giant line, lines that light word by word, mood photo on a plate, a stamped giant sentence | Block 2, `[data-sfade]` `.plate` `.outcry` | 1 mood photo (scene, no face, 1400×933) |
| "The days of X are over" | Big poster rows, each with a line icon that turns `--bad` as it arrives. Text stays bright, never struck through | Block 19, `.over` | none |
| "What you do today is not enough" | Build: a chat-style input that types and erases 3 real prompts while visible, blinking caret, the same typing used by `[data-td]` | Build | none |
| **Urgency from the outside world** | Build: real headline screenshots in `.win` frames that land tilted (`.fly-r`, `.fly-l`) with a counted number under each | `.win` `.fly-r` `.fly-l` `[data-count]` | 3 real headline screenshots |
| Market speed | Build: `.mega` number + brand-name ticker in `.marquee` | `.mega` `.marquee` | none |
| **Big statistic** | The number at poster size on a colour sheet, simple people figures with the first one standing out, the real source in `.win` | Block 4, `.mega` `.people` `.win` | 1 screenshot of the real source |
| Success rate | Ring that fills to the exact percentage (set `--p`) around a round image | Block 5, `.ring94` | 1 image |
| **Authority / about** | A stack of printed evidence: backed portrait, prints that land, certificate + logo tray, stage photos, clippings, a counted rail, a profile in a phone, a fan of reels, real messages | Block 3, `.bio` `.prints` `.creds` `.onstage` `.clips` `.tally` `.reach` `.reels` `.notes` | 10-25 real images, the image-heaviest section |
| Authority, founder variant | Build: cut-out on a sun, 3 rows with counters, 3 evidence cards, client logo `.marquee` | Build, with `.sun` `[data-count]` `.marquee` | 1 cut-out, 3 evidence images, 6-8 logos |
| **The promise / what changes** | Build: cut-out in the middle, 4 benefit tickets around it, drawn lines joining them | Build, with `.sun` | 1 full-body cut-out |
| What they get each week | Build: grid of small icon tiles, each inline SVG with its own tiny loop | Build, with `.reason svg` patterns | none |
| **Who it is for** | Ruled rows with a drawn ✓ and a "not for" card | Block 10, `.checks` `.tick--yes` `.door` | optional |
| **What does NOT work** | Ruled rows with a drawn ✕, a humour line, a tilted image | Block 6, `.checks` `.tick--no` `.dont__joke` | 1 humour GIF or animated WebP |
| Every alternative they tried | 2×2 failed attempts, then the giant line, then a before/after wipe | Block 22, `.tried` `.bigline` `[data-cmp]` | 2 frames, same pose and zoom |
| **Product reveal** | The name is the biggest word on the page, on a colour sheet, device mockup floating under it | Block 7, `.reveal-name` `.float` | 1 all-devices mockup (RGBA, 1900×1072) |
| Same thing, many variants | One phone screen, tabs that advance by themselves with a progress line | Block 20, `.multi` `[data-switch]` | 3-4 loops or screenshots |
| One action, many results | The command types itself, slots fill, then the whole week fills | Block 21, `.cmd` `[data-td]` | 10 thumbnails |
| **Curriculum / method steps** | Numbered stops on a line that draws as the page scrolls, alternating sides on desktop | Block 8, `.route` `.stop` `[data-progress]` | 1 mockup per stop, optional |
| Long capability list (8-12 items) | Build: sticky panel at 100svh, scroll moves the active item, progress line + counter | Build | none |
| **Bonuses** | Tickets: art on top, a torn stub below with tag, name and stated worth | Block 9, `.bcard` | 1 mockup per bonus |
| Outcome cards | Round badge biting into the corner, text full width | Block 23, `.ocard` `.ocard__badge` | none |
| A list of things a system does | Build: a central round avatar joined by drawn lines to small tickets (verb on line 1, object on line 2) | Build | 1 avatar |
| **Social proof wall** | Chalk slips pasted on a dark sheet: name, time, message retyped, one loud slip in flare, one chat thread. Columns on desktop, swipe row on mobile | Block 11, `.wall` `.pf` `.pf--loud` `.pf--chat` | text typed from real screenshots, letter for letter |
| Early proof after the hero | Build: 3 `.pf` slips + a small link to the full wall | `.pf` | none |
| Raw screenshots after the wall | Build: 2 real screenshots on `.plate` | `.plate` | 2 real screenshots |
| **Price anchoring** | A till receipt with a torn bottom edge: what each thing costs elsewhere, then a big total | Block 12, `.till` `.pause-line` | none |
| **Offer / price** | Value list beside a coupon: mockup, struck price, giant new price, button, payment logos, reassurance | Block 13, `.deal` `.vstack` `.pricecard` | mockup + payment logos |
| Launch offer with a deadline | Build: pasted strip + 3-cell countdown + old/new price. Only with a real deadline | Build | none |
| Signup form | Build: `.pricecard.sheet` with `.buyform` | `.pricecard` `.buyform` | mockup + logos |
| **Mechanism / why it works** | Phone on a sun, ruled reasons with tiny animated icons, then the expert beside one proof slip | Block 14, `.why` `.reasons` `.why__after` | 1 phone screenshot, 1 cut-out |
| **Guarantee / privacy** | A small sheet with a stamped round seal and 2 lines | Block 15, `.safe__card` `.seal` | none |
| **FAQ** | Playful cut-out on a small sun, native `<details>` sharing one `name`, so the browser keeps one open | Block 16, `.faq` `.faq__face` | 1 cut-out |
| Three options, one lit | Two faded options, the third printed in `--field` with the button | Block 24, `.opts` `.opt--on` | none |
| **Final CTA** | One sheet on the flare band: mockup, avatar on a quote, same price block, included list, form, payment logos | Block 17, `.closing` `.says` `.got` `.buyform` | mockup, 72px avatar |
| Outcomes, "side effects" | Build: 3 tickets, drawn icon + title + 2 lines | Build, with `.draw` | none |
| Explainer video | Build: `.plate` around the video, a thumbnail, a play button, `preload="none"` | `.plate` | 1 thumbnail |
| Emotional turning point | One phrase on a pasted block. One per page | `.cut` | none |
| A proud number inside a sentence | Accent colour, tabular figures, a slow breathing underline | `.proud` | none |
| Bold words in a money argument | A band drawn under the phrase on arrival | `.mark` | none |
| A document as proof | Framed image + a round loupe on the one number that matters. Set `--loupe-img`. The loupe must not cover text | `.docproof` `.loupe` | 1 real document |

## Global layers

| Layer | Selector | Notes |
|---|---|---|
| Sheets | `.band` + `--shelf` `--pit` `--field` `--flare` | one per section; neighbours differ |
| Textures | `.tx-halftone` `.tx-hatch` `.tx-rays` `.tx-bars` | on the section, always faded; never the same twice in a row |
| Night card on a colour sheet | `.sheet` | restores night inks; required for anything holding a button on flare |
| Button | `.btn`, `.btn--live` on money sections only | one look on the whole page, same text everywhere |
| Glue + balance | `page.js`, `text-wrap:balance` | no orphan words |

## Rules for choosing

1. Plan the table before writing code: section → claim → mechanism → sheet + texture → images. Two neighbours never share a mechanism, a sheet or a texture.
2. Mechanism proves the sentence beside it. A route sits next to "the 4 parts", a ring next to "94%", a receipt next to "how much it costs elsewhere". If it is only decoration, drop it.
3. Pacing: after 2 dense sections, give a breather (giant type alone, one statement, `.pause-line`).
4. 3-5 scale-shock moments per page. Everything else stays on `h2`.
5. Spread proof through the page: early strip, one slip inside the pain, one inside the mechanism, the wall before the price.
6. A button every ~2 screens on the way to the price, in a plain `.go`.
