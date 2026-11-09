# The method: 12 principles and the values behind them

The kit's look is "printed matter on a night wall": a dark room, big condensed Hebrew poster type, whole sheets of saturated colour, and proof that looks like things you can hold (slips, tickets, receipts, prints). The values below are the ones the kit ships with. Change a token rather than hard-coding a new number.

## 1. A dark world with a hue
- `--night` is a very dark version of the brand hue, never `#000`.
- `--shelf-1..3` step that tone toward `--chalk` for cards and frames. `--pit` is one step deeper, for the darkest sheets.
- Text is `--chalk` at three strengths: `--text` full, `--text-2` 80%, `--text-3` 62%. Never pure white, never neutral grey.

## 2. Two colours with fixed jobs
- `--flare` (a1) is action and emotion: the button, the emphasised word, the price, the drenched sheet that closes the page.
- `--field` (a2) is structure: rules, frames, tags, and the sheet behind the product name or a statistic.
- `--good` and `--bad` are for ✓ and ✕ marks only.
- New brand: `scripts/palette.mjs` writes `--night`, `--flare`, `--field`, `--chalk` and the two text-on-colour inks into `tokens.css`. Everything else derives from those in CSS.

## 3. Colour fills whole sheets
- Each section is one `.band`: plain night, `.band--shelf`, `.band--pit`, `.band--field` or `.band--flare`.
- A page should have 2-3 colour sheets. They are what makes the scroll feel designed rather than a dark template.
- Colour bands redefine the ink tokens, so every component inside them works without a variant.
- The button is flare on every band, so it never sits directly on `.band--flare`. Put it inside a `.sheet` (a night-coloured card) there.

## 4. Typography
- Two faces: Karantina 700 for anything poster-sized, Assistant 400/600/800 for reading. A condensed face lets a long Hebrew headline go very large on a phone, which is the whole point.
- Tokens: `--fs-h1` (74-178px), `--fs-h2` (58-128px), `--fs-h3` (36-58px), `--fs-shock` (124-430px), `--fs-lede`, `--fs-body` 18-20.5px, `--fs-fine` 15-16.5px. Floor: 14px.
- Poster lines sit tight, `line-height` .88-1. Hebrew is never letter-spaced.
- Scale shock 3-5 times per page: `.outcry`, `.reveal-name`, `.mega`, `.price-now`, `.bigline`. Everything else stays on `h2`.
- Emphasis, nothing else: `.flare` (whole word in the accent), `.cut` (a pasted block behind a phrase, one per page), `.mark` (a band drawn under a phrase on arrival), `.proud` (a number inside a sentence), `.proofmark` (the key phrase inside a proof slip).
- No gradient text. No small label above a heading unless its words exist in the copy.
- Hygiene: `page.js` joins the last two words of every line so no word is left alone, `tabular-nums` on numbers, `.price-ink` keeps a price on one line, `&lrm;` before an RTL price.

## 5. Layout
- `--page` 1260px, `.wrap` keeps `--gutter` (20-72px) each side, `.wrap.narrow` is 860px for lists and FAQ.
- `.band` padding is `--band` (74-184px).
- Headlines and lists start at the right edge and keep going. Do not centre by habit; centre only money cards and single statements.
- The first screen is a full viewport: `.front` is `min-height:100svh`, two columns from 960px, copy right, figure left. Mobile order: words, button, figure, press belt.
- Mobile first. Check at 360, 390, 768, 1024, 1440, 1920.

## 6. Rhythm
- Two neighbouring sections never share a colour or a texture.
- Four textures, always faded: `.tx-halftone`, `.tx-hatch`, `.tx-rays`, `.tx-bars`.
- Money sheets stay plain or carry one texture only. Nothing competes with the price.

## 7. Depth comes from paper
- Three shadows: `--cast-1`, `--cast-2`, `--cast-3`. Always offset and soft, always black, never a coloured glow.
- Corners: `--r-1` 3px, `--r-2` 7px. Discs are perfect circles. Nothing in between.
- A figure stands on a solid printed sun (`.sun`), not in a box and not in a glow.
- Slips, tickets and receipts are chalk or shelf coloured, and may lean a degree or two.

## 8. One physical button
- `.btn`: flare fill, `--on-flare` text at 800, a hard inner bottom edge, a thin top highlight. Hover lifts 3px, active presses down and the edge collapses. Full width up to 600px.
- One look on the page, the same text every time. `.btn--live` adds a slow ping, only on money sections.
- Under it: `.reassure`, and near a price, `.pay` logos.

## 9. Motion with a budget
- Page entrance: the headline wipes in, the sun rises, all in CSS with no script. Nothing can flash.
- Scroll: `.reveal` rises 24px, `.fly-r`/`.fly-l` land with a tilt, `.draw` strokes, `data-d` 1-4 stagger by .07-.31s. Easing `--snap`.
- One signature per emotional moment: `[data-sfade]` word lighting, `.outcry` stamp, `.ring94` fill, `[data-progress]` route line, `[data-count]`.
- Loops are slow and small: orbit 58s, float 9s by 11px, marquee 34s.
- `html{scroll-behavior:smooth}` is forbidden. `jump-guard.js` smooth-scrolls on click. `prefers-reduced-motion` turns everything off.

## 10. Real artefacts as proof
- Every claim gets a real thing beside it: a source in `.win`, a clipping, a certificate, a `.print`, a profile in `.phone`, reels with real view counts, messages as `.pf` slips.
- Testimonials are retyped letter for letter from real screenshots. `.slip__name--hidden` hides a name only when the person asked for that.
- The expert appears several times in different roles, always real, never generated.

## 11. Images
- `width` and `height` on every image, `loading="lazy"` except the first screen, `fetchpriority="high"` on the hero figure. WebP, 20-150KB. See `imagery.md`.
- Five frames only: `.sun`, `.plate`, `.print`, `.win`, `.float`.

## 12. Copy, then gate, then eyes
- Copy comes from the owner or `landingos-copy`, pasted verbatim. Anything that reads wrong is reported, not fixed.
- `scripts/lp-check.mjs` must print `RESULT: PASS`. Then read the section sheets with `references/eye-check.md`. A green gate is a condition, not proof of beauty.
