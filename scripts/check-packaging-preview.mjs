import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const page = path.join(root, 'dizajn-upakovki');
const html = fs.readFileSync(path.join(page, 'index.html'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'docs/s04-packaging/assets-manifest.json'), 'utf8'));

function verifyPath(url, base) {
    if (!url || /^(?:#|data:|mailto:|tel:)/i.test(url)) return;
    assert.doesNotMatch(url, /^(?:https?:|\/\/|\/)/i, 'Resource must use a relative path: ' + url);
    const target = path.resolve(base, decodeURIComponent(url.split(/[?#]/)[0]));
    assert.ok(target.startsWith(root + path.sep), 'Resource outside checkout: ' + url);
    assert.ok(fs.statSync(target).isFile(), 'Missing resource: ' + url);
}

function verifyCss(css, base) {
    for (const [, quote, url] of css.matchAll(/url\(\s*(["']?)(.*?)\1\s*\)/gi)) verifyPath(url, base);
    for (const [, quote, url] of css.matchAll(/@import\s+(["'])(.*?)\1/gi)) verifyPath(url, base);
}

for (const match of html.matchAll(/<(?:img|script|link|source)\b[^>]*>/gi)) {
    const tag = match[0];
    if (/rel="canonical"/i.test(tag)) continue;
    for (const [, url] of tag.matchAll(/\b(?:src|href|poster|data-src)="([^"]+)"/gi)) verifyPath(url, page);
    for (const [, srcset] of tag.matchAll(/\bsrcset="([^"]+)"/gi)) {
        for (const part of srcset.split(',')) verifyPath(part.trim().split(/\s+/, 1)[0], page);
    }
}
verifyCss(html.replaceAll('&quot;', '"'), page);
for (const asset of manifest.assets) {
    if (asset.status === 'external') continue;
    assert.ok(['downloaded', 'reused-verified'].includes(asset.status), asset.source);
    const target = path.resolve(page, asset.path);
    const data = fs.readFileSync(target);
    assert.equal(data.length, asset.size, asset.path);
    assert.equal(createHash('sha256').update(data).digest('hex'), asset.sha256, asset.path);
    if (asset.kind === 'css') verifyCss(data.toString(), path.dirname(target));
}
assert.match(html, /name="robots" content="noindex, nofollow, noarchive"/);
assert.match(html, /connect-src 'none'; form-action 'none'/);
assert.doesNotMatch(html, /<form\b[^>]*(?:action|method)=|mc\.yandex\.ru|googletagmanager\.com|stats\.wp\.com|admin-ajax\.php/i);
assert.match(html, /href="https:\/\/wellhead\.ru\/services\/dizajn-upakovki\/"/);
assert.equal([...html.matchAll(/data-preview-form="project"/g)].length, 2);
assert.equal([...html.matchAll(/data-preview-form="presentation"/g)].length, 1);
assert.equal([...html.matchAll(/\bdata-vc-accordion(?=[=\s>])/g)].length, 10);
assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
const headings = [...html.matchAll(/<h2\b[^>]*>[\s\S]*?<\/h2>/g)].map(([heading]) =>
    heading.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
);
const originalHeadings = [
    'Зачем это нужно для вашего бренда:', 'Ключевые преимущества:', 'Что такое дизайн упаковки',
    'Критерии эффективного дизайна упаковки товара', 'Этапы разработки дизайна упаковки',
    'Стоимость разработки дизайна упаковки', 'Часто задаваемые вопросы'
];
// GEO sections add context without removing, renaming or rearranging the original headings.
assert.deepEqual(headings.filter(h => originalHeadings.includes(h)), originalHeadings);
const geoHeadings = [
    'Когда нужен новый дизайн упаковки',
    'Как сделать упаковку узнаваемой на десятках SKU',
    'Что получает заказчик по итогам проекта',
    'Дизайн упаковки в 5 проектах Heads'
];
for (const h of geoHeadings) {
    assert.equal(headings.filter(v => v === h).length, 2, 'one desktop and one mobile GEO H2: ' + h);
}
const fields = JSON.parse(fs.readFileSync(path.join(root, 'docs/s04-packaging/text-fields.json'), 'utf8')).fields;
const targets = new Map();
for (const [, id] of html.matchAll(/\bdata-heads-text-id="(HEADS-S04-(?:SEO-)?\d+)"/g)) {
    targets.set(id, (targets.get(id) || 0) + 1);
}
assert.equal(targets.size, fields.length);
assert.equal(new Set(fields.map(field => field.id)).size, fields.length);
assert.equal(fields.filter(field => field.kind === 'seo').length, 4);
for (const field of fields) {
    assert.equal(targets.get(field.id), field.targets, 'Text binding: ' + field.id);
    assert.ok(field.selector.startsWith('[data-heads-text-id="' + field.id + '"]'), field.id);
}
const schema = JSON.parse(html.match(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)[1]);
const faq = schema['@graph'].find(node => node['@type'] === 'FAQPage');
assert.equal(faq.mainEntity.length, 5);
for (const [index, entity] of faq.mainEntity.entries()) {
    const prefix = 'FAQPage.mainEntity[' + index + '].';
    const question = fields.filter(field => field.sync === prefix + 'name');
    const answer = fields.filter(field => field.sync === prefix + 'acceptedAnswer.text');
    assert.equal(question.length, 1);
    assert.equal(question[0].current, entity.name);
    assert.ok(answer.length);
    assert.equal(answer.map(field => field.current).join(' '), entity.acceptedAnswer.text.replace(/\s+/gu, ' ').trim());
}
new vm.Script(fs.readFileSync(path.join(page, 'preview.js'), 'utf8'));
console.log('PASS: S04 static layout, form isolation and asset checksums');
