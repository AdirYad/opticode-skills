---
name: israeli-ecommerce-compliance
description: Audit and ensure Israeli e-commerce legal compliance, covering Consumer Protection Law, return policies, price display, accessibility, and cookie consent. Use when user asks about "online store compliance Israel", "Chok Hagnat HaTzarchan", "consumer protection Israel", "return policy Israel", "IS 5568 ecommerce", "cookie consent Israel", or "חוק הגנת הצרכן". Covers cooling-off period validation, price display requirements, Hebrew terms of service generation, accessibility compliance (IS 5568), and business disclosure verification. Do NOT use for food-specific compliance (use israeli-food-business-compliance) or privacy/GDPR (use israeli-privacy-shield).
license: MIT
allowed-tools: Bash(python:*) WebFetch
compatibility: Works with Claude Code, OpenClaw, Cursor. OpenClaw recommended for automated website scanning and periodic compliance checks.
---

# Israeli E-Commerce Compliance

## Legal notice

This is a free information tool operated by an AI model. It explains the law and the procedure and helps you organise your own documents. All of its outputs are produced automatically by an AI model, with no involvement, review, or approval by an advocate. The output is not legal advice and not a legal opinion, but a general explanation and a template only: it does not read the full file of your matter, does not check current case law, and does not examine your specific circumstances. An AI model may err, omit data, or present a wrong conclusion.

Any text this tool drafts is an automatic draft for your personal preparation only. It is not a document prepared by an advocate and must not be relied on as evidence. This tool is not a substitute for advice that takes account of the particular circumstances and needs of each person. Before starting proceedings, signing a document, or filing with an authority or a court, consult an advocate. All use of its output is the user's sole responsibility.


## Instructions

> **Note:** This skill provides compliance guidance. It does not replace legal counsel. Recommend consulting a consumer protection attorney (orech din specializing in mishpat tzarchani) for specific compliance decisions.

**Scope first.** The distance-selling rules protect a "צרכן" (someone buying mainly for personal, household or family use) from a "עוסק" selling in the course of business. A B2B wholesale store is outside them. They cover any "עסקת מכר מרחוק" made without the parties being together, so an Instagram, Facebook or WhatsApp shop with a payment link is covered exactly like a website. This skill audits the store's terms, checkout and site. It does not check whether the PRODUCTS may lawfully be sold: cosmetics, electrical goods, toys, food and other regulated categories have their own Ministry of Health or Standards Institution regimes, so flag those and route the user to the regulator or to counsel.

### Step 1: Audit the Cancellation and Refund Rules (Consumer Protection Law, ss.14ג to 14ט)

**Cancellation windows (s.14ג(ג)):**
- Goods: from the day of the transaction until 14 days after receiving the goods or the written disclosure document, whichever is later. The consumer may therefore also cancel before delivery.
- Services: within 14 days of the transaction or of the disclosure document, whichever is later. A continuing transaction (subscription) can be cancelled whether or not the service has started; a one-off service only if the cancellation is made at least 2 days, not counting rest days, before the service is due.
- 4 months (s.14ג1(ג), counted from the latest of the transaction, receipt of the goods or receipt of the disclosure document) for a person with a disability, a senior citizen (65+) or a new immigrant (oleh, within 5 years of the oleh certificate), but ONLY when the transaction included a conversation between the business and the consumer, including a conversation over electronic communication. A pure click-through checkout gets the standard window. A chat with a human agent arguably counts; whether a bot chat counts is unsettled, so flag it rather than decide it. The business may ask for the certificate proving eligibility but no further proof.

