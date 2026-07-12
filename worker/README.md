# tryrevive AI 代理部署指南（Cloudflare Worker）

网页版的「心语」AI 对话需要访问 DeepSeek API。浏览器不应直接携带密钥，
所以要把这个 Worker 部署到 Cloudflare 上做中转：
API Key 只保存在 Worker 的加密 Secret 里，不会出现在网页代码中。

## 一次性部署步骤（约 5 分钟）

前提：注册一个免费的 Cloudflare 账号。

在本目录（`worker/`）下依次执行：

```bash
# 1. 安装 wrangler 命令行（需要 Node.js）
npm install -g wrangler

# 2. 登录 Cloudflare（会弹出浏览器授权）
wrangler login

# 3. 把你的 DeepSeek API Key 存为加密 Secret（粘贴后回车）
wrangler secret put DEEPSEEK_API_KEY

# 4. 部署
wrangler deploy
```

部署成功后终端会输出一个地址，形如：

```
https://tryrevive-ai.<你的子域>.workers.dev
```

## 让网页用上代理

把 `app.js` 中的 `AI_PROXY_URL` 设置为部署后的 workers.dev 地址。
之后所有人访问网页都能直接聊天，**不需要**再各自填写 API Key。

> 提示：workers.dev 域名在少数网络环境下也可能不稳定；如果遇到，
> 可以在 Cloudflare 控制台给这个 Worker 绑定一个自定义域名（例如
> `ai.tryrevive.online`），稳定性会更好。

## 本地联调

本地页面运行在 `localhost` 或 `127.0.0.1` 时，会自动请求
`http://127.0.0.1:8787`。先设置 `DEEPSEEK_API_KEY` 环境变量，再启动：

```bash
npx wrangler dev --ip 127.0.0.1 --port 8787 --local
```

本地 Worker 只在自身运行于 `127.0.0.1` 时放行任意本机预览端口；
部署后的 Worker 仍只接受代码中的线上来源白名单。

## 安全护栏（已内置）

- 只允许 `tryrevive.online` / `sophia-yuanyuan.github.io` / 本地调试来源调用（CORS 白名单）
- Worker 固定调用 `deepseek-chat`
- 单次回复最多 1024 token、单次请求最多带 30 条历史，防止额度被刷爆
