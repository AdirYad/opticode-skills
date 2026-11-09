# Contact sheets from section screenshots, so a whole page can be reviewed by eye.
# Usage: python sheets.py <shotsDir>   (expects <shotsDir>/mobile and <shotsDir>/desktop)
import sys, os
try:
    from PIL import Image, ImageDraw
except ImportError:
    sys.exit('sheets.py needs Pillow: python -m pip install pillow (optional: section screenshots can be read one by one)')

root = sys.argv[1]
for kind, colw, cols, maxh in (('mobile', 390, 4, 2400), ('desktop', 720, 2, 1600)):
    d = os.path.join(root, kind)
    if not os.path.isdir(d):
        continue
    files = sorted(f for f in os.listdir(d) if f.endswith('.png'))
    tiles = []
    for f in files:
        im = Image.open(os.path.join(d, f)).convert('RGB')
        im = im.resize((colw, round(im.height * colw / im.width)))
        im = im.crop((0, 0, colw, min(im.height, maxh)))
        ImageDraw.Draw(im).rectangle((0, 0, colw, 22), fill=(255, 230, 0))
        ImageDraw.Draw(im).text((6, 5), f, fill=(0, 0, 0))
        tiles.append(im)
    out = os.path.join(root, 'sheets')
    os.makedirs(out, exist_ok=True)
    for n in range(0, len(tiles), cols):
        row = tiles[n:n + cols]
        sheet = Image.new('RGB', (cols * colw + (cols - 1) * 8, max(t.height for t in row)), (255, 255, 255))
        for i, t in enumerate(row):
            sheet.paste(t, (i * (colw + 8), 0))
        sheet.save(os.path.join(out, f'{kind}-{n // cols:02d}.jpg'), quality=82)
    print(kind, len(tiles), 'tiles')