**What the business may keep (s.14ה):**
- Change of mind: a cancellation fee of up to 5% of the price or 100 NIS, whichever is lower. Under s.14ה(ד) that "fee" already includes shipping, packaging and any other cost the business says it incurred, so the business cannot add return or outbound shipping on top of the cap. The consumer returns the goods to the business's place of business, so the return trip is the consumer's, but the business may not charge for it beyond the cap.
- Defect, non-conformity with the disclosed details, late supply or any other breach by the business: no fee at all. The consumer does not have to ship anything back; they make the goods available where they were delivered and notify the business.
- A continuing service already started: the proportional price for the service actually given. Home installation: up to 100 NIS. Significant deterioration of the goods: a damages claim, not a deduction the business may impose.
- Refund within 14 days of receiving the cancellation notice: return the money paid, cancel the charge and give the consumer a copy of the charge-cancellation notice. Failing to refund after a distance-sale cancellation, or continuing to bill a subscription after a cancellation notice, exposes the business to exemplary damages of up to 10,000 NIS without proof of harm (s.31א), and up to 50,000 NIS for a repeat breach (within two years of an earlier breach of the same provision that led to a conviction), a breach continued after a Consumer Protection Authority notice or a court order, or a breach in aggravated circumstances (s.31א(ג)).

**Exceptions (s.14ג(ד)), the ONLY list for distance sales:**
1. Perishable goods
2. Accommodation, travel, holiday or leisure services, if the cancellation falls within 7 days (not counting rest days) before the service date
3. "Information" as defined in the Computers Law (digital content, software)
4. Goods made specially for the consumer following the transaction
5. Goods that can be recorded, reproduced or copied, whose original packaging the consumer opened

The longer list in reg. 6 of the Consumer Protection (Cancellation of Transaction) Regulations 2010 (for example underwear and swimwear, food products, medicines) limits only the cancellation right under THOSE regulations, which apply to cancellations under s.14ו and not to the distance-sale right in s.14ג. Do NOT use it to refuse an online cancellation.

**Cancellation channels (s.14ט):** the business must accept a cancellation notice by phone or orally, by registered mail, by email, by fax if it has one, and over the internet where the deal could be made online. A website through which deals can be made must carry a dedicated cancellation link on its HOMEPAGE, placed prominently, with the cancellation methods stated next to it. The consumer only has to give their name and ID number, plus, for a phone or oral notice, any additional identifying detail agreed when the deal was made. The cancellation methods and the contact details for every channel must be disclosed in writing no later than supply, and must also appear on every invoice, receipt or payment notice sent to the consumer and on the homepage, grouped together with special prominence (s.14ט(ה)-(ו)). A continuing transaction ends within 3 business days of the notice (6 business days if sent by registered mail), per s.13ד(ג).

**Never write these clauses** as limits on the statutory distance-sale right (each is void there and a common basis for consumer claims). A voluntary policy that goes BEYOND the statute (for example returns on days 15 to 30, or for goods the statute excludes) may set its own conditions, as long as it never cuts down the statutory right; say so in the policy. Sales in a physical shop follow a different regime (s.14ו), which this skill does not cover; note only that a physical shop must post its return policy for non-defective goods (s.4ג).
- "Refund by store credit only": s.14ה requires the money paid to be returned. A credit note under s.14ז applies only where the consumer is NOT entitled to a refund, and must then carry the full amount paid, be valid for at least 2 years, not depend on showing the invoice, and carry no restriction (including on use during a sale).
- "Sale or clearance items cannot be returned": no such exception exists in s.14ג(ד).
- "Only unworn, with tags, in the original packaging": not a condition of a distance-sale cancellation. The remedy for real deterioration is damages under s.14ה(ג).
- "By ordering you waive your cancellation rights": s.36 applies the law despite any waiver or contrary agreement.

### Step 2: Validate Price Display Requirements
- The displayed price must be the TOTAL price (s.17א): all payments plus all taxes the business collects, including VAT and any accompanying charge the consumer has no practical way to decline. A mandatory "handling" or "service" fee belongs inside the price, not added at checkout.
- VAT is 18%. An עוסק פטור (exempt dealer) collects no VAT, so it must not show "including VAT" or add VAT; its total price is simply what the consumer pays.
- Shekels only (s.17ד). Foreign currency is allowed only for the items in Part B of the First Schedule (for example international transport and outbound tour packages), and only alongside the rules in s.17ז(ב).
- Delivery: a delivery charge the consumer cannot avoid is part of the total price. An optional delivery upgrade may be shown separately, but must be disclosed before the purchase.
- Unit price: the Consumer Protection (Price per Unit of Measure) Regulations 2008 apply to every distance sale. For covered goods (sold in bulk, or pre-packaged with a mandatory quantity marking), show the price per unit of measure next to the product price.
- Discounted items ("מבצע"): state the price before the special sale and the sale price. If the pre-sale price was not actually in effect for at least 21 consecutive days before the sale started, the announcement must state the period during which that price was in effect. Per the Consumer Protection (Credit Sales, Special Sale and Door-to-Door Transaction) Regulations, 1983, reg. 6.
- Personal-import VAT exemptions on consumers' own parcels from abroad are outside this skill; check the current figure with the Israel Tax Authority (Customs).
- No minimum basket for card payment: since Amendment 72 (2025), a business that accepts payment cards may not make card payment conditional on a minimum purchase amount (s.12א).

