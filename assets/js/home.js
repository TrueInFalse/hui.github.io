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

    function renderPostCard(post) {
        const tags = (post.tags || [])
            .map((tag) => `<span class="tag">${tag}</span>`)
            .join("");
        const dateText = SiteUtils.formatDate(post.date);
        return `
            <article class="post-card">
                <h3><a href="posts/${post.slug}.html">${post.title}</a></h3>
                <p class="post-card-meta">${dateText}${post.readingMinutes ? ` · 约 ${post.readingMinutes} 分钟` : ""}</p>
                <p>${post.summary || ""}</p>
                <div class="tag-list">${tags}</div>
            </article>
        `;
    }

    async function init() {
        try {
            const posts = await SiteUtils.loadPostIndex();
            await handleLegacyHash(posts);

            const featuredPosts = sortByDateDesc(posts.filter((post) => post.featured)).slice(0, 3);
            if (!featuredPosts.length) {
                featuredContainer.innerHTML = '<div class="empty-state">暂无精选文章，后续会持续补充。</div>';
                return;
            }

            featuredContainer.innerHTML = featuredPosts.map(renderPostCard).join("");
        } catch (error) {
            featuredContainer.innerHTML = `<p class="error-text">${error.message}</p>`;
        }
    }

    init();
})();

