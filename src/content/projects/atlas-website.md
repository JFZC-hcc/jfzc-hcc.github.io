---
title: "Atlas — 个人网站搭建"
description: "基于 Astro 模板修改，搭建属于自己的个人小站"
date: 2026-07-25
tags: ["Astro", "TypeScript", "Tailwind CSS", "Web"]
role: ["全栈学习者","ai学习","vibecoding"]
repo: "https://github.com/JFZC-hcc/jfzc-hcc.github.io"
featured: true
---

## 项目简介

这个网站是基于 Atlas 模板进行个性化修改后搭建的个人博客/作品集网站。从删除英文模块、调整布局、添加友情链接到配置背景图轮播，一步步把模板改造成了属于自己的样子。

## 主要工作

### 1. 精简语言与模块

- 移除了整个英文语言包和相关路由（`src/pages/en/`）
- 删除了图谱、简历等不需要的页面
- 去除了 Steam 状态、访客计数等多余功能

### 2. 自定义内容

- 修改了导航栏、首页文案、按钮文字
- 添加了**爱好卡片**板块，支持 Markdown 语法编辑内容
- 在联系页面新增**友情链接**功能（头像+名称+描述）
- 将"今日小状态"改成了问候语+活动状态卡片

### 3. 视觉调整

- 配置了**多张背景图轮播**，每 15 秒自动切换
- 调整了背景叠加层的透明度，让背景图可见同时保证文字可读
- 将爱好卡片从双列改为单列全宽布局
- 规范化了 `public/` 目录结构（`site/`、`blog/`、`projects/`、`backgrounds/`）

### 4. 内容管理

- 撰写了几篇博客文章（galgame 游玩测评等）
- 编写了网站维护手册，方便以后管理

## 技术栈

- **框架**: Astro 7（静态站点生成）
- **样式**: Tailwind CSS 4
- **语言**: TypeScript
- **内容**: Markdown + Content Collections

## 收获

通过这次修改，我熟悉了 Astro 的页面路由、组件系统、Content Collections 以及 Tailwind CSS 的用法，也对个人网站的架构有了更清晰的理解。
