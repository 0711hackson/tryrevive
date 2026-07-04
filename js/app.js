/* ============================
   tryrevive — 主应用
   页面切换 / APP 管理 / 搜索 / 设置
   ============================ */

const App = (function() {
    let userApps = [];
    let editingMode = false;

    // ========== 娱乐时间计时器（冥想空间触发） ==========

    let entertainmentTimer = null;
    let entertainmentStartTime = null;
    const MEDITATION_THRESHOLD = 15 * 60 * 1000; // 15分钟

    function startEntertainmentTimer() {
        if (entertainmentTimer) return;
        entertainmentStartTime = Date.now();
        entertainmentTimer = setInterval(() => {
            const elapsed = Date.now() - entertainmentStartTime;
            if (elapsed >= MEDITATION_THRESHOLD) {
                showSiriButton();
                // 显示一次后停止计时，避免反复弹出
                stopEntertainmentTimer();
            }
        }, 1000);
    }

    function stopEntertainmentTimer() {
        if (entertainmentTimer) {
            clearInterval(entertainmentTimer);
            entertainmentTimer = null;
        }
    }

    function showSiriButton() {
        const btn = document.getElementById('siri-button');
        if (btn) btn.classList.remove('hidden');
    }

    function hideSiriButton() {
        const btn = document.getElementById('siri-button');
        if (btn) btn.classList.add('hidden');
    }

    // ========== 页面切换 ==========

    function showAuthPage() {
        document.getElementById('auth-page').classList.remove('hidden');
        document.getElementById('questionnaire-page').classList.add('hidden');
        document.getElementById('home-page').classList.add('hidden');
        document.body.setAttribute('data-page', 'auth');
    }

    function showQuestionnairePage() {
        document.getElementById('auth-page').classList.add('hidden');
        document.getElementById('questionnaire-page').classList.remove('hidden');
        document.getElementById('home-page').classList.add('hidden');
        document.body.setAttribute('data-page', 'questionnaire');
        Questionnaire.init();
    }

    function showHomePage() {
        document.getElementById('auth-page').classList.add('hidden');
        document.getElementById('questionnaire-page').classList.add('hidden');
        document.getElementById('home-page').classList.remove('hidden');
        document.body.setAttribute('data-page', 'home');

        // 应用主题色
        applyThemeColor();

        // 初始化动画和 APP
        Animation.init();
        renderApps();
    }

    // ========== 主题色 ==========

    function applyThemeColor() {
        try {
            const pref = JSON.parse(localStorage.getItem(STORAGE_KEYS.preferences) || '{}');
            const color = pref.color || '#4a90e2';
            if (color) {
                // 生成渐变背景
                const gradient = `linear-gradient(135deg, #000000 0%, ${hexToRgba(color, 0.12)} 50%, #000000 100%)`;
                document.body.style.setProperty('--body-gradient', gradient);

                // 设置 accent 颜色
                document.documentElement.style.setProperty('--accent-color', color);
                document.documentElement.style.setProperty('--accent-light', lightenColor(color, 20));
            }
        } catch (e) {
            console.warn('应用主题色失败:', e);
        }
    }

    function hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    function lightenColor(hex, percent) {
        const num = parseInt(hex.slice(1), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
    }

    // ========== 用户登录 / 注册 ==========

    function handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;

        if (!username || !password) return;

        // 保存用户信息（简化版，仅前端）
        try {
            localStorage.setItem(STORAGE_KEYS.user, JSON.stringify({
                username: username,
                loggedInAt: new Date().toISOString()
            }));
        } catch (e) {}

        // 检查是否做过问卷
        const done = localStorage.getItem(STORAGE_KEYS.questionnaireDone);
        if (done) {
            showHomePage();
        } else {
            showQuestionnairePage();
        }
    }

    function handleRegister(e) {
        e.preventDefault();
        const username = document.getElementById('register-username').value.trim();
        const password = document.getElementById('register-password').value;

        if (!username || !password) return;

        try {
            localStorage.setItem(STORAGE_KEYS.user, JSON.stringify({
                username: username,
                registeredAt: new Date().toISOString()
            }));
        } catch (e) {}

        // 新用户直接进入问卷
        showQuestionnairePage();
    }

    // ========== APP 管理 ==========

    function loadApps() {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.apps);
            if (saved) {
                // 用预设字段补全旧存档（如新增的 logo / local 字段）
                userApps = JSON.parse(saved).map(a => {
                    const preset = PRESET_APPS.find(p => p.id === a.id);
                    return preset ? { ...preset, ...a, logo: preset.logo, local: preset.local } : a;
                });
                // 一次性把「烂开始」并入旧存档
                if (!userApps.find(a => a.id === 'lanshi') &&
                    !localStorage.getItem('tryrevive_lanshi_added')) {
                    const lanshi = PRESET_APPS.find(p => p.id === 'lanshi');
                    if (lanshi) userApps.push({ ...lanshi, addedAt: new Date().toISOString() });
                    localStorage.setItem('tryrevive_lanshi_added', 'true');
                    saveApps();
                }
            } else {
                // 首次加载，使用默认 APP
                userApps = DEFAULT_APP_IDS.map(id => {
                    const app = PRESET_APPS.find(a => a.id === id);
                    return { ...app, addedAt: new Date().toISOString() };
                });
                saveApps();
            }
        } catch (e) {
            userApps = [];
        }
    }

    function saveApps() {
        try {
            localStorage.setItem(STORAGE_KEYS.apps, JSON.stringify(userApps));
        } catch (e) {}
    }

    function renderApps() {
        loadApps();
        const grid = document.getElementById('apps-grid');
        if (!grid) return;

        grid.innerHTML = '';
        userApps.forEach((app, index) => {
            const item = document.createElement('div');
            item.className = 'app-item';
            item.draggable = editingMode;
            item.dataset.index = index;
            item.dataset.id = app.id;
            item.innerHTML = `
                <div class="app-icon"></div>
                <div class="app-name">${app.name}</div>
                <button class="app-remove" data-index="${index}" title="移除">×</button>
            `;

            // 图标：优先官方 logo，加载失败/超时回退 emoji
            const iconBox = item.querySelector('.app-icon');
            if (app.logo) {
                const img = document.createElement('img');
                img.className = 'app-logo';
                img.alt = app.name;
                img.referrerPolicy = 'no-referrer';
                const useFallback = () => {
                    if (!iconBox.contains(img)) return; // 已回退过
                    iconBox.classList.add('fallback');
                    iconBox.style.setProperty('--fallback-bg', app.bg || '#333');
                    iconBox.textContent = app.icon || app.name.charAt(0);
                };
                img.onerror = useFallback;
                // 网络被墙/极慢时：4 秒未加载完成则回退
                setTimeout(() => {
                    if (!(img.complete && img.naturalWidth > 0)) useFallback();
                }, 4000);
                img.src = app.logo;
                iconBox.appendChild(img);
            } else {
                iconBox.classList.add('fallback');
                iconBox.style.setProperty('--fallback-bg', app.bg || '#333');
                iconBox.textContent = app.icon || app.name.charAt(0);
            }

            // 点击打开 APP
            item.addEventListener('click', (e) => {
                if (editingMode) return;
                if (app.url) {
                    window.open(app.url, '_blank', 'noopener');
                    // 外部娱乐平台：启动娱乐计时（站内模块除外）
                    if (!app.local) startEntertainmentTimer();
                }
            });

            // 拖拽事件
            if (editingMode) {
                item.addEventListener('dragstart', handleDragStart);
                item.addEventListener('dragover', handleDragOver);
                item.addEventListener('drop', handleDrop);
                item.addEventListener('dragend', handleDragEnd);
            }

            grid.appendChild(item);
        });

        // 绑定移除按钮
        document.querySelectorAll('.app-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = parseInt(btn.dataset.index);
                removeApp(idx);
            });
        });
    }

    function removeApp(index) {
        if (index >= 0 && index < userApps.length) {
            userApps.splice(index, 1);
            saveApps();
            renderApps();
        }
    }

    function addApp(appId) {
        const app = PRESET_APPS.find(a => a.id === appId);
        if (app && !userApps.find(a => a.id === appId)) {
            userApps.push({ ...app, addedAt: new Date().toISOString() });
            saveApps();
            renderApps();
        }
    }

    function toggleEditMode() {
        editingMode = !editingMode;
        document.body.setAttribute('data-editing', editingMode);
        const btn = document.getElementById('edit-apps-btn');
        if (btn) {
            btn.classList.toggle('editing', editingMode);
        }
        renderApps();
    }

    // ========== 拖拽排序 ==========

    let draggedIndex = null;

    function handleDragStart(e) {
        draggedIndex = parseInt(e.currentTarget.dataset.index);
        e.currentTarget.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    }

    function handleDrop(e) {
        e.preventDefault();
        const targetIndex = parseInt(e.currentTarget.dataset.index);
        e.currentTarget.classList.remove('drag-over');

        if (draggedIndex !== null && draggedIndex !== targetIndex) {
            // 交换位置
            const [removed] = userApps.splice(draggedIndex, 1);
            userApps.splice(targetIndex, 0, removed);
            saveApps();
            renderApps();
        }
        draggedIndex = null;
    }

    function handleDragEnd(e) {
        document.querySelectorAll('.app-item').forEach(item => {
            item.classList.remove('dragging', 'drag-over');
        });
        draggedIndex = null;
    }

    // ========== 搜索功能 ==========

    function handleSearch() {
        const platform = document.getElementById('platform-select').value;
        const keyword = document.getElementById('search-input').value.trim();

        if (!keyword) return;

        const baseUrl = SEARCH_URLS[platform] || SEARCH_URLS.web;
        const searchUrl = baseUrl + encodeURIComponent(keyword);

        // 启动娱乐时间计时器（达到阈值后唤起冥想空间入口）
        startEntertainmentTimer();

        window.open(searchUrl, '_blank', 'noopener');
    }

    // ========== 设置面板 ==========

    function openSettings() {
        document.getElementById('settings-panel').classList.remove('hidden');

        // 高亮当前颜色
        try {
            const pref = JSON.parse(localStorage.getItem(STORAGE_KEYS.preferences) || '{}');
            document.querySelectorAll('.color-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.color === pref.color);
            });

            const mbtiSelect = document.getElementById('mbti-select');
            if (mbtiSelect && pref.mbti) {
                mbtiSelect.value = pref.mbti;
            }
        } catch (e) {}
    }

    function closeSettings() {
        document.getElementById('settings-panel').classList.add('hidden');
    }

    function handleColorSelect(color) {
        try {
            const pref = JSON.parse(localStorage.getItem(STORAGE_KEYS.preferences) || '{}');
            pref.color = color;
            localStorage.setItem(STORAGE_KEYS.preferences, JSON.stringify(pref));

            document.querySelectorAll('.color-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.color === color);
            });

            applyThemeColor();
            Animation.applySceneBackground();
        } catch (e) {}
    }

    function handleMBTISelect(mbti) {
        try {
            const pref = JSON.parse(localStorage.getItem(STORAGE_KEYS.preferences) || '{}');
            pref.mbti = mbti;
            localStorage.setItem(STORAGE_KEYS.preferences, JSON.stringify(pref));
        } catch (e) {}
    }

    function handleReset() {
        if (!confirm('确定要重置所有数据吗？这将清除你的偏好设置、用户信息和 APP 列表。')) {
            return;
        }

        Object.values(STORAGE_KEYS).forEach(key => {
            try { localStorage.removeItem(key); } catch (e) {}
        });

        location.reload();
    }

    // ========== 初始化 ==========

    function init() {
        // 登录/注册 Tab 切换
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const tab = btn.dataset.tab;
                document.getElementById('login-form').classList.toggle('hidden', tab !== 'login');
                document.getElementById('register-form').classList.toggle('hidden', tab !== 'register');
            });
        });

        // 登录/注册表单提交
        document.getElementById('login-form').addEventListener('submit', handleLogin);
        document.getElementById('register-form').addEventListener('submit', handleRegister);

        // 问卷导航
        document.getElementById('prev-btn').addEventListener('click', () => Questionnaire.prev());
        document.getElementById('next-btn').addEventListener('click', () => Questionnaire.next());

        // 搜索
        document.getElementById('search-btn').addEventListener('click', handleSearch);
        document.getElementById('search-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });

        // 设置
        document.getElementById('settings-btn').addEventListener('click', openSettings);
        document.getElementById('close-settings').addEventListener('click', closeSettings);
        document.getElementById('settings-panel').addEventListener('click', (e) => {
            if (e.target.id === 'settings-panel') closeSettings();
        });

        // 颜色选择
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', () => handleColorSelect(btn.dataset.color));
        });

        // MBTI 选择
        document.getElementById('mbti-select').addEventListener('change', (e) => {
            handleMBTISelect(e.target.value);
        });

        // 重置
        document.getElementById('reset-btn').addEventListener('click', handleReset);

        // APP 编辑
        document.getElementById('edit-apps-btn').addEventListener('click', toggleEditMode);

        // 添加 APP
        document.getElementById('add-app-btn').addEventListener('click', () => {
            const available = PRESET_APPS.filter(a => !userApps.find(ua => ua.id === a.id));
            if (available.length === 0) {
                alert('已添加所有可用的 APP');
                return;
            }
            const appNames = available.map((a, i) => `${i + 1}. ${a.name}`).join('\n');
            const choice = prompt(`选择要添加的 APP（输入编号）：\n${appNames}`);
            if (choice) {
                const idx = parseInt(choice) - 1;
                if (idx >= 0 && idx < available.length) {
                    addApp(available[idx].id);
                }
            }
        });

        // Siri 按钮点击 → 进入冥想空间
        const siriBtn = document.getElementById('siri-button');
        if (siriBtn) {
            siriBtn.addEventListener('click', () => {
                hideSiriButton();
                Meditation.enter();
            });
        }

        // 初始化冥想空间
        Meditation.init();

        // 检查登录状态
        const user = localStorage.getItem(STORAGE_KEYS.user);
        const questionnaireDone = localStorage.getItem(STORAGE_KEYS.questionnaireDone);

        if (user && questionnaireDone) {
            showHomePage();
        } else if (user) {
            showQuestionnairePage();
        } else {
            showAuthPage();
        }
    }

    return {
        init,
        showAuthPage,
        showHomePage,
        showQuestionnairePage
    };
})();

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', App.init);
