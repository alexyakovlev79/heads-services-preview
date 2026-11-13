# HEADS S04 / STATUS

Исходник: https://wellhead.ru/services/dizajn-upakovki/
Предпросмотр: https://alexyakovlev79.github.io/heads-services-preview/dizajn-upakovki/
Ветка: work/heads-s04-packaging-copy
Основание: [13c08b9](https://github.com/alexyakovlev79/heads-services-preview/commit/13c08b90be60eb412563b6e861a9ff473b23a379).
[Удалённые сохранения](https://github.com/alexyakovlev79/heads-services-preview/commits/work/heads-s04-packaging-copy/).

| Этап | Статус | Подтверждение |
|---|---|---|
| 0. Опись | VERIFIED | В main есть S01–S03. Оригинал S04 получен с HTTP 200, H1 «Разработка дизайна упаковки и этикетки», семь H2, пять пар FAQ в каждой адаптивной версии, две формы проекта и форма презентации. |
| 1. Исходный HTML и эталоны | IN_PROGRESS | Сохранён очищенный HTML в source-original.html. В Work подтверждены шесть этапов и пять FAQ. |
| 2. Ресурсы | SAVED | 11 исходных изображений и GIF сохранены [пакетами](https://github.com/alexyakovlev79/heads-services-preview/actions/runs/43386822299); 230 URL используют проверенные общие файлы. |
| 3–4. Вёрстка и интерфейс | SAVED | Исходная вёрстка обеих ширин, локальные ресурсы и изолированные демоформы. |
| 5. QA | VERIFIED | [Chrome и итоговые снимки ветки](https://github.com/alexyakovlev79/heads-services-preview/actions/runs/43389392828) на 320, 390, 768 и 1440 px. |
| 6. Pages | IN_PROGRESS | Подготовлено точечное добавление S04 в существующую сборку. |
| 7. Лист Аллы | VERIFIED | [Четвёртый лист](https://docs.google.com/spreadsheets/d/148dBU1gL_J9i9e8cYgVAYiVV8Hz8avNrKDxSfmMg1tY/edit#gid=1571455214), строки 5–110: 106 полей, четыре SEO и 189 привязок HTML. Столбцы E и F пусты, все записанные значения сверены. |

Предыдущий коммит: [27a75e1](https://github.com/alexyakovlev79/heads-services-preview/commit/27a75e1e8984baf90ca0b26470db766c10c9dafe).
Подтверждённый предыдущий SHA: [8f69cef](https://github.com/alexyakovlev79/heads-services-preview/commit/8f69cef9261e72b5d5ed6df7844cd93a1afb0c3c).
Предыдущая рабочая копия: [02df16f](https://github.com/alexyakovlev79/heads-services-preview/commit/02df16fd74d6c8b7188762ea7fa43b3322ac4e5d).
Снимки оригинала на всех четырёх ширинах получены в [первом прогоне](https://github.com/alexyakovlev79/heads-services-preview/actions/runs/43387607377/artifacts/14019461050). Оригинальная десктопная колонка с первым GIF скрыта классом hidden; на телефоне отдельный GIF отображается. Проверка обновлена по фактическому оригиналу.
На первом последовательном прогоне Chrome сообщал о недогруженных отложенных изображениях. Проверка переключает все изображения на eager, ждёт загрузки видимых файлов и готовности шрифтов перед проверкой числа GIF.
При сравнении снимков на 768/1440 px часть PNG ещё не была отрисована при съёмке. Основные иллюстрации S04 теперь загружаются без lazy-load, снимки делаются после декодирования.
На 768 px в оригинале длинные подписи преимуществ заходят на соседнюю колонку. Для предпросмотра добавлен перенос внутри длинных слов на планшете. Сборка объединена со свежим main с сохранением изменений S03.
Последний проверенный SHA ветки: [cf94671](https://github.com/alexyakovlev79/heads-services-preview/commit/cf94671ab083bcfd7e8a2d0df8cba68b6ad01ee8). Предыдущая сборка main уже опубликовала S03, но её старый тест ожидает один CTA, тогда как в S03 GEO их два. Шаги S04 добавлены перед проверками S03.
S04 открывается в Pages на [90be33a](https://github.com/alexyakovlev79/heads-services-preview/commit/90be33aed4fffe84690e45408315ecaaf9d4604f). В первой публичной проверке после DOMContentLoaded успевала загрузиться только часть отложенных GIF. Добавлено ожидание загрузки документа и каждого ожидаемого изображения.
Следующий шаг — повторить публичный Chrome и проверить четыре полноразмерных снимка.