**Card payment compliance (PCI DSS 4.0.1).** The current standard is PCI DSS v4.0.1, a limited revision of v4.0 with no added or deleted requirements. PCI DSS v3.2.1 was retired on 31 March 2024, and the future-dated v4.x requirements became mandatory on 31 March 2025. PCI DSS is an industry standard that reaches the merchant through its acquirer contract, not an Israeli statute. Any store that processes, stores, or transmits card data must comply with v4.0.1. Most Israeli stores rely on a tokenized payment gateway (Tranzila, Cardcom, iCredit, Stripe, etc.) to keep card data off their own servers, which usually narrows the merchant's PCI scope.

### Step 3: Generate Hebrew Terms of Service, Return Policy and Disclosure Document

**Pre-purchase disclosure (s.14ג(א)), shown before the order:**
- Name, ID or company number, and address of the business, in Israel AND abroad (the foreign address matters for dropshipping sellers)
- Main characteristics of the product or service
- Price and possible payment terms
- Date and manner of supply (state a definite date: if the goods are not supplied by the agreed date, the consumer may cancel with no fee under s.14ה(א))
- How long the offer is valid
- Warranty details
- The cancellation right

**Written disclosure document (s.14ג(ב)):** in Hebrew or in the language of the marketing, delivered no later than supply. It repeats the business identity and product characteristics, and adds the price and payment terms that apply, how to cancel, the manufacturer's name and country of manufacture, warranty information and any other terms. The order-confirmation email is the natural place for it; a ToS page alone does not prove it was delivered. Remember the cancellation window may not start until this document is received.

