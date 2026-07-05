// Tryrevive MVP 三期核心控制系统 - 谷歌极简首页、矢量花叶HSL无极调节、智能MBTI梦想警示语、无眼蜡笔Chubby桌宠、不规则云雾气泡与手写自定心语

// --- 1. 静态数据配置 (测试题/自适应话术库/气泡) ---
const QUIZ_QUESTIONS = [
  {
    text: "1. 当你感到精神疲惫时，你更倾向于？",
    options: [
      { text: "独自一人待在安静的空间里放空", type: "I" },
      { text: "与朋友倾诉或去户外寻找新的刺激", type: "E" }
    ]
  },
  {
    text: "2. 你更容易因为什么感到焦虑或心浮气躁？",
    options: [
      { text: "具体的待办事项越积越多，时间不够用", type: "J" },
      { text: "对未来的长远规划或人生目标感到迷茫", type: "P" }
    ]
  },
  {
    text: "3. 当你的学习/工作计划被打乱时，你最需要？",
    options: [
      { text: "迅速找出逻辑成因，并冷静重排待办", type: "T" },
      { text: "先接纳自己的情绪，寻找温和的心理缓冲", type: "F" }
    ]
  },
  {
    text: "4. 你更习惯以什么样的方式去探索一个新领域？",
    options: [
      { text: "收集宏观概念和本质规律，再进行抽象联想", type: "N" },
      { text: "从具体实例和物理数据入手，一步一个脚印", type: "S" }
    ]
  },
  {
    text: "5. 你目前感到自律受挫、最想要通过网页平复的是？",
    options: [
      { text: "频繁刷手机或看短视频带来的空虚成瘾", type: "A" }, // Addiction
      { text: "面对棘手任务时产生的严重拖延和畏难", type: "D" }, // Delay
      { text: "因琐碎交际或学业压力带来的莫名烦躁", type: "V" }  // Vexation
    ]
  },
  {
    text: "6. 你是否希望开启一个水粉画风的桌宠小人作为你的疗愈伙伴？",
    isVisualToggle: true,
    options: [
      { text: "🌸 开启桌宠陪伴（在主页和禅修中展示）", type: "Y" },
      { text: "🕊️ 保持绝对极简（隐藏桌宠，专注心流）", type: "O" }
    ]
  }
];

// 按 T/F × J/P 归并的 4 类人格倾向 × 3 种核心痛点(成瘾/拖延/烦躁)文案模板，随机选一
// 说明：16 型 MBTI 经 analyzeAnswers 后落入 TJ/FJ/TP/FP 四个语气桶，E/I 与 S/N 仅参与画像不影响选句
const MBTI_COACH_TEMPLATES = {
  // J 类型人格：强计划、物理做功
  TJ: {
    A: [
      "继续沉溺在低信息熵的算法中，你距离『{motivation}』的物理偏差将扩大 1.5 小时。立即修正！",
      "警报：算法推荐已劫持了你的 TJ 专注环路。梦想『{motivation}』正受到干扰。切回你的第二步『{step2}』！",
      "算一算时间账：如果今天你在这个网页上失守，你制定的第三步计划『{step3}』将彻底被推迟。",
      "推荐流是针对你意志力的饱和攻击。如果连今天的注意力都无法规划，如何掌控更宏大的『{motivation}』目标？",
      "警告：今日时间预算正被非建设性行为消耗。立刻关闭当前页面，切回主视图执行第一步。"
    ],
    D: [
      "拖延并不能打败复杂，只有物理做功可以。开始你的第一步目标，为梦想『{motivation}』注入能量。",
      "检测到强烈的抗拒情绪。请执行微小第一步，这只需要 10 秒。立刻纠偏！",
      "计划正在脱轨。 TJ 应当依靠秩序战胜畏难。今日今日计划在呼唤你，立刻执行第一步！",
      "完美的计划如果不能执行，其净值为零。现在启动第一步，恢复对今天行动线的控制。",
      "不要在脑中进行无意义的项目评估。现在就开始行动，用实质的做功来终结焦虑。"
    ],
    V: [
      "琐碎噪音正在消耗你的计算力。请立刻切回 Tryrevive，隔绝外界烦躁，捍卫『{motivation}』。",
      "情绪波动时，行动是最好的稳定器。专注于你刚才定下的步骤『{step2}』。",
      "让脑海里的噪音平息。现在退出社交软件，重新夺回你对生活的目标掌控。",
      "琐碎的信息和无意义的争执是对心智资源的低效占用。关闭它，回到有确定性的轨道上来。",
      "当你感到秩序感丧失、内心烦躁时，完成一个小小的物理步骤是恢复掌控感的最快途径。"
    ]
  },
  FJ: {
    A: [
      "Rowan，你先前刻下了对未来的希冀『{motivation}』。现在的推荐流真的能让你感到平静吗？",
      "在这个算法洪流里没有你真正的伙伴。回想起你的初心，切回你的第二步计划『{step2}』。",
      "对自我的掌控是最大的安全感。不要用短暂的娱乐，敷衍你宏大的目标『{motivation}』。",
      "不要在虚拟的信息流中寻找温暖。你的现实目标『{motivation}』和身边真正需要你的人，正等你归来。",
      "每一次随波逐流都是对自我信任的侵蚀。合上页面，重新对自己负起责任来。"
    ],
    D: [
      "你本是个极度负责的人，不要让拖延伤害了你对自我的期许。梦想『{motivation}』正等你动身。",
      "万事开头难，但请接纳目前的不完美，踏出第一步。你的梦想承诺不是废纸。",
      "今日的小卡片『{step2}』正在等待你。温和地开启它，你并不是一个人在战斗。",
      "别给自己太大压力，不需要做到尽善尽美。先完成哪怕最微小的一个动作，这就是对你梦想最好的呵护。",
      "逃避行动只会积攒对自我的内疚。原谅自己，然后从今天最简单的第一步开始做起。"
    ],
    V: [
      "社交与交际的消耗应当在这里被洗涤。请深呼吸，用宁静色包裹自己，捍卫初心『{motivation}』。",
      "接纳当下的焦躁，将视线收回到你对生活的规划『{step2}』中，世界会安静下来。",
      "安静待在你的 Tryrevive 起始页中，不要让外界的声音撕裂了你原本的梦想。",
      "外界的喧嚣是他们未被疗愈的焦虑，不要让它传染给你。回到你精心布置的宁静角落。",
      "如果人际关系让你感到沉重和疲惫，请暂时切断与外界的连接，在这里安顿你的心神。"
    ]
  },
  // P 类型人格：强灵感、弹性探索
  TP: {
    A: [
      "逻辑泄露警报：你刚才的注意力设防被社交算法击穿了。目标『{motivation}』已挂起！",
      "不要让廉价的短视频定义了你今天的终点。你本计划开始第二步『{step2}』的。",
      "你的注意力本是极其昂贵的分析资产，不要白白送给推荐流。切回计划『{step3}』！",
      "用你卓越的理智分析一下：这个不断给你喂食低质多巴胺的算法，难道不觉得是一种智力降级吗？",
      "这套算法是专门针对你大脑的漏洞设计的。退出这场心智操纵，拿回你的主权。"
    ],
    D: [
      "灵感只在做功的瞬间产生。立刻踏出你的第一步，哪怕只关掉一个无关标签。",
      "自律并不是限制，而是彻底掌控你弹性人生的核动力。去执行你的第一步『{step2}』。",
      "目标『{motivation}』正处于休眠期。启动你的破局点，看看能延伸出什么精妙解法。",
      "理性的思考如果不转化为实际的代码或物理行动，就只是头脑中的空转。动起来！",
      "不要试图一次性解决所有难题。把你的大系统拆解开，先切入第一步『{step2}』。"
    ],
    V: [
      "外界的莫名烦躁只是低维数据污染。切回 Tryrevive 起始页进行低噪重构。",
      "计划被打乱了也没关系，TP 擅长弹性修正。关注当下的第二步『{step2}』。",
      "关闭低价值信息源。你的头脑极其宝贵，只留给真正有智识增量的事物『{motivation}』。",
      "面对混乱和噪音，不要情绪化，用分析的眼光看待它，然后冷静地把它们从视野里过滤掉。",
      "去寻找本质的规律，而不是被表面的泡沫激怒。闭上眼睛，重新建立你的内部秩序。"
    ]
  },
  FP: {
    A: [
      "算法推荐里只有重复和死板的复制，没有你独特的灵魂和创意。梦想『{motivation}』在呼唤你。",
      "Rowan，回想起你最渴望的初心『{motivation}』。去亲手创造它，而不是看着别人刷屏。",
      "从低多巴胺的无聊中清醒过来。你的第二步『{step2}』本有无限可能，去激活它！",
      "这个世界塞满了被批量制造的流行，只有你亲自动手做的事情，才真正带有你的印记。为了『{motivation}』，切回吧。",
      "别让千篇一律的 Feed 流剥夺了你的灵气。去开始属于你的、独一无二的心流旅程。"
    ],
    D: [
      "接纳当前的拖延状态，这只是你的身体在积蓄灵感。但请为了梦想『{motivation}』，轻轻踏出第一步。",
      "不需要一步做到完美，只做 1% 也是伟大的开始。去开启你的破局小卡片吧。",
      "为了能无拘无束地探索世界，现在就开始物理做功，去扫除眼前的微小障碍。",
      "如果觉得目标太沉重，就先做点好玩的、好玩的小事。你的灵感会在做功中自然苏醒。",
      "拖延只是因为你太在乎这件作品的成色了。允许自己先交出一份粗糙的草稿，去走第一步。"
    ],
    V: [
      "这个世界太嘈杂了。请躲进你亲手挑选的植物花叶色环里，抚平疲惫，保护梦想『{motivation}』。",
      "情绪的潮汐终会退去。在这个属于你自己的心流空间里，静静写下你的第二步『{step2}』。",
      "接纳焦躁，释放自责。看着你选的主题色，让内心重回深海般的平静。",
      "外界的评判与你的内在价值毫无关联。深呼吸，守护你内心对『{motivation}』的纯净火焰。",
      "在这里，你可以卸下所有的伪装和面具。让这片宁静的对比色拥抱你，重新找回自我的节奏。"
    ]
  }
};

const BUBBLE_TEXTS = [
  "停一下，深呼吸，感受此刻身体的重量。",
  "你的注意力很珍贵，值得留给你真正在意的事。",
  "放下手，抬起头，看看你身边的世界。",
  "此刻你最想做的，是哪一件小事？",
  "如果今天可以重新开始，你想怎么度过？",
  "不必苛责自己，慢慢回到这里就好。",
  "专注不是束缚，而是把时间还给你自己。",
  "你已经停下来了，这就是很好的一步。"
];

// 默认设防 App Dock（工厂函数：每次返回全新副本，避免多用户/多处共享同一引用被互相改动）
function defaultAppDock() {
  return [
    { id: "xiaohongshu", name: "小红书", url: "https://www.xiaohongshu.com", color: "#ef4444" },
    { id: "bilibili", name: "B站", url: "https://www.bilibili.com", color: "#00a1d6" },
    { id: "douyin", name: "抖音", url: "https://www.douyin.com", color: "#1c1c24" },
    { id: "weibo", name: "微博", url: "https://weibo.com", color: "#e6162d" },
    { id: "taobao", name: "淘宝", url: "https://www.taobao.com", color: "#ff5000" },
    { id: "pinduoduo", name: "拼多多", url: "https://www.pinduoduo.com", color: "#e02e24" },
    { id: "netease", name: "网易云", url: "https://music.163.com", color: "#c20c0c" }
  ];
}

// 统一持久化：所有存档写入都走这里，避免散落 10+ 处的重复 setItem
function saveProfile() {
  if (!state.currentUser) return;
  const key = `tryrevive_save_${state.currentUser}`;
  localStorage.setItem(key, JSON.stringify(state.userProfile));
}

// --- 2. 核心状态管理 ---
const state = {
  currentUser: "",
  userProfile: {
    nickname: "",
    password: "",
    mbti: "INTJ-A",
    motivation: "逃离算法洪流，自律重生。",
    customQuote: "", // 用户自定心语
    calmingColor: { h: 220, s: 65, l: 55 }, // HSL with custom lightness
    showPet: true, // 桌宠小人开启/隐藏开关
    apiKey: "", // Anthropic API Key
    currentGoal: "",
    firstStep: "",
    step2: "",
    step3: "",
    quizAnswers: [],
    
    // User Custom App Dock config
    appDock: defaultAppDock()
  },
  activeView: "narrative",
  avatarState: "gray",       // "black" | "gray" | "white"
  avatarAction: "walk",       // black: "cry"|"crawl", gray: "walk"|"think", white: "jump"|"wave"
  meditationActive: false,
  meditationTotalTime: 300,
  timerInterval: null,
  timeLeft: 300,
  awayStartTime: null,
  
  // Blocker loop state
  blockerTimerActive: false,
  blockerTargetSite: "",
  blockerTargetUrl: "",
  blockerTimeLimitSec: 0,
  blockerStartTime: null,
  blockerInterval: null,
  
  // Dock Edit Mode state
  dockEditMode: false,
  
  canvasAnimIds: {
    avatar: null,
    galaxy: null,
    meditationAvatar: null,
    cloudBubble: null,
    sprout: null
  },
  actionSwitchInterval: null
};

