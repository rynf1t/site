const xpIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="theme-btn-icon xp-icon"><rect x="3" y="3" width="7" height="7" fill="#f25022" stroke="none"/><rect x="14" y="3" width="7" height="7" fill="#7fba00" stroke="none"/><rect x="3" y="14" width="7" height="7" fill="#00a4ef" stroke="none"/><rect x="14" y="14" width="7" height="7" fill="#ffb900" stroke="none"/></svg>`
const macIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="theme-btn-icon mac-icon"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" fill="currentColor"/></svg>`
const brutalistIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="theme-btn-icon brutalist-icon"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`

export function Layout(props: { title: string; content: string; description?: string }) {
  const metaDescription = props.description || "Essays and media reviews."
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${props.title} | Ryan's Blog</title>
  <meta name="description" content="${metaDescription}">
  <link rel="stylesheet" href="/style.css">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>✒</text></svg>">
  <script>
    (function() {
      var theme = localStorage.getItem('site-theme') || 'brutalist';
      document.documentElement.setAttribute('data-theme', theme);
    })();
  </script>
  <style>
    /* Prevent flash using opacity instead of visibility for smoother transition */
    html:not([data-theme]) body { opacity: 0; }
    html[data-theme] body { opacity: 1; }
  </style>
</head>
<body class="selection:bg-ui">
  <!-- Mobile Warning Modal -->
  <div class="mobile-warning" id="mobileWarning">
      <div class="mobile-warning-content">
          <div class="mobile-warning-title">
              <div class="close-box" onclick="closeMobileWarning()"></div>
              <span>Mobile Device</span>
          </div>
          <div class="mobile-warning-body">
              <p>The Mac OS Classic theme is designed for desktop displays. For optimal mobile viewing, please switch to the Brutalist theme.</p>
              <div class="mobile-warning-buttons">
                  <button class="mac-button" onclick="setTheme('brutalist'); closeMobileWarning()">Brutalist</button>
                  <button class="mac-button" onclick="closeMobileWarning()">Continue</button>
              </div>
          </div>
      </div>
  </div>

  <!-- Theme Switcher with instant switching, no transitions on theme change -->
  <div class="theme-switcher print:hidden">
    <button onclick="setTheme('brutalist')" class="theme-btn" title="Brutalist" aria-label="Switch to Brutalist theme">
      ${brutalistIcon}
    </button>
    <button onclick="setTheme('mac')" class="theme-btn" title="Mac OS Classic" aria-label="Switch to Mac OS Classic theme">
      ${macIcon}
    </button>
    <button onclick="setTheme('xp')" class="theme-btn" title="Windows XP" aria-label="Switch to Windows XP theme">
      ${xpIcon}
    </button>
  </div>

  <div class="theme-window max-w-[900px] mx-auto">
    <!-- Window Title Bar -->
    <div class="window-title-bar">
      <!-- Mac: close box + stripes + title + stripes + zoom box -->
      <div class="mac-close-box" onclick="closeWindow()"></div>
      <span class="mac-stripes"></span>
      <span class="mac-title">Ryan's Blog</span>
      <span class="mac-stripes"></span>
      <div class="mac-zoom-box" onclick="maximizeWindow()"></div>
      
      <!-- XP: icon + title on left -->
      <div class="xp-title-content">
        <svg viewBox="0 0 16 16" class="xp-title-icon" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="7" fill="#4a90d9" stroke="white" stroke-width="1"/>
          <text x="8" y="11" text-anchor="middle" fill="white" font-size="8" font-weight="bold">R</text>
        </svg>
        <span>Ryan's Blog</span>
      </div>
      
      <!-- XP Controls on right -->
      <div class="xp-controls">
        <button class="xp-btn" onclick="minimizeWindow()" title="Minimize">_</button>
        <button class="xp-btn" onclick="maximizeWindow()" title="Maximize">□</button>
        <button class="xp-close" onclick="closeWindow()" title="Close">✕</button>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="theme-content p-5 md:p-8 bg-bg">
      <!-- Header -->
      <header class="mb-8 pb-4 border-b border-border">
        <nav class="flex flex-wrap items-center gap-3 md:gap-4">
          <a href="/" class="text-base md:text-lg text-link no-underline hover:underline">home</a>
          <a href="/writing.html" class="text-base md:text-lg text-link no-underline hover:underline">writing</a>
          <a href="/media.html" class="text-base md:text-lg text-link no-underline hover:underline">media</a>
          <a href="/tools.html" class="text-base md:text-lg text-link no-underline hover:underline">tools</a>
          <a href="/about.html" class="text-base md:text-lg text-link no-underline hover:underline">about</a>
          <button onclick="openSearch()" class="ml-auto flex items-center gap-1 text-text2 hover:text-text transition-colors" title="Search (⌘K)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
            <kbd class="hidden sm:inline text-[10px] px-1 py-0.5 border border-border rounded bg-ui">⌘K</kbd>
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
    function setTheme(theme) {
      document.body.setAttribute('data-theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('site-theme', theme);
      
      // Check for mobile warning on Mac theme
      if (theme === 'mac' && window.innerWidth < 768) {
         if (!localStorage.getItem('mobile-warning-dismissed')) {
            document.getElementById('mobileWarning').classList.add('show');
         }
      }
    }

    function closeMobileWarning() {
        document.getElementById('mobileWarning').classList.remove('show');
        localStorage.setItem('mobile-warning-dismissed', 'true');
    }
    
    function minimizeWindow() {
        const content = document.querySelector('.theme-content');
        if (content.style.display === 'none') {
            content.style.display = 'block';
        } else {
            content.style.display = 'none';
        }
    }
    
    function maximizeWindow() {
        const windowEl = document.querySelector('.theme-window');
        const isMaximized = localStorage.getItem('window-maximized') === 'true';
        if (isMaximized) {
            windowEl.style.maxWidth = '900px';
            windowEl.style.marginTop = '';
            localStorage.setItem('window-maximized', 'false');
        } else {
            windowEl.style.maxWidth = '100%';
            windowEl.style.marginTop = '60px'; // Clear the theme switcher
            localStorage.setItem('window-maximized', 'true');
        }
    }
    
    function closeWindow() {
        if (confirm('Close this window?')) {
            window.location.href = '/';
        }
    }
    
    // Initial check
    var currentTheme = localStorage.getItem('site-theme') || 'brutalist';
    if (currentTheme === 'mac' && window.innerWidth < 768 && !localStorage.getItem('mobile-warning-dismissed')) {
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('mobileWarning').classList.add('show');
        });
    }
    
    // Apply maximize state on load
    if (localStorage.getItem('window-maximized') === 'true') {
        document.addEventListener('DOMContentLoaded', function() {
            var windowEl = document.querySelector('.theme-window');
            if (windowEl) {
                windowEl.style.maxWidth = '100%';
                windowEl.style.marginTop = '60px';
            }
        });
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
    let searchData = null;
    let selectedIndex = -1;

    async function loadSearchData() {
      if (searchData) return searchData;
      try {
        const res = await fetch('/search.json');
        searchData = await res.json();
        return searchData;
      } catch (e) {
        console.error('Failed to load search data:', e);
        return [];
      }
    }

    function openSearch() {
      document.getElementById('searchModal').classList.remove('hidden');
      document.getElementById('searchInput').focus();
      loadSearchData();
    }

    function closeSearch() {
      document.getElementById('searchModal').classList.add('hidden');
      document.getElementById('searchInput').value = '';
      document.getElementById('searchResults').innerHTML = '';
      selectedIndex = -1;
    }

    function fuzzyMatch(query, text) {
      query = String(query || '').toLowerCase();
      text = String(text || '').toLowerCase();
      if (text.includes(query)) return 1000 - text.indexOf(query);
      var qi = 0;
      var score = 0;
      for (var ti = 0; ti < text.length && qi < query.length; ti++) {
        if (text[ti] === query[qi]) {
          score += 10;
          qi++;
        }
      }
      return qi === query.length ? score : 0;
    }

    function renderResults(results) {
      const container = document.getElementById('searchResults');
      if (results.length === 0) {
        container.innerHTML = '<div class="search-empty">No results found</div>';
        return;
      }
      container.innerHTML = results.slice(0, 10).map(function(item, i) {
        var typeLabel = item.type === 'post' ? 'Post' : (item.mediaType || 'Media').charAt(0).toUpperCase() + (item.mediaType || 'media').slice(1);
        var typeBadgeClass = item.type === 'post' ? 'badge-post' : 'badge-media';
        var subtitle = item.type === 'post' ? item.date : (item.author || item.year || '');
        var selectedClass = i === selectedIndex ? 'selected' : '';
        var subtitleHtml = subtitle ? '<span class="search-result-subtitle">' + subtitle + '</span>' : '';
        return '<a href="' + item.url + '" class="search-result ' + selectedClass + '" data-index="' + i + '">' +
          '<div class="search-result-content">' +
            '<span class="search-result-title">' + item.title + '</span>' +
            subtitleHtml +
          '</div>' +
          '<span class="search-result-badge ' + typeBadgeClass + '">' + typeLabel + '</span>' +
        '</a>';
      }).join('');
    }

    function updateSelection(results) {
      const items = document.querySelectorAll('.search-result');
      items.forEach((item, i) => {
        item.classList.toggle('selected', i === selectedIndex);
      });
    }

    document.addEventListener('keydown', async (e) => {
      // Open with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const modal = document.getElementById('searchModal');
        if (modal.classList.contains('hidden')) {
          openSearch();
        } else {
          closeSearch();
        }
        return;
      }

      // Handle keys when modal is open
      const modal = document.getElementById('searchModal');
      if (modal.classList.contains('hidden')) return;

      if (e.key === 'Escape') {
        closeSearch();
        return;
      }

      const results = document.querySelectorAll('.search-result');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
        updateSelection();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, 0);
        updateSelection();
      } else if (e.key === 'Enter' && selectedIndex >= 0 && results[selectedIndex]) {
        e.preventDefault();
        results[selectedIndex].click();
      }
    });

    document.getElementById('searchInput').addEventListener('input', async (e) => {
      const query = e.target.value.trim();
      selectedIndex = -1;
      
      if (!query) {
        document.getElementById('searchResults').innerHTML = '';
        return;
      }

      const data = await loadSearchData();
      const scored = data.map(function(item) {
        var searchText = [item.title, item.author, item.year].filter(Boolean).join(' ');
        return Object.assign({}, item, { score: fuzzyMatch(query, searchText) });
      }).filter(function(item) { return item.score > 0; });
      
      scored.sort(function(a, b) { return b.score - a.score; });
      
      if (scored.length > 0) selectedIndex = 0;
      renderResults(scored);
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
    <a href="${props.url}" class="group block overflow-hidden rounded border border-transparent hover:border-text transition-colors">
      <div class="aspect-[2/3] overflow-hidden bg-border relative">
        <img src="${props.image}" alt="${props.title}" class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105 opacity-90 group-hover:opacity-100">
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
            <img src="${props.image}" alt="${props.title}" class="w-full h-full object-cover">
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

export function IndexPage(props: { posts: any[]; media: any[]; totalMedia?: number }) {
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

export function ArchivePage(props: { posts: any[] }) {
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
      <div class="space-y-2">
        ${postList}
      </div>
    </section>
  `
}

