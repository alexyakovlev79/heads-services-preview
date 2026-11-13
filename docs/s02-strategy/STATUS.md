# HEADS S02 / STATUS

Исходный URL: https://wellhead.ru/services/strategija-i-pozicionirovanie/
Репозиторий: [heads-services-preview](https://github.com/alexyakovlev79/heads-services-preview)
Рабочая ветка: `work/heads-s02-strategy-copy`
Последняя фиксация: [история рабочей ветки](https://github.com/alexyakovlev79/heads-services-preview/commits/work/heads-s02-strategy-copy/docs/s02-strategy/STATUS.md). Опубликованная версия: [1a0f456](https://github.com/alexyakovlev79/heads-services-preview/commit/1a0f456434b9d6cbec9a8c89f88cf5fd8267b41d).
Проверенная исходная версия S01: [`3775cd61c7767270e8e1e6a62e990ce633a5f56c`](https://github.com/alexyakovlev79/heads-services-preview/commit/3775cd61c7767270e8e1e6a62e990ce633a5f56c).

| Этап | Статус | Подтверждение |
|---|---|---|
| 0. Сверка состояния | VERIFIED | До начала работы на GitHub существовала только ветка main; в ней были S01 и ее успешные прогоны [QA](https://github.com/alexyakovlev79/heads-services-preview/actions/runs/43265852177) и [Pages](https://github.com/alexyakovlev79/heads-services-preview/actions/runs/43265852212). Исходная S02 открыта в браузере. |
| 1. HTML и эталон | VERIFIED | Полный публичный ответ HTTP 200 сохранен в source-original.html. Из конфигурации убраны одноразовые значения WordPress и инициализация антиспама. Полноразмерный эталон браузера Work сохранен в reference/source-work-1363.webp (ширина 1363 px). Эталоны 1440 и 390 px есть в артефактах QA. Оригинал показывает заголовок «Стратегия и позиционирование», вводный блок с GIF, разделы о сути, стратегии, этапах, критериях, стоимости, три раскрывающихся вопроса, форму с брифом и подвал. В шапке есть мобильное меню и ссылка на окно скачивания презентации. |
| 2. Ресурсы | VERIFIED | 242 из 242 URL сохранены. 179 URL используют файлы S01 с совпадающим SHA-256. Точные пути и ссылки на историю каждого файла в assets-manifest.json. |
| 3. Верстка | VERIFIED | Исходные варианты десктопа и мобильного сохранены. В preview.css восстановлены исходные размеры шрифта для 36 элементов с data-wpex-rcss. |
| 4. Взаимодействия | VERIFIED | Демоформы, маска телефона, FAQ и окно презентации интегрированы. Запросы форм и соединения блокируются политикой CSP. |
| 5. Проверки | VERIFIED | [GitHub Actions](https://github.com/alexyakovlev79/heads-services-preview/actions/runs/43376980616) проверил S01 и S02 в Chrome на 320, 390, 768 и 1440 px, в том числе размеры шрифтов из исходной вёрстки. |
| 6. Публикация | VERIFIED | [Предпросмотр S02](https://alexyakovlev79.github.io/heads-services-preview/strategija-i-pozicionirovanie/), [успешный прогон Pages](https://github.com/alexyakovlev79/heads-services-preview/actions/runs/43376980576). Опубликованную страницу открыли в Chrome, сверили размеры заголовков с оригиналом, проверили изображения, FAQ и виджет отзывов в подвале. |
| 7. Таблица Аллы | TODO | Реестр текстов отложен до следующего этапа правок. |

Для следующих правок использовать `main` и каталог `strategija-i-pozicionirovanie/`. Размеры заголовков заданы в `preview.css` по параметрам `data-wpex-rcss` оригинала. [Полноразмерные снимки оригинала и копии](https://github.com/alexyakovlev79/heads-services-preview/actions/runs/43376980616/artifacts/14014892482). S01 и боевой WordPress не менялись.
