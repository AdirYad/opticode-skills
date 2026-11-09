// Posting step for a finished story folder.
//   node schedule.mjs <story-dir>        writes <story-dir>/POSTING.md (always) and prints the plan
//   node schedule.mjs <story-dir> --go   also uploads and schedules through Zernio (needs the two env vars below)
// schedule.json (optional): [{ "file": "s01.png", "at": "2026-10-20T07:30", "replyWord": "מדריך" }]; times are in brand.json's timezone.
// No schedule.json: every .png in the folder except sheet.png, in name order, with no time.
// Env for --go only: ZERNIO_API_KEY, ZERNIO_INSTAGRAM_ACCOUNT_ID. A key is never written to a file.
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, openAsBlob } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const API = 'https://zernio.com/api/v1';
const MIME = { mp4: 'video/mp4', mov: 'video/quicktime', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp' };
const [dirArg, flag] = process.argv.slice(2);
if (!dirArg) { console.error('usage: node schedule.mjs <story-dir> [--go]'); process.exit(2); }
const dir = path.resolve(dirArg), go = flag === '--go', read = f => JSON.parse(readFileSync(f, 'utf8'));
const brandFile = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'brand.json');
const timezone = (existsSync(brandFile) && read(brandFile).timezone) || 'Asia/Jerusalem';
const planFile = path.join(dir, 'schedule.json');
const plan = existsSync(planFile) ? read(planFile) : readdirSync(dir).filter(f => /\.png$/.test(f) && f !== 'sheet.png').sort().map(file => ({ file }));
if (!plan.length) { console.error(`no frames in ${dir}`); process.exit(1); }

for (const { file, at } of plan) {
  if (!existsSync(path.join(dir, file))) { console.error(`missing ${file}`); process.exit(1); }
  if (at && !/^\d{4}-\d\d-\d\dT\d\d:\d\d(:\d\d)?$/.test(at)) { console.error(`bad time "${at}" for ${file} (YYYY-MM-DDTHH:MM)`); process.exit(1); }
}
// The render gate blocks posting: a frame that failed QA never reaches the checklist as "ready".
const reportFile = path.join(dir, 'qa-report.json');
if (!existsSync(reportFile)) { console.error('no qa-report.json in this folder. Run lib/render.mjs on the frames first.'); process.exit(1); }
const failed = read(reportFile).filter(r => r.problems.length).map(r => r.file);
if (failed.length) { console.error(`QA failed on: ${failed.join(', ')}. Fix and render again.`); process.exit(1); }

const words = [...new Set(plan.map(p => p.replyWord).filter(Boolean))];
const row = (p, i) => `| ${i + 1} | ${p.file} | ${p.at ? p.at.replace('T', ' ') : 'לבחור שעה'} | ${p.replyWord || ''} |`;
writeFileSync(path.join(dir, 'POSTING.md'), `# צ'קליסט העלאה

הפריימים בתיקייה הזאת עברו בדיקת QA ומוכנים להעלאה.

| # | קובץ | מתי | מילת תגובה |
|---|---|---|---|
${plan.map(row).join('\n')}

## לפני שמעלים
1. להעביר את התמונות לטלפון (וואטסאפ לעצמי כקובץ, גוגל דרייב או AirDrop, כדי לא לאבד איכות).
${words.length ? `2. להגדיר את מילת התגובה ${words.map(w => `"${w}"`).join(', ')} בכלי התגובות האוטומטיות, לפי המדריך \`references/reply-automation.md\` בתיקיית הסקיל. בלי כלי כזה: להיות זמין לענות ידנית בשעה הראשונה.` : '2. אין מילת תגובה בסטורי הזה, אין מה להגדיר.'}

## בזמן ההעלאה
1. סטורי חדש, לבחור את התמונה, בלי זום ובלי לגרור. התמונה כבר בגודל המדויק.
2. בלי מדבקת קישור ובלי סקר. התגובה בפרטי היא הפעולה.
3. שיר מוסיפים רק מהטלפון. אם יש שיר, בעוצמה נמוכה.
4. להעלות לפי הסדר בטבלה.

## אחרי 24 שעות
לכתוב לקלוד קוד: "סטורי לוג" עם מספר הצפיות והתגובות לכל פריים. ככה הסקיל לומד מה עובד אצלך.
`);
console.log(`wrote ${path.join(dir, 'POSTING.md')}`);

const need = ['ZERNIO_API_KEY', 'ZERNIO_INSTAGRAM_ACCOUNT_ID'].filter(k => !process.env[k]);
if (go && need.length) { console.error(`--go needs ${need.join(' and ')} in the environment. Without them, post by hand with POSTING.md.`); process.exit(1); }
if (go && plan.some(p => !p.at)) { console.error('--go needs a time for every frame in schedule.json.'); process.exit(1); }

const call = async (p, init = {}) => {
  const res = await fetch(API + p, { ...init, headers: { Authorization: `Bearer ${process.env.ZERNIO_API_KEY}`, 'Content-Type': 'application/json', ...(init.headers || {}) } });
  const text = await res.text();
  if (!res.ok) throw new Error(`Zernio ${p}: HTTP ${res.status} ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : {};
};
const upload = async f => {
  const contentType = MIME[f.split('.').pop().toLowerCase()];
  if (!contentType) throw new Error(`unsupported file type: ${f}`);
  const { uploadUrl, publicUrl } = await call('/media/presign', { method: 'POST', body: JSON.stringify({ filename: path.basename(f), contentType, size: statSync(f).size }) });
  const put = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': contentType }, body: await openAsBlob(f, { type: contentType }) });
  if (!put.ok) throw new Error(`upload ${path.basename(f)}: HTTP ${put.status}`);
  return publicUrl;
};

const outFile = path.join(dir, 'scheduled.json');
const out = existsSync(outFile) ? read(outFile) : {};
for (const { file, at } of plan) {
  if (out[file]) { console.log(`skip ${file} (already scheduled ${out[file].id})`); continue; }
  if (!go) { console.log(`would schedule ${file} at ${at || '(no time)'} (${timezone})`); continue; }
  const url = await upload(path.join(dir, file));
  const { post } = await call('/posts', { method: 'POST', body: JSON.stringify({
    content: '', mediaItems: [{ type: file.endsWith('.mp4') ? 'video' : 'image', url }],
    platforms: [{ platform: 'instagram', accountId: process.env.ZERNIO_INSTAGRAM_ACCOUNT_ID, platformSpecificData: { contentType: 'story' } }],
    scheduledFor: at.length === 16 ? at + ':00' : at, timezone,
  }) });
  out[file] = { id: post._id, at, status: post.status };
  writeFileSync(outFile, JSON.stringify(out, null, 1));
  console.log(`scheduled ${file} at ${at} -> ${post._id} (${post.status})`);
}
if (!go) console.log('dry run. Add --go to schedule through Zernio.');
