document.addEventListener('DOMContentLoaded', () => {
  initScrollSpy();
  initMobileMenu();
  initHub();
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

async function initHub() {
  const listEl = document.getElementById('article-list');
  if (!listEl) return;

  try {
    const response = await fetch('data/articles.json');
    if (!response.ok) return;
    const articles = await response.json();

    articles.sort((a, b) => b.date.localeCompare(a.date));
    renderSidebarArticles(articles);
    listEl.innerHTML = articles.map((article) => renderArticleCard(article)).join('');
  } catch {
    /* fallback cards already in HTML */
  }
}

function renderSidebarArticles(articles) {
  const nav = document.getElementById('sidebar-articles');
  if (!nav) return;

  nav.innerHTML = articles
    .map((article) => {
      const date = formatShortDate(article.date);
      return `<a class="nav-link" href="articles/${article.id}.html">${article.title}<span class="nav-link-meta">${date} · ${article.author}</span></a>`;
    })
    .join('');
}

function renderArticleCard(article) {
  const date = formatDate(article.date);

  return `
    <a class="article-card" href="articles/${article.id}.html" data-id="${article.id}">
      <div class="article-card-top">
        <h2>${article.title}</h2>
        <span class="article-card-date">${date}</span>
      </div>
      <p class="article-card-summary">${article.summary}</p>
      <div class="article-card-bottom">
        <span class="article-card-author">${article.author}</span>
      </div>
    </a>
  `;
}

function formatDate(dateStr) {
  const parts = dateStr.split('-');
  return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

function formatShortDate(dateStr) {
  return formatDate(dateStr);
}
