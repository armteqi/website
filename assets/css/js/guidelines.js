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

    /* ------------------------------
       Reveal animation
    ------------------------------ */

    const cards = document.querySelectorAll(
        ".guideline-card, .value-card, .highlight-box, .welcome-statement"
    );

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);

                }

            });

        }, {
            threshold: 0.15
        });

        cards.forEach(card => observer.observe(card));

    } else {

        cards.forEach(card => card.classList.add("visible"));

    }

    /* ------------------------------
       Smooth scrolling
    ------------------------------ */

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

    /* ------------------------------
       Active TOC
    ------------------------------ */

    const sections = document.querySelectorAll(".guidelines-section");
    const tocLinks = document.querySelectorAll(".toc a");

    if (sections.length && tocLinks.length) {

        const tocObserver = new IntersectionObserver(entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                const id = entry.target.id;

                tocLinks.forEach(link => {

                    link.classList.toggle(
                        "active-toc",
                        link.getAttribute("href") === "#" + id
                    );

                });

            });

        }, {
            threshold: 0.45
        });

        sections.forEach(section => tocObserver.observe(section));

    }

    /* ------------------------------
       Back to top
    ------------------------------ */

    const backButton = document.querySelector(".back-to-top");

    if (backButton) {

        backButton.addEventListener("click", function (e) {

            e.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }

});