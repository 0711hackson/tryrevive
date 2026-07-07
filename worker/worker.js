/**
 * tryrevive AI 代理 — Cloudflare Worker
 * 作用：把前端的对话请求转发给 DeepSeek API（OpenAI 兼容格式）。
 * API Key 只存在 Worker 的加密 Secret 里，永远不出现在网页代码中。
 */

const ALLOWED_ORIGINS = [
  "https://tryrevive.online",
  "https://www.tryrevive.online",
  "http://tryrevive.online",
  "http://www.tryrevive.online",
  "https://sophia-yuanyuan.github.io",
  "http://localhost:8000",
  "http://127.0.0.1:8000",
  "http://localhost:8080",
  "http://127.0.0.1:8080"
];

const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";
const MAX_TOKENS_CAP = 1024;      // 单次回复上限，防止额度被大额消耗
const MAX_MESSAGES = 30;          // 单次请求最多携带的历史条数

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Max-Age": "86400"
  };
}

async function callDeepSeek(apiKey, payload) {
  const upstream = await fetch(DEEPSEEK_URL, {
    method: "POST",
    headers: {
      "authorization": "Bearer " + apiKey,
      "content-type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  const text = await upstream.text();
  return { status: upstream.status, text };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ---- 临时诊断端点（定位问题后移除） ----
    if (request.method === "GET" && url.pathname === "/debug") {
      const probe = { model: "deepseek-chat", max_tokens: 1, messages: [{ role: "user", content: "hi" }] };
      const real = await callDeepSeek((env.DEEPSEEK_API_KEY || "").trim(), probe);
      const fake = await callDeepSeek("sk-fake-key-for-network-test", probe);
      const keyRaw = env.DEEPSEEK_API_KEY || "";
      return new Response(JSON.stringify({
        keyInfo: { defined: !!env.DEEPSEEK_API_KEY, length: keyRaw.length, startsWithSk: keyRaw.trim().startsWith("sk-") },
        realKeyCall: { status: real.status, body: real.text.slice(0, 300) },
        fakeKeyCall: { status: fake.status, body: fake.text.slice(0, 300) }
      }, null, 2), { headers: { "content-type": "application/json" } });
    }

    const origin = request.headers.get("Origin") || "";
    const allowed = ALLOWED_ORIGINS.includes(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: allowed ? 204 : 403,
        headers: allowed ? corsHeaders(origin) : {}
      });
    }

    if (!allowed) {
      return new Response(JSON.stringify({ error: "origin not allowed" }), { status: 403 });
    }
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "POST only" }), {
        status: 405, headers: corsHeaders(origin)
      });
    }

    let body;
    try { body = await request.json(); } catch {
      return new Response(JSON.stringify({ error: "invalid json" }), {
        status: 400, headers: corsHeaders(origin)
      });
    }

    const max_tokens = Math.min(Number(body.max_tokens) || 512, MAX_TOKENS_CAP);
    const messages = Array.isArray(body.messages) ? body.messages.slice(-MAX_MESSAGES) : [];
    const system = typeof body.system === "string" ? body.system.slice(0, 4000) : "";

    if (!messages.length) {
      return new Response(JSON.stringify({ error: "messages required" }), {
        status: 400, headers: corsHeaders(origin)
      });
    }

    // OpenAI 兼容格式：system 作为 messages 数组的第一条消息
    const messagesWithSystem = system
      ? [{ role: "system", content: system }, ...messages]
      : messages;

    const upstream = await callDeepSeek((env.DEEPSEEK_API_KEY || "").trim(), {
      model: "deepseek-chat",
      max_tokens,
      messages: messagesWithSystem
    });

    // 上游空响应时补充可读错误，方便前端诊断
    const responseBody = upstream.text ||
      JSON.stringify({ error: `deepseek upstream ${upstream.status} with empty body` });

    // 把 DeepSeek(OpenAI 格式) 的回复转换成前端期待的 Anthropic 格式 {content:[{text}]}
    let finalBody = responseBody;
    if (upstream.status === 200) {
      try {
        const data = JSON.parse(responseBody);
        const text = data && data.choices && data.choices[0] && data.choices[0].message
          ? data.choices[0].message.content : "";
        finalBody = JSON.stringify({ content: [{ type: "text", text }] });
      } catch (e) { /* 保留原始响应 */ }
    }

    return new Response(finalBody, {
      status: upstream.status,
      headers: { "content-type": "application/json", ...corsHeaders(origin) }
    });
  }
};
