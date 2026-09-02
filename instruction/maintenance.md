# Atlas 网站维护手册

> 基于 Astro 的个人网站模板，使用 Markdown 管理内容。

---

## 目录

1. [快速启动](#1-快速启动)
2. [写博客文章](#2-写博客文章)
3. [添加项目](#3-添加项目)
4. [修改网站配置](#4-修改网站配置)
5. [友情链接管理](#5-友情链接管理)
6. [背景图设置](#6-背景图设置)
7. [首页模块调整](#7-首页模块调整)
8. [图片资源管理](#8-图片资源管理)
9. [构建与部署](#9-构建与部署)

---

## 1. 快速启动

```bash
# 安装依赖
npm install

# 本地开发
npm run dev

# 静态构建
npm run build

# 预览构建结果
npm run preview
```

---

## 2. 写博客文章

### 存放位置

```
src/content/blog/<文件名>.md
```

文件名就是 URL 路径。例如 `galgame-review.md` → `/blog/galgame-review`。

> **注意**：文件名不要用中文或特殊符号，推荐全小写英文+连字符。

> **配图约定**：新建文章后，`public/blog/<文件名>/` 会自动创建（开发服务器实时监听、构建时自动同步）。把文章的图片放进这个同名文件夹即可。

### 元数据格式（Frontmatter）

每篇文章顶部必须有 `---` 包裹的 YAML 元数据：

```markdown
---
title: "文章标题"
description: "一句话摘要，会显示在博客列表页"
pubDate: 2026-07-25
tags: ["galgame", "日常"]
updatedDate: 2026-07-26    ← 可选，最后更新日期
cover: "/blog/cover.png"    ← 可选，封面图
draft: false                ← 可选，true=草稿，不显示在列表
---

正文从这里开始...
```

### 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | ✅ | 文章标题，页面标题会显示 `<title> | 网站名` |
| `description` | ✅ | 列表页显示的摘要 |
| `pubDate` | ✅ | 发布日期，格式 `YYYY-MM-DD` |
| `tags` | ❌ | 标签数组，如 `["Astro", "前端"]` |
| `updatedDate` | ❌ | 最后更新日期 |
| `cover` | ❌ | 封面图路径，建议放 `public/blog/<文章名>/` 下 |
| `draft` | ❌ | 设为 `true` 则文章仅在构建时可见，列表页不显示 |

### 正文 Markdown 语法速查

```markdown
# 一级标题
## 二级标题
### 三级标题

**粗体**  *斜体*  ~~删除线~~

- 无序列表项
- 第二项

1. 有序列表项
2. 第二项

`行内代码`

``` 代码块（三个反引号）

> 引用块

[链接文字](https://example.com)

![图片alt](/blog/my-image.png)

> 图片推荐放在 `public/blog/<文章名>/` 下，例如 `public/blog/galgame-review/1.png` → `![图片alt](/blog/galgame-review/1.png)`

---
（水平分隔线）

[[另一篇文章的标题]]  ← 双链，连接其他文章
```

### 双链语法

用 `[[文章标题]]` 可以链接到本站其他文章，知识图谱页面会自动生成连接关系。

---

## 3. 添加项目

### 存放位置

```
src/content/projects/<文件名>.md
```

文件名就是 URL 路径。例如 `my-app.md` → `/projects/my-app`。

### 元数据格式

```markdown
---
title: "项目名称"
description: "一句话描述项目"
date: 2026-04-12
tags: ["SaaS", "Dashboard"]
role: "Design Engineer"
url: "https://example.com"           ← 可选，项目线上地址
repo: "https://github.com/user/repo" ← 可选，源码仓库
featured: true                       ← true=在首页"最近做的小项目"中展示
---

正文内容...

## 截图

![项目截图](/projects/screenshot.png)
```

### 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | ✅ | 项目名称 |
| `description` | ✅ | 一句话描述 |
| `date` | ✅ | 日期，格式 `YYYY-MM-DD` |
| `tags` | ❌ | 技术标签 |
| `role` | ✅ | 你的角色（如 "全栈开发"） |
| `url` | ❌ | 项目在线链接 |
| `repo` | ❌ | 源码仓库链接 |
| `featured` | ❌ | `true` 则出现在首页精选模块 |

---

## 4. 修改网站配置

所有网站配置集中在 **`src/config/site.ts`**。

### 4.1 基本信息（shared 对象）

```typescript
const shared = {
    name: "JFZC的个人小站",          // 网站标题（Header/Footer 显示）
    email: "jfzc.h.c.c@gmail.com",   // 联系邮箱
    emailIcon: "@",                  // 邮箱图标字符
    avatar: "/site/avatar.png",      // 头像路径
    // ...
};
```

### 4.2 导航栏

```typescript
nav: [
    { label: "首页", href: "/" },
    { label: "关于我", href: "/about" },
    { label: "项目", href: "/projects" },
    { label: "博客", href: "/blog" },
    { label: "联系", href: "/contact" },
],
```

### 4.3 社交链接

```typescript
socials: [
    { label: "GitHub", href: "https://github.com/JFZC-hcc", icon: "GH" },
    { label: "B站", href: "https://space.bilibili.com/xxx", icon: "B" },
],
```

- `label`：显示名称
- `href`：链接地址
- `icon`：图标标识（对应 `SocialIcon.astro` 中的映射）

### 4.4 首页"今日状态"卡片

```typescript
today: {
    title: "👋",                                  // 标题
    activity: "正在折腾一些关于计算机的玩意",       // 活动状态
    timeLabel: "我的当前时间",                      // 时间标签
    timeZone: "Asia/Shanghai",                    // 时区
    dateLocale: "zh-CN",                          // 日期语言
    greetings: ["凌晨好", "早上好", "上午好",       // 按小时段显示的问候语
                "中午好", "下午好", "晚上好"],
},
```

### 4.5 首页按钮文案

```typescript
home: {
    primaryCta: { label: "碎碎念", href: "/blog" },         // 左侧主按钮
    secondaryCta: { label: "了解一下我是谁", href: "/about" }, // 右侧次按钮
},
```

### 4.6 UI 文案

```typescript
ui: {
    headerCta: "向我发邮件",          // Header 按钮
    projectCta: "查看项目 ->",        // 项目卡片按钮
    projectLiveCta: "访问项目",       // 项目详情"访问项目"
    projectRepoCta: "查看代码",       // 项目详情"查看代码"
    backToList: "返回列表",           // 详情页返回按钮
    socialCardCta: "查看主页",        // 联系页社交按钮
},
```

---

## 5. 友情链接管理

### 配置文件

在 `src/config/site.ts` 中 `contact` 页面的 `friendLinks` 模块：

```typescript
{
    type: "friendLinks",
    props: {
        kicker: "Links",
        title: "友情链接",
        description: "一些值得去看看的网站和朋友们的博客",
        links: [
            {
                title: "站点名称",
                url: "https://example.com",
                avatar: "/site/avatar.png",   // 可选，头像路径
                description: "一句话介绍",
            },
            // 继续添加更多...
        ],
    },
},
```

### 头像图片

头像图片放在 `public/site/` 目录下，路径写为 `/site/文件名.png`。

---

## 6. 背景图设置

### 图片存放位置

背景图放在 `public/backgrounds/` 目录，网站构建时会**自动扫描该目录**，把里面的图片全部作为轮播背景，**无需手动维护索引**。

- 支持的格式：`.png` `.jpg` `.jpeg` `.webp` `.gif` `.avif` `.bmp` `.svg`
- 按文件名自然排序轮播（`bg2` 会排在 `bg10` 之前）
- 新增图片：直接把文件放进 `public/backgrounds/`，重启 `npm run dev` / 重新 `npm run build` 即可生效
- 目录为空时只显示纯色背景

### 轮播参数

在 `src/config/site.ts` 的 `shared.background` 中：

```typescript
background: {
    images: listBackgroundImages(),  // 自动读取，不要手动修改
    interval: 8000,      // 每张图停留时间（毫秒），8000 = 8秒
    blur: "0px",         // 模糊程度
    opacity: 0.9,        // 图片不透明度 0~1
    scale: 1,            // 缩放比例
    overlay: "...",      // 叠加渐变，保持暗色确保文字可读
},
```

- 切换采用双图层交叉淡入淡出，任意时刻都有背景，不会出现空白
- `opacity` 建议 0.5~0.7 之间比较合适
- `overlay` 负责暗色渐变层，保证文字清晰

---

## 7. 首页模块调整

首页布局由 `site.ts` → `pages.home.modules` 数组决定：

```typescript
modules: [
    { type: "homeHero" },                    // 问候+状态+头像+快捷链接
    { type: "linkGrid", props: {             // 快捷导航网格
        items: [
            { label: "博客与碎碎念", href: "/blog" },
            { label: "目前做的小玩意", href: "/projects" },
            { label: "了解一下我", href: "/about" },
            { label: "联系方式", href: "/contact" },
        ]
    }},
    { type: "projectGrid", props: {          // 项目展示
        featuredOnly: true,                   // 仅展示 featured=true 的项目
        limit: 3,
        columns: 3,
    }},
    { type: "blogPreview", props: {          // 最新博客预览
        limit: 3,
    }},
    { type: "richText", props: {             // Markdown 文本块
        body: "这里是 **Markdown** 内容..."
    }},
],
```

### 可用模块类型

| type | 用途 | 主要参数 |
|------|------|---------|
| `homeHero` | 首页大标题+问候+时间+快捷链接 | 无参数（自动读取 home/today 配置） |
| `linkGrid` | 快捷链接网格 | `items: [{label, href}]` |
| `projectGrid` | 项目卡片网格 | `featuredOnly`, `limit`, `columns` |
| `blogPreview` | 最新博客预览 | `limit` |
| `aboutIntro` | 关于页介绍 | `heading`, `intro`, `paragraphs` |
| `gameList` | 爱好卡片（支持 Markdown） | `title`, `items: [{label, description, content}]` |
| `skillCloud` | 技能标签云 | `title`, `skills: string[]` |
| `blogIndex` | 博客索引页（搜索+标签筛选） | `labels` |
| `richText` | Markdown 文本块 | `body: string` |
| `contactCards` | 联系方式卡片 | `heading`, `intro` |
| `friendLinks` | 友情链接 | `title`, `links: [{title, url, avatar, description}]` |

---

## 8. 图片资源管理

### 目录结构

```
public/
├── backgrounds/     ← 网站背景图
├── blog/            ← 博客文章配图（每篇文章一个同名子文件夹）
├── projects/        ← 项目截图/配图
├── site/            ← 网站组件图片（头像、友链头像等）
├── favicon.ico
└── favicon.svg
```

### 博客配图约定：一篇文章一个文件夹

每篇博客文章对应一个**与文章同名的资源文件夹**：

```
src/content/blog/我的新文章.md      ← 文章
public/blog/我的新文章/图片1.png     ← 该文章的配图
```

- 新建 `.md` 文章后，`public/blog/` 下会自动创建同名文件夹（开发服务器运行时实时监听；构建时也会自动同步）。
- 也可以手动运行 `npm run blog:folders` 同步一次。
- 图片引用方式：`![图片alt](/blog/我的新文章/图片1.png)`
- 封面图 `cover` 同理：`cover: "/blog/我的新文章/cover.png"`

### 引用方式

```
public/site/avatar.png          →  /site/avatar.png
public/blog/我的新文章/cover.jpg  →  /blog/我的新文章/cover.jpg
public/backgrounds/bg1.png      →  /backgrounds/bg1.png
```

### 资源文件夹自动创建

- **开发时**：`npm run dev` 启动后，脚本会监听 `src/content/blog/`，新增 `.md` 文件时自动在 `public/blog/` 下创建同名文件夹。
- **构建时**：`npm run build` 前会自动同步一次，确保所有文章都有对应文件夹。
- **手动同步**：`npm run blog:folders`（一次性）、`npm run blog:folders:watch`（监听模式）。
- 脚本只创建缺失的文件夹，不会删除或移动任何已有文件，可放心重复运行。

---

## 9. 构建与部署

```bash
# 开发模式（热更新）
npm run dev

# 构建静态网站
npm run build

# 输出在 dist/ 目录，可直接部署到任何静态托管服务
```

构建输出在 `dist/` 目录，可以直接上传到任意静态托管平台（Vercel、Netlify、Cloudflare Pages、GitHub Pages 等）。

---

> 最后更新：2026-08-26
