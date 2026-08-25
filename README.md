# dsh-copy-session-id

为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web 界面增加一个**复制当前会话 ID** 的按钮：在会话标题右侧的工具位（`conversation.session.header.utilities`）放一个复制图标，点击即把当前 session id（如 `session-922d24f7-…`）写入剪贴板，方便你在另一个会话里快速 recall 它。

A session-header utility for the DeepSeek Harness Web GUI: one button that copies the current session id to the clipboard, so you can quickly reference that session from another session.

---

## 使用 / Usage

### 安装 / Install

```sh
dsh plugin --profile web add link:/绝对路径/到/dsh-copy-session-id
```

装完重启 `dsh web`。/ Restart `dsh web` afterwards.

### 构建 / Build

```sh
pnpm install
pnpm run build   # 生成 lib/ 产物（host + client bundle + 类型）
```

### 源码开发 / Development

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
