export function Layout(props: { title: string; content: string; description?: string }) {
  const metaDescription = props.description || "Essays and media reviews."
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${props.title} | Ryan's Blog</title>
  <meta name="description" content="${metaDescription}">
  <link rel="preconnect" href="https://m.media-amazon.com" crossorigin>
  <link rel="stylesheet" href="/style.css">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>✒</text></svg>">
  <script>
    // Apply saved mode preference (if any)
    (function() {
      var mode = localStorage.getItem('site-mode');
      if (mode) {
        document.documentElement.setAttribute('data-mode', mode);
      }
    })();
  </script>
</head>
<body>
  <!-- Dark/Light Mode Toggle -->
  <button class="mode-toggle print:hidden" onclick="toggleMode()" title="Toggle dark/light mode" aria-label="Toggle dark/light mode">
    <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  </button>

  <div class="theme-window">
    <!-- Main Content Area -->
    <div class="theme-content">
      <!-- Header -->
      <header class="mb-6 pb-3 border-b" style="border-color: var(--color-border);">
        <nav>
          <a href="/">home</a>
          <a href="/writing.html">writing</a>
          <a href="/media.html">media</a>
          <a href="/tools.html">tools</a>
          <a href="/about.html">about</a>
          <button onclick="openSearch()" title="Search (⌘K)">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
          </button>
        </nav>
      </header>

      <!-- Content -->
      <main>
        ${props.content}
      </main>

    </div>
  </div>

  <script>
    function toggleMode() {
      var html = document.documentElement;
      var currentMode = html.getAttribute('data-mode');
      var newMode;
      
      if (currentMode === 'dark') {
        newMode = 'light';
      } else if (currentMode === 'light') {
        newMode = 'dark';
      } else {
        // No manual mode set, check system preference and toggle opposite
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        newMode = prefersDark ? 'light' : 'dark';
      }
      
      html.setAttribute('data-mode', newMode);
      localStorage.setItem('site-mode', newMode);
    }
  </script>

  <!-- Search Modal -->
  <div id="searchModal" class="search-modal hidden">
    <div class="search-backdrop" onclick="closeSearch()"></div>
    <div class="search-container">
      <div class="search-input-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
        <input type="text" id="searchInput" placeholder="Search posts and media..." autocomplete="off">
        <kbd class="search-kbd">esc</kbd>
      </div>
      <div id="searchResults" class="search-results"></div>
    </div>
  </div>

  <script>
    var searchIndex = null;
    var selectedIndex = -1;
    var lastResults = [];

    // Preload search data
    fetch('/search.json').then(function(r) { return r.json(); }).then(function(data) {
      searchIndex = data.map(function(item) {
        return Object.assign({}, item, {
          _search: [item.title, item.author, item.year].filter(Boolean).join(' ').toLowerCase()
        });
      });
    });

    function openSearch() {
      document.getElementById('searchModal').classList.remove('hidden');
      document.getElementById('searchInput').focus();
    }

    function closeSearch() {
      document.getElementById('searchModal').classList.add('hidden');
      document.getElementById('searchInput').value = '';
      document.getElementById('searchResults').innerHTML = '';
      selectedIndex = -1;
      lastResults = [];
    }

    function search(query) {
      if (!searchIndex) return [];
      var q = query.toLowerCase();
      return searchIndex.filter(function(item) {
        return item._search.indexOf(q) !== -1;
      }).slice(0, 10);
    }

    function renderResults(results) {
      var container = document.getElementById('searchResults');
      if (results.length === 0) {
        container.innerHTML = '<div class="search-empty">No results found</div>';
        return;
      }
      container.innerHTML = results.map(function(item, i) {
        var typeLabel = item.type === 'post' ? 'Post' : 'Media';
        var subtitle = item.type === 'post' ? item.date : (item.author || item.year || '');
        return '<a href="' + item.url + '" class="search-result' + (i === selectedIndex ? ' selected' : '') + '">' +
          '<div class="search-result-content">' +
            '<span class="search-result-title">' + item.title + '</span>' +
            (subtitle ? '<span class="search-result-subtitle">' + subtitle + '</span>' : '') +
          '</div>' +
          '<span class="search-result-badge">' + typeLabel + '</span>' +
        '</a>';
      }).join('');
    }

    function updateSelection() {
      var items = document.querySelectorAll('.search-result');
      items.forEach(function(item, i) {
        item.classList.toggle('selected', i === selectedIndex);
      });
    }

    document.addEventListener('keydown', function(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchModal').classList.contains('hidden') ? openSearch() : closeSearch();
      }
      if (document.getElementById('searchModal').classList.contains('hidden')) return;
      if (e.key === 'Escape') closeSearch();
      if (e.key === 'ArrowDown') { e.preventDefault(); selectedIndex = Math.min(selectedIndex + 1, lastResults.length - 1); updateSelection(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); selectedIndex = Math.max(selectedIndex - 1, 0); updateSelection(); }
      if (e.key === 'Enter' && selectedIndex >= 0) { e.preventDefault(); document.querySelectorAll('.search-result')[selectedIndex].click(); }
    });

    document.getElementById('searchInput').addEventListener('input', function(e) {
      var query = e.target.value.trim();
      if (!query) { document.getElementById('searchResults').innerHTML = ''; return; }
      lastResults = search(query);
      selectedIndex = lastResults.length > 0 ? 0 : -1;
      renderResults(lastResults);
    });
  </script>
