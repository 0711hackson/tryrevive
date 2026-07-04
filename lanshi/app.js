// 烂开始 — 核心逻辑
// 设计：本地启发式生成「低阻力启动动作」（免费/离线），可选 Claude Haiku 增强。

const STORE_KEY = "lankaishi_state_v1";

const state = {
  currentTask: "",
  currentAction: "",
  stepCount: 0,        // 本次任务已完成的动作数
  settings: { apiKey: "", useAI: false },
  trail: []            // [{ task, steps: [{text, ts}] }]
};

// ---------- 持久化 ----------
function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      state.settings = saved.settings || state.settings;
      state.trail = saved.trail || [];
    }
  } catch (e) { console.warn("load failed", e); }
}
function save() {
  localStorage.setItem(STORE_KEY, JSON.stringify({ settings: state.settings, trail: state.trail }));
}

// ---------- 视图切换 ----------
function switchView(name) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  const el = document.getElementById(`view-${name}`);
  if (el) el.classList.add("active");
  if (name === "timeline") renderTimeline();
}

// ---------- 本地启发式生成器 ----------
// 思路：把任务降级成一个“开关式”的小动作——打开它/拿起它/写一行/只做2分钟。
const ACTION_RULES = [
  { kw: ["写", "文章", "报告", "复盘", "总结", "文档", "论文", "方案", "策划", "周报", "日记"],
    make: t => pick([
      `打开文档，只写下一个标题，哪怕很烂。`,
      `新建一个空白页，敲下第一句话就行。`,
      `写一行字——随便写，写完就可以停。`,
      `把脑子里第一个念头打上去，不用通顺。`
    ]) },
  { kw: ["代码", "编程", "bug", "需求", "开发", "项目", "重构"],
    make: t => pick([
      `打开编辑器，定位到要改的那个文件。`,
      `写一行注释，描述你想做的第一件事。`,
      `跑一次现有的代码，看看它现在什么样。`,
      `只改一行，跑通了再说。`
    ]) },
  { kw: ["学", "课", "看书", "读", "复习", "背", "题"],
    make: t => pick([
      `翻开到上次停下的那一页。`,
      `只读一段，读完就可以合上。`,
      `播放第一节课，听 2 分钟。`,
      `把书/资料放到面前，先打开它。`
    ]) },
  { kw: ["运动", "健身", "跑步", "锻炼", "瑜伽", "拉伸", "走"],
    make: t => pick([
      `换上运动的衣服就行，先到这一步。`,
      `做 5 个，做完就算数。`,
      `站起来，原地拉伸 30 秒。`,
      `穿好鞋，走到门口。`
    ]) },
  { kw: ["打扫", "整理", "收拾", "清理", "洗", "扔", "归置"],
    make: t => pick([
      `只收拾眼前这一小块地方。`,
      `先扔掉一件不要的东西。`,
      `把面前最碍眼的那一样放回原位。`,
      `定 2 分钟，时间到就可以停。`
    ]) },
  { kw: ["联系", "回复", "消息", "电话", "邮件", "微信", "约", "见"],
    make: t => pick([
      `打开对话框，写下称呼就行。`,
      `先打一句草稿，发不发再说。`,
      `把对方的名字找出来，点开他。`,
      `写一句“在吗”，剩下的待会儿想。`
    ]) },
  { kw: ["做饭", "煮", "菜", "厨房", "饭"],
    make: t => pick([
      `走进厨房，把锅放上灶台。`,
      `先洗一样食材就行。`,
      `烧上一壶水，从这开始。`
    ]) }
];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function localGenerate(task) {
  const t = task.trim();
  for (const rule of ACTION_RULES) {
    if (rule.kw.some(k => t.includes(k))) return rule.make(t);
  }
  // 通用兜底：把整件事缩到最小的一个动作
  return pick([
    `只花 2 分钟碰一下「${t}」，打开它就好，不用做完。`,
    `把「${t}」拆到最小：现在只做眼前那一小步。`,
    `不准备、不规划，先对「${t}」做一个 30 秒的动作。`,
    `把和「${t}」有关的东西放到面前，先开始接触它。`
  ]);
}

// 继续时给一个“更轻”的下一步
function localNextStep(task) {
  return pick([
    `既然已经动了，再多做一点点——只加一步就停。`,
    `趁着这股劲，再往前推 2 分钟。`,
    `保持现在的状态，再完成一个小动作就好。`,
    `不用变难，照刚才的样子，再来一次。`
  ]);
}

