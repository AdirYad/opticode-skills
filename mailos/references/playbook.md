# MailOS playbook

A reader decides six small things about an email in under a minute: is this from a real person, do I open it, do I keep going, do I believe it, do I click, do I stay on this list. Each section below protects one of those decisions. When a draft feels weak, find the first decision it loses and work there. Polishing a later part of a broken chain is wasted effort.

A dated line in `voice/learnings.md` is this buyer's own correction and outranks anything written here.

## 1. "Is this from a real person?"
Designed newsletters get filed as promotions, by the inbox and by the reader's eye. So MailOS only produces mail that could have been typed in a hurry by the sender.
- **Shape the lint enforces:** two `text` blocks and nothing else. The first carries the whole message. The second opens with `<p><strong>נ.ב.</strong></p>` and is always last. No other block may contain נ.ב.
- **Tags in use:** `p`, `strong`, `em`, `a`, inline `img`, `h2`, `h3`, and `ul`/`ol` when listing what an offer includes. The lint rejects `blockquote`, `hr`, `small`, centring, button blocks and image blocks.
- A proof picture sits between paragraphs: `<img src alt width="280">`.
- Sign-off, round photo and legal footer are added by `scripts/build.mjs` from `brand.json`, so the body ends without them.
- A letter has no headline. An email that tells one story gets a single `h2` at most, on the sentence where the story changes direction, and no `h3`. Selling emails may use `h2` for the claim and `h3` for labels such as a question or a list title.
- The product's name is bold and without quote marks.

## 2. "Do I open it?"
The subject is written after the body, because only then is it clear what the email is really about.
- At most 5 words (lint warning). It has to be true of the body, and the body has to pay it off within three paragraphs.
- It talks about the reader's life. The seller's news is only interesting once the reader cares.
- Offer four candidates, one from each angle:
  - **the moment**: names a situation the reader recognises from this week.
  - **the crack**: two things that should not go together.
  - **the missing piece**: points at something specific without saying what it is.
  - **the plain update**: what a colleague would write ("פתחתי את ההרשמה").
- The preheader carries on from the subject. If it repeats the subject or the first line, it is wasted.
- Inside one sequence, every subject must look clearly different: inboxes fold similar subjects into a single thread and the newer email vanishes.
- Spell-check subjects by eye. A typo in the subject is the most expensive typo there is.
- Israeli law wants the word "פרסומת" opening the subject of an ad. `build.mjs` adds it when `isPromotional` is true, so don't write it yourself.

## 3. "Do I keep going?"
Assume a phone, one thumb, and something more interesting one tap away.
- A paragraph is one thought and fits in two phone lines. At about 20 words, split the sentence.
- Bold between two and five lines. Test: someone who reads only the bold still gets the argument and the ask.
- Say the same word twice in neighbouring sentences only on purpose.

**Address.** One reader, no assumed gender. Written Hebrew defaults to masculine, so this needs active care.

| avoid | write |
|---|---|
| אתה, תלחץ, תחשוב, תדמיין | יש ללחוץ, אפשר לדמיין, מספיק לחשוב על זה רגע |
| מוכן, טכני, קרוב (about the reader) | הכל מוכן, בלי רקע טכני, עוד צעד אחד |
| מצטרף, מפסיק (in a link) | להצטרפות, להפסיק עם זה |
| אתם, לכם, תלחצו | לך, שלך |

Past tense ("קראת", "נרשמת") and "לך" or "שלך" need no change. The lint warns on common misses; it does not catch them all.

**Punctuation the lint rejects:** em dash, en dash, maqaf, a hyphen between Hebrew words (a prefix before a digit or Latin letters, as in `ב-20:00`, is allowed), a comma before ו, ₪ after the number, any emoji.

**Midnight:** "הלילה ב-00:00". The lint rejects the "today at midnight" form because the reader takes it as a time that has already passed.

## 4. "Do I believe it?"
- Everything checkable comes out of the ledger. A slot the ledger can't fill is a question for the buyer with two or three options, never a guess. Before drafting, read `## לא להשתמש`.
- The script only sees digits and quotation marks. "שלושים לקוחות" and an invented anecdote slip past it. That is why the fact table in the gate is mandatory and not paperwork.
- Treat proof as a budget. Any one ledger row appears in at most two emails of a sequence, and the same goes for the promise sentence. Vary the kind of evidence: someone else's words, something the product really does, a change in the reader's week.
- Describe what the reader ends up with. How it works belongs on the sales page.

## 5. "Do I click?"
- Text links only, about three per email (lint warning above that). Each link wording appears once in a sequence and says what the reader gets.
- Promise only what truly happens after the click.
- The link goes where the reader's decision stands:

| reader is | emails | destination |
|---|---|---|
| still weighing it | launch open, Q&A | top of the sales page |
| has mostly decided | what's inside, deadline, cart | payment form |

**Urgency has one source: a real date in the ledger**, type `דדליין`.
- Write it as a named day. The day before, it becomes "מחר". On the day, "הלילה".
- The date shows up in two places in an email at most, and the last one is directly above the final link, so the reader finishes on the reason and then the action.
- Never count remaining seats, and never hint that the price may go up later.
- **Two real dates:** while the first is still ahead, emails mention only the first one. Otherwise the second date cancels the first. The extension email and the final-day emails then handle the rest.

## 6. "Do I stay on this list?"
Unsubscribes come from pressure and from repetition more than from selling.
- On the closing day, the last email is short and its P.S. lets the reader off the hook.
- `scripts/build.mjs` writes `.html` and `.txt`; the buyer imports them into any email tool. Make sure that tool adds an unsubscribe link, or put one in `brand.json` `footerHtml`.
- Suggest send times away from the top and bottom of the hour, when every other campaign lands.
- Buyers come out of the launch list on the day they buy.
- A test send to one real inbox happens before every campaign.
- `emails/<product>/sequence.md` lists every email and its current subject. Change a subject, change that file.

## 7. Templates the buyer pastes
The person who wrote it chose those line breaks on purpose. Keep the order, the short lines and the sign-off. Only fill the blanks from the ledger, make masculine lines gender-neutral, and ask with options about any blank the ledger can't fill. A template may keep more links than the rule above if the buyer says so. Don't improve it unless asked.

## 8. Sequence review
Run this across the whole set, after each email has passed its own gate.
1. Subjects: no two look alike, spelling checked.
2. Budgets: each proof row and the promise sentence in two emails at most; no word three times in one email.
3. Dates: the same deadline described the same way on every day, and each time word unambiguous.
4. Neutral address everywhere, including subjects, link text and every P.S.
5. Links: count, destination for the stage, wording used only once.
6. Every email printed PASS after its last edit.
