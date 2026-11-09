---
name: postos
description: >
  Research and writing pipeline for community posts (WhatsApp, Telegram or any group) in the buyer's own voice: deep research,
  adversarial novelty check, angle lock before writing, one writer per post, notes-only QA, audience simulation, Hebrew
  clean and a final ship or hold judge. Learns the voice from samples the buyer supplies. Optional image generation. Output
  is ready-to-paste text files. Works with plain subagents, no experimental flags needed. Use when the user mentions community posts,
  WhatsApp posts, Telegram posts, or says פוסטים לקהילה, פוסטים לוואטסאפ, פוסטים לטלגרם, מחקר פוסטים, כתיבת פוסטים,
  תוכן לקבוצה, תעשה לי פוסט, תכתוב פוסט, פוסט על, /postos.
---

# PostOS

Finds what's worth saying to a community, then writes it in the buyer's voice. **Nothing reaches the buyer without going through Phase 8**, not even a single post.

`<skill>` below means this skill's folder (the base directory shown when the skill loads). Everything said to the buyer is in simple spoken Hebrew, generic singular, no em or en dashes, no comma before ו, ₪ before digits, "קלוד קוד" in Hebrew text.

This skill exists to stop one failure: posts that are thin, old news, and built like last week's. Readers respond to those by muting the group. `references/value-bar.md` and `references/post-formats.md` hold the standard, and each agent reads what applies to its role.

## How agents run
Each role is an agent in this skill's `agents/` folder, installed as `postos-<role>`. Spawn with the Agent tool, `subagent_type: "postos-<role>"`, and put `SKILL_DIR=<skill>` first in the prompt. If that type isn't available (agents load at session start, so a fresh install needs a new session), spawn a general-purpose agent with: "Read <skill>/agents/postos-<role>.md and follow it exactly. SKILL_DIR=<skill>". This works with no experimental flags: never call TeamCreate or rely on messaging between agents. A revision is a fresh `postos-writer` run given the full post, the locked angle and all notes. Parallel steps go in one message.

For small batches (3 topics or fewer), you may do the analyst and strategist steps yourself by following their files.

## First run
**If `<skill>/brand.json` does not exist,** ask once, in one numbered Hebrew message:
1. על מה הקהילה ואיך קוראים לה?
2. מי הקהילה, במילים פשוטות? מה הם רוצים?
3. איפה הפוסטים עולים: וואטסאפ, טלגרם או משהו אחר?
4. התחום משתנה מהר (כלים, חדשות) או שהוא יציב (בריאות, עיצוב, הורות)?
5. כמה פוסטים בשבוע ובאילו שעות?
6. מה העסק מוכר ואיזה מסרים צריך להעביר בעדינות?
7. אילו אמונות עוצרות אנשים מלקנות?
8. מה הקריאה לפעולה (מילה בפרטי, קישור)?
9. חתימה ושורת הזמנה לקהילה, אם יש.

Save `<skill>/brand.json`, setting `contentMode` from answer 4 (changes fast = `news`, stable = `evergreen`) and leaving defaults for anything not asked:
`{ "business": "", "channelName": "", "platform": "whatsapp", "audience": "", "field": "", "contentMode": "news", "noveltyWindowDays": 21, "postsPerWeek": 3, "bestTimes": [], "address": "plural", "wordRange": [60, 160], "offer": "", "messages": [], "beliefsToBreak": [], "ctaOptions": [], "signature": "", "joinLine": "", "joinLink": "", "imageStyle": "" }`

**If `<skill>/voice/voice-dna.md` does not exist,** ask: "כדי שהפוסטים יישמעו כמוך, צריך לפחות 3 פוסטים או הודעות שכתבת בעצמך. עדיף 10 ומעלה. אפשר להדביק כאן או לתת נתיב לקובץ." Create `<skill>/voice/samples/` and save them there. Fewer than 3: stop and ask again, never write in an invented voice. Then distil `voice/voice-dna.md` by `references/voice-template.md`, set `address` in `brand.json` to what the samples really use (`plural` or `singular`), and show the buyer 5 lines of what you learned.

