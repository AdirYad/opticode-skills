// Finds Playwright wherever the buyer already has it, and opens a browser.
// Order: this project, this skill folder, the global npm folder. Browser: Playwright's own, then installed Chrome, then Edge.
const { createRequire } = require('module');
const path = require('path');
const { execSync } = require('child_process');

const HELP = `
צריך Playwright כדי להריץ את הבדיקה הזאת. מריצים פעם אחת בתיקיית הפרויקט:

  npm install -D playwright

אם Chrome או Edge מותקנים אצלך זה מספיק. אם לא:

  npx playwright install chromium

אחרי זה מריצים שוב את אותה פקודה.
`;

function find() {
  const roots = [path.join(process.cwd(), 'x.js'), __filename];
  for (const r of roots) { try { return createRequire(r)('playwright'); } catch {} }
  try {
    const g = execSync('npm root -g', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    return createRequire(path.join(g, 'x.js'))('playwright');
  } catch {}
  console.error(HELP);
  process.exit(2);
}

async function launch() {
  const { chromium } = find();
  for (const opts of [{}, { channel: 'chrome' }, { channel: 'msedge' }]) {
    try { return await chromium.launch(opts); } catch {}
  }
  console.error(HELP);
  process.exit(2);
}

module.exports = { find, launch };
