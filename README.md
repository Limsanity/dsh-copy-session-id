# dsh-copy-session-id

为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web 界面增加**三个会话标题工具按钮**：在会话标题右侧的工具位（`conversation.session.header.utilities`）放一个**复制当前会话 ID** 图标（点击把当前 session id 写入剪贴板，方便你在另一个会话里快速 recall 它），紧挨着的**在 VSCode 打开**图标会请求宿主进程执行 `code` 命令、用 VSCode 打开当前会话的工作目录；再往右的**在 GitLab 打开**图标会在当前目录识别到 git 远程仓库时出现，点击在浏览器打开该仓库的 web 地址。

---

## 使用场景

跨会话交接时（例如在一个会话里排查问题 / 做完设计，想把它交给另一个会话用），用这个插件可以**秒拿当前会话的 id，并在目标会话里一键 recall**：

1. 在来源会话（如「设计」会话）点击标题右侧的复制图标，拿到它的 `session-xxxx` id。
2. 切到另一个会话（如「实现」会话），在输入框里 **输入 `@`，然后粘贴刚才复制的 id**。
3. 会话引用自动补全会按 id 精确匹配到那个来源会话；选中它，harness 就会把该来源会话的只读快照以 `recall` 上下文注入当前消息，作为背景被模型读取，无需手动拼任何东西。

> 也可以直接把整条 mention `@[标题](dsh-session:<id>)` 粘进输入框，效果等同 —— 只要能拿到 id，两种方式都能快速 recall。

---

## 安装

**优先：从 npm 安装（推荐）**

```sh
dsh plugin --profile web add @lim324/dsh-copy-session-id
```

装完重启 `dsh web`。

**GitHub 源码安装（需要先 build）**

```sh
git clone https://github.com/Limsanity/dsh-copy-session-id.git
cd dsh-copy-session-id
pnpm install && pnpm run build    # 生成 lib/ 产物
dsh plugin --profile web add link:/绝对路径/到/dsh-copy-session-id
```

## 构建

```sh
pnpm install
pnpm run build   # 生成 lib/ 产物（host + client bundle + 类型）
```

## 源码开发

用 `link:` 方式安装后，源码改动需重新 `pnpm run build` 才会反映到 `lib/`。

## 功能

- **一键复制当前会话 ID** — 会话头部工具位一个复制图标，点击复制当前 session id
- **在 VSCode 打开工作目录** — 紧挨着的「在 VSCode 打开」图标，点击请求宿主执行 `code` 命令打开当前会话的工作目录
- **在 GitLab 打开仓库** — 自动识别当前目录的 git origin，识别到 git 仓库时出现，点击在浏览器打开仓库的 web 地址
- **成功反馈** — 复制成功后 tooltip 显示「已复制」；写入失败不误报
- **零侵入 / 纯客户端** — 复制按钮纯客户端；「在 VSCode 打开」仅新增一条宿主路由跑 `code`，「在 GitLab 打开」仅新增一条宿主路由解析 git origin，均无状态、无 RPC
- **轻量依赖** — 仅依赖 baseline 的 react 与 ui-primitives

## 许可

[MIT](LICENSE) · 版权所有 © 2026 @lim324

## 实现位置

- 注册入口：`src/client/index.ts`（`conversation.session.header.utilities` slot，三个按钮）
- 复制按钮组件：`src/client/CopySessionIdAction.tsx`
- 打开目录按钮组件：`src/client/OpenInCodeAction.tsx`
- 打开仓库按钮组件：`src/client/OpenGitlabAction.tsx`
- 宿主路由：`src/index.ts`（`POST /copy-session-id/open-in-code`，`spawn('code', [cwd])`；`POST /copy-session-id/git-remote`，`git remote get-url origin` 解析 web 地址）
