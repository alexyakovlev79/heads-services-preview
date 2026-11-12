#!/usr/bin/env node
// Reproducible static audit for the Heads services preview. No dependencies.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const html = read('index.html');
const js = read('preview.js');
const errors = [];
const referencedFiles = new Set();
const check = (condition, message) => { if (!condition) errors.push(message); };
const localFile = (ref, base = '') => {
  if (!ref || /^(?:#|data:|https?:|\/\/|mailto:|tel:|javascript:)/i.test(ref)) return;
  const clean = ref.split(/[?#]/)[0].trim();
  if (!clean || clean === './' || clean === '/') return;
  const relative = path.posix.normalize(path.posix.join(base, clean));
  if (relative === '..' || relative.startsWith('../')) {
    errors.push('Path escapes the preview: ' + relative);
    return;
  }
  referencedFiles.add(relative);
  if (!fs.existsSync(path.join(root, relative))) errors.push('Missing local resource: ' + relative);
};

for (const match of html.matchAll(/\b(?:src|href|poster)=("|')([^"']+)\1/gi)) {
  localFile(match[2]);
}
for (const match of html.matchAll(/\bsrcset=("|')([^"']+)\1/gi)) {
  for (const candidate of match[2].split(',')) localFile(candidate.trim().split(/\s+/)[0]);
}

const assetsDir = path.join(root, 'assets');
const assets = fs.readdirSync(assetsDir);
for (const name of assets.filter((s) => s.endsWith('.css'))) {
  const css = read('assets/' + name);
  for (const match of css.matchAll(/url\(\s*(['"]?)(.*?)\1\s*\)/gi)) {
    localFile(match[2], 'assets');
  }
}

check(assets.length >= 200, 'Unexpected asset loss: ' + assets.length + ' files');
check(/<meta\s+name="robots"\s+content="noindex,\s*nofollow,\s*noarchive"/i.test(html),
      'Preview must stay noindex');
check(html.includes("form-action 'none'"), 'Preview must block network form actions');
check((html.match(/class="service__category\b/g) || []).length === 4,
      'The original four service categories must remain');
check((html.match(/data-preview-form="/g) || []).length === 2, 'Expected exactly two preview forms');
check(html.includes('data-preview-form="project"'), 'Missing project form');
check(html.includes('data-preview-form="presentation"'), 'Missing presentation form');
check(html.includes('id="mobile-menu-alternative"'), 'Missing original mobile menu');
check(html.includes('id="elementor-popup-modal-14570"'), 'Missing original presentation dialog');
check(js.includes('presentationUrl') && js.includes('preview-presentation-mobile-link'),
      'Presentation link or mobile access is missing');
check(js.includes('Демонстрационный режим. Данные не отправлены.'),
      'Demo forms must clearly state that no data was sent');
check(js.includes('Максимальный размер файла'), 'Missing attachment size validation');

try { new vm.Script(js, { filename: 'preview.js' }); }
catch (e) { errors.push('preview.js syntax: ' + e.message); }

console.log('Heads preview: ' + assets.length + ' assets; ' +
            referencedFiles.size + ' unique local references checked.');
if (errors.length) {
  for (const issue of errors) console.error('FAIL: ' + issue);
  process.exitCode = 1;
} else {
  console.log('PASS: static resources, menus, presentation, forms and JavaScript syntax.');
  console.log('Browser appearance and PDF availability still require manual checks.');
}
