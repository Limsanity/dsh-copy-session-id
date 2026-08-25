/**
 * @lim324/dsh-copy-session-id — client half. Registers one session-header
 * utility control that copies the current session id to the clipboard, using
 * the shared copy helper from ui-primitives. The whole surface is client-only;
 * no RPC and no host state. Session scope: the utility receives the framework
 * session kit (including `sessionId`) and renders beside the title.
 * @module @lim324/dsh-copy-session-id/client
 */

import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
// Type-only: pulls the ui-conversation SlotMap merge (the header utilities seat).
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
// Type-only: pulls the locale plugin's Context merge (ctx.locale).
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-slots'
import { CopySessionIdAction } from './CopySessionIdAction.tsx'
import { en, zh, type CopySessionIdKey, NS } from './locales.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** The copy-session-id utility's copy. */
    copySessionId: CopySessionIdKey
  }
}

export type { CopySessionIdActionProps } from './CopySessionIdAction.tsx'

/** Stable Cordis plugin name (client half). */
export const name = 'dsh-copy-session-id'

/** Client services required before the utility can mount. */
export const inject = ['slots', 'locale']

/**
 * Client plugin body: register the dictionary and the header utility.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-copy-session-id: dictionaries')

  ctx.slots.inject(
    'conversation.session.header.utilities',
    () => ctx.slots.register({
      name: 'conversation.session.header.utilities',
      id: 'copy-session-id',
      order: 10,
      locale: NS,
    }, CopySessionIdAction),
  )
}
