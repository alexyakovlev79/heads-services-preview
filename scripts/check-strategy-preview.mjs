import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const page = path.join(root, 'strategija-i-pozicionirovanie');
const html = fs.readFileSync(path.join(page, 'index.html'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'docs/s02-strategy/assets-manifest.json'), 'utf8'));

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
    assert.equal(asset.status, 'downloaded', asset.source);
    const target = path.resolve(page, asset.path);
    const data = fs.readFileSync(target);
    assert.equal(data.length, asset.size, asset.path);
    assert.equal(createHash('sha256').update(data).digest('hex'), asset.sha256, asset.path);
    if (asset.kind === 'css') verifyCss(data.toString(), path.dirname(target));
}
assert.match(html, /name="robots" content="noindex, nofollow, noarchive"/);
assert.match(html, /connect-src 'none'; form-action 'none'/);
assert.doesNotMatch(html, /<form\b[^>]*(?:action|method)=|mc\.yandex\.ru|googletagmanager\.com|stats\.wp\.com|admin-ajax\.php/i);
assert.equal([...html.matchAll(/data-preview-form="project"/g)].length, 2);
assert.equal([...html.matchAll(/data-preview-form="presentation"/g)].length, 1);
assert.equal([...html.matchAll(/\bdata-vc-accordion(?=[=\s>])/g)].length, 6);
assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
const headings = [...html.matchAll(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/g)]
    .filter(([,attrs]) => /\bvcex-module\b/.test(attrs))
    .map(([heading]) => heading.replace(/<[^>]+>/g, '').replace(/\s+/g,' ').trim());
assert.deepEqual(headings, [
    'Суть и позиционирование бренда', 'Стратегия продвижения бренда',
    'Этапы разработки стратегии и позиционирования бренда', 'Критерии оценки позиционирования бренда',
    'Стоимость разработки позиционирования и стратегии бренда', 'Часто задаваемые вопросы'
]);
new vm.Script(fs.readFileSync(path.join(page, 'preview.js'), 'utf8'));
new vm.Script(fs.readFileSync(path.join(page, 'geo-s02.js'), 'utf8'));
const fromGeo=html.indexOf('<section id="heads-s02-geo"');
const toGeo=html.indexOf('<div class="vc_row wpb_row vc_row-fluid vc_custom_1730794397650 hidden-phone">',fromGeo);
assert.ok(fromGeo>0 && toGeo>fromGeo,'S02 GEO section must exist before original content');
const geo=html.slice(fromGeo,toGeo);
assert.ok(html.includes('href="geo-s02.css"'),'Missing scoped stylesheet');
assert.ok(html.includes('src="geo-s02.js"'),'Missing responsive script');
assert.equal((geo.match(/class="heads-s02-card"/g)||[]).length,6,'3 situations and 3 case cards');
for(const section of ['heads-s02-when','heads-s02-deliverables','heads-s02-projects'])
    assert.ok(geo.includes('id="'+section+'"'),'Missing section '+section);
for(const project of ['kix','kroha-lab','hartens'])
    assert.equal(geo.split('href="https://wellhead.ru/projects/'+project+'/"').length-1,1,'Missing case '+project);
for(const forbidden of ['Фрутанго','Smart Cooking','Кейс не выдается','не приписываем','нельзя использовать'])
    assert.ok(!geo.toLowerCase().includes(forbidden.toLowerCase()),'Public editorial leak '+forbidden);
assert.ok(!/(?:^|[^\p{L}])(?:ты|тебе|тебя|твой|опиши|расскажи|закажи)(?=$|[^\p{L}])/iu.test(geo),
    'Informal address forbidden in Russian site copy');
assert.equal((html.match(/<h1\b/g)||[]).length,1,'One H1');
const markup=html.match(/<script type="application\/ld\+json" class="yoast-schema-graph">([\s\S]*?)<\/script>/);
assert.ok(markup,'Missing schema');
const schema=JSON.parse(markup[1]);
const graph=schema['@graph']||[];
for(const type of ['WebPage','Service','FAQPage','Organization'])
    assert.equal(graph.filter(node=>node['@type']===type).length,1,'JSON-LD duplicate '+type);
assert.match(graph.find(n=>n['@type']==='Service').description,/бренд-платформы/);
console.log('PASS: S02 original page, GEO content, 3 verified cases, responsive JS, schema, forms and resources');
