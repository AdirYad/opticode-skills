// Render story HTML files to 1080x1920 PNGs in a native Instagram look, and QA every frame before anyone sees it.
// Usage: node render.mjs <story-folder or story.html ...> [--sheet sheet.png]
// A story file is plain markup (see templates/). This script injects story.css + story.js, so stories carry no engine code.
// Emoji: <img class="emo" src="emo:muscle"> becomes the system emoji for that name (the EMOJI map below).
import { chromium } from 'playwright';
import sharp from 'sharp';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const LIB = path.dirname(fileURLToPath(import.meta.url));
const css = readFileSync(path.join(LIB, 'story.css'), 'utf8').replace('FONT_URL', 'data:font/ttf;base64,' + readFileSync(path.join(LIB, 'fonts/Rubik.ttf')).toString('base64'));
const js = readFileSync(path.join(LIB, 'story.js'), 'utf8');
// Emoji are drawn by the operating system's own emoji font, so no emoji artwork ships with this skill.
const EMOJI = {"check": "✅", "down": "👇", "ear": "👂", "exhale": "😮‍💨", "exploding": "🤯", "fire": "🔥", "flushed": "😳", "heart": "❤️", "hourglass": "⏳", "joy": "😂", "moon": "🌙", "muscle": "💪", "peek": "🫣", "pray": "🙏", "raise-hand": "🙋", "raised-hands": "🙌", "robot": "🤖", "rocket": "🚀", "scissors": "✂️", "shirt": "👕", "shush": "🤫", "skull": "💀", "speaker": "🔊", "speaking-head": "🗣️", "spiral-calendar": "🗓️", "stopwatch": "⏱️", "sunglasses": "😎", "thinking": "🤔", "wink": "😉", "writing-hand": "✍️"};

const args = process.argv.slice(2);
const si = args.indexOf('--sheet');
const sheet = si >= 0 ? args.splice(si, 2)[1] : null;
// A folder argument means every .html inside it, so the command needs no shell glob on Windows.
const files = args.flatMap(f => statSync(f).isDirectory() ? readdirSync(f).filter(x => x.endsWith('.html')).sort().map(x => path.resolve(f, x)) : [path.resolve(f)]);
if (!files.length) { console.error('usage: node render.mjs <story-folder or story.html ...> [--sheet out.png]'); process.exit(2); }

// Runs inside the page after layout. Returns a list of problems; empty = pass.
function qa() {
  const SAFE = { x0: 64, x1: 1016, y0: 250, y1: 1580 }, T = 1;
  const out = [], r = el => el.getBoundingClientRect();
  const name = el => (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : el.tagName.toLowerCase()) + ' "' + (el.innerText || el.getAttribute('src') || '').trim().slice(0, 24) + '"';
  const vis = el => { const q = r(el); return q.width > 0 && q.height > 0 && getComputedStyle(el).visibility !== 'hidden'; };
  const inFull = el => !!el.closest('.full,[data-bleed]');
  const content = [...document.querySelectorAll('.box,.plain,.ink,.qc,.shot,img')]
    .filter(el => vis(el) && !inFull(el) && (el.tagName !== 'IMG' || !el.parentElement.closest('.box,.qc,.shot,.plain')));
  for (const el of content) {
    const q = r(el);
    if (q.left < SAFE.x0 - T || q.right > SAFE.x1 + T || q.top < SAFE.y0 - T || q.bottom > SAFE.y1 + T)
      out.push(`safe-zone: ${name(el)} at x${Math.round(q.left)}-${Math.round(q.right)} y${Math.round(q.top)}-${Math.round(q.bottom)} (allowed x64-1016 y250-1580)`);
  }
  const texts = [...document.querySelectorAll('.box,.plain,.ink')].filter(el => vis(el) && !el.parentElement.closest('.box,.plain'));
  const hit = (a, b) => { const p = r(a), q = r(b); return Math.max(0, Math.min(p.right, q.right) - Math.max(p.left, q.left)) * Math.max(0, Math.min(p.bottom, q.bottom) - Math.max(p.top, q.top)) > 4; };
  for (const f of document.querySelectorAll('.face')) for (const t of texts) if (!f.contains(t) && hit(t, f)) out.push(`text-over-face: ${name(t)} overlaps ${name(f)}`);
  for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) if (hit(texts[i], texts[j])) out.push(`text-overlap: ${name(texts[i])} / ${name(texts[j])}`);
  for (const box of document.querySelectorAll('.box')) {
    const sp = [...box.querySelectorAll(':scope > span')].map(r);
    if (!box.querySelector(':scope > svg')) out.push(`box-not-drawn: ${name(box)}`);
    sp.forEach((s, i) => { if (s.width > 953) out.push(`box-line-too-wide: ${name(box)} line ${i + 1} is ${Math.round(s.width)}px (max 952, split the line)`); if (i && Math.abs(s.top - sp[i - 1].bottom) > 1) out.push(`box-gap: ${name(box)} lines ${i}-${i + 1} do not touch`); });
  }
  for (const e of document.querySelectorAll('.box .emo')) if (getComputedStyle(e).display !== 'inline') out.push(`emoji-line: ${name(e.closest('.box'))} emoji left the text line`);
  for (const el of document.querySelectorAll('img,.shot,.qc')) { const cs = getComputedStyle(el); if (parseFloat(cs.borderTopWidth) > 0 || cs.outlineStyle !== 'none') out.push(`border: ${name(el)} has a border/frame (never)`); }
  for (const im of document.images) if (!im.complete || !im.naturalWidth) out.push(`image-missing: ${im.getAttribute('src')}`);
  if (!document.fonts.check('600 50px R')) out.push('font: Rubik not loaded');
  const txt = document.body.innerText;
  if (/[–—־]/.test(txt)) out.push('dash: en/em dash or maqaf in text (never)');
  if (getComputedStyle(document.body).backgroundColor !== 'rgb(0, 0, 0)') out.push('background: body must be pure black #000');
  const paint = [...document.querySelectorAll('.box,.plain')].filter(vis).map(el => { const q = r(el), box = el.matches('.box'); const fill = box ? el.querySelector(':scope > svg path').getAttribute('fill') : getComputedStyle(el).color; return { name: name(el), box, fill, x0: q.left, y0: q.top, x1: q.right, y1: q.bottom }; });
  const boxes = [...document.querySelectorAll('.box')].filter(vis).map(el => ({ name: name(el), fill: el.querySelector(':scope > svg path')?.getAttribute('fill') || '', lines: [...el.querySelectorAll(':scope > span')].map(s => { const q = r(s); return { x0: q.left, x1: q.right, y0: q.top, y1: q.bottom }; }) }));
  return { out, paint, boxes };
}

