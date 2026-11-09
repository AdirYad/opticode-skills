// Optional. Generates one image with the OpenAI images API. Reads OPENAI_API_KEY from the environment, never from a file.
// Usage: node generate-image.mjs --prompt "<text>" --output <file.png> [--aspect 16:9|1:1|9:16]
// Model can be changed with OPENAI_IMAGE_MODEL. Each call costs money on the owner's account.
import fs from 'node:fs';
import path from 'node:path';

const arg = n => { const i = process.argv.indexOf('--' + n); return i > -1 ? process.argv[i + 1] : undefined; };
const prompt = arg('prompt'), output = arg('output');
const size = { '16:9': '1536x1024', '1:1': '1024x1024', '9:16': '1024x1536' }[arg('aspect') || '16:9'];
if (!prompt || !output || !size) { console.error('usage: --prompt "..." --output file.png [--aspect 16:9|1:1|9:16]'); process.exit(1); }
const key = process.env.OPENAI_API_KEY;
if (!key) { console.error('OPENAI_API_KEY is not set. Save the prompt and leave a .slot on the page.'); process.exit(2); }

const res = await fetch('https://api.openai.com/v1/images/generations', {
  method: 'POST',
  headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ model: process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1', prompt, size, n: 1 }),
});
const body = await res.json();
if (!res.ok) { console.error('Image API error: ' + (body.error?.message || res.status)); process.exit(1); }
fs.mkdirSync(path.dirname(path.resolve(output)), { recursive: true });
fs.writeFileSync(output, Buffer.from(body.data[0].b64_json, 'base64'));
console.log('saved ' + output);
