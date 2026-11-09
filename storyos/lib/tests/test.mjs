// QA gate regression. Run: node lib/tests/test.mjs (from the skill folder). Works on a temp copy so the skill folder stays clean.
// approved.html must PASS; bad.html must FAIL on every rule it breaks.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, copyFileSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const T = path.dirname(fileURLToPath(import.meta.url)), render = path.join(T, '..', 'render.mjs');
const tmp = mkdtempSync(path.join(os.tmpdir(), 'storyos-test-'));
const run = f => { copyFileSync(path.join(T, f), path.join(tmp, f)); try { return execFileSync('node', [render, path.join(tmp, f)], { encoding: 'utf8' }); } catch (e) { return e.stdout; } };

const good = run('approved.html'), bad = run('bad.html');
rmSync(tmp, { recursive: true, force: true });
const rules = ['safe-zone', 'text-over-face', 'box-line-too-wide', 'border', 'dash', 'box-fit'];
const missed = rules.filter(r => !bad.includes(r));
if (!good.startsWith('PASS')) console.error('approved story should pass QA:\n' + good);
if (missed.length) console.error('QA missed rules: ' + missed.join(', '));
const ok = good.startsWith('PASS') && !missed.length;
console.log(ok ? 'ALL TESTS PASS' : 'TESTS FAILED');
process.exit(ok ? 0 : 1);