// The box background must sit evenly around its text: per line, the ink's left and right gaps
// inside the drawn background are close to equal and never tight; the whole box's top and bottom gaps too.
async function boxFit(png, boxes) {
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true }), W = info.width, ch = info.channels, out = [];
  for (const b of boxes) {
    const f = (b.fill.match(/\d+/g) || []).slice(0, 3).map(Number);
    if (f.length < 3) { const hex = b.fill.replace('#', ''); f.splice(0, 3, ...[0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16))); }
    const isFill = (x, y) => { const i = (y * W + x) * ch; return Math.abs(data[i] - f[0]) + Math.abs(data[i + 1] - f[1]) + Math.abs(data[i + 2] - f[2]) < 40; };
    // per row: the drawn background is the span of fill-coloured pixels; ink = anything else between its ends
    const row = (y, xa, xb) => {
      let bl = -1, br = -1; for (let x = xa; x <= xb; x++) if (isFill(x, y)) { if (bl < 0) bl = x; br = x; }
      if (bl < 0) return null;
      let il = -1, ir = -1; for (let x = bl; x <= br; x++) if (!isFill(x, y)) { if (il < 0) il = x; ir = x; }
      return { bl, br, il, ir };
    };
    let firstInk = Infinity, lastInk = -Infinity, firstBg = Infinity, lastBg = -Infinity;
    b.lines.forEach((l, n) => {
      const xa = Math.max(0, Math.floor(l.x0) - 4), xb = Math.min(W - 1, Math.ceil(l.x1) + 4);
      let left = Infinity, right = Infinity;
      for (let y = Math.ceil(l.y0); y < Math.floor(l.y1); y++) {
        const q = row(y, xa, xb); if (!q) continue;
        if (y < firstBg) firstBg = y; if (y > lastBg) lastBg = y;
        if (q.il < 0) continue;
        if (y < firstInk) firstInk = y; if (y > lastInk) lastInk = y;
        left = Math.min(left, q.il - q.bl); right = Math.min(right, q.br - q.ir);
      }
      if (process.env.BOXFIT_DEBUG) console.log(`    ${b.name.slice(0, 30)} L${n + 1}: left ${left} right ${right}`);
      if (left === Infinity) return;
      if (Math.min(left, right) < 12 || Math.abs(left - right) > Math.max(10, 0.35 * Math.max(left, right))) out.push(`box-fit: ${b.name} line ${n + 1} text is off-center in its background (left ${left}px, right ${right}px)`);
    });
    const top = firstInk - firstBg, bot = lastBg - lastInk;
    if (firstInk !== Infinity && (Math.min(top, bot) < 8 || Math.abs(top - bot) > Math.max(14, 0.6 * Math.max(top, bot)))) out.push(`box-fit: ${b.name} text sits too high/low in its background (top ${top}px, bottom ${bot}px)`);
  }
  return out;
}

