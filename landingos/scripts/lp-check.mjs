// LandingOS gate. Checks a landing page at 6 widths and photographs every section.
// Usage: node lp-check.mjs <url> [--shots <dir>]
// Ends with RESULT: PASS | FAIL. Exit 2 means Playwright is not available (pw.cjs prints how to get it).
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { launch } = require('./pw.cjs');

const url = process.argv[2];
const si = process.argv.indexOf('--shots');
const shotsDir = si > -1 ? process.argv[si + 1] : null;
if (!url) { console.error('usage: node lp-check.mjs <url> [--shots <dir>]'); process.exit(1); }

const WIDTHS = [360, 390, 768, 1024, 1440, 1920];
const fails = [];
const warns = [];
const browser = await launch();

for (const w of WIDTHS) {
  const page = await browser.newPage({ viewport: { width: w, height: w < 800 ? 800 : 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 400) { await page.evaluate(y => scrollTo(0, y), y); await page.waitForTimeout(120); }
  await page.waitForTimeout(1500);

  const r = await page.evaluate(() => {
    const vw = innerWidth;
    const vis = el => { const s = getComputedStyle(el); const b = el.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && b.width > 0 && b.height > 0; };
    const bleedOk = el => el.closest('[data-bleed],.marquee,[class*="marquee"],[class*="track"]');
    const overflowX = document.documentElement.scrollWidth - vw;
    const wide = [...document.querySelectorAll('body *')].filter(el => {
      if (!vis(el) || bleedOk(el)) return false;
      const b = el.getBoundingClientRect();
      let p = el.parentElement, clipped = false;
      while (p && p !== document.body) { const o = getComputedStyle(p).overflowX; if (o === 'hidden' || o === 'clip' || o === 'auto' || o === 'scroll') { clipped = true; break; } p = p.parentElement; }
      return !clipped && (b.right > vw + 2 || b.left < -2);
    }).slice(0, 5).map(el => `${el.tagName}.${String(el.className).slice(0, 30)}`);
    const imgs = [...document.images];
    const broken = imgs.filter(i => i.complete && i.naturalWidth === 0 && i.getAttribute('src')).map(i => i.getAttribute('src'));
    const noDims = imgs.filter(i => !i.getAttribute('width') || !i.getAttribute('height')).map(i => (i.getAttribute('src') || '').split('/').pop());
    const tiny = [...document.querySelectorAll('p,li,span,a,small,label,div')].filter(el => vis(el) && [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 2) && parseFloat(getComputedStyle(el).fontSize) < 13).slice(0, 5).map(el => `${parseFloat(getComputedStyle(el).fontSize)}px "${el.innerText.trim().slice(0, 30)}"`);
    const hidden = [...document.querySelectorAll('.reveal,[data-reveal]')].filter(el => parseFloat(getComputedStyle(el).opacity) < 0.1).length;
    const ctas = [...document.querySelectorAll('.btn,[class*="btn--"],a.cta,button.cta')].filter(vis);
    const ctaStyles = new Set(ctas.map(b => getComputedStyle(b).backgroundImage + getComputedStyle(b).backgroundColor)).size;
    const smoothCss = getComputedStyle(document.documentElement).scrollBehavior === 'smooth';
    const sections = [...document.querySelectorAll('body > header, body > section, main > section, body > footer, main > footer')].map(s => ({ id: s.id || String(s.className).split(' ')[0] || s.tagName, top: s.getBoundingClientRect().top + scrollY, h: s.offsetHeight }));
    // a section whose .wrap is far narrower than the container means a class collision or a stray grid squeezed it
    const squeezed = vw >= 1024 ? [...document.querySelectorAll('section > .wrap:not(.narrow)')].filter(w => vis(w) && w.getBoundingClientRect().width < Math.min(1180, vw) * 0.75)
      .map(w => (w.parentElement.id || w.parentElement.className.split(' ')[0]) + ' ' + Math.round(w.getBoundingClientRect().width) + 'px') : [];
    return { squeezed, overflowX, wide, broken, noDims, tiny, hidden, ctaCount: ctas.length, ctaStyles, smoothCss, sections, hasRM: [...document.styleSheets].some(sh => { try { return [...sh.cssRules].some(r => r.conditionText && r.conditionText.includes('reduced-motion')); } catch { return false; } }) };
  });

  const tag = `[${w}]`;
  if (r.squeezed.length) fails.push(`${tag} squeezed sections: ${r.squeezed.join(', ')}`);
  if (r.overflowX > 1) fails.push(`${tag} horizontal scroll ${r.overflowX}px`);
  if (r.wide.length) fails.push(`${tag} elements past the viewport: ${r.wide.join(', ')}`);
  if (r.broken.length) fails.push(`${tag} broken images: ${r.broken.slice(0, 5).join(', ')}`);
  if (r.hidden) fails.push(`${tag} ${r.hidden} reveal elements still invisible after a full scroll (missing safety-net sweep?)`);
  if (r.ctaStyles > 1) fails.push(`${tag} ${r.ctaStyles} different primary-button looks (must be one)`);
  if (errors.length) fails.push(`${tag} JS errors: ${errors.slice(0, 3).join(' | ')}`);
  if (w === 390) {
    if (r.noDims.length) fails.push(`images without width/height: ${r.noDims.slice(0, 8).join(', ')}`);
    if (r.tiny.length) warns.push(`text under 13px: ${r.tiny.join('; ')}`);
    if (r.smoothCss) fails.push('scroll-behavior:smooth in CSS (breaks scripted scroll; do it in JS on click)');
    if (!r.hasRM) warns.push('no prefers-reduced-motion rule');
    console.log(`sections=${r.sections.length} buttons=${r.ctaCount} buttonStyles=${r.ctaStyles}`);
  }

  if (shotsDir && (w === 390 || w === 1440)) {
    const dir = path.join(shotsDir, w === 390 ? 'mobile' : 'desktop');
    fs.mkdirSync(dir, { recursive: true });
    for (const [i, s] of r.sections.entries()) {
      await page.evaluate(y => scrollTo(0, y), s.top);
      await page.waitForTimeout(350);
      await page.screenshot({ path: path.join(dir, `${String(i).padStart(2, '0')}-${s.id.replace(/[^\w-]/g, '')}.png`), clip: { x: 0, y: s.top, width: w, height: Math.min(s.h, 4000) }, fullPage: true }).catch(() => {});
    }
  }
  await page.close();
}
await browser.close();
for (const f of fails) console.log('FAIL', f);
for (const w of warns) console.log('WARN', w);
console.log(`RESULT: ${fails.length ? 'FAIL' : 'PASS'}`);
process.exit(fails.length ? 1 : 0);
