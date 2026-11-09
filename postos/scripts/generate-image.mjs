#!/usr/bin/env node
// Optional image generation. Usage: node generate-image.mjs --prompt "..." --output out.png [--aspect 1:1|9:16|16:9]
// Uses OPENAI_API_KEY (default) or GEMINI_API_KEY from the environment. A key is never written to a file.
// With no key it exits 3 and the skill keeps the prompt as a text file for any image tool.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : d; };
const prompt = opt("prompt"), output = opt("output"), aspect = opt("aspect", "1:1");
if (!prompt || !output) { console.error('usage: node generate-image.mjs --prompt "..." --output out.png [--aspect 1:1]'); process.exit(2); }

const SIZE = { "1:1": "1024x1024", "9:16": "1024x1536", "16:9": "1536x1024" };
const die = (m) => { console.error(m); process.exit(1); };

async function openai() {
  const model = process.env.POSTOS_IMAGE_MODEL || "gpt-image-2";
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({ model, prompt, size: SIZE[aspect] || SIZE["1:1"], quality: "high", n: 1 }),
  });
  if (!res.ok) die(`OpenAI error ${res.status}: ${(await res.text()).slice(0, 400)}`);
  const b64 = (await res.json())?.data?.[0]?.b64_json;
  return b64 ? Buffer.from(b64, "base64") : die("no image in the OpenAI response");
}

async function gemini() {
  const model = process.env.POSTOS_IMAGE_MODEL || "gemini-3-pro-image-preview";
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseModalities: ["image", "text"], imageConfig: { aspectRatio: aspect } } }),
  });
  if (!res.ok) die(`Gemini error ${res.status}: ${(await res.text()).slice(0, 400)}`);
  const parts = (await res.json()).candidates?.flatMap((c) => c.content?.parts || []) || [];
  const img = parts.map((p) => p.inline_data || p.inlineData).find(Boolean);
  return img ? Buffer.from(img.data, "base64") : die("no image in the Gemini response");
}

const make = process.env.OPENAI_API_KEY ? openai : process.env.GEMINI_API_KEY ? gemini : null;
if (!make) { console.error("no image key: set OPENAI_API_KEY or GEMINI_API_KEY in the environment, or use the saved prompt in any image tool"); process.exit(3); }
const out = resolve(output);
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, await make());
console.log(`Image saved to: ${out}`);
