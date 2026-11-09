---
name: landingos
description: >-
  Builds a world-class dark Hebrew RTL sales page from a ready kit and a gated process: first-run brand brief,
  conversion copy, a proving visual mechanism per section, framed real imagery, restrained scroll motion and a
  deterministic 6-width gate. Use when the user wants a landing page, sales page, course page or a section of one,
  or says landing page, sales page, build a page, דף נחיתה, דף מכירה, דף מכירה פרימיום, תבנה לי דף, עמוד נחיתה, /landingos.
---

# LandingOS

Builds one long dark Hebrew sales page. The system is fixed, the content and proof come from the owner.

Talk to the owner in simple spoken Hebrew, generic singular, no dashes, no comma before ו, ₪ before digits, and call the tool "קלוד קוד". `<skill>` below means the folder this file was loaded from.

## First run: the brief

Check for `<skill>/brand.json`. If it does not exist, ask these questions in one message, then save the answers there. Ask once, ever.

```
כמה שאלות חד פעמיות כדי שהדף ייראה ויישמע שלך.
1. איך קוראים למותג או לעסק?
2. מה המוצר ומה בדיוק מקבלים כשקונים?
3. כמה זה עולה? (מחיר, תשלומים ומחיר לפני הנחה אם יש)
4. למי זה מיועד ומה הכי כואב להם היום?
5. מי הפנים של הדף? (שם ותפקיד. בלי צילום אמיתי של אדם הדף עובד עם האווירה בלבד)
6. מה הפעולה האחת שהגולש צריך לעשות ולאן הכפתור מוביל?
7. אילו הוכחות אמיתיות יש? (המלצות עם שם, מספרים, כתבות, צילומי מסך, אחריות או החזר כספי)
8. צבעים: שלח לוגו או 2 צבעי מותג. אם אין, אציע.
9. יש לך כבר טקסט לדף, או שאכתוב אותו?
```

```json
{ "brand": "", "offer": { "name": "", "what": "", "price": "", "installments": "", "anchorPrice": "" },
  "audience": "", "expert": { "name": "", "role": "" }, "oneAction": { "label": "", "href": "" },
  "proof": [], "palette": { "bg": "#11142e", "a1": "#ffc22e", "a2": "#a9b6ff" }, "copy": "write | provided" }
```

Palette rules: `bg` is a very dark version of the brand hue (never `#000`), `a1` is action and emotion and fills the closing sheet, `a2` is structure and fills the product sheet. Pick both so they can carry a whole screen of colour. Decide, then state the choice and one alternative in one line.

On later runs, show one line with the saved offer and ask only: same offer, or a new one? A new offer updates `offer`, `proof` and `oneAction`.

## Files

| Path | What |
|---|---|
| `references/method.md` | The 12 principles and the kit's values. Read before every page. |
| `references/mechanisms.md` | Section job → mechanism → selector → images. The core catalogue. |
| `references/blueprint.md` | A sales page built from the reader's questions, including for non-visual products. |
| `references/page-architecture.md` | The arc of the page and two ways to run it. |
| `references/imagery.md` | Image counts, the 9 roles to collect, the 5 frames, technical rules. |
| `references/conversion-contract.md` | Binding conversion doctrine with a finish checklist. |
| `references/conversion-rules.md` | Universal page rules and the pre-flight list. |
| `references/eye-check.md` | How to judge beauty when reading the screenshots. |
| `references/asset-recipes.md` | Commands for cut-outs, loops, mockups, share image. |
| `kit/tokens.css`, `base.css`, `blocks.css`, `stages.css` | The system. The palette lives only between the markers in `tokens.css`. `stages.css` is optional. |
| `kit/page.js`, `stages.js`, `jump-guard.js` | Vanilla motion and behaviour, no libraries. `stages.js` is optional. |
| `kit/starter.html` | Wired skeleton with `[copy]` slots. Passes the gate. |
| `kit/sections.html` | All 24 ready blocks, numbered. Opens as a page, copy a block by its number. |
| `agents/landingos-copy.md`, `-art.md`, `-visitor.md` | Copy, imagery, cold-visitor gate. |
| `scripts/lp-check.mjs` | The gate: 6 widths, photographs every section. |
| `scripts/lp-gaps.mjs` | What is missing: slots, brackets, images vs the bar, proof, CTA rhythm, numbers that disagree. |
| `scripts/lp-timing.cjs` | Word lighting must be 100% lit at reading height. |
| `scripts/lp-weight.cjs` | Image weight before the first scroll (target ≤250KB) and oversized images. |
| `scripts/sheets.py` | Contact sheets from section screenshots. Optional, needs Pillow. |
| `scripts/palette.mjs` | Writes the palette block of `tokens.css` from three colours and reports contrast. |
| `scripts/generate-image.mjs` | Optional image generation, only with `OPENAI_API_KEY` in the environment. |