// A box must stand out from what is behind it; white text without a box needs a dark area behind it.
const lum = ([r, g, b]) => { const f = c => (c /= 255) <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
const ratio = (a, b) => (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
async function contrast(png, paint) {
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true }), W = info.width, H = info.height, ch = info.channels, out = [];
  const mean = pts => { let s = 0, n = 0; for (const [x, y] of pts) { if (x < 0 || y < 0 || x >= W || y >= H) continue; const i = (Math.round(y) * W + Math.round(x)) * ch; s += lum([data[i], data[i + 1], data[i + 2]]); n++; } return n ? s / n : 0; };
  for (const p of paint) {
    const fill = lum((p.fill.match(/\d+/g) || [0, 0, 0]).slice(0, 3).map(Number));
    const pts = [];
    if (p.box) { const m = 10; for (let x = p.x0; x <= p.x1; x += 6) pts.push([x, p.y0 - m], [x, p.y1 + m]); for (let y = p.y0; y <= p.y1; y += 6) pts.push([p.x0 - m, y], [p.x1 + m, y]); }
    else for (let x = p.x0; x <= p.x1; x += 8) for (let y = p.y0; y <= p.y1; y += 8) pts.push([x, y]);
    const bg = mean(pts), c = ratio(fill, bg);
    if (p.box && c < 1.6) out.push(`contrast: ${p.name} box blends into the background (ratio ${c.toFixed(2)}, need 1.6). Darken the background or switch box color`);
    if (!p.box && c < 3) out.push(`contrast: ${p.name} text is hard to read on its background (ratio ${c.toFixed(2)}, need 3)`);
  }
  return out;
}

const b = await chromium.launch();
const results = [];
for (const f of files) {
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('requestfailed', q => !q.url().startsWith('emo:') && console.error('  missing file:', q.url().slice(0, 140)));
  p.on('pageerror', e => console.error('  page error:', e.message));
  await p.goto(pathToFileURL(f).href, { waitUntil: 'domcontentloaded' });
  const unknownEmoji = await p.evaluate(map => { const bad = []; document.querySelectorAll('img[src^="emo:"]').forEach(i => { const n = i.getAttribute('src').slice(4), c = map[n]; if (!c) { bad.push(n); return; } const s = document.createElement('span'); s.className = i.className || 'emo'; s.textContent = c; s.setAttribute('aria-hidden', 'true'); i.replaceWith(s); }); return bad; }, EMOJI);
  if (unknownEmoji.length) { console.error('  unknown emoji:', unknownEmoji.join(', '), '| available:', Object.keys(EMOJI).join(' ')); process.exitCode = 1; }
  await p.addStyleTag({ content: css });
  await p.addScriptTag({ content: js });
  await p.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 20000 });
  await p.waitForTimeout(200);
  const { out: problems, paint, boxes } = await p.evaluate(qa);
  const png = f.replace(/\.html$/, '.png');
  await p.screenshot({ path: png });
  problems.push(...await contrast(png, paint), ...await boxFit(png, boxes));
  await p.close();
  results.push({ file: path.basename(f), png, problems });
  console.log(`${problems.length ? 'FAIL' : 'PASS'}  ${path.basename(png)}${problems.map(x => '\n      - ' + x).join('')}`);
}
await b.close();

if (sheet) {
  const W = 270, H = 480, G = 16, cols = Math.min(5, results.length), rows = Math.ceil(results.length / cols);
  const tiles = await Promise.all(results.map(async (x, i) => {
    const label = Buffer.from(`<svg width="${W}" height="${H}"><rect x="8" y="8" width="44" height="34" rx="8" fill="${x.problems.length ? '#e0245e' : '#3897F0'}"/><text x="30" y="32" font-size="22" font-family="Arial" font-weight="700" fill="#fff" text-anchor="middle">${i + 1}</text></svg>`);
    const img = await sharp(x.png).resize(W, H).composite([{ input: label }]).png().toBuffer();
    return { input: img, left: G + (i % cols) * (W + G), top: G + Math.floor(i / cols) * (H + G) };
  }));
  await sharp({ create: { width: G + cols * (W + G), height: G + rows * (H + G), channels: 3, background: '#1a1a1a' } }).composite(tiles).png().toFile(path.resolve(sheet));
  console.log('sheet', path.resolve(sheet));
}
writeFileSync(path.join(path.dirname(files[0]), 'qa-report.json'), JSON.stringify(results.map(({ file, problems }) => ({ file, problems })), null, 1));
process.exit(results.some(x => x.problems.length) ? 1 : 0);
