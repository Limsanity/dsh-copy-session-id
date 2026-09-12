/**
 * @lim324/dsh-copy-session-id — host half. The copy-session-id affordance is a
 * Web client surface (one session-header utility button), but the sibling
 * "open in GitLab" action needs a host process: the browser cannot ask git for
 * a repository's origin, so it POSTs the target working directory here and the
 * host resolves the origin remote into an https web URL.
 *
 * The former "open in code" route was removed: the harness now ships its own
 * open-in-app affordance, so this plugin no longer spawns `code` itself.
 *
 * The host registers one route on the web server and nothing else — no state,
 * no RPC beyond the one origin lookup.
 * @module @lim324/dsh-copy-session-id
 */
import type { Context } from '@deepseek-ai/cordis';
/** Stable Cordis plugin name. */
export declare const name = "dsh-copy-session-id";
/** Host service required before the route can mount (the web-server registry). */
export declare const inject: string[];
/** The exact path of the "open in GitLab" route (shipped to the client). */
export declare const GIT_REMOTE_ROUTE = "/copy-session-id/git-remote";
/** One parsed git origin remote: host plus project path (group/project). */
export interface GitRemote {
    host: string;
    project: string;
}
/**
 * Parse a git origin URL into `{ host, project }` for the shapes git produces:
 * `https://host/group/project.git`, `git@host:group/project.git`, and
 * `ssh://git@host[:port]/group/project.git`. Returns undefined for non-origin
 * shapes (local paths, `file://`, scp forms without the `git@` user, etc.).
 * @param url - the raw `git remote get-url origin` output.
 * @returns the parsed remote, or undefined when it is not a remote origin.
 */
export declare function parseGitRemote(url: string): GitRemote | undefined;
/**
 * Resolve the https web URL of a directory's origin remote by running
 * `git -C <cwd> remote get-url origin`. Returns undefined when the directory
 * is not a git checkout or its origin is not an http(s)/ssh remote (so the
 * button the URL feeds is hidden rather than pointing at nothing).
 * @param cwd - the directory to inspect.
 * @returns the web URL, or undefined when the origin cannot be resolved.
 */
export declare function resolveGitWebUrl(cwd: string): Promise<string | undefined>;
/**
 * Host plugin body: register the "open in GitLab" route. The browser posts the
 * resolved working directory (`cwd`); the host validates it is a non-empty
 * absolute path before acting, so it can never hand git a relative or empty
 * target.
 * @param ctx - host plugin context (webServer).
 */
export declare function apply(ctx: Context): void;
