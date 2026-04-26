(() => {
    const featuredContainer = document.querySelector("#featured-posts");
    if (!featuredContainer || !window.SiteUtils) {
        return;
    }

    function sortByDateDesc(items) {
        return [...items].sort((a, b) => {
            const aTime = new Date(`${a.date || "1970-01-01"}T00:00:00+08:00`).getTime();
            const bTime = new Date(`${b.date || "1970-01-01"}T00:00:00+08:00`).getTime();
            return bTime - aTime;
        });
    }

    async function handleLegacyHash(posts) {
        const hash = window.location.hash.replace(/^#/, "").trim();
        if (!hash) {
            return;
        }
        const target = posts.find((post) => post.slug === hash);
        if (target) {
            window.location.replace(`posts/${target.slug}.html`);
        }
    }

    function renderPost(post) {
        const dateText = SiteUtils.formatDate(post.date);
        return `
            <article class="note-item">
                <h3><a href="posts/${post.slug}.html">${post.title}</a></h3>
                <p class="note-meta">${dateText}${post.readingMinutes ? ` · 约 ${post.readingMinutes} 分钟` : ""}</p>
                <p>${post.summary || ""}</p>
            </article>
        `;
    }

    async function init() {
        try {
            const posts = await SiteUtils.loadPostIndex();
            await handleLegacyHash(posts);

            const featuredPosts = sortByDateDesc(posts.filter((post) => post.featured)).slice(0, 2);
            if (!featuredPosts.length) {
                featuredContainer.innerHTML = '<p class="empty-state">文章入口会保留在这里，后续再慢慢补。</p>';
                return;
            }

            featuredContainer.innerHTML = featuredPosts.map(renderPost).join("");
        } catch (error) {
            featuredContainer.innerHTML = `<p class="error-text">${error.message}</p>`;
        }
    }

    init();
})();
