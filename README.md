# Feedback Hub

Приватный репозиторий с исходниками. Сайт публикуется автоматически в публичный репозиторий [Feedback-pages](https://github.com/Nyrokume/Feedback-pages).

**Сайт:** https://nyrokume.github.io/Feedback-pages/

## Как это устроено

| Репозиторий | Назначение |
|-------------|------------|
| `Feedback` (private) | Исходники, правки, история |
| `Feedback-pages` (public) | Только статика для GitHub Pages |

При push в `main` срабатывает GitHub Action и копирует файлы в `Feedback-pages`.

## Добавление статьи

1. `articles/YYYY-MM-DD-slug.html`
2. Запись в `data/articles.json`
3. Push в `main` — деплой произойдёт автоматически
