# HEADS S02 / STATUS

Исходный URL: https://wellhead.ru/services/strategija-i-pozicionirovanie/
Репозиторий: [heads-services-preview](https://github.com/alexyakovlev79/heads-services-preview)
Рабочая ветка: `work/heads-s02-strategy-copy`
Последняя фиксация: [история рабочей ветки](https://github.com/alexyakovlev79/heads-services-preview/commits/work/heads-s02-strategy-copy/docs/s02-strategy/STATUS.md). Предыдущий подтвержденный SHA: `bfb1aff6f4395fcba3131a93a4089d8389b0e49c`.
Проверенная исходная версия S01: [`3775cd61c7767270e8e1e6a62e990ce633a5f56c`](https://github.com/alexyakovlev79/heads-services-preview/commit/3775cd61c7767270e8e1e6a62e990ce633a5f56c).

| Этап | Статус | Подтверждение |
|---|---|---|
| 0. Сверка состояния | VERIFIED | До начала работы на GitHub существовала только ветка main; в ней были S01 и ее успешные прогоны [QA](https://github.com/alexyakovlev79/heads-services-preview/actions/runs/43265852177) и [Pages](https://github.com/alexyakovlev79/heads-services-preview/actions/runs/43265852212). Исходная S02 открыта в браузере. |
| 1. HTML и эталон | IN_PROGRESS | Полный публичный ответ HTTP 200 сохранен в source-original.html. Из конфигурации убраны одноразовые значения WordPress и инициализация антиспама. Полноразмерный эталон браузера Work сохранен в reference/source-work-1363.webp (ширина 1363 px). Оригинал показывает заголовок «Стратегия и позиционирование», вводный блок с GIF, разделы о сути, стратегии, этапах, критериях, стоимости, три раскрывающихся вопроса, форму с брифом и подвал. В шапке есть мобильное меню и ссылка на окно скачивания презентации. |
| 2. Ресурсы | SAVED | 242 из 242 URL сохранены. 179 URL используют файлы S01 с совпадающим SHA-256. Точные пути и ссылки на историю каждого файла в assets-manifest.json. |
| 3. Верстка | SAVED | Исходные варианты десктопа и мобильного сохранены в рабочем index.html. Локальные ссылки проверяются после загрузки ресурсов. |
| 4. Взаимодействия | SAVED | Демоформы, маска телефона, FAQ и окно презентации интегрированы. Запросы форм и соединения блокируются политикой CSP. |
| 5. Проверки | IN_PROGRESS | [Первый прогон](https://github.com/alexyakovlev79/heads-services-preview/actions/runs/43375255590) подтвердил S01 и S02 на 320/390 px. На 768/1440 px проверка заголовка о стоимости теперь учитывает исходные переносы строк. |
| 6. Публикация | IN_PROGRESS | Каталог S02 добавлен в сборку GitHub Pages. Публикация после проверки рабочей ветки. |
| 7. Таблица Аллы | TODO | |

Следующий шаг — проверить Chrome в GitHub Actions на 320/390/768/1440 px, сопоставить снимки и подготовить публикацию. В S01 и на wellhead.ru изменений нет.
