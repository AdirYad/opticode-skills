// proposal.json + config.json -> a designed Hebrew RTL PDF through the buyer's own Chrome or Edge. No npm, no keys.
// Usage: node render.mjs <proposal.json> [--config <config.json>] [--out <dir>] [--html-only]
// Self-check: node render.mjs ../examples/sample.json --config ../examples/sample-config.json --out <dir>
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SKILL = path.dirname(HERE);
const argv = process.argv.slice(2);
const opt = n => { const i = argv.indexOf('--' + n); return i > -1 ? argv[i + 1] : undefined; };
const input = argv[0];
if (!input || input.startsWith('--')) { console.error('usage: node render.mjs <proposal.json> [--config c.json] [--out dir] [--html-only]'); process.exit(1); }

const readJson = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { console.error(`Cannot read ${f}: ${e.message}`); process.exit(1); } };
const configPath = opt('config') || path.join(SKILL, 'config.json');
if (!fs.existsSync(configPath)) { console.error(`Missing ${configPath}. Run the first-run questions in SKILL.md.`); process.exit(1); }
const cfg = readJson(configPath);
const P = readJson(input);
const outDir = path.resolve(opt('out') || path.dirname(input));

// ---------- lint: refuse a document that would embarrass the owner
const errors = [], warns = [];
const need = (ok, msg) => { if (!ok) errors.push(msg); };
const arr = v => (Array.isArray(v) ? v : []);
need(P.title, 'title is required');
need(P.client?.name, 'client.name is required');
need(P.date && P.validUntil, 'date and validUntil are required');
need(P.problem?.lead, 'problem.lead is required');
need(arr(P.scope?.modules).length, 'scope.modules needs at least one module');
need(arr(P.scope?.included).length && arr(P.scope?.excluded).length, 'scope.included and scope.excluded are both mandatory');
need(arr(P.timeline).length, 'timeline is required');
for (const [i, s] of arr(P.timeline).entries()) need(s.outcome, `timeline[${i}] has no outcome: a phase the client cannot verify is not a phase`);
const tiers = arr(P.pricing?.tiers);
need(tiers.length >= 1 && tiers.length <= 3, 'pricing.tiers must have 1 to 3 tiers');
if (tiers.length > 1) need(tiers.filter(t => t.recommended).length === 1, 'exactly one tier must be recommended');
need(arr(P.terms).length, 'terms are required');
need(!(P.title?.length > 90), 'title is over 90 characters');
need(!(P.problem?.lead?.length > 620), 'problem.lead is over 620 characters: turn the rest into beforeAfter rows');

