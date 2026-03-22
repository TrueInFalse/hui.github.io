(() => {
    const body = document.body;
    const slug = body.dataset.postSlug || "";
    const titleNode = document.querySelector("#post-title");
    const summaryNode = document.querySelector("#post-summary");
    const metaNode = document.querySelector("#post-meta");
    const tagsNode = document.querySelector("#post-tags");
    const contentNode = document.querySelector("#post-content");
    const tocNode = document.querySelector("#post-toc-list");
    const progressBar = document.querySelector("[data-reading-progress]");

    if (!slug || !contentNode || !window.SiteUtils) {
        return;
    }

    function toHeadingId(text, index, used) {
        const normalized = (text || "")
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w\u4e00-\u9fa5-]/g, "")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");

        const base = normalized || `section-${index + 1}`;
        let id = base;
        let serial = 2;
        while (used.has(id)) {
            id = `${base}-${serial}`;
            serial += 1;
        }
        used.add(id);
        return id;
    }

    function updateMetaTags(post) {
        document.title = `${post.title} | Su Xiaoyao`;

        const desc = post.summary || "";
        const setMeta = (selector, value) => {
            const node = document.querySelector(selector);
            if (node) {
                node.setAttribute("content", value);
            }
        };

        setMeta('meta[name="description"]', desc);
        setMeta('meta[property="og:title"]', post.title);
        setMeta('meta[property="og:description"]', desc);
    }

    function renderMeta(post) {
        if (titleNode) {
            titleNode.textContent = post.title;
        }
        if (summaryNode) {
            summaryNode.textContent = post.summary || "";
        }

        if (metaNode) {
            const dateText = SiteUtils.formatDate(post.date);
            const minutes = post.readingMinutes ? `约 ${post.readingMinutes} 分钟` : "";
            metaNode.innerHTML = [dateText && `<span>${dateText}</span>`, minutes && `<span>${minutes}</span>`]
                .filter(Boolean)
                .join("");
        }

        if (tagsNode) {
            tagsNode.innerHTML = (post.tags || []).map((tag) => `<span class="tag">${tag}</span>`).join("");
        }
    }

    function buildToc() {
        if (!tocNode) {
            return;
        }

        const headings = [...contentNode.querySelectorAll("h2, h3")];
        if (!headings.length) {
            tocNode.innerHTML = '<li><span class="post-card-meta">本篇暂无二级目录</span></li>';
            return;
        }

        const usedIds = new Set();
        headings.forEach((heading, index) => {
            if (!heading.id) {
                heading.id = toHeadingId(heading.textContent || "", index, usedIds);
            }
        });

        tocNode.innerHTML = headings
            .map((heading) => {
                const indent = heading.tagName.toLowerCase() === "h3" ? ' style="padding-left: 0.95rem;"' : "";
                return `<li><a href="#${heading.id}" data-toc-link="${heading.id}"${indent}>${heading.textContent || ""}</a></li>`;
            })
            .join("");

        const links = [...tocNode.querySelectorAll("[data-toc-link]")];

        if (!("IntersectionObserver" in window)) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const currentId = entry.target.id;
                        links.forEach((link) => {
                            link.classList.toggle("active", link.dataset.tocLink === currentId);
                        });
                    }
                });
            },
            {
                rootMargin: "0px 0px -70% 0px",
                threshold: 0.1
            }
        );

        headings.forEach((heading) => observer.observe(heading));
    }

    function initReadingProgress() {
        if (!progressBar) {
            return;
        }

        const onScroll = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const progress = max <= 0 ? 0 : (window.scrollY / max) * 100;
            progressBar.style.width = `${Math.min(100, Math.max(0, progress)).toFixed(2)}%`;
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
    }

    function enhanceCodeBlocks() {
        const blocks = [...contentNode.querySelectorAll("pre > code")];
        blocks.forEach((code) => {
            if (window.hljs) {
                window.hljs.highlightElement(code);
            }

            const pre = code.parentElement;
            if (!pre || pre.querySelector(".copy-code-btn")) {
                return;
            }

            const button = document.createElement("button");
            button.type = "button";
            button.className = "copy-code-btn";
            button.textContent = "复制";
            button.setAttribute("aria-label", "复制代码");

            button.addEventListener("click", async () => {
                try {
                    await navigator.clipboard.writeText(code.textContent || "");
                    button.textContent = "已复制";
                    window.setTimeout(() => {
                        button.textContent = "复制";
                    }, 1500);
                } catch (error) {
                    button.textContent = "失败";
                    window.setTimeout(() => {
                        button.textContent = "复制";
                    }, 1500);
                }
            });

            pre.appendChild(button);
        });
    }

    async function loadPost() {
        try {
            const posts = await SiteUtils.loadPostIndex();
            const post = posts.find((item) => item.slug === slug);
            if (!post) {
                throw new Error("未找到这篇文章元数据。");
            }

            renderMeta(post);
            updateMetaTags(post);

            const response = await fetch(`${SiteUtils.rootPath}posts/${post.file}`, { cache: "no-cache" });
            if (!response.ok) {
                throw new Error(`文章内容加载失败 (${response.status})`);
            }
            const markdown = await response.text();

            if (!window.marked) {
                throw new Error("缺少 Markdown 渲染器 marked。");
            }

            marked.setOptions({
                gfm: true,
                breaks: true,
                mangle: false,
                headerIds: false
            });

            const html = marked.parse(markdown);
            const sanitized = window.DOMPurify
                ? window.DOMPurify.sanitize(html, {
                      USE_PROFILES: { html: true }
                  })
                : html;

            contentNode.innerHTML = sanitized;
            enhanceCodeBlocks();
            buildToc();
            initReadingProgress();
        } catch (error) {
            contentNode.innerHTML = `<p class="error-text">${error.message}</p>`;
        }
    }

    loadPost();
})();
