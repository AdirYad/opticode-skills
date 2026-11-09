/* LandingOS jump guard. Load at the top of <body>, before anything else.
   Smooth-scrolls in-page links, and keeps the target in place while late images and fonts shift the layout.
   Stops at the first sign that the visitor took over. */
(() => {
  let target = null, deadline = 0;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  try { history.scrollRestoration = 'manual'; } catch (e) {}

  const finishEntrance = el => {
    [el, ...el.querySelectorAll('.reveal,[data-reveal],.fly-r,.fly-l')].forEach(n => n.classList.add('in'));
  };
  const place = smooth => {
    const y = target.getBoundingClientRect().top + scrollY;
    if (smooth) scrollTo({ top: y, behavior: 'smooth' });
    else if (Math.abs(y - scrollY) > 90) scrollTo(0, y);
  };
  const release = () => { target = null; };

  document.addEventListener('click', e => {
    const link = e.target.closest && e.target.closest('a[href^="#"]');
    if (!link || e.defaultPrevented) return;
    const el = link.hash.length > 1 && document.getElementById(link.hash.slice(1));
    if (!el) return;
    e.preventDefault();
    target = el;
    finishEntrance(el);
    deadline = performance.now() + 6000;
    place(!calm);
    history.pushState(null, '', link.hash);
    setTimeout(function hold() {
      if (!target) return;
      if (performance.now() > deadline) return release();
      place(false);
      setTimeout(hold, 450);
    }, calm ? 200 : 1300);
  });
  ['wheel', 'touchmove', 'keydown'].forEach(type => addEventListener(type, release, { passive: true }));
})();
