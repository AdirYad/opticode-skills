---
name: mailos
description: >
  Writes Hebrew marketing emails (newsletter, build-up, launch, Q&A, deadline, extension, abandoned cart) from a numbered
  fact ledger kept in the buyer's project, runs a deterministic QA gate where every number and quote must exist in the
  ledger, and delivers ready HTML and text files for any email tool. The AI can never add a fact. Use when the user asks
  for an email, a launch or build-up sequence, a cart sequence, a newsletter, or says מייל, סדרת מיילים, מיילים להשקה,
  מייל נוטשים, ניוזלטר, תכתוב לי מייל, דיוור, /mailos.
---

# MailOS

Emails that read as if the sender typed them, built only from facts the buyer supplied. A script rejects any number or quote that is not in the ledger, so the model has no way to make one up and ship it.

`<skill>` is this skill's folder (the base directory shown when it loads). Load `references/playbook.md` for every job. Everything said to the buyer is in simple spoken Hebrew, generic singular, no em or en dashes, no comma before ו, ₪ before digits, "קלוד קוד" in Hebrew text.

## First run (only if `<skill>/brand.json` does not exist)
1. Send one numbered Hebrew message:
   1. איך קוראים לעסק ובאיזה שם חותמים על המיילים?
   2. למי המיילים מיועדים?
   3. יש תמונה עגולה שלך לנ.ב.? אם כן, קישור אליה. אפשר לדלג.
   4. אילו פרטים נכנסים בתחתית המייל, כמו כתובת העסק וקישור להסרה? חלק ממערכות המיילים מוסיפות אותם לבד.
   5. אם יש 2 עד 5 מיילים ששלחת בעבר, אפשר להדביק אותם כאן ואכתוב בסגנון שלך.
2. Store the answers in `<skill>/brand.json`: `{ "business": "", "senderName": "", "audience": "", "psPhotoUrl": "", "footerHtml": "", "footerText": "" }`. Create `<skill>/voice/samples/` and put the pasted emails there.
3. `node "<skill>/scripts/lint.mjs" --self-test` has to print `self-test ok`. Node 18 or newer is all it needs.

## What never bends (check again at step 6)
1. **The ledger is the only source of facts.** That is `## פנקס עובדות` in `emails/<product>/ledger.md`: numbers, quotes, prices, dates, stories. A required fact that is absent is a question for the buyer.
2. **A deadline must be real** (a row of type `דדליין`) and named as a day. Remaining-seat counts don't exist here. Two-date launches follow section 5 of the playbook.
3. **Hebrew:** no dash of any kind (a prefix on a digit or Latin letters, as in `ב-20:00`, is allowed), no comma before ו, ₪ before the number, no emoji. The reader is one person of no stated gender, never a plural crowd. The table in playbook section 3 shows how.
4. **Paid products** never get the words חינם, מתנה or ללא עלות (lint `--paid`).
5. **Looks typed:** exactly two text blocks, the body and then the P.S. Only text links, around three. Details in playbook sections 1 and 3.
6. **Value emails** stay link-free until the final email of a run (lint `--nurture`).
7. **`## לא להשתמש`** in the ledger is read before the first word.

## Modes
```
intake <product>                                                    build or update the ledger
write <type> <product> [--idea "..."] [--deadline "<ledger id>"]    one email
sequence <buildup|launch|cart> <product>                            a set, see references/email-types.md
template <paste>                                                    fill a pasted template exactly
review <sequence>                                                   final pass on a whole sequence
```
`product` is a slug. **intake:** start from `references/ledger-template.md`, save to `emails/<product>/ledger.md`, collect the facts in one numbered message, add one numbered row per fact, and write whatever is still unknown under `## חסר`. A fact enters only if the buyer stated it or it is on a page the buyer pointed to.

## Steps
0. **Load:** the playbook, the ledger, `brand.json`, `voice/learnings.md`, two files from `voice/samples/`, the type in `references/email-types.md`, `references/rewrite-rules.md`, and earlier emails in `emails/<product>/` so that nothing repeats. No ledger means intake comes first.
1. **Check requirements.** Compare the type's needs with the ledger. Put every gap in one numbered message. The answer "אין" removes that slot. A blocked type (no real deadline, say) stops here and the buyer is told why.
2. **Draft** using the structure of the type and the drafting order in `references/rewrite-rules.md`. Tag factual sentences like `[F07]` in the working copy only.
3. **Repair:** diagnose, then apply at most two fixes from the repair table. A fix may not bring in anything absent from the ledger.
4. **Subject last:** four options, one per angle in playbook section 2, at most 5 words, plus a preheader. Recommend one.
5. **Save** `emails/<product>/<YYYY-MM-DD>-<type>.json`: `{ "subject", "preheader", "isPromotional", "blocks": [{ "type": "text", "html": "..." }] }`. `isPromotional` is true whenever the email sells.
6. **Gate, every item, in this order:**
   - `node "<skill>/scripts/build.mjs" <draft.json> <ledger.md> [--deadline] [--nurture] [--paid]` prints `PASS`, or writes nothing. It runs `scripts/lint.mjs` for you. Use `--deadline` only when the email relies on a ledger deadline, `--nurture` on a value email that isn't the last, `--paid` on a paid product. Go through the WARN lines too.
   - Fact table: each sentence making a claim is mapped to an F-id, marked as an openly invented parable, or removed. A first-person story without an F-id is removed. This is the only check on numbers spelled out in words.
   - Machine-writing check: remove inflated importance, neat groups of three, and stock openers such as "בעולם של היום". Prefer one specific detail to a general category.
   - Hebrew: run the `hebrew-guard` agent on the final text if it's installed and apply its fixes. Otherwise check RTL, spelling and natural spoken phrasing yourself.
   - Something fails: one fix, one rerun. Still failing: stop and tell the buyer exactly what is blocking it.
7. **Deliver:** `build` already wrote `.html` and `.txt`. Add `<...>.review.md` with the four subjects, the fact table and the lint output. In chat, 3 to 5 lines: subject, type, paths, what was dropped for lack of facts. MailOS never sends anything.

## A whole sequence
One `mailos-writer` agent per email, launched together, each given `SKILL_DIR=<skill>`, the ledger path, the type and the send day. A fresh install needs a new session before that agent type exists; until then, launch a general-purpose agent and have it read and follow `<skill>/agents/mailos-writer.md`. Afterwards run playbook section 8 across the set, fix small problems directly, rerun the gate on what changed, and report each fix in a line.

## When the buyer edits a draft
Log one dated line in `voice/learnings.md`: the original, the replacement, the rule behind it. An approved email is copied into `voice/samples/`.
