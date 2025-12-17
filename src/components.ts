const xpIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="theme-btn-icon xp-icon" aria-hidden="true"><rect x="3" y="3" width="7" height="7" fill="#f25022" stroke="none"/><rect x="14" y="3" width="7" height="7" fill="#7fba00" stroke="none"/><rect x="3" y="14" width="7" height="7" fill="#00a4ef" stroke="none"/><rect x="14" y="14" width="7" height="7" fill="#ffb900" stroke="none"/></svg>`
const macIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="theme-btn-icon mac-icon" aria-hidden="true"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" fill="currentColor"/></svg>`
const brutalistIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="theme-btn-icon brutalist-icon" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`

export function Layout(props: { title: string; content: string; description?: string }) {
  const metaDescription = props.description || "Essays and media reviews."
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>${props.title} | Ryan's Blog</title>
  <meta name="description" content="${metaDescription}">
  
  <!-- Mobile Web App Capable -->
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="theme-color" content="#fafaf8" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#1a1a1a" media="(prefers-color-scheme: dark)">
  
  <!-- Prevent phone number detection -->
  <meta name="format-detection" content="telephone=no">
  
  <!-- Resource Hints for Performance -->
  <link rel="preconnect" href="https://m.media-amazon.com" crossorigin>
  <link rel="dns-prefetch" href="https://m.media-amazon.com">
  <link rel="preload" href="/style.css" as="style">
  <link rel="prefetch" href="/search.json" as="fetch" crossorigin>
  
  <!-- Stylesheet -->
  <link rel="stylesheet" href="/style.css">
  
  <!-- Favicon -->
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>✒</text></svg>">
  <link rel="apple-touch-icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>✒</text></svg>">
  
  <!-- Instant Theme Application (prevents FOUC) -->
  <script>
    (function() {
      var theme = localStorage.getItem('site-theme') || 'brutalist';
      document.documentElement.setAttribute('data-theme', theme);
      // Update theme-color meta based on theme
      var themeColors = { brutalist: '#fafaf8', xp: '#3a6ea5', mac: '#dddddd' };
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', themeColors[theme] || '#fafaf8');
    })();
  </script>
  
  <!-- Critical CSS for instant render -->
  <style>
    /* Prevent flash */
    html:not([data-theme]) body { opacity: 0; }
    html[data-theme] body { opacity: 1; }
    /* Smooth scroll with reduced motion respect */
    @media (prefers-reduced-motion: no-preference) {
      html { scroll-behavior: smooth; }
    }
    /* Safe area padding for notched devices */
    body { padding-left: env(safe-area-inset-left); padding-right: env(safe-area-inset-right); }
    /* Prevent text size adjustment on orientation change */
    html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
    /* Better touch behavior */
    * { -webkit-tap-highlight-color: transparent; }
    a, button { touch-action: manipulation; }
    /* Prevent pull-to-refresh on overscroll */
    body { overscroll-behavior-y: contain; }
  </style>
</head>
<body class="selection:bg-ui">
  <!-- Theme Switcher with instant switching, haptic feedback on mobile -->
  <nav class="theme-switcher print:hidden" role="navigation" aria-label="Theme selection">
    <button onclick="setTheme('brutalist')" class="theme-btn" title="Brutalist" aria-label="Switch to Brutalist theme" aria-pressed="false" data-theme-btn="brutalist">
      ${brutalistIcon}
    </button>
    <button onclick="setTheme('mac')" class="theme-btn" title="Mac OS Classic" aria-label="Switch to Mac OS Classic theme" aria-pressed="false" data-theme-btn="mac">
      ${macIcon}
    </button>
    <button onclick="setTheme('xp')" class="theme-btn" title="Windows XP" aria-label="Switch to Windows XP theme" aria-pressed="false" data-theme-btn="xp">
      ${xpIcon}
    </button>
  </nav>

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
          <button onclick="openSearch()" class="search-trigger ml-auto flex items-center gap-1.5 text-text2 hover:text-text transition-colors" title="Search (⌘K)" aria-label="Open search dialog" aria-keyshortcuts="Meta+K Control+K">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
            <kbd class="hidden sm:inline text-[10px] px-1.5 py-0.5 border border-border rounded bg-ui font-mono">⌘K</kbd>
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
      
      // Update theme-color meta for browser chrome
      var themeColors = { brutalist: '#fafaf8', xp: '#3a6ea5', mac: '#dddddd' };
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', themeColors[theme] || '#fafaf8');
      
      // Update aria-pressed states
      document.querySelectorAll('[data-theme-btn]').forEach(function(btn) {
        btn.setAttribute('aria-pressed', btn.dataset.themeBtn === theme ? 'true' : 'false');
      });
      
      // Haptic feedback on mobile (if supported)
      if (navigator.vibrate) navigator.vibrate(10);
    }
    
    // Initialize aria-pressed on load
    (function() {
      var currentTheme = localStorage.getItem('site-theme') || 'brutalist';
      document.querySelectorAll('[data-theme-btn]').forEach(function(btn) {
        btn.setAttribute('aria-pressed', btn.dataset.themeBtn === currentTheme ? 'true' : 'false');
      });
    })();
    
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

  <!-- Search Modal - Accessible dialog -->
  <div id="searchModal" class="search-modal hidden" role="dialog" aria-modal="true" aria-label="Search posts and media">
    <div class="search-backdrop" onclick="closeSearch()" aria-hidden="true"></div>
    <div class="search-container" role="search">
      <div class="search-input-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
        <input type="search" id="searchInput" placeholder="Search posts and media..." autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="search" aria-label="Search" aria-describedby="searchHint">
        <kbd class="search-kbd" aria-hidden="true">esc</kbd>
      </div>
      <p id="searchHint" class="sr-only">Use arrow keys to navigate results, Enter to select, Escape to close</p>
      <div id="searchResults" class="search-results" role="listbox" aria-label="Search results"></div>
    </div>
  </div>

  <script>
    // ULTRA FAST SEARCH - preloaded, debounced, optimized, accessible
    let searchData = null;
    let searchIndex = null;
    let selectedIndex = -1;
    let debounceTimer = null;
    let lastResults = [];
    let previousFocusEl = null;

    // Preload search data with retry logic
    (function preloadSearch() {
      var retries = 0;
      function load() {
        fetch('/search.json', { cache: 'default' })
          .then(function(r) { return r.json(); })
          .then(function(data) {
            searchData = data;
            searchIndex = data.map(function(item) {
              return Object.assign({}, item, {
                _search: [item.title, item.author, item.year].filter(Boolean).join(' ').toLowerCase()
              });
            });
          })
          .catch(function() {
            if (retries++ < 2) setTimeout(load, 1000);
          });
      }
      // Use requestIdleCallback for non-blocking preload
      if ('requestIdleCallback' in window) {
        requestIdleCallback(load, { timeout: 2000 });
      } else {
        setTimeout(load, 100);
      }
    })();

    function openSearch() {
      previousFocusEl = document.activeElement;
      var modal = document.getElementById('searchModal');
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      var input = document.getElementById('searchInput');
      // Small delay ensures iOS keyboard opens correctly
      requestAnimationFrame(function() {
        input.focus({ preventScroll: true });
      });
      // Trap focus in modal
      modal.addEventListener('keydown', trapFocus);
    }

    function closeSearch() {
      var modal = document.getElementById('searchModal');
      modal.classList.add('hidden');
      document.body.style.overflow = '';
      document.getElementById('searchInput').value = '';
      document.getElementById('searchResults').innerHTML = '';
      selectedIndex = -1;
      lastResults = [];
      modal.removeEventListener('keydown', trapFocus);
      // Restore focus
      if (previousFocusEl) previousFocusEl.focus();
    }
    
    function trapFocus(e) {
      if (e.key !== 'Tab') return;
      var modal = document.getElementById('searchModal');
      var focusable = modal.querySelectorAll('input, button, a[href]');
      var first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }

    // Ultra-fast search with fuzzy matching
    function search(query) {
      if (!searchIndex) return [];
      var q = query.toLowerCase();
      var results = [];
      for (var i = 0; i < searchIndex.length; i++) {
        var item = searchIndex[i];
        var idx = item._search.indexOf(q);
        if (idx !== -1) {
          results.push(Object.assign({}, item, { _score: 1000 - idx }));
        }
      }
      results.sort(function(a, b) { return b._score - a._score; });
      return results.slice(0, 10);
    }

    function renderResults(results) {
      var container = document.getElementById('searchResults');
      if (results.length === 0) {
        container.innerHTML = '<div class="search-empty" role="status">No results found</div>';
        return;
      }
      var html = '';
      for (var i = 0; i < results.length; i++) {
        var item = results[i];
        var typeLabel = item.type === 'post' ? 'Post' : (item.mediaType || 'Media').charAt(0).toUpperCase() + (item.mediaType || 'media').slice(1);
        var typeBadgeClass = item.type === 'post' ? 'badge-post' : 'badge-media';
        var subtitle = item.type === 'post' ? item.date : (item.author || item.year || '');
        var isSelected = i === selectedIndex;
        html += '<a href="' + item.url + '" class="search-result' + (isSelected ? ' selected' : '') + '" role="option" aria-selected="' + isSelected + '" id="search-result-' + i + '">' +
          '<div class="search-result-content">' +
            '<span class="search-result-title">' + escapeHtml(item.title) + '</span>' +
            (subtitle ? '<span class="search-result-subtitle">' + escapeHtml(String(subtitle)) + '</span>' : '') +
          '</div>' +
          '<span class="search-result-badge ' + typeBadgeClass + '">' + typeLabel + '</span>' +
        '</a>';
      }
      container.innerHTML = html;
      // Update aria-activedescendant
      var input = document.getElementById('searchInput');
      input.setAttribute('aria-activedescendant', selectedIndex >= 0 ? 'search-result-' + selectedIndex : '');
    }
    
    function escapeHtml(str) {
      var div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    function updateSelection() {
      var items = document.querySelectorAll('.search-result');
      for (var i = 0; i < items.length; i++) {
        var isSelected = i === selectedIndex;
        items[i].classList.toggle('selected', isSelected);
        items[i].setAttribute('aria-selected', isSelected);
      }
      var input = document.getElementById('searchInput');
      input.setAttribute('aria-activedescendant', selectedIndex >= 0 ? 'search-result-' + selectedIndex : '');
      // Scroll selected into view
      if (selectedIndex >= 0 && items[selectedIndex]) {
        items[selectedIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }

    document.addEventListener('keydown', function(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        var modal = document.getElementById('searchModal');
        modal.classList.contains('hidden') ? openSearch() : closeSearch();
        return;
      }

      var modal = document.getElementById('searchModal');
      if (modal.classList.contains('hidden')) return;

      if (e.key === 'Escape') { closeSearch(); return; }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, lastResults.length - 1);
        updateSelection();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, 0);
        updateSelection();
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        var items = document.querySelectorAll('.search-result');
        if (items[selectedIndex]) items[selectedIndex].click();
      }
    });

    document.getElementById('searchInput').addEventListener('input', function(e) {
      var query = e.target.value.trim();
      
      if (debounceTimer) clearTimeout(debounceTimer);
      
      if (!query) {
        document.getElementById('searchResults').innerHTML = '';
        selectedIndex = -1;
        lastResults = [];
        return;
      }

      // Debounce: 50ms feels instant but prevents layout thrashing
      debounceTimer = setTimeout(function() {
        lastResults = search(query);
        selectedIndex = lastResults.length > 0 ? 0 : -1;
        renderResults(lastResults);
      }, 50);
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
    <a href="${props.url}" class="group block overflow-hidden rounded border border-transparent hover:border-text transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link">
      <div class="aspect-[2/3] overflow-hidden bg-border relative">
        <img 
          src="${props.image}" 
          alt="${props.title}" 
          loading="lazy" 
          decoding="async"
          fetchpriority="low"
          class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105 opacity-90 group-hover:opacity-100 will-change-transform"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
        >
        <div class="hidden absolute inset-0 items-center justify-center text-text2 text-xs p-2 text-center bg-ui">${props.title}</div>
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
  const escapeAttr = (str: string) => str.replace(/"/g, '&quot;').replace(/'/g, '&#39;')
  
  const mediaItems = props.media.map((item, index) => {
    const searchText = [item.title, item.author, item.year].filter(Boolean).join(' ').toLowerCase()
    const isPriority = index < 6 // First 6 items load eagerly
    return `
    <article class="media-item" data-type="${item.type}" data-search="${escapeAttr(searchText)}" data-rating="${item.rating || 0}">
      <a href="${item.url}" class="group block overflow-hidden rounded border border-transparent hover:border-text transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link">
        <div class="aspect-[2/3] overflow-hidden bg-border relative">
          ${item.image ? `<img 
            src="${item.image}" 
            alt="" 
            loading="${isPriority ? 'eager' : 'lazy'}" 
            decoding="async"
            ${isPriority ? 'fetchpriority="high"' : 'fetchpriority="low"'}
            class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105 opacity-90 group-hover:opacity-100 will-change-transform"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
          ><div class="hidden absolute inset-0 items-center justify-center text-text2 text-xs p-2 text-center bg-ui">${item.title || 'Untitled'}</div>` : `<div class="w-full h-full flex items-center justify-center text-text2 text-sm p-2 text-center">${item.title || 'Untitled'}</div>`}
        </div>
        <div class="p-2">
          <h3 class="font-medium text-sm truncate">${item.title || 'Untitled'}</h3>
          ${item.author ? `<p class="text-text2 text-xs truncate">${item.author}</p>` : ''}
          <div class="flex items-center gap-2 text-xs text-text2 mt-1">
            ${item.year ? `<span>${item.year}</span>` : ''}
            ${item.rating ? `<span aria-label="${item.rating} out of 5 stars">${'★'.repeat(item.rating)}</span>` : ''}
          </div>
        </div>
      </a>
    </article>
  `}).join('')

  return `
    <section class="mb-12">
      <h1 class="font-bold text-2xl mb-4">Media</h1>
      <p class="text-text2 mb-6">Books, films, and TV I've consumed.</p>
      
      <!-- Search -->
      <div class="mb-4">
        <label for="mediaSearch" class="sr-only">Search media</label>
        <input 
          type="search" 
          id="mediaSearch" 
          placeholder="Search by title, author, year..." 
          class="w-full px-3 py-2.5 text-base border border-border rounded bg-bg focus:outline-none focus:ring-2 focus:ring-link focus:border-transparent"
          autocomplete="off"
          autocapitalize="off"
          autocorrect="off"
          spellcheck="false"
          enterkeyhint="search"
        >
      </div>

      <!-- Filters - horizontal scroll on mobile with momentum -->
      <div class="flex flex-col sm:flex-row sm:items-center gap-3 mb-6" role="group" aria-label="Filter media">
        <!-- Type Filters -->
        <div class="flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide snap-x snap-mandatory" role="radiogroup" aria-label="Filter by type">
          <button class="media-filter active snap-start min-h-[44px] px-4 py-2 text-sm border border-border rounded hover:bg-ui whitespace-nowrap transition-colors" data-filter="all" role="radio" aria-checked="true">All</button>
          <button class="media-filter snap-start min-h-[44px] px-4 py-2 text-sm border border-border rounded hover:bg-ui whitespace-nowrap transition-colors" data-filter="book" role="radio" aria-checked="false">Books</button>
          <button class="media-filter snap-start min-h-[44px] px-4 py-2 text-sm border border-border rounded hover:bg-ui whitespace-nowrap transition-colors" data-filter="film" role="radio" aria-checked="false">Films</button>
          <button class="media-filter snap-start min-h-[44px] px-4 py-2 text-sm border border-border rounded hover:bg-ui whitespace-nowrap transition-colors" data-filter="tv" role="radio" aria-checked="false">TV</button>
        </div>
        
        <!-- Rating Filters -->
        <div class="flex gap-1.5 items-center overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide snap-x snap-mandatory" role="radiogroup" aria-label="Filter by rating">
          <span class="text-sm text-text2 whitespace-nowrap flex-shrink-0">Rating:</span>
          <button class="rating-filter active snap-start min-h-[44px] px-3 py-2 text-sm border border-border rounded hover:bg-ui whitespace-nowrap transition-colors" data-rating="all" role="radio" aria-checked="true">Any</button>
          <button class="rating-filter snap-start min-h-[44px] px-3 py-2 text-sm border border-border rounded hover:bg-ui transition-colors" data-rating="5" role="radio" aria-checked="false" aria-label="5 stars">★★★★★</button>
          <button class="rating-filter snap-start min-h-[44px] px-3 py-2 text-sm border border-border rounded hover:bg-ui transition-colors" data-rating="4" role="radio" aria-checked="false" aria-label="4 stars">★★★★</button>
          <button class="rating-filter snap-start min-h-[44px] px-3 py-2 text-sm border border-border rounded hover:bg-ui transition-colors" data-rating="3" role="radio" aria-checked="false" aria-label="3 stars">★★★</button>
          <button class="rating-filter snap-start min-h-[44px] px-3 py-2 text-sm border border-border rounded hover:bg-ui transition-colors" data-rating="2" role="radio" aria-checked="false" aria-label="2 stars">★★</button>
          <button class="rating-filter snap-start min-h-[44px] px-3 py-2 text-sm border border-border rounded hover:bg-ui transition-colors" data-rating="1" role="radio" aria-checked="false" aria-label="1 star">★</button>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3 sm:gap-4" id="mediaGrid" role="list" aria-live="polite">
        ${mediaItems}
      </div>
      
      <p id="noResults" class="hidden text-text2 text-center py-8" role="status">No items match your filters.</p>
      <p id="resultsCount" class="sr-only" role="status" aria-live="polite"></p>
    </section>

    <script>
      (function() {
        var activeType = 'all';
        var activeRating = 'all';
        var searchQuery = '';
        var searchInput = document.getElementById('mediaSearch');
        var items = document.querySelectorAll('.media-item');
        var noResults = document.getElementById('noResults');
        var resultsCount = document.getElementById('resultsCount');
        var debounceTimer = null;
        var totalItems = items.length;
        
        function filterMedia() {
          var visibleCount = 0;
          var ratingNum = activeRating === 'all' ? -1 : parseInt(activeRating);
          
          // Use requestAnimationFrame for smooth DOM updates
          requestAnimationFrame(function() {
            for (var i = 0; i < items.length; i++) {
              var item = items[i];
              var show = (activeType === 'all' || item.dataset.type === activeType) &&
                         (ratingNum === -1 || parseInt(item.dataset.rating) === ratingNum) &&
                         (!searchQuery || item.dataset.search.indexOf(searchQuery) !== -1);
              
              item.style.display = show ? '' : 'none';
              if (show) visibleCount++;
            }
            
            noResults.classList.toggle('hidden', visibleCount > 0);
            // Announce results to screen readers
            resultsCount.textContent = visibleCount === totalItems 
              ? 'Showing all ' + totalItems + ' items' 
              : 'Showing ' + visibleCount + ' of ' + totalItems + ' items';
          });
        }
        
        searchInput.addEventListener('input', function() {
          if (debounceTimer) clearTimeout(debounceTimer);
          debounceTimer = setTimeout(function() {
            searchQuery = searchInput.value.toLowerCase();
            filterMedia();
          }, 50);
        });
        
        // Unified filter button handler
        function setupFilters(selector, updateFn) {
          document.querySelectorAll(selector).forEach(function(btn) {
            btn.addEventListener('click', function() {
              document.querySelectorAll(selector).forEach(function(b) { 
                b.classList.remove('active', 'bg-ui');
                b.setAttribute('aria-checked', 'false');
              });
              btn.classList.add('active', 'bg-ui');
              btn.setAttribute('aria-checked', 'true');
              updateFn(btn);
              filterMedia();
              // Haptic feedback
              if (navigator.vibrate) navigator.vibrate(10);
            });
          });
        }
        
        setupFilters('.media-filter', function(btn) { activeType = btn.dataset.filter; });
        setupFilters('.rating-filter', function(btn) { activeRating = btn.dataset.rating; });
      })();
    </script>
  `
}

