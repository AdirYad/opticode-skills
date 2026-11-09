# LP Conversion Contract

Binding doctrine for every landing page LandingOS builds. `landingos-copy`, `landingos-visitor`, `landingos-art` and the finish gate all read this file. Every rule below is a requirement to satisfy, not a direction to weigh. Figures are quoted verbatim and stay verbatim wherever they are cited again downstream: paraphrasing a number is how a section quietly loses the thing a reviewer checks against.

**The audience.** Whoever `brand.json` names. By default: cold traffic from a paid social ad, on a phone, reading Hebrew right to left. They did not opt in to learn about the product. The ad bought one click, and this page is the only thing that closes it.

**No invented claims.** A price, a customer, a benchmark, a capability, a testimonial or a statistic that is not real does not go on the page, not even as a plausible placeholder. Where proof does not exist yet, write `PROOF MISSING` and stop; do not fill the gap with something that reads true. A placeholder names only the KIND of asset that goes there ("ביקורת לקוח עם שם ותמונה"). It never carries production state (who to chase, what is pending approval, which section stays hidden until content exists, a client "coming later") and never a real third party's name: rendered in the page's own type, a note reads as shipped copy, and the mock may be shared. Production notes live in the build's working files, never in page or comp text. The Hebrew lines used as examples inside this file are illustrative and synthetic, not claims about any real product; they exist to show a pattern, not to be copied onto a page.

## 1. The above-the-fold formula

Spend most of the build effort here. Many visitors never scroll past the first screen; every visitor sees it. If this block fails, nothing below it gets read. Seven elements, in this exact order, nothing inserted between them:

1. **Headline: the dream outcome.** States what the visitor gets, never who the business is or what it does, no jargon. Build it with the so-that chain: state the thing on offer, then chain "so that" until it lands on the outcome the visitor actually wants, then write only that last link as the headline. Worked example, synthetic: "אנחנו מלמדים לבנות מערכת תורים" (העובדה) → כדי שלא תשלם למתכנת על כל שינוי → כדי שתוכל להתחיל לעבוד איתה תוך 30 יום → כדי שתרגיש שהעסק שלך עומד על הרגליים שלו (החלום). הכותרת כותבת רק את הקצה: "בעוד 30 יום העסק שלך רץ על מערכת שבנית בעצמך."
2. **Subheadline: how, carrying the USP, phrased to reduce effort.** One sentence explaining the mechanism, shaped as "without X, Y": what the visitor is spared, and what they get instead. Example: "בלי לדעת לתכנת ובלי לשכור מפתח, תצא עם מערכת שעובדת."
3. **At least two forms of social proof**, visible without scrolling, and of two different kinds. A logo wall is one form; a name-and-photo review is a second. Two instances of the same kind of proof do not satisfy this.
4. **One benefit-driven CTA button.** The label states what the visitor gets by clicking, not the mechanic of clicking: not "שליחה", something that names the outcome or the decision. Exactly one button in this block; a second CTA above the fold splits the one intent the ad already paid for.

   **One label for the whole page, three words, first person, stated as a want.** Every buy button on the page carries the identical string. A page with four labels reads as four different offers. Keep it to about three words: `אני רוצה לבנות`. First person and a stated want beat both a command ("התחל עכשיו") and a declaration ("אני בונה אפליקציה"), the visitor is deciding, not reporting. The only button exempt is the one inside the form itself, which names the mechanic it actually performs ("מעבר לתשלום מאובטח").
5. **FUD reduction directly under the button.** A guarantee, a refund window, a free trial, or a warranty, touching the CTA, not lower on the page. This placement usually does more than any other single line on the page. If real risk reversal exists, it goes here; if it does not exist yet, that is a product gap to flag, never a line to invent.
6. **An image or video that proves the headline**, by showing the thing itself or the outcome it produces, never a decorative stand-in. It sits in the page's own palette and never looks pasted on.
7. **Nothing else.** No nav exploration, no secondary offer, no trust badge that isn't reducing a real fear. If an element doesn't serve one of the six above, it does not belong above the fold.

## 2. The value equation across the page

The dream outcome from section 1 does not stay in the headline. It repeats in section headlines and imagery all the way down the page, so a visitor who only scans headlines still tracks the same promise.

Perceived likelihood of success is built from two things and nothing else: proof, and risk reversal. A promise is only ever an approximation of the result; proof and a real guarantee are what a skeptical visitor actually weighs.

Time delay is closed explicitly, in the headline or the subheadline, never left implied. State the window: "תוך 30 יום" is the pattern, not a fixed number to reuse untested.

Effort and sacrifice are reduced in two places: the subheadline (the "without X, Y" line from section 1), and a how-it-works section of 3-4 steps, never 5 or more. Step count itself reads as effort before a visitor evaluates a single step's content, so a 6-step process that could be told in 4 loses conversions on the count alone.