</body>
</html>`
}

export function Post(props: {
  title: string
  date: string
  html: string
  backlinks?: { title: string; url: string; context?: string }[]
}) {
  const backlinksHtml =
    props.backlinks && props.backlinks.length > 0
      ? `
      <div class="mt-16 pt-8 border-t border-border">
        <h3 class="font-bold text-lg mb-4">Linked to this note</h3>
        <ul class="space-y-4">
          ${props.backlinks
        .map(
          (link) => `
            <li>
              <a href="${link.url}" class="font-medium text-link hover:underline">${link.title}</a>
              ${link.context ? `<p class="text-sm text-text2 mt-1 line-clamp-2">...${link.context}...</p>` : ""}
            </li>
          `,
        )
        .join("")}
        </ul>
      </div>
    `
      : ""

  return `
    <article class="prose prose-stone prose-lg max-w-none">
      <div class="mb-8 not-prose">
        <h1 class="text-2xl font-bold mb-2">${props.title}</h1>
        <time class="text-text2 text-sm whitespace-nowrap">${props.date}</time>
      </div>
      ${props.html}
      ${backlinksHtml}
    </article>
  `
}

export function MediaGridItem(props: { title: string; url: string; image: string }) {
  return `
    <a href="${props.url}" class="block overflow-hidden rounded border border-transparent hover:border-text">
      <div class="aspect-[2/3] overflow-hidden bg-border">
        <img src="${props.image}" alt="${props.title}" loading="lazy" class="w-full h-full object-cover">
      </div>
    </a>
  `
}

export function MediaPost(props: {
  title: string
  date: string
  html: string
  image?: string
  rating?: number
  author?: string
  year?: number
  mediaType?: string
  backlinks?: { title: string; url: string; context?: string }[]
}) {
  const backlinksHtml =
    props.backlinks && props.backlinks.length > 0
      ? `
      <div class="mt-12 pt-6 border-t border-border">
        <h3 class="font-bold text-base mb-3">Linked to this</h3>
        <ul class="space-y-2">
          ${props.backlinks
        .map(
          (link) => `
            <li>
              <a href="${link.url}" class="text-link hover:underline">${link.title}</a>
            </li>
          `,
        )
        .join("")}
        </ul>
      </div>
    `
      : ""

  const stars = props.rating ? '★'.repeat(props.rating) : ''
  const typeLabel = props.mediaType === 'book' ? 'Book' : props.mediaType === 'tv' ? 'TV' : props.mediaType === 'film' ? 'Film' : 'Media'

  return `
    <article class="max-w-none">
      <!-- Media Header -->
      <div class="flex gap-6 mb-8">
        ${props.image ? `
        <div class="flex-shrink-0 w-32 md:w-40">
          <div class="aspect-[2/3] overflow-hidden rounded border border-border">
            <img src="${props.image}" alt="${props.title}" loading="eager" decoding="async" fetchpriority="high" class="w-full h-full object-cover">
          </div>
        </div>
        ` : ''}
        <div class="flex-1 min-w-0">
          <div class="text-xs text-text2 uppercase tracking-wide mb-1">${typeLabel}</div>
          <h1 class="text-xl md:text-2xl font-bold mb-2">${props.title}</h1>
          ${props.author ? `<p class="text-text2 mb-1">${props.author}</p>` : ''}
          ${props.year ? `<p class="text-text2 text-sm mb-2">${props.year}</p>` : ''}
          ${stars ? `<p class="text-lg mb-2">${stars}</p>` : ''}
          <time class="text-text2 text-xs">Added ${props.date}</time>
        </div>
      </div>

      <!-- Content -->
      <div class="prose prose-stone max-w-none">
        ${props.html}
      </div>

      ${backlinksHtml}
    </article>
  `
}


export function IndexPage(props: { posts: any[]; media: any[]; totalMedia?: number; intro?: string }) {
  // Show only top 5 posts
  const recentPosts = props.posts.slice(0, 5)

  const postList = recentPosts
    .map(
      (post) => `
    <div class="flex items-baseline justify-between py-1 group">
      <a href="${post.url}" class="font-medium group-hover:text-link transition-colors">${post.title}</a>
      <time class="text-text2 text-sm">${post.date}</time>
    </div>
  `,
    )
    .join("")

  const mediaGrid = props.media.map((item) => MediaGridItem(item)).join("")
  const totalMediaCount = props.totalMedia || props.media.length

  return `
    ${props.intro ? `<div class="prose prose-stone prose-lg max-w-none mb-12">${props.intro}</div>` : ''}

    <section class="mb-12">
      <h3 class="font-bold text-xl mb-4">Writing</h3>
      <div class="space-y-2">
        ${postList}
      </div>
      <div class="mt-4">
        <a href="/writing.html" class="inline-block text-sm text-text2 hover:text-link border-b border-border hover:border-link transition-colors">
          View all ${props.posts.length} posts →
        </a>
      </div>
    </section>

    <section>
      <h3 class="font-bold text-xl mb-4">Media</h3>
      <div class="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2">
        ${mediaGrid}
      </div>
      ${totalMediaCount > props.media.length ? `
      <div class="mt-4">
        <a href="/media.html" class="inline-block text-sm text-text2 hover:text-link border-b border-border hover:border-link transition-colors">
          View all ${totalMediaCount} items →
        </a>
      </div>
      ` : ''}
    </section>
  `
}

export function ArchivePage(props: { posts: any[]; intro?: string }) {
  const postList = props.posts
    .map(
      (post) => `
    <div class="flex items-baseline justify-between py-1 group">
      <a href="${post.url}" class="font-medium group-hover:text-link transition-colors">${post.title}</a>
      <time class="text-text2 text-sm">${post.date}</time>
    </div>
  `,
    )
    .join("")

  return `
    <section class="mb-12">
      <h1 class="font-bold text-2xl mb-8">Archive</h1>
      ${props.intro ? `<div class="prose prose-stone prose-lg max-w-none mb-8">${props.intro}</div>` : ''}
      <div class="space-y-2">
        ${postList}
      </div>
    </section>
  `
}

export function MediaPage(props: { media: { title: string; image?: string; url: string; type: string; author?: string; year?: number; rating?: number }[]; intro?: string }) {
  const escapeAttr = (str: string) => str.replace(/"/g, '&quot;').replace(/'/g, '&#39;')

  const mediaItems = props.media.map((item) => {
    const searchText = [item.title, item.author, item.year].filter(Boolean).join(' ').toLowerCase()
    return `
    <div class="media-item" data-type="${item.type}" data-search="${escapeAttr(searchText)}" data-rating="${item.rating || 0}">
      <a href="${item.url}" class="block overflow-hidden rounded border border-transparent hover:border-text">
        <div class="aspect-[2/3] overflow-hidden bg-border">
          ${item.image ? `<img src="${item.image}" alt="${item.title}" loading="lazy" class="w-full h-full object-cover">` : `<div class="w-full h-full flex items-center justify-center text-text2 text-sm p-2 text-center">${item.title}</div>`}
        </div>
        <div class="p-2">
          <h3 class="font-medium text-sm truncate">${item.title}</h3>
          ${item.author ? `<p class="text-text2 text-xs truncate">${item.author}</p>` : ''}
          <div class="flex items-center gap-2 text-xs text-text2 mt-1">
            ${item.year ? `<span>${item.year}</span>` : ''}
            ${item.rating ? `<span>${'★'.repeat(item.rating)}</span>` : ''}
          </div>
        </div>
      </a>
    </div>
  `}).join('')

  return `
    <section class="mb-12">
      <h1 class="font-bold text-2xl mb-4">Media</h1>
      ${props.intro ? `<div class="prose prose-stone prose-lg max-w-none mb-6">${props.intro}</div>` : '<p class="text-text2 mb-6">Books, films, and TV I\'ve consumed.</p>'}
      
      <!-- Search -->
      <div class="mb-4">
        <input 
          type="text" 
          id="mediaSearch" 
          placeholder="Search by title, author, year..." 
          style="background: white; border: 2px inset #999; padding: 6px 10px; width: 100%; font-family: inherit; font-size: 14px; color: #000;"
          autocomplete="off"
        >
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap items-center gap-1 sm:gap-2 mb-6 text-sm">
        <button class="media-filter active" data-filter="all">All</button>
        <button class="media-filter" data-filter="book">Books</button>
        <button class="media-filter" data-filter="film">Films</button>
        <button class="media-filter" data-filter="tv">TV</button>
        <span class="text-text2 mx-1">|</span>
        <button class="rating-filter active" data-rating="all">Any</button>
        <button class="rating-filter" data-rating="5">5★</button>
        <button class="rating-filter" data-rating="4">4★</button>
        <button class="rating-filter" data-rating="3">3★</button>
        <button class="rating-filter" data-rating="2">2★</button>
        <button class="rating-filter" data-rating="1">1★</button>
        <button class="rating-filter" data-rating="0">0★</button>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3 sm:gap-4" id="mediaGrid">
        ${mediaItems}
      </div>
      
      <p id="noResults" class="hidden text-text2 text-center py-8">No items match your filters.</p>
    </section>

    <script>
      (function() {
        var activeType = 'all';
        var activeRating = 'all';
        var searchQuery = '';
        var searchInput = document.getElementById('mediaSearch');
        var items = document.querySelectorAll('.media-item');
        var noResults = document.getElementById('noResults');
        var debounceTimer = null;
        
        function filterMedia() {
          var visibleCount = 0;
          var ratingNum = activeRating === 'all' ? -1 : parseInt(activeRating);
          
          for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var show = (activeType === 'all' || item.dataset.type === activeType) &&
                       (ratingNum === -1 || parseInt(item.dataset.rating) === ratingNum) &&
                       (!searchQuery || item.dataset.search.indexOf(searchQuery) !== -1);
            
            item.style.display = show ? '' : 'none';
            if (show) visibleCount++;
          }
          
          noResults.classList.toggle('hidden', visibleCount > 0);
        }
        
        searchInput.addEventListener('input', function() {
          if (debounceTimer) clearTimeout(debounceTimer);
          debounceTimer = setTimeout(function() {
            searchQuery = searchInput.value.toLowerCase();
            filterMedia();
          }, 50);
        });
        
        function setupFilters(selector, updateFn) {
          document.querySelectorAll(selector).forEach(function(btn) {
            btn.addEventListener('click', function() {
              document.querySelectorAll(selector).forEach(function(b) { 
                b.classList.remove('active');
              });
              btn.classList.add('active');
              updateFn(btn);
              filterMedia();
            });
          });
        }
        
        setupFilters('.media-filter', function(btn) { activeType = btn.dataset.filter; });
        setupFilters('.rating-filter', function(btn) { activeRating = btn.dataset.rating; });
      })();
    </script>
  `
}


