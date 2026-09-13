const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '..', 'navigation.js'), 'utf8');
function setup(ids = ['about', 'experience', 'work']) {
  const positions = { about: 0, experience: 500, work: 1000 };
  const events = {};
  const frames = [];
  const links = ids.map(id => ({ hash: `#${id}`, attrs: {},
    setAttribute(name, value) { this.attrs[name] = value; },
    removeAttribute(name) { delete this.attrs[name]; } }));
  const viewport = { scrollY: 0, innerHeight: 800 };
  const document = { documentElement: { scrollHeight: 3000 }, querySelectorAll: () => links,
    getElementById: id => id in positions ? { id, getBoundingClientRect: () => ({ top: positions[id] }) } : null };
  vm.runInNewContext(source, { document, window: viewport,
    addEventListener: (type, fn) => { events[type] = fn; },
    requestAnimationFrame: fn => frames.push(fn) });
  return { positions, events, frames, links, viewport };
}
test('highlights exactly one section as the reader moves down and back up', () => {
  const s = setup();
  const current = () => s.links.filter(l => l.attrs['aria-current'] === 'location').map(l => l.hash);
  assert.deepEqual(current(), ['#about']);
  s.positions.experience = -200; s.positions.work = 110;
  s.events.scroll(); s.frames.shift()();
  assert.deepEqual(current(), ['#work']);
  s.positions.experience = 500; s.positions.work = 1000;
  s.events.scroll(); s.frames.shift()();
  assert.deepEqual(current(), ['#about']);
});
test('coalesces scroll events and handles hash navigation', () => {
  const s = setup();
  s.events.scroll(); s.events.scroll(); s.events.resize();
  assert.equal(s.frames.length, 1);
  s.frames.shift()();
  s.positions.experience = 30;
  s.events.hashchange(); s.frames.shift()();
  assert.equal(s.links[1].attrs['aria-current'], 'location');
});
test('leaves native links alone when a target is missing or there is no nav', () => {
  assert.deepEqual(Object.keys(setup(['missing']).events), []);
  assert.deepEqual(Object.keys(setup([]).events), []);
});

test('selects the final short section when the viewport reaches the page end', () => {
  const s = setup();
  s.viewport.scrollY = 2200;
  s.positions.experience = -500; s.positions.work = 500;
  s.events.scroll(); s.frames.shift()();
  assert.equal(s.links[2].attrs['aria-current'], 'location');
});
