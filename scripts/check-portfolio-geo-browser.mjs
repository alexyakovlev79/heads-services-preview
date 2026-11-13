import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium} from 'playwright-core';

const root=process.env.S03_PREVIEW_BASE||'http://127.0.0.1:8000/';
const url=new URL('formirovanie-portfelja-brendov/',root).href;
const folder=process.env.S03_GEO_ARTIFACTS||'qa-artifacts/portfolio-geo';
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage'],timeout:45000});
await fs.mkdir(folder,{recursive:true});
let failures=[];
for(const width of [320,390,768,1440]){
 const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
 const page=await context.newPage();
 const errors=[],failed=[];
 page.on('pageerror',e=>errors.push(String(e)));
 page.on('response',r=>{if(r.url().startsWith(root)&&r.status()>=400)failed.push(r.status()+' '+r.url())});
 try{
  const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
  assert.equal(response.status(),200,width+': public HTML status');
  await page.locator('#single-blocks').waitFor({state:'visible'});
  const items=['needs','deliverables','choices','cases'];
  for(const name of items){
   const section=page.locator('.heads-s03-geo-'+name+':visible');
   assert.equal(await section.count(),1,width+': exactly one visible GEO '+name);
   assert.equal(await section.locator('h2').count(),1,width+': section H2 '+name);
   assert.equal(await section.locator('.heads-s03-geo-card').count(),3,width+': three cards '+name);
  }
  const order=await page.evaluate(()=>{
   const roots=['needs','deliverables','choices','cases'].map(name=>
    [...document.querySelectorAll('.heads-s03-geo-'+name)].find(x=>getComputedStyle(x).display!=='none'));
   const anchors=['0010','0022','0040','0053'].map(key=>
    [...document.querySelectorAll('[data-heads-text-id="HEADS-S03-'+key+'"]')].find(x=>getComputedStyle(x).display!=='none'||x.closest('.visible-phone,.hidden-phone')&&!x.hidden));
   return roots.map((x,i)=>!!x&&!!anchors[i]&&(x.compareDocumentPosition(anchors[i])&Node.DOCUMENT_POSITION_FOLLOWING)!==0);
  });
  if(width>=768)assert.deepEqual(order,[true,true,true,true],width+': GEO blocks before following original section');
  const cards=page.locator('.heads-s03-geo-cases:visible');
  const links=await cards.locator('.heads-s03-geo-case-link').evaluateAll(as=>as.map(a=>a.href));
  assert.deepEqual(links,[
   'https://wellhead.ru/projects/kix/',
   'https://wellhead.ru/projects/pet-pride/',
   'https://wellhead.ru/projects/hartens/'
  ],width+': verified case links');
  const cta=cards.locator('.heads-s03-geo-cta a');
  assert.equal(await cta.getAttribute('href'),width<=767?'#discussthetask2':'#discussthetask');
  const styling=await page.locator('.heads-s03-geo-cases:visible h2').evaluate(el=>({
   size:parseFloat(getComputedStyle(el).fontSize),color:getComputedStyle(el).color
  }));
  assert.ok(styling.size>=24&&styling.size<=40,width+': typography on new H2 '+JSON.stringify(styling));
  await page.evaluate(async()=>{
    await document.fonts.ready;
    const images=[...document.images].filter(i=>i.getClientRects().length);
    for(const img of images)img.loading='eager';
    await Promise.allSettled(images.map(img=>img.decode()));
  });
  const layout=await page.evaluate(()=>({
   overflow:document.documentElement.scrollWidth-innerWidth,
   broken:[...document.images].filter(i=>i.getClientRects().length&&i.naturalWidth===0).map(i=>i.currentSrc),
   faq:document.querySelectorAll('.vc_tta-container').length
  }));
  assert.ok(layout.overflow<=1,width+': horizontal overflow '+layout.overflow);
  assert.deepEqual(layout.broken,[],width+': loaded images');
  assert.deepEqual(errors,[],width+': JS errors');
  assert.deepEqual(failed,[],width+': asset HTTP errors');
  if(width===390||width===1440)await page.screenshot({path:folder+'/geo-'+width+'.png',fullPage:true,timeout:45000});
  console.log('PASS S03 GEO browser '+width+' px, 4 sections, 3 case links, 0 image/JS errors');
 }catch(error){failures.push(width+': '+String(error));console.error('FAIL '+width+': '+String(error))}
 finally{await context.close()}
}
await browser.close();
assert.deepEqual(failures,[],failures.join('\n'));
