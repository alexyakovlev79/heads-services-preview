import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const html=readFileSync('dizajn-upakovki/index.html','utf8');
const style=readFileSync('dizajn-upakovki/geo-s04.css','utf8');
const map=JSON.parse(readFileSync('docs/s04-packaging/text-fields.json','utf8'));
const ids=new Map();
for(const m of html.matchAll(/data-heads-text-id="(HEADS-S04-[\w-]+)"/g))ids.set(m[1],(ids.get(m[1])||0)+1);
assert.equal(map.fields.length,173,'106 original fields + 67 GEO fields');
assert.equal(ids.size,173,'every text ID is mapped exactly once');
assert.equal(new Set(map.fields.map(f=>f.id)).size,173);
for(const f of map.fields){
 assert.equal(ids.get(f.id),f.targets,'HTML target count: '+f.id);
 assert.ok(f.current,'nonempty text: '+f.id);
 assert.ok(f.selector.includes(f.id),'stable selector for '+f.id);
}
const added=map.fields.filter(f=>f.kind==='geo');
assert.equal(added.length,67);
for(let i=103;i<=169;i++)assert.ok(added.some(f=>f.id==='HEADS-S04-'+String(i).padStart(4,'0')));
for(const block of ['situations','system','deliverables','cases']){
 for(const view of ['desktop','mobile']){
  const marker='heads-s04-geo-'+view+' heads-s04-geo-'+block;
  assert.equal(html.split(marker).length-1,1,'one '+block+' block in '+view);
 }
}
assert.equal((html.match(/<h1\b/gi)||[]).length,1,'original H1 still unique');
assert.match(html,/<link rel="stylesheet" href="geo-s04\.css\?v=1">/);
assert.ok(style.includes('.heads-s04-geo-mobile.visible-phone{display:block!important}'));
assert.ok(style.includes('.heads-s04-geo-desktop.hidden-phone{display:none!important}'));
const proofUrls=[
 'https://wellhead.ru/projects/redizajn-brenda-vernel/',
 'https://wellhead.ru/projects/redizajn-losk/',
 'https://wellhead.ru/projects/libretta/',
 'https://wellhead.ru/projects/jekomilk-2/',
 'https://wellhead.ru/projects/rinonorm/'
];
for(const u of proofUrls)assert.equal(html.split('href="'+u+'"').length-1,2,'case linked in both views: '+u);
for(const u of [
 'https://wellhead.ru/category/dairy/',
 'https://wellhead.ru/category/chemicals/',
 'https://wellhead.ru/category/beauty/',
 'https://wellhead.ru/category/pharmaceutics/'
])assert.equal(html.split('href="'+u+'"').length-1,2,'sector archive linked in both views: '+u);
const s=html.match(/<script type="application\/ld\+json" class="yoast-schema-graph">([\s\S]*?)<\/script>/);
assert.ok(s,'structured data present');
const json=JSON.parse(s[1]);
const graph=json['@graph'];
assert.equal(graph.filter(x=>x['@type']==='Organization').length,1);
assert.equal(graph.filter(x=>x['@type']==='FAQPage').length,1);
assert.equal(graph.find(x=>x['@type']==='FAQPage').mainEntity.length,5,'original 5 FAQ intact');
assert.equal(graph.find(x=>x['@type']==='WebPage').name,map.fields.find(f=>f.id==='HEADS-S04-SEO-01').current);
assert.equal(graph.find(x=>x['@type']==='WebPage').description,map.fields.find(f=>f.id==='HEADS-S04-SEO-02').current);
assert.match(graph.find(x=>x['@type']==='Service').description,/SKU/);
for(const id of ['0008','0009','0010','0012','0013','0014','0015','0016','0042','0056','0057']){
 const f=map.fields.find(v=>v.id==='HEADS-S04-'+id);
 assert.ok(html.includes(f.current),'rewritten old text in HTML: '+id);
}
const cases=html.match(/<section class="heads-s04-geo heads-s04-geo-desktop heads-s04-geo-cases[\s\S]*?<\/section>/);
assert.ok(cases,'visible case section');
for(const banned of ['Фрутанго','Ringle','Брест-Литовск','Smart Cooking'])assert.ok(!cases[0].includes(banned),'excluded case: '+banned);
assert.match(html,/name="robots" content="noindex, nofollow, noarchive"/);
assert.match(html,/href="https:\/\/wellhead\.ru\/services\/dizajn-upakovki\/"/);
console.log('PASS S04 GEO: 173 text fields, 67 added, 4 blocks x 2 viewports, 5 cases, 5 FAQ, schema and noindex');
