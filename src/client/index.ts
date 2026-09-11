/**
 * @lim324/dsh-copy-session-id — client half. Registers two session-header
 * utility controls in the same `conversation.session.header.utilities` seat:
 * one that copies the current session id to the clipboard, and one that opens
 * the working directory's git origin in GitLab (via a host origin lookup).
 *
 * The former "open in VSCode" control was removed: the harness now ships its
 * own open-in-app affordance (`@deepseek-ai/dsh-client-ui-open-in-app` plus the
 * workspace route), so this plugin no longer spawns `code` itself.
 * @module @lim324/dsh-copy-session-id/client
 */

import type { Context as ClientContext } from '@deepseek-ai/cordis'
// Type-only: pulls the ui-conversation SlotMap merge (the header utilities seat).
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
// Type-only: pulls the locale plugin's Context merge (ctx.locale).
import type {} from '@deepseek-ai/dsh-client-locale/client'
// `ctx.slots` is declared on the client Context by ui-renderer at 0.1.5-rc.1
// (it used to live in ui-slots); this type-only import pulls that merge in.
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-slots'
import { CopySessionIdAction } from './CopySessionIdAction.tsx'
import { OpenGitlabAction } from './OpenGitlabAction.tsx'
import { en, zh, type CopySessionIdKey, NS } from './locales.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** The copy-session-id utility's copy. */
    copySessionId: CopySessionIdKey
  }
}

export type { CopySessionIdActionProps } from './CopySessionIdAction.tsx'
export type { OpenGitlabActionProps } from './OpenGitlabAction.tsx'

/** Stable Cordis plugin name (client half). */
export const name = 'dsh-copy-session-id'

/** Client services required before the utility can mount. */
export const inject = ['slots', 'locale']

/**
 * Client plugin body: register the dictionary and the two header utilities.
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

  ctx.slots.inject(
    'conversation.session.header.utilities',
    () => ctx.slots.register({
      name: 'conversation.session.header.utilities',
      id: 'open-gitlab',
      order: 30,
      locale: NS,
    }, OpenGitlabAction),
  )
}
