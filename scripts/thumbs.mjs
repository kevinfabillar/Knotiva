// Makes the catalogue thumbnails for every template (or the slugs you pass):
//   npm run thumbs                 all templates
//   npm run thumbs -- cinematic    just one
// Starts its own Vite dev server, opens each demo in headless Chrome and saves
// public/templates/<slug>/thumb-desktop.jpg (1280×800) and thumb-phone.jpg (390×844).
// Set CHROME_PATH if Chrome is not in the usual place.
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import puppeteer from 'puppeteer-core';
import { CATALOG } from '../src/templates/catalog.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const CHROME =
  process.env.CHROME_PATH ||
  [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].find((p) => existsSync(p));

if (!CHROME) {
  console.error('Chrome not found. Set CHROME_PATH to your Chrome or Edge executable.');
  process.exit(1);
}

const only = process.argv.slice(2);
const list = only.length ? CATALOG.filter((t) => only.includes(t.slug)) : CATALOG;

const VIEWS = [
  ['desktop', { width: 1280, height: 800, deviceScaleFactor: 1 }],
  ['phone', { width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true }],
];

const server = await createServer({ root, logLevel: 'error', server: { port: 5199 } });
await server.listen();
const base = server.resolvedUrls.local[0];
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--hide-scrollbars'] });

try {
  for (const t of list) {
    const dir = resolve(root, 'public/templates', t.slug);
    mkdirSync(dir, { recursive: true });
    for (const [name, viewport] of VIEWS) {
      const page = await browser.newPage();
      await page.setViewport(viewport);
      await page.goto(`${base}templates/${t.slug}?thumb=1`, { waitUntil: 'networkidle0', timeout: 90000 });
      await page.evaluate(() => document.fonts.ready);
      await new Promise((r) => setTimeout(r, 500));
      await page.screenshot({ path: resolve(dir, `thumb-${name}.jpg`), type: 'jpeg', quality: 82 });
      await page.close();
    }
    console.log(`✓ ${t.slug}`);
  }
} finally {
  await browser.close();
  await server.close();
}
