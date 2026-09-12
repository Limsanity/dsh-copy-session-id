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
import type { Context as ClientContext } from '@deepseek-ai/cordis';
import { type CopySessionIdKey } from './locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** The copy-session-id utility's copy. */
        copySessionId: CopySessionIdKey;
    }
}
export type { CopySessionIdActionProps } from './CopySessionIdAction.tsx';
export type { OpenGitlabActionProps } from './OpenGitlabAction.tsx';
/** Stable Cordis plugin name (client half). */
export declare const name = "dsh-copy-session-id";
/** Client services required before the utility can mount. */
export declare const inject: string[];
/**
 * Client plugin body: register the dictionary and the two header utilities.
 * @param ctx - client root context.
 */
export declare function apply(ctx: ClientContext): void;