**Terms of Service (תנאי שימוש):** company details, product descriptions, payment terms, delivery policy, the cancellation section below, warranty terms, and dispute handling. Store terms are a standard contract (חוק החוזים האחידים, התשמ"ג-1982). A court voids or changes an unfair term (s.3), and s.4 presumes unfair, among others, a term giving the business exclusive choice of the forum, a term sending every dispute to arbitration, and a term letting the business set or change, on its own and after the contract is made, the price or other material obligations imposed on the CUSTOMER (unless the change stems from factors outside its control). Do not draft those.

**Return Policy (מדיניות החזרות):** the windows from Step 1 (including the 4-month window where a conversation took place), the fee cap with shipping inside it, the no-fee cases, the 14-day refund to the original payment method, the s.14ג(ד) exceptions only, and every cancellation channel with its contact details. Check the draft against the "never write" list in Step 1 before handing it over.

**Gift cards:** a purchase voucher (תו קנייה) whose validity the issuer limits must show the issue date and expiry date, and may not be valid for less than 5 years from issue (s.14ח(ב)).

### Step 4: Check Accessibility Compliance (IS 5568 / Service Accessibility Regulations, reg. 35)
The obligation comes from regulations 35 to 35ו of the Equal Rights for Persons with Disabilities (Accessibility Adjustments for Service) Regulations 2013, as replaced in 2017. They require web accessibility at Level AA under IS 5568. The current edition, IS 5568 Part 1 (2023), adopts WCAG 2.0 with Israeli national changes. Building to WCAG 2.1 or 2.2 AA is good practice and covers 2.0 AA, but the legal benchmark is IS 5568.

Use browser automation to scan for:
- Alt text on images
- Keyboard navigation support
- Screen reader compatibility
- Color contrast ratios (4.5:1 minimum for normal text)
- Form labels and error messages
- Language declaration (Hebrew RTL)
- Accessibility statement page

**Who is exempt (reg. 35ו):**
- An עוסק פטור, or a business whose average annual turnover does not exceed 100,000 NIS: exempt from the web chapter.
- Average turnover of 1,000,000 NIS or less: exempt only for a site or app it began operating BEFORE the 2017 regulations took effect, only if its contact details are published accessibly, and for 3 years at a time. A new store must be accessible.
- The 300,000 NIS exemption was temporary and expired on 26 October 2020. Do not present it as a current threshold.
- A platform exemption: a certified service-accessibility auditor (מורשה לנגישות השירות) may exempt a specific adjustment the platform technically cannot support, for up to 3 years, renewable once for up to 3 more (a further exemption only from the Commissioner, for special reasons); the business must then provide an alternative, disclose the exemption in its statement, and give the exemption form to a person with a disability who asks for it. Content delivered on a social network is exempt from adjustments the network does not allow.

**Other duties:** a business that employs at least 25 employees must appoint an accessibility coordinator (רכז נגישות, reg. 91). The accessibility statement (reg. 35ה) must describe the adjustments made, the coordinator's details where one is required, and how to report a missing adjustment. A deviation counts as a breach only if it is not fixed within a reasonable time, and no later than 60 days, after a notice demanding the fix (reg. 35א(ד)(1)); meanwhile the business must provide an alternative way to get the service as soon as possible (reg. 35א(ד)(2)). Treat 60 days as the outer limit, not a grace period. Statutory damages without proof of harm can reach 50,000 NIS.

### Step 5: Verify Business Disclosure (Identity, Address, Contact)
Check that the site and the disclosure document show:
- Business name and ID or company number (s.14ג(א)(1))
- Address in Israel and abroad, not just a PO Box
- Contact details for every cancellation channel: phone, email and the rest (s.14ט(ד))

These typically sit in the footer and in the order confirmation. Receipts and tax invoices are governed by the tax bookkeeping rules; route detailed bookkeeping questions to an accounting skill.

**Allocation numbers (מספר הקצאה):** a tax invoice needs an allocation number from the Tax Authority only when the recipient is an עוסק מורשה (without it the recipient cannot deduct the input VAT). The threshold (amount before VAT) was 20,000 NIS in 2025, 10,000 NIS from 01.01.2026 and 5,000 NIS from 01.06.2026. Invoices with only exempt or zero-rated transactions need none. For a B2C store selling to consumers, this generally does not apply; it matters for B2B orders.

### Step 6: Validate Cookie Consent and Privacy Compliance
Israel has no cookie-specific statute like the EU ePrivacy Directive. The consent standard flows from the Privacy Protection Law, as amended by Amendment 13 (in force August 14, 2025), and from the Privacy Protection Authority's final opinion on consent, published 25.2.2026, which requires consent to be informed (the person must understand what they agree to, including the right to refuse). Commentators note it leaves open whether embedding third-party advertising trackers needs a separate consent mechanism. Treat opt-in for advertising pixels and non-essential cookies as the prudent practice, not as a statutory rule.
- Cookie consent banner for non-essential cookies, with equally prominent "Accept All" and "Reject All" buttons (best practice)
- Clear description of cookie types and purposes
- Opt-in for marketing/analytics cookies (not opt-out, not pre-checked)
- An easy way to withdraw consent (best practice: linked from every page)
- Privacy policy linking to cookie details

Essential cookies (login, shopping cart) don't require consent.

**Section 30A (Anti-Spam Law).** Section 30A of the Communications Law bans sending an advertisement by fax, autodialer, electronic message or SMS without the recipient's express prior consent. One exception (s.30A(c)) covers existing customers, and all three conditions must hold: the customer gave their details while buying (or negotiating to buy) and was told they would be used for advertising, was given a chance to refuse and did not, and the advertisement is for similar products or services. Consent must be express, prior and in writing (an electronic message or a recorded call counts). Every advertisement must state, clearly: that it is an advertisement, with the word "פרסומת" at the start of the message and, in an email, in the subject line; the advertiser's name, address and contact details; and the recipient's right to refuse at any time with a simple way to do so (in an email, a valid internet address for refusal). An SMS needs only the advertiser's name and the contact details for refusal (s.30A(e)). A recipient may opt out at any time, and when an ongoing deal (such as a subscription) ends, including by cancellation, the customer is treated as having refused further advertising (s.30A(d)(2)). A court may award exemplary damages of up to 1,000 NIS per message for a knowing violation, with no proof of harm, and knowledge is presumed. Treat abandoned-cart and promotional "back in stock" emails as advertisements unless the customer specifically asked for that notice. Wire every capture form to an unticked opt-in box unless the existing-customer exception genuinely applies.

**Amendment 13 to the Privacy Protection Law (in force August 2025):**
- "Personal information" now covers any datum about an identified or identifiable person, and the definition names location data and an online identifier as identifying details. IP addresses are not named; treat them as personal information wherever they can identify a person with reasonable effort.
- Only four categories must appoint a privacy protection officer (s.17ב1): public bodies, data brokers holding data on more than 10,000 people, businesses whose core activity involves systematic monitoring of people at significant scale, and businesses whose core activity involves special-sensitivity data at significant scale. A typical small online shop is not caught.
- Severe security incidents must be reported to the Privacy Protection Authority immediately, under reg. 11(ד) of the Data Security Regulations 2017; notifying affected individuals is required only if the Authority orders it. Amendment 13 added a fine for failing to report.

For comprehensive privacy compliance (collection notices, data security procedures, transfers abroad to platforms like Shopify or Meta), use the `israeli-privacy-shield` skill.

## Examples

### Example 1: Full Compliance Audit for New Online Store
User says: "I'm launching an online clothing store, make sure it's compliant with Israeli law"
Actions:
1. Confirm the scope: B2C, sells through a website and an Instagram shop, so both channels are distance sales
2. Audit the return policy against Step 1: windows, fee cap with shipping inside it, the five statutory exceptions only, the never-write list
3. Check the homepage for the dedicated cancellation link with the cancellation methods next to it
4. Validate price display (total price, VAT, unavoidable fees inside the price, delivery disclosed)
5. Check the pre-purchase disclosure and the order-confirmation email against s.14ג(א) and (ב)
6. Test accessibility (IS 5568 automated checks) and confirm the accessibility statement
7. Verify cookie consent and marketing opt-in
8. Generate compliance report with pass/fail per section
Result: Compliance report with issues such as: the policy says "swimwear and sale items are final sale" (void for online sales), no cancellation link on the homepage, return shipping charged on top of the fee, a pre-ticked newsletter box, and the confirmation email missing the country of manufacture. Recommended fixes provided with Hebrew text.

### Example 2: Generating Compliant Return Policy
User says: "I need a return policy for my electronics store that's legal in Israel"
Actions:
1. Ask whether sales ever involve a phone call or a human chat (this decides whether the 4-month window applies to seniors, people with disabilities and new immigrants)
2. Draft the Hebrew return policy from Step 3
3. Include the 14-day window, the extended window where applicable, the fee cap (5% or 100 NIS, whichever is lower, shipping included), the no-fee cases and the 14-day refund
4. List only the statutory exceptions that fit the products (for example opened software or recordable media)
5. List every cancellation channel with its contact details
Result: Complete Hebrew return policy (מדיניות החזרות) ready for review, checked against the never-write list, plus the matching cancellation section for the order-confirmation email.

### Example 3: Accessibility Audit for Existing Store
User says: "We got a complaint about our website's accessibility, can you check it?"
Actions:
1. Check the exemptions in reg. 35ו (exempt dealer or turnover up to 100,000 NIS; the pre-2017-site exemption up to 1,000,000 NIS). A store launched after 2017 above 100,000 NIS is not exempt; check that a pre-2017 site's exemption is within its current 3-year period; also check whether a platform or social-network exemption covers a specific adjustment
2. Note that each deviation must be fixed within a reasonable time and no later than 60 days after the notice, with an alternative route to the service in the meantime; start now
3. Run automated accessibility scan using browser automation
4. Check: alt text, keyboard nav, contrast ratios, form labels, RTL support, the accessibility statement
5. Generate prioritized fix list
Result: Accessibility report with issues ranked by severity (for example missing form labels on the checkout page, insufficient contrast on CTA buttons, no accessibility statement), with HTML/CSS corrections and a draft statement.

## Bundled Resources

### References
- `references/consumer-protection-law.md`, Summary of Israeli Consumer Protection Law requirements for e-commerce: distance selling rules, cooling-off periods (standard and extended), cancellation fees, price display requirements, required disclosures, and exceptions. Consult when auditing compliance in Steps 1-2 or generating legal documents in Step 3.
- `references/domain-checklist.md`, the coverage checklist (what a complete online-store audit must and should cover, and what is explicitly out of scope).

## Gotchas

- The goods cancellation window runs until 14 days after delivery or after the written disclosure document, whichever is later. Agents may incorrectly calculate it from the order date.
- Agents copy the in-store exceptions list (underwear, swimwear, food) into online return policies. Only the five s.14ג(ד) exceptions apply to distance sales.
- Agents let the store charge return shipping on top of the cancellation fee. The 5% or 100 NIS cap already includes shipping and packaging.
- The 4-month window applies to seniors, people with disabilities and new immigrants only where the deal included a conversation. Agents either omit it or apply it to every web order.
- IS 5568 Part 1 (2023) adopts WCAG 2.0, not 2.1. Agents also quote a 300,000 NIS accessibility threshold that expired in 2020.
- Agents write "all prices include 18% VAT" for every seller. An exempt dealer collects no VAT and must not show it.
- Allocation numbers apply to B2B tax invoices only; agents add them to consumer receipts or quote the 2025 threshold.

## Reference Links

| Source | URL | What to Check |
|--------|-----|---------------|
| Consumer Protection Law (Nevo) | https://www.nevo.co.il/law_html/law00/70305.htm | ss.14ג to 14ט, 17א to 17ד, 31א, 36 |
| Service Accessibility Regulations (Nevo) | https://www.nevo.co.il/law_html/law01/500_865.htm | regs 35 to 35ו and 91 |
| IS 5568 Part 1 (2023) | https://www.gov.il/BlobFolder/legalinfo/israeli_accessibility_standards_pdf/he/sitedocs_si-5568-1-september-2023.pdf | WCAG version and national changes |
| Privacy Protection Law (Nevo) | https://www.nevo.co.il/law_html/law00/71631.htm | s.3 definitions, s.17ב1 |
| Communications Law s.30A (Nevo) | https://www.nevo.co.il/law_html/law01/032_002.htm | consent, existing-customer exception, damages |
| Website accessibility (Kol Zchut) | https://www.kolzchut.org.il/he/הנגשת_אתרי_אינטרנט_ואפליקציות_לאנשים_עם_מוגבלות | exemptions, damages |

## Troubleshooting

### Error: "Cookie consent not compliant"
Cause: Using opt-out instead of opt-in for non-essential cookies, or consent banner not appearing on all pages.
Solution: Implement opt-in consent for non-essential cookies and pixels. Israel lacks a cookie-specific statute, so present this as the prudent practice under the Privacy Protection Law and the PPA's consent opinion, not as a cookie statute. Ensure the banner appears on first visit before any non-essential cookies are set, with clear categories (essential, analytics, marketing) and individual toggles.

### Error: "Accessibility scan incomplete"
Cause: Dynamic content loaded via JavaScript may not be captured by automated scanning.
Solution: Ensure scan waits for full page load including lazy-loaded content. Run additional manual checks for JavaScript-heavy pages. Focus on checkout flow and forms, these are highest-priority accessibility targets.

### Error: "Price display violation"
Cause: Prices shown without VAT, a mandatory fee added at checkout, or delivery costs hidden until checkout.
Solution: Show the total price, including VAT where the seller collects it and every fee the consumer cannot decline. Show any unavoidable delivery charge inside the price, and disclose optional delivery charges before payment. Use clear format: "₪X.XX (כולל מע"מ)" for a VAT-registered seller; an exempt dealer shows the price without a VAT line.

### Error: "Business disclosure missing"
Cause: Required business details not visible on the site or missing from the order confirmation.
Solution: Show the business name, ID or company number and address (in Israel and abroad) in the footer and in the disclosure document, plus the contact details for every cancellation channel. The Consumer Protection Law requires these for distance selling.
