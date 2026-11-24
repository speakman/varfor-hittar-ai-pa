// Litet hjälpbibliotek: styr headless Chrome via DevTools-protokollet.
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
// Sökvägen till Chrome kan bytas med miljövariabeln CHROME.
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

/* Alla sökvägar räknas från den här filen, så att testerna går att köra varifrån som helst. */
export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const DOCS = pathToFileURL(join(ROOT, 'docs')).href + '/';
export const shotsDir = name => { const d = join(ROOT, 'shots', name); mkdirSync(d, { recursive: true }); return d + '/'; };
export const sleep = ms => new Promise(r => setTimeout(r, ms));
export async function launch(port = 9333, extra = []) {
  const dir = mkdtempSync(join(tmpdir(), 'chrome-test-'));
  const proc = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${dir}`,
    '--no-first-run', '--hide-scrollbars', '--disable-popup-blocking', ...extra, 'about:blank'], { stdio: 'ignore' });
  for (let k = 0; k < 50; k++) {
    try { await (await fetch(`http://127.0.0.1:${port}/json/version`)).json(); break; } catch { await sleep(200); }
  }
  return { proc, port, close: () => proc.kill() };
}
export async function targets(port) { return (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); }
export async function attach(wsUrl) {
  const ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0; const pending = new Map(); const errors = []; const requests = [];
  ws.onmessage = ev => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result); return; }
    if (m.method === 'Runtime.exceptionThrown') errors.push('EXC: ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
    if (m.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(m.params.type)) errors.push('CONSOLE ' + m.params.type + ': ' + m.params.args.map(a => a.value ?? a.description).join(' '));
    if (m.method === 'Log.entryAdded' && ['error', 'warning'].includes(m.params.entry.level)) errors.push('LOG ' + m.params.entry.level + ': ' + m.params.entry.text + ' ' + (m.params.entry.url || ''));
    if (m.method === 'Network.requestWillBeSent') requests.push(m.params.request.url);
  };
  const send = (method, params = {}) => new Promise((res, rej) => { pending.set(++id, { res, rej }); ws.send(JSON.stringify({ id, method, params })); });
  await send('Runtime.enable'); await send('Log.enable'); await send('Page.enable'); await send('Network.enable');
  const page = {
    send, errors, requests,
    async size(w, h, dark = false) {
      await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false });
    },
    async goto(url, wait = 500) {
      await send('Page.navigate', { url });
      await sleep(wait);
      await page.eval('document.fonts.ready.then(() => 1)');
    },
    async eval(expr) {
      const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
      if (r.exceptionDetails) throw new Error('eval: ' + JSON.stringify(r.exceptionDetails));
      return r.result.value;
    },
    async key(key, code = key, vk = 0) {
      await send('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode: vk });
      await send('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode: vk });
    },
    async shot(file, full = false) {
      mkdirSync(dirname(file), { recursive: true });
      const r = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: full });
      writeFileSync(file, Buffer.from(r.data, 'base64'));
    },
    close: () => ws.close()
  };
  return page;
}
export async function firstPage(port) {
  const t = (await targets(port)).find(t => t.type === 'page');
  return attach(t.webSocketDebuggerUrl);
}
