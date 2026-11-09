#!/usr/bin/env node
// Deterministic QA gate for MailOS drafts.
// Usage:  node lint.mjs <draft.json> <ledger.md> [--deadline] [--nurture] [--paid]
//         node lint.mjs --self-test
// draft.json = { subject, preheader, isPromotional, blocks: [{ type: "text", html }, ...] }
// ledger.md  = the product file; only the fact column of its "## פנקס עובדות" table counts as evidence.
// Exit 1 on any FAIL. WARN lines never fail the run.
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

// ponytail: phrase list, not the bare word "אחרון" ("הסרטון האחרון שלי" is not urgency); extend when a real miss shows up
const URGENCY = /נגמר|נסגר|נסגרת|יום אחרון|הזדמנות אחרונה|מקום אחרון|מקומות אחרונים|שעות אחרונות|רק היום|לזמן מוגבל|נשארו \S+ מקומות|המחיר עולה|המחיר יעלה/;
// whole words only: "שמתנהג" contains "מתנה"
const GIFT = /(^|[^א-ת])[ובהלכש]?(חינם|מתנה|ללא עלות)(?![א-ת])/;
const PLURAL = /(^|[\s(])(אתם|לכם|שלכם|אתכם|מכם|ראיתם|תלחצו|תענו|תראו|תנסו)(?=[\s.,!?:)]|$)/;
const GENDER = /(^|[^א-ת])(אתה|תחשוב|תדמיין|תבין|תקרא|תראה|תלחץ|תיכנס|תשיב|תצטרך|תחליט|השלם|תדאג|תנסה|ממלא|להיות טכני|לא טכני)(?![א-ת])/;
const EMOJI = /\p{Extended_Pictographic}/u;

const section = (doc, title) => { const m = doc.match(new RegExp(`## ${title}([\\s\\S]*?)(\\n## |$)`)); return m ? m[1] : ""; };
// A ledger row: | F01 | type | fact | source |. The id and source columns never count as evidence.
const rows = (doc) => section(doc, "פנקס עובדות").split("\n").filter((l) => /^\|\s*F\d+/.test(l))
  .map((l) => l.split("|").slice(1, -1).map((c) => c.trim())).map(([id, type, fact]) => ({ id, type, fact: fact || "" }));

export const plain = (html) => html.replace(/<br\s*\/?>/g, "\n").replace(/<\/(p|li|h2|h3)>/g, "\n").replace(/<[^>]+>/g, "")
  .replace(/&nbsp;/g, " ").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
