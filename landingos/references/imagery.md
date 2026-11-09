# Imagery: how many, which kinds, how they are framed

A long sales page lives on real images. As a working target, plan for 30 or more; `lp-gaps.mjs` reports anything under that. A page with 5 images will look empty, whatever the CSS. The authority section is the image-heaviest part of the page.

## The 9 image roles (collect these from the owner)

1. **Hero cut-out of the expert**: transparent background (RGBA WebP/PNG), portrait, face lit, a gesture. Bottom edge soft.
2. **Framed portrait**: real photo, 4:5 crop, face high in the frame.
3. **Life or journey photos** (3): candid, square-ish, shown as prints.
4. **Credentials**: certificate photo, school or association logos.
5. **On stage or teaching** (2): 4:5.
6. **Press**: logos for the belt (light on transparent) + screenshots of the actual articles.
7. **Reach**: profile screenshot (in a phone), 3-5 reels (MP4 + poster + real view count).
8. **Client proof**: message screenshots. Retype them as `.pf` slips letter for letter, and keep 2-3 raw screenshots in `.notes` or `.plate`.
9. **Product**: an all-devices mockup (RGBA, 1900×1072), one per module and bonus.

Plus: 1 mood photo for the pain story (scene, no face), 1 humour image (optional), 1 avatar, payment logos.

## The 5 frames (nothing else)

| Frame | When | How |
|---|---|---|
| **Figure on a sun** `.sun` | the expert as a figure (hero, mechanism, FAQ) | no box; a solid `--flare` disc behind (`.sun__disc`), optional thin orbit (`.sun__orbit`); bottom edge faded by mask |
| **Mounted plate** `.plate` | portraits, mood, stage, certificate, screenshots | `--r-2` corners, `--cast-2`. `.plate--backed` adds a flat `--field` sheet behind it, for the main portrait only |
| **Print** `.print` | personal photos in a set of 3 | chalk paper with a deeper bottom edge, set `--tilt`, landing with `.fly-r`/`.fly-l` |
| **Browser window** `.win` | research, articles, web proof | `.win__bar` with three short bars, `figcaption` with the source |
| **Floating object** `.float` | product, modules, bonuses | `drop-shadow` only, a slow 9s drift |

## Technical rules
- `width` + `height` on every `<img>`; `loading="lazy"` on all but the hero; `fetchpriority="high"` on the hero figure.
- WebP, longest side 1900px or less, target 150KB or less. GIF becomes animated WebP (keep it under about 600KB).
- Reels: `<video muted playsinline preload="none" poster="…webp" data-src="…mp4">`; the most visible one plays (`page.js`).
- Logos: light version on transparent, prepared in advance (`mix-blend-mode` does not work inside a moving marquee). 30px tall, wide wordmarks 20px (`.logo--wide`).
- The expert's face is never AI-generated, in any section. Testimonials are never invented. A missing image gets a `.slot` naming exactly what to ask for, never a substitute.
- Allowed to generate: abstract mood images, backgrounds, product mockup composites from real screenshots, background removal.

## Enrichment pass (after the page works)
When the owner has a folder, a website or a public profile: collect images and place each next to the sentence it proves, with no added caption or label. The only text that may be added is real data: a message retyped letter for letter, the time in a screenshot, a real view count. Then run the gate again.
