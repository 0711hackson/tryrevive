// Tryrevive content bridge.
// - On Tryrevive pages, receive the page's guard-session message and store it.
// - On guarded external sites, show the countdown panel, allow one-click return,
//   and offer a 3-minute extension during the final reminder window.

const TRYREVIVE_HOSTS = new Set([
  "tryrevive.online",
  "www.tryrevive.online",
  "0711hackson.github.io",
  "sophia-yuanyuan.github.io",
  "localhost",
  "127.0.0.1"
]);

const GUARDED_HOSTS = [
  "xiaohongshu.com",
  "bilibili.com",
  "weibo.com",
  "douyin.com",
  "zhihu.com",
  "taobao.com",
  "pinduoduo.com",
  "music.163.com"
];

const GUARD_STORAGE_KEY = "tryreviveGuardSession";
const RETURN_URL_KEY = "tryreviveReturnUrl";
const PANEL_ID = "tryrevive-guard-panel";
const LEGACY_RETURN_BUTTON_ID = "tryrevive-return-button";
const CANONICAL_TRYREVIVE_URL = "https://0711hackson.github.io/tryrevive/";
const EXTEND_MS = 3 * 60 * 1000;

function normalizedHost() {
  return location.hostname.replace(/^www\./, "");
}

function isTryrevivePage() {
  if (!TRYREVIVE_HOSTS.has(location.hostname)) return false;
  if (location.hostname.endsWith("github.io")) {
    return location.pathname === "/tryrevive" || location.pathname.startsWith("/tryrevive/");
  }
  return location.hostname.includes("tryrevive") || location.port === "8000" || location.port === "8080";
}

function isGuardedPage() {
  const host = normalizedHost();
  return GUARDED_HOSTS.some(domain => host === domain || host.endsWith("." + domain));
}

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeReturnUrl(value) {
  if (!isValidUrl(value)) return CANONICAL_TRYREVIVE_URL;
  const url = new URL(value);
  if (url.hostname === "tryrevive.online" || url.hostname === "www.tryrevive.online") {
    return CANONICAL_TRYREVIVE_URL;
  }
  if (url.hostname === "0711hackson.github.io" && !url.pathname.startsWith("/tryrevive")) {
    return CANONICAL_TRYREVIVE_URL;
  }
  return url.href;
}

function rememberTryreviveUrl() {
  if (!isTryrevivePage()) return;
  chrome.storage.local.set({ [RETURN_URL_KEY]: normalizeReturnUrl(location.href) });
}

function notifyBackground(action, session = null) {
  chrome.runtime.sendMessage({ action, session }, () => {
    // Ignore "receiving end does not exist" in development reload windows.
    void chrome.runtime.lastError;
  });
}

function normalizeGuardSession(rawSession) {
  if (!rawSession || typeof rawSession !== "object") return null;
  const startedAt = Number(rawSession.startedAt);
  const endAt = Number(rawSession.endAt);
  const returnAt = Number(rawSession.returnAt);
  const returnUrl = normalizeReturnUrl(rawSession.returnUrl);
  if (!Number.isFinite(startedAt) || !Number.isFinite(endAt) || !Number.isFinite(returnAt)) return null;
  if (endAt <= startedAt || returnAt < endAt || !isValidUrl(returnUrl)) return null;
  return {
    id: String(rawSession.id || `tryrevive-${startedAt}`),
    siteName: String(rawSession.siteName || "外部平台").slice(0, 40),
    targetUrl: String(rawSession.targetUrl || ""),
    returnUrl,
    taskText: String(rawSession.taskText || "回到 Tryrevive 继续计划").slice(0, 80),
    searchQuery: String(rawSession.searchQuery || "").slice(0, 80),
    stepIndex: Math.max(1, Math.min(3, Math.round(Number(rawSession.stepIndex) || 1))),
    minutes: Math.max(1, Math.min(240, Math.round(Number(rawSession.minutes) || 1))),
    startedAt,
    endAt,
    reminderAt: Number(rawSession.reminderAt) || Math.max(startedAt, endAt - 60 * 1000),
    returnAt,
    reminderSeconds: Math.max(10, Math.min(120, Number(rawSession.reminderSeconds) || 60)),
    graceSeconds: Math.max(3, Math.min(30, Number(rawSession.graceSeconds) || 10))
  };
}

function bindTryreviveBridge() {
  if (!isTryrevivePage()) return;
  window.addEventListener("message", event => {
    if (event.source !== window || event.origin !== location.origin) return;
    const data = event.data || {};
    if (data.source !== "tryrevive" || data.type !== "TRYREVIVE_GUARD_SESSION") return;

    const session = normalizeGuardSession(data.payload);
    if (!session) {
      chrome.storage.local.remove(GUARD_STORAGE_KEY, () => notifyBackground("tryreviveGuardCleared"));
      return;
    }

    chrome.storage.local.set({
      [GUARD_STORAGE_KEY]: session,
      [RETURN_URL_KEY]: session.returnUrl
    }, () => notifyBackground("tryreviveGuardSessionUpdated", session));
  });
}