## Workflow

1. **Copy first.** The owner's text verbatim, or spawn `landingos-copy` with the brief from `brand.json` and `contract_path`. Anything without real proof comes back as `PROOF MISSING`.
2. **Read** `method.md`, `mechanisms.md`, `imagery.md`, `conversion-rules.md`.
3. **Set up the project.** Copy `kit/*` into a new folder in the owner's project and name `starter.html` as `index.html`. Run `node <skill>/scripts/palette.mjs <bg> <a1> <a2> <project>/tokens.css`. For other fonts, change `--face-poster` and `--face-text` in `tokens.css` and the Google Fonts link.
4. **Missing-items report.** Before building, list what the page needs by role (`imagery.md`) against what the owner has. Never fill a gap with an invented image or testimonial.
5. **Plan table before code:** section | claim | mechanism | sheet and texture | images. No two neighbours share a mechanism, a sheet or a texture. Use 2-3 full colour sheets. Show it to the owner in one short table, then build.
6. **Build.** Mobile first. Take each section's markup from `kit/sections.html`, replace every `[bracket]` with real copy and every `.slot` with a real image. Add `stages.css` and `stages.js` only if the page uses those blocks. Keep the small script in `<head>` and `jump-guard.js` first in `<body>`, as in the starter.
7. **Imagery.** Spawn `landingos-art` per brief, with `skill_dir`. Without an image key it hands back ready prompts and the page keeps a `.slot`.
8. **Gate.** Serve over http, not `file://` (`npx serve` or `python -m http.server`). All of it from the project folder:
   ```bash
   node "<skill>/scripts/lp-check.mjs" "<url>" --shots check
   python "<skill>/scripts/sheets.py" check
   node "<skill>/scripts/lp-timing.cjs" "<url>"
   node "<skill>/scripts/lp-gaps.mjs" "<url>"
   node "<skill>/scripts/lp-weight.cjs" "<url>"
   ```
   Exit 2 means Playwright is missing: relay the printed instructions. Fix until `RESULT: PASS`. Then read the screenshots by eye with `eye-check.md`, mobile and desktop. A green gate is a condition, not beauty.
9. **Cold visitor gate.** Spawn `landingos-visitor` on the page text and the fold screenshots. A panel verdict of `no` goes back to step 1 or 6.
10. **Pre-flight** from `conversion-rules.md`.
11. **Hand off.** One local link. Say in one line what is still missing, in plain Hebrew. The page is a static folder that deploys to any static host. Keep `noindex` until the owner approves.

**Done means:** `lp-check` RESULT: PASS, `lp-gaps` GAPS: OK (or every MISSING item was sent to the owner as a request), no `[bracket]` left.

## Iron rules

- Copy is untouched: no invented labels, eyebrows, numbers or bridge lines. A heading is one piece; colour whole words only where the source emphasises.
- One button look on the page: solid, with a real edge and a press. Same text every time. `.btn--live` only on money sections. Full width on mobile. A button never sits directly on a `.band--flare`; it goes inside a `.sheet`.
- Every section has a mechanism that proves the sentence next to it. Decoration alone does not count.
- Real images only for people and proof. The expert's face is never generated; testimonials are typed letter for letter from real screenshots. A missing image is a `.slot` naming what to ask for.
- Claims and numbers only from the source. A number that does not add up is reported.
- Nothing invisible: one scroll loop reveals anything that has been passed, and the script in `<head>` removes `.js` when `page.js` never ran. Respect reduced motion.
- No `html{scroll-behavior:smooth}`; `width`/`height` on every image; 14px text floor; no orphan words.

## Traps already hit

- A buy-button jump clicked while the page is loading can snap back to the top. `kit/jump-guard.js`, first in `<body>`, holds the target until the layout settles.
- A hero that animates through a late script shows, vanishes and comes back. The kit's entrance is CSS only: keep it that way.
- Playwright `fullPage` breaks on long animated pages: shoot section by section (the gate does).
- A reveal without a safety net leaves holes in the Facebook and Instagram in-app browsers and on fast scroll.
- `mix-blend-mode` does not work inside a moving marquee: prepare light logos on transparent.
- Long button text: `display:block`, not `inline-flex`.
- `.reveal` uses `translate`, so `rotate` and `transform` stay free for your own use on the same element.
- Swipe carousels and 2-up mobile rows trip the overflow check: mark them with `data-bleed`.
- Video `poster` downloads at once even with `preload="none"`. Below the hero, set it from `data-poster` when the video nears the screen, but keep covers eager inside horizontally scrolled rows.
- Video embeds with a domain allowlist show "403" on localhost and preview domains. Check the live domain before calling it a bug.
- Redesigning an existing page: the copy file is not enough, dump the rendered text per section. Lines added in components live only there.
