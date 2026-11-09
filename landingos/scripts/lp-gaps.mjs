// What is missing on this page: the report the page owner gets BEFORE the build is called done.
// Counts real visuals against the bar in references/imagery.md, lists every unfilled image slot, every section with no
// visual mechanism, the CTA rhythm, proof, and numbers that disagree. Exit 1 when there are blocking gaps.
// Usage: node lp-gaps.mjs <url>
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { launch } = require('./pw.cjs');

const url = process.argv[2];
if (!url) { console.error('usage: node lp-gaps.mjs <url>'); process.exit(1); }
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
await page.waitForTimeout(1500);

const r = await page.evaluate(() => {
  const vis = el => { const b = el.getBoundingClientRect(); const s = getComputedStyle(el); return b.width > 24 && b.height > 24 && s.display !== 'none' && s.visibility !== 'hidden'; };
  const sections = [...document.querySelectorAll('main section, body > section')];
  const realImg = el => [...el.querySelectorAll('img, video, iframe')].filter(m => !m.closest('.marquee__track > :nth-child(n+9)') && !/pay\/|cards\.png|logo/i.test(m.getAttribute('src') || m.getAttribute('poster') || ''));
  const per = sections.map(s => {
    const media = realImg(s).length;
    const mech = s.querySelectorAll('svg, [data-cmp], [data-td], [data-switch], .phone, .pricecard, .checks, .stop, .bcard, .pf, .mega, .ring94, .ocard, .tcard, .opt, .faq').length;
    const words = (s.innerText || '').trim().split(/\s+/).length;
    return { id: s.id || s.className.split(' ')[0], media, mech, words, h2: (s.querySelector('h1,h2,h3')?.innerText || '').slice(0, 40) };
  });
  const slots = [...document.querySelectorAll('.slot, [data-missing]')].filter(vis).map(e => e.innerText.trim().slice(0, 90)).filter(Boolean);
  const imgs = realImg(document);
  const faces = imgs.filter(m => /expert|me\/|portrait|avatar|selfie|founder/i.test(m.getAttribute('src') || m.getAttribute('poster') || '')).length;
  const proof = document.querySelectorAll('.pf, .wa img, [class*="whatsapp"], .reel, .notes img, .clips img').length;
  const ctas = [...document.querySelectorAll('a.btn, button.btn')].filter(vis).map(b => Math.round(b.getBoundingClientRect().top + scrollY));
  const H = document.documentElement.scrollHeight, vh = innerHeight;
  const gaps = ctas.slice(1).map((y, i) => y - ctas[i]);
  const firstGap = ctas.length ? ctas[0] : H;
  // numbers that should agree: "<n>K עוקבים", "<n> חברים", prices
  const text = document.body.innerText;
  const brackets = [...new Set(text.match(/\[[^\]\n]{1,40}\]/g) || [])];
  const followers = [...new Set([...text.matchAll(/(\d[\d,.]*\s*(?:K|אלף))\s*עוקבים/g)].map(m => m[1].replace(/\s/g, '').replace(/אלף$/, 'K').replace(/,000$/, 'K')))];
  const members = [...new Set([...text.matchAll(/(\d[\d,]*\+?)\s*חברים/g)].map(m => m[1]))];
  const inst = [...new Set([...text.matchAll(/(?:עד )?\d+ תשלומים(?: של ₪[\d.]+)?/g)].map(m => m[0]))];
  return { brackets, per, slots, imgs: imgs.length, faces, proof, ctas: ctas.length, maxGapScreens: gaps.length ? Math.max(...gaps) / vh : H / vh, firstGap, H, vh, followers, members, inst };
});
await browser.close();

const block = [], warn = [];
if (r.brackets.length) block.push(`${r.brackets.length} [bracket] placeholders still on the page: ${r.brackets.slice(0, 12).join(' ')}`);
if (r.slots.length) block.push(`${r.slots.length} unfilled image slots:\n   - ${r.slots.join('\n   - ')}`);
if (r.imgs < 30) block.push(`only ${r.imgs} real images/videos (a page at this level carries 30-50). Ask for: more photos of the expert (target 6+, now ${r.faces}), real proof screenshots, product mockups, reels with view counts.`);
else if (r.faces < 6) warn.push(`only ${r.faces} images of the expert (target 6+).`);
if (r.proof < 6) block.push(`only ${r.proof} proof items (messages, screenshots, reels, profiles). Ask for real WhatsApp/DM screenshots and profile screenshots.`);
const bare = r.per.filter(s => s.media === 0 && s.mech === 0 && s.words > 25);
if (bare.length) warn.push(`sections with text only, no visual mechanism: ${bare.map(s => `${s.id} ("${s.h2}")`).join(', ')}`);
if (r.ctas < 5) block.push(`only ${r.ctas} buttons; the target is one every ~2 screens to the price.`);
if (r.maxGapScreens > 4) warn.push(`longest stretch without a button: ${r.maxGapScreens.toFixed(1)} screens (target ≤ 3).`);
if (r.followers.length > 1) warn.push(`follower counts disagree: ${r.followers.join(' / ')} (ask which is true, or say which network).`);
if (r.members.length > 1) warn.push(`member counts disagree: ${r.members.join(' / ')}.`);
if (r.inst.some(t => !/של ₪\d+$/.test(t))) warn.push(`installments not stated as a rounded amount: ${r.inst.join(' / ')}`);

console.log(`page: ${(r.H / r.vh).toFixed(0)} screens, ${r.per.length} sections, ${r.imgs} images/videos (${r.faces} of the expert), ${r.proof} proof items, ${r.ctas} buttons`);
for (const s of r.per) console.log(`  ${String(s.id).padEnd(12)} media ${String(s.media).padStart(2)}  mechanisms ${String(s.mech).padStart(2)}  "${s.h2}"`);
for (const b of block) console.log('MISSING ' + b);
for (const w of warn) console.log('CHECK   ' + w);
console.log(`GAPS: ${block.length ? 'BLOCKING' : 'OK'} (${block.length} blocking, ${warn.length} to check)`);
process.exit(block.length ? 1 : 0);