function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const restMinutes = minutes % 60;
    return `${hours}:${String(restMinutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function extendGuardSession(panel) {
  const current = panel.__tryreviveSession;
  if (!current) return;

  const now = Date.now();
  const updated = {
    ...current,
    endAt: Math.max(Number(current.endAt) || now, now) + EXTEND_MS,
    returnAt: Math.max(Number(current.returnAt) || now, now) + EXTEND_MS
  };
  updated.reminderAt = Math.max(now, updated.endAt - Number(updated.reminderSeconds || 60) * 1000);

  chrome.storage.local.set({ [GUARD_STORAGE_KEY]: updated }, () => {
    notifyBackground("tryreviveGuardSessionUpdated", updated);
    renderSession(panel, updated);
  });
}

function createPanel() {
  const oldButton = document.getElementById(LEGACY_RETURN_BUTTON_ID);
  if (oldButton) oldButton.remove();

  let panel = document.getElementById(PANEL_ID);
  if (panel) return panel;

  panel = document.createElement("section");
  panel.id = PANEL_ID;
  panel.setAttribute("aria-live", "polite");
  panel.innerHTML = `
    <style>
      #${PANEL_ID} {
        position: fixed;
        right: 20px;
        bottom: 22px;
        z-index: 2147483647;
        width: min(340px, calc(100vw - 28px));
        padding: 14px;
        border: 1px solid rgba(255, 255, 255, .14);
        border-radius: 18px;
        background: #15171d;
        color: #fff;
        box-shadow: 0 18px 50px rgba(0, 0, 0, .36);
        font: 500 14px/1.45 -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
      }
      #${PANEL_ID}.is-warning {
        border-color: rgba(255, 157, 128, .54);
        box-shadow: 0 18px 52px rgba(255, 97, 97, .18), 0 18px 50px rgba(0, 0, 0, .36);
      }
      #${PANEL_ID}.is-returning {
        border-color: rgba(255, 92, 92, .65);
      }
      #${PANEL_ID} .tryrevive-kicker {
        color: rgba(255, 255, 255, .58);
        font-size: 12px;
        margin-bottom: 4px;
      }
      #${PANEL_ID} .tryrevive-title {
        color: rgba(255, 255, 255, .94);
        font-size: 15px;
        font-weight: 700;
        margin-bottom: 8px;
      }
      #${PANEL_ID} .tryrevive-task {
        color: rgba(255, 255, 255, .72);
        font-size: 13px;
        margin-bottom: 12px;
        word-break: break-word;
      }
      #${PANEL_ID} .tryrevive-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }
      #${PANEL_ID} .tryrevive-time {
        color: #ff9d80;
        font-size: 24px;
        font-weight: 750;
        letter-spacing: 0;
      }
      #${PANEL_ID} .tryrevive-actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex-wrap: wrap;
        gap: 8px;
      }
      #${PANEL_ID} .tryrevive-return,
      #${PANEL_ID} .tryrevive-extend {
        min-height: 38px;
        padding: 0 13px;
        border: 1px solid rgba(255, 255, 255, .16);
        border-radius: 999px;
        background: rgba(255, 255, 255, .08);
        color: #fff;
        cursor: pointer;
        font: 700 13px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        transition: background 180ms ease, transform 180ms cubic-bezier(.16, 1, .3, 1);
      }
      #${PANEL_ID} .tryrevive-extend {
        display: none;
        align-items: center;
        border-color: rgba(255, 157, 128, .36);
        background: rgba(255, 138, 101, .14);
      }
      #${PANEL_ID}.is-warning .tryrevive-extend,
      #${PANEL_ID}.is-returning .tryrevive-extend {
        display: inline-flex;
      }
      #${PANEL_ID} .tryrevive-return:hover,
      #${PANEL_ID} .tryrevive-extend:hover {
        background: rgba(255, 255, 255, .15);
        transform: translateY(-1px);
      }
      #${PANEL_ID} .tryrevive-return:focus-visible,
      #${PANEL_ID} .tryrevive-extend:focus-visible {
        outline: 3px solid rgba(255, 138, 101, .45);
        outline-offset: 3px;
      }
      @media (max-width: 520px) {
        #${PANEL_ID} {
          right: 14px;
          bottom: 16px;
        }
        #${PANEL_ID} .tryrevive-row {
          align-items: flex-start;
          flex-direction: column;
        }
        #${PANEL_ID} .tryrevive-actions {
          justify-content: flex-start;
          width: 100%;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        #${PANEL_ID} .tryrevive-return,
        #${PANEL_ID} .tryrevive-extend {
          transition: none;
        }
      }
    </style>
    <div class="tryrevive-kicker">Tryrevive 注意力守护</div>
    <div class="tryrevive-title"></div>
    <div class="tryrevive-task"></div>
    <div class="tryrevive-row">
      <div class="tryrevive-time"></div>
      <div class="tryrevive-actions">
        <button type="button" class="tryrevive-extend">再给我 3 分钟</button>
        <button type="button" class="tryrevive-return">现在返回</button>
      </div>
    </div>
  `;
  panel.querySelector(".tryrevive-return").addEventListener("click", () => {
    chrome.storage.local.remove(GUARD_STORAGE_KEY, () => {
      const returnUrl = normalizeReturnUrl(panel.dataset.returnUrl);
      location.href = returnUrl;
    });
  });
  panel.querySelector(".tryrevive-extend").addEventListener("click", () => extendGuardSession(panel));
  document.documentElement.appendChild(panel);
  return panel;
}

function redirectToReturn(session) {
  chrome.storage.local.remove(GUARD_STORAGE_KEY, () => {
    location.href = normalizeReturnUrl(session.returnUrl);
  });
}

function renderSession(panel, session) {
  const now = Date.now();
  const remainingMs = session.endAt - now;
  const returnMs = session.returnAt - now;
  const titleEl = panel.querySelector(".tryrevive-title");
  const taskEl = panel.querySelector(".tryrevive-task");
  const timeEl = panel.querySelector(".tryrevive-time");

  panel.__tryreviveSession = session;
  panel.dataset.returnUrl = normalizeReturnUrl(session.returnUrl);
  panel.classList.toggle("is-warning", remainingMs <= session.reminderSeconds * 1000 && remainingMs > 0);
  panel.classList.toggle("is-returning", remainingMs <= 0);

  if (returnMs <= 0) {
    redirectToReturn(session);
    return;
  }

  if (remainingMs <= 0) {
    titleEl.textContent = "时间到了，正在回到 Tryrevive";
    taskEl.textContent = `给你 ${session.graceSeconds} 秒收尾，随后自动返回。`;
    timeEl.textContent = `${Math.ceil(returnMs / 1000)} 秒`;
    return;
  }

  if (remainingMs <= session.reminderSeconds * 1000) {
    titleEl.textContent = "最后 1 分钟，准备收尾";
  } else {
    titleEl.textContent = `${session.siteName} 浏览计时中`;
  }
  taskEl.textContent = session.taskText;
  timeEl.textContent = formatDuration(remainingMs);
}

function injectReturnOnlyPanel(returnUrl) {
  const panel = createPanel();
  panel.dataset.returnUrl = normalizeReturnUrl(returnUrl);
  panel.__tryreviveSession = null;
  panel.classList.remove("is-warning", "is-returning");
  panel.querySelector(".tryrevive-title").textContent = "可以回到 Tryrevive";
  panel.querySelector(".tryrevive-task").textContent = "继续原来的计划，别被推荐流带走太远。";
  panel.querySelector(".tryrevive-time").textContent = "↩";
}

function startGuardPanel(session) {
  const panel = createPanel();
  const tick = () => renderSession(panel, session);
  tick();
  const intervalId = window.setInterval(() => {
    chrome.storage.local.get([GUARD_STORAGE_KEY], result => {
      const latest = normalizeGuardSession(result[GUARD_STORAGE_KEY]) || session;
      session = latest;
      renderSession(panel, latest);
    });
  }, 1000);
  document.addEventListener("visibilitychange", tick);
  window.addEventListener("pagehide", () => window.clearInterval(intervalId), { once: true });
}

function hydrateGuardedPage() {
  if (!isGuardedPage()) return;
  chrome.storage.local.get([RETURN_URL_KEY, GUARD_STORAGE_KEY], result => {
    const session = normalizeGuardSession(result[GUARD_STORAGE_KEY]);
    if (session && Date.now() < session.returnAt) {
      startGuardPanel(session);
      return;
    }
    if (session && Date.now() >= session.returnAt) {
      redirectToReturn(session);
      return;
    }
    const returnUrl = normalizeReturnUrl(result[RETURN_URL_KEY]);
    chrome.storage.local.set({ [RETURN_URL_KEY]: returnUrl });
    injectReturnOnlyPanel(returnUrl);
  });
}

rememberTryreviveUrl();
bindTryreviveBridge();
hydrateGuardedPage();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request && request.action === "triggerOvertime") {
    window.dispatchEvent(new CustomEvent("tryrevive:overtime", {
      detail: { domain: request.domain }
    }));
    sendResponse({ success: true });
  }
  return true;
});
