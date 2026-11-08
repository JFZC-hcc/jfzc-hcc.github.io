import { syncChangelog } from './changelog-sync-core.mjs';

/**
 * 生成缺失的公告：
 * - 新文章（pubDate 在 [startDate, 今天]）→ article-new
 * - 旧文修改（updatedDate 在 [startDate, 今天]）→ article-update 草稿，等人补说明
 *
 * 幂等：已存在的 ref + 日期 + 类型组合会跳过；不读 git 历史。
 */
function main() {
	const dryRun = process.argv.includes('--dry-run');
	const result = syncChangelog({ dryRun });

	for (const item of result.created) {
		console.log(`${dryRun ? '[dry-run] 将创建' : '新建'} ${item.relative}`);
	}

	console.log('');
	console.log(`changelog:sync${dryRun ? '（dry-run）' : ''}`);
	console.log(`  文章 ${result.posts} 篇，已有公告 ${result.entries} 条`);
	if (result.created.length === 0) {
		console.log('  没有需要生成的公告');
	} else {
		console.log(`  生成 ${result.created.length} 条公告`);
	}

	if (result.drafts > 0) {
		console.log('');
		console.log('  有文章/项目更新公告还是草稿：请补充 description、移除 draft: true，然后运行 npm run changelog:check');
	}
}

try {
	main();
} catch (error) {
	console.error(`changelog:sync 失败：${error instanceof Error ? error.message : String(error)}`);
	process.exit(1);
}
