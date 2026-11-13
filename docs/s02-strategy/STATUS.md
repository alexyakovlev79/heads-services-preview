# HEADS S02 / STATUS

Исходный URL: https://wellhead.ru/services/strategija-i-pozicionirovanie/
Репозиторий: [heads-services-preview](https://github.com/alexyakovlev79/heads-services-preview)
Рабочая ветка: `work/heads-s02-strategy-copy`
Последняя фиксация: [история рабочей ветки](https://github.com/alexyakovlev79/heads-services-preview/commits/work/heads-s02-strategy-copy/docs/s02-strategy/STATUS.md). Предыдущий подтвержденный SHA: `8fc84ef8a64e2f063df86ce111da90443624702f`.
Проверенная исходная версия S01: [`3775cd61c7767270e8e1e6a62e990ce633a5f56c`](https://github.com/alexyakovlev79/heads-services-preview/commit/3775cd61c7767270e8e1e6a62e990ce633a5f56c).

| Этап | Статус | Подтверждение |
|---|---|---|
| 0. Сверка состояния | VERIFIED | До начала работы на GitHub существовала только ветка main; в ней были S01 и ее успешные прогоны [QA](https://github.com/alexyakovlev79/heads-services-preview/actions/runs/43265852177) и [Pages](https://github.com/alexyakovlev79/heads-services-preview/actions/runs/43265852212). Исходная S02 открыта в браузере. |
| 1. HTML и эталон | IN_PROGRESS | Полный публичный ответ HTTP 200 сохранен в source-original.html. Из конфигурации убраны одноразовые значения WordPress и инициализация антиспама. Полноразмерный эталон браузера Work сохранен в reference/source-work-1363.webp (ширина 1363 px). Оригинал показывает заголовок «Стратегия и позиционирование», вводный блок с GIF, разделы о сути, стратегии, этапах, критериях, стоимости, три раскрывающихся вопроса, форму с брифом и подвал. В шапке есть мобильное меню и ссылка на окно скачивания презентации. |
| 2. Ресурсы | IN_PROGRESS | 224 из 242 URL сохранены. 179 URL используют файлы S01 с совпадающим SHA-256. Точные пути и ссылки на историю каждого файла в assets-manifest.json. |
| 3. Верстка | SAVED | Исходные варианты десктопа и мобильного сохранены в рабочем index.html. Локальные ссылки проверяются после загрузки ресурсов. |
| 4. Взаимодействия | IN_PROGRESS | Сохранены сценарий демоформ, маски телефона, FAQ и окна презентации и их стили. Интеграция в HTML и приемка впереди. | |
| 5. Проверки | TODO | |
| 6. Публикация | TODO | |
| 7. Таблица Аллы | TODO | |

Следующий шаг — сохранить группы ресурсов из реестра и включить приемку. Эталоны 1440/390 px нужно снять на стенде с поддержкой Chrome. В S01 и на wellhead.ru изменений нет.
