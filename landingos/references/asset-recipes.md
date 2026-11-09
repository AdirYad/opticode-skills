# Asset recipes

Each tool here is optional. Check it exists before using it (`ffmpeg -version`, `uvx --version`). When a tool is missing, tell the owner what to prepare instead of skipping the asset.

| Need | How |
|---|---|
| **Cut-out of a person** (hero, FAQ, about) | `uvx --from "rembg[cpu,cli]" rembg i -m birefnet-portrait in.jpg out.png` (first run downloads a model). On the page: no frame, standing on `.sun`. |
| **Silent loop from footage** | `ffmpeg -y -ss <start> -i in.mp4 -t 4 -an -vf "scale=432:-2" -c:v libx264 -crf 26 -preset veryfast -movflags +faststart out.mp4`, then a poster: `ffmpeg -ss 0 -i out.mp4 -frames:v 1 out.jpg`. |
| **Reel for a deck** | From the owner's own file: `-t 20 -an -vf scale=480:-2 -crf 30`, about 1MB. View counts come from the public profile, and only from there. |
| **Profile proof** | The owner sends a screenshot, or open the public profile in a browser and capture it. Hebrew must render in a proper font. |
| **Product mockup (devices)** | A real screenshot composited onto a transparent device PNG. Never an invented screen. |
| **Step and bonus illustrations** | Build them as HTML on the page's dark world, then capture with Playwright (`page.screenshot({omitBackground:true})`). |
| **Share image** | 1200×630 HTML: mockup on a colour sheet with the headline in the poster face, captured the same way. Embed the image as a data URL. New file name per version, because social networks cache. |
| **Before/after of one object** | Crop so size and position match (same head height and eye line for a face), resize both to the same dimensions; badges in HTML, not inside the image. |
| **Document proof with a loupe** | A real document from the owner. Set `--loupe-img`, aim `background-position` at the number, check the loupe covers no text. Blur anything private first. |
| **Avatar for overlaps and quote bubbles** | The owner's round profile image → 240×240 WebP. |
| **Convert to WebP** | `ffmpeg -i in.png -q:v 80 out.webp`, longest side ≤1900px. |
