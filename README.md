# Feedback Hub

Хаб статей с отчётами плейтестов.

**https://nyrokume.github.io/Feedback/**

## Структура

```
index.html              — хаб: список статей, фильтр по тегам
articles/*.html         — статьи с навигацией по разделам
data/articles.json      — метаданные статей
css/styles.css          — общие стили (тёмная тема)
js/main.js              — фильтрация, scroll spy, мобильное меню
```

## Хаб

- Список статей из `data/articles.json`
- Фильтр по тегам в сайдбаре
- Быстрый переход к статьям из боковой панели

## Статья

Каждая статья содержит:

- Breadcrumb и заголовок с тегами
- Сайдбар с навигацией по разделам
- Блоки: организация, геймплей, статы, итог

## Добавление статьи

1. Создайте `articles/YYYY-MM-DD-slug.html` по образцу
2. Добавьте запись в `data/articles.json` с `id`, `title`, `author`, `date`, `tags`, `summary`, `sections`
3. Запушьте в `main`
