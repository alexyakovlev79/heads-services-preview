/* Move one server-rendered GEO block beside the corresponding section of the
   original page. WordPress has different desktop/mobile markup; do not clone
   commercial content into two copies of the HTML. */
(() => {
  'use strict';
  const content = document.getElementById('heads-s02-geo');
  const desktopSlot = document.getElementById('heads-s02-geo-desktop-slot');
  const mobileRow = document.querySelector('.vc_row.visible-phone');
  if (!content || !desktopSlot || !mobileRow) return;

  const mobileHeading = [...mobileRow.querySelectorAll('.vcex-heading-inner')]
    .find(node => node.textContent.trim() === 'Суть и позиционирование бренда');
  const mobileTarget = mobileHeading?.closest('.vcex-module');
  const cta = content.querySelector('[data-heads-s02-cta]');
  let lastMode = null;

  function place() {
    const mobile = window.getComputedStyle(mobileRow).display !== 'none';
    if (mobile !== lastMode) {
      if (mobile && mobileTarget) mobileTarget.before(content);
      else desktopSlot.after(content);
      lastMode = mobile;
    }
    if (cta) cta.setAttribute('href', mobile ? '#discussthetask2' : '#discussthetask');
  }

  place();
  window.addEventListener('resize', place, {passive: true});
  window.addEventListener('orientationchange', place, {passive: true});
})();
