import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium} from 'playwright-core';

const root=process.env.S04_PREVIEW_BASE||'http://127.0.0.1:8000/';
const url=new URL('dizajn-upakovki/',root).href;
const folder=process.env.S04_GEO_ARTIFACTS||'qa-artifacts/packaging-geo';
const browser=await chromium.launch({
 executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',
 headless:true,args:['--no-sandbox','--disable-dev-shm-usage'],timeout:45000
});
await fs.mkdir(folder,{recursive:true});
const failures=[];
for(const width of [320,390,768,1440]){
 const context=await browser.newContext({viewport:{width,height:950},reducedMotion:'reduce'});
 const page=await context.newPage();
 page.setDefaultTimeout(15000);
 const errors=[],bad=[],mutations=[];
 page.on('pageerror',err=>errors.push(String(err)));
 page.on('response',r=>{if(r.url().startsWith(root)&&r.status()>=400)bad.push(r.status()+' '+r.url());});
 page.on('request',r=>{if(r.frame()===page.mainFrame()&&!['GET','HEAD'].includes(r.method()))mutations.push(r.method()+' '+r.url());});
 try{
  const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
  assert.equal(response.status(),200,width+': page is available');
  await page.locator('#single-blocks').waitFor({state:'visible'});
  for(const block of ['situations','system','deliverables','cases']){
   const section=page.locator('.heads-s04-geo-'+block+':visible');
   assert.equal(await section.count(),1,width+': one visible GEO block '+block);
   assert.equal(await section.locator('h2').count(),1,width+': single headline');
   assert.equal(await section.locator('.heads-s04-geo-card').count(),block==='cases'?5:block==='deliverables'?4:3,width+': card count '+block);
  }
  const cases=page.locator('.heads-s04-geo-cases:visible');
  assert.deepEqual(await cases.locator('.heads-s04-geo-case-link').evaluateAll(links=>links.map(a=>a.href)),[
   'https://wellhead.ru/projects/redizajn-brenda-vernel/',
   'https://wellhead.ru/projects/redizajn-losk/',
   'https://wellhead.ru/projects/libretta/',
   'https://wellhead.ru/projects/jekomilk-2/',
   'https://wellhead.ru/projects/rinonorm/'
  ],width+': case links');
  const cta=cases.locator('.heads-s04-geo-cta a');
  assert.equal(await cta.getAttribute('href'),width<=767?'#discussthetask2':'#discussthetask');
  const fonts=await page.locator('.heads-s04-geo-cases:visible h2').evaluate(el=>({
   size:parseFloat(getComputedStyle(el).fontSize),color:getComputedStyle(el).color
  }));
  assert.ok(fonts.size>=24&&fonts.size<=42,width+': readable H2');
  await page.evaluate(async()=>{
   await document.fonts.ready;
   const images=[...document.images].filter(i=>i.getClientRects().length);
   for(const i of images)i.loading='eager';
   await Promise.allSettled(images.map(i=>i.decode()));
  });
  const layout=await page.evaluate(()=>({
   over:document.documentElement.scrollWidth-innerWidth,
   broken:[...document.images].filter(i=>i.getClientRects().length&&i.naturalWidth===0).map(i=>i.currentSrc),
   originalStages:[...document.querySelectorAll('#single-blocks [data-heads-text-id]')].filter(x=>/^HEADS-S04-00(4[3-9]|5[0-4])$/.test(x.dataset.headsTextId||'')&&x.getClientRects().length).length
  }));
  assert.ok(layout.over<=1,width+': horizontal overflow '+layout.over);
  assert.deepEqual(layout.broken,[],width+': images loaded');
  assert.deepEqual(errors,[],width+': no JavaScript error');
  assert.deepEqual(bad,[],width+': no missing local assets');
  assert.deepEqual(mutations,[],width+': no POST requests');
  if(width===390||width===1440)await page.screenshot({path:folder+'/geo-'+width+'.png',fullPage:true,timeout:45000});
  console.log('PASS S04 GEO browser '+width+'px: four sections, verified case links, responsive media');
 }catch(err){failures.push(width+': '+String(err));console.error('FAIL S04 GEO '+width+': '+err)}
 finally{await context.close();}
}
await browser.close();
assert.deepEqual(failures,[],failures.join('\n'));
