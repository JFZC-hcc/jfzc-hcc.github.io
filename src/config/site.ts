export const defaultLocale = "zh";

export const locales = {
	zh: {
		label: "中文",
		lang: "zh-CN",
	},
} as const;

export type Locale = 'zh';

const shared = {
	name: "JFZC的个人小站",
	email: "jfzc.h.c.c@gmail.com",
	emailIcon: "@",
	avatar: "/site/avatar.png",
	background: {
		images: ["/backgrounds/bg1.png", "/backgrounds/bg2.png", "/backgrounds/bg3.png"],
		interval: 8000,
		blur: "0px",
		opacity: 0.8,
		scale: 1,
		overlay: "radial-gradient(circle at top left, rgba(255,255,255,0.08), transparent 40%), linear-gradient(180deg, rgba(5,5,5,0.7) 0%, rgba(0,0,0,0.8) 55%, rgba(9,9,9,0.9) 100%)",
		rain: {
			enabled: false,
			mode: "falling",
			density: 0.7,
			speed: 1,
			dropColor: "rgba(210, 230, 255, 0.5)",
			rippleColor: "rgba(210, 230, 255, 0.34)",
			maxDrops: 170,
			maxRipples: 48,
		},
	},
	socials: [
		{ label: "GitHub", href: "https://github.com/JFZC-hcc", icon: "GH" },
		{ label: "B站", href: "https://space.bilibili.com/473409126", icon: "B" },
	],
};

