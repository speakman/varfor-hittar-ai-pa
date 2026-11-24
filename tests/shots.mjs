// Tar slutlägesskärmdumpar av alla bilder (1920x1080) och av fördjupningssidan i 390 px mobilemulering, till shots/final/.
import { launch, firstPage, sleep, DOCS, shotsDir } from './cdp.mjs';
const OUT = shotsDir('final');
const BASE = DOCS;
const b = await launch(9340); const p = await firstPage(b.port);
await p.size(1920, 1080);
const slides = await (async () => { await p.goto(BASE + 'index.html?still&theme=light#0.0', 500); return p.eval('window.deck.slides'); })();
for (const sl of slides) for (const st of new Set([sl.steps, ...(({ 7: [1], 11: [0, 3], 10: [1, 3], 8: [2], 6: [1] })[sl.n] || [])])) {
  const n = sl.n;
  await p.eval(`location.hash='#${n}.${st}',1`); await sleep(300);
  await p.shot(`${OUT}${String(n).padStart(2,'0')}.${st}.png`);
}
// Fördjupningssidan i exakt 390 px vyportbredd, hela sidan.
await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'light' }] });
await p.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await p.goto(BASE + 'fordjupning.html', 700);
const m = await p.eval(`JSON.stringify((() => { const de = document.documentElement; let worst = 0, who = ''; for (const el of document.querySelectorAll('body *')) { const r = el.getBoundingClientRect(); if (r.width && r.right > worst) { worst = r.right; who = el.tagName + '.' + el.className; } } return { innerWidth, clientWidth: de.clientWidth, scrollWidth: de.scrollWidth, scrollHeight: de.scrollHeight, mestHoger: Math.round(worst), element: who, presWide: getComputedStyle(document.querySelector('.pres-wide')).display, presNarrow: getComputedStyle(document.querySelector('.pres-narrow')).display, filmer: document.querySelectorAll('.films > li').length, hakar: document.body.textContent.includes('hakar gärna på frågan'), prova: !!document.querySelector('#prova'), integritet: !!document.querySelector('#integritet'), ext: document.querySelectorAll('a[target=_blank]').length, extUtanNoopener: document.querySelectorAll('a[target=_blank]:not([rel~=noopener])').length }; })())`);
console.log('390 px:', m);
await p.shot(OUT + 'fordjupning-mobil.png', true);
await p.shot(OUT + 'fordjupning-mobil-forsta-skarmen.png');
for (const id of ['prova', 'integritet']) { await p.eval(`document.documentElement.style.scrollBehavior='auto', document.querySelector('#${id}').scrollIntoView(), 1`); await sleep(300); await p.shot(`${OUT}fordjupning-mobil-${id}.png`); }
await p.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
await p.goto(BASE + 'fordjupning.html', 500);
console.log('1280 px:', await p.eval(`JSON.stringify({ presWide: getComputedStyle(document.querySelector('.pres-wide')).display, presNarrow: getComputedStyle(document.querySelector('.pres-narrow')).display })`));
console.log('errors', JSON.stringify(p.errors)); p.close(); b.close();
