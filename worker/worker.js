/**
 * Tryrevive DeepSeek AI proxy.
 * DEEPSEEK_API_KEY must be stored as a Cloudflare Worker secret.
 */

const ALLOWED_ORIGINS = new Set([
  "https://tryrevive.online",
  "https://www.tryrevive.online",
  "https://0711hackson.github.io",
  "https://sophia-yuanyuan.github.io",
  "http://localhost:8000",
  "http://127.0.0.1:8000",
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  "http://localhost:4173",
  "http://127.0.0.1:4173"
]);

function isAllowedOrigin(origin, requestUrl) {
  if (ALLOWED_ORIGINS.has(origin)) return true;
  if (new URL(requestUrl).hostname !== "127.0.0.1") return false;
  try {
    const originUrl = new URL(origin);
    return originUrl.protocol === "http:"
      && (originUrl.hostname === "localhost" || originUrl.hostname === "127.0.0.1");
  } catch {
    return false;
  }
}

const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";
const MODEL = "deepseek-chat";
const MAX_TOKENS_CAP = 1024;
const MAX_MESSAGES = 30;
const MAX_MESSAGE_CHARS = 6000;
const MAX_SYSTEM_CHARS = 4000;
const MAX_BODY_BYTES = 96 * 1024;
const UPSTREAM_TIMEOUT_MS = 30000;

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}

function jsonResponse(origin, status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...corsHeaders(origin) }
  });
}

function normalizeMessages(value) {
  if (!Array.isArray(value)) return [];
  return value
    .slice(-MAX_MESSAGES)
    .filter(item => item && (item.role === "user" || item.role === "assistant"))
    .map(item => ({
      role: item.role,
      content: typeof item.content === "string"
        ? item.content.slice(0, MAX_MESSAGE_CHARS)
        : ""
    }))
    .filter(item => item.content.trim());
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = isAllowedOrigin(origin, request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: allowed ? 204 : 403,
        headers: allowed ? corsHeaders(origin) : {}
      });
    }

    if (!allowed) {
      return new Response(JSON.stringify({ error: "origin_not_allowed" }), {
        status: 403,
        headers: { "content-type": "application/json; charset=utf-8" }
      });
    }

    if (request.method !== "POST") {
      return jsonResponse(origin, 405, { error: "method_not_allowed" });
    }

    const declaredLength = Number(request.headers.get("content-length") || 0);
    if (declaredLength > MAX_BODY_BYTES) {
      return jsonResponse(origin, 413, { error: "request_too_large" });
    }

    const apiKey = (env.DEEPSEEK_API_KEY || "").trim();
    if (!apiKey) {
      return jsonResponse(origin, 503, { error: "deepseek_not_configured" });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse(origin, 400, { error: "invalid_json" });
    }

    const messages = normalizeMessages(body.messages);
    if (!messages.length || messages[0].role !== "user") {
      return jsonResponse(origin, 400, { error: "valid_user_message_required" });
    }

    const system = typeof body.system === "string"
      ? body.system.slice(0, MAX_SYSTEM_CHARS).trim()
      : "";
    const maxTokens = Math.min(Math.max(Number(body.max_tokens) || 512, 1), MAX_TOKENS_CAP);
    const responseFormat = body.response_format && body.response_format.type === "json_object"
      ? { type: "json_object" }
      : null;
    const upstreamMessages = system
      ? [{ role: "system", content: system }, ...messages]
      : messages;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

    try {
      const upstream = await fetch(DEEPSEEK_URL, {
        method: "POST",
        headers: {
          "authorization": `Bearer ${apiKey}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: maxTokens,
          messages: upstreamMessages,
          ...(responseFormat ? { response_format: responseFormat } : {})
        }),
        signal: controller.signal
      });

      const raw = await upstream.text();
      let data = null;
      try { data = raw ? JSON.parse(raw) : null; } catch { data = null; }

      if (!upstream.ok) {
        return jsonResponse(origin, upstream.status, {
          error: "deepseek_request_failed",
          upstreamStatus: upstream.status,
          detail: data && data.error && data.error.message
            ? String(data.error.message).slice(0, 300)
            : "DeepSeek returned an error"
        });
      }

      const text = data && data.choices && data.choices[0] && data.choices[0].message
        ? data.choices[0].message.content
        : "";
      if (!text) {
        return jsonResponse(origin, 502, { error: "invalid_deepseek_response" });
      }

      // Preserve the response shape already consumed by the Tryrevive frontend.
      return jsonResponse(origin, 200, {
        content: [{ type: "text", text }],
        model: MODEL
      });
    } catch (error) {
      if (error && error.name === "AbortError") {
        return jsonResponse(origin, 504, { error: "deepseek_timeout" });
      }
      return jsonResponse(origin, 502, { error: "deepseek_unreachable" });
    } finally {
      clearTimeout(timeoutId);
    }
  }
};
