document.addEventListener('DOMContentLoaded', function() {
    // 获取当前页面路径层级
    const pathLevel = window.location.pathname.split('/').length - 2;
    const basePath = '../'.repeat(pathLevel);

    // 加载侧边栏
    fetch(basePath + 'common/sidebar.html')
        .then(response => response.text())
        .then(data => {
            // 替换所有以 "/" 开头的链接
            data = data.replace(/href="\//g, `href="${basePath}`);
            // 替换图片路径
            data = data.replace(/src="\//g, `src="${basePath}`);
            
            // 插入侧边栏内容
            document.querySelector('#wrapper').insertAdjacentHTML('beforeend', data);
            
            // 初始化菜单功能
            initMenu();
        });
});

// 初始化菜单功能
function initMenu() {
    // 添加菜单展开/收起功能
    document.querySelectorAll('.opener').forEach(opener => {
        opener.addEventListener('click', function(e) {
            e.preventDefault();
            this.parentElement.classList.toggle('active');
        });
    });
}