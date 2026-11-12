#!/usr/bin/env node
// Real Chrome/Chromium interactions for the preserved Heads services preview.
import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_BIN || '/usr/bin/google-chrome',
  args: ['--no-sandbox', '--disable-dev-shm-usage']
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const posts = [];
const jsErrors = [];
page.on('request', (req) => { if (req.method() === 'POST') posts.push(req.url()); });
page.on('pageerror', (err) => jsErrors.push(err.message));

try {
  await page.goto('http://127.0.0.1:8000/', { waitUntil: 'load', timeout: 45000 });
  assert.equal(await page.locator('.service__category').count(), 4);
  console.log('PASS: 4 service categories');

  await page.locator('.service__category[data-service="style"]').click();
  assert.equal(await page.locator('.service__category[data-service="style"]').evaluate(e => e.classList.contains('expanded')), true);
  assert.equal(await page.locator('.service__details--style').evaluate(e => e.classList.contains('expanded')), true);
  console.log('PASS: service category switcher');

  await page.locator('#menu-item-14601 a').click();
  const modal = page.locator('#elementor-popup-modal-14570');
  assert.equal(await modal.evaluate(e => e.open), true);
  await modal.locator('.dialog-close-button').click();
  assert.equal(await modal.evaluate(e => e.open), false);
  console.log('PASS: presentation popup open and close');

  await page.locator('#menu-item-14601 a').click();
  const presentationForm = page.locator('[data-preview-form="presentation"]');
  await presentationForm.locator('input[type="email"]').fill('qa@example.com');
  await presentationForm.locator('input[type="checkbox"]').check();
  await presentationForm.locator('button[type="submit"]').click();
  const pdf = presentationForm.getByText('Открыть презентацию (PDF)');
  assert.equal(await pdf.isVisible(), true);
  assert.match(await pdf.getAttribute('href'), /about_HEADS_2026\.pdf$/);
  await modal.locator('.dialog-close-button').click();
  console.log('PASS: presentation demo form and PDF link');

  const form = page.locator('[data-preview-form="project"]');
  assert.equal(await form.locator('input[type="submit"]').isDisabled(), true);
  await form.locator('input[name="theme"]').fill('Тест копии Heads');
  await form.locator('input[name="your-name"]').fill('Тест Тестов');
  await form.locator('input[name="company"]').fill('Тестовая организация');
  await form.locator('input[name="tel"]').fill('+7 (999) 123-45-67');
  await form.locator('input[name="email"]').fill('qa@example.com');
  assert.match(await form.locator('input[name="tel"]').inputValue(), /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/);
  const attachment = form.locator('input[type="file"]');
  await attachment.setInputFiles({
    name: 'large.jpg',
    mimeType: 'image/jpeg',
    buffer: Buffer.alloc(10 * 1024 * 1024 + 1)
  });
  assert.equal(await attachment.evaluate(e => e.checkValidity()), false);
  await attachment.setInputFiles([]);
  await form.locator('input[type="checkbox"]').check();
  assert.equal(await form.locator('input[type="submit"]').isEnabled(), true);
  await form.locator('input[type="submit"]').click();
  assert.match(await form.locator('[data-preview-result]').innerText(), /Данные не отправлены/);
  assert.deepEqual(posts, []);
  console.log('PASS: phone mask, file-size limit, consent and demo submit without network POST');

  await page.setViewportSize({ width: 390, height: 900 });
  await page.reload({ waitUntil: 'load' });
  const width = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth
  }));
  assert.ok(width.scrollWidth <= width.viewport + 1, 'Mobile horizontal overflow: ' + JSON.stringify(width));
  const presentLocations = await page.evaluate(() =>
    [...document.querySelectorAll('.preview-presentation-mobile-link')]
      .map(e => e.closest('[id]')?.id || e.parentElement?.className));
  console.log('Mobile presentation link locations before drawer:', JSON.stringify(presentLocations));
  console.log('PASS: mobile width 390px');

  await page.locator('#mobile-menu .mobile-menu-toggle').click();
  await page.waitForTimeout(600);
  const mobileState = await page.evaluate(() => ({
    expanded: document.querySelector('#mobile-menu .mobile-menu-toggle')?.getAttribute('aria-expanded'),
    sidrs: [...document.querySelectorAll('.sidr')].map(e => ({
      id: e.id, visible: !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length),
      hasMenu: e.textContent.includes('Агентство')
    }))
  }));
  const openDrawer = mobileState.expanded === 'true' ||
    mobileState.sidrs.some(s => s.visible && s.hasMenu);
  assert.ok(openDrawer, 'Mobile menu did not open: ' + JSON.stringify(mobileState));
  const mobilePresentationLinks = await page.locator('.preview-presentation-mobile-link').count();
  assert.ok(mobilePresentationLinks >= 1, 'Mobile presentation link missing from DOM');
  console.log('PASS: mobile drawer opens with presentation link', JSON.stringify(mobileState));

  console.log('Page JavaScript errors:', JSON.stringify(jsErrors.slice(0, 10)));
  console.log('PASS: all browser interactions');
} finally {
  await browser.close();
}
