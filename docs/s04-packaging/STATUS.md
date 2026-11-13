# HEADS S04 / STATUS

Исходник: [Дизайн упаковки](https://wellhead.ru/services/dizajn-upakovki/).
Предпросмотр: [GitHub Pages](https://alexyakovlev79.github.io/heads-services-preview/dizajn-upakovki/).
Рабочая ветка: [work/heads-s04-packaging-copy](https://github.com/alexyakovlev79/heads-services-preview/commits/work/heads-s04-packaging-copy/).
Проверенный опубликованный SHA: [cdf592504dab2cd103008fe006fa0224f959cff4](https://github.com/alexyakovlev79/heads-services-preview/commit/cdf592504dab2cd103008fe006fa0224f959cff4).
Публичная проверка завершена 13.11.2026 в 11:08 МСК.

| Этап | Статус | Подтверждение |
|---|---|---|
| 0. Опись | VERIFIED | H1 «Разработка дизайна упаковки и этикетки», семь основных разделов, шесть этапов и пять FAQ. В оригинале первый GIF на компьютере скрыт, на телефоне показан отдельный GIF. |
| 1. HTML и эталоны | VERIFIED | Очищенный HTML в source-original.html. [Полноразмерные эталоны на четырёх ширинах](https://github.com/alexyakovlev79/heads-services-preview/actions/runs/43387607377/artifacts/14019461050). |
| 2. Ресурсы | VERIFIED | 11 новых оригинальных файлов, 230 URL используют 224 проверенных общих файла, три внешние записи, 0 pending/failed. [Пакеты графики](https://github.com/alexyakovlev79/heads-services-preview/actions/runs/43386822299). |
| 3–4. Вёрстка и интерфейс | VERIFIED | Текст основного блока совпадает с оригиналом после нормализации пробелов. Проверены иллюстрации, анимации, шрифты, CTA, меню, пять FAQ, форма проекта и окно презентации. Формы демонстрационные. |
| 5. Chrome QA | VERIFIED | [320, 390, 768, 1440 px](https://github.com/alexyakovlev79/heads-services-preview/actions/runs/43390746988). Вёрстка и медиаматериалы сверены с эталонами. |
| 6. Pages | VERIFIED | Шаги публикации Pages и проверки публичной S04 прошли в [задании GitHub Actions](https://github.com/alexyakovlev79/heads-services-preview/actions/runs/43390746963/job/131769763702). [Четыре полноразмерных снимка публичной S04](https://github.com/alexyakovlev79/heads-services-preview/actions/runs/43390746963/artifacts/14020508068). S01–S03 доступны. Общий статус прогона красный из-за прежнего теста S03: ожидается одна кнопка, после отдельной GEO-правки S03 показывает две. |
| 7. Лист Аллы | VERIFIED | [Четвёртый лист](https://docs.google.com/spreadsheets/d/148dBU1gL_J9i9e8cYgVAYiVV8Hz8avNrKDxSfmMg1tY/edit#gid=1571455214), строки 5–110. Сверены 106 полей, включая четыре SEO, и 189 HTML-привязок. Столбцы E и F пусты. FAQ синхронизируется с существующей FAQPage. |

В предпросмотре отключены счётчики и окно cookie. Ссылка на PDF презентации сохранена, доступность файла не проверялась. На планшете уменьшен кегль трёх подписей преимуществ, чтобы целые слова помещались в колонках. Текст, встроенный в мобильные изображения, отмечен в карте полей.

Следующий шаг при согласовании — применять непустые изменения из колонки E по text-fields.json. При будущем переносе на wellhead.ru убрать временные ID по docs/HANDOFF.md.

## GEO-доработка, 13 ноября 2026

- **Итог: GEO-версия S04 опубликована в GitHub Pages и прошла приемку в Chrome.** URL: https://alexyakovlev79.github.io/heads-services-preview/dizajn-upakovki/. Боевой wellhead.ru не изменялся.
- В HTML добавлены 4 новые смысловые секции на десктопе и мобильном: сценарии (новый продукт, редизайн, линейка), дизайн-система упаковки и SKU, комплект итоговых материалов, 5 опубликованных кейсов («Вернель», «ЛОСК», Libretta, «Экомилк», «Ринонорм») плюс 4 отраслевые ссылки. CSS ограничен классом `heads-s04-geo` в `geo-s04.css`.
- Уточнены SEO Title, Description, OG, Schema.org WebPage/Service, прежние абзацы 0008–0010, 0012–0016, 0042, 0056–0057. Старые 6 этапов, 5 FAQ (и единая FAQPage), оригинальные схемы, формы, шрифты и анимации остались на месте.
- Google-таблица Аллы: https://docs.google.com/spreadsheets/d/148dBU1gL_J9i9e8cYgVAYiVV8Hz8avNrKDxSfmMg1tY/edit#gid=1571455214. В четвертом листе диапазон A5:H177: **106 существовавших и 67 новых полей = 173**; старые ID не менялись, новые `HEADS-S04-0103…0169` распределены перед соответствующими блоками. Колонка E — вариант Аллы, F — комментарии.
- Цветовая разметка **всех четырех листов**: добавленные нами текстовые строки целиком A:H бледно-голубые, исходные белые, включая переписанные. Точные правила записаны в `docs/HANDOFF.md`.
- **GitHub Actions (13.11.2026):**
  - [S04 GEO QA, Chrome 320/390/768/1440](https://github.com/alexyakovlev79/heads-services-preview/actions/runs/43443750309) — **SUCCESS**; [два полноразмерных снимка](https://github.com/alexyakovlev79/heads-services-preview/actions/runs/43443750309/artifacts/14047592014).
  - [Оригинальный S04 preview QA](https://github.com/alexyakovlev79/heads-services-preview/actions/runs/43443750415) — **SUCCESS**.
  - [Pages deployment и Chrome-проверка публичной S04, S03, S02 и S01](https://github.com/alexyakovlev79/heads-services-preview/actions/runs/43443750412) — **SUCCESS**; [снимки опубликованной страницы](https://github.com/alexyakovlev79/heads-services-preview/actions/runs/43443750412/artifacts/14047537603).
  - [S03 GEO regressions](https://github.com/alexyakovlev79/heads-services-preview/actions/runs/43443750348) и [S01/S02 preview QA](https://github.com/alexyakovlev79/heads-services-preview/actions/runs/43443750451) — **SUCCESS**.
- Сбой прежней проверки S04 был вызван устаревшим ожидаемым текстом H2 («Пять проектов…»). Заголовок улучшен до «Дизайн упаковки в 5 проектах Heads», тест синхронизирован, все проверки пройдены на следующем коммите.
- **Следующий шаг:** редактура Аллы в E/F; для применения по сохраненным ID обновить обе адаптивные версии и Schema.org при изменениях FAQ/SEO. Перед публикацией на рабочем wellhead.ru удалить `data-heads-text-id` и временные служебные метки. Ничего дополнительно на живом сайте сейчас не делать.
