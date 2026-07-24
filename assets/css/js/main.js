const body = document.body;
const themeToggle = document.getElementById('themeToggle');

// Apply saved theme on every page
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'light') {
    body.classList.add('light-mode');
}

// Only run toggle code if the button exists
if (themeToggle) {
    const icon = themeToggle.querySelector('i');

    if (savedTheme === 'light') {
        icon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');

        const isLight = body.classList.contains('light-mode');

        localStorage.setItem('theme', isLight ? 'light' : 'dark');

        icon.classList.toggle('fa-moon', !isLight);
        icon.classList.toggle('fa-sun', isLight);
    });
}

// Animation
const animatedElements = document.querySelectorAll('.card, .promise-block');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

animatedElements.forEach(el => observer.observe(el));

// FAQ
document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
        item.classList.toggle('active');
    });
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === "#") return;

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});