## 3. The proof bar

Social proof only works while it reads as verifiable. A review carries a name, a photo, and its source, every time, with no exceptions for a review that is otherwise strong copy. A "featured in" logo without a quote from that publication is worse than no logo: it reads as generic decoration and erodes trust instead of building it; the same logo with a pulled quote does the opposite.

Visual proof beats text proof: a screenshot, a before-and-after, a video, in that order of preference over a paragraph making the same claim. Stack proof through the page rather than sampling it once near the top and assuming it carries the rest of the scroll.

Never hide proof inside a mobile carousel or an accordion. What a visitor has to tap to see is proof they never see; a carousel's second and third slides and an accordion's collapsed panels are, for conversion purposes, not on the page.

## 4. Structure and scanning

A long page does not cost conversions on its own; a badly structured one does. The ad bought the click, the page does the selling, so the page carries multiple value-prop, proof, and objection sections rather than a single pitch that stops early.

Visitors read 20% of the page and scan the rest, so the page has to be comprehensible from headlines alone: every section headline states its own answer, not a topic label waiting for the body copy to explain it. Ban this exact set of generic headlines, and replace each with the actual answer it should have stated: "איך זה עובד", "מה מייחד אותנו", "השירותים שלנו", "מה הלקוחות אומרים". A section titled "איך זה עובד" tells a scanning visitor nothing; a section titled with the actual three-step answer does the section's job without a click.

Visual hierarchy carries the eye by size, weight, and colour, not by adding more elements to compete for attention. Too many options at equal visual weight produce analysis paralysis; one path should read as the obvious next thing to look at on every screen.

**Every buy button lands on the form, not on the top of the price section.** A CTA that scrolls to the section headline drops the visitor above the price anchors and makes them scroll again to find the field they came to fill. Anchor the buttons at the price card itself; leave the nav link pointing at the section. When buttons land above the price, most of the clicks never reach the form.

**A button drawn inside an illustration is a real link.** Mock UI in a visual, a "פרסם" chip, a "הצטרפו עכשיו" inside a browser mockup, gets clicked by real visitors (rage clicks land on them), so it points at the same destination as the page's own CTA. Never ship a decorative button with nothing behind it.

### The FAQ section

The FAQ is the objection section, so it is written from what buyers actually asked, in their words, not from questions the page wishes they had asked. Collect them from DMs, calls and replies in the days around launch, and use the asker's own phrasing for the question line.

- **Short, exact answers.** One claim per answer, the concrete facts that sell it, nothing else. Compression removes filler, never the selling facts: course length, format, what happens after each lesson and any number the buyer weighs stay in, even when the answer gets cut in half.
- **Merge duplicates.** Two questions circling the same worry become one. Fourteen sharp entries beat seventeen with three near-repeats.
- **Order follows the buyer's head, not the product's structure:** am I capable → why this one and not the others → how long it takes → what happens when I get stuck → the technical questions (platform, device, prerequisites) → what I actually receive → the price objection.
- **The last question is always the price objection** ("מה הקאץ'. איך זה כל כך זול?"), answered with the real story of how the product came to cost that, closed with the guarantee, and carrying the page's buy button inside the answer, identical label and styling to every other CTA. A reader who opened that question is at the decision, and the button belongs where they already are.
- **No answer states a commitment the owner did not make.** "אני מתחייב שהמסלול יישאר עדכני" is a warranty, not copy; it goes in only if the owner said it.

## 5. Hebrew and RTL rules

Body prose starts in Hebrew, RTL throughout, spoken register, not written-formal. Three punctuation and phrasing rules bind every Hebrew line on the page, and the Hebrew review scores against them: no comma before a ו conjunction (the ו already continues the sentence, grep `, ו` and fix every hit), no colon inside running prose (end the sentence instead), and natural word order that opens on who acts rather than on the object ("אתה רואה כבר בשבוע הראשון תוצאות", not "תוצאות אתה רואה כבר בשבוע הראשון"). A hyphen is permitted only between a one-letter Hebrew prefix and what follows it when what follows is Latin script, a digit, or a symbol: `ב-Wix`, `מ-10`, `ל-3`, `ב-₪497`. A hyphen flanked by Hebrew letters on both sides is always wrong: `ה-מע"מ` is `המע"מ`. Em-dashes and en-dashes are never used in Hebrew prose at all. `₪` precedes digits with no space (`₪497`, not `497 ₪` and not `₪ 497`); `+ מע"מ` on a payment line follows item 23, which depends on whether the buyer is charged before or including tax. Pick one noun for the product and keep it on every line of the page. Address the reader in generic singular unless `brand.json` says otherwise.

