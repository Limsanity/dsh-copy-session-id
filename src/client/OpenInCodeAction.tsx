import { useState } from 'react'
import type { CSSProperties, MouseEvent } from 'react'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { Tooltip } from '@deepseek-ai/dsh-client-ui-primitives'
// Type-only: pulls the ui-conversation SlotMap merge (the header utilities seat).
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import { NS } from './locales.ts'

/** Full utility props: runtime share (standard session kit) & the locale seat. */
export type OpenInCodeActionProps =
  PropsRuntime<'conversation.session.header.utilities'> & PropsLocale<typeof NS>

/** The host route the browser POSTs the working directory to. */
const OPEN_IN_CODE_ROUTE = '/copy-session-id/open-in-code'

/** Transient "opening" feedback duration after a successful spawn. */
const OPENED_FEEDBACK_MS = 1500

/** Default button chrome; hover raises the label color (mirror of the copy button). */
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

/** The VSCode mark, inlined so the dynamic client bundle needs no icon import. */
function IconCode16({ size = 16 }: { size?: number }): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" />
    </svg>
  )
}

/**
 * Session-header utility that opens the current session's working directory in
 * VSCode: it resolves the session's cwd through the framework `useSessions`
 * feed and POSTs it to the host route, which spawns `code <cwd>`. The action
 * holds no state beyond the transient feedback flag; a missing cwd is a no-op
 * (the button is still a disabled affordance rather than an error).
 * @param props - runtime slot currency plus the namespace translator.
 * @returns the open-in-code trigger.
 */
export function OpenInCodeAction({ sessionId, useSessions, t }: OpenInCodeActionProps) {
  const [opened, setOpened] = useState(false)
  const [hovered, setHovered] = useState(false)

  const cwd = useSessions((state) => state.byId[sessionId]?.cwd)
  const disabled = cwd === undefined || cwd === ''

  const onOpen = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault()
    if (disabled || opened) return
    void fetch(OPEN_IN_CODE_ROUTE, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ cwd }),
    }).then((response) => {
      if (!response.ok) return
      setOpened(true)
      window.setTimeout(() => { setOpened(false) }, OPENED_FEEDBACK_MS)
    }).catch(() => { /* network failure: keep the control quiet */ })
  }

  const label = disabled ? t('openCode.noCwd') : opened ? t('openCode.opened') : t('openCode.open')

  return (
    <Tooltip label={label} side="bottom" delayMs={300}>
      <button
        type="button"
        style={hovered ? hoverStyle : baseStyle}
        aria-label={t('openCode.aria')}
        aria-disabled={disabled}
        onClick={onOpen}
        onMouseEnter={() => { setHovered(true) }}
        onMouseLeave={() => { setHovered(false) }}
      >
        <IconCode16 size={16} />
      </button>
    </Tooltip>
  )
}
