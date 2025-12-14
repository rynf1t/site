// Auto-inject back to tools link on tool pages
(function() {
    // Only run on tool pages (in /tools/ directory)
    if (window.location.pathname.includes('/tools/') && 
        window.location.pathname.endsWith('.html')) {
        
        // Create back link
        const backLink = document.createElement('a');
        backLink.href = '/tools';
        backLink.textContent = '← Back to Tools';
        backLink.style.cssText = `
            display: inline-block;
            margin-bottom: 2rem;
            padding: 0.5rem 1rem;
            color: #1a1a1a;
            text-decoration: none;
            border: 1px solid #ddd;
            font-family: "Times New Roman", Times, serif;
            font-size: 0.9rem;
            transition: all 0.2s;
        `;
        
        backLink.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f5f5f5';
            this.style.borderColor = '#1a1a1a';
        });
        
        backLink.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
            this.style.borderColor = '#ddd';
        });
        
        // Insert before first h1, or at start of body if no h1
        const firstH1 = document.querySelector('h1');
        if (firstH1 && firstH1.parentNode) {
            firstH1.parentNode.insertBefore(backLink, firstH1);
        } else if (document.body) {
            document.body.insertBefore(backLink, document.body.firstChild);
        }
    }
})();