**Image models cannot render Hebrew.** In comps, any Hebrew shown is a shape standing in for text, never text to be read as copy. A comp is never accepted or rejected on the strings inside it; that judgment happens later, in code, once real Hebrew is set.

## 6. The finish checklist

One line per check, pass or fail, no partial credit. A reviewer fills this in against a built page.

1. Headline states the dream outcome via a worked so-that chain, with no "who we are" / "what we do" framing and no jargon.
2. Subheadline explains how, carries the USP, and is phrased as "without X, Y".
3. At least two different forms of social proof are visible without scrolling.
4. Exactly one benefit-driven CTA button sits above the fold.
5. FUD reduction (guarantee, refund window, trial, or warranty) sits directly under the CTA button, not lower on the page.
6. The hero image or video proves the headline and sits in the page's own palette.
7. Nothing above the fold falls outside the six elements above.
8. The dream outcome repeats in section headlines and imagery below the fold.
9. Perceived likelihood of success is carried by proof plus risk reversal, not by promises alone.
10. Time delay is closed explicitly in the headline or subheadline.
11. The how-it-works section has 3-4 steps, never 5 or more.
12. Every review on the page carries a name, a photo, and its source.
13. Every "featured in" logo carries a quote from that publication.
14. Visual proof (screenshot, before/after, video) is used ahead of plain text wherever it is available.
15. Proof is stacked through the page, not sampled once near the top.
16. No proof is hidden inside a mobile carousel or an accordion.
17. Every section headline states its own answer and is comprehensible without reading the body.
18. None of the banned generic headlines appear anywhere on the page.
19. The page carries multiple value-prop, proof, and objection sections matched to what the ad promised.
20. Visual hierarchy directs the eye by size, weight, and colour; no screen presents competing options at equal weight.
21. Body prose is Hebrew, RTL, spoken register, throughout.
22. No em-dashes or `-` dashes appear inside Hebrew prose (an English prefix like `ב-Wix` is not a violation).
**Item 3b, a picture of the product is evidence too, and inventing one is fabrication.**

Every proof rule in this contract guards evidence ABOUT the product: testimonials, results, logos, counts, prices paid. None of them guards a depiction OF the product, and that is the easiest gap to fall into. An invented screenshot of your own software, an app with plausible client rows, a dashboard with invented numbers, an app screen that does not exist, is fabricated evidence exactly as much as an invented testimonial. It is also the more natural thing for an image model to produce, because a brief that says "show the product" is literally asking to see it.

So: a product screen shown anywhere on the page is a REAL capture of the running product, composited into the design. It is never generated, never re-drawn "in the style of" the real thing, never populated with invented rows, names, numbers or contacts. If no real capture exists, the screen is absent and the slot is marked `PROOF MISSING` like any other. Captioning an invented screen with a claim about real results, a label, a caption, a frame, a heading, is the worst form of it, because the caption is what turns a picture into a claim.

This rule binds the concept round as hard as it binds the finish: a comp is where the invented screen gets approved, and everything downstream then treats it as the thing to reproduce faithfully.

23. `₪` precedes every price with no space. Whether a payment line carries `+ מע"מ` follows what the buyer is actually charged, and the two cases are not interchangeable. A price quoted BEFORE tax, the normal shape for a B2B service or a proposal, carries `+ מע"מ` on every payment line, so the reader is never surprised at invoicing. A price the buyer is charged in full, tax included, the normal shape for a consumer product with a checkout, states that figure plainly and NEVER appends `+ מע"מ`, because appending it there promises a charge that will not happen and creates a gap between the page and the invoice. Resolve which case applies by checking what the payment processor actually charges, not by defaulting.
24. One noun names the product, on every line of the page.
25. No claim, price, customer, benchmark, capability, testimonial, or statistic on the page is invented; unproven claims are marked `PROOF MISSING`, not written around.
26. Every buy button on the page carries the identical ~three-word first-person label; only the form's own submit button names its mechanic instead.
27. Every buy button anchors at the form itself, and any button drawn inside an illustration links to that same anchor.
28. FAQ questions come from real buyer questions in the asker's phrasing, carry no near-duplicates, and run in the buyer's order (capability → why this one → how long → getting stuck → technical → what I receive → price objection).
29. The last FAQ entry is the price objection, answered with the real origin story plus the guarantee, and carries the page's buy button inside the answer.
30. Nothing on the page promises a feature the product does not include, and no line states a commitment or warranty the owner did not make. When a feature leaves the product, it leaves EVERY surface: search the whole repo for it (outcome cards, journey steps, FAQ answers, slide decks, ads) rather than deleting only the instance that was pointed at, one dropped module usually lives in three separate places.
31. Hebrew prose carries no comma before a ו conjunction, no colon inside running prose, and no sentence that opens on its object.
