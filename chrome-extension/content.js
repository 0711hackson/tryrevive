// Tryrevive 内容桥接脚本
// 背景 worker 通过 chrome.tabs.sendMessage 发来的消息只有 content script 能收到，
// 这里把"超时"指令转成页面可监听的 CustomEvent，打通 后台 → 页面 的核心闭环。

const TRYREVIVE_HOSTS = new Set(["tryrevive.online", "www.tryrevive.online", "localhost", "127.0.0.1"]);
const GUARDED_HOSTS = [
  "xiaohongshu.com", "bilibili.com", "weibo.com", "douyin.com",
  "zhihu.com", "taobao.com", "pinduoduo.com"
];

function isTryrevivePage() {
  return TRYREVIVE_HOSTS.has(location.hostname) &&
    (location.hostname.includes("tryrevive") || location.port === "8000");
}

function rememberTryreviveUrl() {
  if (!isTryrevivePage()) return;
  chrome.storage.local.set({ tryreviveReturnUrl: location.href });
}

function injectReturnButton() {
  const host = location.hostname.replace(/^www\./, "");
  if (!GUARDED_HOSTS.some(domain => host === domain || host.endsWith("." + domain))) return;
  if (document.getElementById("tryrevive-return-button")) return;

  chrome.storage.local.get(["tryreviveReturnUrl"], result => {
    const returnUrl = result.tryreviveReturnUrl || "https://tryrevive.online/";
    const button = document.createElement("button");
    button.id = "tryrevive-return-button";
    button.type = "button";
    button.setAttribute("aria-label", "返回 Tryrevive，继续原来的计划");
    button.innerHTML = '<span aria-hidden="true">↩</span><span>返回 Tryrevive</span>';
    button.addEventListener("click", () => {
      location.href = returnUrl;
    });

    const style = document.createElement("style");
    style.textContent = `
      #tryrevive-return-button {
        position: fixed; right: 20px; bottom: 22px; z-index: 2147483647;
        display: flex; align-items: center; gap: 8px; min-height: 44px;
        padding: 0 16px; border: 1px solid rgba(255,255,255,.16);
        border-radius: 999px; background: #17191f; color: #fff;
        box-shadow: 0 10px 30px rgba(0,0,0,.32); cursor: pointer;
        font: 600 14px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        transition: transform 180ms cubic-bezier(.16,1,.3,1), background 180ms ease;
      }
      #tryrevive-return-button:hover { background: #242730; transform: translateY(-2px); }
      #tryrevive-return-button:focus-visible { outline: 3px solid rgba(255,138,101,.48); outline-offset: 3px; }
      #tryrevive-return-button > span:first-child { color: #ff9d80; font-size: 18px; }
      @media (max-width: 520px) {
        #tryrevive-return-button { right: 14px; bottom: 16px; }
      }
      @media (prefers-reduced-motion: reduce) {
        #tryrevive-return-button { transition: none; }
      }
    `;
    document.documentElement.appendChild(style);
    document.body.appendChild(button);
  });
}

rememberTryreviveUrl();
injectReturnButton();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request && request.action === "triggerOvertime") {
    window.dispatchEvent(new CustomEvent("tryrevive:overtime", {
      detail: { domain: request.domain }
    }));
    sendResponse({ success: true });
  }
  return true;
});