// 系统“减少动态效果”偏好：用于给 canvas 动画降频/减量（CSS 媒体查询管不到 canvas）
const PREFERS_REDUCED_MOTION = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

// --- 3. 音频合成系统 (Web Audio API Synthesizer) ---
let audioCtx = null;
let wavesNode = null;
let wavesGain = null;
let wavesFilter = null;
let heartbeatInterval = null;

function initAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function startOceanWaves() {
  try {
    initAudio();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    const bufferSize = 2 * audioCtx.sampleRate;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    
    // Brownian Noise low rumble tide effect
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }
    
    wavesNode = audioCtx.createBufferSource();
    wavesNode.buffer = noiseBuffer;
    wavesNode.loop = true;
    
    wavesFilter = audioCtx.createBiquadFilter();
    wavesFilter.type = "lowpass";
    wavesFilter.frequency.setValueAtTime(300, audioCtx.currentTime);
    
    wavesGain = audioCtx.createGain();
    wavesGain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    
    wavesNode.connect(wavesFilter);
    wavesFilter.connect(wavesGain);
    wavesGain.connect(audioCtx.destination);
    
    wavesNode.start();
  } catch (e) {
    console.error("Audio Waves start failed:", e);
  }
}

function modulateWaves(phase) {
  if (!audioCtx || !wavesFilter || !wavesGain) return;
  const t = audioCtx.currentTime;
  if (phase === "inhale") {
    wavesFilter.frequency.exponentialRampToValueAtTime(450, t + 4);
    wavesGain.gain.linearRampToValueAtTime(0.12, t + 4);
  } else if (phase === "exhale") {
    wavesFilter.frequency.exponentialRampToValueAtTime(180, t + 4);
    wavesGain.gain.linearRampToValueAtTime(0.02, t + 4);
  }
}

function stopOceanWaves() {
  if (wavesNode) {
    try {
      wavesNode.stop();
    } catch (e) {}
    wavesNode = null;
  }
}

function playSingleHeartbeat() {
  if (!audioCtx) initAudio();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = "sine";
  osc.frequency.setValueAtTime(65, audioCtx.currentTime);
  
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
  
  gain.gain.setValueAtTime(0, audioCtx.currentTime + 0.28);
  gain.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.32);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.55);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.6);
}

function startHeartbeatLoop() {
  stopHeartbeatLoop();
  playSingleHeartbeat();
  heartbeatInterval = setInterval(playSingleHeartbeat, 1200);
}

function stopHeartbeatLoop() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
}

// resize 监听注册表：同一 key 重复注册时先移除旧监听，避免反复切页叠加几十个 handler
const _resizeHandlers = {};
function registerResize(key, handler) {
  if (_resizeHandlers[key]) window.removeEventListener("resize", _resizeHandlers[key]);
  _resizeHandlers[key] = handler;
  window.addEventListener("resize", handler);
}

// --- 4. 页面过渡控制 (SPA Router) ---
function switchView(viewName) {
  if (state.canvasAnimIds.avatar) cancelAnimationFrame(state.canvasAnimIds.avatar);
  if (state.canvasAnimIds.galaxy) cancelAnimationFrame(state.canvasAnimIds.galaxy);
  if (state.canvasAnimIds.meditationAvatar) cancelAnimationFrame(state.canvasAnimIds.meditationAvatar);
  if (state.canvasAnimIds.cloudBubble) cancelAnimationFrame(state.canvasAnimIds.cloudBubble);
  if (state.canvasAnimIds.sprout) cancelAnimationFrame(state.canvasAnimIds.sprout);
  if (state.timerInterval) clearInterval(state.timerInterval);
  if (state.actionSwitchInterval) clearInterval(state.actionSwitchInterval);
  state.meditationActive = false;
  stopOceanWaves();

  const screens = document.querySelectorAll(".view-screen");
  screens.forEach(screen => screen.classList.remove("active"));

  const targetScreen = document.getElementById(`view-${viewName}`);
  if (targetScreen) {
    targetScreen.classList.add("active");
  }
  state.activeView = viewName;

  // Initialize specific page logics
  if (viewName === "home") {
    // Dock Edit Mode disabled by default
    state.dockEditMode = false;
    const editBtn = document.getElementById("edit-dock-btn");
    if (editBtn) editBtn.innerHTML = "<span>编辑</span>";
    
    renderAppDock();
    
    // Sync Pet display
    const petContainer = document.getElementById("desk-pet-container");
    if (petContainer) {
      petContainer.style.display = state.userProfile.showPet ? "block" : "none";
    }
    
    if (state.userProfile.showPet) {
      initAvatarCanvas("avatar-canvas", "avatar");
      initActionCycle();
    }
    
    // MBTI template warning pre-generation & synchronization
    syncWarningMotivationalDOM();
    
  } else if (viewName === "meditation") {
    const setupOverlay = document.getElementById("meditation-setup-overlay");
    const goalReview = document.getElementById("meditation-goal-review");
    const setupInput = document.getElementById("meditation-setup-quote");
    
    if (setupOverlay) setupOverlay.style.display = "flex";
    if (goalReview) {
      goalReview.textContent = state.userProfile.firstStep ? 
        `今日设防目标：${state.userProfile.firstStep}` : 
        `今日设防目标：专注当下，自我对话`;
    }
    if (setupInput) setupInput.value = state.userProfile.customQuote || "";
    
  } else if (viewName === "onboarding") {
    // Fill text inputs from state
    const customQuoteInput = document.getElementById("input-custom-quote");
    const motivationInput = document.getElementById("input-motivation");
    const apiKeyInput = document.getElementById("input-api-key");
    if (customQuoteInput) customQuoteInput.value = state.userProfile.customQuote || "";
    if (motivationInput) motivationInput.value = state.userProfile.motivation || "";
    if (apiKeyInput) apiKeyInput.value = state.userProfile.apiKey || "";
    
    // Set pet style radio checks
    const petStyle = state.userProfile.petStyle || "B";
    const radioEl = document.querySelector(`input[name="pet-style-option"][value="${petStyle}"]`);
    if (radioEl) radioEl.checked = true;
    
    renderColorWreath();
  } else if (viewName === "narrative") {
    NARRATIVE_LINES.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove("visible", "typing-cursor");
    });
    const footer = document.getElementById("narrative-footer");
    if (footer) footer.style.opacity = "0";
    initNarrativeSproutCanvas();
  }
}

// --- 5. 账号系统与 LocalStorage 存档 ---

