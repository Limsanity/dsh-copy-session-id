/**
 * @lim324/dsh-copy-session-id — host half. The copy-session-id affordance is a
 * Web client surface (one session-header utility button), but the sibling
 * "open in code" and "open in GitLab" actions need a host process: the browser
 * cannot spawn `code` or ask git for a repository's origin, so it POSTs the
 * target working directory here and the host spawns the VSCode CLI or resolves
 * the origin remote into a https web URL.
 *
 * The host registers two routes on the web server and nothing else — no
 * state, no RPC beyond the one spawn and the one origin lookup.
 * @module @lim324/dsh-copy-session-id
 */

import { execFile, spawn } from 'node:child_process'
import { promisify } from 'node:util'
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-host-webserver'

const execFileAsync = promisify(execFile)

/** Stable Cordis plugin name. */
export const name = 'dsh-copy-session-id'

/** Host service required before the route can mount (the web-server registry). */
export const inject = ['webServer']

/** The exact path of the "open in code" route (shipped to the client). */
export const OPEN_IN_CODE_ROUTE = '/copy-session-id/open-in-code'

/** The exact path of the "open in GitLab" route (shipped to the client). */
export const GIT_REMOTE_ROUTE = '/copy-session-id/git-remote'

/** Body size bound of one request (defense against unbounded reads). */
const MAX_BODY_BYTES = 1 << 20

/** Read and parse the JSON request body (bounded; malformed → 400). */
async function readJsonBody(req: AsyncIterable<string | Uint8Array>): Promise<unknown> {
  const chunks: Buffer[] = []
  let total = 0
  for await (const chunk of req) {
    const buffer = Buffer.from(chunk)
    total += buffer.length
    if (total > MAX_BODY_BYTES) throw new Error('request body too large')
    chunks.push(buffer)
  }
  const text = Buffer.concat(chunks).toString('utf8')
  if (text.trim() === '') return {}
  try {
    return JSON.parse(text) as unknown
  } catch {
    throw new Error('request body is not valid JSON')
  }
}

/** The response surface the route writes to (structural subset). */
interface OkRes {
  writeHead(status: number, headers?: Record<string, string>): void
  end(body?: string): void
}

/** Write a JSON response with the given status. */
function writeJson(res: OkRes, status: number, body: unknown): void {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(body))
}

/**
 * Spawn the VSCode CLI (`code`) on the given working directory and return
 * immediately. The argv form is used (no shell interpolation), so a path can
 * never be interpreted as a shell command. `code` is the documented CLI name
 * on POSIX; on Windows the same command is `code.cmd`. Spawn failures are
 * reported through the child's 'error' event — by then the route already
 * returned, so the event is swallowed (the missing-CLI outcome is surfaced by
 * the user, not an HTTP error).
 */
function launchCode(cwd: string): { started: true } {
  const command = process.platform === 'win32' ? 'code.cmd' : 'code'
  const child = spawn(command, [cwd], { detached: true, stdio: 'ignore' })
  child.on('error', () => { /* `code` missing/denied: handled by the user */ })
  child.unref()
  return { started: true }
}

/** One parsed git origin remote: host plus project path (group/project). */
export interface GitRemote {
  host: string
  project: string
}

/**
 * Parse a git origin URL into `{ host, project }` for the shapes git produces:
 * `https://host/group/project.git`, `git@host:group/project.git`, and
 * `ssh://git@host[:port]/group/project.git`. Returns undefined for non-origin
 * shapes (local paths, `file://`, scp forms without the `git@` user, etc.).
 * @param url - the raw `git remote get-url origin` output.
 * @returns the parsed remote, or undefined when it is not a remote origin.
 */
export function parseGitRemote(url: string): GitRemote | undefined {
  let host: string
  let rest: string
  const https = /^https?:\/\/([^/]+)\/(.+)$/.exec(url.trim())
  if (https !== null) {
    host = https[1]!
    rest = https[2]!
  } else {
    const sshUrl = /^ssh:\/\/(?:[^@]+@)?([^/:]+)(?::\d+)?\/(.+)$/.exec(url.trim())
    const scp = /^git@([^:]+):(.+)$/.exec(url.trim())
    const ssh = sshUrl ?? scp
    if (ssh === null) return undefined
    host = ssh[1]!
    rest = ssh[2]!
  }
  const project = rest.replace(/\.git$/, '')
  // A path that escapes the project namespace is not a valid remote.
  if (project === '' || project.split('/').some(segment => segment === '' || segment === '..')) return undefined
  return { host, project }
}

/**
 * Resolve the https web URL of a directory's origin remote by running
 * `git -C <cwd> remote get-url origin`. Returns undefined when the directory
 * is not a git checkout or its origin is not an http(s)/ssh remote (so the
 * button the URL feeds is hidden rather than pointing at nothing).
 * @param cwd - the directory to inspect.
 * @returns the web URL, or undefined when the origin cannot be resolved.
 */
export async function resolveGitWebUrl(cwd: string): Promise<string | undefined> {
  try {
    const { stdout } = await execFileAsync('git', ['-C', cwd, 'remote', 'get-url', 'origin'])
    const remote = parseGitRemote(stdout)
    return remote === undefined ? undefined : `https://${remote.host}/${remote.project}`
  } catch {
    // Not a git checkout, no origin, or git missing: silently undetectable.
    return undefined
  }
}

/**
 * Host plugin body: register the "open in code" and "open in GitLab" routes.
 * The browser posts the resolved working directory (`cwd`); the host validates
 * it is a non-empty absolute path before acting, so it can never hand the shell
 * a relative or empty target.
 * @param ctx - host plugin context (webServer).
 */
export function apply(ctx: Context): void {
  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: OPEN_IN_CODE_ROUTE,
    handler: async (req, res) => {
      try {
        if (req.method !== 'POST') {
          writeJson(res, 405, { ok: false, error: { code: 'method-error', message: 'method not allowed' } })
          return
        }
        const payload = (await readJsonBody(req)) as { cwd?: unknown } | null
        const cwd = typeof payload?.cwd === 'string' ? payload.cwd.trim() : ''
        if (cwd === '' || !cwd.startsWith('/')) {
          writeJson(res, 400, { ok: false, error: { code: 'bad-request', message: 'cwd must be a non-empty absolute path' } })
          return
        }
        writeJson(res, 200, launchCode(cwd))
      } catch (error) {
        const message = error instanceof Error ? error.message : 'internal error'
        writeJson(res, 500, { ok: false, error: { code: 'internal', message } })
      }
    },
  }), 'dsh-copy-session-id: /copy-session-id/open-in-code route')

  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: GIT_REMOTE_ROUTE,
    handler: async (req, res) => {
      try {
        if (req.method !== 'POST') {
          writeJson(res, 405, { ok: false, error: { code: 'method-error', message: 'method not allowed' } })
          return
        }
        const payload = (await readJsonBody(req)) as { cwd?: unknown } | null
        const cwd = typeof payload?.cwd === 'string' ? payload.cwd.trim() : ''
        if (cwd === '' || !cwd.startsWith('/')) {
          writeJson(res, 400, { ok: false, error: { code: 'bad-request', message: 'cwd must be a non-empty absolute path' } })
          return
        }
        // undefined → the directory is not a recognizable git origin; answer
        // with null so the client hides the button instead of pointing at nothing.
        const webUrl = await resolveGitWebUrl(cwd)
        writeJson(res, 200, { webUrl: webUrl ?? null })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'internal error'
        writeJson(res, 500, { ok: false, error: { code: 'internal', message } })
      }
    },
  }), 'dsh-copy-session-id: /copy-session-id/git-remote route')
}
