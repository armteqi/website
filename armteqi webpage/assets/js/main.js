
(function () {
  'use strict';
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Theme: saved choice > OS preference > dark default ---- */
  var root = document.body;
  var toggles = [document.getElementById('theme-toggle'), document.getElementById('theme-toggle-mobile')];
  var themeIcon = document.getElementById('theme-icon');

  function applyTheme(isLight) {
    root.classList.toggle('light-theme', isLight);
    toggles.forEach(function (btn) {
      if (!btn) return;
      btn.setAttribute('aria-pressed', String(isLight));
      btn.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
    });
    if (themeIcon) themeIcon.setAttribute('href', isLight ? '#i-sun' : '#i-moon');
  }

  var saved = null;
  try { saved = localStorage.getItem('armteqi-theme'); } catch (e) { /* storage unavailable — fall back to OS preference */ }
  var systemLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  applyTheme(saved ? saved === 'light' : systemLight);

  toggles.forEach(function (btn) {
    if (!btn) return;
    btn.addEventListener('click', function () {
      var isLight = !root.classList.contains('light-theme');
      applyTheme(isLight);
      try { localStorage.setItem('armteqi-theme', isLight ? 'light' : 'dark'); } catch (e) { /* ignore */ }
    });
  });

  /* ---- Mobile menu ---- */
//   var menuToggle = document.getElementById('menu-toggle');
//   var menu = document.getElementById('mobile-menu');
//   var menuIcon = document.getElementById('menu-icon');

//   menuToggle.addEventListener('click', function () {
//     var isOpen = menu.classList.toggle('is-open');
//     menuToggle.setAttribute('aria-expanded', String(isOpen));
//     menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
//     menuIcon.setAttribute('href', isOpen ? '#i-close' : '#i-menu');
//   });
//   menu.querySelectorAll('a').forEach(function (link) {
//     link.addEventListener('click', function () {
//       menu.classList.remove('is-open');
//       menuToggle.setAttribute('aria-expanded', 'false');
//       menuToggle.setAttribute('aria-label', 'Open menu');
//       menuIcon.setAttribute('href', '#i-menu');
//     });
//   });
//   menuToggle.addEventListener("click", () => {
//     mobileMenu.classList.toggle("is-open");
//     document.body.classList.toggle("menu-open");
//   });

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var btn = item.querySelector('.faq-q');
    btn.addEventListener('click', function () {
      var isOpen = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(isOpen));
    });
  });

  /* ---- Terminal typing effect ----
     Decorative only: the parent has an aria-label with the full text,
     so screen readers never depend on this animation completing. */
  var typedEl = document.getElementById('typed-text');
  var outputEl = document.getElementById('typed-output');
  var command = 'Дгмтеϙі --mission';
  var output = 'Technology education, without barriers.';

  if (prefersReducedMotion) {
    typedEl.textContent = command;
    outputEl.textContent = output;
    outputEl.style.opacity = '1';
  } else {
    var i = 0;
    var typer = setInterval(function () {
      typedEl.textContent = command.slice(0, i + 1);
      i++;
      if (i === command.length) {
        clearInterval(typer);
        setTimeout(function () { outputEl.textContent = output; outputEl.style.opacity = '1'; }, 300);
      }
    }, 55);
  }

  /* ---- Scroll reveal ----
     Content is fully visible by default (see .reveal in CSS). Only if
     IntersectionObserver exists AND motion isn't reduced do we opt an
     element into a hidden starting state right before observing it —
     so nothing ever depends on JS to become visible. */
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    var targets = document.querySelectorAll('.reveal');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          entry.target.classList.remove('pre');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    targets.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top > window.innerHeight) { el.classList.add('pre'); io.observe(el); }
    });
  }
})();
