/**
 * ============================================================
 * Armteqi Trust Center
 * Shared JavaScript
 * ------------------------------------------------------------
 * Handles:
 *  - Reveal animations
 *  - Smooth scrolling
 *  - Active Table of Contents
 *  - Back to Top button
 *  - Reading progress
 * ============================================================


     /* ==========================================================
        REVEAL ANIMATION
     ========================================================== */
    document.addEventListener("DOMContentLoaded", () => {

    /* ------------------------------
       Apply saved theme
    ------------------------------ */

    const savedTheme = localStorage.getItem("theme") || "dark";

    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
    } else {
        document.body.classList.remove("light-mode");
    }

    /* ---------------*/
 /* ==========================================
       Reveal animations
    ========================================== */

    const revealItems = document.querySelectorAll(`
        .trust-header,
        .summary-card,
        .toc,
        .trust-section,
        .card,
        .contact-links
    `);

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver((entries) => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);

            });

        }, {
            threshold: 0.12
        });

        revealItems.forEach(item => revealObserver.observe(item));

    } else {

        revealItems.forEach(item => item.classList.add("visible"));

    }

    /* ==========================================
       Smooth scrolling
    ========================================== */

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", function (e) {

            const target = document.querySelector(this.getAttribute("href"));

            if (!target) return;

            e.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });

    /* ==========================================
       Active Table of Contents
    ========================================== */

    const sections = document.querySelectorAll(".trust-section");
    const tocLinks = document.querySelectorAll(".toc a");

    if (sections.length && tocLinks.length) {

        const tocObserver = new IntersectionObserver((entries) => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                const id = "#" + entry.target.id;

                tocLinks.forEach(link => {

                    link.classList.toggle(
                        "active-toc",
                        link.getAttribute("href") === id
                    );

                });

            });

        }, {
            threshold: 0.45
        });

        sections.forEach(section => tocObserver.observe(section));

    }

    /* ==========================================
       Back To Top
    ========================================== */

    const backButton = document.querySelector(".back-to-top");

    if (backButton) {

        window.addEventListener("scroll", () => {

            if (window.scrollY > 500) {

                backButton.classList.add("show");

            } else {

                backButton.classList.remove("show");

            }

        });

        backButton.addEventListener("click", function (e) {

            e.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }

});