// 安全工具：HTML 转义，防止用户输入（App 名称、目标、AI 文本）造成存储型 XSS
function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// 安全工具：使用 Web Crypto 对密码做加盐 SHA-256 哈希，不再明文落盘
async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(`${salt}::${password}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function generateSalt() {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, "0")).join("");
}

function loadUserProfile(username) {
  const save = localStorage.getItem(`tryrevive_save_${username}`);
  if (!save) return null;
  try {
    const loaded = JSON.parse(save);
    
    // Safety compatibility fallbacks to prevent load crash
    if (!loaded.appDock) {
      loaded.appDock = defaultAppDock();
    }
    if (loaded.calmingColor === undefined) {
      loaded.calmingColor = { h: 220, s: 65, l: 55 };
    }
    if (loaded.calmingColor.l === undefined) {
      loaded.calmingColor.l = 55;
    }
    if (loaded.showPet === undefined) {
      loaded.showPet = true;
    }
    if (loaded.petStyle === undefined) {
      loaded.petStyle = "B";
    }
    if (loaded.quizAnswers === undefined) {
      loaded.quizAnswers = [];
    }
    return loaded;
  } catch (e) {
    console.error("Failed to parse user profile:", e);
    return null;
  }
}

async function handleRegister() {
  const userEl = document.getElementById("login-username");
  const passEl = document.getElementById("login-password");
  const usernameInput = userEl ? userEl.value.trim() : "";
  const passwordInput = passEl ? passEl.value.trim() : "";

  if (!usernameInput || !passwordInput) {
    alert("请输入存档名称与密码以设立关卡。");
    return;
  }

  const existing = localStorage.getItem(`tryrevive_save_${usernameInput}`);
  if (existing) {
    alert("该存档已存在，载入请点击“载入旧存档”。");
    return;
  }

  // 加盐哈希密码，明文不落盘
  const passwordSalt = generateSalt();
  const passwordHash = await hashPassword(passwordInput, passwordSalt);

  state.currentUser = usernameInput;
  state.userProfile = {
    nickname: usernameInput,
    password: passwordHash,
    passwordSalt: passwordSalt,
    mbti: "INTJ-A",
    motivation: "",
    customQuote: "",
    calmingColor: { h: 220, s: 65, l: 55 },
    showPet: true,
    petStyle: "B",
    currentGoal: "",
    firstStep: "",
    step2: "",
    step3: "",
    quizAnswers: [],

    appDock: defaultAppDock()
  };

  startQuiz();
}

async function handleLogin() {
  const userEl = document.getElementById("login-username");
  const passEl = document.getElementById("login-password");
  const usernameInput = userEl ? userEl.value.trim() : "";
  const passwordInput = passEl ? passEl.value.trim() : "";

  if (!usernameInput || !passwordInput) {
    alert("请输入存档名称与密码验证钥匙。");
    return;
  }

  const loaded = loadUserProfile(usernameInput);
  if (!loaded) {
    alert("未找到该名称的存档，请注册新存档。");
    return;
  }

  // 密码校验：优先用加盐哈希；兼容旧明文存档并在成功后自动迁移
  let passwordOk = false;
  if (loaded.passwordSalt) {
    const inputHash = await hashPassword(passwordInput, loaded.passwordSalt);
    passwordOk = (inputHash === loaded.password);
  } else {
    // 旧版明文存档：明文比对，校验通过后迁移为哈希
    passwordOk = (loaded.password === passwordInput);
    if (passwordOk) {
      loaded.passwordSalt = generateSalt();
      loaded.password = await hashPassword(passwordInput, loaded.passwordSalt);
      localStorage.setItem(`tryrevive_save_${usernameInput}`, JSON.stringify(loaded));
    }
  }

  if (!passwordOk) {
    alert("密码验证钥匙不正确，无法载入存档。");
    return;
  }

  state.currentUser = usernameInput;
  state.userProfile = loaded;

  applyThemeColor(state.userProfile.calmingColor.h, state.userProfile.calmingColor.s, state.userProfile.calmingColor.l);
  switchView("home");
}

function handleLogout() {
  localStorage.removeItem(`tryrevive_active_user`);
  state.currentUser = "";
  switchView("login");
}

function applyThemeColor(h, s, l) {
  document.documentElement.style.setProperty("--theme-h", h);
  document.documentElement.style.setProperty("--theme-s", `${s}%`);
  document.documentElement.style.setProperty("--theme-l", `${l}%`);
  
  // 6:3:1 Rule adjustments
  // 魂 (60%): Background (Deep Charcoal tinted with selected calming color)
  const bgGradStart = `hsl(${h}, ${s * 0.12}%, 9%)`;
  const bgGradEnd = `hsl(${(h + 25) % 360}, ${s * 0.08}%, 5%)`;
  document.documentElement.style.setProperty("--bg-gradient-start", bgGradStart);
  document.documentElement.style.setProperty("--bg-gradient-end", bgGradEnd);
  
  // 辅 (30%): card textures (Focuszen shallow charcoal)
  const glassBg = `hsla(${h}, ${s * 0.15}%, 14%, 0.65)`;
  const glassBorder = `hsla(${h}, ${s}%, 55%, 0.05)`;
  document.documentElement.style.setProperty("--surface-glass", glassBg);
  document.documentElement.style.setProperty("--surface-glass-border", glassBorder);
  
  // 点缀 (10%): Hue custom lightness
  const accent = `hsl(${h}, ${s}%, ${l}%)`;
  const accentLight = `hsl(${h}, ${s}%, ${Math.min(l + 10, 85)}%)`;
  const accentGlow = `hsla(${h}, ${s}%, ${l}%, 0.25)`;
  document.documentElement.style.setProperty("--accent", accent);
  document.documentElement.style.setProperty("--accent-light", accentLight);
  document.documentElement.style.setProperty("--accent-glow", accentGlow);

  // 实心填充专用色：钳制明度与饱和度的保底值，避免浅色主题把按钮渲染成发白的“无样式方块”。
  // 星空/光晕仍用用户选的柔色，只有按钮等实心填充走这个鲜艳保底版本。
  const fillS = Math.max(s, 52);
  const fillL = Math.min(Math.max(l, 42), 62);
  const accentFill = `hsl(${h}, ${fillS}%, ${fillL}%)`;
  const accentFillLight = `hsl(${h}, ${fillS}%, ${Math.min(fillL + 12, 70)}%)`;
  document.documentElement.style.setProperty("--accent-fill", accentFill);
  document.documentElement.style.setProperty("--accent-fill-light", accentFillLight);
}

// --- 6. 自适应心理评测系统 (Quiz Engine with Q6 A/B visuals) ---
let currentQuestionIndex = 0;

function startQuiz() {
  currentQuestionIndex = 0;
  state.userProfile.quizAnswers = [];
  switchView("quiz");
  showQuestion();
}

function showQuestion() {
  const progressFill = document.getElementById("quiz-progress");
  const questionText = document.getElementById("quiz-question-text");
  const optionsBox = document.getElementById("quiz-options-box");

  const percent = (currentQuestionIndex / QUIZ_QUESTIONS.length) * 100;
  if (progressFill) progressFill.style.width = `${percent}%`;

  if (currentQuestionIndex >= QUIZ_QUESTIONS.length) {
    analyzeAnswers();
    switchView("onboarding");
    return;
  }

  const q = QUIZ_QUESTIONS[currentQuestionIndex];
  if (questionText) questionText.textContent = q.text;
  if (optionsBox) {
    optionsBox.innerHTML = "";
    
    // Check if Visual Card toggle question 6 (桌宠开启/隐藏)
    if (q.isVisualToggle) {
      const visualContainer = document.createElement("div");
      visualContainer.className = "quiz-visual-options";
      
      q.options.forEach(opt => {
        const card = document.createElement("div");
        card.className = "quiz-visual-card";
        
        const previewCanvas = document.createElement("canvas");
        previewCanvas.width = 75;
        previewCanvas.height = 75;
        previewCanvas.style.width = "75px";
        previewCanvas.style.height = "75px";
        
        card.appendChild(previewCanvas);
        
        const label = document.createElement("span");
        label.style.fontSize = "0.75rem";
        label.style.marginTop = "0.6rem";
        label.style.textAlign = "center";
        label.textContent = opt.text;
        card.appendChild(label);
        
        card.onclick = () => {
          state.userProfile.quizAnswers.push(opt.type);
          currentQuestionIndex++;
          showQuestion();
        };
        visualContainer.appendChild(card);
        
        // Render simple Preview Crayon Pet in Visual Cards
        setTimeout(() => {
          const ctx = previewCanvas.getContext("2d");
          if (opt.type === "Y") {
            // Draw cute walk chibi crayon
            ctx.filter = "blur(1.2px)";
            ctx.lineWidth = 10;
            ctx.strokeStyle = "rgba(240, 185, 185, 0.85)";
            ctx.fillStyle = "#ffffff";
            // Head
            ctx.beginPath();
            ctx.arc(37, 24, 13, 0, Math.PI * 2);
            ctx.fill();
            // Body line
            ctx.beginPath();
            ctx.moveTo(37, 36);
            ctx.lineTo(37, 56);
            ctx.stroke();
            ctx.filter = "none";
          } else {
            // Draw minimalist blank frame
            ctx.strokeStyle = "rgba(255,255,255,0.08)";
            ctx.lineWidth = 2;
            ctx.strokeRect(10, 10, 55, 55);
            ctx.font = "10px sans-serif";
            ctx.fillStyle = "rgba(255,255,255,0.3)";
            ctx.fillText("极简", 28, 41);
          }
        }, 50);
      });
      optionsBox.appendChild(visualContainer);
    } else {
      // Standard quiz options
      q.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "quiz-option-btn";
        btn.textContent = opt.text;
        btn.onclick = () => {
          state.userProfile.quizAnswers.push(opt.type);
          currentQuestionIndex++;
          showQuestion();
        };
        optionsBox.appendChild(btn);
      });
    }
  }
}

function skipQuiz() {
  analyzeAnswers();
  switchView("onboarding");
}

function analyzeAnswers() {
  const ans = state.userProfile.quizAnswers;
  
  let E_I = ans.includes("E") ? "E" : "I";
  let S_N = ans.includes("S") ? "S" : "N";
  let T_F = ans.includes("T") ? "T" : "F";
  let J_P = ans.includes("J") ? "J" : "P";
  
  let problem = "A"; // Default addiction
  if (ans.includes("D")) problem = "D";
  else if (ans.includes("V")) problem = "V";

  state.userProfile.mbti = `${E_I}${S_N}${T_F}${J_P}-${problem}`;
  
  // Set showPet option based on Visual toggle answer
  state.userProfile.showPet = !ans.includes("O");
}

// --- 7. SVG 植物干花渐变色环与 HSL 滑轨无极微调 (Color Wreath) ---
const LEAF_PATHS = [
  "M 0,0 C 14,-8 22,-18 22,-32 C 22,-48 12,-58 0,-62 C -12,-58 -22,-48 -22,-32 C -22,-18 -14,-8 0,0",
  "M 0,0 C 12,-10 20,-20 20,-34 C 20,-46 10,-56 0,-62 C -10,-56 -20,-46 -20,-34 C -20,-20 -12,-10 0,0",
  "M 0,0 C 8,-12 14,-22 14,-34 C 14,-46 8,-54 0,-64 C -8,-54 -14,-46 -14,-34 C -14,-22 -8,-12 0,0",
  "M 0,0 C 7,-10 12,-20 12,-32 C 12,-44 7,-52 0,-60 C -7,-52 -12,-44 -12,-32 C -12,-20 -7,-10 0,0",
  "M 0,0 C 4,-6 10,-12 6,-18 C 12,-24 16,-34 10,-38 C 12,-44 6,-54 0,-64 C -6,-54 -12,-44 -10,-38 C -16,-34 -12,-24 -6,-18 C -10,-12 -4,-6 0,0",
  "M 0,0 C 3,-5 8,-10 5,-15 C 10,-20 13,-28 8,-32 C 10,-37 5,-45 0,-55 C -5,-45 -10,-37 -8,-32 C -13,-28 -10,-20 -5,-15 C -8,-10 -3,-5 0,0",
  "M 0,0 C 15,-5 20,-15 20,-28 C 20,-42 12,-52 0,-56 C -12,-52 -20,-42 -20,-28 C -20,-15 -15,-5 0,0",
  "M 0,0 C 13,-4 18,-13 18,-25 C 18,-38 11,-48 0,-52 C -11,-48 -18,-38 -18,-25 C -18,-13 -13,-4 0,0",
  "M 0,0 C 10,-6 16,-14 12,-22 C 22,-24 24,-34 14,-40 C 16,-48 8,-56 0,-64 C -8,-56 -16,-48 -14,-40 C -24,-34 -22,-24 -12,-22 C -16,-14 -10,-6 0,0",
  "M 0,0 C 8,-5 13,-11 10,-18 C 18,-20 20,-28 12,-33 C 13,-40 7,-47 0,-54 C -7,-47 -13,-40 -12,-33 C -20,-28 -18,-20 -10,-18 C -13,-11 -8,-5 0,0",
  "M 0,0 C 18,-6 20,-24 10,-38 C 14,-48 8,-58 0,-64 C -8,-58 -14,-48 -10,-38 C -20,-24 -18,-6 0,0",
  "M 0,0 C 16,-5 18,-22 9,-34 C 12,-44 7,-53 0,-58 C -7,-53 -12,-44 -9,-34 C -18,-22 -16,-5 0,0"
];

function renderColorWreath() {
  const wreath = document.getElementById("color-wreath");
  if (!wreath) return;

  const defs = wreath.querySelector("defs") || document.createElementNS("http://www.w3.org/2000/svg", "defs");
  if (!wreath.querySelector("defs")) wreath.appendChild(defs);
  defs.innerHTML = "";

  const oldLeaves = wreath.querySelectorAll(".leaf-node");
  oldLeaves.forEach(el => el.remove());

  const radius = 88;
  
  for (let i = 0; i < 12; i++) {
    const angle = i * 30;
    const angleRad = (angle - 90) * Math.PI / 180;
    const dx = Math.cos(angleRad) * 8;
    const dy = Math.sin(angleRad) * 8;

    // Define LinearGradients dynamically to add realistic plant leaf textures
    const gradId = `leaf-grad-${i}`;
    const grad = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    grad.setAttribute("id", gradId);
    grad.setAttribute("x1", "0%");
    grad.setAttribute("y1", "100%");
    grad.setAttribute("x2", "0%");
    grad.setAttribute("y2", "0%");
    
    // Dynamic stop nodes for gradient leaves
    const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", `hsl(${angle}, 55%, 35%)`);
    
    const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop2.setAttribute("offset", "100%");
    stop2.setAttribute("stop-color", `hsl(${angle}, 75%, 60%)`);
    
    grad.appendChild(stop1);
    grad.appendChild(stop2);
    defs.appendChild(grad);
    
    const leafColor = `url(#${gradId})`;
    const leafGlow = `hsla(${angle}, 65%, 55%, 0.65)`;
    const leafColorBorder = `hsla(${angle}, 65%, 55%, 0.25)`;

    const leafGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    leafGroup.setAttribute("class", `leaf-node ${state.userProfile.calmingColor.h === angle ? "active" : ""}`);
    leafGroup.setAttribute("style", `--hover-dx: ${dx}px; --hover-dy: ${dy}px; --rotate-deg: ${angle}deg; --leaf-color: ${leafColor}; --leaf-color-border: ${leafColorBorder}; --leaf-glow: ${leafGlow}; transform: translate(${Math.cos(angleRad)*radius}px, ${Math.sin(angleRad)*radius}px) rotate(${angle}deg);`);
    leafGroup.dataset.hue = angle;
    leafGroup.dataset.idx = i;

    const pathD = LEAF_PATHS[i];

    // Leaf outline
    const outerPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    outerPath.setAttribute("d", pathD);
    outerPath.setAttribute("class", "leaf-path-outer");
    
    // Inner leaf core
    const innerPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    innerPath.setAttribute("d", pathD);
    innerPath.setAttribute("class", "leaf-path-inner");
    innerPath.setAttribute("transform", "scale(0.82)");
    innerPath.setAttribute("fill", leafColor);

    // Multi-vein detailed layout (加入更多的纹路)
    const veinG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    
    // Main central vein
    const mainVein = document.createElementNS("http://www.w3.org/2000/svg", "line");
    mainVein.setAttribute("x1", "0");
    mainVein.setAttribute("y1", "-2");
    mainVein.setAttribute("x2", "0");
    mainVein.setAttribute("y2", "-50");
    mainVein.setAttribute("class", "leaf-vein");
    veinG.appendChild(mainVein);

    // Secondary side veins (left & right detailed plant structures)
    for (let v = 1; v <= 3; v++) {
      const yPos = -12 * v;
      const leftVein = document.createElementNS("http://www.w3.org/2000/svg", "line");
      leftVein.setAttribute("x1", "0");
      leftVein.setAttribute("y1", yPos);
      leftVein.setAttribute("x2", "-8");
      leftVein.setAttribute("y2", yPos - 6);
      leftVein.setAttribute("class", "leaf-vein");
      leftVein.setAttribute("opacity", "0.4");
      
      const rightVein = document.createElementNS("http://www.w3.org/2000/svg", "line");
      rightVein.setAttribute("x1", "0");
      rightVein.setAttribute("y1", yPos);
      rightVein.setAttribute("x2", "8");
      rightVein.setAttribute("y2", yPos - 6);
      rightVein.setAttribute("class", "leaf-vein");
      rightVein.setAttribute("opacity", "0.4");

      veinG.appendChild(leftVein);
      veinG.appendChild(rightVein);
    }

    leafGroup.appendChild(outerPath);
    leafGroup.appendChild(innerPath);
    leafGroup.appendChild(veinG);

    // Click triggers slider popover in center of wreath
    leafGroup.addEventListener("click", (e) => {
      e.stopPropagation();
      const activeLeaves = wreath.querySelectorAll(".leaf-node");
      activeLeaves.forEach(node => node.classList.remove("active"));
      leafGroup.classList.add("active");
      
      state.userProfile.calmingColor.h = angle;
      applyThemeColor(angle, state.userProfile.calmingColor.s, state.userProfile.calmingColor.l);
      
      openWreathSlider(angle);
    });

    wreath.appendChild(leafGroup);
  }
}

