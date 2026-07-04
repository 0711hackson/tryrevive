/* ============================
   tryrevive — 数据模块
   预设 APP 列表 / 问卷内容
   ============================ */

// ---- 预设 APP 列表 ----
// logo 使用各平台官方 favicon；加载失败时自动回退 emoji 图标
const PRESET_APPS = [
    {
        id: 'bilibili',
        name: 'B 站',
        icon: '📺',
        logo: 'https://www.bilibili.com/favicon.ico',
        color: '#fb7299',
        bg: 'linear-gradient(135deg, #ff9eb5 0%, #fb7299 100%)',
        url: 'https://www.bilibili.com'
    },
    {
        id: 'xiaohongshu',
        name: '小红书',
        icon: '📕',
        logo: 'https://www.xiaohongshu.com/favicon.ico',
        color: '#ff2442',
        bg: 'linear-gradient(135deg, #ff6b7e 0%, #ff2442 100%)',
        url: 'https://www.xiaohongshu.com'
    },
    {
        id: 'douyin',
        name: '抖音',
        icon: '🎵',
        logo: 'https://www.douyin.com/favicon.ico',
        color: '#000000',
        bg: 'linear-gradient(135deg, #444 0%, #000 100%)',
        url: 'https://www.douyin.com'
    },
    {
        id: 'netease',
        name: '网易云',
        icon: '🎶',
        logo: 'https://s1.music.126.net/style/favicon.ico',
        color: '#e60026',
        bg: 'linear-gradient(135deg, #ff4d6d 0%, #e60026 100%)',
        url: 'https://music.163.com'
    },
    {
        id: 'weibo',
        name: '微博',
        icon: '🌟',
        logo: 'https://weibo.com/favicon.ico',
        color: '#e6162d',
        bg: 'linear-gradient(135deg, #ff4d5e 0%, #e6162d 100%)',
        url: 'https://weibo.com'
    },
    {
        id: 'zhihu',
        name: '知乎',
        icon: '❓',
        logo: 'https://static.zhihu.com/heifetz/favicon.ico',
        color: '#0084ff',
        bg: 'linear-gradient(135deg, #6bb5ff 0%, #0084ff 100%)',
        url: 'https://www.zhihu.com'
    },
    {
        id: 'youtube',
        name: 'YouTube',
        icon: '▶️',
        logo: 'https://www.youtube.com/favicon.ico',
        color: '#ff0000',
        bg: 'linear-gradient(135deg, #ff6666 0%, #ff0000 100%)',
        url: 'https://www.youtube.com'
    },
    {
        id: 'github',
        name: 'GitHub',
        icon: '🐙',
        logo: 'https://github.com/favicon.ico',
        color: '#24292e',
        bg: 'linear-gradient(135deg, #586069 0%, #24292e 100%)',
        url: 'https://github.com'
    },
    {
        id: 'lanshi',
        name: '烂开始',
        icon: '🌱',
        color: '#7c9a6d',
        bg: 'linear-gradient(135deg, #9db98d 0%, #5d7a4e 100%)',
        url: 'lanshi/index.html',
        local: true   // 站内模块：不启动娱乐计时
    }
];

// ---- 默认 APP（首次加载时显示） ----
const DEFAULT_APP_IDS = ['bilibili', 'xiaohongshu', 'douyin', 'netease', 'lanshi'];

// ---- 平台搜索 URL 映射 ----
const SEARCH_URLS = {
    bilibili: 'https://search.bilibili.com/all?keyword=',
    xiaohongshu: 'https://www.xiaohongshu.com/search_result?keyword=',
    douyin: 'https://www.douyin.com/search/',
    netease: 'https://music.163.com/#/search/m/?s=',
    web: 'https://www.google.com/search?q='
};

