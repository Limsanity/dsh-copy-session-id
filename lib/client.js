window.__ModuleLoader__.load({
	id: "@lim324/dsh-copy-session-id",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region src/client/locales.ts
		/** `copySessionId` namespace dictionaries. */
		/** Dictionary namespace owned by this plugin. */
		const NS = "copySessionId";
		/** Simplified Chinese dictionary (the key-set source of truth). */
		const zh = {
			"copy.aria": "复制当前会话的 ID 或引用文案",
			"copy.menu.title": "复制会话 ID / 引用文案",
			"copy.menu.id": "复制会话 ID",
			"copy.menu.mention": "复制引用文案",
			"copied.id": "已复制会话 ID",
			"copied.mention": "已复制引用文案",
			"openGitlab.open": "在 GitLab 打开当前仓库",
			"openGitlab.aria": "打开当前会话工作目录的 GitLab 仓库"
		};
		/** English dictionary, key-identical to the Chinese source of truth. */
		const en = {
			"copy.aria": "Copy the current session ID or its recall mention",
			"copy.menu.title": "Copy session ID / recall mention",
			"copy.menu.id": "Copy session ID",
			"copy.menu.mention": "Copy mention",
			"copied.id": "Session ID copied",
			"copied.mention": "Mention copied",
			"openGitlab.open": "Open repository in GitLab",
			"openGitlab.aria": "Open the current session working directory's GitLab repository"
		};
		//#endregion
		//#region src/client/CopySessionIdAction.tsx
		/** How long the in-place "copied" checkmark stays visible after a successful write. */
		const COPIED_FEEDBACK_MS = 1500;
		/** Default button chrome; hover raises the label color. */
		const baseStyle$1 = {
			display: "inline-flex",
			alignItems: "center",
			justifyContent: "center",
			minWidth: 28,
			minHeight: 28,
			padding: 3,
			border: 0,
			borderRadius: 6,
			background: "transparent",
			color: "var(--dsw-alias-label-tertiary)",
			cursor: "pointer"
		};
		const hoverStyle$1 = {
			...baseStyle$1,
			color: "var(--dsw-alias-label-secondary)"
		};
		/**
		* Canonical `dsh-session:` body, browser-safe (no global `Buffer`). Matches the
		* host `encodeSessionReferenceUri`: `base64url(JSON.stringify(sessionId))` over
		* the UTF-8 bytes, so a copied mention decodes to the same session id.
		* @param sessionId - opaque session id to serialize.
		* @returns the `dsh-session:<payload>` URI.
		*/
		function encodeSessionRefUri(sessionId) {
			const json = JSON.stringify(sessionId);
			const bytes = new TextEncoder().encode(json);
			let bin = "";
			for (const byte of bytes) bin += String.fromCharCode(byte);
			return `dsh-session:${btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/u, "")}`;
		}
		/** Escape `\` and `]` exactly as the host `formatSessionReferenceMention` does. */
		function escapeLabel(label) {
			return label.replace(/[\\\]]/gu, (match) => `\\${match}`);
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
		function CopySessionIdAction({ sessionId, useSessions, t }) {
			const [open, setOpen] = (0, react.useState)(false);
			const [hovered, setHovered] = (0, react.useState)(false);
			const [copied, setCopied] = (0, react.useState)(null);
			const timer = (0, react.useRef)(void 0);
			(0, react.useEffect)(() => () => {
				if (timer.current !== void 0) window.clearTimeout(timer.current);
			}, []);
			const label = useSessions((sessions) => sessions.byId[sessionId]?.displayTitle) ?? sessionId;
			const mention = (0, react.useMemo)(() => `@[${escapeLabel(label)}](${encodeSessionRefUri(sessionId)})`, [label, sessionId]);
			const copy = (id) => {
				const text = id === "mention" ? mention : sessionId;
				setOpen(false);
				(0, _deepseek_ai_dsh_client_ui_primitives.writeClipboard)(text).then((ok) => {
					if (!ok) return;
					setCopied(id === "mention" ? "mention" : "id");
					if (timer.current !== void 0) window.clearTimeout(timer.current);
					timer.current = window.setTimeout(() => {
						setCopied(null);
					}, COPIED_FEEDBACK_MS);
				});
			};
			const tooltipLabel = copied !== null ? copied === "mention" ? t("copied.mention") : t("copied.id") : t("copy.menu.title");
			const style = copied !== null ? {
				...baseStyle$1,
				color: "var(--dsw-alias-state-success-primary)"
			} : open ? hoverStyle$1 : hovered ? hoverStyle$1 : baseStyle$1;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Menu, {
				open,
				anchor: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
					label: tooltipLabel,
					side: "bottom",
					delayMs: 300,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						style,
						"aria-label": t("copy.aria"),
						"aria-haspopup": "menu",
						"aria-expanded": open,
						onMouseEnter: () => {
							setHovered(true);
						},
						onMouseLeave: () => {
							setHovered(false);
						},
						onClick: () => {
							if (copied === null) setOpen((value) => !value);
						},
						children: copied !== null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCheckOutline16, { size: 16 }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCopyOutline16, { size: 16 })
					})
				}),
				items: [{
					id: "id",
					label: t("copy.menu.id"),
					icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCopyOutline16, { size: 16 })
				}, {
					id: "mention",
					label: t("copy.menu.mention"),
					icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLinkOutline16, { size: 16 })
				}],
				onSelect: copy,
				onClose: () => {
					setOpen(false);
				},
				portal: true,
				align: "end"
			});
		}
		//#endregion
		//#region src/client/OpenGitlabAction.tsx
		/** The host route the browser POSTs the working directory to for its origin. */
		const GIT_REMOTE_ROUTE = "/copy-session-id/git-remote";
		/** Default button chrome; hover raises the label color (mirror of the sibling buttons). */
		const baseStyle = {
			display: "inline-flex",
			alignItems: "center",
			justifyContent: "center",
			minWidth: 28,
			minHeight: 28,
			padding: 3,
			border: 0,
			borderRadius: 6,
			background: "transparent",
			color: "var(--dsw-alias-label-tertiary)",
			cursor: "pointer"
		};
		const hoverStyle = {
			...baseStyle,
			color: "var(--dsw-alias-label-secondary)"
		};
		/** The GitLab mark, inlined so the dynamic client bundle needs no icon import. */
		function IconGitlab16({ size = 16 }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				width: size,
				height: size,
				viewBox: "0 0 24 24",
				fill: "currentColor",
				xmlns: "http://www.w3.org/2000/svg",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M23.6004 9.5927l-.0337-.0862L20.3.9814a.851.851 0 0 0-.3362-.405.8748.8748 0 0 0-.9997.0539.8748.8748 0 0 0-.29.4399l-2.2055 6.748H7.5375l-2.2057-6.748a.8573.8573 0 0 0-.29-.4412.8748.8748 0 0 0-.9997-.0537.8585.8585 0 0 0-.3362.4049L.4332 9.5015l-.0325.0862a6.0657 6.0657 0 0 0 2.0119 7.0105l.0113.0087.03.0213 4.976 3.7264 2.462 1.8633 1.4995 1.1321a1.0085 1.0085 0 0 0 1.2197 0l1.4995-1.1321 2.4619-1.8633 5.006-3.7489.0125-.01a6.0682 6.0682 0 0 0 2.0094-7.003z" })
			});
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
		function OpenGitlabAction({ sessionId, useSessions, t }) {
			const cwd = useSessions((state) => state.byId[sessionId]?.cwd);
			const [webUrl, setWebUrl] = (0, react.useState)(null);
			const [hovered, setHovered] = (0, react.useState)(false);
			(0, react.useEffect)(() => {
				if (cwd === void 0 || cwd === "") {
					setWebUrl(null);
					return;
				}
				let alive = true;
				fetch(GIT_REMOTE_ROUTE, {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({ cwd })
				}).then((response) => {
					if (!response.ok) return void 0;
					return response.json();
				}).then((data) => {
					if (alive) setWebUrl(data?.webUrl ?? null);
				}).catch(() => {
					if (alive) setWebUrl(null);
				});
				return () => {
					alive = false;
				};
			}, [cwd]);
			if (webUrl === null) return null;
			const onOpen = (event) => {
				event.preventDefault();
				window.open(webUrl, "_blank", "noopener,noreferrer");
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
				label: t("openGitlab.open"),
				side: "bottom",
				delayMs: 300,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					style: hovered ? hoverStyle : baseStyle,
					"aria-label": t("openGitlab.aria"),
					onClick: onOpen,
					onMouseEnter: () => {
						setHovered(true);
					},
					onMouseLeave: () => {
						setHovered(false);
					},
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconGitlab16, { size: 16 })
				})
			});
		}
		//#endregion
		//#region src/client/index.ts
		/** Stable Cordis plugin name (client half). */
		const name = "dsh-copy-session-id";
		/** Client services required before the utility can mount. */
		const inject = ["slots", "locale"];
		/**
		* Client plugin body: register the dictionary and the two header utilities.
		* @param ctx - client root context.
		*/
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "dsh-copy-session-id: dictionaries");
			ctx.slots.inject("conversation.session.header.utilities", () => ctx.slots.register({
				name: "conversation.session.header.utilities",
				id: "copy-session-id",
				order: 10,
				locale: NS
			}, CopySessionIdAction));
			ctx.slots.inject("conversation.session.header.utilities", () => ctx.slots.register({
				name: "conversation.session.header.utilities",
				id: "open-gitlab",
				order: 30,
				locale: NS
			}, OpenGitlabAction));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		exports.name = name;
		return module.exports;
	}
});