// Center HSL無极调节滑轨弹窗 controls
function openWreathSlider(hue) {
  const overlay = document.getElementById("wreath-slider-overlay");
  const satSlider = document.getElementById("wreath-slider-sat");
  const lightSlider = document.getElementById("wreath-slider-light");
  
  if (!overlay || !satSlider || !lightSlider) return;
  
  // Set starting values from user profile
  satSlider.value = state.userProfile.calmingColor.s || 65;
  lightSlider.value = state.userProfile.calmingColor.l || 55;
  
  // Display center popover
  overlay.style.display = "flex";
  
  // Helper to update active SVG leaf definitions live
  const updateActiveLeaf = () => {
    const activeNode = document.querySelector(".leaf-node.active");
    if (activeNode) {
      const activeIdx = parseInt(activeNode.dataset.idx, 10); // 稳定索引，不再依赖 DOM 子节点位置
      const gradId = `leaf-grad-${activeIdx}`;
      const grad = document.getElementById(gradId);
      if (grad) {
        const h = state.userProfile.calmingColor.h;
        const s = state.userProfile.calmingColor.s;
        const l = state.userProfile.calmingColor.l;
        grad.children[0].setAttribute("stop-color", `hsl(${h}, ${s}%, ${Math.max(15, l - 20)}%)`);
        grad.children[1].setAttribute("stop-color", `hsl(${h}, ${s}%, ${Math.min(95, l + 10)}%)`);
      }
    }
  };
  
  // Handle Saturation slider inputs
  satSlider.oninput = () => {
    state.userProfile.calmingColor.s = parseInt(satSlider.value, 10);
    applyThemeColor(state.userProfile.calmingColor.h, state.userProfile.calmingColor.s, state.userProfile.calmingColor.l);
    updateActiveLeaf();
  };
  
  // Handle Lightness slider inputs
  lightSlider.oninput = () => {
    state.userProfile.calmingColor.l = parseInt(lightSlider.value, 10);
    applyThemeColor(state.userProfile.calmingColor.h, state.userProfile.calmingColor.s, state.userProfile.calmingColor.l);
    updateActiveLeaf();
  };
}

function closeWreathSlider() {
  const overlay = document.getElementById("wreath-slider-overlay");
  if (overlay) overlay.style.display = "none";
}

function completeOnboarding() {
  const motivationInput = document.getElementById("input-motivation").value.trim();
  const customQuoteInput = document.getElementById("input-custom-quote").value.trim();
  const apiKeyInput = document.getElementById("input-api-key").value.trim();
  
  state.userProfile.motivation = motivationInput || "逃离算法洪流，自律重生。";
  state.userProfile.customQuote = customQuoteInput || "";
  state.userProfile.apiKey = apiKeyInput || "";
  
  // Save pet style option
  const selectedStyleEl = document.querySelector('input[name="pet-style-option"]:checked');
  state.userProfile.petStyle = selectedStyleEl ? selectedStyleEl.value : "B";
  
  // Write and auto-generate smart MBTI warning templates
  generateSmartMBTIQuote();
  
  saveProfile();
  localStorage.setItem(`tryrevive_active_user`, state.currentUser);
  
  closeWreathSlider();
  switchView("home");
}

// 自动匹配人格特质与梦想警醒语话术
function generateSmartMBTIQuote() {
  const mbti = state.userProfile.mbti;
  let traitKey = "FP"; // fallback
  if (mbti.includes("TJ")) traitKey = "TJ";
  else if (mbti.includes("FJ")) traitKey = "FJ";
  else if (mbti.includes("TP")) traitKey = "TP";
  
  const painKey = mbti.split("-")[1] || "A"; // Addiction/Delay/Vexation
  const list = MBTI_COACH_TEMPLATES[traitKey][painKey];
  
  // Select randomized template variant (概率随机展示)
  const index = Math.floor(Math.random() * list.length);
  const rawQuote = list[index];
  
  // Compile variables inside templates
  state.userProfile.motivation = state.userProfile.motivation || "专注当下，掌控自我";
  
  // Save pre-computed quote back to user profile
  state.userProfile.computedQuote = rawQuote;
}

// --- 8. Crayon Chibi Desk Pet Canvas (Head-Body 1:1.2, Sausage Body, No Eyes, Chalk Blur) ---
function initAvatarCanvas(canvasId, stateAnimKey) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  
  const resize = () => {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  };
  resize();

  let frame = 0;
  let lastDraw = 0;
  const FRAME_MS = 1000 / 30; // 桌宠是缓慢动效，30fps 足够，省一半绘制开销
  const tears = [];
  const sparkles = [];

  function drawChubbyAvatar(x, y, scale, stateName, actionName, frameCount) {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Chalk blur filter (粉粉的粉笔模糊质感)
    ctx.filter = "blur(1.4px) contrast(1.15)";

    let speed = 0.12;
    if (stateName === "black") speed = 0.05;
    else if (stateName === "white") speed = 0.18;
    
    const cycle = frameCount * speed;
    let headX = x;
    let headY = y - 10;
    
    const headRadius = 24; 
    let bodyOffsetY = 0;
    let headAngle = 0;

    let headColor = "#ffffff";
    let bodyStrokeColor = "rgba(244, 214, 214, 0.95)";
    
    // Choose colors based on state
    if (stateName === "black") {
      headColor = "#22242b"; // dirty dark gray/black
      bodyStrokeColor = "rgba(110, 95, 95, 0.95)"; // dirty dark pinkish-gray
    } else if (stateName === "white") {
      headColor = "#ffffff"; // pure clean white
      bodyStrokeColor = "rgba(255, 215, 215, 0.98)"; // clean pink
    } else {
      // gray state
      headColor = "#f3f4f6"; // warm off-white
      bodyStrokeColor = "rgba(244, 214, 214, 0.95)"; // soft pastel pink
    }

    // Time-harmonic wiggling jitter function to simulate organic hand-drawn sketch lines (boiling line effect)
    const j = (val, maxOffset = 0.8) => {
      return val + Math.sin(frameCount * 0.35 + val * 0.1) * maxOffset;
    };

    // Calculate torso and limbs paths based on actions
    let torsoCoords = [];
    let leftArmCoords = [];
    let rightArmCoords = [];
    let leftLegCoords = [];
    let rightLegCoords = [];

    // Let's implement organic poses from the crayon sketch
    if (stateName === "black") {
      if (actionName === "cry") {
        // Crying sitting pose: torso bent down, head low, limbs curled in
        bodyOffsetY = Math.sin(cycle * 0.5) * 1.0;
        headY += 12 + bodyOffsetY;
        headAngle = 0.15;

        // Torso: short vertical line
        torsoCoords = [[x, headY + headRadius - 4], [x, y + 15]];
        // Arms touching head
        leftArmCoords = [[x - 8, y + 6], [headX - 12, headY + 8]];
        rightArmCoords = [[x + 8, y + 6], [headX + 12, headY + 8]];
        // Legs curled on the ground
        leftLegCoords = [[x - 6, y + 14], [x - 18, y + 20], [x - 12, y + 24]];
        rightLegCoords = [[x + 6, y + 14], [x + 18, y + 20], [x + 12, y + 24]];

        if (Math.random() < 0.12) {
          tears.push({ x: headX - 8, y: headY + 4, vy: 1.5, alpha: 1.0 });
          tears.push({ x: headX + 8, y: headY + 4, vy: 1.5, alpha: 1.0 });
        }
      } else {
        // Slow drag/crawl pose: low torso, legs and arms spread low
        bodyOffsetY = Math.sin(cycle) * 1.5;
        headX += 8;
        headY += 18 + bodyOffsetY;
        headAngle = -0.2;

        torsoCoords = [[x - 10, y + 15], [x + 8, y + 15]];
        leftArmCoords = [[x - 8, y + 15], [x - 22, y + 25 + Math.sin(cycle) * 4]];
        rightArmCoords = [[x + 8, y + 15], [x + 20, y + 25 - Math.sin(cycle) * 4]];
        leftLegCoords = [[x - 12, y + 15], [x - 26, y + 28 + Math.cos(cycle) * 4]];
        rightLegCoords = [[x - 2, y + 15], [x - 14, y + 28 - Math.cos(cycle) * 4]];
      }
    } else if (stateName === "white") {
      if (actionName === "jump") {
        // Jumping pose: torso high, arms raised, legs pointing down
        bodyOffsetY = -Math.abs(Math.sin(cycle * 0.8)) * 20;
        headY += bodyOffsetY;
        headAngle = Math.sin(cycle) * 0.05;

        torsoCoords = [[x, headY + headRadius - 2], [x, y + bodyOffsetY + 18]];
        leftArmCoords = [[x, y + bodyOffsetY + 4], [x - 24, y + bodyOffsetY - 12]];
        rightArmCoords = [[x, y + bodyOffsetY + 4], [x + 24, y + bodyOffsetY - 12]];
        leftLegCoords = [[x - 6, y + bodyOffsetY + 16], [x - 14, y + bodyOffsetY + 28]];
        rightLegCoords = [[x + 6, y + bodyOffsetY + 16], [x + 16, y + bodyOffsetY + 28]];
      } else {
        // Waving and dancing
        bodyOffsetY = Math.sin(cycle * 2.0) * 1.5;
        headY += bodyOffsetY;
        headAngle = Math.sin(cycle * 1.5) * 0.08;

        torsoCoords = [[x, headY + headRadius - 2], [x, y + bodyOffsetY + 18]];
        leftArmCoords = [[x, y + bodyOffsetY + 4], [x - 22, y + bodyOffsetY + Math.sin(cycle * 2.5) * 8]];
        rightArmCoords = [[x, y + bodyOffsetY + 4], [x + 22, y + bodyOffsetY - 10 + Math.sin(cycle * 3) * 8]];
        leftLegCoords = [[x - 6, y + bodyOffsetY + 16], [x - 12 + Math.sin(cycle) * 4, y + bodyOffsetY + 32]];
        rightLegCoords = [[x + 6, y + bodyOffsetY + 16], [x + 12 - Math.sin(cycle) * 4, y + bodyOffsetY + 32]];
      }
    } else {
      // GRAY (Normal Healing state / Default hand-drawn sketch)
      if (actionName === "think") {
        // Sitting and thinking
        bodyOffsetY = Math.sin(cycle * 0.6) * 1.2;
        headY += 8 + bodyOffsetY;
        headAngle = 0.1 + Math.sin(cycle * 0.5) * 0.08;

        torsoCoords = [[x, headY + headRadius - 2], [x, y + 16]];
        leftArmCoords = [[x, y + 6], [x - 18, y + 12 + Math.sin(cycle) * 3]];
        rightArmCoords = [[x, y + 6], [x + 18, y + 6 - Math.sin(cycle) * 3]];
        leftLegCoords = [[x - 6, y + 15], [x - 20, y + 20]];
        rightLegCoords = [[x + 6, y + 15], [x + 20, y + 20]];
      } else {
        // WALKING STATE: MUST MATCH USER'S SKETCH EXACTLY
        // Left arm pointing left-down, right arm pointing right-down.
        // Left leg bent/stepping, right leg straight down.
        bodyOffsetY = Math.sin(cycle * 2.0) * 1.5;
        headY += bodyOffsetY;
        headAngle = Math.sin(cycle) * 0.04;

        torsoCoords = [[x, headY + headRadius - 2], [x, y + bodyOffsetY + 18]];
        
        // Arms point left-down and right-down
        leftArmCoords = [[x, y + bodyOffsetY + 4], [x - 20, y + bodyOffsetY + 14 + Math.sin(cycle)*3]];
        rightArmCoords = [[x, y + bodyOffsetY + 4], [x + 20, y + bodyOffsetY + 14 - Math.sin(cycle)*3]];
        
        // Walking legs: one bent/stepping forward-down, one straight/trailing
        const walkPhase = Math.sin(cycle);
        if (walkPhase > 0) {
          // Left leg straight, right leg bent
          leftLegCoords = [[x - 5, y + bodyOffsetY + 17], [x - 10, y + bodyOffsetY + 32]];
          rightLegCoords = [[x + 5, y + bodyOffsetY + 17], [x + 16, y + bodyOffsetY + 24], [x + 12, y + 33]];
        } else {
          // Left leg bent, right leg straight
          leftLegCoords = [[x - 5, y + bodyOffsetY + 17], [x - 16, y + bodyOffsetY + 24], [x - 12, y + 33]];
          rightLegCoords = [[x + 5, y + bodyOffsetY + 17], [x + 10, y + bodyOffsetY + 32]];
        }
      }
    }

    // DRAW CHALK/CRAYON WHITE HEAD (Fuzzy granular texture)
    const drawChalkHead = (cx, cy, r) => {
      ctx.save();
      // Draw solid base core slightly smaller
      ctx.fillStyle = headColor;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.82, 0, Math.PI * 2);
      ctx.fill();

      // Scatter loop for chalk particles
      const dotCount = 72;
      for (let i = 0; i < dotCount; i++) {
        // Gaussian/Uniform distribution around the circle radius
        const angle = Math.random() * Math.PI * 2;
        const dist = r * (0.8 + Math.random() * 0.26); // fuzzy perimeter
        const dotX = cx + Math.cos(angle) * dist;
        const dotY = cy + Math.sin(angle) * dist;
        const dotR = 0.5 + Math.random() * 1.3;
        
        ctx.fillStyle = headColor;
        ctx.beginPath();
        ctx.arc(j(dotX, 0.4), j(dotY, 0.4), dotR, 0, Math.PI * 2);
        ctx.fill();
      }

      // Layered interior cross-hatch scribbles
      ctx.strokeStyle = headColor;
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 4; i++) {
        const offsetAngle = Math.random() * Math.PI * 2;
        const startDist = Math.random() * r * 0.7;
        const endDist = Math.random() * r * 0.7;
        
        ctx.beginPath();
        ctx.moveTo(
          j(cx + Math.cos(offsetAngle) * startDist),
          j(cy + Math.sin(offsetAngle) * startDist)
        );
        ctx.lineTo(
          j(cx - Math.cos(offsetAngle) * endDist),
          j(cy - Math.sin(offsetAngle) * endDist)
        );
        ctx.stroke();
      }

      ctx.restore();
    };

    drawChalkHead(headX, headY, headRadius);

    // Option B: blushing cheeks & sprout leaves
    const isOptionB = (state.userProfile.petStyle === "B");
    if (isOptionB && stateName !== "black") {
      ctx.fillStyle = "rgba(244, 63, 94, 0.25)"; // soft pink blush
      ctx.beginPath();
      ctx.ellipse(j(headX - 11), j(headY + 3), j(4, 0.2), j(2.5, 0.2), 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(j(headX + 11), j(headY + 3), j(4, 0.2), j(2.5, 0.2), 0, 0, Math.PI * 2);
      ctx.fill();
    }

    if (stateName === "white" || (isOptionB && stateName === "gray")) {
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 3.5;
      const sproutX = headX;
      const sproutY = headY - headRadius;
      
      ctx.beginPath();
      ctx.moveTo(j(sproutX), j(sproutY));
      ctx.quadraticCurveTo(j(sproutX), j(sproutY - 8), j(sproutX + Math.sin(cycle)*3), j(sproutY - 12));
      ctx.stroke();
      
      ctx.fillStyle = "#34d399";
      ctx.beginPath();
      ctx.ellipse(j(sproutX - 4 + Math.sin(cycle)*3), j(sproutY - 12), j(4, 0.2), j(2, 0.2), -Math.PI/6, 0, Math.PI * 2);
      ctx.ellipse(j(sproutX + 4 + Math.sin(cycle)*3), j(sproutY - 12), j(4, 0.2), j(2, 0.2), Math.PI/6, 0, Math.PI * 2);
      ctx.fill();
    }

    // DRAW WATER-COLOR PASTEL PINK BODY AND LIMBS (Scribble texture)
    const drawCrayonStroke = (coords, thickness) => {
      if (coords.length < 2) return;
      
      ctx.save();
      ctx.strokeStyle = bodyStrokeColor;
      
      // Draw 3 layers of slightly offset lines to simulate thick textured brush strokes
      for (let layer = 0; layer < 3; layer++) {
        ctx.lineWidth = thickness - layer * 1.5;
        ctx.globalAlpha = 0.85 - layer * 0.15;
        
        ctx.beginPath();
        const dx = (Math.random() - 0.5) * 1.2;
        const dy = (Math.random() - 0.5) * 1.2;
        
        ctx.moveTo(j(coords[0][0] + dx), j(coords[0][1] + dy));
        for (let i = 1; i < coords.length; i++) {
          ctx.lineTo(j(coords[i][0] + dx), j(coords[i][1] + dy));
        }
        ctx.stroke();
      }
      ctx.restore();
    };

    // Draw torso (thickness: 13px)
    drawCrayonStroke(torsoCoords, 13);
    // Draw arms (thickness: 11px)
    drawCrayonStroke(leftArmCoords, 11);
    drawCrayonStroke(rightArmCoords, 11);
    // Draw legs (thickness: 11px)
    drawCrayonStroke(leftLegCoords, 11);
    drawCrayonStroke(rightLegCoords, 11);

    // Floor shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
    ctx.beginPath();
    const shadowSize = stateName === "black" ? 42 : (stateName === "white" ? 28 : 34);
    ctx.ellipse(x, y + 42, shadowSize, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.filter = "none";
  }

  function animate(now) {
    if (state.activeView !== "home") return;
    if (canvasId === "avatar-canvas" && !state.userProfile.showPet) return;

    // 离开首页前持续调度；30fps 节流，跳过过密的帧
    state.canvasAnimIds[stateAnimKey] = requestAnimationFrame(animate);
    const t = now || 0;
    if (t - lastDraw < FRAME_MS) return;
    lastDraw = t;

    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    ctx.clearRect(0, 0, width, height);

    drawChubbyAvatar(width / 2, height / 2 - 10, 1, state.avatarState, state.avatarAction, frame);

    // Render tears (black state)
    if (state.avatarState === "black") {
      ctx.fillStyle = "#60a5fa";
      for (let i = tears.length - 1; i >= 0; i--) {
        const tear = tears[i];
        tear.y += tear.vy;
        tear.alpha -= 0.02;
        ctx.globalAlpha = Math.max(0, tear.alpha);
        ctx.beginPath();
        ctx.arc(tear.x, tear.y, 2, 0, Math.PI * 2);
        ctx.fill();
        if (tear.alpha <= 0) tears.splice(i, 1);
      }
      ctx.globalAlpha = 1.0;
    }

    // Render sparkles (white state)
    if (state.avatarState === "white" && !PREFERS_REDUCED_MOTION && Math.random() < 0.16) {
      const centerX = width / 2;
      const centerY = height / 2;
      sparkles.push({
        x: centerX + (Math.random() - 0.5) * 80,
        y: centerY + (Math.random() - 0.5) * 80,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -0.6 - Math.random() * 1.0,
        size: 1.5 + Math.random() * 2,
        life: 1.0
      });
    }

    if (state.avatarState === "white") {
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const sp = sparkles[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.life -= 0.025;
        ctx.fillStyle = `rgba(255, 255, 255, ${sp.life})`;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fill();
        if (sp.life <= 0) sparkles.splice(i, 1);
      }
    }

    frame++;
  }

  requestAnimationFrame(animate);
}

