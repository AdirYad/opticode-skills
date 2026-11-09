#!/usr/bin/env node
// Turns a linted draft into ready files: <draft>.html (paste or import into any email tool) and <draft>.txt.
// Usage: node build.mjs <draft.json> <ledger.md> [--deadline] [--nurture] [--paid]
// The gate is built in: any lint FAIL means nothing is written.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { lint, plain } from "./lint.mjs";

const args = process.argv.slice(2);
const [draftPath, ledgerPath] = args.filter((a) => !a.startsWith("--"));
if (!draftPath || !ledgerPath) { console.error("usage: node build.mjs <draft.json> <ledger.md> [--deadline] [--nurture] [--paid]"); process.exit(2); }
const draft = JSON.parse(readFileSync(draftPath, "utf8"));
const res = lint(draft, readFileSync(ledgerPath, "utf8"), { deadline: args.includes("--deadline"), nurture: args.includes("--nurture"), paid: args.includes("--paid") });
if (res.length) console.log(res.join("\n"));
if (res.some((l) => l.startsWith("FAIL"))) { console.error("lint failed, nothing written"); process.exit(1); }

const brandFile = join(dirname(fileURLToPath(import.meta.url)), "..", "brand.json");
const brand = existsSync(brandFile) ? JSON.parse(readFileSync(brandFile, "utf8")) : {};
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Israeli spam law: an advertising email says "פרסומת" at the start of its subject.
const subject = (draft.isPromotional && !/^פרסומת/.test(draft.subject) ? "פרסומת: " : "") + draft.subject;

const STYLE = {
  p: "margin:0 0 16px", h2: "font-size:24px;line-height:1.35;margin:24px 0 12px", h3: "font-size:20px;line-height:1.35;margin:20px 0 10px",
  ul: "margin:0 0 16px;padding-right:22px", ol: "margin:0 0 16px;padding-right:22px", li: "margin:0 0 8px",
  a: "color:#0b57d0;text-decoration:underline", img: "max-width:100%;height:auto;display:block;margin:0 0 16px",
};
const styled = (html) => html.replace(/<(p|h2|h3|ul|ol|li|a|img)\b(?![^>]*\bstyle=)/g, (_, t) => `<${t} style="${STYLE[t]}"`);

const texts = draft.blocks.filter((b) => b.type === "text");
const parts = texts.map((b) => /נ\.ב\./.test(b.html) && brand.psPhotoUrl
  ? `<img src="${brand.psPhotoUrl}" alt="" width="140" style="width:140px;height:140px;border-radius:50%;display:block;margin:24px 0 8px">${b.html}` : b.html);
const footer = brand.footerHtml ? `<div style="margin-top:32px;font-size:13px;color:#666">${brand.footerHtml}</div>` : "";

const page = `<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:#ffffff">
<div style="display:none;max-height:0;overflow:hidden">${esc(draft.preheader || "")}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="padding:24px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px"><tr>
<td dir="rtl" align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:17px;line-height:1.6;color:#111111;text-align:right;direction:rtl">
${styled(parts.join("\n"))}
${footer}
</td></tr></table>
</td></tr></table>
</body></html>
`;

const withLinks = (html) => html.replace(/<a\b[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/g, "$2: $1");
const text = `נושא: ${subject}\nתצוגה מקדימה: ${draft.preheader || ""}\n\n${texts.map((b) => plain(withLinks(b.html)).trim()).join("\n\n")}\n${brand.footerText ? "\n" + brand.footerText + "\n" : ""}`;

const base = draftPath.replace(/\.json$/, "");
writeFileSync(base + ".html", page);
writeFileSync(base + ".txt", text);
console.log(`PASS\nwrote ${base}.html\nwrote ${base}.txt`);
