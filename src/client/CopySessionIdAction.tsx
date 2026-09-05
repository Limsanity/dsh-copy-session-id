import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import {
  IconCheckOutline16,
  IconCopyOutline16,
  IconLinkOutline16,
  Menu,
  Tooltip,
  writeClipboard,
} from '@deepseek-ai/dsh-client-ui-primitives'
// Type-only: pulls the ui-conversation SlotMap merge (the header utilities seat
// and its empty owner share).
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import { NS } from './locales.ts'

/** Full utility props: runtime share (standard session kit) & the locale seat. */
export type CopySessionIdActionProps =
  PropsRuntime<'conversation.session.header.utilities'> & PropsLocale<typeof NS>

/** How long the in-place "copied" checkmark stays visible after a successful write. */
const COPIED_FEEDBACK_MS = 1500

/** Default button chrome; hover raises the label color. */
const baseStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 28,
  minHeight: 28,
  padding: 3,
  border: 0,
  borderRadius: 6,
  background: 'transparent',
  color: 'var(--dsw-alias-label-tertiary)',
  cursor: 'pointer',
}

const hoverStyle: CSSProperties = { ...baseStyle, color: 'var(--dsw-alias-label-secondary)' }

/** The row just copied: drives the temporary checkmark + tooltip label. */
type Copied = 'id' | 'mention'

/**
 * Canonical `dsh-session:` body, browser-safe (no global `Buffer`). Matches the
 * host `encodeSessionReferenceUri`: `base64url(JSON.stringify(sessionId))` over
 * the UTF-8 bytes, so a copied mention decodes to the same session id.
 * @param sessionId - opaque session id to serialize.
 * @returns the `dsh-session:<payload>` URI.
 */
function encodeSessionRefUri(sessionId: string): string {
  const json = JSON.stringify(sessionId)
  const bytes = new TextEncoder().encode(json)
  let bin = ''
  for (const byte of bytes) bin += String.fromCharCode(byte)
  return `dsh-session:${btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/u, '')}`
}

/** Escape `\` and `]` exactly as the host `formatSessionReferenceMention` does. */
function escapeLabel(label: string): string {
  return label.replace(/[\\\]]/gu, (match) => `\\${match}`)
}

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
export function CopySessionIdAction({ sessionId, useSessions, t }: CopySessionIdActionProps) {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [copied, setCopied] = useState<Copied | null>(null)
  const timer = useRef<number | undefined>(undefined)

  useEffect(
    () => () => { if (timer.current !== undefined) window.clearTimeout(timer.current) },
    [],
  )

  const displayTitle = useSessions((sessions) => sessions.byId[sessionId]?.displayTitle)
  const label = displayTitle ?? sessionId
  const mention = useMemo(
    () => `@[${escapeLabel(label)}](${encodeSessionRefUri(sessionId)})`,
    [label, sessionId],
  )

  const copy = (id: string): void => {
    const text = id === 'mention' ? mention : sessionId
    setOpen(false)
    void writeClipboard(text).then((ok) => {
      if (!ok) return
      setCopied(id === 'mention' ? 'mention' : 'id')
      if (timer.current !== undefined) window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => { setCopied(null) }, COPIED_FEEDBACK_MS)
    })
  }

  const tooltipLabel = copied !== null
    ? (copied === 'mention' ? t('copied.mention') : t('copied.id'))
    : t('copy.menu.title')

  const style = copied !== null
    ? { ...baseStyle, color: 'var(--dsw-alias-state-success-primary)' }
    : open
      ? hoverStyle
      : hovered
        ? hoverStyle
        : baseStyle

  return (
    <Menu
      open={open}
      anchor={
        <Tooltip label={tooltipLabel} side="bottom" delayMs={300}>
          <button
            type="button"
            style={style}
            aria-label={t('copy.aria')}
            aria-haspopup="menu"
            aria-expanded={open}
            onMouseEnter={() => { setHovered(true) }}
            onMouseLeave={() => { setHovered(false) }}
            onClick={() => { if (copied === null) setOpen((value) => !value) }}
          >
            {copied !== null
              ? <IconCheckOutline16 size={16} />
              : <IconCopyOutline16 size={16} />}
          </button>
        </Tooltip>
      }
      items={[
        { id: 'id', label: t('copy.menu.id'), icon: <IconCopyOutline16 size={16} /> },
        { id: 'mention', label: t('copy.menu.mention'), icon: <IconLinkOutline16 size={16} /> },
      ]}
      onSelect={copy}
      onClose={() => { setOpen(false) }}
      portal
      align="end"
    />
  )
}
