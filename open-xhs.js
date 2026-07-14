(function () {
  const params = new URLSearchParams(window.location.search);
  const query = (params.get("q") || "").trim().slice(0, 200);
  const isWechat = /MicroMessenger/i.test(navigator.userAgent || "")
    || params.get("wechat_preview") === "1";
  const suppressLaunch = params.get("no_launch") === "1";

  const wechatGuide = document.getElementById("wechat-guide");
  const browserGuide = document.getElementById("browser-guide");
  const missingQuery = document.getElementById("missing-query");
  const wechatKeyword = document.getElementById("wechat-keyword");
  const browserKeyword = document.getElementById("browser-keyword");
  const openButton = document.getElementById("open-xhs-button");
  const launchStatus = document.getElementById("launch-status");

  if (!query) {
    missingQuery.hidden = false;
    return;
  }

  document.title = `${query} - 打开小红书搜索`;
  if (wechatKeyword) wechatKeyword.textContent = query;
  if (browserKeyword) browserKeyword.textContent = query;

  const appUrl = `xhsdiscover://search/result?keyword=${encodeURIComponent(query)}`;

  if (isWechat) {
    wechatGuide.hidden = false;
    return;
  }

  browserGuide.hidden = false;
  openButton.href = appUrl;

  function markLaunchAttempt() {
    launchStatus.textContent = "正在打开小红书…";
    window.setTimeout(() => {
      if (document.visibilityState === "visible") {
        launchStatus.textContent = "若未自动打开，请点击上方按钮重试。";
      }
    }, 1600);
  }

  openButton.addEventListener("click", markLaunchAttempt);

  if (!suppressLaunch) {
    window.setTimeout(() => {
      markLaunchAttempt();
      window.location.href = appUrl;
    }, 350);
  } else {
    launchStatus.textContent = "点击上方按钮即可进入搜索结果。";
  }
})();
