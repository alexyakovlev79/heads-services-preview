# HEADS S03 / STATUS

Исходник: https://wellhead.ru/services/formirovanie-portfelja-brendov/
Рабочая ветка: `work/heads-s03-portfolio-copy`.
Основание: [31ae9a7](https://github.com/alexyakovlev79/heads-services-preview/commit/31ae9a74c069309300a54df9ca9d0a92f332194d). Начальная фиксация 2026-11-13 09:21 МСК. [История](https://github.com/alexyakovlev79/heads-services-preview/commits/work/heads-s03-portfolio-copy/docs/s03-portfolio/STATUS.md).

| Этап | Статус | Подтверждение |
|---|---|---|
| 0. Сверка | VERIFIED | S01 и S02 в main. Оригинал S03 открыт в Chrome: 8 разделов после H1, 3 вопроса FAQ, CTA, проектная форма, окно презентации и схемы двух видов архитектуры. Порядок 1, 3, 2, 4 в исходных колонках сохранён. |
| 1. Исходник | SAVED | Полный публичный HTML в source-original.html. Убраны служебные значения WordPress и антиспам. |
| 2. Ресурсы | SAVED | 34 новых файлов, 203 ссылок на проверенные общие ресурсы, 0 ожидают сохранения. |
| 3–4. Вёрстка и интерфейс | SAVED | Исходные варианты десктопа и мобильной страницы, локальные ресурсы, изолированные демоформы. |
| 5. Проверки | VERIFIED | [Chrome на 320, 390, 768 и 1440 px](https://github.com/alexyakovlev79/heads-services-preview/actions/runs/43379758351), [полноразмерные эталоны и копии](https://github.com/alexyakovlev79/heads-services-preview/actions/runs/43379758351/artifacts/14016495962). |
| 6. Публикация | VERIFIED | [Первый успешный Pages](https://github.com/alexyakovlev79/heads-services-preview/actions/runs/43380266717), включая браузерные проверки публичной S03. |
| 7. Таблица | IN_PROGRESS | Сохранена карта text-fields.json с ID и связями FAQ с JSON-LD. Подтверждён существующий третий лист. |

Последний подтверждённый предыдущий коммит: [998a620](https://github.com/alexyakovlev79/heads-services-preview/commit/998a62012865663505db580f0f3ef81af9c9fdc7).
Статическая проверка прошла. [Первый браузерный прогон](https://github.com/alexyakovlev79/heads-services-preview/actions/runs/43378750739) остановился на размере отложенных схем. Проверка теперь дожидается декодирования обеих схем и проверяет, что на каждой ширине отображается ровно один экземпляр.
Подтверждённый SHA браузерной проверки: [9fadce9](https://github.com/alexyakovlev79/heads-services-preview/commit/9fadce967000fef09464cc177de72b55d19319a9). Снимки 1440 и 390 px показывают совпадение основных секций. Исправлена найденная разница в форме: исходные стили файлового поля и кнопки применяются и к отдельной мобильной форме.
Проверка формы и схем повторно прошла на [fb1f833](https://github.com/alexyakovlev79/heads-services-preview/commit/fb1f833132d4a9fb1fef9269432469aa41910ef9) в [GitHub Actions](https://github.com/alexyakovlev79/heads-services-preview/actions/runs/43380094390).
Публичная версия без привязки ID проверена на [02519fd](https://github.com/alexyakovlev79/heads-services-preview/commit/02519fde288400839f2d1e5faaa3cda276e1d6ba).
Следующий шаг — опубликовать привязки ID и заполнить существующий третий лист таблицы Аллы.

