const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '..', 'spotlight.js'), 'utf8');
function setup(enabled = true) {
  const events = {}, windowEvents = {}, frames = new Map(), attrs = {}, styles = {};
  let nextFrame = 0, mediaChange;
  const media = { matches: enabled, addEventListener: (_, fn) => { mediaChange = fn; } };
  const document = { hidden: false, documentElement: {
    style: { setProperty: (key, value) => { styles[key] = value; } },
    setAttribute: (key, value) => { attrs[key] = value; },
    removeAttribute: key => { delete attrs[key]; },
  }, addEventListener: (name, fn) => { events[name] = fn; } };
  vm.runInNewContext(source, { document,
    window: { addEventListener: (name, fn) => { windowEvents[name] = fn; } },
    matchMedia: query => { assert.match(query, /prefers-reduced-motion: no-preference/); assert.match(query, /pointer: fine/); return media; },
    requestAnimationFrame: fn => { frames.set(++nextFrame, fn); return nextFrame; },
    cancelAnimationFrame: id => frames.delete(id),
  });
  const move = (x, y, pointerType = 'mouse') => events.pointermove({ clientX: x, clientY: y, pointerType });
  const flush = () => { const pending = [...frames.values()]; frames.clear(); pending.forEach(fn => fn()); };
  return { events, windowEvents, frames, attrs, styles, media, document, move, flush, change: () => mediaChange() };
}
test('uses the latest viewport coordinates and coalesces pointer events per frame', () => {
  const s = setup();
  s.move(10,20); s.move(70,90);
  assert.equal(s.frames.size,1);
  assert.equal(s.attrs['data-pointer-glow'],undefined);
  s.flush();
  assert.equal(s.styles['--pointer-x'],'70px');
  assert.equal(s.styles['--pointer-y'],'90px');
  assert.equal(s.attrs['data-pointer-glow'],'visible');
});
test('stays disabled for ineligible media and touch input', () => {
  const s=setup(false); s.move(10,10); s.flush();
  assert.equal(s.attrs['data-pointer-glow'],undefined);
  s.media.matches=true; s.move(10,10,'touch'); s.flush();
  assert.equal(s.attrs['data-pointer-glow'],undefined);
});
test('leaving the page or losing focus cancels a pending frame and hides the glow', () => {
  for(const event of ['pointerleave','blur']) {
    const s=setup(); s.move(10,10); s.flush(); s.move(20,20);
    (event==='blur'?s.windowEvents:s.events)[event](); s.flush();
    assert.equal(s.frames.size,0);
    assert.equal(s.attrs['data-pointer-glow'],undefined);
  }
});
test('responds to reduced-motion changes, keyboard use and hidden documents', () => {
  const s=setup(); s.move(1,2); s.flush();
  s.media.matches=false; s.change(); s.move(3,4); s.flush();
  assert.equal(s.attrs['data-pointer-glow'],undefined);
  s.media.matches=true; s.move(1,2); s.flush(); s.events.keydown({key:'Tab'});
  assert.equal(s.attrs['data-pointer-glow'],undefined);
  s.move(1,2); s.document.hidden=true; s.events.visibilitychange(); s.flush();
  assert.equal(s.attrs['data-pointer-glow'],undefined);
});
