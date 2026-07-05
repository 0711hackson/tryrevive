// Tryrevive 内容桥接脚本
// 背景 worker 通过 chrome.tabs.sendMessage 发来的消息只有 content script 能收到，
// 这里把"超时"指令转成页面可监听的 CustomEvent，打通 后台 → 页面 的核心闭环。
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request && request.action === "triggerOvertime") {
    window.dispatchEvent(new CustomEvent("tryrevive:overtime", {
      detail: { domain: request.domain }
    }));
    sendResponse({ success: true });
  }
  return true;
});
