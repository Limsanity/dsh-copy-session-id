import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import { NS } from './locales.ts';
/** Full utility props: runtime share (standard session kit) & the locale seat. */
export type CopySessionIdActionProps = PropsRuntime<'conversation.session.header.utilities'> & PropsLocale<typeof NS>;
/**
 * Session-header utility that copies either the current session's id or its
 * recall mention to the clipboard. The affordance opens a two-entry dropdown
 * (`复制会话 ID` / `复制引用文案`): the id is the raw `session-…` string the
 * autocomplete search narrows on, while the mention is the self-sufficient
 * `@[label](dsh-session:…)` text the host parses at `agent/pre-step` to inject
 * the referenced session as recall context — no autocomplete pick required.
 *
 * Feedback is in-place (no floating toast): on a successful write the trigger's
 * icon swaps to a success checkmark and its tooltip names the copied form for a
 * moment, then reverts. A refused write leaves the control untouched, so it
 * never claims a copy the host declined.
 * @param props - runtime slot currency plus the namespace translator.
 * @returns the copy dropdown trigger.
 */
export declare function CopySessionIdAction({ sessionId, useSessions, t }: CopySessionIdActionProps): import("react").JSX.Element;
