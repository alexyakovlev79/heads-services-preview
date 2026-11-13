const dialog = document.querySelector('#elementor-popup-modal-14570');
const presentationUrl = 'https://wellhead.ru/wp-content/themes/total-child-theme/presentation/about_HEADS_2026.pdf';
let presentationOpener;

function openPresentation(link) {
    presentationOpener = link;
    if (!dialog.open) dialog.showModal();
}

dialog.querySelector('.dialog-close-button').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
});
dialog.addEventListener('close', () => presentationOpener?.focus());

// Total can build the drawer after startup and prefixes its generated IDs.
function addMobilePresentationLink() {
    for (const menu of document.querySelectorAll('#mobile-menu-alternative ul, .sidr > ul, .sidr-inner > ul')) {
        if (menu.querySelector('[data-preview-presentation-link]')) continue;
        const item = document.createElement('li');
        const link = document.createElement('a');
        item.className = 'menu-item';
        link.href = '#';
        link.textContent = 'Скачать презентацию';
        link.setAttribute('aria-haspopup', 'dialog');
        link.setAttribute('data-preview-presentation-link', '');
        item.append(link);
        menu.append(item);
    }
}
addMobilePresentationLink();
window.addEventListener('load', addMobilePresentationLink);

function toggleFaq(link) {
    const accordion = link.closest('.vc_tta-accordion');
    const open = link.getAttribute('aria-expanded') === 'true';
    for (const panel of accordion.querySelectorAll('.vc_tta-panel')) {
        const trigger = panel.querySelector('[data-vc-accordion]');
        const selected = !open && trigger === link;
        panel.classList.toggle('vc_active', selected);
        trigger.setAttribute('aria-expanded', String(selected));
    }
}

document.addEventListener('click', event => {
    const presentationLink = event.target.closest('#menu-item-14601 a, [data-preview-presentation-link]');
    if (presentationLink) {
        event.preventDefault();
        openPresentation(presentationLink);
        return;
    }
    if (event.target.closest('#mobile-menu .mobile-menu-toggle')) {
        setTimeout(addMobilePresentationLink, 100);
    }
    const faq = event.target.closest('[data-vc-accordion]');
    if (faq) {
        event.preventDefault();
        toggleFaq(faq);
    }
});

document.addEventListener('keydown', event => {
    if (event.key === ' ' && event.target.matches('[data-vc-accordion]')) {
        event.preventDefault();
        event.target.click();
    }
});

function maskPhone(phone) {
    let digits = phone.value.replace(/\D/g, '');
    if (digits.length >= 11 && /^[78]/.test(digits)) digits = digits.slice(1);
    else if (phone.value.startsWith('+7')) digits = digits.slice(1);
    digits = digits.slice(0, 10);
    if (!digits.length) {
        phone.value = '';
        return;
    }
    let formatted = '+7 (' + digits.slice(0, 3);
    if (digits.length >= 3) formatted += ')';
    if (digits.length > 3) formatted += ' ' + digits.slice(3, 6);
    if (digits.length > 6) formatted += '-' + digits.slice(6, 8);
    if (digits.length > 8) formatted += '-' + digits.slice(8, 10);
    phone.value = formatted;
}

for (const form of document.querySelectorAll('[data-preview-form]')) {
    const result = form.querySelector('[data-preview-result]');
    const consent = form.querySelector('[type="checkbox"]');
    const submit = form.querySelector('[type="submit"]');
    const project = form.dataset.previewForm === 'project';
    const phone = form.querySelector('[type="tel"]');
    const attachment = form.querySelector('[type="file"]');

    if (project) {
        const syncConsent = () => { submit.disabled = !consent.checked; };
        consent.addEventListener('change', syncConsent);
        syncConsent();
    }
    if (phone) {
        phone.pattern = '\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}';
        phone.addEventListener('input', () => maskPhone(phone));
    }
    if (attachment) {
        const filename = document.createElement('span');
        filename.className = 'preview-attachment';
        attachment.closest('.wpcf7-form-control-wrap').after(filename);
        attachment.addEventListener('change', () => {
            const file = attachment.files[0];
            filename.textContent = file?.name || '';
            attachment.setCustomValidity(file?.size > 10 * 1024 * 1024 ? 'Максимальный размер файла — 10 МБ.' : '');
            attachment.reportValidity();
        });
    }
    form.addEventListener('input', () => { result.hidden = true; });
    form.addEventListener('submit', event => {
        event.preventDefault();
        result.replaceChildren('Демонстрационный режим. Данные не отправлены.');
        if (!project) {
            const link = document.createElement('a');
            link.href = presentationUrl;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = 'Открыть презентацию (PDF)';
            result.append(' ', link);
        }
        result.hidden = false;
    });
}

const callout = document.createElement('div');
callout.className = 'printTextOuter';
callout.innerHTML = '<a href="https://wellhead.ru/new-customers" class="printTextBlock"><span id="printText"></span></a>';
document.querySelector('#main').prepend(callout);
if (typeof window.Typed === 'function') {
    new window.Typed('#printText', {
        strings: ['Напишите нам!'], typeSpeed: 60, loop: true,
        backDelay: 2500, startDelay: 600, smartBackspace: true
    });
} else {
    document.querySelector('#printText').textContent = 'Напишите нам!';
}
