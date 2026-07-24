
    (function() {
      // ── SCROLL PROGRESS ──
      const progressBar = document.getElementById('scroll-progress');
      window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = Math.min(progress, 100) + '%';
        progressBar.setAttribute('aria-valuenow', Math.round(progress));
      });

      // ── HAMBURGER ──
      const hamburger = document.getElementById('hamburger');
      const navLinks = document.getElementById('navLinks');

      if (hamburger && navLinks) {
        hamburger.addEventListener('click', function(e) {
          e.stopPropagation();
          const expanded = this.getAttribute('aria-expanded') === 'true' ? false : true;
          this.setAttribute('aria-expanded', expanded);
          navLinks.classList.toggle('open');
          const icon = this.querySelector('i');
          if (navLinks.classList.contains('open')) {
            icon.className = 'fas fa-times';
          } else {
            icon.className = 'fas fa-bars';
          }
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
          link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
            const icon = hamburger.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
          });
        });
      }

      // ── SCROLL REVEAL ──
      const revealEls = document.querySelectorAll('.reveal');
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, {
        threshold: 0.10,
        rootMargin: '0px 0px -30px 0px'
      });
      revealEls.forEach(el => revealObserver.observe(el));

      // ── WATERMARK PARALLAX ──
      const watermark = document.getElementById('watermark');
      if (watermark) {
        window.addEventListener('scroll', () => {
          const scrollY = window.scrollY;
          const offset = scrollY * 0.03;
          watermark.style.transform = `translateY(calc(-50% + ${offset}px))`;
        }, { passive: true });
      }

      // ── FLOATING PARTICLES ──
      const particlesContainer = document.getElementById('particles-container');
      if (particlesContainer && window.innerWidth > 720) {
        const count = 40;
        for (let i = 0; i < count; i++) {
          const p = document.createElement('div');
          p.className = 'particle';
          p.style.left = Math.random() * 100 + '%';
          p.style.width = (Math.random() * 2 + 1) + 'px';
          p.style.height = p.style.width;
          p.style.animationDuration = (Math.random() * 25 + 20) + 's';
          p.style.animationDelay = (Math.random() * 20) + 's';
          p.style.opacity = Math.random() * 0.3 + 0.02;
          particlesContainer.appendChild(p);
        }
      }
    })();
  