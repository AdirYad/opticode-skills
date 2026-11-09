/* LandingOS optional stage behaviours: before/after wipe, one-screen switcher, one-command demo.
   Load only on pages that use them. */
(() => {
  const all = (q, from = document) => [...from.querySelectorAll(q)];
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const onScreen = (el, enter, leave) =>
    new IntersectionObserver(([e]) => (e.isIntersecting ? enter() : leave && leave()), { threshold: .3 }).observe(el);
  const wait = ms => new Promise(done => setTimeout(done, ms));

  /* wipe: a native range input is the handle, so touch and keyboard work for free */
  all('[data-cmp]').forEach(box => {
    const handle = box.querySelector('input[type=range]');
    const place = v => box.style.setProperty('--cut', v + '%');
    let raf = 0, touched = false;
    handle.addEventListener('input', () => { touched = true; cancelAnimationFrame(raf); place(handle.value); });
    if (calm) return;
    const drift = now => {
      const v = 50 + 32 * Math.sin(now / 1400);
      handle.value = v;
      place(v);
      raf = requestAnimationFrame(drift);
    };
    onScreen(box, () => { if (!touched) raf = requestAnimationFrame(drift); }, () => cancelAnimationFrame(raf));
  });

  /* switcher: one screen, tabs that advance by themselves until someone picks one */
  all('[data-switch]').forEach(box => {
    const views = all('.multi__view', box);
    const tabs = all('.multi__tab', box);
    const hold = +box.dataset.hold || 4600;
    let at = 0, timer = 0, stopped = calm;
    const show = n => {
      at = n;
      views.forEach((v, i) => {
        v.classList.toggle('on', i === n);
        const clip = v.querySelector('video');
        if (clip) i === n ? clip.play().catch(() => {}) : clip.pause();
      });
      tabs.forEach((t, i) => { t.classList.toggle('on', i === n); t.style.setProperty('--hold', hold + 'ms'); });
    };
    const next = () => { show((at + 1) % views.length); timer = setTimeout(next, hold); };
    tabs.forEach((t, i) => t.addEventListener('click', () => { stopped = true; clearTimeout(timer); box.classList.add('picked'); show(i); }));
    show(0);
    onScreen(box, () => { if (!stopped) timer = setTimeout(next, hold); }, () => clearTimeout(timer));
  });

  /* one command, many results: type, fill the slots, spread over the week, start again */
  all('[data-td]').forEach(box => {
    const out = box.querySelector('[data-td-text]');
    const prompts = (box.dataset.tdPrompts || out.textContent).split('|').map(s => s.trim()).filter(Boolean);
    const slots = all('.cmd__slot', box);
    const days = all('.cmd__tile', box);
    let live = false, running = false, turn = 0;
    if (calm) { box.classList.add('spread'); slots.forEach(s => s.classList.add('on')); days.forEach(d => d.classList.add('on')); return; }
    const type = async text => {
      for (let i = 1; i <= text.length && live; i++) { out.textContent = text.slice(0, i); await wait(34); }
    };
    const stage = async (list, ms) => { for (const item of list) { if (!live) return; item.classList.add('on'); await wait(ms); } };
    const loop = async () => {
      if (running) return;
      running = true;
      while (live) {
        box.classList.remove('spread');
        [...slots, ...days].forEach(el => el.classList.remove('on'));
        await type(prompts[turn++ % prompts.length]);
        await wait(380);
        await stage(slots, 130);
        await wait(700);
        box.classList.add('spread');
        await stage(days, 90);
        await wait(2800);
      }
      running = false;
    };
    onScreen(box, () => { live = true; loop(); }, () => { live = false; });
  });
})();
