/**
 * tryrevive AI 代理 — Cloudflare Worker
 * 作用：把前端的对话请求转发给 Anthropic API。
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

const ALLOWED_MODELS = [
  "claude-sonnet-5",
  "claude-haiku-4-5-20251001"
];

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

export default {
  async fetch(request, env) {
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

    const model = ALLOWED_MODELS.includes(body.model) ? body.model : ALLOWED_MODELS[0];
    const max_tokens = Math.min(Number(body.max_tokens) || 512, MAX_TOKENS_CAP);
    const messages = Array.isArray(body.messages) ? body.messages.slice(-MAX_MESSAGES) : [];
    const system = typeof body.system === "string" ? body.system.slice(0, 4000) : undefined;

    if (!messages.length) {
      return new Response(JSON.stringify({ error: "messages required" }), {
        status: 400, headers: corsHeaders(origin)
      });
    }

    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body: JSON.stringify({ model, max_tokens, system, messages })
    });

    const data = await upstream.text();
    return new Response(data, {
      status: upstream.status,
      headers: { "content-type": "application/json", ...corsHeaders(origin) }
    });
  }
};
