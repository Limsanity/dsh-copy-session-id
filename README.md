# dsh-copy-session-id

为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web 界面增加一个**复制当前会话 ID** 的按钮：在会话标题右侧的工具位（`conversation.session.header.utilities`）放一个复制图标，点击即把当前 session id（如 `session-922d24f7-…`）写入剪贴板，方便你在另一个会话里快速 recall 它。

A session-header utility for the DeepSeek Harness Web GUI: one button that copies the current session id to the clipboard, so you can quickly reference that session from another session.

---

## 使用场景 / Use case

跨会话交接时（例如在一个会话里排查问题 / 做完设计，想把它交给另一个会话用），用这个插件可以**秒拿当前会话的 id，并在目标会话里一键 recall**：

1. 在来源会话（如「设计」会话）点击标题右侧的复制图标，拿到它的 `session-xxxx` id。
2. 切到另一个会话（如「实现」会话），在输入框里 **输入 `@`，然后粘贴刚才复制的 id**。
3. 会话引用自动补全会按 id 精确匹配到那个来源会话；选中它，harness 就会把该来源会话的只读快照以 `recall` 上下文注入当前消息，作为背景被模型读取，无需手动拼任何东西。

> 也可以直接把整条 mention `@[标题](dsh-session:<id>)` 粘进输入框，效果等同 —— 只要能拿到 id，两种方式都能快速 recall。

For cross-session handoff, copy the source session's id here, then in the target session type `@` and paste that id — the session-reference autocomplete matches it by id, and picking it injects the source session's read-only snapshot (`recall` context) into the current message.

---

## 安装 / Install

**优先：从 npm 安装（推荐）**

```sh
dsh plugin --profile web add @lim324/dsh-copy-session-id
```

装完重启 `dsh web`。/ Restart `dsh web` afterwards.

**GitHub 源码安装（需要先 build）**

```sh
git clone https://github.com/Limsanity/dsh-copy-session-id.git
cd dsh-copy-session-id
pnpm install && pnpm run build    # 生成 lib/ 产物
dsh plugin --profile web add link:/绝对路径/到/dsh-copy-session-id
```

## 构建 / Build

```sh
pnpm install
pnpm run build   # 生成 lib/ 产物（host + client bundle + 类型）
```

## 源码开发 / Development

用 `link:` 方式安装后，源码改动需重新 `pnpm run build` 才会反映到 `lib/`。

## 功能 / Features

- **一键复制当前会话 ID** — 会话头部工具位一个复制图标，点击复制当前 session id
- **成功反馈** — 复制成功后 tooltip 显示「已复制」；写入失败不误报
- **零侵入 / 纯客户端** — 无 host 路由、无状态、无 RPC；host half 仅用于让包在 profile 中合法
- **轻量依赖** — 仅依赖 baseline 的 react 与 ui-primitives

- **One-click copy of the current session id** — a copy icon in the session-header utilities
- **Success feedback** — a transient "copied" tooltip; a refused write never claims success
- **Zero-intrusion / client-only** — no host routes, no state, no RPC; the host half only makes the package a valid profile bundle
- **Light dependencies** — only baseline react and ui-primitives

## 许可 / License

[MIT](LICENSE) · 版权所有 © 2026 @lim324

## 实现位置

- 注册入口：`src/client/index.ts`（`conversation.session.header.utilities` slot）
- 按钮组件：`src/client/CopySessionIdAction.tsx`
