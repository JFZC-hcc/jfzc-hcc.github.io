# 由 npm run changelog:sync 自动生成；CLI 与 dev 监听器共用
export interface CreatedChangelogEntry {
	file: string;
	relative: string;
	entry: {
		id: string;
		type: string;
		source: string;
		title: string;
		description: string;
		date: string;
		ref?: string;
		link?: string;
		draft?: boolean;
	};
}

export interface SyncChangelogResult {
	created: CreatedChangelogEntry[];
	posts: number;
	entries: number;
	drafts: number;
}

export function syncChangelog(options?: { dryRun?: boolean }): SyncChangelogResult;
