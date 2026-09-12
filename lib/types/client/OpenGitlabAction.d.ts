import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import { NS } from './locales.ts';
/** Full utility props: runtime share (standard session kit) & the locale seat. */
export type OpenGitlabActionProps = PropsRuntime<'conversation.session.header.utilities'> & PropsLocale<typeof NS>;
/**
 * Session-header utility that opens the current session's working directory's
 * git origin in the browser: it resolves the session's cwd through the
 * framework `useSessions` feed, POSTs it to the host route, which runs
 * `git remote get-url origin` and returns the origin's https web URL. The
 * button renders only when the directory is a recognizable git repository
 * (an http/ssh origin); a missing cwd or an unresolvable origin simply hides
 * it. The action holds no state beyond the fetched URL and the hover flag.
 * @param props - runtime slot currency plus the namespace translator.
 * @returns the open-in-GitLab trigger, or null when no git origin is found.
 */
export declare function OpenGitlabAction({ sessionId, useSessions, t }: OpenGitlabActionProps): import("react").JSX.Element | null;
