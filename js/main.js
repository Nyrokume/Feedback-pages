document.addEventListener('DOMContentLoaded', () => {
  initScrollSpy();
  initMobileMenu();
  loadArticleList();
});

function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.dataset.section === entry.target.id);
          });
        }
      });
    },
    { rootMargin: '-20% 0px -60% 0px' }
  );

  sections.forEach((section) => observer.observe(section));
}

function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  if (!toggle || !sidebar) return;

  toggle.addEventListener('click', () => sidebar.classList.toggle('open'));

  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => sidebar.classList.remove('open'));
  });
}

async function loadArticleList() {
  const container = document.getElementById('article-list');
  if (!container) return;

  try {
    const response = await fetch('data/articles.json');
    if (!response.ok) return;
    const articles = await response.json();

    container.innerHTML = articles
      .sort((a, b) => b.date.localeCompare(a.date))
      .map((article) => renderArticleCard(article))
      .join('');
  } catch {
    /* fallback cards already in HTML */
  }
}

function renderArticleCard(article) {
  const date = new Date(article.date + 'T00:00:00').toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const tagMap = {
    организация: 'badge-bad',
    плейтест: 'badge-ok',
    стрельба: 'badge-warn',
    баланс: 'badge-good',
  };

  const tags = article.tags
    .map((t) => `<span class="badge ${tagMap[t] || 'badge-neutral'}">${t}</span>`)
    .join('');

  return `
    <a class="article-card" href="articles/${article.id}.html">
      <h2>${article.title}</h2>
      <p>${article.summary}</p>
      <div class="article-card-footer">
        <span class="article-date">${date}</span>
        <span class="article-date">${article.author}</span>
        ${tags}
      </div>
    </a>
  `;
}
