import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium } from 'playwright-core';

const root = process.env.S04_PREVIEW_BASE || 'http://127.0.0.1:8000/';
const url = new URL('dizajn-upakovki/', root).href;
const original = 'https://wellhead.ru/services/dizajn-upakovki/';
const output = process.env.S04_ARTIFACTS || 'qa-artifacts/packaging';
const browser = await chromium.launch({
    timeout: 30000,
    executablePath: process.env.CHROME_BIN || '/usr/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage']
});
await fs.mkdir(output, {recursive:true});

async function loadVisibleMedia(page) {
    await page.evaluate(() => {
        for (const image of document.images) image.loading = 'eager';
    });
    await page.waitForFunction(() =>
        document.fonts.status === 'loaded' &&
        [...document.images].every(image => image.getBoundingClientRect().width === 0 ||
            (image.complete && image.naturalWidth > 0)),
        undefined, {timeout:25000}
    );
}

async function screenshots(page, name) {
    await page.screenshot({ path: output + '/' + name + '.png', fullPage:true, timeout:25000 });
}

async function checkWidth(width) {
    const context = await browser.newContext({ viewport:{width,height:900}, reducedMotion:'reduce' });
    const page = await context.newPage();
    page.setDefaultTimeout(12000);
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
        const typography = await page.locator('#single-blocks [data-wpex-rcss]:visible').evaluateAll(elements =>
            elements.map(element => {
                const sizes = JSON.parse(element.dataset.wpexRcss)['font-size'];
                const size = [[479, 'pp'], [767, 'pl'], [959, 'tp'], [1024, 'tl']]
                    .find(([limit, key]) => window.innerWidth <= limit && sizes[key]);
                return [getComputedStyle(element).fontSize, size ? sizes[size[1]] : sizes.d];
            })
        );
        assert.ok(typography.length > 0);
        for (const [actual, expected] of typography) assert.equal(actual, expected, width + ': original font size');
        const text = (await page.locator('#single-blocks').innerText()).replace(/\s+/g, ' ');
        const headings = [
            'Разработка дизайна упаковки и этикетки',
            'Зачем это нужно для вашего бренда:', 'Ключевые преимущества:',
            'Что такое дизайн упаковки', 'Критерии эффективного дизайна упаковки товара',
            'Этапы разработки дизайна упаковки', 'Стоимость разработки дизайна упаковки',
            'Часто задаваемые вопросы'
        ];
        const stages = await page.locator('#single-blocks .vcex-heading:visible').allTextContents();
        assert.deepEqual(stages.filter(text => /^\s*[1-6]\./.test(text)).map(text => Number(text.trim()[0])),
            [1, 2, 3, 4, 5, 6], width + ': six stages in original order');
        let offset = 0;
        for (const heading of headings) {
            const next = text.toLowerCase().indexOf(heading.toLowerCase(), offset);
            assert.ok(next >= offset, width+': heading missing or reordered: '+heading);
            offset = next + heading.length;
        }
        assert.equal(await page.locator('#single-blocks').count(), 1);
        await loadVisibleMedia(page);
        const visibleAnimations = await page.locator('#single-blocks img[src$=".gif"]').evaluateAll(images =>
            images.filter(image => image.getBoundingClientRect().width > 0 && image.naturalWidth > 0)
                .map(image => new URL(image.src).pathname)
        );
        assert.equal(visibleAnimations.length, width < 768 ? 4 : 3,
            width + ': original visible GIFs: ' + visibleAnimations.join(', '));
        assert.equal(visibleAnimations.some(src => /-package_design_01\.gif$/.test(src)), width < 768,
            width + ': original mobile hero animation');
        const desktopHero = page.locator('#completed-works img[src$="-gif_package_design_01.gif"]');
        assert.equal(await desktopHero.count(), 1);
        assert.ok(await desktopHero.isHidden(), width + ': original hidden desktop hero column');
        assert.equal(await page.locator('[data-preview-form="project"]:visible').count(), 1);
        await screenshots(page,'preview-'+width);
        const faq = page.locator('[data-vc-accordion]:visible');
        assert.equal(await faq.count(), 5);
        for (const question of await faq.all()) {
            await question.click();
            assert.equal(await question.getAttribute('aria-expanded'), 'true');
            const answer = page.locator('.vc_tta-panel.vc_active .vc_tta-panel-body:visible');
            assert.ok(await answer.isVisible());
            assert.ok((await answer.innerText()).trim());
            await question.press('Space');
            assert.equal(await question.getAttribute('aria-expanded'), 'false');
            assert.equal(await page.locator('.vc_tta-panel.vc_active:visible').count(), 0);
        }
        const cta = page.locator('a[href^="#discussthetask"]:visible');
        assert.equal(await cta.count(), 1);
        assert.equal(await page.getByRole('link', {name:'ЦЕНЫ', exact:true}).filter({visible:true}).last().getAttribute('href'),
            'https://wellhead.ru/prices/');
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
        const fileStyle = await form.locator('[type=file]').evaluate(input => ({
            opacity: getComputedStyle(input).opacity,
            position: getComputedStyle(input).position,
            caption: getComputedStyle(input.parentElement, '::before').content
        }));
        assert.equal(fileStyle.opacity, '0', width + ': original file control');
        assert.equal(fileStyle.position, 'absolute');
        assert.match(fileStyle.caption, /Прикрепить бриф/);
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
        await loadVisibleMedia(page);
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
        console.log('PASS:',width+'px, S04 sections, local media, fonts, FAQ, CTA and both demo forms');
    } finally {
        await context.close();
    }
}

async function captureOriginal(width) {
    const page = await browser.newPage({viewport:{width,height:900}});
    try {
        await page.goto(original,{waitUntil:'domcontentloaded',timeout:35000});
        await page.locator('#single-blocks').waitFor({state:'visible',timeout:15000});
        const necessary = page.getByRole('button', {name:'Только необходимые', exact:true});
        if (await necessary.isVisible()) await necessary.click({timeout:5000}).catch(() => {});
        await loadVisibleMedia(page).catch(() => {});
        await screenshots(page,'original-'+width);
    } finally {
        await page.close();
    }
}

try {
    const widths = [320,390,768,1440];
    const results = [];
    for (const width of widths) {
        const [result] = await Promise.allSettled([checkWidth(width)]);
        results.push(result);
        if (result.status === 'rejected') console.error(width + 'px:', result.reason);
    }
    if (process.env.S04_CAPTURE_ORIGINAL === '1') {
        for (const width of widths) {
            await captureOriginal(width).catch(error => console.warn('Original screenshot:', error.message));
        }
    }
    assert.ok(results.every(result => result.status === 'fulfilled'), 'S04 browser QA failed');
} finally {
    await browser.close();
}