// ---- MBTI 人格提问库 ----
const MBTI_QUESTIONS = {
    INTJ: [
        '今天有什么计划被完美执行了吗？',
        '你的系统思考是否找到了新的优化点？',
        '独立思考的时间够了吗？'
    ],
    INTP: [
        '今天探索了什么有趣的想法？',
        '有没有什么理论让你着迷？',
        '逻辑世界还清晰吗？'
    ],
    ENTJ: [
        '今天领导了什么事情？',
        '目标是否按计划推进？',
        '你的决断力是否在线？'
    ],
    ENTP: [
        '今天辩论了什么有趣的话题？',
        '有什么新点子冒出来了？',
        '灵感是否充沛？'
    ],
    INFJ: [
        '今天有没有静下心来关照自己？',
        '你的直觉告诉你什么？',
        '内心世界还平和吗？'
    ],
    INFP: [
        '今天有什么触动内心的瞬间？',
        '你的价值观是否被尊重？',
        '想象力还在自由飞翔吗？'
    ],
    ENFJ: [
        '今天帮助了谁？',
        '人际关系是否让你感到温暖？',
        '你的影响力是否用在了对的地方？'
    ],
    ENFP: [
        '今天有什么让你兴奋的新可能？',
        '创造力是否得到释放？',
        '热情还在燃烧吗？'
    ],
    ISTJ: [
        '今天的任务清单完成了多少？',
        '秩序感是否被保持？',
        '细节有没有被关注到？'
    ],
    ISFJ: [
        '今天照顾好自己了吗？',
        '有没有人让你感到被需要？',
        '温暖是否从内心流出来？'
    ],
    ESTJ: [
        '今天的组织工作顺利吗？',
        '传统和规则是否被尊重？',
        '务实的态度是否带来成果？'
    ],
    ESFJ: [
        '今天和朋友联系了吗？',
        '和谐的氛围有没有被保持？',
        '你的关怀是否传递给了他人？'
    ],
    ISTP: [
        '今天动手做了什么有趣的事？',
        '自由探索的时间够吗？',
        '有没有发现什么实用技巧？'
    ],
    ISFP: [
        '今天有什么美学体验？',
        '是否跟随了内心的感受？',
        '温柔的自我有没有被看见？'
    ],
    ESTP: [
        '今天有没有什么刺激的行动？',
        '行动力是否在线？',
        '当下的能量是否充沛？'
    ],
    ESFP: [
        '今天有没有让你快乐的瞬间？',
        '表演欲是否被满足？',
        '生活是否充满色彩？'
    ],
    default: [
        '今天感觉如何？',
        '有没有什么让你在意的事？',
        '现在的你需要什么？'
    ]
};

// ---- 颜色选项（问卷第1题） ----
const COLOR_OPTIONS = [
    { name: '深海蓝', value: '#4a90e2', gradient: 'linear-gradient(135deg, #4a90e2 0%, #7bb3f0 100%)' },
    { name: '暖阳黄', value: '#e2b44a', gradient: 'linear-gradient(135deg, #e2b44a 0%, #f0d47b 100%)' },
    { name: '玫瑰粉', value: '#e24a90', gradient: 'linear-gradient(135deg, #e24a90 0%, #f07bb3 100%)' },
    { name: '薄荷绿', value: '#4ae2b4', gradient: 'linear-gradient(135deg, #4ae2b4 0%, #7bf0d4 100%)' },
    { name: '梦幻紫', value: '#b44ae2', gradient: 'linear-gradient(135deg, #b44ae2 0%, #d47bf0 100%)' },
    { name: '极简灰', value: '#888888', gradient: 'linear-gradient(135deg, #666 0%, #aaa 100%)' }
];

