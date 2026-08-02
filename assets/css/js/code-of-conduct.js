 document.addEventListener("DOMContentLoaded", () => {
      (() => {
        const progressBar = document.getElementById('page-progress');
        const backToTop = document.getElementById('back-to-top');
        const searchInput = document.getElementById('policy-search');
        const searchClear = document.getElementById('search-clear');
        const searchLive = document.getElementById('search-live');
        const allCards = document.querySelectorAll('.policy-card, .contact-premium');
        const searchEmpty = document.getElementById('search-empty');
        const desktopTocLinks = document.querySelectorAll('#sidebar-toc a');
        const mobileTocLinks = document.querySelectorAll('.mobile-toc a');
        const mobileToc = document.getElementById('mobile-toc');

        // Progress bar & back-to-top
        if (progressBar && backToTop) {
          window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
            progressBar.style.width = progress + '%';
            backToTop.classList.toggle('show', scrollTop > 600);
          }, { passive: true });
        }
        if (backToTop) {
          backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        }

        // Intersection Observer: reveal cards + active TOC
        const observer = new IntersectionObserver((entries) => {
          let bestEntry = null;
          let bestRatio = 0;
          entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.classList.contains('policy-card')) {
              entry.target.classList.add('revealed');
            }
            if (entry.intersectionRatio > bestRatio) {
              bestRatio = entry.intersectionRatio;
              bestEntry = entry;
            }
          });
          if (bestEntry && bestRatio > 0) {
            const id = bestEntry.target.getAttribute('id');
            desktopTocLinks.forEach(link => {
              link.classList.toggle('active-toc', link.getAttribute('href') === `#${id}`);
            });
            mobileTocLinks.forEach(link => {
              link.classList.toggle('active-toc', link.getAttribute('href') === `#${id}`);
            });
          }
        }, { rootMargin: '-120px 0px -30% 0px', threshold: [0.15] });
        const observedSections = document.querySelectorAll('.policy-card, .contact-premium');
        observedSections.forEach(el => observer.observe(el));

        // Search with highlight
        function clearHighlights() {
          allCards.forEach(card => {
            card.querySelectorAll('mark').forEach(mark => {
              const parent = mark.parentNode;
              parent.replaceChild(document.createTextNode(mark.textContent), mark);
              parent.normalize();
            });
          });
        }

        function highlightText(container, term) {
          if (!term) return;
          const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
          const replacements = [];
          while (walker.nextNode()) {
            const node = walker.currentNode;
            if (node.parentNode.tagName === 'SCRIPT' || node.parentNode.tagName === 'STYLE') continue;
            const idx = node.textContent.toLowerCase().indexOf(term);
            if (idx !== -1) replacements.push({ node, idx, length: term.length });
          }
          replacements.forEach(({ node, idx, length }) => {
            const before = node.textContent.substring(0, idx);
            const match = node.textContent.substring(idx, idx + length);
            const after = node.textContent.substring(idx + length);
            const frag = document.createDocumentFragment();
            frag.appendChild(document.createTextNode(before));
            const mark = document.createElement('mark');
            mark.textContent = match;
            frag.appendChild(mark);
            frag.appendChild(document.createTextNode(after));
            node.parentNode.replaceChild(frag, node);
          });
        }

        function performSearch(term) {
          clearHighlights();
          let visible = 0;
          allCards.forEach(card => {
            const text = card.textContent.toLowerCase();
            const heading = card.querySelector('h2')?.innerText.toLowerCase() || '';
            const match = term === '' || heading.includes(term) || text.includes(term);
            card.style.display = match ? '' : 'none';
            if (match) {
              visible++;
              if (term) highlightText(card, term);
            }
          });
          if (searchEmpty) {
            searchEmpty.style.display = visible === 0 && term !== '' ? '' : 'none';
          }
          if (searchLive) {
            searchLive.textContent = term === '' ? '' : `${visible} section${visible !== 1 ? 's' : ''} found.`;
          }
        }

        let searchTimeout;
        if (searchInput) {
          searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
              performSearch(searchInput.value.toLowerCase().trim());
            }, 150);
          });
        }
        if (searchClear) {
          searchClear.addEventListener('click', () => {
            searchInput.value = '';
            searchInput.focus();
            performSearch('');
          });
        }
        if (searchInput) {
          document.querySelectorAll('.term-btn').forEach(btn => {
            btn.addEventListener('click', () => {
              searchInput.value = btn.textContent;
              searchInput.focus();
              performSearch(btn.textContent.toLowerCase());
            });
          });
        }

        // Copy link buttons
        document.querySelectorAll('.copy-link-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const section = btn.closest('[id]');
            if (!section) return;
            const url = `${window.location.origin}${window.location.pathname}#${section.id}`;
            if (navigator.clipboard) {
              navigator.clipboard.writeText(url).then(() => {
                const icon = btn.querySelector('i');
                if (icon) {
                  icon.className = 'fas fa-check';
                  setTimeout(() => { icon.className = 'fas fa-link'; }, 1500);
                }
              }).catch(() => {});
            }
          });
        });

        // Mobile TOC close after click
        if (mobileToc) {
          mobileTocLinks.forEach(link => {
            link.addEventListener('click', () => {
              if (mobileToc.open) mobileToc.open = false;
            });
          });
        }

        // Smooth scroll for TOC links
        document.querySelectorAll('#sidebar-toc a, .mobile-toc a').forEach(link => {
          link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
          });
        });
      })();
    });