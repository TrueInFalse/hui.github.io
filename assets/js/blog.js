(() => {
    const listNode = document.querySelector("#blog-list");
    const tagNode = document.querySelector("#blog-tags");
    if (!listNode || !tagNode || !window.SiteUtils) {
        return;
    }

    let allPosts = [];
    let activeTag = "全部";

    function sortByDateDesc(items) {
        return [...items].sort((a, b) => {
            const aTime = new Date(`${a.date || "1970-01-01"}T00:00:00+08:00`).getTime();
            const bTime = new Date(`${b.date || "1970-01-01"}T00:00:00+08:00`).getTime();
            return bTime - aTime;
        });
    }

    function getTags(posts) {
        const tags = new Set(["全部"]);
        posts.forEach((post) => {
            (post.tags || []).forEach((tag) => tags.add(tag));
        });
        return [...tags];
    }

    function renderTags(posts) {
        const tags = getTags(posts);
        tagNode.innerHTML = tags
            .map((tag) => {
                const activeClass = tag === activeTag ? " active" : "";
                return `<button class="filter-btn${activeClass}" type="button" data-tag="${tag}">${tag}</button>`;
            })
            .join("");

        tagNode.querySelectorAll("[data-tag]").forEach((button) => {
            button.addEventListener("click", () => {
                activeTag = button.dataset.tag || "全部";
                renderTags(allPosts);
                renderPosts();
            });
        });
    }

    function renderPosts() {
        const selected =
            activeTag === "全部"
                ? allPosts
                : allPosts.filter((post) => (post.tags || []).includes(activeTag));

        if (!selected.length) {
            listNode.innerHTML = '<div class="empty-state">当前标签下还没有文章。</div>';
            return;
        }

        listNode.innerHTML = selected
            .map((post) => {
                const tags = (post.tags || []).map((tag) => `<span class="tag">${tag}</span>`).join("");
                const dateText = SiteUtils.formatDate(post.date);
                return `
                    <article class="post-card" data-reveal>
                        <h3><a href="posts/${post.slug}.html">${post.title}</a></h3>
                        <p class="post-card-meta">${dateText}${post.readingMinutes ? ` · 约 ${post.readingMinutes} 分钟` : ""}</p>
                        <p>${post.summary || ""}</p>
                        <div class="tag-list">${tags}</div>
                    </article>
                `;
            })
            .join("");
    }

    async function init() {
        try {
            allPosts = sortByDateDesc(await SiteUtils.loadPostIndex());
            renderTags(allPosts);
            renderPosts();
        } catch (error) {
            listNode.innerHTML = `<p class="error-text">${error.message}</p>`;
        }
    }

    init();
})();
