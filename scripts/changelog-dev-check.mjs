import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * `npm run dev` 启动前的公告自检。
 * 开发服务器不因为公告没确认而启动失败——这里只负责把问题提前摆到眼前。
 */
const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const result = spawnSync(process.execPath, [join(root, 'scripts/changelog-check.mjs')], {
	cwd: root,
	stdio: 'inherit',
});

if (result.status !== 0) {
	console.log('');
	console.log('[changelog] 上一轮的文章修改还没有确认公告；开发服务器仍会启动。');
	console.log('[changelog] 补完公告后运行 npm run changelog:check，或者在提交前再跑一次。');
	console.log('');
}

process.exit(0);
