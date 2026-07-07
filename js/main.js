const TAG_MAP = {
  плейтест: { class: 'tag--playtest', badge: 'badge-ok' },
  стрельба: { class: 'tag--shooting', badge: 'badge-warn' },
  баланс: { class: 'tag--balance', badge: 'badge-good' },
  организация: { class: 'tag--org', badge: 'badge-bad' },
};

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

  let articles = [];
  try {
    const response = await fetch('data/articles.json');
    if (response.ok) articles = await response.json();
  } catch {
    return;
  }

  articles.sort((a, b) => b.date.localeCompare(a.date));

  const allTags = [...new Set(articles.flatMap((a) => a.tags))];
  renderTagFilters(allTags);
  renderSidebarArticles(articles);
  renderArticleGrid(articles, listEl);
  updateHubStats(articles);

  let activeTags = new Set(allTags);

  document.getElementById('tag-filters')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-tag]');
    if (!btn) return;

    const tag = btn.dataset.tag;

    if (tag === 'all') {
      const allActive = activeTags.size === allTags.length;
      activeTags = allActive ? new Set() : new Set(allTags);
    } else {
      if (activeTags.has(tag)) activeTags.delete(tag);
      else activeTags.add(tag);
    }

    syncTagFilterUI(allTags, activeTags);
    filterArticles(articles, activeTags, listEl);
  });
}

function renderTagFilters(tags) {
  const container = document.getElementById('tag-filters');
  if (!container) return;

  const pills = tags
    .map(
      (tag) =>
        `<button type="button" class="tag ${TAG_MAP[tag]?.class || 'tag--neutral'} tag-filter is-active" data-tag="${tag}">${tag}</button>`
    )
    .join('');

  container.innerHTML = `
    <button type="button" class="tag tag--neutral tag-filter is-active" data-tag="all">все</button>
    ${pills}
  `;
}

function syncTagFilterUI(allTags, activeTags) {
  document.querySelectorAll('.tag-filter').forEach((btn) => {
    if (btn.dataset.tag === 'all') {
      btn.classList.toggle('is-active', activeTags.size === allTags.length);
    } else {
      btn.classList.toggle('is-active', activeTags.has(btn.dataset.tag));
    }
  });
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

function renderArticleGrid(articles, container) {
  container.innerHTML = articles.map((article) => renderArticleCard(article)).join('');

  const empty = document.getElementById('empty-state');
  if (empty) empty.classList.toggle('is-hidden', articles.length > 0);
}

function filterArticles(articles, activeTags, container) {
  const filtered =
    activeTags.size === 0
      ? []
      : articles.filter((article) => article.tags.some((tag) => activeTags.has(tag)));

  container.querySelectorAll('.article-card').forEach((card) => {
    const id = card.dataset.id;
    const visible = filtered.some((a) => a.id === id);
    card.classList.toggle('is-hidden', !visible);
  });

  const empty = document.getElementById('empty-state');
  if (empty) empty.classList.toggle('is-hidden', filtered.length > 0);
}

function renderArticleCard(article) {
  const date = formatDate(article.date);
  const tags = article.tags
    .map((t) => `<span class="tag ${TAG_MAP[t]?.class || 'tag--neutral'}">${t}</span>`)
    .join('');

  return `
    <a class="article-card" href="articles/${article.id}.html" data-id="${article.id}" data-tags="${article.tags.join(',')}">
      <div class="article-card-top">
        <h2>${article.title}</h2>
        <span class="article-card-date">${date}</span>
      </div>
      <p class="article-card-summary">${article.summary}</p>
      <div class="article-card-bottom">
        <span class="article-card-author">${article.author}</span>
        <div class="tags">${tags}</div>
      </div>
    </a>
  `;
}

function updateHubStats(articles) {
  const countEl = document.getElementById('stat-count');
  const tagsEl = document.getElementById('stat-tags');
  if (!countEl) return;

  const allTags = new Set(articles.flatMap((a) => a.tags));
  countEl.textContent = articles.length;
  if (tagsEl) tagsEl.textContent = allTags.size;
}

function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatShortDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
