import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium } from 'playwright-core';

const root = process.env.S02_PREVIEW_BASE || 'http://127.0.0.1:8000/';
const url = new URL('strategija-i-pozicionirovanie/', root).href;
const original = 'https://wellhead.ru/services/strategija-i-pozicionirovanie/';
const output = process.env.S02_ARTIFACTS || 'qa-artifacts/strategy';
const browser = await chromium.launch({
    executablePath: process.env.CHROME_BIN || '/usr/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage']
});
await fs.mkdir(output, {recursive:true});

async function screenshots(page, name) {
    await page.evaluate(async () => {
        await document.fonts.ready;
        const images = [...document.images].filter(img => img.getClientRects().length);
        for (const image of images) image.loading = 'eager';
        await Promise.allSettled(images.map(img => img.decode()));
    });
    await page.screenshot({ path: output + '/' + name + '.png', fullPage:true, timeout:25000 });
}

async function checkWidth(width) {
    const context = await browser.newContext({ viewport:{width,height:900}, reducedMotion:'reduce' });
    const page = await context.newPage();
    const mutations = [];
    const errors = [];
    const bad = [];
    page.on('request', req => {
        if (req.frame() === page.mainFrame() && !['GET','HEAD'].includes(req.method())) mutations.push(req.url());
    });
    page.on('response', response => {
        if (response.url().startsWith(root) && response.status() >= 400) bad.push(response.status()+' '+response.url());
    });
    page.on('pageerror', error => errors.push(error.message));
    try {
        assert.equal((await page.goto(url, {waitUntil:'domcontentloaded',timeout:45000})).status(),200);
        await page.locator('#single-blocks').waitFor({state:'visible'});
        const text = (await page.locator('#single-blocks').innerText()).replace(/\s+/g, ' ');
        const headings = [
            'Суть и позиционирование бренда', 'Стратегия продвижения бренда',
            'Этапы разработки стратегии', 'Критерии оценки позиционирования бренда',
            'Стоимость разработки позиционирования', 'Часто задаваемые вопросы'
        ];
        let offset = 0;
        for (const heading of headings) {
            const next = text.toLowerCase().indexOf(heading.toLowerCase(), offset);
            assert.ok(next >= offset, width+': heading missing or reordered: '+heading);
            offset = next + heading.length;
        }
        assert.equal(await page.locator('#single-blocks').count(), 1);
        assert.equal(await page.locator('[data-preview-form="project"]:visible').count(), 1);
        const faq = page.locator('[data-vc-accordion]:visible');
        assert.equal(await faq.count(), 3);
        const question = faq.first();
        await question.click();
        assert.equal(await question.getAttribute('aria-expanded'), 'true');
        assert.ok(await page.locator('.vc_tta-panel.vc_active .vc_tta-panel-body:visible').isVisible());
        await question.press('Space');
        assert.equal(await question.getAttribute('aria-expanded'), 'false');
        assert.equal(await page.locator('.vc_tta-panel.vc_active:visible').count(), 0);
        const cta = page.locator('a[href^="#discussthetask"]:visible');
        assert.equal(await cta.count(), 1);
        await cta.click();
        const form = page.locator('[data-preview-form="project"]:visible');
        const submit = form.locator('[type=submit]');
        assert.ok(await submit.isDisabled());
        const phone = form.locator('[type=tel]');
        await phone.fill('89991234567');
        assert.equal(await phone.inputValue(), '+7 (999) 123-45-67');
        await form.locator('[name=theme]').fill('Проект QA');
        await form.locator('[name=your-name]').fill('Тестовый контакт');
        await form.locator('[name=company]').fill('QA');
        await form.locator('[type=email]').fill('qa@example.com');
        await form.locator('[type=file]').setInputFiles({name:'brief.txt',mimeType:'text/plain',buffer:Buffer.from('test')});
        assert.equal(await form.locator('.preview-attachment').innerText(), 'brief.txt');
        await form.locator('[type=checkbox]').check();
        await submit.click();
        assert.match(await form.locator('[data-preview-result]').innerText(), /Демонстрационный режим/);
        await page.evaluate(() => window.scrollTo(0,0));
        const desktopPresentation = page.locator('#menu-item-14601 a');
        if (await desktopPresentation.isVisible()) {
            await desktopPresentation.click();
        } else {
            const mobileMenu = page.locator('#mobile-menu .mobile-menu-toggle');
            await mobileMenu.click();
            await page.locator('.sidr a[data-preview-presentation-link]:visible').first().click();
        }
        const popup = page.locator('#elementor-popup-modal-14570');
        assert.ok(await popup.isVisible());
        const presentation = popup.locator('[data-preview-form=presentation]');
        await presentation.locator('[type=email]').fill('qa@example.com');
        await presentation.locator('[type=checkbox]').check();
        await presentation.locator('[type=submit]').click();
        assert.equal(await presentation.locator('[data-preview-result] a').getAttribute('href'),
            'https://wellhead.ru/wp-content/themes/total-child-theme/presentation/about_HEADS_2026.pdf');
        await popup.locator('.dialog-close-button').click();
        assert.ok(await popup.isHidden());
        const drawer = page.locator('.sidr-close:visible');
        if (await drawer.count()) await drawer.first().click();
        await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
        await screenshots(page,'preview-'+width);
        const layout = await page.evaluate(() => ({
            overflow: document.documentElement.scrollWidth - window.innerWidth,
            broken: [...document.images].filter(img => img.getClientRects().length && !img.naturalWidth)
                .map(img => img.currentSrc || img.src),
            fonts: [...document.fonts].filter(font => font.status === 'loaded').map(font => font.family)
        }));
        assert.ok(layout.overflow <= 1, width+': horizontal overflow '+layout.overflow);
        assert.deepEqual(layout.broken, [], width+': missing image');
        assert.ok(layout.fonts.some(font => /TT Fors/i.test(font)), width+': TT Fors font not loaded');
        assert.deepEqual(errors, [], width+': JS errors');
        assert.deepEqual(bad, [], width+': HTTP errors');
        assert.deepEqual(mutations, [], width+': preview attempted to submit data');
        console.log('PASS:',width+'px, S02 sections, local media, fonts, FAQ, CTA and both demo forms');
    } finally {
        await context.close();
    }
}

async function captureOriginal(width) {
    const page = await browser.newPage({viewport:{width,height:900}});
    try {
        await page.goto(original,{waitUntil:'domcontentloaded',timeout:35000});
        await page.locator('#single-blocks').waitFor({state:'visible',timeout:15000});
        await screenshots(page,'original-'+width);
    } finally {
        await page.close();
    }
}

try {
    const references = process.env.S02_CAPTURE_ORIGINAL === '1'
        ? Promise.allSettled([390,1440].map(captureOriginal)) : Promise.resolve([]);
    const results = await Promise.allSettled([320,390,768,1440].map(checkWidth));
    for (const result of results) if (result.status === 'rejected') console.error(result.reason);
    const referenceResults = await references;
    for (const result of referenceResults) if (result.status === 'rejected') console.warn('Original screenshot:',result.reason.message);
    assert.ok(results.every(result => result.status === 'fulfilled'), 'S02 browser QA failed');
} finally {
    await browser.close();
}
