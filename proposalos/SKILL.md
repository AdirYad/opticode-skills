---
name: proposalos
description: >-
  Writes a client proposal and renders it into a beautifully designed Hebrew RTL PDF: cover, the client's problem,
  scope and what is out of scope, timeline, pricing tiers, terms and a signature block. Runs on the buyer's own Chrome
  or Edge, no npm and no API keys. Use when the user wants a proposal, quote, price offer or pricing document for a client,
  or says proposal, quote, client proposal, הצעת מחיר, הצעה ללקוח, תכין הצעה, פרופוזל, /proposalos.
---

# ProposalOS

Turns a short brief into a PDF a business owner is proud to send. The document is a finished file in the owner's project. Nothing is sent to anyone.

Talk to the owner in simple spoken Hebrew, generic singular, no dashes, no comma before ו, ₪ before digits, and call the tool "קלוד קוד". `<skill>` below means the folder this file was loaded from.

## First run: business details

Check for `<skill>/config.json`. If it does not exist, ask once, in one message, and save the answers there.

```
כמה פרטים חד פעמיים, הם ייכנסו לכל הצעה ואני לא אשאל שוב.
1. שם העסק כמו שהוא מופיע על חשבונית
2. השם שלך ומספר עוסק או ח.פ
3. סוג העסק: עוסק מורשה, חברה בע"מ, או עוסק פטור
4. טלפון, מייל, אתר (מה שרוצים שיופיע)
5. לוגו (נתיב לקובץ) וצבע מותג אחד (HEX). אם אין, אבחר צבע רגוע
6. תנאי תשלום רגילים (למשל 50% מקדמה ו 50% במסירה)
7. כמה ימים הצעה בתוקף ובאיזו עיר סמכות השיפוט
8. מה העסק מוכר ומה טווחי המחירים הרגילים שלך
```

```json
{ "businessName": "", "ownerName": "", "idLabel": "ע.מ", "idNumber": "", "phone": "", "email": "", "website": "", "address": "",
  "vat": "authorized | exempt", "accent": "#17352c", "logo": "logo.png", "validityDays": 14,
  "paymentDefault": "", "jurisdiction": "", "services": "", "priceRanges": "" }
```

A company or an authorized dealer is `authorized`, עוסק פטור is `exempt`. Copy the logo into `<skill>/` and save just its file name. `idLabel` is `ע.מ`, `ע.פ` or `ח.פ`.

Say this once, on the first run only: the terms section is a good starting point and a lawyer should read it before it goes out to clients.

## When the trigger is a pasted client message

A pasted WhatsApp or email is not yet a request for a proposal. Ask which output is wanted:

1. הצעת מחיר מלאה (the flow below)
2. פירוק פנימי של סקופ ומחיר, רק בשבילך
3. טיוטת תשובה ללקוח
4. בדיקת היתכנות

Options 2-4 are text in the reply or a file in `proposals/`. They do not build a PDF.

## Flow

**1. Past proposals.** Read the latest 2-3 in `proposals/*/proposal.json` for pricing consistency.

**2. Intake.** Ask what is missing, in one message:

```
1. עושים בשביל הלקוח, או מלווים אותו כדי שילמד לעשות ולתחזק לבד?
2. שם הלקוח, החברה, ת.ז או ח.פ אם ידוע
3. מה הוא צריך, ב 2 עד 3 משפטים
4. איך זה נראה אצלו היום? (מספרים אם יש)
5. תקציב אם ידוע. אם לא, אציע 3 מסלולים
6. דד ליין אם יש
7. דגשים מיוחדים
```

The first question decides the product, the price and who maintains it afterwards, so ask it before anything technical.

**3. Write.** Spawn `proposalos-writer` with the brief, `config.json`, the past-proposal summary and `output_path` = `proposals/YYYY-MM-DD-<client-slug>/proposal.json` in the owner's project. If the agent is not installed, read `<skill>/agents/proposalos-writer.md` and follow it yourself.

**4. Render.**

```bash
node "<skill>/scripts/render.mjs" "proposals/YYYY-MM-DD-<client-slug>/proposal.json"
```

- `RESULT: FAIL` lists exactly what to fix in the JSON (a price with ₪ on the wrong side, a phase without an outcome, a placeholder). Fix the JSON and run again. Never bypass it.
- Exit 2: no Chrome or Edge was found. Relay the message. `CHROME_PATH` points to a browser in a non-standard place.
- No Node on the machine: fill `proposal.css` and the sections of `render.mjs` by hand into one HTML file, then run the browser yourself: `chrome --headless=new --no-pdf-header-footer --print-to-pdf=out.pdf file:///path/to/page.html`.

**5. Look at it.** Read the PDF with the Read tool without the `pages` argument: it shows every page as an image. Check: cover balanced, no orphan heading at a page bottom, RTL right everywhere, prices with ₪ on the correct side, tiers on one page, signature block whole. Fix and render again, at most 2 rounds.

**6. Writing pass.** Read every string once as the client would. Cut anything that sounds like a brochure. Strings only: never change pricing, scope or structure in this pass.

**7. Hand off.** Four lines at most:

```
ההצעה מוכנה: <full path to the PDF>
המסלול המומלץ: <tier + price>
מה הנחתי: <assumptions>
לשנות משהו? תמחור, סקופ, לוחות זמנים או טון
```

Never send the file anywhere. The owner sends it.

## Editing

Change `proposal.json` and render again. One proposal, one folder. Never make a second folder to fix the first. A change to price, scope or dates is said out loud in the summary, because the client may already have the earlier version.

## Rules

- Exactly one recommended tier when there are 2 or 3.
- "מה לא כלול" is mandatory and specific.
- Every payment line is complete: amount, sign first, `+ מע"מ` when the business charges VAT.
- No invented scarcity, testimonials, results or guarantees.
- No retainer or maintenance plan the owner did not name.
- Third-party usage costs are never estimated.
- Sample to test the install: `node "<skill>/scripts/render.mjs" "<skill>/examples/sample.json" --config "<skill>/examples/sample-config.json" --out <some folder>`.

Fonts are Heebo and Frank Ruhl Libre under the SIL Open Font License (`fonts/`).
