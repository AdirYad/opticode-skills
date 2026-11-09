# Email types

The `type` id in the left of each heading is what `write <type>` takes and what goes into the filename. Each entry gives the job, what the ledger must hold, the order of the email, and the links. A missing requirement is a question to the buyer, or a blocked email where noted. `isPromotional` is `true` whenever the email sells; `false` only for pure value.

## `newsletter`: one useful thing
**Job:** give the reader a reason to keep opening. **Needs:** an idea from the buyer; any number or story from the ledger.
**Order:** a situation the reader knows, the one idea, how to use it today, a short ending.
**Links:** none until the last email of a nurture run (lint `--nurture` on the others).

## `buildup`: before a dated launch
**Job:** change one belief, and make the launch date something to wait for. **Needs:** `השקה` row, and a `סיפור` or `יכולת` row.
**Order:** start inside something familiar, show what failed, one shift (one `h2` allowed there), stop before explaining how. The sharpest sentence closes the body. The P.S. gives the date or says what the next email is about.
**Links:** none to the sales page. A single proof link at most.
**A set of three** carries three different beliefs: this costs more than it seems, the usual fixes fail for a specific reason, a different way exists and it opens on this date.

## `launch-open`: the doors open
**Job:** deliver what the build-up promised and get people to the page. **Needs:** sales link, `דדליין` day.
**Order:** it's open, with a link, in the first paragraph. What was promised. The product in a single sentence. Two capabilities, each starting with a bold phrase. One proof. The promise as `h2`. Bonus in one sentence, no list. The date. The ask. The P.S. carries a link and another reason.
**Links:** 3, sales page top.

## `qa`: removing reasons not to buy
**Job:** answer what stops people. **Needs:** `## התנגדויות + תשובות` in the ledger. Only objections listed there.
**Order:** the largest objection as `h2`, answered with proof and a link. Then the rest as `h3`, phrased the way the reader would say them, each answered in a line or two. A link halfway. The closing date is answered as the final question. The P.S. invites the reader to hit reply with a question of their own.
**Links:** 3, sales page top.

## `inside`: picturing it
**Job:** let someone who is nearly there imagine having it. **Needs:** `יכולת` and `בונוס` rows.
**Order:** an ordinary day after buying. A titled list of what it does. A titled list of what comes with it, strongest first and bold. The promise once as `h2`. The date. The ask. The P.S. names one benefit that is in neither list.
**Links:** 1, payment form.

## `deadline-morning`: closing day, first email
**Needs:** `דדליין`. Without it this email is **blocked**. Lint with `--deadline`.
**Order:** `h2` with what closes and when ("הלילה ב-00:00 זה נסגר"). A link right away. What stays the same after tonight against what changes. The single objection that late deciders still hold. The date line, then the final link. The P.S. describes next week either way.
**Links:** 2 or 3, payment form.

## `deadline-evening`: a few hours before closing
**Needs:** `דדליין`. **Blocked** without it. Lint with `--deadline`.
**Order:** three or four short lines: how long is left, the one thing the reader gets, the link. The P.S. says plainly that passing is fine. This is the email that keeps unsubscribes low.
**Links:** 1, payment form.

## `extension`: a second real date
**Needs:** a second `דדליין` row and the true reason in the ledger. Without both, **blocked**. Lint with `--deadline`.
**Order:** say it plainly as `h2`: this was supposed to be over. Why it isn't. The new date. Link. A proof not used so far in the sequence. Link. The P.S. says this date is final, only if the buyer confirms it is.

## `cart`: someone who started and stopped
**Job:** service, not pursuit. These send per person and may fire long after a launch, so no launch dates or prices unless the buyer approves and removes them later. Never tell the reader what they did on the checkout page.
1. **A few hours later.** A short note: if something got stuck or a question came up, reply and it gets sorted. The product in one line. Link.
2. **Next day.** The most common objection in the ledger, answered honestly. Reply invitation. Link in the P.S.
3. **Three days later.** What stays the same if nothing changes, what is inside in a short list, and a clear end: this is the last note on the subject. Link.

## Sequences
Spread the set over the real dates in the ledger.
- **`buildup`:** three emails, the last one the day before launch.
- **`launch`, one date:** `launch-open` on the first day, `qa` next, `inside` the day before closing, then `deadline-morning` and `deadline-evening` on the closing day.
- **`launch`, two dates:** the same up to the first date, then `extension` the next morning and `deadline-morning` plus `deadline-evening` on the last day.
- **`cart`:** the three notes above.
