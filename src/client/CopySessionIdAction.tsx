import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { IconCopyOutline16, Tooltip, writeClipboard } from '@deepseek-ai/dsh-client-ui-primitives'
// Type-only: pulls the ui-conversation SlotMap merge (the header utilities seat
// and its empty owner share).
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import { NS } from './locales.ts'

/** Full utility props: runtime share (standard session kit) & the locale seat. */
export type CopySessionIdActionProps =
  PropsRuntime<'conversation.session.header.utilities'> & PropsLocale<typeof NS>

/** How long the "copied" feedback stays visible after a successful write. */
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

/**
 * Session-header utility that copies the current session's id to the
 * clipboard. The affordance holds no state beyond the transient copied flag; a
 * refused write leaves it untouched, so the control never claims a copy the
 * host declined. Styled inline (no CSS module) so the dynamic client bundle
 * needs no CSS extraction.
 * @param props - runtime slot currency plus the namespace translator.
 * @returns the copy trigger.
 */
export function CopySessionIdAction({ sessionId, t }: CopySessionIdActionProps) {
  const [copied, setCopied] = useState(false)
  const [hovered, setHovered] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => { if (timer.current !== undefined) window.clearTimeout(timer.current) }, [])

  const onCopy = (): void => {
    if (copied) return
    void writeClipboard(sessionId).then((ok) => {
      if (!ok) return
      setCopied(true)
      if (timer.current !== undefined) window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => { setCopied(false) }, COPIED_FEEDBACK_MS)
    })
  }

  return (
    <Tooltip label={copied ? t('copied') : t('copy')} side="bottom" delayMs={300}>
      <button
        type="button"
        style={hovered ? hoverStyle : baseStyle}
        aria-label={t('copy.aria')}
        onClick={onCopy}
        onMouseEnter={() => { setHovered(true) }}
        onMouseLeave={() => { setHovered(false) }}
      >
        <IconCopyOutline16 size={16} />
      </button>
    </Tooltip>
  )
}
