# 个人网站（GitHub Pages）

这是一个纯静态个人网站，定位为一个简洁、克制、便于长期保留的个人主页：
- 少量个人介绍
- 精选项目 / 作品入口
- Notes / 面经 / 维护记录入口
- Contact 与 GitHub 链接

站点基于原生 `HTML/CSS/JS + Markdown`，不依赖重型框架，方便长期维护和 GitHub Pages 部署。

## 在线地址

- https://trueinfalse.github.io/hui.github.io/

## 目录结构

```text
.
├─ index.html                 # 首页（Intro / Selected / About / Projects / Notes / Contact）
├─ blog.html                  # 文章列表页（标签筛选）
├─ posts/
│  ├─ *.md                    # 文章正文 Markdown
│  ├─ index.json              # 文章元数据索引
│  └─ *.html                  # 文章阅读页（加载对应 Markdown）
├─ assets/
│  ├─ css/main.css            # 全站样式
│  ├─ js/common.js            # 主题、导航、返回顶部等通用逻辑
│  ├─ js/home.js              # 首页精选文章
│  ├─ js/blog.js              # 博客列表与标签筛选
│  ├─ js/post.js              # 文章渲染、目录、进度条、复制代码
│  └─ icons/favicon.svg       # 站点图标
├─ robots.txt
├─ sitemap.xml
└─ .github/workflows/jekyll-gh-pages.yml
```

## 本地运行

由于是静态站，直接起一个本地 HTTP 服务即可：

```bash
python -m http.server 8080
```

然后访问：
- http://localhost:8080/

## 首页维护原则

- 首页只放少量核心信息，不做完整履历页或复杂作品集
- 暂时不重要的内容先隐藏或移动到文章 / archive，而不是堆在首页
- Projects 只保留精选条目，Notes 只展示少量精选文章
- 深色/浅色主题切换、响应式导航、返回顶部保持轻量实现

## 内容更新方式

### 新增文章

1. 在 `posts/` 下新增 Markdown 文件，例如：`my-new-post.md`
2. 在 `posts/index.json` 增加一条元数据：

```json
{
  "slug": "my-new-post",
  "title": "文章标题",
  "summary": "一句简要说明",
  "file": "my-new-post.md",
  "date": "2026-03-22",
  "tags": ["标签A", "标签B"],
  "readingMinutes": 8,
  "featured": false
}
```

3. 复制一份 `posts/intro.html` 并改名为 `posts/my-new-post.html`，将 `data-post-slug` 改成新 slug
4. 提交并推送到 `main`

> 当前文章详情页按 `posts/*.html` 提供稳定链接，原 `posts/*.md` 仍保留。

## 部署说明（GitHub Pages）

仓库已配置 GitHub Actions 自动部署：

- Workflow：`.github/workflows/jekyll-gh-pages.yml`
- 触发条件：推送到 `main`
- 部署方式：上传静态文件并发布到 GitHub Pages

确保仓库设置中 Pages Source 为 **GitHub Actions**。

## 兼容性说明

- 保留深色/浅色主题切换（本地记忆 + 系统偏好）
- 旧版 `/#文章slug` 链接会在首页自动跳转到新文章页
- 文章仍从 Markdown 渲染，便于后续持续写作
