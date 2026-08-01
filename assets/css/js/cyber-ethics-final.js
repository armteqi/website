/**
 * ============================================================
 * Armteqi Trust Center
 * Shared JavaScript
 * ------------------------------------------------------------
 * Handles:
 *  - Theme toggle
 *  - Reveal animations
 *  - Smooth scrolling
 *  - Active Table of Contents
 *  - Back to Top button
 * ============================================================
 */

(function() {
  'use strict';

  // ─── CONFIGURATION ──────────────────────────────────────────

  const CONFIG = {
    revealThreshold: 0.12,
    tocThreshold: 0.45,
    stickyOffset: 80,
    backToTopOffset: 500,
  };

  // ─── DOM HELPERS ────────────────────────────────────────────

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  // ─── TRUST CENTER MODULE ──────────────────────────────────

  const TrustCenter = {
    // Cached DOM
    ui: {},

    init() {
      this.cacheDom();
      this.applyTheme();
      this.initRevealAndTOC();
      this.initSmoothScroll();
      this.initBackToTop();
    },

    // ─── Cache DOM ──────────────────────────────────────────

    cacheDom() {
      this.ui = {
        revealItems: $$([
          '.trust-header',
          '.hero-statement',
          '.summary-card',
          '.toc',
          '.trust-section',
          '.card',
          '.contact-links',
        ].join(',')),
        sections: $$('.trust-section'),
        tocLinks: $$('.toc a'),
        backButton: $('.back-to-top'),
        themeToggle: $('#themeToggle'),
      };
    },

    // ─── Theme ──────────────────────────────────────────────

    applyTheme() {
      const toggle = this.ui.themeToggle;
      if (!toggle) return;

      const saved = localStorage.getItem('theme') || 'dark';
      const isLight = saved === 'light';

      document.body.classList.toggle('light-mode', isLight);
      this.updateThemeUI(toggle, isLight);

      toggle.addEventListener('click', () => {
        const current = document.body.classList.contains('light-mode');
        const next = !current;
        document.body.classList.toggle('light-mode', next);
        localStorage.setItem('theme', next ? 'light' : 'dark');
        this.updateThemeUI(toggle, next);
      });
    },

    updateThemeUI(toggle, isLight) {
      const icon = toggle.querySelector('i');
      if (icon) {
        icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
      }
      toggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
      toggle.setAttribute('aria-pressed', isLight ? 'true' : 'false');
    },

    // ─── Reveal & TOC (Single Observer) ────────────────────

    initRevealAndTOC() {
      if (!('IntersectionObserver' in window)) {
        this.ui.revealItems.forEach(el => el.classList.add('reveal-visible'));
        return;
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const el = entry.target;

          // Reveal animation
          if (entry.isIntersecting && el.classList.contains('reveal-hidden')) {
            el.classList.add('reveal-visible');
            observer.unobserve(el);
          }

          // TOC active state (only for sections)
          if (entry.isIntersecting && el.matches('.trust-section')) {
            const id = '#' + el.id;
            this.ui.tocLinks.forEach(link => {
              link.classList.toggle('active', link.getAttribute('href') === id);
            });
          }
        });
      }, {
        threshold: CONFIG.revealThreshold,
      });

      this.ui.revealItems.forEach(el => observer.observe(el));
    },

    // ─── Smooth Scroll ──────────────────────────────────────

    initSmoothScroll() {
      this.ui.tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          const targetId = link.getAttribute('href');
          if (!targetId || !targetId.startsWith('#')) return;

          const target = $(targetId);
          if (!target) return;

          e.preventDefault();

          const y = target.getBoundingClientRect().top + window.scrollY - CONFIG.stickyOffset;

          window.scrollTo({
            top: y,
            behavior: 'smooth',
          });

          history.replaceState(null, '', targetId);

          // Accessibility: move focus
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        });
      });
    },

    // ─── Back to Top ────────────────────────────────────────

    initBackToTop() {
      const btn = this.ui.backButton;
      if (!btn) return;

      const update = () => {
        btn.classList.toggle('show', window.scrollY > CONFIG.backToTopOffset);
      };

      window.addEventListener('scroll', update, { passive: true });
      update();

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        btn.blur(); // Remove focus after click
      });

      // Keyboard shortcut: Home key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Home' && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    },
  };

  // ─── BOOTSTRAP ─────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', () => {
    TrustCenter.init();
  });

})();