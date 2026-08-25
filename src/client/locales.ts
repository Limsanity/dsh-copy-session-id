/** `copySessionId` namespace dictionaries. */

/** Dictionary namespace owned by this plugin. */
export const NS = 'copySessionId'

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'copy': '复制会话 ID',
  'copied': '已复制',
  'copy.aria': '复制当前会话的 ID',
} as const

/** English dictionary, key-identical to the Chinese source of truth. */
export const en: Record<CopySessionIdKey, string> = {
  'copy': 'Copy session ID',
  'copied': 'Copied',
  'copy.aria': 'Copy the current session ID',
}

/** Key domain of the `copySessionId` namespace (zh is the source of truth). */
export type CopySessionIdKey = keyof typeof zh
