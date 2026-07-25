# JFZC 的个人小站

一个基于 [Astro](https://astro.build) 搭建的个人博客与作品集网站。

## 关于本站

存放个人的一些碎碎念、博客笔记、小项目记录和折腾计算机的成果。

## 技术栈

- **框架**: Astro 7
- **样式**: Tailwind CSS 4
- **语言**: TypeScript
- **内容**: Markdown + Content Collections

## 快速开始

```bash
npm install        # 安装依赖
npm run dev        # 本地开发
npm run build      # 构建静态网站
npm run preview    # 预览构建结果
```

## 目录结构

```
src/
├── config/site.ts       ← 网站所有配置（导航、文案、模块等）
├── content/
│   ├── blog/            ← 博客文章 (.md)
│   └── projects/        ← 项目文章 (.md)
├── components/          ← 通用组件
├── modules/             ← 页面模块组件
├── layouts/             ← 布局模板
└── pages/               ← 页面路由

public/
├── backgrounds/         ← 背景图
├── blog/                ← 博客配图
├── projects/            ← 项目配图
└── site/                ← 网站组件图片（头像等）

instruction/
└── maintenance.md       ← 网站维护手册
```

## 维护指南

详细的博客撰写、项目添加、配置修改等操作说明请参考 [instruction/maintenance.md](./instruction/maintenance.md)。

## 许可

MIT
