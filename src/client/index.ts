/**
 * @lim324/dsh-copy-session-id — client half. Registers three session-header
 * utility controls in the same `conversation.session.header.utilities` seat:
 * one that copies the current session id to the clipboard, one that opens the
 * current session's working directory in VSCode (via a host `code` spawn), and
 * one that opens the working directory's git origin in GitLab (via a host
 * origin lookup). The surface is client-first; the only host coupling is the
 * open-in-code POST and the git-remote POST, everything else is clipboard +
 * framework session reads.
 * @module @lim324/dsh-copy-session-id/client
 */

import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
// Type-only: pulls the ui-conversation SlotMap merge (the header utilities seat).
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
// Type-only: pulls the locale plugin's Context merge (ctx.locale).
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-slots'
import { CopySessionIdAction } from './CopySessionIdAction.tsx'
import { OpenInCodeAction } from './OpenInCodeAction.tsx'
import { OpenGitlabAction } from './OpenGitlabAction.tsx'
import { en, zh, type CopySessionIdKey, NS } from './locales.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** The copy-session-id utility's copy. */
    copySessionId: CopySessionIdKey
  }
}

export type { CopySessionIdActionProps } from './CopySessionIdAction.tsx'
export type { OpenInCodeActionProps } from './OpenInCodeAction.tsx'
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
      id: 'open-in-code',
      order: 20,
      locale: NS,
    }, OpenInCodeAction),
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
