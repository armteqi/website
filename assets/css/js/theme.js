(function () {
    "use strict";

    const STORAGE_KEY = "theme";

    function applyTheme(theme) {
        document.body.classList.toggle("light-mode", theme === "light");
    }

    function loadTheme() {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved === "light" || saved === "dark") {
            applyTheme(saved);
        } else {
            applyTheme("dark");
        }
    }

    document.addEventListener("DOMContentLoaded", loadTheme);

    window.ThemeManager = {
        set(theme) {
            applyTheme(theme);
            localStorage.setItem(STORAGE_KEY, theme);
        },

        get() {
            return localStorage.getItem(STORAGE_KEY) || "dark";
        }
    };

})();