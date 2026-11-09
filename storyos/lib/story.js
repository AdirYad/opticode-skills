// Instagram-style text boxes. Injected by render.mjs after the page loads.
// A box is the union of its line rects: convex radius R on outer corners, concave C where a narrower line meets a wider one.
function boxPath(rs, R, C) {
  const f = rs[0], l = rs[rs.length - 1];
  let d = `M${f.x0 + R},${f.y0} L${f.x1 - R},${f.y0} A${R},${R} 0 0 1 ${f.x1},${f.y0 + R} `;
  for (let i = 0; i < rs.length - 1; i++) { // right side, going down
    const c = rs[i], n = rs[i + 1], y = c.y1, dx = n.x1 - c.x1; if (Math.abs(dx) < 1) continue;
    const v = Math.min(R, Math.abs(dx) / 2), q = Math.min(C, Math.abs(dx) / 2);
    if (dx > 0) d += `L${c.x1},${y - q} A${q},${q} 0 0 0 ${c.x1 + q},${y} L${n.x1 - v},${y} A${v},${v} 0 0 1 ${n.x1},${y + v} `;
    else d += `L${c.x1},${y - v} A${v},${v} 0 0 1 ${c.x1 - v},${y} L${n.x1 + q},${y} A${q},${q} 0 0 0 ${n.x1},${y + q} `;
  }
  d += `L${l.x1},${l.y1 - R} A${R},${R} 0 0 1 ${l.x1 - R},${l.y1} L${l.x0 + R},${l.y1} A${R},${R} 0 0 1 ${l.x0},${l.y1 - R} `;
  for (let i = rs.length - 1; i > 0; i--) { // left side, going up
    const c = rs[i], p = rs[i - 1], y = c.y0, dx = c.x0 - p.x0; if (Math.abs(dx) < 1) continue;
    const v = Math.min(R, Math.abs(dx) / 2), q = Math.min(C, Math.abs(dx) / 2);
    if (dx > 0) d += `L${c.x0},${y + q} A${q},${q} 0 0 0 ${c.x0 - q},${y} L${p.x0 + v},${y} A${v},${v} 0 0 1 ${p.x0},${y - v} `;
    else d += `L${c.x0},${y + v} A${v},${v} 0 0 1 ${c.x0 + v},${y} L${p.x0 - q},${y} A${q},${q} 0 0 0 ${p.x0},${y - q} `;
  }
  return d + `L${f.x0},${f.y0 + R} A${R},${R} 0 0 1 ${f.x0 + R},${f.y0} Z`;
}

window.__storyReady = (async () => {
  await document.fonts.load('600 50px R'); await document.fonts.ready;
  await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = r; i.onerror = r; })));
  const ctx = document.createElement('canvas').getContext('2d');
  document.querySelectorAll('.box').forEach(box => {
    const cs = getComputedStyle(box), R = +cs.getPropertyValue('--rv'), C = +cs.getPropertyValue('--rc'), k = +cs.getPropertyValue('--k');
    // font size so the reference line is 727px wide at k=1 (matches IG Classic Hebrew at 1080)
    ctx.font = '600 100px R'; const rm = ctx.measureText('מחר בערב גם אתם לא תצטרכו');
    const F = +(k * 100 * 727 / (rm.actualBoundingBoxLeft + rm.actualBoundingBoxRight)).toFixed(2);
    box.style.fontSize = F + 'px'; ctx.font = '600 ' + F + 'px R';
    const m = ctx.measureText('מ'), A = m.fontBoundingBoxAscent, D = m.fontBoundingBoxDescent, h = m.actualBoundingBoxAscent, b = (F - (A + D)) / 2 + A;
    const spans = [...box.querySelectorAll(':scope > span')];
    // 27k at the box's outer edges, 19k + 19k between lines
    spans.forEach((sp, i) => { sp.style.paddingTop = ((i ? 19 : 27) * k - (b - h)) + 'px'; sp.style.paddingBottom = ((i < spans.length - 1 ? 19 : 27) * k - (F - b)) + 'px'; });
    box.querySelectorAll('.emo').forEach(im => { const s = im.parentElement.closest('span').getBoundingClientRect(), r = im.getBoundingClientRect(); im.style.position = 'relative'; im.style.top = ((s.top + s.bottom) - (r.top + r.bottom)) / 2 + 'px'; });
    const bg = getComputedStyle(spans[0]).backgroundColor;
    spans.forEach(s => s.style.background = 'none');
    const bb = box.getBoundingClientRect();
    const rs = spans.map(s => { const q = s.getBoundingClientRect(); return { x0: q.left - bb.left, x1: q.right - bb.left, y0: q.top - bb.top, y1: q.bottom - bb.top }; });
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', bb.width); svg.setAttribute('height', bb.height);
    svg.style.cssText = 'position:absolute;left:0;top:0;z-index:-1;overflow:visible';
    svg.innerHTML = `<path d="${boxPath(rs, R, C)}" fill="${bg}"/>`;
    box.prepend(svg);
  });
  // rotate AFTER measuring: getBoundingClientRect on a rotated element breaks the path
  document.querySelectorAll('[data-rotate]').forEach(el => { el.style.transform = `rotate(${el.dataset.rotate}deg)`; });
  document.body.dataset.ready = '1';
})();