const norm = (s) => s.replace(/,(?=\d{3})/g, "").replace(/[״"“”]/g, '"');
const numbers = (s) => s.match(/\d[\d.:]*\d|\d/g) || [];
const bare = (s) => s.replace(/[?!.,]/g, "");

export function lint(draft, ledgerDoc, { deadline = false, nurture = false, paid = false } = {}) {
  const out = [];
  const fail = (m) => out.push(`FAIL ${m}`);
  const warn = (m) => out.push(`WARN ${m}`);
  const facts = rows(ledgerDoc);
  if (!facts.length) fail("ledger has no rows in its '## פנקס עובדות' table (| F01 | type | fact | source |)");
  const evidence = norm(facts.map((f) => f.fact).join("\n"));
  const known = new Set(numbers(evidence));

  const blocks = draft.blocks || [];
  const texts = blocks.filter((b) => b.type === "text");
  const bodyHtml = texts.map((b) => b.html).join("\n");
  const body = plain(bodyHtml);
  const all = [draft.subject || "", draft.preheader || "", body].join("\n");
  const text = norm(all);

  // 1. every number must be a whole number in the ledger's fact column (20:00, 1500, 38)
  for (const n of new Set(numbers(text))) if (!known.has(n)) fail(`number "${n}" not in the fact ledger`);
  // 2. quoted speech (3+ words) must be in the ledger
  for (const q of text.match(/"([^"\n]{8,})"/g) || []) {
    const inner = bare(q.slice(1, -1)).trim();
    if (inner.split(/\s+/).length >= 3 && !bare(evidence).includes(inner)) fail(`quote ${q} not in the fact ledger`);
  }
  // 3. urgency only with a real deadline row in the ledger
  const u = all.match(URGENCY);
  if (u && !deadline) fail(`urgency word "${u[0]}" without --deadline`);
  if (deadline && !facts.some((f) => f.type === "דדליין")) fail("--deadline but the ledger has no row of type דדליין");
  // 4. Hebrew punctuation
  if (/[—–־]/.test(all)) fail("em/en dash or maqaf");
  if (/[א-ת]-[א-ת]/.test(all)) fail("hyphen between Hebrew words (only prefix-digit/Latin like ב-20:00 is allowed)");
  if (/,\s+ו[א-ת]/.test(all)) fail("comma before ו");
  if (/\d\s*₪/.test(all)) fail("₪ after the number (write ₪297)");
  if (EMOJI.test(all)) fail("emoji in email");
  if (/היום ב-?\s?00:00/.test(all)) fail('"היום ב-00:00" reads as a midnight that passed (write "הלילה ב-00:00")');
  // 5. wording the product file bans, one phrase per bullet (anything after " (" is a comment)
  for (const line of section(ledgerDoc, "לא להשתמש").split("\n")) {
    const phrase = line.match(/^\s*[-*]\s+(.+?)(\s+\(.*)?$/)?.[1]?.trim();
    if (phrase && all.includes(phrase)) fail(`banned wording "${phrase}" (see ## לא להשתמש)`);
  }
  // 6. offer framing
  if (paid && GIFT.test(all)) fail("gift wording (חינם/מתנה/ללא עלות) in a paid-product email");
  // 7. layout: looks typed by a person
  if (blocks.some((b) => b.type !== "text")) fail("only text blocks are allowed (no button or image blocks; images go inline, links are text)");
  if (texts.length > 2) fail(`${texts.length} text blocks (exactly the body and the P.S.)`);
  if (/<(blockquote|hr|small|center)\b|text-align:\s*center/i.test(bodyHtml)) fail("blockquote, hr, small or centered text (the email must look typed)");
  const psIdx = blocks.findIndex((b) => b.type === "text" && /נ\.ב\./.test(b.html));
  if (psIdx > -1) {
    if (psIdx !== blocks.length - 1) fail("P.S. block must be the last block");
    if (/נ\.ב\./.test(blocks.slice(0, psIdx).map((b) => b.html || "").join(""))) fail("נ.ב. appears outside its own block");
  }
  if (nurture && /<a\s/i.test(bodyHtml)) fail("link in a nurture email that is not the last one");
  // 8. warnings
  const ms = body.match(PLURAL);
  if (ms) warn(`plural address "${ms[2]}" (write generic singular: לך, שלך)`);
  const mg = all.match(GENDER);
  if (mg) warn(`gendered address "${mg[2]}" (keep it gender-neutral: impersonal or infinitive)`);
  const links = (bodyHtml.match(/<a\s/gi) || []).length;
  if (links > 3) warn(`${links} links (about 3 is the rule)`);
  if ((draft.subject || "").trim().split(/\s+/).length > 5) warn("subject longer than 5 words");
  if (!draft.preheader) warn("no preheader");
  return out;
}

function selfTest() {
  const ledger = "# x\n## פנקס עובדות\n| מזהה | סוג | עובדה | מקור |\n|---|---|---|---|\n| F01 | מספר | הסדנה נמשכת 90 דקות | שיחה |\n| F02 | ציטוט | \"לא האמנתי שזה כל כך פשוט\" | לקוחה 12 |\n| F03 | דדליין | ההרשמה נסגרת ביום חמישי ב-20:00 | דף |\n## לא להשתמש\n- קורס פלא (לא המונח שלנו)\n## חסר\n";
  const bad = { subject: "בדקנו", preheader: "x", blocks: [
    { type: "text", html: "<p>סקר של 348 אנשים הראה שזה עובד, ולמה לא.</p><p>קורס פלא.</p><p>12 לקוחות כבר שם.</p>" },
    { type: "button", label: "לרכישה", href: "https://x" },
    { type: "text", html: "<p>נ.ב. נגמר הלילה</p>" }] };
  const good = { subject: "לא האמנתי", preheader: "x", blocks: [
    { type: "text", html: "<p>לקוחה כתבה לי: \"לא האמנתי שזה כל כך פשוט\"</p><p>הסדנה נמשכת 90 דקות.</p>" },
    { type: "text", html: "<p><strong>נ.ב.</strong></p><p>טלפון מספיק.</p>" }] };
  const noDeadline = lint({ subject: "x", preheader: "y", blocks: [{ type: "text", html: "<p>ההרשמה נסגרת ביום חמישי ב-20:00</p>" }] }, ledger.replace("דדליין", "מידע"), { deadline: true });
  const b = lint(bad, ledger).filter((l) => l.startsWith("FAIL"));
  const g = lint(good, ledger).filter((l) => l.startsWith("FAIL"));
  // "12" and "3" appear only in the id or source columns, so they must still fail
  const must = ["348", '"12"', "text blocks", "urgency", "comma before ו", "קורס פלא"];
  const missing = must.filter((k) => !b.some((l) => l.includes(k)));
  if (!noDeadline.some((l) => l.includes("no row of type"))) missing.push("deadline row");
  if (missing.length || g.length) { console.error("SELF-TEST FAILED", { missing, goodFails: g }); process.exit(1); }
  console.log(`self-test ok (${b.length} fails caught on the bad draft, clean draft passes)`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  if (args[0] === "--self-test") selfTest();
  else {
    const [draftPath, ledgerPath] = args.filter((a) => !a.startsWith("--"));
    if (!draftPath || !ledgerPath) { console.error("usage: node lint.mjs <draft.json> <ledger.md> [--deadline] [--nurture] [--paid]"); process.exit(2); }
    const res = lint(JSON.parse(readFileSync(draftPath, "utf8")), readFileSync(ledgerPath, "utf8"),
      { deadline: args.includes("--deadline"), nurture: args.includes("--nurture"), paid: args.includes("--paid") });
    console.log(res.length ? res.join("\n") : "PASS");
    if (res.some((l) => l.startsWith("FAIL"))) process.exit(1);
  }
}