function initActionCycle() {
  if (state.actionSwitchInterval) clearInterval(state.actionSwitchInterval);

  state.actionSwitchInterval = setInterval(() => {
    if (state.avatarState === "black") {
      state.avatarAction = state.avatarAction === "cry" ? "crawl" : "cry";
    } else if (state.avatarState === "white") {
      state.avatarAction = state.avatarAction === "jump" ? "wave" : "jump";
    } else {
      state.avatarAction = state.avatarAction === "walk" ? "think" : "walk";
    }
  }, 8000);
}

// --- 8a. Creative Sprouting Plant Interaction on Narrative View ---
class SproutStem {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.currentLen = 0;
    this.targetLen = 22 + Math.random() * 38;
    this.ctrlX = (Math.random() - 0.5) * 30;
    this.ctrlY = -12 - Math.random() * 16;
    this.endX = (Math.random() - 0.5) * 45;
    this.endY = -28 - Math.random() * 24;
    this.leafSize = 4 + Math.random() * 5;
    this.state = 'growing'; // 'growing', 'swaying'
    this.flowerSpawned = Math.random() > 0.65;
    this.opacity = 1.0;
    this.age = 0;
    this.maxAge = 450 + Math.random() * 350; // Lives for ~8-12 seconds
  }
  
  update() {
    this.age++;
    if (this.state === 'growing') {
      this.currentLen += 1.4;
      if (this.currentLen >= this.targetLen) {
        this.state = 'swaying';
      }
    }
    if (this.age > this.maxAge) {
      this.opacity -= 0.015;
    }
  }
  
  draw(ctx, windAngle, windForce) {
    if (this.opacity <= 0) return;
    
    let ratio = this.state === 'growing' ? (this.currentLen / this.targetLen) : 1.0;
    let sx = this.endX;
    let sy = this.endY;
    if (this.state === 'swaying') {
      sx += Math.cos(windAngle) * windForce * 3.5;
    }
    
    ctx.save();
    ctx.globalAlpha = this.opacity;
    
    // Draw stem curves using Bezier
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(74, 187, 124, 0.6)';
    ctx.lineWidth = 1.35;
    ctx.lineCap = 'round';
    
    let cx = this.x + this.ctrlX * ratio;
    let cy = this.y + this.ctrlY * ratio;
    let ex = this.x + sx * ratio;
    let ey = this.y + sy * ratio;
    
    ctx.moveTo(this.x, this.y);
    ctx.quadraticCurveTo(cx, cy, ex, ey);
    ctx.stroke();
    
    // Draw Leaf at the tip
    if (ratio >= 1.0) {
      ctx.save();
      ctx.translate(this.x + sx, this.y + ey);
      
      let leafRot = Math.sin(Date.now() * 0.0025 + this.x) * 0.15;
      ctx.rotate(leafRot);
      
      ctx.fillStyle = 'rgba(34, 197, 94, 0.85)';
      ctx.beginPath();
      ctx.ellipse(0, 0, this.leafSize * 1.35, this.leafSize * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
      
      if (this.flowerSpawned) {
        ctx.fillStyle = '#FBBF24'; // Golden flower
        ctx.beginPath();
        ctx.arc(0, -this.leafSize * 0.4, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    
    ctx.restore();
  }
}

let sproutStems = [];
let sproutMouseBind = false;

function initNarrativeSproutCanvas() {
  const canvas = document.getElementById("narrative-sprout-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  sproutStems = [];
  
  const resizeCanvas = () => {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  };
  resizeCanvas();
  registerResize("sprout", resizeCanvas);

  const container = document.getElementById("view-narrative");
  if (container && !sproutMouseBind) {
    sproutMouseBind = true;
    container.addEventListener("mousemove", (e) => {
      if (state.activeView !== "narrative") return;
      
      // Check if mouse is hovering over a narrative paragraph
      const target = e.target;
      if (target && target.classList.contains("narrative-line")) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Prevent spawning too many overlapping stems
        if (Math.random() < 0.22) {
          let tooCluttered = false;
          sproutStems.forEach(s => {
            if (Math.sqrt((s.x - mouseX)**2 + (s.y - mouseY)**2) < 12) {
              tooCluttered = true;
            }
          });
          
          if (!tooCluttered && sproutStems.length < 120) {
            sproutStems.push(new SproutStem(mouseX, mouseY));
          }
        }
      }
    });
  }

  function animate() {
    if (state.activeView !== "narrative") return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let windAngle = Date.now() * 0.0025;
    let windForce = 0.6 + Math.sin(Date.now() * 0.001) * 0.3;
    
    // Update and draw stems
    for (let i = sproutStems.length - 1; i >= 0; i--) {
      const stem = sproutStems[i];
      stem.update();
      stem.draw(ctx, windAngle, windForce);
      if (stem.opacity <= 0) {
        sproutStems.splice(i, 1);
      }
    }
    
    state.canvasAnimIds.sprout = requestAnimationFrame(animate);
  }
  
  animate();
}

// --- 9. Canvas Galaxy Meditation Background Animation with Seed Core ---
function initGalaxyCanvas() {
  const canvas = document.getElementById("galaxy-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  
  const resizeCanvas = () => {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  };
  resizeCanvas();

  const starCount = 65;
  const stars = [];
  const meteors = [];
  
  const calmingH = state.userProfile.calmingColor.h;
  const calmingS = state.userProfile.calmingColor.s;
  
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random(),
      y: Math.random(),
      size: 0.6 + Math.random() * 1.5,
      pulseSpeed: 0.01 + Math.random() * 0.03,
      phase: Math.random() * Math.PI * 2,
      hOffset: (Math.random() - 0.5) * 30
    });
  }

  function spawnMeteor() {
    meteors.push({
      x: -0.1 + Math.random() * 0.6,
      y: -0.1 + Math.random() * 0.4,
      length: 80 + Math.random() * 120,
      angle: Math.PI / 6 + (Math.random() - 0.5) * 0.05,
      speed: 3 + Math.random() * 4,
      opacity: 0.7 + Math.random() * 0.3,
      width: 1.2 + Math.random() * 1.5
    });
  }

  let globalTime = 0;
  let currentBreathScale = 1.0;

  function animate() {
    if (state.activeView !== "meditation") return;

    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    globalTime += 0.012;

    const gradient = ctx.createRadialGradient(
      width / 2, height / 2, 10,
      width / 2, height / 2, Math.max(width, height) * 0.8
    );
    
    const progress = 1.0 - (state.timeLeft / state.meditationTotalTime);
    
    const baseH = calmingH;
    const baseS = Math.round(calmingS * (0.15 + 0.35 * progress));
    const baseL = Math.round(3 + 5 * progress);
    
    const bgStart = `hsl(${baseH}, ${baseS}%, ${baseL}%)`;
    const bgMid = `hsl(${(baseH + 15) % 360}, ${baseS * 0.8}%, ${baseL - 1}%)`;
    const bgEnd = `hsl(${(baseH + 40) % 360}, ${baseS * 0.5}%, 1%)`;
    
    gradient.addColorStop(0, bgStart);
    gradient.addColorStop(0.5, bgMid);
    gradient.addColorStop(1, bgEnd);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // ----------------------------------------------------
    // Draw the Organic Breathing "Seed Core" membranes in the center
    // Pulsate target matches the current breathing phase scale
    let targetScale = 1.0;
    if (breathPhase === "inhale" || breathPhase === "holdIn") {
      targetScale = 1.48;
    } else {
      targetScale = 0.88;
    }
    // Smooth ease out interpolation
    currentBreathScale += (targetScale - currentBreathScale) * 0.038;

    const centerX = width / 2;
    const centerY = height / 2;
    // Base radius of the core
    let baseR = 64 * currentBreathScale;
    let layersCount = 3;

    for (let l = 0; l < layersCount; l++) {
      let alpha = 0.075 - l * 0.022;
      let scaleFactor = 1.0 + l * 0.28;
      let rad = baseR * scaleFactor;
      
      ctx.fillStyle = `hsla(${calmingH}, ${calmingS}%, ${state.userProfile.calmingColor.l}%, ${alpha})`;
      ctx.beginPath();
      
      const steps = 72;
      for (let sIdx = 0; sIdx <= steps; sIdx++) {
        let angle = (sIdx / steps) * Math.PI * 2;
        // Deterministic pseudo-noise for smooth organic undulating shape
        let wave = Math.sin(angle * 3 + globalTime * 1.3) * 0.12
                 + Math.cos(angle * 5 - globalTime * 0.7) * 0.06
                 + Math.sin(angle * 7 + globalTime * 2.1) * 0.03;
        let r = rad * (1.0 + wave);
        let px = centerX + r * Math.cos(angle);
        let py = centerY + r * Math.sin(angle);
        if (sIdx === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
      ctx.fill();
    }
    // ----------------------------------------------------

    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      star.phase += star.pulseSpeed * (1.0 + progress * 0.5);
      const alpha = (0.2 + 0.2 * progress) + (Math.sin(star.phase) + 1) * (0.25 + 0.15 * progress);
      
      const starH = baseH + star.hOffset;
      ctx.fillStyle = `hsla(${starH}, ${calmingS}%, 90%, ${alpha})`;
      ctx.beginPath();
      ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!PREFERS_REDUCED_MOTION && Math.random() < 0.006 + progress * 0.006 && meteors.length < 3) {
      spawnMeteor();
    }

    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      const dx = Math.cos(m.angle) * m.speed;
      const dy = Math.sin(m.angle) * m.speed;
      m.x += dx / width;
      m.y += dy / height;
      m.opacity -= 0.005;

      const screenX = m.x * width;
      const screenY = m.y * height;
      const tailX = screenX - Math.cos(m.angle) * m.length;
      const tailY = screenY - Math.sin(m.angle) * m.length;
      
      const mGradient = ctx.createLinearGradient(screenX, screenY, tailX, tailY);
      mGradient.addColorStop(0, `rgba(255, 255, 255, ${m.opacity})`);
      mGradient.addColorStop(0.3, `hsla(${baseH}, ${calmingS}%, 75%, ${m.opacity * 0.7})`);
      mGradient.addColorStop(1, `hsla(${(baseH + 30) % 360}, ${calmingS}%, 45%, 0)`);
      
      ctx.strokeStyle = mGradient;
      ctx.lineWidth = m.width;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(screenX, screenY);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();

      if (m.opacity <= 0 || m.x > 1.2 || m.y > 1.2) {
        meteors.splice(i, 1);
      }
    }

    state.canvasAnimIds.galaxy = requestAnimationFrame(animate);
  }

  animate();
}

// --- 10. Canvas Irregular Watercolor Cloud Bubble Animation (不规则云雾气泡) ---
const cloudBubbles = [];

function initCloudBubbleCanvas() {
  const canvas = document.getElementById("cloud-bubble-canvas");
  if (!canvas) return;
  
  const ctx = canvas.getContext("2d");
  
  const resize = () => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  };
  resize();
  registerResize("cloudBubble", resize);

  // Initialize cloud particles (3 clouds drifting)
  cloudBubbles.length = 0;
  for (let i = 0; i < 4; i++) {
    cloudBubbles.push({
      x: Math.random() * canvas.width,
      y: canvas.height + 50 + Math.random() * 100,
      vy: -0.4 - Math.random() * 0.5,
      baseRadius: 60 + Math.random() * 40,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 0.005 + Math.random() * 0.005,
      points: 8, // 8-point morphing polygon
      radiusOffsets: Array.from({ length: 8 }, () => (Math.random() - 0.5) * 15)
    });
  }
  
  // 预渲染一张柔光云朵精灵（含安抚色），每帧只 drawImage，省掉逐帧 blur(24px)
  const SPRITE_R = 160;
  const cloudSprite = document.createElement("canvas");
  cloudSprite.width = SPRITE_R * 2;
  cloudSprite.height = SPRITE_R * 2;
  (function buildCloudSprite() {
    const sctx = cloudSprite.getContext("2d");
    const h = state.userProfile.calmingColor.h;
    const s = state.userProfile.calmingColor.s || 65;
    const l = state.userProfile.calmingColor.l || 55;
    const grad = sctx.createRadialGradient(SPRITE_R, SPRITE_R, 5, SPRITE_R, SPRITE_R, SPRITE_R);
    grad.addColorStop(0, `hsla(${h}, ${Math.min(15, s * 0.2)}%, 98%, 0.24)`); // 蓬松云白核心
    grad.addColorStop(0.4, `hsla(${h}, ${s * 0.4}%, ${l}%, 0.08)`); // 安抚色光晕
    grad.addColorStop(1, "transparent");
    sctx.fillStyle = grad;
    sctx.beginPath();
    sctx.arc(SPRITE_R, SPRITE_R, SPRITE_R, 0, Math.PI * 2);
    sctx.fill();
  })();

  function drawCloud(c) {
    // 轻微呼吸脉动，保留缓动感
    const breathe = 1 + Math.sin(c.phase) * 0.04;
    const drawSize = c.baseRadius * 1.6 * 2 * breathe;
    ctx.drawImage(cloudSprite, c.x - drawSize / 2, c.y - drawSize / 2, drawSize, drawSize);
  }
  
  function animate() {
    if (state.activeView !== "meditation") return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    cloudBubbles.forEach(c => {
      c.y += c.vy;
      c.phase += c.phaseSpeed;
      
      // Loop back to bottom
      if (c.y < -150) {
        c.y = canvas.height + 150;
        c.x = Math.random() * canvas.width;
      }
      
      drawCloud(c);
    });
    
    state.canvasAnimIds.cloudBubble = requestAnimationFrame(animate);
  }
  
  animate();
}