const siteConfigs = {
	zh: {
		...shared,
		title: "这里是JFZC的个人博客",
		description: "这个人还没有想好在网页的底端该写点什么",
		nav: [
			{ label: "首页", href: "/" },
			{ label: "关于我", href: "/about" },
			{ label: "项目", href: "/projects" },
			{ label: "博客", href: "/blog" },
			{ label: "联系", href: "/contact" },
		],
		quickLinks: [
			{ label: "博客", href: "/blog", icon: "文" },
			{ label: "项目", href: "/projects", icon: "作" },
			{ label: "关于", href: "/about", icon: "我" },
			{ label: "联系", href: "/contact", icon: "@" },
		],
		today: {
			title: "目前的个人工作进度",
			activity: "正在折腾一些关于计算机的玩意",
			timeLabel: "我的当前时间",
			timeZone: "Asia/Shanghai",
			dateLocale: "zh-CN",
			greetings: ["凌晨好", "早上好", "上午好", "中午好", "下午好", "晚上好"],
		},
		ui: {
			headerCta: "向我发邮件",
			projectCta: "查看项目 ->",
			projectLiveCta: "访问项目",
			projectRepoCta: "查看代码",
			backToList: "返回列表",
			socialCardCta: "查看主页",
		},
		home: {
			eyebrowNote: "一个目前没什么技术但是对计算机学科抱有热情的人",
			headline: "欢迎来到属于JFZC的小站",
			intro: "这里是JFZC的小博客网站，用来存放个人的一些碎碎念之类的玩意",
			primaryCta: { label: "碎碎念", href: "/blog" },
			secondaryCta: { label: "了解一下我是谁", href: "/about" },
		},
		pages: {
			home: {
				title: "首页",
				description: "一个黑色系 Astro 个人网站模板。",
				modules: [
					{ type: "homeHero" },
					{
						type: "linkGrid", props: {
							items: [
								{ label: "博客与碎碎念", href: "/blog" },
								{ label: "目前做的小玩意", href: "/projects" },
								{ label: "了解一下我", href: "/about" },
								{ label: "联系方式", href: "/contact" },
							]
						}
					},
					{
						type: "projectGrid",
						props: {
							kicker: "Small Builds",
							title: "最近做的小项目",
							description: "存档与记录",
							featuredOnly: true,
							limit: 3,
							columns: 3,
						},
					},
					{
						type: "blogPreview",
						props: {
							kicker: "Notes",
							title: "最新博客",
							description: "JFZC的碎碎念博客",
							limit: 3,
						},
					},
					{
						type: "richText",
						props: {
							body: "如果你在这里发现了有趣的项目或笔记，欢迎**打个招呼**。\n\n可以通过邮箱联系我：`jfzc.h.c.c@gmail.com`\n\n或者直接在 GitHub 上 [找我](https://github.com/JFZC-hcc)。"
						}
					},
				],
			},
			about: {
				title: "关于我",
				description: "关于学生个人主页、学习方向、技能和兴趣的介绍。",
				modules: [
					{
						type: "aboutIntro",
						props: {
							kicker: "About",
							heading: "你好！这里是JFZC!",
							intro: "一个普通的热爱计算机技术的人，虽然还没啥水平",
							profileLabel: "Profile",
							profile: "只是一个对计算机技术非常感兴趣的一个计科专业学生.主要爱好是音乐游戏,泛acgn文化圈,galgame和计算机技术",
							paragraphs: [
								"说实话，我还没想好这个地方应该写点什么",
								"大抵这个网站做出来为了来存放一些自己写的一些东西,或者存放一些我自己的小项目,也算是一个记录",
								"总之如果你有兴趣,欢迎来看看我的碎碎念"
							],
						},
					},
					{
						type: "gameList",
						props: {
							title: "我的爱好和成分",
							description: "希望你能从这里快速认识一下我",
							items: [
								{
									label: "音乐游戏",
									description: "这算是我真正意义上第一次意识到我喜欢打的游戏类型!",
									content: "## 移动端\n>因为上学没有平板手机操作太憋屈而被大量搁置的游戏\n\n#  phigros\n- 音乐游戏的正式开始,在初中的补习班上第一次看见同班同学游玩过后毅然决然的回家下载了这款音游,当时正值2.0.0的更新\n# ARCAEA\n- 在初中初识音游后尝试的第二个音乐游戏,受同学影响,在高中阶段游玩的时间较长,虽然玩蛇确实很有意思,但是本人的实力确实不咋地.\n~~在6.0.0更新之后被新时代谱面打的片甲不留~~\n# 旋转音律\n- 在大学军训的时候由于过于想念在移动设备上打音游而下载的音乐游戏~~然后发现自己拇指跟肌无力一样打交打不稳~~,现在偶尔游玩\n## PC端\n>上了大学有了独立电脑后基于4k需求所发展出来的音游兴趣\n\n# OSU!\n- 不必多言,社区音游这一块,恐怖希腊字母这一块\n- 大概能游玩3星左右的谱面\n# vivid/stasis\n- 在steam上游玩的小众4k下落式音游,剧情写的很好\n## 街机端\n>在大学有了较多自由时间之后发现的全新种类,目前主要游玩\n\n# maimai DX\n- awmc\n- 国内说到街机音游绝对会出现的神秘八键洗衣机\n- 是个星星b\n# CHUNITHM\n- 在假期斥巨资购买手台之后在不方便出勤的时候玩的~~pc~~街机音游\n~~恐怖大猩猩来袭~~\n- 中二节奏独有的操作手感与自由度也是我移动端音游逐渐打的比较少的缘故",
								},
								{
									label: "galgame",
									description: "水课好伙伴(?)~~恋爱教程~~",
									content: "- 从高中阶段陆陆续续开始游玩galgame,主要是废萌和剧情向作品都有在游玩\n- **欢迎向我推荐你喜欢的作品**!\n- 第一部有玩的作品算是拔作(?)《天降虚拟偶像》\n- 以后也会更新一些小的游玩感想到博客里面",
								},
								{
									label: "泛ACGN亚文化",
									description: "这个人没活了因为没看啥动漫也没玩啥二游写个这个标题",
									content: "## 动画\n- 其实我看番不算多也没有跟着当季新番追番的情节,更多是找到有意思题材的动漫就看下去\n- 印象里看番的开始是《总之就是非常可爱》~~然后这个b第二季出的时候第一季的角色内容忘完了~~\n- 目前在看《名侦探光之美少女》\n~~子供向~~\n- 目前有大的补番想法的有《恋人不行》和《无职转生》\n>其实是这个人懒得看番才看这么少\n\n## 漫画\n- 关注的作品很少,多为漫改动漫的原作\n- 主要在看《憧憬成为魔法少女》《珈百璃的堕落》\n## 二游\n其实我不太喜欢二游社区,但是为了喜欢的角色还是进去看些讨论\n**目前在玩的**\n# 碧蓝航线\n- 碧蓝航线婚小萝莉和少女的来\n- 完美符合我对二游的需求的游戏,自然投入了大量的金钱和心血(目移)\n# 异环\n- 开服时感兴趣下载游玩\n- 因为惯性还没有弃坑\n## 亚文化\n- 由于常年混迹各种论坛导致对各种亚文化都有一点了解",
								},
								{
									label: "计算机与折腾",
									description: "其实这个算是我最没的说的爱好,因为其实回过头来看对这个东西的了解也并没有增添多少",
									content: "- 自我拥有第一台手机的时候,我就喜欢在网上混迹各种论坛,看看有没有喜欢的东西和内容,而在这一来二去的折腾中,我有了最基础的实用计算机概念\n- 同样是出于对这个东西的感兴趣,我选择了这个专业\n- 希望以后能通过更多的对计算机的实操与项目工作中增添对于计算机的了解",
								},
							],
						},
					},
					/*{
						type: "skillCloud",
						props: {
							title: "技能栈",
							skills: ["Astro", "TypeScript", "Tailwind CSS", "Design Systems", "UX Engineering", "Content Strategy"],
						},
					},
					},*/
				],
			},
			projects: {
				title: "做过的一些小项目的汇总",
				description: "一个对自己完成的项目的存档",
				modules: [
					{
						type: "projectGrid",
						props: {
							kicker: "Portfolio",
							title: "做过的一些小项目的汇总",
							description: "一个对自己完成的项目的存档",
							columns: 2,
							largePadding: true,
						},
					},
				],
			},
			blog: {
				title: "博客与笔记",
				description: "自己平常写的博客或者摘抄的笔记",
				modules: [
					{
						type: "blogIndex",
						props: {
							kicker: "Notes",
							title: "博客与笔记",
							description: "自己平常写的博客或者摘抄的笔记",
							labels: {
								search: "搜索标题、摘要或标签",
								all: "全部",
								empty: "没有找到符合条件的笔记。",
							},
						},
					},
				],
			},
			contact: {
				title: "联系方式",
				description: "联系这个个人网站的作者。",
				modules: [
					{
						type: "contactCards",
						props: {
							kicker: "Contact",
							heading: "联系方式",
							intro: "有什么想法可以来跟我交流交流",
						},
					},
					{
						type: "friendLinks",
						props: {
							kicker: "Links",
							title: "友情链接",
							description: "朋友们的博客和网站",
							links: [
								{
									title: "DonjuanPlatinum",
									url: "https://donplat.barrensea.org/",
									avatar: "/site/DonjuanPlatinum.png",
									description: "DonjuanPlatinum的个人网站，欢迎大家去看看",
								},
								//这个后面添加网站
							],
						},
					},
				],
			},
		},
	},
} as const;

export function getLocaleFromUrl(_url: URL): Locale {
	return 'zh';
}

export function localizePath(_locale: Locale, path: string): string {
	return path;
}

export function getSiteConfig(localeOrUrl: Locale | URL = defaultLocale) {
	const locale = localeOrUrl instanceof URL ? getLocaleFromUrl(localeOrUrl) : localeOrUrl;
	return siteConfigs[locale];
}

export const siteConfig = getSiteConfig(defaultLocale);
