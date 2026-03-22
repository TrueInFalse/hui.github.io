(() => {
    const THEME_KEY = "site-theme";
    const root = document.documentElement;
    const body = document.body;
    const rootPath = body.dataset.rootPath || "./";
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    let postIndexCache = null;

    function getResolvedTheme() {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved === "light" || saved === "dark") {
            return saved;
        }
        return prefersDark.matches ? "dark" : "light";
    }

    function applyTheme(theme) {
        root.setAttribute("data-theme", theme);
        const toggle = document.querySelector("[data-theme-toggle]");
        if (toggle) {
            const nextText = theme === "dark" ? "切换到浅色模式" : "切换到深色模式";
            toggle.setAttribute("aria-label", nextText);
            toggle.setAttribute("title", nextText);
            toggle.dataset.currentTheme = theme;
        }
    }

    function initTheme() {
        applyTheme(getResolvedTheme());
        const toggle = document.querySelector("[data-theme-toggle]");
        if (toggle) {
            toggle.addEventListener("click", () => {
                const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
                const next = current === "dark" ? "light" : "dark";
                localStorage.setItem(THEME_KEY, next);
                applyTheme(next);
            });
        }

        prefersDark.addEventListener("change", () => {
            if (!localStorage.getItem(THEME_KEY)) {
                applyTheme(getResolvedTheme());
            }
        });
    }

    function initNav() {
        const nav = document.querySelector("[data-nav]");
        const toggle = document.querySelector("[data-nav-toggle]");
        if (!nav || !toggle) {
            return;
        }

        const closeNav = () => {
            body.classList.remove("nav-open");
            toggle.setAttribute("aria-expanded", "false");
        };

        toggle.addEventListener("click", () => {
            const isOpen = body.classList.toggle("nav-open");
            toggle.setAttribute("aria-expanded", String(isOpen));
        });

        nav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                closeNav();
            });
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeNav();
            }
        });

        document.addEventListener("click", (event) => {
            if (!body.classList.contains("nav-open")) {
                return;
            }
            const target = event.target;
            if (!target.closest("[data-nav]") && !target.closest("[data-nav-toggle]")) {
                closeNav();
            }
        });
    }

    function initBackToTop() {
        const button = document.querySelector("[data-back-to-top]");
        if (!button) {
            return;
        }

        const onScroll = () => {
            if (window.scrollY > 440) {
                button.classList.add("show");
            } else {
                button.classList.remove("show");
            }
        };

        button.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
    }

    function initReveal() {
        const nodes = [...document.querySelectorAll("[data-reveal]")];
        if (!nodes.length) {
            return;
        }

        if (!("IntersectionObserver" in window)) {
            nodes.forEach((node) => node.classList.add("is-visible"));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -20px 0px" }
        );

        nodes.forEach((node) => observer.observe(node));
    }

    function setCurrentYear() {
        const node = document.querySelector("[data-current-year]");
        if (node) {
            node.textContent = String(new Date().getFullYear());
        }
    }

    async function loadPostIndex() {
        if (postIndexCache) {
            return postIndexCache;
        }

        const response = await fetch(`${rootPath}posts/index.json`, { cache: "no-cache" });
        if (!response.ok) {
            throw new Error(`文章索引加载失败 (${response.status})`);
        }

        postIndexCache = await response.json();
        return postIndexCache;
    }

    function formatDate(dateText) {
        if (!dateText) {
            return "";
        }
        const date = new Date(`${dateText}T00:00:00+08:00`);
        if (Number.isNaN(date.getTime())) {
            return dateText;
        }
        return new Intl.DateTimeFormat("zh-CN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }).format(date);
    }

    window.SiteUtils = {
        loadPostIndex,
        formatDate,
        rootPath
    };

    initTheme();
    initNav();
    initBackToTop();
    initReveal();
    setCurrentYear();
})();
