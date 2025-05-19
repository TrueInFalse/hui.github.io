// 文章配置
const posts = [
    {
        id: 'intro',
        title: '个人简介',
        file: 'intro.md'
    },
    {
        id: 'absurd-interview',
        title: '荒诞的面试',
        file: 'absurd-interview.md'
    }
];

// 加载文章内容
async function loadPost(postId) {
    try {
        const post = posts.find(p => p.id === postId) || posts[0]; // 如果找不到文章，加载第一篇
        const response = await fetch(`posts/${post.file}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        document.getElementById('content').innerHTML = marked.parse(text); // 使用 marked.parse
    } catch (err) {
        console.error('Error loading post:', err);
        document.getElementById('content').innerHTML = `<p>加载文章失败: ${err.message}</p>`;
    }
}

// 生成导航菜单
function generateMenu() {
    const menu = document.getElementById('menu');
    menu.innerHTML = posts.map(post => `
        <a href="javascript:void(0)" onclick="loadPost('${post.id}')">${post.title}</a>
    `).join('');
}

// 主题切换
function toggleTheme() {
    const current = localStorage.getItem('theme') || getPreferredTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
}

function getPreferredTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// 访问统计
function countVisits() {
    const now = new Date().getTime();
    
    // PV统计
    let pageViews = localStorage.getItem('pageViews') || 0;
    pageViews = parseInt(pageViews) + 1;
    localStorage.setItem('pageViews', pageViews);

    // UV统计
    let visitorId = localStorage.getItem('visitorId');
    let lastVisitTime = localStorage.getItem('lastVisitTime');
    
    if (!visitorId || (lastVisitTime && (now - parseInt(lastVisitTime)) > 24 * 60 * 60 * 1000)) {
        visitorId = 'visitor_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('visitorId', visitorId);
        let uniqueVisitors = localStorage.getItem('uniqueVisitors') || 0;
        uniqueVisitors = parseInt(uniqueVisitors) + 1;
        localStorage.setItem('uniqueVisitors', uniqueVisitors);
    }
    
    localStorage.setItem('lastVisitTime', now);
    updateVisitStats();
}

// 更新统计显示
function updateVisitStats() {
    const pageViews = localStorage.getItem('pageViews') || 0;
    const uniqueVisitors = localStorage.getItem('uniqueVisitors') || 0;
    document.getElementById('visitStats').innerHTML = `
        <div class="stat-item">
            <span>PV: ${pageViews}</span>
        </div>
        <div class="stat-item">
            <span>UV: ${uniqueVisitors}</span>
        </div>
    `;
}

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    generateMenu();
    loadPost('intro'); // 默认加载第一篇文章
    countVisits();
    
    // 初始化主题
    const savedTheme = localStorage.getItem('theme');
    setTheme(savedTheme || getPreferredTheme());
    console.log('页面初始化完成');
});

// 监听URL变化
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1);
    loadPost(hash);
});


// ...existing code...

// 移动端导航控制
function toggleMenu() {
    const nav = document.querySelector('.left-nav');
    const overlay = document.querySelector('.overlay');
    
    if (nav.classList.contains('show')) {
        nav.classList.remove('show');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
    } else {
        nav.classList.add('show');
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

// 窗口大小变化监听
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        const nav = document.querySelector('.left-nav');
        const overlay = document.querySelector('.overlay');
        nav?.classList.remove('show');
        overlay?.classList.remove('show');
        document.body.style.overflow = '';
    }
});