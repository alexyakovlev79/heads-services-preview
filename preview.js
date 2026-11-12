/* Standalone behavior for the public Heads template. Forms have no network backend. */
const presentation = document.querySelector('#elementor-popup-modal-14570');
const presentationUrl = 'https://wellhead.ru/wp-content/themes/total-child-theme/presentation/about_HEADS_2026.pdf';
let presentationOpener = null;

function openPresentation(event) {
    event.preventDefault();
    presentationOpener = event.currentTarget;
    if (presentation && typeof presentation.showModal === 'function') {
        if (!presentation.open) presentation.showModal();
    } else {
        window.open(presentationUrl, '_blank', 'noopener');
    }
}

document.querySelector('#menu-item-14601 a')?.addEventListener('click', openPresentation);

// The original mobile menu omits the presentation link.
// Add it only to the mobile drawer, without changing the desktop layout.
const mobileMenu = document.querySelector('#mobile-menu-alternative ul.dropdown-menu');
if (mobileMenu && !mobileMenu.querySelector('.preview-presentation-mobile-link')) {
    const item = document.createElement('li');
    item.className = 'menu-item preview-presentation-mobile-link';
    const link = document.createElement('a');
    link.href = '#';
    link.textContent = 'Скачать презентацию';
    item.append(link);
    mobileMenu.append(item);
}

// Sidr may consume the hidden source menu and build a separate live drawer.
// Ensure the link exists in whatever mobile menu is actually displayed.
function ensureMobilePresentationLink() {
    const menus = document.querySelectorAll(
        '#mobile-menu-alternative ul.dropdown-menu, .sidr ul.dropdown-menu, .sidr ul'
    );
    const seen = new Set();
    for (const menu of menus) {
        if (seen.has(menu)) continue;
        seen.add(menu);
        if (menu.querySelector('.preview-presentation-mobile-link')) continue;
        const item = document.createElement('li');
        item.className = 'menu-item preview-presentation-mobile-link';
        const link = document.createElement('a');
        link.href = '#';
        link.setAttribute('aria-haspopup', 'dialog');
        link.textContent = 'Скачать презентацию';
        item.append(link);
        menu.append(item);
    }
}
ensureMobilePresentationLink();
window.addEventListener('load', ensureMobilePresentationLink);

// Delegate events to cover both the source menu and Sidr's rebuilt drawer.
document.addEventListener('click', (event) => {
    const link = event.target.closest?.('.preview-presentation-mobile-link a');
    if (link) {
        openPresentation({ preventDefault: () => event.preventDefault(), currentTarget: link });
        return;
    }
    if (event.target.closest?.('#mobile-menu .mobile-menu-toggle')) {
        setTimeout(ensureMobilePresentationLink, 20);
        setTimeout(ensureMobilePresentationLink, 250);
    }
});

if (presentation) {
    presentation.querySelector('.dialog-close-button')?.addEventListener('click', () => presentation.close());
    presentation.addEventListener('click', (event) => {
        if (event.target === presentation) presentation.close();
    });
    presentation.addEventListener('close', () => presentationOpener?.focus());
}

for (const form of document.querySelectorAll('[data-preview-form]')) {
    const result = form.querySelector('[data-preview-result]');
    form.addEventListener('input', () => {
        result.hidden = true;
        form.classList.remove('sent');
    });
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        result.replaceChildren('Демонстрационный режим. Данные не отправлены.');
        if (form.dataset.previewForm === 'presentation') {
            const link = document.createElement('a');
            link.href = presentationUrl;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = 'Открыть презентацию (PDF)';
            result.append(' ', link);
        } else {
            form.classList.add('sent');
        }
        result.hidden = false;
    });
}

const projectForm = document.querySelector('[data-preview-form="project"]');
const phone = projectForm.querySelector('[type="tel"]');
if (window.jQuery && typeof jQuery.fn.mask === 'function') {
    jQuery(phone).mask('+7 (000) 000-00-00', {clearIfNotMatch: true});
} else {
    // Native fallback: the demo form must work even if the mask plugin fails to load.
    phone.addEventListener('input', () => {
        let digits = phone.value.replace(/\D/g, '');
        if (digits.startsWith('8')) digits = '7' + digits.slice(1);
        if (!digits.startsWith('7')) digits = '7' + digits;
        digits = digits.slice(0, 11);
        const local = digits.slice(1);
        let formatted = '+7';
        if (local.length) formatted += ' (' + local.slice(0, 3);
        if (local.length >= 3) formatted += ')';
        if (local.length > 3) formatted += ' ' + local.slice(3, 6);
        if (local.length > 6) formatted += '-' + local.slice(6, 8);
        if (local.length > 8) formatted += '-' + local.slice(8, 10);
        phone.value = formatted;
    });
}
phone.pattern = '\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}';

const consent = projectForm.querySelector('[type="checkbox"]');
const submit = projectForm.querySelector('[type="submit"]');
function updateConsent() {
    submit.disabled = !consent.checked;
}
consent.addEventListener('change', updateConsent);
updateConsent();

const attachment = projectForm.querySelector('#attach');
const label = projectForm.querySelector('label[for="attach"]');
if (attachment && label) {
    label.classList.add('attachment');
    attachment.parentElement.after(label);
    attachment.addEventListener('change', () => {
        const file = attachment.files[0];
        label.textContent = file?.name || '';
        label.style.display = file ? 'block' : '';
        attachment.setCustomValidity(file?.size > 10 * 1024 * 1024 ? 'Максимальный размер файла — 10 МБ.' : '');
        attachment.reportValidity();
    });
}

const main = document.querySelector('#main');
const callout = document.createElement('div');
callout.className = 'printTextOuter';
callout.innerHTML = '<a href="https://wellhead.ru/new-customers" class="printTextBlock"><span id="printText"></span></a>';
main.prepend(callout);
if (typeof window.Typed === 'function') {
    new Typed('#printText', {
        strings: ['Напишите нам!'],
        typeSpeed: 60,
        loop: true,
        backDelay: 2500,
        startDelay: 600,
        backSpeed: 0,
        smartBackspace: true,
    });
} else {
    document.querySelector('#printText').textContent = 'Напишите нам!';
}

// The category switcher comes from the original page; preserve its
// appearance while making mouse-only controls usable with a keyboard.
window.addEventListener('load', () => {
    document.querySelectorAll('.service__category').forEach((category) => {
        category.setAttribute('role', 'button');
        category.tabIndex = 0;
        category.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                category.click();
            }
        });
    });
});