## Phase 0: Context
1. Read `<skill>/brand.json`, `voice/voice-dna.md`, `references/value-bar.md`.
2. Create `posts/research/` and `posts/history/` in the project if missing.
3. **Close the learning loop.** Read `posts/research/topics-performance.json`. If the latest entries have null engagement, ask once: "איך עברו הפוסטים מהפעם הקודמת? כמה תגובות ושיתופים לכל אחד?" Write the real numbers back. Skipped: leave nulls, move on.
4. Read the 3 most recent files in `posts/history/` to avoid repeats, and `posts/usage-log.json` for messages already used. Create it as `[]` if it's missing.
5. Ask: "יש נושא ספציפי, או שאחפש מה באמת חדש? וכמה פוסטים?" Default: `postsPerWeek`, and fewer strong beats padding. One post on a named topic: go to **Single post** below.

## Phase 1: Research
Two `postos-researcher` runs in parallel, split so they don't overlap (news mode: new things in tools or areas the audience already touches / new things launching or blowing up; evergreen: real questions being asked / common advice that is wrong plus recent evidence). Pass today's date.

Real-chatter track, done by you: 2-3 searches for what people actually say about the field this month (forums, Reddit, X, YouTube comments). If the `last30days` skill is installed, you may use it instead. A topic with real chatter beats one with none. Thin or failing: note it and continue. Merge everything.

## Phase 2: Analysis
`postos-analyst` on the merged findings. Save to `posts/research/YYYY-MM-DD-research.json`. **Fewer than the requested count at 4+: do not pad.** Tell the buyer and offer fewer strong posts or more research.

## Phase 3: Novelty verification
`postos-novelty-verifier` on the top ideas. Apply:
- **stale**: cut, don't write it.
- **overstated**: keep; the correction is mandatory in the writer's brief. Pass `correction_class` untouched: `behavioral_limit` inline, `availability_gate` one short sentence near the end.
- **unverifiable**: downgrade.

Cuts drop below the count: say so honestly, never revive a stale topic.

## Phase 4: Strategy
`postos-strategist`: count, schedule, **a different format per post**, business thread, CTA, the flagship. Check the formats are really distinct.

## Phase 5: Buyer picks
Show in Hebrew: the plan, and per idea the topic, score, format and non-obvious move. "על אילו נושאים לכתוב? (מספרים, או הכל)"

## Phase 6: Angle lock
`postos-angle-designer` for the chosen topics, marking the flagship. Non-flagship: take its angle. Flagship: compare the 2-3 candidates and lock the strongest. Each writer gets a locked hook, premise and beat map.

## Phase 7: Writing
One `postos-writer` per topic, in parallel. Pass the locked angle, the non-obvious move, the honest limit and class, the format, the thread assignment, existing posts to avoid. If a post mentions an offer, fetch the live linked page yourself now and pass what it says as `offer_facts` (the writer has no web access). No live page: the post doesn't state a price, date or inclusions. Reference posts the buyer gave: labelled "structure only".

## Phase 8: Quality pipeline (mandatory, also for a single post)
Reviewers point at problems and change nothing. All their notes go to a single writer run, which keeps the post in one voice.