export function MediaPage(props: { media: { title: string; image?: string; url: string; type: string; author?: string; year?: number; rating?: number }[] }) {
  const mediaItems = props.media.map(item => {
    const searchText = [item.title, item.author, item.year].filter(Boolean).join(' ').toLowerCase()
    return `
    <div class="media-item" data-type="${item.type}" data-search="${searchText}" data-rating="${item.rating || 0}">
      <a href="${item.url}" class="group block overflow-hidden rounded border border-transparent hover:border-text transition-colors">
        <div class="aspect-[2/3] overflow-hidden bg-border relative">
          ${item.image ? `<img src="${item.image}" alt="${item.title || ''}" class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105 opacity-90 group-hover:opacity-100">` : `<div class="w-full h-full flex items-center justify-center text-text2 text-sm p-2 text-center">${item.title || 'Untitled'}</div>`}
        </div>
        <div class="p-2">
          <h3 class="font-medium text-sm truncate">${item.title || 'Untitled'}</h3>
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
      <p class="text-text2 mb-6">Books, films, and TV I've consumed.</p>
      
      <!-- Search -->
      <div class="mb-4">
        <input 
          type="text" 
          id="mediaSearch" 
          placeholder="Search by title, author, year..." 
          class="w-full px-3 py-2 text-sm border border-border rounded bg-bg focus:outline-none focus:border-text"
        >
      </div>

      <!-- Filters -->
      <div class="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <!-- Type Filters -->
        <div class="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          <button class="media-filter active px-3 py-1.5 text-sm border border-border rounded hover:bg-ui whitespace-nowrap" data-filter="all">All</button>
          <button class="media-filter px-3 py-1.5 text-sm border border-border rounded hover:bg-ui whitespace-nowrap" data-filter="book">Books</button>
          <button class="media-filter px-3 py-1.5 text-sm border border-border rounded hover:bg-ui whitespace-nowrap" data-filter="film">Films</button>
          <button class="media-filter px-3 py-1.5 text-sm border border-border rounded hover:bg-ui whitespace-nowrap" data-filter="tv">TV</button>
        </div>
        
        <!-- Rating Filters -->
        <div class="flex gap-1.5 items-center overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          <span class="text-sm text-text2 whitespace-nowrap">Rating:</span>
          <button class="rating-filter active px-2 py-1 text-sm border border-border rounded hover:bg-ui whitespace-nowrap" data-rating="all">Any</button>
          <button class="rating-filter px-2 py-1 text-sm border border-border rounded hover:bg-ui" data-rating="5">★★★★★</button>
          <button class="rating-filter px-2 py-1 text-sm border border-border rounded hover:bg-ui" data-rating="4">★★★★</button>
          <button class="rating-filter px-2 py-1 text-sm border border-border rounded hover:bg-ui" data-rating="3">★★★</button>
          <button class="rating-filter px-2 py-1 text-sm border border-border rounded hover:bg-ui" data-rating="2">★★</button>
          <button class="rating-filter px-2 py-1 text-sm border border-border rounded hover:bg-ui" data-rating="1">★</button>
        </div>
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
        
        function filterMedia() {
          var items = document.querySelectorAll('.media-item');
          var visibleCount = 0;
          
          items.forEach(function(item) {
            var matchesType = activeType === 'all' || item.dataset.type === activeType;
            var itemRating = parseInt(item.dataset.rating) || 0;
            var matchesRating = activeRating === 'all' || itemRating === parseInt(activeRating);
            var matchesSearch = !searchQuery || item.dataset.search.includes(searchQuery);
            
            if (matchesType && matchesRating && matchesSearch) {
              item.style.display = 'block';
              visibleCount++;
            } else {
              item.style.display = 'none';
            }
          });
          
          document.getElementById('noResults').classList.toggle('hidden', visibleCount > 0);
        }
        
        searchInput.addEventListener('input', function() {
          searchQuery = searchInput.value.toLowerCase();
          filterMedia();
        });
        
        document.querySelectorAll('.media-filter').forEach(function(btn) {
          btn.addEventListener('click', function() {
            document.querySelectorAll('.media-filter').forEach(function(b) { b.classList.remove('active', 'bg-ui'); });
            btn.classList.add('active', 'bg-ui');
            activeType = btn.dataset.filter;
            filterMedia();
          });
        });
        
        document.querySelectorAll('.rating-filter').forEach(function(btn) {
          btn.addEventListener('click', function() {
            document.querySelectorAll('.rating-filter').forEach(function(b) { b.classList.remove('active', 'bg-ui'); });
            btn.classList.add('active', 'bg-ui');
            activeRating = btn.dataset.rating;
            filterMedia();
          });
        });
      })();
    </script>
  `
}

