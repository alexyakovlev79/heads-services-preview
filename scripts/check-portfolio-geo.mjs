import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const html=readFileSync('formirovanie-portfelja-brendov/index.html','utf8');
const css=readFileSync('formirovanie-portfelja-brendov/geo-s03.css','utf8');
const map=JSON.parse(readFileSync('docs/s03-portfolio/text-fields.json','utf8'));
const textIds=new Map();
for(const m of html.matchAll(/data-heads-text-id="(HEADS-S03-[\w-]+)"/g)){
  textIds.set(m[1],(textIds.get(m[1])||0)+1);
}
assert.equal(map.fields.length,144,'all 97 legacy and 47 new text fields are mapped');
assert.equal(textIds.size,144,'no duplicate IDs in the field map');
for(const field of map.fields) {
  assert.equal(textIds.get(field.id),field.targets,'HTML field target count: '+field.id);
  assert.ok(field.current,'nonempty text field: '+field.id);
}
const geoFields=map.fields.filter(f=>f.kind==='geo');
assert.equal(geoFields.length,47);
for(let i=94;i<=140;i++)assert.ok(geoFields.some(f=>f.id==='HEADS-S03-'+String(i).padStart(4,'0')));
const blocks=['needs','deliverables','choices','cases'];
for(const name of blocks){
  for(const version of ['desktop','mobile']){
    const marker='heads-s03-geo-'+version+' heads-s03-geo-'+name;
    assert.equal(html.split(marker).length-1,1,'one '+name+' section in '+version);
  }
}
assert.equal((html.match(/<h1\b/g)||[]).length,1,'one real H1');
assert.match(html,/<link rel="stylesheet" href="geo-s03\.css\?v=1">/);
assert.match(css,/heads-s03-geo-desktop\{display:none!important\}/);
assert.match(css,/heads-s03-geo-mobile\{display:block!important\}/);
const caseLinks=['https://wellhead.ru/projects/kix/','https://wellhead.ru/projects/pet-pride/','https://wellhead.ru/projects/hartens/'];
for(const link of caseLinks)assert.equal(html.split('href="'+link+'"').length-1,2,'case href in both variants');
for(const id of ['HEADS-S03-0008','HEADS-S03-0009','HEADS-S03-0012','HEADS-S03-0054']){
 const f=map.fields.find(f=>f.id===id);
 assert.ok(html.includes(f.current),'updated original text present: '+id);
}
const schemaString=(html.match(/<script type="application\/ld\+json" class="yoast-schema-graph">([\s\S]*?)<\/script>/)||[])[1];
assert.ok(schemaString,'original schema graph exists');
const schema=JSON.parse(schemaString);
const web=schema['@graph'].find(x=>x['@type']==='WebPage');
const service=schema['@graph'].find(x=>x['@type']==='Service');
assert.equal(web.name,map.fields.find(f=>f.id==='HEADS-S03-SEO-01').current);
assert.equal(web.description,map.fields.find(f=>f.id==='HEADS-S03-SEO-02').current);
assert.match(service.description,/суббрендов/);
assert.equal(schema['@graph'].filter(x=>x['@type']==='Organization').length,1);
assert.equal(schema['@graph'].filter(x=>x['@type']==='FAQPage').length,1);
assert.equal(schema['@graph'].find(x=>x['@type']==='FAQPage').mainEntity.length,3);
assert.match(html,/<meta name="robots" content="noindex, nofollow, noarchive">/);
for(const banned of ['Фрутанго','Smart Cooking','Крыница','Брест-Литовск']){
  for(const m of html.matchAll(/<section class="heads-s03-geo [\s\S]*?<\/section>/g))assert.ok(!m[0].includes(banned),'unapproved case in added content: '+banned);
}
console.log('PASS S03 GEO: 144 fields, 47 new, 4 sections x 2 views, 3 verified cases, schema and original FAQ');
