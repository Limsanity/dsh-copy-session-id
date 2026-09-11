/** `copySessionId` namespace dictionaries. */

/** Dictionary namespace owned by this plugin. */
export const NS = 'copySessionId'

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'copy.aria': '复制当前会话的 ID 或引用文案',
  'copy.menu.title': '复制会话 ID / 引用文案',
  'copy.menu.id': '复制会话 ID',
  'copy.menu.mention': '复制引用文案',
  'copied.id': '已复制会话 ID',
  'copied.mention': '已复制引用文案',
  'openGitlab.open': '在 GitLab 打开当前仓库',
  'openGitlab.aria': '打开当前会话工作目录的 GitLab 仓库',
} as const

/** English dictionary, key-identical to the Chinese source of truth. */
export const en: Record<CopySessionIdKey, string> = {
  'copy.aria': 'Copy the current session ID or its recall mention',
  'copy.menu.title': 'Copy session ID / recall mention',
  'copy.menu.id': 'Copy session ID',
  'copy.menu.mention': 'Copy mention',
  'copied.id': 'Session ID copied',
  'copied.mention': 'Mention copied',
  'openGitlab.open': 'Open repository in GitLab',
  'openGitlab.aria': "Open the current session working directory's GitLab repository",
}

/** Key domain of the `copySessionId` namespace (zh is the source of truth). */
export type CopySessionIdKey = keyof typeof zh
