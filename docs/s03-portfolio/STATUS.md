# HEADS S03 / STATUS

Исходник: [Формирование портфеля брендов](https://wellhead.ru/services/formirovanie-portfelja-brendov/).
Предпросмотр: [GitHub Pages](https://alexyakovlev79.github.io/heads-services-preview/formirovanie-portfelja-brendov/).
Проверенный опубликованный SHA: [5a817d431a6a19d2f3205c04636b6ea2394f7e5e](https://github.com/alexyakovlev79/heads-services-preview/commit/5a817d431a6a19d2f3205c04636b6ea2394f7e5e).
Проверка подтверждена 13.11.2026 в 09:46 МСК. [История рабочей ветки](https://github.com/alexyakovlev79/heads-services-preview/commits/work/heads-s03-portfolio-copy/docs/s03-portfolio/STATUS.md).

| Этап | Статус | Подтверждение |
|---|---|---|
| 0. Исходная страница | VERIFIED | Десктопная и мобильная разметка, оригинальные тексты, три вопроса FAQ, две схемы архитектуры, форма проекта и окно презентации. Порядок 1, 3, 2, 4 в исходных десктопных колонках сохранён. |
| 1. HTML и эталон | VERIFIED | Полный обезличенный HTML в source-original.html. [Полноразмерные эталоны и снимки копии](https://github.com/alexyakovlev79/heads-services-preview/actions/runs/43379758351/artifacts/14016495962). |
| 2. Ресурсы | VERIFIED | 237 локализованных URL: 34 новых файла и 203 ссылки на 197 проверенных общих файлов. Ещё три внешних URL отмечены в assets-manifest.json. |
| 3–4. Вёрстка и интерфейс | VERIFIED | Схемы, анимации, шрифты, FAQ, мобильное меню, окно презентации и две демоформы. В деморежиме данные и вложения не отправляются. Стили мобильного поля загрузки и кнопки восстановлены по оригиналу. |
| 5. QA | VERIFIED | [S03 Chrome: 320, 390, 768 и 1440 px](https://github.com/alexyakovlev79/heads-services-preview/actions/runs/43380762771). [Регрессия S01/S02](https://github.com/alexyakovlev79/heads-services-preview/actions/runs/43380762603). |
| 6. Публикация | VERIFIED | [GitHub Pages и Chrome на публичном адресе](https://github.com/alexyakovlev79/heads-services-preview/actions/runs/43380762538). [Полноразмерные снимки публичной страницы](https://github.com/alexyakovlev79/heads-services-preview/actions/runs/43380762538/artifacts/14015904632). Все три публичные страницы ответили HTTP 200. |
| 7. Таблица Аллы | VERIFIED | [Третий лист](https://docs.google.com/spreadsheets/d/148dBU1gL_J9i9e8cYgVAYiVV8Hz8avNrKDxSfmMg1tY/edit#gid=43543170), строки 5–101. Сверены все 97 полей, включая 4 SEO-поля, с text-fields.json и опубликованным HTML. Столбцы E и F пусты. В карте зафиксированы 159 привязок в HTML и шесть свойств FAQPage. |

В предпросмотре отключены исходные счётчики и связанное окно согласия на cookie. Ссылка на PDF презентации ведёт на прежний адрес, доступность PDF не проверялась. Тексты внутри мобильной инфографики редактируются в исходных макетах, соответствующие ALT и примечания внесены в таблицу.

Следующий шаг при согласовании — читать изменения в столбце E третьего листа и применять их по text-fields.json. Перед будущим переносом на wellhead.ru удалить служебные атрибуты по правилам docs/HANDOFF.md.

## GEO-доработка 13.11.2026 (согласование Аллы)

- Рабочая ветка: `work/heads-s03-geo`; PR: https://github.com/alexyakovlev79/heads-services-preview/pull/2.
- Добавлены 4 самостоятельных раздела, каждый с настольной и мобильной версией: сценарии заказчиков, результаты работы, выбор между линейкой/суббрендом/маркой, доказательные кейсы KIX, Pet Pride и Hartens. Исходные схемы и 3 FAQ сохранены.
- Переписаны 4 исходных текста (HEADS-S03-0008, 0009, 0012, 0054) и 4 поля SEO; в JSON-LD скорректированы WebPage и Service без дублирования Organization и FAQPage.
- `docs/s03-portfolio/text-fields.json`: прежние 97 ID сохранены, добавлены HEADS-S03-0094…0140 (47 новых). В третьем листе Google-таблицы теперь 144 поля, новые строки вставлены перед соответствующими исходными разделами; столбцы E и F для Аллы пустые. https://docs.google.com/spreadsheets/d/148dBU1gL_J9i9e8cYgVAYiVV8Hz8avNrKDxSfmMg1tY/edit#gid=43543170.
- GEO-стили изолированы в `geo-s03.css`; добавлены `scripts/check-portfolio-geo.mjs`, `scripts/check-portfolio-geo-browser.mjs` и QA workflow.
- **Изменения влиты в main.** PR [#2](https://github.com/alexyakovlev79/heads-services-preview/pull/2) успешно объединен, подтвержденный SHA слияния: [`ed40b6166fcf1b1edc6018ccdce5cca61cec8607`](https://github.com/alexyakovlev79/heads-services-preview/commit/ed40b6166fcf1b1edc6018ccdce5cca61cec8607).
- **Проверка новой GEO-версии: VERIFIED (PR).** [Actions run #43388906113](https://github.com/alexyakovlev79/heads-services-preview/actions/runs/43388906113), статус `success`. Проверены 320/390/768/1440 px, исходные блоки, новые разделы, оригинальные FAQ, изображения, 3 ссылки на кейсы, адаптивность и отсутствие ошибок JS. [Полноразмерные снимки 1440/390](https://github.com/alexyakovlev79/heads-services-preview/actions/runs/43388906113/artifacts/14020056433) сохранены.
- **Публикация после merge: конфигурация сохранена, live-проверка ожидает подтверждения.** В `main` присутствуют HTML S03, `geo-s03.css`, новая карта ID и обновленный `.github/workflows/publish-preview.yml`: он включает CSS в артефакт Pages и проверяет опубликованную GEO-версию в Chrome. Данные о фактическом завершении post-merge Pages Action в этом чате получить не удалось. Прежний опубликованный SHA в начале STATUS относится к копии S03 **до GEO-доработки**.
- Следующий шаг при проверке релиза: убедиться в успешном Pages-run для коммита `ed40b616...` или более позднего, открыть публичный S03 без кэша, сверить новые блоки на компьютере и телефоне. После этого обновить этот статус с точной ссылкой на live-проверку.
