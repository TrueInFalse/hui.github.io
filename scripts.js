// 文章配置
const posts = [
    {
        id: 'intro',
        title: 'HOME&简介',
        file: 'intro.md'
    },
    {
        id: 'absurd-interview',
        title: '荒诞的面试',
        file: 'absurd-interview.md'
    },
    {
        id: 'interview-yunzhi-2504',
        title: '2504暑期云智面试',
        file: 'interview-yunzhi-2504.md'
    },
    {
        id:'all-inters',
        title:'所有面经',
        file: 'all-inters.md'
    }
];

// 阅读进度和位置记忆
function handleReadingProgress(postId) {
    // 获取内容元素
    const content = document.getElementById('content');
    const progressBar = document.querySelector('.progress-bar');
    
    // 直接恢复上次阅读位置，无需确认
    const lastPosition = localStorage.getItem(`scroll_${postId}`);
    if (lastPosition) {
        window.scrollTo({
            top: parseInt(lastPosition),
            behavior: 'smooth'
        });
    }

    // 监听滚动更新进度条
    window.addEventListener('scroll', () => {
        const totalHeight = content.offsetHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        progressBar.style.width = `${Math.min(100, progress)}%`;
        
        // 保存阅读位置
        localStorage.setItem(`scroll_${postId}`, window.scrollY.toString());
    });
}

// 添加代码块复制功能
function addCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach((codeBlock) => {
        const container = codeBlock.parentElement;
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = '复制';
        
        copyButton.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(codeBlock.textContent);
                copyButton.textContent = '已复制!';
                setTimeout(() => {
                    copyButton.textContent = '复制';
                }, 2000);
            } catch (err) {
                console.error('复制失败:', err);
                copyButton.textContent = '复制失败';
            }
        });
        
        container.style.position = 'relative';
        container.appendChild(copyButton);
    });
}

// 加载文章内容
async function loadPost(postId) {
    try {
        const post = posts.find(p => p.id === postId) || posts[0];
        const response = await fetch(`posts/${post.file}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        
        // 配置 marked 选项
        marked.setOptions({
            gfm: true, // 启用 GitHub 风格的 Markdown
            breaks: true, // 允许回车换行
            highlight: function(code, lang) {
                if (lang && Prism.languages[lang]) {
                    return Prism.highlight(code, Prism.languages[lang], lang);
                }
                return code;
            },
            headerIds: true, // 为标题添加 id
            mangle: false, // 不转义内联 HTML
            pedantic: false, // 尽可能地兼容 markdown.pl
            smartLists: true, // 使用更智能的列表行为
            smartypants: true // 使用更智能的标点符号
        });
        
        document.getElementById('content').innerHTML = marked.parse(text);
        
        // 手动触发 Prism.js 高亮
        Prism.highlightAll();
        
        // 添加复制按钮
        addCopyButtons();
        
        // 重置进度条
        const progressBar = document.querySelector('.progress-bar');
        progressBar.style.width = '0%';
        
        // 初始化阅读进度
        handleReadingProgress(postId);
    } catch (err) {
        console.error('Error loading post:', err);
        document.getElementById('content').innerHTML = `<p>加载文章失败: ${err.message}</p>`;
    }
}

// 生成导航菜单
function generateMenu() {
    const menu = document.getElementById('menu');
    menu.innerHTML = posts.map(post => `
        <a href="javascript:void(0)" onclick="onMenuItemClick('${post.id}')">${post.title}</a>
    `).join('');
}

// 新增：目录项点击事件
function onMenuItemClick(postId) {
    loadPost(postId);
    // 自动收起目录和遮罩（桌面端和移动端都收起）
    const nav = document.querySelector('.left-nav');
    const overlay = document.querySelector('.overlay');
    nav.classList.remove('show');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
}

// 主题切换
function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
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
    // 获取当前文章ID
    const currentPath = window.location.hash.slice(1) || 'home';
    
    // 更新总PV
    let totalViews = parseInt(localStorage.getItem('totalViews') || '0');
    totalViews++;
    localStorage.setItem('totalViews', totalViews);
    
    // 更新显示
    updateVisitStats(totalViews);
}

// 更新统计显示
function updateVisitStats(views) {
    const pageViews = document.getElementById('pageViews');
    if (pageViews) {
        pageViews.textContent = views;
    }
}

// 添加回到顶部功能
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 控制回到顶部按钮显示/隐藏
window.addEventListener('scroll', () => {
    const backToTop = document.querySelector('.back-to-top');
    if (window.scrollY > 300) { // 滚动超过300px显示按钮
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

// 桌面端导航切换
function toggleDesktopNav() {
    const nav = document.querySelector('.left-nav');
    const mainContent = document.querySelector('.main-content');
    
    // 仅切换 collapsed 类
    nav.classList.toggle('collapsed');
    
    // 保存导航状态
    localStorage.setItem('nav_collapsed', nav.classList.contains('collapsed'));
}

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    generateMenu();
    loadPost('intro'); // 默认加载第一篇文章
    countVisits();
    
    // 初始化主题
    console.log('页面初始化完成');
    
    // 恢复导航状态
    const navCollapsed = localStorage.getItem('nav_collapsed') === 'true';
    if (navCollapsed) {
        document.querySelector('.left-nav').classList.add('collapsed');
    }

    // 桌面端目录感应区
    const sensor = document.querySelector('.sidebar-sensor');
    const nav = document.querySelector('.left-nav');
    const overlay = document.querySelector('.overlay');
    if (sensor && nav && overlay) {
        sensor.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) {
                nav.classList.add('show');
                overlay.classList.add('show');
            }
        });
        nav.addEventListener('mouseleave', (e) => {
            if (window.innerWidth > 768) {
                nav.classList.remove('show');
                overlay.classList.remove('show');
            }
        });
    }
});

// 监听系统主题变化
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    // 只有在用户没有手动设置主题时才跟随系统
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
    }
});

// 监听URL变化
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1);
    loadPost(hash);
    countVisits();
});

// 移动端导航控制
function toggleMenu() {
    const nav = document.querySelector('.left-nav');
    const overlay = document.querySelector('.overlay');
    const isShow = nav.classList.contains('show');
    if (isShow) {
        nav.classList.remove('show');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
    } else {
        nav.classList.add('show');
        overlay.classList.add('show');
        // 只在移动端禁止滚动
        if (window.innerWidth <= 768) {
            document.body.style.overflow = 'hidden';
        }
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
