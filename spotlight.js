// Decorative enhancement: no cursor replacement or dependency on page content.
(() => {
  const eligible = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  const root = document.documentElement;
  let frame = null;
  let x = 0;
  let y = 0;

  function hide() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    root.removeAttribute('data-pointer-glow');
  }

  function paint() {
    frame = null;
    if (!eligible.matches || document.hidden) return;
    root.style.setProperty('--pointer-x', `${x}px`);
    root.style.setProperty('--pointer-y', `${y}px`);
    root.setAttribute('data-pointer-glow', 'visible');
  }

  document.addEventListener('pointermove', event => {
    if (!eligible.matches || event.pointerType !== 'mouse' || document.hidden) {
      hide();
      return;
    }
    x = event.clientX;
    y = event.clientY;
    if (frame === null) frame = requestAnimationFrame(paint);
  }, { passive: true });

  document.addEventListener('pointerleave', hide);
  document.addEventListener('visibilitychange', () => { if (document.hidden) hide(); });
  document.addEventListener('keydown', event => { if (event.key === 'Tab') hide(); });
  window.addEventListener('blur', hide);
  eligible.addEventListener('change', hide);
})();