// ---------- 可选 AI 生成（Claude Haiku，浏览器直连）----------
async function aiGenerate(task, isNext) {
  const key = state.settings.apiKey;
  if (!key) return null;
  const system = "你是「烂开始」——帮人降低行动门槛。给定一件用户想做却拖着的事，只输出一个【当下就能做、不需要意志力】的极小启动动作。要求：中文、不超过 28 字、具体可触摸（打开/拿起/写一行/只做2分钟之类）、不要规划全程、不要列待办、不要说教。直接输出这一句动作本身，不要引号、不要解释。";
  const userMsg = isNext
    ? `这件事：「${task}」。用户刚完成了一个小动作，想再往前一点。给一个更轻、不变难的下一个小动作。`
    : `这件事：「${task}」。给一个低阻力的启动动作。`;
  try {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 60,
        system: system,
        messages: [{ role: "user", content: userMsg }]
      })
    });
    if (!resp.ok) throw new Error("HTTP " + resp.status);
    const data = await resp.json();
    const text = data && data.content && data.content[0] && data.content[0].text;
    return text ? text.trim().replace(/^["「『]|["」』]$/g, "") : null;
  } catch (e) {
    console.warn("AI 生成失败，回退本地规则：", e.message);
    return null;
  }
}

// ---------- 主流程 ----------
async function generateStart() {
  const input = document.getElementById("task-input");
  const task = input.value.trim();
  if (!task) { input.focus(); return; }

  state.currentTask = task;
  state.stepCount = 0;

  const btn = document.getElementById("generate-btn");
  let action = null;
  if (state.settings.useAI && state.settings.apiKey) {
    btn.textContent = "AI 正在为你想一个小动作…";
    btn.parentElement.classList.add("thinking");
    action = await aiGenerate(task, false);
    btn.parentElement.classList.remove("thinking");
    btn.textContent = "生成一个「烂开始」";
  }
  if (!action) action = localGenerate(task);

  state.currentAction = action;
  showAction();
}

function showAction() {
  document.getElementById("action-context").textContent = `关于：${state.currentTask}`;
  document.getElementById("action-text").textContent = state.currentAction;
  switchView("action");
}

async function regenerate() {
  let action = null;
  if (state.settings.useAI && state.settings.apiKey) {
    action = await aiGenerate(state.currentTask, state.stepCount > 0);
  }
  if (!action) action = state.stepCount > 0 ? localNextStep(state.currentTask) : localGenerate(state.currentTask);
  // 避免和上一个完全一样
  if (action === state.currentAction) action = localGenerate(state.currentTask);
  state.currentAction = action;
  showAction();
}

function enterFocus() {
  document.getElementById("focus-text").textContent = state.currentAction;
  switchView("focus");
}

function abandonFocus() {
  // 没做完也没关系，回到动作卡
  switchView("action");
}

function completeAction() {
  recordStep(state.currentTask, state.currentAction);
  state.stepCount++;
  const sub = document.getElementById("done-sub");
  sub.textContent = state.stepCount >= 2
    ? `这是你在这件事上的第 ${state.stepCount} 个小动作。`
    : `一个小小的胜利，已经记下了。`;
  switchView("done");
}

async function continueStep() {
  let action = null;
  if (state.settings.useAI && state.settings.apiKey) {
    action = await aiGenerate(state.currentTask, true);
  }
  if (!action) action = localNextStep(state.currentTask);
  state.currentAction = action;
  showAction();
}

function stopHere() {
  document.getElementById("task-input").value = "";
  switchView("home");
}

// ---------- 时间线 ----------
function recordStep(task, text) {
  let group = state.trail.find(g => g.task === task);
  if (!group) { group = { task, steps: [] }; state.trail.unshift(group); }
  group.steps.push({ text, ts: Date.now() });
  save();
}

function fmtTime(ts) {
  const d = new Date(ts);
  const pad = n => n.toString().padStart(2, "0");
  return `${d.getMonth() + 1}月${d.getDate()}日 ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderTimeline() {
  const list = document.getElementById("timeline-list");
  if (!state.trail.length) {
    list.innerHTML = `<div class="tl-empty">还没有痕迹。<br>回到首页，对一件事做一个「烂开始」吧。</div>`;
    return;
  }
  list.innerHTML = state.trail.map(g => `
    <div class="tl-group">
      <div class="tl-group-task">${escapeHtml(g.task)}</div>
      ${g.steps.map(s => `
        <div class="tl-step">
          <span class="tl-step-dot">●</span>
          <div class="tl-step-body">
            <div class="tl-step-text">${escapeHtml(s.text)}</div>
            <div class="tl-step-time">${fmtTime(s.ts)}</div>
          </div>
        </div>`).join("")}
    </div>
  `).join("");
}

// ---------- 设置 ----------
function openSettings() {
  document.getElementById("api-key-input").value = state.settings.apiKey || "";
  document.getElementById("use-ai-toggle").checked = !!state.settings.useAI;
  document.getElementById("settings-overlay").classList.add("active");
}
function closeSettings() { document.getElementById("settings-overlay").classList.remove("active"); }
function saveSettings() {
  state.settings.apiKey = document.getElementById("api-key-input").value.trim();
  state.settings.useAI = document.getElementById("use-ai-toggle").checked;
  save();
  closeSettings();
}

// ---------- 启动 ----------
document.addEventListener("DOMContentLoaded", () => {
  load();
  // 回车快捷生成（Ctrl/Cmd+Enter 或单独 Enter 不换行时）
  const input = document.getElementById("task-input");
  input.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); generateStart(); }
  });
});
