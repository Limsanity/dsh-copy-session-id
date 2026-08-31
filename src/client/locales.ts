/** `copySessionId` namespace dictionaries. */

/** Dictionary namespace owned by this plugin. */
export const NS = 'copySessionId'

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'copy': '复制会话 ID',
  'copied': '已复制',
  'copy.aria': '复制当前会话的 ID',
  'openCode.open': '用 VSCode 打开当前目录',
  'openCode.opened': '已打开',
  'openCode.noCwd': '当前会话没有工作目录',
  'openCode.aria': '用 VSCode 打开当前会话的工作目录',
  'openGitlab.open': '在 GitLab 打开当前仓库',
  'openGitlab.aria': '打开当前会话工作目录的 GitLab 仓库',
} as const

/** English dictionary, key-identical to the Chinese source of truth. */
export const en: Record<CopySessionIdKey, string> = {
  'copy': 'Copy session ID',
  'copied': 'Copied',
  'copy.aria': 'Copy the current session ID',
  'openCode.open': 'Open working directory in VSCode',
  'openCode.opened': 'Opened',
  'openCode.noCwd': 'This session has no working directory',
  'openCode.aria': 'Open the current session working directory in VSCode',
  'openGitlab.open': 'Open repository in GitLab',
  'openGitlab.aria': "Open the current session working directory's GitLab repository",
}

/** Key domain of the `copySessionId` namespace (zh is the source of truth). */
export type CopySessionIdKey = keyof typeof zh
