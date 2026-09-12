/** `copySessionId` namespace dictionaries. */
/** Dictionary namespace owned by this plugin. */
export declare const NS = "copySessionId";
/** Simplified Chinese dictionary (the key-set source of truth). */
export declare const zh: {
    readonly 'copy.aria': "复制当前会话的 ID 或引用文案";
    readonly 'copy.menu.title': "复制会话 ID / 引用文案";
    readonly 'copy.menu.id': "复制会话 ID";
    readonly 'copy.menu.mention': "复制引用文案";
    readonly 'copied.id': "已复制会话 ID";
    readonly 'copied.mention': "已复制引用文案";
    readonly 'openGitlab.open': "在 GitLab 打开当前仓库";
    readonly 'openGitlab.aria': "打开当前会话工作目录的 GitLab 仓库";
};
/** English dictionary, key-identical to the Chinese source of truth. */
export declare const en: Record<CopySessionIdKey, string>;
/** Key domain of the `copySessionId` namespace (zh is the source of truth). */
export type CopySessionIdKey = keyof typeof zh;
