document.addEventListener("DOMContentLoaded", function() {
      'use strict';

      // ── Reading Progress ──
      const progressBar = document.getElementById('readingProgress');
      if (progressBar) {
        window.addEventListener('scroll', function() {
          const scrollTop = document.documentElement.scrollTop;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
          progressBar.style.width = Math.min(progress, 100) + '%';
        }, { passive: true });
      }

      // ── Back to Top ──
      const backBtn = document.getElementById('back-to-top');
      if (backBtn) {
        window.addEventListener('scroll', function() {
          backBtn.classList.toggle('show', window.scrollY > 600);
        }, { passive: true });
        backBtn.addEventListener('click', function() {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }

      // ── Mobile Menu ──
      const hamburger = document.getElementById('hamburger');
      const navLinks = document.getElementById('navLinks');
      let isOpen = false;

      if (hamburger) {
        hamburger.addEventListener('click', function() {
          isOpen = !isOpen;
          navLinks.classList.toggle('open', isOpen);
          const icon = this.querySelector('i');
          if (icon) {
            icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
          }
        });
      }

      // ── Active TOC (desktop) ──
      const sections = document.querySelectorAll('.article-content h2');
      const tocLinks = document.querySelectorAll('#tocList a');
      const mobileTocLinks = document.querySelectorAll('.mobile-toc nav a');

      if (sections.length && tocLinks.length) {
        const tocObserver = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (!entry.isIntersecting) return;
            const id = entry.target.id;
            tocLinks.forEach(function(link) {
              link.classList.toggle('active-toc', link.getAttribute('href') === '#' + id);
            });
            mobileTocLinks.forEach(function(link) {
              link.classList.toggle('active-toc', link.getAttribute('href') === '#' + id);
            });
          });
        }, { threshold: 0.4, rootMargin: '-80px 0px 0px 0px' });

        sections.forEach(function(section) {
          tocObserver.observe(section);
        });
      }

      // ── Smooth scroll for TOC links ──
      document.querySelectorAll('#tocList a, .mobile-toc nav a').forEach(function(link) {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            const offset = 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
          }
          // Close mobile TOC if open
          const mobileToc = document.getElementById('mobileToc');
          if (mobileToc) mobileToc.open = false;
        });
      });

      // ── Terminal Typing Effect ──
      const typedEl = document.getElementById('typed-text');
      const outputEl = document.getElementById('typed-output');
      const completeEl = document.getElementById('typed-complete');
      const progressDots = document.getElementById('progress-dots');

      const command = 'Дгмтеϙі --mission';
      const output = 'Technology education, without barriers.';

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (typedEl && outputEl) {
        if (prefersReducedMotion) {
          typedEl.textContent = command;
          outputEl.textContent = output;
          outputEl.style.opacity = '1';
          if (completeEl) completeEl.style.opacity = '1';
          if (progressDots) progressDots.textContent = '...';
        } else {
          let i = 0;
          const typer = setInterval(function() {
            typedEl.textContent = command.slice(0, i + 1);
            i++;
            if (i === command.length) {
              clearInterval(typer);
              setTimeout(function() {
                outputEl.textContent = output;
                outputEl.style.opacity = '1';
                // Progress dots animation
                if (completeEl) {
                  completeEl.style.opacity = '1';
                  let dots = 0;
                  const dotInterval = setInterval(function() {
                    dots = (dots % 3) + 1;
                    if (progressDots) progressDots.textContent = '.'.repeat(dots);
                    if (dots === 3) {
                      clearInterval(dotInterval);
                      if (progressDots) progressDots.textContent = ' ✓';
                    }
                  }, 400);
                }
              }, 400);
            }
          }, 55);
        }
      }

      // ── Journal Progress hover ──
      document.querySelectorAll('.journal-progress .entry:not(.active)').forEach(function(el) {
        el.addEventListener('click', function() {
          // Placeholder for future navigation
          console.log('Navigate to journal entry:', this.textContent.trim());
        });
      });

    });