- **8a. Diagnose, in parallel:** `postos-copywriter-qa` and `postos-audience-simulator`. Originality check by you, when the buyer supplied posts to model: per draft, what was taken and whether it's structure (fine), or angle or wording (must be replaced).
- **8b. One revision.** A post with score under 8, a high retention risk or real notes gets a fresh `postos-writer` run with its full post, angle and all notes in one bundle. Strong posts skip this. **Fact-check the notes first:** a note that introduces a new factual claim is verified by you against a primary source, or dropped.
- **8c. Craft polish, by you.** Cut generic and fluent-but-hollow phrasing, significance inflation, borrowed authority. One specific detail over a category. Plain words, one idea per line. Polish, not rewrite.
- **8d. Hebrew clean.** `postos-hebrew-clean`; apply its fixes directly. It runs after everything that edits text.
- **8e. Final judge.** `postos-final-judge`. **ship** proceeds. **hold**: back to a writer run (8b), re-clean, re-judge. At most 2 hold cycles, then show the post to the buyer with the judge's remaining concern. A hold whose only reason is a compressed availability gate is invalid. If the thread is missing and `brand.json` defines one, add it first.

## Phase 9: Buyer approval
Show each post in a copy-ready block with its scores. Per post: מאושר / שינויים / לדלג. Changes: edit, then re-run the copywriter check from 8a and the Hebrew clean from 8d.

## Phase 10: Visuals (approved posts only, optional)
For a post about a real product, look for real media per `references/real-media.md`. For an image, one `postos-image-director` per post, output `posts/YYYY-MM-DD/post-N-image.png`. Needs `OPENAI_API_KEY` or `GEMINI_API_KEY` in the environment; without one it saves `post-N-image-prompt.txt` for any image tool, and the post is still complete.

## Phase 11: Save
1. `posts/YYYY-MM-DD/post-N.txt`: the post exactly as approved, ready to paste, plus its image if there is one. `posts/YYYY-MM-DD/batch.md`: schedule, scores and format of each.
2. Append the posts to `posts/history/YYYY-MM-DD.md`.
3. Append to `posts/research/topics-performance.json` with the real-engagement fields null (`score` is the analyst's; null for a single post):
   `{ "date": "", "topic": "", "format": "", "flagship": false, "score": 0, "copywriterScore": 0, "audiencePredicted": 0, "approved": true, "reactions": null, "shares": null, "replies": null }`
4. Append one object per post to `posts/usage-log.json`: `{ "date": "YYYY-MM-DD", "message": null, "belief": null, "cta": null }`.
5. Tell the buyer in 3-5 lines: how many posts, where the files are, when to post each.

Publishing is the buyer's: paste into the group or their scheduling tool.

## Single post
Phases 1, 2, 4 and 5 are skipped, so you fill in what they would have produced. **Phase 8 still runs in full.**
1. **Brief.** Build one `topIdeas` item by hand: `topic`, `non_obvious_move`, `format_fit` (one shape from `references/post-formats.md`), `honest_limit`, `source_url`, `freshness`. Facts the buyer didn't give come from one `postos-researcher` run on that topic. No non-obvious move found: tell the buyer and propose an angle instead of writing filler.
2. **Novelty.** If the topic claims something new, or the channel is in `news` mode, run `postos-novelty-verifier` on that item and apply Phase 3. A post built only on the buyer's own cases skips the verifier: check `posts/history/` yourself that the channel hasn't said it recently, and pass `own_material` as its novelty verdict.
3. **Thread.** Choose at most one `messages` item or one `beliefsToBreak` item that fits, and at most one `ctaOptions` item. Nothing fits: none.
4. **Angle.** `postos-angle-designer` with `flagship: false`.
5. Phase 7 with one writer, Phase 8, then Phases 9 to 11. Tell the reviewers `single_post: true`, so that batch-level checks don't apply.

## Edge cases
- Verifier cuts everything: don't write filler. Say so and offer more research.
- All posts under 8: one coherent revision each, re-clean, re-judge, at most 2 cycles.
- Image generation fails: the post ships without an image, keep the prompt.
- `topics-performance.json` missing: create it as `[]`; the analyst skips the loop.
- Agents read and write relative to the buyer's project, so run them from the project root.

## Post quality rules
- Every post delivers a concrete, usable move. Genuinely new by the value bar.
- Every post in a batch has its own shape, and none falls back on a stock template.
- Limits are said out loud, and nothing gets invented.
- All rules in `references/channel-rules.md`.
