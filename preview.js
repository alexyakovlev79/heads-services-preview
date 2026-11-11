/* Standalone behavior for the public Heads template. Forms have no network backend. */
const presentation = document.querySelector('#elementor-popup-modal-14570');
const presentationButton = document.querySelector('#menu-item-14601 a');
const presentationUrl = 'https://wellhead.ru/wp-content/themes/total-child-theme/presentation/about_HEADS_2026.pdf';

presentationButton.addEventListener('click', (event) => {
    event.preventDefault();
    presentation.showModal();
});
presentation.querySelector('.dialog-close-button').addEventListener('click', () => presentation.close());
presentation.addEventListener('click', (event) => {
    if (event.target === presentation) presentation.close();
});

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
jQuery(phone).mask('\\+7 (000) 000-00-00', {clearIfNotMatch: true});
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
label.classList.add('attachment');
attachment.parentElement.after(label);
attachment.addEventListener('change', () => {
    const file = attachment.files[0];
    label.textContent = file?.name || '';
    label.style.display = file ? 'block' : '';
    attachment.setCustomValidity(file?.size > 10 * 1024 * 1024 ? 'Максимальный размер файла — 10 МБ.' : '');
    attachment.reportValidity();
});

const main = document.querySelector('#main');
const callout = document.createElement('div');
callout.className = 'printTextOuter';
callout.innerHTML = '<a href="https://wellhead.ru/new-customers" class="printTextBlock"><span id="printText"></span></a>';
main.prepend(callout);
new Typed('#printText', {
    strings: ['Напишите нам!'],
    typeSpeed: 60,
    loop: true,
    backDelay: 2500,
    startDelay: 600,
    backSpeed: 0,
    smartBackspace: true,
});
