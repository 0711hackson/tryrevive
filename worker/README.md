# tryrevive AI 代理部署指南（Cloudflare Worker）

网页版的「心语」AI 对话需要访问 Anthropic API。国内浏览器**无法直连**
`api.anthropic.com`，所以要把这个 Worker 部署到 Cloudflare 上做中转：
API Key 只保存在 Worker 的加密 Secret 里，不会出现在网页代码中。

## 一次性部署步骤（约 5 分钟）

前提：注册一个免费的 [Cloudflare 账号](https://dash.cloudflare.com/sign-up)。

在本目录（`worker/`）下依次执行：

```bash
# 1. 安装 wrangler 命令行（需要 Node.js）
npm install -g wrangler

# 2. 登录 Cloudflare（会弹出浏览器授权）
wrangler login

# 3. 把你的 Anthropic API Key 存为加密 Secret（粘贴后回车）
wrangler secret put ANTHROPIC_API_KEY

# 4. 部署
wrangler deploy
```

部署成功后终端会输出一个地址，形如：

```
https://tryrevive-ai.<你的子域>.workers.dev
```

## 让网页用上代理

打开 tryrevive 网页 → 「⚙️ 设置偏好」→ 在 **AI 代理地址** 一栏粘贴上面
的 workers.dev 地址 → 点「踏入专注世界」保存。之后所有人访问你的 demo
都能直接聊天，**不需要**再各自填 API Key。

> 提示：workers.dev 域名在少数网络环境下也可能不稳定；如果遇到，
> 可以在 Cloudflare 控制台给这个 Worker 绑定一个自定义域名（例如
> `ai.tryrevive.online`），稳定性会更好。

## 安全护栏（已内置）

- 只允许 `tryrevive.online` / `sophia-yuanyuan.github.io` / 本地调试来源调用（CORS 白名单）
- 只放行 `claude-sonnet-5` 和 `claude-haiku-4-5` 两个模型
- 单次回复最多 1024 token、单次请求最多带 30 条历史，防止额度被刷爆
