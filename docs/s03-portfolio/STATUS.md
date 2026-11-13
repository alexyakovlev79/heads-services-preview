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
