import { useEffect, useState } from 'react'
import type { CSSProperties, MouseEvent } from 'react'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { Tooltip } from '@deepseek-ai/dsh-client-ui-primitives'
// Type-only: pulls the ui-conversation SlotMap merge (the header utilities seat).
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import { NS } from './locales.ts'

/** Full utility props: runtime share (standard session kit) & the locale seat. */
export type OpenGitlabActionProps =
  PropsRuntime<'conversation.session.header.utilities'> & PropsLocale<typeof NS>

/** The host route the browser POSTs the working directory to for its origin. */
const GIT_REMOTE_ROUTE = '/copy-session-id/git-remote'

/** Default button chrome; hover raises the label color (mirror of the sibling buttons). */
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

/** The GitLab mark, inlined so the dynamic client bundle needs no icon import. */
function IconGitlab16({ size = 16 }: { size?: number }): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M23.6004 9.5927l-.0337-.0862L20.3.9814a.851.851 0 0 0-.3362-.405.8748.8748 0 0 0-.9997.0539.8748.8748 0 0 0-.29.4399l-2.2055 6.748H7.5375l-2.2057-6.748a.8573.8573 0 0 0-.29-.4412.8748.8748 0 0 0-.9997-.0537.8585.8585 0 0 0-.3362.4049L.4332 9.5015l-.0325.0862a6.0657 6.0657 0 0 0 2.0119 7.0105l.0113.0087.03.0213 4.976 3.7264 2.462 1.8633 1.4995 1.1321a1.0085 1.0085 0 0 0 1.2197 0l1.4995-1.1321 2.4619-1.8633 5.006-3.7489.0125-.01a6.0682 6.0682 0 0 0 2.0094-7.003z" />
    </svg>
  )
}

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
export function OpenGitlabAction({ sessionId, useSessions, t }: OpenGitlabActionProps) {
  const cwd = useSessions((state) => state.byId[sessionId]?.cwd)
  const [webUrl, setWebUrl] = useState<string | null>(null)
  const [hovered, setHovered] = useState(false)

  // Resolve the origin remote whenever the working directory changes. The
  // button stays hidden until the host confirms a git origin, so it never
  // flashes in for a directory that turns out to be untracked.
  useEffect(() => {
    if (cwd === undefined || cwd === '') {
      setWebUrl(null)
      return
    }
    let alive = true
    void fetch(GIT_REMOTE_ROUTE, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ cwd }),
    })
      .then((response) => {
        if (!response.ok) return undefined
        return response.json() as Promise<{ webUrl: string | null }>
      })
      .then((data) => { if (alive) setWebUrl(data?.webUrl ?? null) })
      .catch(() => { if (alive) setWebUrl(null) })
    return () => { alive = false }
  }, [cwd])

  if (webUrl === null) return null

  const onOpen = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault()
    // noopener/noreferrer: the repo page must not drive or identify the shell.
    window.open(webUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <Tooltip label={t('openGitlab.open')} side="bottom" delayMs={300}>
      <button
        type="button"
        style={hovered ? hoverStyle : baseStyle}
        aria-label={t('openGitlab.aria')}
        onClick={onOpen}
        onMouseEnter={() => { setHovered(true) }}
        onMouseLeave={() => { setHovered(false) }}
      >
        <IconGitlab16 size={16} />
      </button>
    </Tooltip>
  )
}
