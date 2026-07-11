// Tryrevive Attention Guard background worker.
// The page creates a per-task guard session. The background worker keeps the
// reminder/deadline alarms alive even if the external page timer is throttled.

const GUARD_STORAGE_KEY = "tryreviveGuardSession";
const REMINDER_ALARM = "tryreviveGuardReminder";
const DEADLINE_ALARM = "tryreviveGuardDeadline";

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

chrome.alarms.clear("attentionCheck");

function normalizeHost(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function isGuardedUrl(url) {
  const host = normalizeHost(url);
  return GUARDED_HOSTS.some(domain => host === domain || host.endsWith("." + domain));
}

function getGuardSession(callback) {
  chrome.storage.local.get([GUARD_STORAGE_KEY], result => {
    const session = result[GUARD_STORAGE_KEY];
    callback(session && typeof session === "object" ? session : null);
  });
}

function clearGuardAlarms() {
  chrome.alarms.clear(REMINDER_ALARM);
  chrome.alarms.clear(DEADLINE_ALARM);
}

function scheduleGuardAlarms(session) {
  clearGuardAlarms();
  if (!session || !Number.isFinite(Number(session.returnAt))) return;

  const now = Date.now();
  if (Number(session.reminderAt) > now) {
    chrome.alarms.create(REMINDER_ALARM, { when: Number(session.reminderAt) });
  }

  if (Number(session.returnAt) > now) {
    chrome.alarms.create(DEADLINE_ALARM, { when: Number(session.returnAt) });
  } else {
    forceReturnActiveGuardedTab(session);
  }
}

function notifyLastMinute(session) {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const tab = tabs && tabs[0];
    if (!tab || !isGuardedUrl(tab.url || "")) return;

    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon128.png",
      title: "Tryrevive：最后 1 分钟",
      message: `“${session.taskText || "本次浏览"}”快到时间了，准备回到计划。`,
      priority: 2
    });
  });
}

function forceReturnActiveGuardedTab(session) {
  if (!session || !session.returnUrl) return;
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const tab = tabs && tabs[0];
    if (!tab || !isGuardedUrl(tab.url || "")) return;

    chrome.tabs.update(tab.id, { url: session.returnUrl }, () => {
      chrome.storage.local.remove(GUARD_STORAGE_KEY);
      clearGuardAlarms();
    });
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request && request.action === "tryreviveGuardSessionUpdated") {
    scheduleGuardAlarms(request.session);
    sendResponse({ success: true });
    return true;
  }

  if (request && request.action === "tryreviveGuardCleared") {
    chrome.storage.local.remove(GUARD_STORAGE_KEY, () => {
      clearGuardAlarms();
      sendResponse({ success: true });
    });
    return true;
  }

  // Legacy bridge kept for older local demos that still call the extension.
  if (request && request.action === "fetchAnthropic") {
    fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": request.apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 120,
        system: request.system,
        messages: [{ role: "user", content: request.message }]
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("HTTP error " + res.status);
        return res.json();
      })
      .then(data => {
        const text = data && data.content && data.content[0] && data.content[0].text;
        sendResponse(text
          ? { success: true, content: text }
          : { success: false, error: "Invalid response structure" });
      })
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true;
  }

  return false;
});

chrome.alarms.onAlarm.addListener(alarm => {
  getGuardSession(session => {
    if (!session) {
      clearGuardAlarms();
      return;
    }

    if (alarm.name === REMINDER_ALARM) {
      notifyLastMinute(session);
      return;
    }

    if (alarm.name === DEADLINE_ALARM) {
      forceReturnActiveGuardedTab(session);
    }
  });
});