// --- 11. Breathing Sanctuary Cycle Control ---
let breathPhase = "inhale";
let breathTimer = 0;
let breathInterval = null;

function runBreathingSanctuary() {
  const breathCircle = document.getElementById("breath-circle-inner");
  const breathingLabel = document.getElementById("breathing-label");
  if (!breathCircle || !breathingLabel) return;

  function updateBreathLoop() {
    if (state.activeView !== "meditation") return;

    if (breathPhase === "inhale") {
      breathCircle.style.transform = "scale(1.55)";
      breathingLabel.textContent = "吸气… 吸入宁静与专注";
      modulateWaves("inhale");
      breathTimer++;
      if (breathTimer >= 4) {
        breathPhase = "holdIn";
        breathTimer = 0;
      }
    } else if (breathPhase === "holdIn") {
      breathingLabel.textContent = "屏息… 锁定内心的平静";
      breathTimer++;
      if (breathTimer >= 4) {
        breathPhase = "exhale";
        breathTimer = 0;
      }
    } else if (breathPhase === "exhale") {
      breathCircle.style.transform = "scale(0.85)";
      breathingLabel.textContent = "呼气… 释放焦躁与拖延";
      modulateWaves("exhale");
      breathTimer++;
      if (breathTimer >= 4) {
        breathPhase = "holdOut";
        breathTimer = 0;
      }
    } else if (breathPhase === "holdOut") {
      breathingLabel.textContent = "屏息… 准备下一次呼吸";
      breathTimer++;
      if (breathTimer >= 4) {
        breathPhase = "inhale";
        breathTimer = 0;
      }
    }
  }

  breathPhase = "inhale";
  breathTimer = 0;
  if (breathInterval) clearInterval(breathInterval);
  breathInterval = setInterval(updateBreathLoop, 1000);
}

// --- 12. Fish-Bubble Thought Generator (Custom quote merge &消散节奏) ---
function triggerThoughtBubble() {
  if (state.activeView !== "meditation") return;

  const bubbleArea = document.getElementById("bubble-prompts-area");
  if (!bubbleArea) return;

  // 一次只浮现一句心语，留白更符合冥想；上一句尚未消散时跳过本次
  if (bubbleArea.children.length > 0) return;

  // Build merged pool (Auto-adapt templates + Custom heart quote)
  const pool = [...BUBBLE_TEXTS];
  if (state.userProfile.customQuote) {
    pool.push(state.userProfile.customQuote);
  }
  if (state.userProfile.motivation) {
    pool.push(`终极梦想规划：${state.userProfile.motivation}`);
  }

  const text = pool[Math.floor(Math.random() * pool.length)];
  const bubble = document.createElement("div");
  bubble.className = "thought-bubble";
  bubble.textContent = text;

  // 只取用户安抚色调出一层极淡的高光晕（不再有边框/底色方块）
  const h = state.userProfile.calmingColor.h;
  const s = Math.min(state.userProfile.calmingColor.s || 65, 60);
  bubble.style.setProperty("--bubble-glow", `hsla(${h}, ${s}%, 80%, 0.4)`);

  // 居中浮现，纵向随机错落，结束时带一点横向漂移
  bubble.style.top = `${22 + Math.random() * 52}%`;
  bubble.style.setProperty("--drift", `${(Math.random() - 0.5) * 40}px`);

  bubbleArea.appendChild(bubble);
  bubble.addEventListener("animationend", () => bubble.remove());
}

let bubbleInterval = null;
function startThoughtBubblesSpawner() {
  function spawn() {
    if (state.activeView !== "meditation") return;
    triggerThoughtBubble();
  }
  if (bubbleInterval) clearInterval(bubbleInterval);
  bubbleInterval = setInterval(spawn, 4000); // 每 4s 检查一次；因一次只允许一句，实际节奏由 12s 生命周期决定
}

// --- 13. Meditation Timer Controller ---
function startMeditationSession(durationSeconds) {
  const setupOverlay = document.getElementById("meditation-setup-overlay");
  const setupInput = document.getElementById("meditation-setup-quote");
  
  // Save custom heart quote updates instantly
  if (setupInput) {
    state.userProfile.customQuote = setupInput.value.trim();
    saveProfile();
  }
  
  if (setupOverlay) setupOverlay.style.display = "none";
  
  state.meditationActive = true;
  state.meditationTotalTime = durationSeconds;
  state.timeLeft = durationSeconds;
  
  updateTimerDisplay();
  
  setAvatarState("gray");
  
  state.timerInterval = setInterval(() => {
    state.timeLeft--;
    updateTimerDisplay();

    if (state.timeLeft <= 0) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
      showWakeupModal();
    }
  }, 1000);

  initGalaxyCanvas();
  initCloudBubbleCanvas();
  runBreathingSanctuary();
  startThoughtBubblesSpawner();
  startOceanWaves();
}

