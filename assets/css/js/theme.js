// ─── THEME TOGGLE WITH localStorage ───

// Function to apply theme (safe for pages without the toggle button)
function setTheme(light) {
    if (light) {
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
    }
    localStorage.setItem('trust-theme', light ? 'light' : 'dark');

    // Update the toggle icon if the button exists on this page
    const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) {
        toggleBtn.innerHTML = light ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    }
}

// 1. Apply saved preference IMMEDIATELY (runs as soon as script loads)
const savedTheme = localStorage.getItem('trust-theme');
if (savedTheme === 'dark') {
    setTheme(false); // dark mode
} else {
    setTheme(true);  // default to light mode (or 'light' if saved)
}

// 2. Attach click listener only if the toggle button exists on THIS page
const toggleBtn = document.getElementById('themeToggle');
if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        const isLight = document.body.classList.contains('light-mode');
        setTheme(!isLight);
    });
}