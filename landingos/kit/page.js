/* LandingOS page behaviour. No libraries. One scroll loop drives entrances, word lighting and progress lines,
   so an element that was skipped by a fast scroll is still revealed on the next frame. */
(() => {
  window.__pageOn = true;
  const doc = document;
  const all = (q, from = doc) => [...from.querySelectorAll(q)];
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp01 = n => Math.min(1, Math.max(0, n));

  /* no orphans: a line never ends on one lonely word */
  all('h1,h2,h3,h4,p,li,summary,figcaption,blockquote,[data-glue]').forEach(block => {
    const texts = [];
    const walk = doc.createTreeWalker(block, NodeFilter.SHOW_TEXT);
    while (walk.nextNode()) if (walk.currentNode.nodeValue.trim()) texts.push(walk.currentNode);
    const last = texts.pop();
    if (!last || block.innerText.trim().split(/\s+/).length < 4) return;
    last.nodeValue = last.nodeValue.replace(/\s+(\S+)\s*$/, ' $1');
  });

  /* word lighting: wrap each word once */
  const lightBlocks = all('[data-sfade]').map(el => {
    const nodes = [];
    const walk = doc.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while (walk.nextNode()) nodes.push(walk.currentNode);
    nodes.forEach(node => {
      const parts = node.nodeValue.split(/(\s+)/);
      const frag = doc.createDocumentFragment();
      parts.forEach(p => {
        if (!p.trim()) { frag.append(p); return; }
        const s = doc.createElement('span');
        s.className = 'w';
        s.textContent = p;
        frag.append(s);
      });
      node.replaceWith(frag);
    });
    return { el, words: all('.w', el) };
  });

  /* numbers run up to the value already printed in the markup */
  const runCount = el => {
    const raw = el.dataset.count;
    const end = parseFloat(raw);
    const places = (raw.split('.')[1] || '').length;
    if (isNaN(end) || calm) return;
    const started = performance.now();
    const draw = now => {
      const t = clamp01((now - started) / 1500);
      const value = end * (1 - Math.pow(1 - t, 4));
      el.textContent = value.toLocaleString('en-US', { minimumFractionDigits: places, maximumFractionDigits: places });
      if (t < 1) requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  };

  let pending = all('.reveal,[data-reveal],.fly-r,.fly-l');
  let counters = all('[data-count]');
  const lines = all('[data-progress]');
  let queued = false;

  const frame = () => {
    queued = false;
    const vh = innerHeight;
    pending = pending.filter(el => {
      if (el.getBoundingClientRect().top > vh * .88) return true;
      el.classList.add('in');
      return false;
    });
    counters = counters.filter(el => {
      if (el.getBoundingClientRect().top > vh * .9) return true;
      runCount(el);
      return false;
    });
    lightBlocks.forEach(({ el, words }) => {
      const box = el.getBoundingClientRect();
      const mid = box.top + box.height / 2;
      const from = vh * .9 + box.height / 2;
      const to = vh * .58;
      const share = clamp01((from - mid) / (from - to));
      const on = Math.ceil(share * words.length);
      words.forEach((w, i) => w.classList.toggle('lit', i < on));
    });
    lines.forEach(el => {
      const box = el.getBoundingClientRect();
      el.style.setProperty('--p', clamp01((vh * .72 - box.top) / box.height).toFixed(3));
    });
  };
  const ask = () => { if (!queued) { queued = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', ask, { passive: true });
  addEventListener('resize', ask);
  addEventListener('load', ask);
  frame();

  /* logo belt: the second copy makes the loop seamless */
  all('.marquee__track').forEach(track => {
    [...track.children].forEach(item => {
      const twin = item.cloneNode(true);
      twin.setAttribute('aria-hidden', 'true');
      track.append(twin);
    });
  });

  /* swipe rows: one dot per card, shown only when the row really scrolls */
  all('[data-dots]').forEach(row => {
    const items = [...row.children];
    const bar = row.parentElement.querySelector('.dots');
    if (!bar) return;
    bar.innerHTML = items.map(() => '<i></i>').join('');
    const marks = [...bar.children];
    const update = () => {
      const centre = row.getBoundingClientRect().left + row.clientWidth / 2;
      let best = 0, gap = Infinity;
      items.forEach((item, i) => {
        const b = item.getBoundingClientRect();
        const d = Math.abs(b.left + b.width / 2 - centre);
        if (d < gap) { gap = d; best = i; }
      });
      marks.forEach((m, i) => m.classList.toggle('on', i === best));
      bar.hidden = row.scrollWidth <= row.clientWidth + 4;
    };
    row.addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    update();
  });

  /* reels: the most visible one plays, the others wait */
  all('.reels__track').forEach(row => {
    const clips = all('video', row);
    const shares = new Map();
    const pick = () => {
      let top = null, most = .55;
      shares.forEach((share, clip) => { if (share > most) { most = share; top = clip; } });
      clips.forEach(clip => {
        if (clip !== top) { clip.pause(); return; }
        if (clip.dataset.src && !clip.src) clip.src = clip.dataset.src;
        clip.play().catch(() => {});
      });
    };
    const watch = new IntersectionObserver(entries => {
      entries.forEach(e => shares.set(e.target, e.intersectionRatio));
      pick();
    }, { threshold: [0, .3, .6, .9] });
    clips.forEach(clip => watch.observe(clip));
  });

  /* iOS can suspend muted loops: resume on the first touch */
  addEventListener('touchstart', () => all('video[autoplay]').forEach(v => v.play().catch(() => {})), { once: true, passive: true });
})();
