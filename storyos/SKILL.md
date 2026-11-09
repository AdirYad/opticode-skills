---
name: storyos
description: >
  Instagram Stories system for a business: a daily story idea from a weekly rotation of named formats, the copy,
  and finished 1080x1920 frames in a native Instagram look with an automated QA gate. Modes: daily, ideas, magnet
  (a free thing for a reply word), launch arc, Q&A from real questions, text-only call to action, and a log that learns
  from the real numbers. Hebrew RTL by default. Delivers a folder of frames plus a posting checklist; can schedule
  through Zernio when its key is set. Use when the user mentions stories, Instagram stories, story ideas, reply word,
  or says סטוריז, סטורי, סטורי היום, מה להעלות היום, רעיונות לסטוריז, השקה בסטוריז, מגנט, סטורי עם תגובה,
  הנעה לפעולה בסטורי, שאלות ותשובות בסטורי, תכין לי סטורי, /storyos.
---

# StoryOS

A daily stories routine for a business owner with very little time: 5 to 10 minutes a day, more people watching, and more of them writing back. Every day gives viewers a reason to reply.

`<skill>` is this skill's folder (the base directory shown when it loads). Each story gets its own folder under `stories/` in the buyer's current project. Everything said to the buyer is in simple spoken Hebrew, generic singular, no em or en dashes, no comma before ו, ₪ before digits, "קלוד קוד" in Hebrew text.

## First run (only if `<skill>/brand.json` does not exist)
1. Send one numbered Hebrew message:
   1. איך קוראים לעסק ומה הוא מוכר?
   2. למי הוא מוכר ומה התוצאה שהלקוחות משלמים עליה, במילים שלהם?
   3. יש עכשיו מוצר או הצעה שאפשר לקנות?
   4. מה כבר מוכן לחלוקה בחינם, כמו מדריך, צ'קליסט או סרטון?
   5. כמה סיפורים אמיתיים מהעסק: רגעים, שאלות שחוזרות, לקוחות שאפשר לספר עליהם.
   6. התגובות באינסטגרם עוברות דרך כלי אוטומטי, או שעונים ידנית?
   7. מעלים גם בשבת?
2. Store it in `<skill>/brand.json`:
   `{ "business": "", "offer": "", "audience": "", "resultInClientWords": "", "openOffer": "", "freeAssets": [], "seeds": [], "replyTool": "", "postOnShabbat": true, "address": "plural", "timezone": "Asia/Jerusalem" }`
3. One-time renderer install, inside `<skill>`: `npm install`, then `npx playwright install chromium`. Needs Node 20 or newer. `node lib/tests/test.mjs` must then print `ALL TESTS PASS`. Otherwise report what failed and stop.

## Load at the start of every run
`<skill>/brand.json`, `references/method.md` (the reasoning), `references/formats.md` (the formats), `references/playbook.md` (each mode, the week, copy and visual rules), `lib/README.md` (writing frames, what QA tests), `stories/log.csv` when it exists, and the most recent folders in `stories/`.

## Modes
| mode | trigger | delivers |
|---|---|---|
| **daily** (default) | "סטורי היום", "מה להעלות" | today's assignment, ready: normally one rendered frame, its words, reply word, time |
| ideas | "תן לי רעיונות", planning ahead | 3 to 7 ideas across different day kinds, added to `stories/ideas.md` |
| magnet | a free thing for a reply word | one frame, the DM text and the reply setup |
| launch | selling something paid | 6 or 7 frames, Q&A frames, a single reply word |
| qa | real questions came in | a frame for each chosen question and a list of who to DM |
| cta | an offer or a request for leads | 1 to 3 text frames ending on a reply word |
| log | "סטורי לוג" | step 7 of the pipeline |

## A daily run
1. **Which day is it?** The weekly table in the playbook gives the day kind. Scan 14 days of `stories/` so that format and material don't repeat. Check if an offer is open.
2. **Material.** Take the top available item from the playbook's material list. If a proof format has no material, change the format.
3. **Format and opening.** Choose from the day's group in `references/formats.md`. Write eight first lines going in different directions and keep the best one or two.
4. **Frames.** One, unless the format is a series. The last frame holds the day's ask. Continue with pipeline steps 3 to 6. A plain daily gets your own self-review; the QA agents are for magnet, launch and sale days.
5. **Hand over** `task.md` and the sheet.

## Pipeline (every mode)
1. **Context.** The files above. A launch also needs product facts from the buyer.
2. **Words before pixels.** Write each frame box by box. On magnet, launch and sale days, launch `storyos-copywriter-qa` and `storyos-audience-simulator` together, passing `SKILL_DIR=<skill>`, the frames, the format and the target signal; if these agents aren't installed, carry out both reviews yourself using their files in `agents/`. Apply the notes in one pass. Agree the text with the buyer before rendering. Sentences the buyer wrote stay exactly as written.
3. **Build.** Folder `stories/YYYY-MM-DD-<slug>/`. Each frame starts from `<skill>/lib/templates/` and is named `s01.html`, `s02.html` and so on. Use only assets that exist.
4. **Render and test.** `node "<skill>/lib/render.mjs" stories/<dir> --sheet stories/<dir>/sheet.png`. Repair every FAIL and render again. Then inspect the sheet and frame 1 by eye for what a script can't judge: strength of the opening, whether the photo flatters, whether the emoji means the right thing, Hebrew direction, whether it reads in 3 seconds.
5. **Show** the buyer the sheet (full path) and the list of frames. Rerun the gate after every change.
6. **After approval only.**
   - Write `stories/<dir>/schedule.json` as an array: `[{ "file": "s01.png", "at": "YYYY-MM-DDTHH:MM", "replyWord": "מילה" }]`, then run `node "<skill>/lib/schedule.mjs" stories/<dir>`. This writes `POSTING.md`, the buyer's checklist, and refuses a folder whose QA failed.
   - Reply word: follow `references/reply-automation.md` and give the buyer the exact word and DM text.
   - Automatic scheduling is optional. If `ZERNIO_API_KEY` and `ZERNIO_INSTAGRAM_ACCOUNT_ID` are in the environment and the buyer asks for it, rerun the command with `--go`, having taken the current local time from a shell command first. Music can't be added through the API.
7. **Next day (mode log).** The buyer reports views and replies per frame. Add them to `stories/log.csv` (`date,slug,frame,format,reply_word,views,replies`), creating it if it's missing. Report what worked in 2 or 3 lines. From 30 rows on, the buyer's own numbers replace the playbook's defaults.

## Before showing anything
- [ ] Every frame printed PASS and the sheet was checked by eye.
- [ ] Frame 1 opens with strong text. Every 3 or 4 frames include a reply word.
- [ ] Each fact came from the buyer. Prices appear in a frame only on request.
- [ ] People's photos are flattering and never under text. Names are hidden with a marker scribble.
- [ ] Anything saved to highlights stays free of dates and of "הערב".

## Never
Publish or use `--go` without a clear OK from the buyer. Add a poll or a link sticker. Make up a result, a reply, a screenshot or a figure. Save a key to a file.
