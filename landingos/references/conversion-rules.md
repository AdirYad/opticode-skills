# Universal conversion rules

Read before every page. Run the pre-flight list before every handoff.

## Copy
- The owner's text is pasted verbatim. When they rewrite a line, replace it exactly. If something reads wrong (grammar, a number that does not add up), report it, do not fix it.
- When asked to shorten, propose versions with what was cut and why, and recommend one.
- Numbers on the page must agree with each other. When two disagree, ask which is true, then make every mention match.
- Hebrew labels in grids: verb on line 1, object on line 2, a different verb per card.
- Under a capability, answer "what does this give me?" with the business outcome.

## Layout and visuals
- The hero is at least the full viewport height (`min-height:100svh`).
- No icon on its own row inside a card, it wastes height. Use the corner badge (`.ocard__badge`).
- Every abstract claim gets a real, specific visual. A sentence that lists things becomes a graphic of those things.
- Abstract charts lose to real artefacts.
- Emotional key phrases can get a signature effect. One per moment, not everywhere.
- Images are fully visible and centred in their frame.
- Light illustrations on a dark page are re-rendered dark, never pasted as light cards.
- Private details in an image are blurred so they cannot be read.
- Marking what is over: no strike line through words, it becomes unreadable. Use the icon colour and keep the text bright.

## Proof and people
- Photos of the expert are real, sharp and well lit. Ask for better ones before settling.
- Before/after: same pose, same zoom, same crop, a badge on each side.
- Reels on the page: the best by public view count, in fixed 9:16 cards so the row never breaks.
- Screenshots are taken fresh, with a proper Hebrew font.

## Money
- A button every ~2 screens on the way to the price, same look and text, all landing on the price card.
- The only button inside an FAQ answer is the one in the last answer, the price objection. The others go after the list.
- Installments always show the rounded amount: "או 3 תשלומים של ₪76", never "עד 3 תשלומים" and never ₪75.67.
- Payment badges sit in one row on every width.
- The closing section is one card: mockup, avatar over the closing line, the same price block as the price section, what's included, form, badges.
- FAQ: questions right-aligned and bold, smooth open animation, one open at a time.

## Pre-flight before every handoff
1. For each rule above that the page touches, check the page against it.
2. `lp-gaps.mjs` shows no MISSING (or every gap was reported to the owner), `lp-check.mjs` RESULT: PASS, `lp-timing.cjs` shows every word-lighting block 100% lit at reading height.
3. Eye review of both sheets, mobile and desktop, with `references/eye-check.md`.
4. Numbers cross-check: every count, price and installment on the page agrees.
5. On the live domain: every form works, payment link goes to the right price, videos play.
