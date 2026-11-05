// Links work without JavaScript; this only highlights the visible section.
(() => {
  const links = [...document.querySelectorAll('.section-nav a[href^="#"]')];
  const sections = links.map(link => document.getElementById(link.hash.slice(1)));
  if (!links.length || sections.some(section => !section)) return;
  let scheduled = false;
  function update() {
    let active = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= 160) active = section;
    }
    // The final section may be too short to reach the activation line.
    if (Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 2) {
      active = sections[sections.length - 1];
    }
    for (const link of links) {
      if (link.hash === `#${active.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    scheduled = false;
  }
  function scheduleUpdate() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(update);
    }
  }
  addEventListener('scroll', scheduleUpdate, { passive: true });
  addEventListener('resize', scheduleUpdate);
  addEventListener('hashchange', scheduleUpdate);
  update();
})();
