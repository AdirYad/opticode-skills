// Writes the palette block of tokens.css from three colours. Everything else in the kit derives from these in CSS.
// Usage: node palette.mjs <bg-hex> <a1-hex> <a2-hex> <path/to/tokens.css>
// bg = a very dark version of the brand hue, a1 = action and emotion (the "flare"), a2 = structure (the "field").
import fs from 'node:fs';

const [bgHex, a1Hex, a2Hex, file] = process.argv.slice(2);
if (!file || ![bgHex, a1Hex, a2Hex].every(h => /^#[0-9a-f]{6}$/i.test(h))) {
  console.error('usage: node palette.mjs <#bg> <#a1> <#a2> <tokens.css>');
  process.exit(1);
}
const toRgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const toHex = c => '#' + c.map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
const blend = (a, b, share) => a.map((v, i) => v + (b[i] - v) * share);
const channel = v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; };
const luminance = ([r, g, b]) => .2126 * channel(r) + .7152 * channel(g) + .0722 * channel(b);
const contrast = (a, b) => { const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x); return (hi + .05) / (lo + .05); };

const [night, flare, field] = [bgHex, a1Hex, a2Hex].map(toRgb);
const chalk = blend(night, [255, 255, 255], .94);
// text printed on a colour field: a very dark shade of it, or chalk when the field itself is dark
const inkOn = colour => {
  const dark = blend(colour, [0, 0, 0], .86);
  return contrast(dark, colour) >= contrast(chalk, colour) ? dark : chalk;
};
const onFlare = inkOn(flare), onField = inkOn(field);

if (luminance(night) > .03) console.error('WARN: the background is not very dark. The kit is built for a dark world.');
if (contrast(flare, night) < 3) console.error('WARN: a1 barely separates from the background. The button will not stand out.');
if (contrast(field, night) < 3) console.error('WARN: a2 barely separates from the background. Rules and frames will disappear.');

const block = `/* palette:start */
  --night:${toHex(night)}; --flare:${toHex(flare)}; --field:${toHex(field)};
  --chalk:${toHex(chalk)}; --on-flare:${toHex(onFlare)}; --on-field:${toHex(onField)};
  /* palette:end */`;

const css = fs.readFileSync(file, 'utf8');
const marked = /\/\* palette:start \*\/[\s\S]*?\/\* palette:end \*\//;
if (!marked.test(css)) { console.error('No palette markers found in ' + file); process.exit(1); }
fs.writeFileSync(file, css.replace(marked, block));
console.log(`palette written to ${file}: text on flare ${contrast(onFlare, flare).toFixed(1)}:1, text on field ${contrast(onField, field).toFixed(1)}:1, text on night ${contrast(chalk, night).toFixed(1)}:1`);