const walk = (v, p, f) => { if (typeof v === 'string') f(v, p); else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${p}[${i}]`, f)); else if (v && typeof v === 'object') for (const k of Object.keys(v)) walk(v[k], p ? `${p}.${k}` : k, f); };
walk(P, '', (s, p) => {
  if (/[—–]/.test(s)) errors.push(`${p}: em or en dash`);
  if (/\d[\d,.]*\s*₪/.test(s)) errors.push(`${p}: ₪ after the digits renders on the wrong side: "${s.slice(0, 50)}"`);
  if (/₪\s+\d/.test(s)) errors.push(`${p}: space between ₪ and the digits`);
  if (/\[[^\]\n]{1,40}\]|TODO|XXX/.test(s)) errors.push(`${p}: placeholder left: "${s.slice(0, 50)}"`);
  if (/, ?ו[\u0590-\u05ff]/.test(s)) warns.push(`${p}: comma before ו: "${s.slice(0, 50)}"`);
});
if (cfg.vat === 'authorized') for (const [i, l] of arr(P.pricing?.payment).entries()) if (/₪/.test(l) && !/מע"מ/.test(l)) errors.push(`pricing.payment[${i}]: a payment line with a price must carry + מע"מ`);
if (cfg.vat === 'exempt') walk(P.pricing, 'pricing', (s, p) => { if (/מע"מ/.test(s) && !/פטור|ללא/.test(s)) warns.push(`${p}: mentions VAT but the business is exempt`); });

for (const w of warns) console.log('WARN ' + w);
if (errors.length) { for (const e of errors) console.log('ERROR ' + e); console.log('RESULT: FAIL (no PDF written)'); process.exit(1); }

// ---------- html
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const CHECK = '<svg class="ic" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3.2 3.2L13 4.8"/></svg>';
const CROSS = '<svg class="ic ic--no" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8"/></svg>';
const li = (items, ic = '') => arr(items).map(x => `<li>${ic}<span>${esc(x)}</span></li>`).join('');

const hexRgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const lum = c => { const f = c.map(v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }); return .2126 * f[0] + .7152 * f[1] + .0722 * f[2]; };
const accent = /^#[0-9a-f]{6}$/i.test(cfg.accent || '') ? cfg.accent : '#17352c';
const onAccent = lum(hexRgb(accent)) > .32 ? '#1b1a17' : '#fbf7ef';

function logoTag() {
  if (!cfg.logo) return `<span class="cover__name">${esc(cfg.businessName)}</span>`;
  const f = path.isAbsolute(cfg.logo) ? cfg.logo : path.join(path.dirname(configPath), cfg.logo);
  if (!fs.existsSync(f)) { console.log(`WARN logo not found: ${f}`); return `<span class="cover__name">${esc(cfg.businessName)}</span>`; }
  const ext = path.extname(f).slice(1).toLowerCase().replace('jpg', 'jpeg').replace('svg', 'svg+xml');
  return `<img class="cover__logo" alt="${esc(cfg.businessName)}" src="data:image/${ext};base64,${fs.readFileSync(f).toString('base64')}">`;
}

const font = (family, file, weight) => `@font-face{font-family:"${family}";src:url(data:font/woff2;base64,${fs.readFileSync(path.join(SKILL, 'fonts', file)).toString('base64')}) format("woff2");font-weight:${weight};font-display:block;unicode-range:${file.includes('hebrew') ? 'U+0590-05FF,U+200C-2010,U+20AA,U+25CC,U+FB1D-FB4F' : 'U+0000-00FF,U+2000-200B,U+2011-206F,U+20AC,U+2122'}}`;
const fonts = [font('Body', 'heebo-hebrew.woff2', '100 900'), font('Body', 'heebo-latin.woff2', '100 900'), font('Display', 'frank-hebrew.woff2', '300 900'), font('Display', 'frank-latin.woff2', '300 900')].join('\n');

const mix = (a, b, t) => '#' + a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, '0')).join('');
const mark = mix(hexRgb(accent), hexRgb(onAccent), .08); // solid colour: transparency in a PDF prints unevenly
const footer = `${P.client.company || P.client.name}`.replace(/["\\]/g, '');
const css = fs.readFileSync(path.join(SKILL, 'template', 'proposal.css'), 'utf8').replaceAll('__ACCENT__', accent).replaceAll('__ON_ACCENT__', onAccent).replaceAll('__FOOTER__', footer).replaceAll('__MARK__', mark);

const who = P.client.company || P.client.name;
const stats = arr(P.problem.stats);
const ba = arr(P.problem.beforeAfter);
const titleSize = P.title.length > 58 ? 'l' : P.title.length > 34 ? 'm' : 's';

const html = `<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="utf-8"><title>${esc(P.title)}, ${esc(who)}</title>
<style>${fonts}\n${css}</style></head><body>

<section class="cover">
  <svg class="cover__mark" viewBox="0 0 210 160" aria-hidden="true"><text x="-8" y="172" font-size="235">${esc([...who.trim()][0])}</text></svg>
  <header class="cover__head">${logoTag()}</header>
  <div class="cover__main cover__main--${titleSize}">
    <h1>${esc(P.title)}</h1>
    ${P.subtitle ? `<p class="cover__sub">${esc(P.subtitle)}</p>` : ''}
  </div>
  <dl class="cover__meta">
    <div><dt>עבור</dt><dd>${esc(who)}</dd></div>
    <div><dt>תאריך</dt><dd>${esc(P.date)}</dd></div>
    <div><dt>בתוקף עד</dt><dd>${esc(P.validUntil)}</dd></div>
    <div><dt>מוגש על ידי</dt><dd>${esc(cfg.ownerName || cfg.businessName)}</dd></div>
  </dl>
</section>

<section class="sec sec--new">
  <h2>${esc(P.problem.title || 'איפה העסק עומד היום')}</h2>
  <p class="lead">${esc(P.problem.lead)}</p>
  ${stats.length ? `<div class="stats stats--${stats.length}">${stats.map(s => `<div class="stat"><b>${esc(s.value)}</b><span>${esc(s.label)}</span>${s.sub ? `<small>${esc(s.sub)}</small>` : ''}</div>`).join('')}</div>` : ''}
  ${ba.length ? `<div class="ba"><div class="ba__row ba__head"><span>${esc(P.problem.beforeLabel || 'היום')}</span><span>${esc(P.problem.afterLabel || 'אחרי')}</span></div>${ba.map(r => `<div class="ba__row"><span class="ba__b">${esc(r.before)}</span><span class="ba__a">${esc(r.after)}</span></div>`).join('')}</div>` : ''}
  ${P.problem.thesis ? `<p class="thesis">${esc(P.problem.thesis)}</p>` : ''}
</section>

<section class="sec sec--new">
  <h2>${esc(P.scope.title || 'מה תקבל')}</h2>
  <div class="mods">${P.scope.modules.map(m => `<article class="mod"><div class="mod__t"><h3>${esc(m.title)}</h3>${m.tag ? `<em>${esc(m.tag)}</em>` : ''}</div><div class="mod__b"><ul>${li(m.items)}</ul>${m.outcome ? `<p class="out">${esc(m.outcome)}</p>` : ''}</div></article>`).join('')}</div>
  <div class="bound">
    <div><h3>${esc(P.scope.includedTitle || 'מה כלול')}</h3><ul class="ticks">${li(P.scope.included, CHECK)}</ul></div>
    <div><h3>${esc(P.scope.excludedTitle || 'מה לא כלול')}</h3><ul class="ticks">${li(P.scope.excluded, CROSS)}</ul></div>
  </div>
</section>

<section class="sec sec--new">
  <h2>${esc(P.timelineTitle || 'איך זה מתקדם')}</h2>
  <ol class="tl">${P.timeline.map((s, i) => `<li><span class="tl__n">${i + 1}</span><div class="tl__c"><div class="tl__h"><h3>${esc(s.title)}</h3><span>${esc(s.when)}</span></div><ul>${li(s.items)}</ul><p class="out">${esc(s.outcome)}</p></div></li>`).join('')}</ol>
</section>

${arr(P.faq).length ? `<section class="sec"><h2>${esc(P.faqTitle || 'שאלות שעולות בדרך כלל')}</h2><div class="faq">${P.faq.map(f => `<div class="q"><h3>${esc(f.q)}</h3><p>${esc(f.a)}</p></div>`).join('')}</div></section>` : ''}

<section class="sec sec--new">
  <h2>${esc(P.pricing.title || 'ההשקעה')}</h2>
  ${P.pricing.intro ? `<p class="p">${esc(P.pricing.intro)}</p>` : ''}
  <div class="tiers tiers--${tiers.length}">${tiers.map(t => `<article class="tier${t.recommended ? ' tier--on' : ''}">${t.recommended ? `<i class="tier__flag">${esc(P.pricing.recommendedLabel || 'המומלץ')}</i>` : ''}<h3>${esc(t.name)}</h3>${t.for ? `<p class="tier__for">${esc(t.for)}</p>` : ''}<div class="tier__price">${esc(t.price)}</div><ul class="ticks">${li(t.items, CHECK)}</ul></article>`).join('')}</div>
  ${arr(P.pricing.payment).length ? `<div class="block"><h3>תנאי תשלום</h3><ul class="plain">${li(P.pricing.payment)}</ul></div>` : ''}
  ${P.pricing.vatNote ? `<p class="note">${esc(P.pricing.vatNote)}</p>` : ''}
  ${arr(P.pricing.running).length ? `<div class="block"><h3>עלויות שוטפות אחרי המסירה</h3><div class="run">${P.pricing.running.map(r => `<div><span>${esc(r.label)}</span><b>${esc(r.price)}</b></div>`).join('')}</div></div>` : ''}
</section>

<section class="sec sec--new">
  <h2>${esc(P.termsTitle || 'תנאים')}</h2>
  <ol class="terms">${P.terms.map(t => `<li><b>${esc(t.title)}.</b> ${esc(t.text)}</li>`).join('')}</ol>
</section>

<section class="sign">
  <h2>${esc(P.signatureTitle || 'חתימות')}</h2>
  <p class="p">${esc(P.signatureNote || 'החתימה מאשרת את תנאי ההצעה כפי שהם מופיעים במסמך הזה.')}</p>
  <div class="sign__g">
    <div><h3>${esc(cfg.businessName)}</h3>
      <dl><div><dt>שם</dt><dd>${esc(cfg.ownerName)}</dd></div><div><dt>${esc(cfg.idLabel || 'ע.מ')}</dt><dd>${esc(cfg.idNumber)}</dd></div><div><dt>חתימה</dt><dd></dd></div><div><dt>תאריך</dt><dd></dd></div></dl></div>
    <div><h3>${esc(who)}</h3>
      <dl><div><dt>שם</dt><dd>${esc(P.client.name)}</dd></div><div><dt>${esc(P.client.idLabel || 'ת.ז או ח.פ')}</dt><dd>${esc(P.client.idNumber)}</dd></div><div><dt>חתימה</dt><dd></dd></div><div><dt>תאריך</dt><dd></dd></div></dl></div>
  </div>
  <p class="contact">${[cfg.businessName, cfg.phone, cfg.email, cfg.website, cfg.address].filter(Boolean).map(x => `<span>${esc(x)}</span>`).join('')}</p>
</section>
</body></html>`;

// ---------- output
fs.mkdirSync(outDir, { recursive: true });
const base = `הצעת מחיר ${who}`.replace(/[\\/:*?"<>|]/g, '').trim();
const htmlFile = path.join(outDir, base + '.html');
const pdfFile = path.join(outDir, base + '.pdf');
fs.writeFileSync(htmlFile, html);
console.log('HTML ' + htmlFile);
if (argv.includes('--html-only')) process.exit(0);

function findBrowser() {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH;
  const e = process.env;
  const list = process.platform === 'win32'
    ? [e.PROGRAMFILES, e['PROGRAMFILES(X86)'], e.LOCALAPPDATA].filter(Boolean).flatMap(r => [path.join(r, 'Google/Chrome/Application/chrome.exe'), path.join(r, 'Microsoft/Edge/Application/msedge.exe')])
    : process.platform === 'darwin'
      ? ['Google Chrome', 'Microsoft Edge', 'Chromium', 'Brave Browser'].map(n => `/Applications/${n}.app/Contents/MacOS/${n}`)
      : ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'microsoft-edge'].map(n => spawnSync('which', [n], { encoding: 'utf8' }).stdout?.trim()).filter(Boolean);
  return list.find(f => fs.existsSync(f));
}
const browser = findBrowser();
if (!browser) { console.error('לא מצאתי Chrome או Edge במחשב. מתקינים אחד מהם, או מגדירים את CHROME_PATH לנתיב של הדפדפן. קובץ ה HTML מוכן ואפשר גם להדפיס אותו מהדפדפן ל PDF.'); process.exit(2); }

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'proposalos-'));
fs.rmSync(pdfFile, { force: true });
const run = spawnSync(browser, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', `--user-data-dir=${profile}`, '--virtual-time-budget=4000', '--no-pdf-header-footer', `--print-to-pdf=${pdfFile}`, pathToFileURL(htmlFile).href], { stdio: 'ignore', timeout: 90000 });
for (let i = 0; i < 25 && !fs.existsSync(pdfFile); i++) await new Promise(r => setTimeout(r, 200));
try { fs.rmSync(profile, { recursive: true, force: true }); } catch { /* the browser may still hold it for a moment */ }
if (!fs.existsSync(pdfFile) || fs.statSync(pdfFile).size < 2000) { console.error(`Browser did not write the PDF (exit ${run.status}). ${browser}`); process.exit(1); }
console.log('PDF ' + pdfFile);
console.log('RESULT: PASS');
