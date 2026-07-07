async function loadArticles() {
  const response = await fetch('data/articles.json');
  if (!response.ok) throw new Error('Не удалось загрузить список статей');
  return response.json();
}

function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function tagClass(tag) {
  const map = {
    организация: 'red',
    плейтест: 'blue',
    стрельба: 'yellow',
    баланс: 'green',
  };
  return map[tag] || 'blue';
}

function renderArticleList(articles, container) {
  if (!articles.length) {
    container.innerHTML = '<p class="hero__meta">Статей пока нет.</p>';
    return;
  }

  container.innerHTML = articles
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(
      (article) => `
      <a class="article-card" href="articles/${article.id}.html">
        <h2 class="article-card__title">${article.title}</h2>
        <p class="article-card__summary">${article.summary}</p>
        <div class="article-card__footer">
          <span class="article-card__date">${formatDate(article.date)}</span>
          <span class="article-card__date">${article.author}</span>
          ${article.tags.map((t) => `<span class="tag tag--${tagClass(t)}">${t}</span>`).join('')}
        </div>
      </a>
    `
    )
    .join('');
}

function initToc() {
  const tocLinks = document.querySelectorAll('.toc a');
  const sections = document.querySelectorAll('.article-content h2[id]');
  if (!tocLinks.length || !sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          tocLinks.forEach((link) => {
            link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

document.addEventListener('DOMContentLoaded', async () => {
  const listEl = document.getElementById('article-list');
  if (listEl) {
    try {
      const articles = await loadArticles();
      renderArticleList(articles, listEl);
    } catch (err) {
      listEl.innerHTML = `<p class="hero__meta">${err.message}</p>`;
    }
  }

  initToc();
});