function updateTimerDisplay() {
  const timerEl = document.getElementById("meditation-timer");
  if (!timerEl) return;
  const minutes = Math.floor(state.timeLeft / 60);
  const seconds = state.timeLeft % 60;
  timerEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function showWakeupModal() {
  const modal = document.getElementById("wakeup-dialog");
  const motivationTextEl = document.getElementById("wakeup-motivation-text");
  
  if (motivationTextEl) {
    motivationTextEl.textContent = "🔍 AI 正在生成你的禅想自省心语...";
  }
  if (modal) modal.classList.add("active");
  stopOceanWaves();

  fetchAICoachFeedback("meditation_complete", (text) => {
    if (motivationTextEl) {
      motivationTextEl.textContent = text;
    }
  });
}

function closeWakeupModal() {
  const modal = document.getElementById("wakeup-dialog");
  if (modal) modal.classList.remove("active");
  switchView("home");
}

function exitMeditationCleanly() {
  if (state.timerInterval) clearInterval(state.timerInterval);
  if (breathInterval) clearInterval(breathInterval);
  if (bubbleInterval) clearInterval(bubbleInterval);
  stopOceanWaves();
  
  const setupOverlay = document.getElementById("meditation-setup-overlay");
  if (setupOverlay) setupOverlay.style.display = "none";
  
  switchView("home");
}

function askUserStatusDuringHealing() {
  const feeling = prompt("你现在感觉怎么样？输入数字:\n1. 依然浮躁\n2. 渐入佳境\n3. 豁然开朗");
  if (feeling === "1") {
    setAvatarState("black");
  } else if (feeling === "2") {
    setAvatarState("gray");
  } else if (feeling === "3") {
    setAvatarState("white");
  }
}

// --- 14. 0-1 Goal Coach Popup Controls ---
function applyGoalSuggestion(text) {
  const goalInput = document.getElementById("goal-first-step-input");
  if (goalInput) {
    goalInput.value = text;
    state.userProfile.firstStep = text;
    saveProfile();
  }
}

// --- 15. Narrative Easing Intro Control ---
const NARRATIVE_LINES = [
  "narrative-1", "narrative-2", "narrative-3",
  "narrative-4", "narrative-5", "narrative-6", "narrative-7"
];
let narrativeTimeout = null;

function runNarrativeIntro() {
  let lineIdx = 0;
  
  function showNextLine() {
    if (state.activeView !== "narrative") return;
    
    if (lineIdx >= NARRATIVE_LINES.length) {
      const footer = document.getElementById("narrative-footer");
      if (footer) footer.style.opacity = "1";
      return;
    }

    const lineId = NARRATIVE_LINES[lineIdx];
    const el = document.getElementById(lineId);
    if (el) {
      el.classList.add("visible");
      el.classList.add("typing-cursor");
    }

    if (lineIdx > 0) {
      const prevEl = document.getElementById(NARRATIVE_LINES[lineIdx - 1]);
      if (prevEl) prevEl.classList.remove("typing-cursor");
    }

    const duration = lineIdx % 2 === 0 ? 2500 : 1500;
    lineIdx++;
    
    narrativeTimeout = setTimeout(showNextLine, duration);
  }

  showNextLine();
}

function skipNarrative() {
  if (narrativeTimeout) clearTimeout(narrativeTimeout);
  
  NARRATIVE_LINES.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove("typing-cursor");
      el.classList.add("visible");
    }
  });

  switchView("login");
}

// --- 16. Custom App Dock Grid Management (一键增删与左右移位) ---
function renderAppDock() {
  const grid = document.getElementById("app-dock-grid");
  if (!grid) return;
  
  grid.innerHTML = "";
  
  state.userProfile.appDock.forEach((app, idx) => {
    const item = document.createElement("div");
    item.className = `dock-app-item ${state.dockEditMode ? "edit-mode" : ""}`;
    
    // Get app initials for visual text icon
    const initials = escapeHtml(app.name.slice(0, 2));
    // 仅允许安全的颜色字符串（hex / hsl / rgb），否则回退到主题色，避免 style 注入
    const safeColor = /^(#[0-9a-fA-F]{3,8}|hsl\([^"'<>]*\)|rgb\([^"'<>]*\))$/.test(app.color || "")
      ? app.color : "var(--accent)";

    item.innerHTML = `
      <div class="dock-app-delete-btn">✕</div>
      <div class="dock-app-icon" style="background: linear-gradient(135deg, ${safeColor}, rgba(0,0,0,0.6));">
        ${initials}
      </div>
      <div class="dock-app-label">${escapeHtml(app.name)}</div>
      <div class="dock-app-nav-btns">
        <div class="dock-nav-btn" data-nav="-1">←</div>
        <div class="dock-nav-btn" data-nav="1">→</div>
      </div>
    `;

    // 事件绑定（不再拼接 onclick 字符串）
    item.querySelector(".dock-app-delete-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      deleteDockApp(app.id);
    });
    item.querySelectorAll(".dock-nav-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        moveDockApp(app.id, parseInt(btn.dataset.nav, 10));
      });
    });

    // Normal redirect click
    item.onclick = () => {
      if (state.dockEditMode) return;
      triggerShortcutRedirect(app.name, app.url);
    };
    
    grid.appendChild(item);
  });
  
  // Plus Add Custom App icon at the end
  const plusItem = document.createElement("div");
  plusItem.className = "dock-app-item";
  plusItem.innerHTML = `
    <div class="dock-app-icon" style="background: rgba(255,255,255,0.03); border-style: dashed; border-color: rgba(255,255,255,0.15);">
      ➕
    </div>
    <div class="dock-app-label" style="color: var(--accent);">添加</div>
  `;
  plusItem.onclick = () => {
    if (state.dockEditMode) return;
    document.getElementById("add-app-modal").classList.add("active");
  };
  grid.appendChild(plusItem);
}

function toggleDockEditMode() {
  state.dockEditMode = !state.dockEditMode;
  const editBtn = document.getElementById("edit-dock-btn");
  if (editBtn) {
    editBtn.innerHTML = state.dockEditMode ? "<span>完成</span>" : "<span>编辑</span>";
  }
  renderAppDock();
  
  // Save state if saved exit
  if (!state.dockEditMode) {
    saveProfile();
  }
}

function deleteDockApp(id) {
  state.userProfile.appDock = state.userProfile.appDock.filter(app => app.id !== id);
  renderAppDock();
}

function moveDockApp(id, direction) {
  const list = state.userProfile.appDock;
  const index = list.findIndex(app => app.id === id);
  if (index === -1) return;
  
  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= list.length) return;
  
  // Swap indices
  const temp = list[index];
  list[index] = list[targetIndex];
  list[targetIndex] = temp;
  
  renderAppDock();
}

function fillPresetApp(name, url) {
  const nameInput = document.getElementById("custom-app-name");
  const urlInput = document.getElementById("custom-app-url");
  if (nameInput) nameInput.value = name;
  if (urlInput) urlInput.value = url;
}

function saveCustomApp() {
  const nameInput = document.getElementById("custom-app-name");
  const urlInput = document.getElementById("custom-app-url");
  
  if (!nameInput || !urlInput) return;
  
  const name = nameInput.value.trim();
  let url = urlInput.value.trim();
  
  if (!name || !url) {
    alert("请输入名称和有效网址。");
    return;
  }
  
  if (!url.startsWith("http")) {
    url = "https://" + url;
  }
  
  const newId = `custom_${Date.now()}`;
  
  // Generate random pleasant theme color stop
  const randomHue = Math.floor(Math.random() * 360);
  const color = `hsl(${randomHue}, 65%, 45%)`;
  
  state.userProfile.appDock.push({
    id: newId,
    name,
    url,
    color
  });
  
  // Clear fields and close
  nameInput.value = "";
  urlInput.value = "";
  document.getElementById("add-app-modal").classList.remove("active");
  
  // Save profile and reload DOCK
  saveProfile();
  renderAppDock();
}

// --- 17. Dual-Loop Blocker (Link Interception & Time Limits) ---
function triggerShortcutRedirect(siteName, targetUrl) {
  state.blockerTargetSite = siteName;
  state.blockerTargetUrl = targetUrl;
  
  const modal = document.getElementById("link-intercept-modal");
  const siteNameEl = document.getElementById("intercept-site-name");
  if (siteNameEl) siteNameEl.textContent = siteName;
  
  const step2Input = document.getElementById("intercept-step2");
  const step3Input = document.getElementById("intercept-step3");
  if (step2Input) step2Input.value = state.userProfile.step2 || "";
  if (step3Input) step3Input.value = state.userProfile.step3 || "";
  
  if (modal) modal.classList.add("active");
}

function cancelRedirect() {
  const modal = document.getElementById("link-intercept-modal");
  if (modal) modal.classList.remove("active");
}

// 可靠地在新标签打开外部网址：在用户手势内用 <a target="_blank"> 触发，
// 比 window.open 更不易被弹窗拦截器拦截；只放行 http/https 协议。
function openExternal(rawUrl) {
  let url = (rawUrl || "").trim();
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  try {
    const u = new URL(url);
    if (u.protocol !== "http:" && u.protocol !== "https:") return false;
  } catch (e) {
    alert("网址无效，无法跳转：" + rawUrl);
    return false;
  }
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  a.remove();
  return true;
}

function confirmRedirect() {
  const selectEl = document.getElementById("intercept-duration");
  const step2Input = document.getElementById("intercept-step2");
  const step3Input = document.getElementById("intercept-step3");
  
  const minutes = selectEl ? parseInt(selectEl.value, 10) : 10;
  
  state.userProfile.step2 = step2Input ? step2Input.value.trim() : "";
  state.userProfile.step3 = step3Input ? step3Input.value.trim() : "";
  
  saveProfile();
  
  state.blockerTimeLimitSec = minutes * 60;
  state.blockerStartTime = Date.now();
  state.blockerTimerActive = true;
  
  cancelRedirect();

  // 在新标签打开目标站点（Tryrevive 保留在原标签继续计时与回访检测）
  openExternal(state.blockerTargetUrl);

  setAvatarState("black");
  
  // Update UI steps
  const stepsDisplay = document.getElementById("goal-plan-steps-display");
  const step2El = document.getElementById("display-step-2");
  const step3El = document.getElementById("display-step-3");
  if (stepsDisplay) stepsDisplay.style.display = "block";
  if (step2El) step2El.textContent = state.userProfile.step2 || "未计划";
  if (step3El) step3El.textContent = state.userProfile.step3 || "未计划";
  
  // Save pre-computed smart warnings quotes instantly (Bugfix: pre-generate warning quotes)
  generateSmartMBTIQuote();
  saveProfile();
  
  if (state.blockerInterval) clearInterval(state.blockerInterval);
  state.blockerInterval = setInterval(checkBlockerCountdown, 1000);
}

