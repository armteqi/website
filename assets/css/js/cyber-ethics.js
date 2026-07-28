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
 */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================================
       REVEAL ANIMATION
    ========================================================== */

    const revealElements = document.querySelectorAll(`
        .trust-header,
        .summary-card,
        .toc,
        .trust-section,
        .card,
        .contact-links,
        .back-to-top
    `);

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver((entries, observer) => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                entry.target.classList.add("reveal-visible");

                observer.unobserve(entry.target);

            });

        }, {
            threshold: 0.08,
            rootMargin: "0px 0px -50px 0px"
        });

        revealElements.forEach(element => {

            element.classList.add("reveal-hidden");
            revealObserver.observe(element);

        });

    } else {

        revealElements.forEach(element => {

            element.classList.remove("reveal-hidden");

        });

    }


    /* ==========================================================
       SMOOTH SCROLL
    ========================================================== */

    document.querySelectorAll('.toc a[href^="#"]').forEach(link => {

        link.addEventListener("click", e => {

            const target = document.querySelector(link.getAttribute("href"));

            if (!target) return;

            e.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            history.replaceState(null, "", link.getAttribute("href"));

        });

    });


    /* ==========================================================
       ACTIVE TABLE OF CONTENTS
    ========================================================== */

    const sections = document.querySelectorAll(".trust-section");
    const tocLinks = document.querySelectorAll(".toc a");

    function updateTOC() {

        let current = "";

        const offset = window.scrollY + 140;

        sections.forEach(section => {

            if (
                offset >= section.offsetTop &&
                offset < section.offsetTop + section.offsetHeight
            ) {

                current = "#" + section.id;

            }

        });

        tocLinks.forEach(link => {

            link.classList.toggle(
                "active",
                link.getAttribute("href") === current
            );

        });

    }


    /* ==========================================================
       BACK TO TOP
    ========================================================== */

    const backToTop = document.querySelector(".back-to-top");

    if (backToTop) {

        function toggleBackToTop() {

            if (window.scrollY > 500) {

                backToTop.style.opacity = "1";
                backToTop.style.visibility = "visible";
                backToTop.style.pointerEvents = "auto";

            } else {

                backToTop.style.opacity = "0";
                backToTop.style.visibility = "hidden";
                backToTop.style.pointerEvents = "none";

            }

        }

        toggleBackToTop();

        backToTop.addEventListener("click", e => {

            e.preventDefault();

            window.scrollTo({

                top: 0,
                behavior: "smooth"

            });

        });

    }


    /* ==========================================================
       READING PROGRESS BAR
       (Only works if page contains:
       <div id="readingProgress"></div>)
    ========================================================== */

    const progressBar = document.getElementById("readingProgress");

    function updateReadingProgress() {

        if (!progressBar) return;

        const scrollTop = window.scrollY;

        const docHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        const progress = (scrollTop / docHeight) * 100;

        progressBar.style.width = progress + "%";

    }


    /* ==========================================================
       SCROLL EVENTS
    ========================================================== */

    let ticking = false;

    function onScroll() {

        if (ticking) return;

        requestAnimationFrame(() => {

            updateTOC();
            updateReadingProgress();

            if (backToTop) {
                if (window.scrollY > 500) {

                    backToTop.style.opacity = "1";
                    backToTop.style.visibility = "visible";
                    backToTop.style.pointerEvents = "auto";

                } else {

                    backToTop.style.opacity = "0";
                    backToTop.style.visibility = "hidden";
                    backToTop.style.pointerEvents = "none";

                }
            }

            ticking = false;

        });

        ticking = true;

    }

    window.addEventListener("scroll", onScroll, {
        passive: true
    });

    updateTOC();
    updateReadingProgress();

});