// ---- 问卷题目（共5题） ----
const QUESTIONNAIRE_ITEMS = [
    {
        type: 'color',
        label: '第 1 步 · 颜色偏好',
        title: '哪种颜色让你感到宁静？',
        subtitle: '它会成为你的主色调'
    },
    {
        type: 'choice',
        label: '第 2 步 · 精力方向',
        title: '独处时，你通常感到？',
        subtitle: '这关乎你从哪里获得能量',
        options: [
            { text: '充电 — 独处让我恢复精力', value: 'I' },
            { text: '有些无聊 — 偶尔需要和人互动', value: 'E-leaning' },
            { text: '两者都可以，取决于当天状态', value: 'balanced' }
        ]
    },
    {
        type: 'choice',
        label: '第 3 步 · 信息偏好',
        title: '当思考问题时，你更倾向于？',
        subtitle: '你如何处理和理解信息',
        options: [
            { text: '关注具体的细节和事实', value: 'S' },
            { text: '关注整体的模式和可能性', value: 'N' },
            { text: '两者都会自然地用到', value: 'balanced' }
        ]
    },
    {
        type: 'choice',
        label: '第 4 步 · 决策方式',
        title: '做重要决定时，你更依赖？',
        subtitle: '你的判断依据是什么',
        options: [
            { text: '逻辑分析和客观标准', value: 'T' },
            { text: '个人价值和对他人的影响', value: 'F' },
            { text: '两者综合考量', value: 'balanced' }
        ]
    },
    {
        type: 'choice',
        label: '第 5 步 · 生活方式',
        title: '日常生活中，你更偏好？',
        subtitle: '你如何组织外在世界',
        options: [
            { text: '有计划、有条理地生活', value: 'J' },
            { text: '保持灵活、随性的节奏', value: 'P' },
            { text: '计划与灵活相结合', value: 'balanced' }
        ]
    }
];

// ---- 状态文本（火柴人状态） ----
const STATE_TEXTS = {
    black: '需要调整状态 · 慢慢来',
    gray: '疗愈进行中 · 保持节奏',
    white: '状态良好 · 继续加油'
};

// ---- 状态随机文字库（符合各状态调性） ----
const STATE_MESSAGES = {
    black: [
        '你今天刷太久了，需要和自己待一会儿',
        '屏幕外的世界，也在等你',
        '放下手机，深呼吸一下',
        '你已经看了很久了，眼睛需要休息',
        '是时候抬头看看窗外了',
        '注意力被偷走了，我们慢慢找回来',
        '给自己一个暂停的机会',
        '你值得比无尽滑动更好的体验'
    ],
    gray: [
        '正在慢慢找回自己的节奏',
        '一步一步来，不需要着急',
        '你在变好的路上',
        '深呼吸，感受当下的平静',
        '疗愈是一个过程，你做得很好',
        '每一个小小的改变都算数',
        '你在和自己和解，这很勇敢',
        '慢慢来，比较快'
    ],
    white: [
        '你在掌控自己的人生，太棒了！',
        '今天的你，闪闪发光',
        '保持这个节奏，你做得很棒',
        '你和自己相处得真好',
        '这就是专注的力量',
        '你正在成为更好的自己',
        '此刻的你，真的很了不起',
        '继续相信自己的节奏'
    ]
};

// ---- localStorage Key ----
const STORAGE_KEYS = {
    user: 'tryrevive_user',
    apps: 'tryrevive_apps',
    preferences: 'tryrevive_preferences',
    questionnaireDone: 'tryrevive_questionnaire_done',
    state: 'tryrevive_state'
};

// ---- 冥想空间文字库 ----
const MEDITATION_MESSAGES = [
    '你真的想浪费时间在并不会提升自己的娱乐上面吗？',
    '你会后悔的',
    '用这个时间，你能成为你想成为的人',
    '此刻的专注，是未来的自由',
    '你比刷手机时的自己更好',
    '放下它，你不会失去什么',
    '时间在流逝，你在成长吗？',
    '你值得比无尽滑动更好的生活',
    '深呼吸，你不需要这些刺激',
    '真正的快乐不在屏幕里',
    '你的注意力，比你想的更珍贵',
    '此刻的克制，是未来的力量'
];