function checkBlockerCountdown() {
  if (!state.blockerTimerActive) {
    clearInterval(state.blockerInterval);
    return;
  }
  
  const elapsedSec = Math.floor((Date.now() - state.blockerStartTime) / 1000);
  const timeLeftSec = state.blockerTimeLimitSec - elapsedSec;
  
  if (timeLeftSec <= 0) {
    document.title = `⏰【超时】${Math.abs(Math.floor(timeLeftSec / 60))}分${Math.abs(timeLeftSec % 60)}秒!`;
    if (!heartbeatInterval) {
      startHeartbeatLoop();
    }
  } else {
    const min = Math.floor(timeLeftSec / 60);
    const sec = timeLeftSec % 60;
    document.title = `⏳【限时浏览】：${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }
}

function extendFocusTimer(seconds) {
  if (state.blockerTimerActive) {
    state.blockerTimeLimitSec += seconds;
    stopHeartbeatLoop();
    document.title = "Tryrevive - 夺回你的注意力主权";
    
    const overlay = document.getElementById("alert-blocking");
    if (overlay) overlay.classList.remove("active");
  }
}

function enterMeditationFromBlocker() {
  const overlay = document.getElementById("alert-blocking");
  if (overlay) overlay.classList.remove("active");
  
  stopHeartbeatLoop();
  document.title = "Tryrevive - 夺回你的注意力主权";
  
  state.blockerTimerActive = false;
  if (state.blockerInterval) clearInterval(state.blockerInterval);
  
  switchView("meditation");
}

function initFocusMonitor() {
  window.addEventListener("focus", () => {
    if (state.blockerTimerActive) {
      const elapsedSec = Math.floor((Date.now() - state.blockerStartTime) / 1000);
      const isOvertime = elapsedSec > state.blockerTimeLimitSec;
      
      if (isOvertime) {
        triggerBlockerWarning(elapsedSec - state.blockerTimeLimitSec);
      }
    }
  });
}

// 解决偏好更新无法渲染的 Bug
function compileQuoteText(rawText) {
  if (!rawText) return "";
  return rawText
    .replace(/{motivation}/g, state.userProfile.motivation || "专注当下")
    .replace(/{step2}/g, state.userProfile.step2 || "第二步计划")
    .replace(/{step3}/g, state.userProfile.step3 || "第三步计划")
    .replace(/{hours}/g, "1.5");
}

function syncWarningMotivationalDOM() {
  const goalInput = document.getElementById("goal-first-step-input");
  if (goalInput) goalInput.value = state.userProfile.firstStep || "";
  
  const stepsDisplay = document.getElementById("goal-plan-steps-display");
  const step2El = document.getElementById("display-step-2");
  const step3El = document.getElementById("display-step-3");
  
  if (state.userProfile.step2 || state.userProfile.step3) {
    if (stepsDisplay) stepsDisplay.style.display = "block";
    if (step2El) step2El.textContent = state.userProfile.step2 || "未计划";
    if (step3El) step3El.textContent = state.userProfile.step3 || "未计划";
  } else {
    if (stepsDisplay) stepsDisplay.style.display = "none";
  }

  // Update homepage welcome subtitle
  const mbtiLabel = document.getElementById("dashboard-mbti-label");
  if (mbtiLabel) {
    // If user has a custom quote, use it. Otherwise, use computed MBTI warning quote.
    let rawText = state.userProfile.customQuote;
    if (!rawText) {
      generateSmartMBTIQuote();
      rawText = state.userProfile.computedQuote || "即搜即达，心无旁骛";
    }
    const compiled = compileQuoteText(rawText);
    mbtiLabel.textContent = `“${compiled}”`;
  }

  // Update reborn warning banner title
  const rebornTitle = document.getElementById("reborn-banner-title-text") || document.querySelector(".reborn-banner-title");
  if (rebornTitle) {
    rebornTitle.textContent = state.userProfile.motivation || "重新掌控自己的人生";
  }
}

// --- 17a. Claude AI 客户端（统一入口） ---
// 优先走 Cloudflare Worker 代理（Key 藏在服务端，安全）；
// 未配置代理时，回退到用户本地填写的 API Key 直连。
const AI_PROXY_URL = ""; // Worker 部署后填入，如 "https://tryrevive-ai.xxx.workers.dev"

async function callClaude({ system, messages, model, maxTokens }) {
  const payload = {
    model: model || "claude-sonnet-5",
    max_tokens: maxTokens || 512,
    system: system,
    messages: messages
  };

  if (AI_PROXY_URL) {
    const resp = await fetch(AI_PROXY_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!resp.ok) throw new Error(`proxy HTTP ${resp.status}`);
    const data = await resp.json();
    if (data && data.content && data.content[0] && data.content[0].text) {
      return data.content[0].text.trim();
    }
    throw new Error(data.error || "invalid proxy response");
  }

  const apiKey = state.userProfile.apiKey;
  if (!apiKey) throw new Error("no proxy & no api key");

  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify(payload)
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const data = await resp.json();
  if (data && data.content && data.content[0] && data.content[0].text) {
    return data.content[0].text.trim();
  }
  throw new Error("invalid API response");
}

async function fetchAICoachFeedback(promptType, callback) {
  const systemPrompt = "你是一位温和而清醒的陪伴者，帮助容易被推荐流卷走注意力的人，轻轻回到自己真正想做的事情上。请结合用户的人格倾向、想去的地方或想完成的目标，以及此刻的状态，写一句不超过 40 字的话。语气平静、具体、像理解他的朋友在身边轻声提醒——不说教、不制造羞耻感、不喊口号、不用伪科学术语。避免一切 AI 套话，直接输出这一句话。";
  const userMessage = `
  用户 MBTI: ${state.userProfile.mbti}
  今日终极目标: ${state.userProfile.motivation}
  当前步骤计划: 1. ${state.userProfile.firstStep || "未设定"} | 2. ${state.userProfile.step2 || "未设定"} | 3. ${state.userProfile.step3 || "未设定"}
  触发情境: ${promptType === "blocker" ? "用户在使用被设防的应用超时，需要警醒防线" : "用户刚完成一轮禅想冷静，准备重新上路自律"}
  `;

  try {
    const text = await callClaude({
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
      model: "claude-haiku-4-5-20251001",
      maxTokens: 120
    });
    callback(text);
  } catch (err) {
    console.warn("AI coach fetch failed, falling back:", err.message);
    callback(getLocalFallbackQuote(promptType));
  }
}

// --- 17b. AI 对话（心语聊天：透明气泡，温和催促） ---
const chatState = { history: [], busy: false };

function toggleAIChat(forceOpen) {
  const panel = document.getElementById("ai-chat-panel");
  if (!panel) return;
  const open = forceOpen === true || !panel.classList.contains("open");
  panel.classList.toggle("open", open);
  const list = document.getElementById("ai-chat-messages");
  if (open && list && !list.children.length) {
    appendChatBubble("assistant", "我在。想聊聊你现在正被什么占据，或者今天真正想完成的那件事吗？");
  }
  if (open) {
    const input = document.getElementById("ai-chat-input");
    if (input) setTimeout(() => input.focus(), 200);
  }
}

function appendChatBubble(role, text) {
  const list = document.getElementById("ai-chat-messages");
  if (!list) return null;
  const el = document.createElement("div");
  el.className = "chat-bubble " + (role === "user" ? "chat-user" : "chat-ai");
  el.textContent = text;
  list.appendChild(el);
  list.scrollTop = list.scrollHeight;
  return el;
}

async function sendAIChat() {
  if (chatState.busy) return;
  const input = document.getElementById("ai-chat-input");
  const text = input ? input.value.trim() : "";
  if (!text) return;
  input.value = "";

  appendChatBubble("user", text);
  chatState.history.push({ role: "user", content: text });

  const thinking = appendChatBubble("assistant", "…");
  chatState.busy = true;

  const systemPrompt = `你是 tryrevive 的陪伴者——温和、清醒、简短。用户正在练习把注意力从推荐流夺回到自己的人生。
用户画像：MBTI=${state.userProfile.mbti || "未知"}；今日目标=${state.userProfile.motivation || "未设定"}；计划步骤=1.${state.userProfile.firstStep || "未定"} 2.${state.userProfile.step2 || "未定"} 3.${state.userProfile.step3 || "未定"}。
原则：每次回复不超过 80 字；像朋友轻声对话，不说教、不羞辱、不喊口号；倾听并接住情绪，再轻轻把话题引回"当下能做的最小一步"；适时提出一个具体的小问题帮对方想清楚。`;

  try {
    const reply = await callClaude({
      system: systemPrompt,
      messages: chatState.history.slice(-20),
      model: "claude-sonnet-5",
      maxTokens: 300
    });
    thinking.textContent = reply;
    chatState.history.push({ role: "assistant", content: reply });
  } catch (err) {
    thinking.textContent = state.userProfile.apiKey || AI_PROXY_URL
      ? "（连接失败了，稍后再试试）"
      : "（还没接通 AI：请在「设置偏好」里填入 API Key，或等待代理配置完成）";
  } finally {
    chatState.busy = false;
  }
}

function getLocalFallbackQuote(promptType) {
  generateSmartMBTIQuote();
  let rawText = state.userProfile.computedQuote || "继续沉溺在低信息熵的算法中，你距离梦想的物理偏差正不断扩大。";
  // 统一走 compileQuoteText 做全局替换，修复多占位符只替换首个的 bug
  return compileQuoteText(rawText);
}

function triggerBlockerWarning(overtimeSeconds) {
  const overlay = document.getElementById("alert-blocking");
  const title = document.querySelector(".blocking-warning-title");
  const text = document.getElementById("blocking-warning-text");
  const quote = document.getElementById("blocking-mbti-quote");

  if (title) title.textContent = `⚠️ Tryrevive / 专注防线偏差警告`;
  if (text) text.textContent = "🔍 AI 自律教练正在透视分析你的防线偏差状态...";
  if (quote) quote.textContent = `"${state.userProfile.motivation}"`;

  if (overlay) overlay.classList.add("active");
  startHeartbeatLoop();
  setAvatarState("black");

  fetchAICoachFeedback("blocker", (textVal) => {
    if (text) text.textContent = textVal;
  });
}

// --- 18. Initial Boot Up & DOM Events binding ---
document.addEventListener("DOMContentLoaded", () => {
  const goalStepInput = document.getElementById("goal-first-step-input");
  if (goalStepInput) {
    goalStepInput.addEventListener("change", () => {
      state.userProfile.firstStep = goalStepInput.value.trim();
      saveProfile();
    });
  }

  // 平台搜索直达表：关键词 → 直达平台搜索结果页（跳过首页推荐流）
  const PLATFORM_SEARCH = {
    bilibili:    { name: "B站",       url: "https://search.bilibili.com/all?keyword=" },
    xiaohongshu: { name: "小红书",    url: "https://www.xiaohongshu.com/search_result?keyword=" },
    douyin:      { name: "抖音",      url: "https://www.douyin.com/search/" },
    netease:     { name: "网易云音乐", url: "https://music.163.com/#/search/m/?s=" },
    weibo:       { name: "微博",      url: "https://s.weibo.com/weibo?q=" },
    zhihu:       { name: "知乎",      url: "https://www.zhihu.com/search?type=content&q=" }
  };

  const searchInput = document.getElementById("home-search-input");
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const query = searchInput.value.trim();
        if (!query) return;
        searchInput.value = "";

        let url = query;
        let siteName = "外部网址";
        const platformSel = document.getElementById("search-platform");
        const platform = platformSel ? platformSel.value : "web";

        if (query.match(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/)) {
          // 输入本身是网址 → 直接前往
          if (!query.startsWith("http")) url = "https://" + query;
          siteName = query.split('/')[0].replace('www.', '');
        } else if (PLATFORM_SEARCH[platform]) {
          // 关键词 → 直达所选平台的搜索结果页
          url = PLATFORM_SEARCH[platform].url + encodeURIComponent(query);
          siteName = PLATFORM_SEARCH[platform].name;
        } else {
          url = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
          siteName = "搜索网页";
        }

        triggerShortcutRedirect(siteName, url);
      }
    });
  }

  // Bind Control Console states (mini-console)
  const avatarButtons = document.querySelectorAll("[data-avatar-set]");
  avatarButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      avatarButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      setAvatarState(btn.dataset.avatarSet);
    });
  });

  // Check active logins safely
  const activeUser = localStorage.getItem("tryrevive_active_user");
  if (activeUser) {
    const loaded = loadUserProfile(activeUser);
    if (loaded) {
      state.currentUser = activeUser;
      state.userProfile = loaded;
      applyThemeColor(state.userProfile.calmingColor.h, state.userProfile.calmingColor.s, state.userProfile.calmingColor.l);
      switchView("home");
    } else {
      switchView("narrative");
      runNarrativeIntro();
    }
  } else {
    switchView("narrative");
    runNarrativeIntro();
  }

  initFocusMonitor();
});

function setAvatarState(stateName) {
  state.avatarState = stateName;
  
  if (stateName === "black") state.avatarAction = "cry";
  else if (stateName === "white") state.avatarAction = "jump";
  else state.avatarAction = "walk";

  const badgeText = document.getElementById("badge-state-name");
  const badgeContainer = document.getElementById("state-badge-container");
  const rebornBanner = document.getElementById("warning-reborn-banner");
  
  if (badgeText) {
    badgeText.textContent = stateName === "black" ? "重度沉迷" : (stateName === "white" ? "自律重生" : "正常疗愈");
  }
  if (badgeContainer) {
    badgeContainer.className = `avatar-state-badge state-${stateName}`;
  }
  if (rebornBanner) {
    if (stateName === "white") rebornBanner.classList.add("active");
    else rebornBanner.classList.remove("active");
  }
}

// --- 18b. Chrome Extension Communication Bridge ---
// 普通网页无法直接收到 chrome.tabs.sendMessage，由 content.js 转成 CustomEvent 送达页面
window.addEventListener("tryrevive:overtime", () => {
  triggerBlockerWarning(60); // 触发 1 分钟超时警示
});

// 兼容：若页面本身运行在扩展上下文，仍直接监听 runtime 消息
if (window.chrome && chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "triggerOvertime") {
      triggerBlockerWarning(60);
      sendResponse({ success: true });
    }
  });
}

