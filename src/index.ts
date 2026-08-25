/**
 * @lim324/dsh-copy-session-id — host half. The copy-session-id affordance is
 * entirely a Web client surface (one session-header utility button that copies
 * the current session id). The host half exists only so the package is a valid
 * Cordis bundle in a profile: it registers nothing and owns no state.
 * @module @lim324/dsh-copy-session-id
 */

import type { Context } from '@deepseek-ai/cordis'

/** Stable Cordis plugin name. */
export const name = 'dsh-copy-session-id'

/** No host-side services are required. */
export const inject: string[] = []

/**
 * No-op host body. The browser half is discovered from the package's
 * `dsh.client.platform: web` metadata by the Web shell, independent of this
 * host plugin.
 * @param _ctx - unused plugin context.
 */
export function apply(_ctx: Context): void {
  // Intentional no-op; see the module comment.
}
