#!/usr/bin/env node
// GEO/AEO regression checks: facts, semantic structure, canonical schema, links.
import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const banned=['Фрутанго','Smart Cooking','Блиночкин','Крынiца','Крыница','Ringle','Рингл'];
const start=html.indexOf('id="heads-geo-overview"');
const finish=html.indexOf('<form method="post" class="wpcf7-form init"',start);
assert.ok(start>0 && finish>start,'GEO sections must precede the project form');
const geo=html.slice(start,finish);
for(const word of banned)assert.ok(!geo.toLowerCase().includes(word.toLowerCase()),'Excluded project in GEO block: '+word);

 
// Mandatory publication rules: the client-facing site addresses visitors with
// the respectful Russian "вы". Internal editing instructions belong in docs,
// never in visible page copy, FAQ answers or promotional case descriptions.
const visible=html.slice(html.indexOf('<body'),html.indexOf('</body>'))
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ')
  .replace(/<!--[\s\S]*?-->/g,' ')
  .replace(/<[^>]+>/g,' ')
  .replace(/\s+/g,' ');
const informal=[
  'ты','тебе','тебя','тобой','твой','твоя','твое','твои','твоего','твою','твоих',
  'опиши','расскажи','сделай','напиши','посмотри','нажми','выбери','запусти',
  'переходи','закажи','узнай','скачай','заполни','запускаешь','обновляешь'
];
for(const word of informal){
  const re=new RegExp('(^|[^\\p{L}])'+word+'(?=$|[^\\p{L}])','iu');
  assert.ok(!re.test(visible),'Informal visitor address is forbidden: '+word);
}
const leaks=[
  /кейс не выдается/iu,
  /не приписываем/iu,
  /по согласованию с заказчиком не упоминать/iu,
  /не включаем кейс/iu,
  /внутренние договоренности/iu,
  /запрещено публиковать/iu
];
for(const re of leaks)assert.ok(!re.test(visible),'Internal editorial note appeared on client page: '+re);
assert.ok(geo.includes('Heads · Москва, Россия'), 'Public branding must use Heads only');
assert.ok(geo.includes('Давайте обсудим задачу?'), 'Public contact heading changed');
assert.ok(geo.includes('Расскажите, что запускаете или обновляете'), 'Formal CTA address expected');
assert.ok(geo.includes('Опишите задачу, продуктовые категории'), 'Formal FAQ address expected');
assert.ok(geo.includes('Наш бесценный опыт'), 'Cases eyebrow changed');
const cardContents=[...geo.matchAll(/<article class="heads-geo-case">([\s\S]*?)<\/article>/g)].map(x=>x[1]);
assert.equal(cardContents.length,4,'Expected 4 proof case cards');
for(const [i,card] of cardContents.entries()){
  assert.ok(/(^|[^\p{L}])мы(?=$|[^\p{L}])/iu.test(card),'Case '+(i+1)+' must use the agency voice');
}

assert.equal((html.match(/<h1\b/g)||[]).length,1,'Only one H1');
assert.equal((geo.match(/class="heads-geo-step-no"/g)||[]).length,5,'Five full-cycle stages');
assert.equal((geo.match(/class="heads-geo-card-tag"/g)||[]).length,7,'Three scenarios and four cases');
assert.equal((geo.match(/class="heads-geo-case"/g)||[]).length,4,'Four proof cases');
assert.equal((geo.match(/<details><summary\\b[^>]*>/g)||[]).length,7,'Seven FAQs');
assert.ok(geo.includes('href="#new-clients"'),'Preserve CTA to contact form');
assert.ok(geo.includes('href="https://wellhead.ru/prices/"'),'Link to active pricing');
assert.ok(html.includes('href="geo-enhancements.css"'),'Scoped GEO stylesheet present');

const cases=[
 'https://wellhead.ru/projects/kix/',
 'https://wellhead.ru/projects/pet-pride/',
 'https://wellhead.ru/projects/hartens/',
 'https://wellhead.ru/projects/redizajn-brenda-vernel/'
];
for(const url of cases)assert.equal(geo.split('href="'+url+'"').length-1,1,'One exact case link for '+url);
const expectedServices=[
 'https://wellhead.ru/services/analiz-rynka/',
 'https://wellhead.ru/services/strategija-i-pozicionirovanie/',
 'https://wellhead.ru/services/nazvanie-brenda/',
 'https://wellhead.ru/services/dizajn-upakovki/',
 'https://wellhead.ru/services/kommunikacionnaja-strategija/',
 'https://wellhead.ru/services/formirovanie-portfelja-brendov/',
 'https://wellhead.ru/services/podgotovka-k-pechati/'
];
for(const url of expectedServices)assert.ok(geo.includes('href="'+url+'"'),'Missing relevant service link '+url);

const schemaStr=html.match(/<script type="application\/ld\+json" class="yoast-schema-graph">([\s\S]*?)<\/script>/)?.[1];
assert.ok(schemaStr,'Yoast schema must remain');
const graph=JSON.parse(schemaStr)['@graph'];
const only=(type)=>graph.filter(x=>(Array.isArray(x['@type'])?x['@type'].includes(type):x['@type']===type));
assert.equal(only('WebPage').length,1,'One WebPage');
assert.equal(only('Organization').length,1,'One Organization');
assert.equal(only('OfferCatalog').length,1,'One OfferCatalog');
assert.equal(only('Service').length,1,'One Service');
assert.equal(only('FAQPage').length,1,'One FAQPage');
assert.equal(only('FAQPage')[0].mainEntity.length,7,'Seven structured FAQs');
assert.equal(only('OfferCatalog')[0].itemListElement.length,4,'Four service categories in catalog');
assert.equal(only('Service')[0].provider['@id'],'https://wellhead.ru/#organization','Service connected to Heads');
for(const q of only('FAQPage')[0].mainEntity){
 assert.equal(q['@type'],'Question');
 assert.ok([...geo.matchAll(/<summary\\b[^>]*>([\\s\\S]*?)<\\/summary>/g)].some(m=>m[1]===q.name),'Structured question absent in HTML: '+q.name);
 assert.ok([...geo.matchAll(/<div class="heads-geo-answer"><p\\b[^>]*>([\\s\\S]*?)<\\/p>/g)].some(m=>m[1]===q.acceptedAnswer.text),'Structured answer absent in HTML: '+q.name);
}
const title=html.match(/<title>([^<]*)<\/title>/)?.[1]||'';
const desc=html.match(/<meta name="description" content="([^"]*)">/)?.[1]||'';
assert.ok(title.length>=35 && title.length<=75,'Search title length: '+title.length);
assert.ok(desc.length>=110 && desc.length<=180,'Description length: '+desc.length);
assert.ok(html.includes('<meta name="robots" content="noindex, nofollow, noarchive">'),'Preview must be noindex');
assert.equal((html.match(/data-preview-form="/g)||[]).length,2,'Original demo forms unchanged');

const boundIds=[...html.matchAll(/data-heads-text-id="(HEADS-S01-\\d{4})"/g)].map(x=>x[1]);
assert.equal(boundIds.length,161,'Expected 161 stable editorial field IDs');
assert.equal(new Set(boundIds).size,boundIds.length,'Duplicate editable ID');
console.log('PASS GEO/AEO: 1 H1, 5 stages, 3 scenarios, 4 verified cases, 7 FAQs, structured Service/FAQ/catalog, internal links and CTA.');
console.log('META lengths:',JSON.stringify({title:title.length,description:desc.length}));
