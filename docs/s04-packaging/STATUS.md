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

- Рабочая ветка: `work/heads-s04-geo`; базовая копия S04 уже опубликована и проверена ранее (см. таблицу выше).
- План: 4 новых блока (задачи заказчика, дизайн-система SKU, итоговые материалы, 5 подтвержденных кейсов и отраслевые ссылки), редактура слабого вступления и SEO.
- Сохраняем действующие 6 этапов, 5 FAQ, 106 прежних идентификаторов, все исходные изображения и формы. Новые поля добавляем в существующий четвертый лист Аллы на нужных позициях.
- Статус GEO-версии: **IN_PROGRESS**, до отдельной проверки GitHub Actions, публикации Pages и повторной проверки реального URL.
- Следующее действие: внести новые тексты и стили в `dizajn-upakovki/`, обновить `docs/s04-packaging/text-fields.json`.
