/* ============================
   tryrevive — 火柴人动画 & 状态管理
   俯视视角 / 圆嘟嘟火柴人 / 三态动画
   眼泪滴落汇聚 / 水波纹 / 状态切换
   ============================ */

const Animation = (function() {
    let currentState = 'gray';
    let bubbleTimer = null;
    let bubbleShown = false;
    let tearDropTimer = null;
    let messageRotateTimer = null;
    let puddleSize = 0; // 水滩大小累积

    // ---- 获取随机状态文字 ----
    function getRandomMessage(state) {
        const messages = STATE_MESSAGES[state] || STATE_MESSAGES.gray;
        return messages[Math.floor(Math.random() * messages.length)];
    }

    // ---- 根据 MBTI 获取随机提问 ----
    function getRandomQuestion(mbti) {
        const questions = MBTI_QUESTIONS[mbti] || MBTI_QUESTIONS.default;
        return questions[Math.floor(Math.random() * questions.length)];
    }

    // ---- 更新状态文字 ----
    function updateMessage(state) {
        const messageText = document.getElementById('message-text');
        if (!messageText) return;

        const msg = getRandomMessage(state);
        messageText.style.opacity = '0';
        messageText.style.transform = 'translateY(8px)';

        setTimeout(() => {
            messageText.textContent = msg;
            messageText.style.opacity = '1';
            messageText.style.transform = 'translateY(0)';
        }, 400);
    }

    // ---- 设置状态（black / gray / white） ----
    function setState(state) {
        if (!['black', 'gray', 'white'].includes(state)) return;

        const prevState = currentState;
        currentState = state;
        document.body.setAttribute('data-state', state);

        // 更新状态文字
        updateMessage(state);

        // 更新切换按钮高亮
        document.querySelectorAll('.state-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.state === state);
        });

        // 状态切换时清除水滩（除非是黑色状态）
        if (state !== 'black') {
            clearPuddles();
            stopTearDrops();
        } else {
            // 黑色状态开始滴泪
            startTearDrops();
        }

        // 保存到 localStorage
        try {
            localStorage.setItem(STORAGE_KEYS.state, JSON.stringify({
                state: state,
                updatedAt: new Date().toISOString()
            }));
        } catch (e) {}
    }

    // ---- 获取当前状态 ----
    function getState() {
        return currentState;
    }

    // ---- 根据用户数据推断初始状态 ----
    function inferInitialState() {
        let state = 'gray';
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.state);
            if (saved) {
                const data = JSON.parse(saved);
                state = data.state || 'gray';
                if (data.updatedAt) {
                    const hoursPassed = (new Date() - new Date(data.updatedAt)) / (1000 * 60 * 60);
                    if (hoursPassed > 24) state = 'gray';
                }
            }
        } catch (e) {}
        return state;
    }

    // ============================
    // 眼泪滴落系统
    // ============================

    function startTearDrops() {
        stopTearDrops();
        createTearDrop();
        // 每隔一段时间滴一滴
        tearDropTimer = setInterval(createTearDrop, 1800);
    }

    function stopTearDrops() {
        if (tearDropTimer) {
            clearInterval(tearDropTimer);
            tearDropTimer = null;
        }
    }

    function createTearDrop() {
        if (currentState !== 'black') return;

        const layer = document.getElementById('tear-drop-layer');
        if (!layer) return;

        const tear = document.createElement('div');
        tear.className = 'tear-drop';

        // 随机左右位置（火柴人头部下方）
        const isLeft = Math.random() > 0.5;
        const offsetX = isLeft ? -8 + (Math.random() * 4) : 8 + (Math.random() * 4);
        tear.style.left = `calc(50% + ${offsetX}px)`;
        tear.style.top = '38%';

        // 随机大小（根据时间累积，越久越大）
        const size = 4 + Math.random() * 3 + Math.min(puddleSize * 0.3, 4);
        tear.style.width = size + 'px';
        tear.style.height = (size * 1.4) + 'px';

        layer.appendChild(tear);

        // 触发下落动画
        requestAnimationFrame(() => {
            tear.classList.add('falling');
        });

        // 落地后移除并增加水滩
        setTimeout(() => {
            tear.remove();
            addToPuddle();
        }, 1400);
    }

    function addToPuddle() {
        puddleSize += 1;
        const puddleLayer = document.getElementById('puddle-layer');
        if (!puddleLayer) return;

        let puddle = puddleLayer.querySelector('.puddle');
        if (!puddle) {
            puddle = document.createElement('div');
            puddle.className = 'puddle';
            puddleLayer.appendChild(puddle);
        }

        // 水滩随时间增长
        const size = Math.min(20 + puddleSize * 8, 120);
        puddle.style.width = size + 'px';
        puddle.style.height = (size * 0.3) + 'px';
        puddle.style.opacity = Math.min(0.15 + puddleSize * 0.05, 0.5);

        // 水滩波纹效果
        puddle.classList.add('ripple-expand');
        setTimeout(() => puddle.classList.remove('ripple-expand'), 600);
    }

    function clearPuddles() {
        puddleSize = 0;
        const puddleLayer = document.getElementById('puddle-layer');
        if (puddleLayer) {
            const puddle = puddleLayer.querySelector('.puddle');
            if (puddle) {
                puddle.classList.add('fade-out');
                setTimeout(() => puddle.remove(), 800);
            }
        }
    }

    // ============================
    // 水波纹效果（鼠标移动触发）
    // ============================

    let lastRippleTime = 0;
    const RIPPLE_THROTTLE = 120; // 节流间隔 ms

    function createRipple(x, y) {
        const rippleLayer = document.getElementById('ripple-layer');
        if (!rippleLayer) return;

        // 根据状态设置波纹参数
        const stateConfig = {
            black: { maxSize: 300, borderWidth: '3px', duration: '2.5s', opacity: 0.7 },
            gray: { maxSize: 200, borderWidth: '2px', duration: '2s', opacity: 0.5 },
            white: { maxSize: 120, borderWidth: '1px', duration: '1.2s', opacity: 0.4 }
        };
        const config = stateConfig[currentState] || stateConfig.gray;

        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.setProperty('--ripple-max-size', config.maxSize + 'px');
        ripple.style.setProperty('--ripple-border-width', config.borderWidth);
        ripple.style.setProperty('--ripple-duration', config.duration);
        ripple.style.setProperty('--ripple-opacity', config.opacity);

        rippleLayer.appendChild(ripple);
        setTimeout(() => ripple.remove(), parseFloat(config.duration) * 1000 + 100);
    }

    // 鼠标移动时触发水波纹（节流）
    function handleMouseMove(e) {
        const now = Date.now();
        if (now - lastRippleTime < RIPPLE_THROTTLE) return;
        lastRippleTime = now;

        // 排除搜索栏区域
        const searchArea = document.querySelector('.search-section') || document.querySelector('header');
        if (searchArea) {
            const rect = searchArea.getBoundingClientRect();
            if (e.clientY >= rect.top && e.clientY <= rect.bottom) return;
        }

        createRipple(e.clientX, e.clientY);
    }

    // ============================
    // 气泡提问系统
    // ============================

    function showBubble(customText) {
        const bubble = document.getElementById('question-bubble');
        const bubbleText = document.getElementById('bubble-text');
        if (!bubble || !bubbleText) return;

        let mbti = '';
        try {
            const pref = JSON.parse(localStorage.getItem(STORAGE_KEYS.preferences) || '{}');
            mbti = pref.mbti || '';
        } catch (e) {}

        bubbleText.textContent = customText || getRandomQuestion(mbti);
        bubble.classList.remove('hidden');

        setTimeout(() => bubble.classList.add('hidden'), 30000);
    }

    function hideBubble() {
        const bubble = document.getElementById('question-bubble');
        if (bubble) bubble.classList.add('hidden');
    }

    function scheduleBubble(delay) {
        if (bubbleTimer) clearTimeout(bubbleTimer);
        bubbleTimer = setTimeout(() => {
            if (!bubbleShown) {
                showBubble();
                bubbleShown = true;
            }
        }, delay || 15000);
    }

    function handleFeeling(feeling) {
        let newState = currentState;
        let message = '';

        switch (feeling) {
            case 'good':
                newState = 'white';
                message = '太棒了！保持这种状态 ✨';
                break;
            case 'okay':
                newState = 'gray';
                message = '慢慢来，节奏刚刚好 🌿';
                break;
            case 'low':
                newState = 'black';
                message = '没关系，给自己一些时间 💙';
                break;
        }

        setState(newState);
        hideBubble();

        setTimeout(() => {
            const bubbleText = document.getElementById('bubble-text');
            const bubble = document.getElementById('question-bubble');
            if (bubbleText && bubble) {
                bubbleText.textContent = message;
                bubble.classList.remove('hidden');
                const opts = bubble.querySelector('.bubble-options');
                if (opts) opts.style.display = 'none';
                setTimeout(() => {
                    bubble.classList.add('hidden');
                    if (opts) opts.style.display = 'flex';
                }, 2500);
            }
        }, 300);
    }

    // ============================
    // 状态文字定时轮换
    // ============================

    function startMessageRotation() {
        if (messageRotateTimer) clearInterval(messageRotateTimer);
        // 每 20 秒换一次文字
        messageRotateTimer = setInterval(() => {
            updateMessage(currentState);
        }, 20000);
    }

    // ============================
    // 应用用户偏好色到场景背景
    // ============================

    function applySceneBackground() {
        try {
            const pref = JSON.parse(localStorage.getItem(STORAGE_KEYS.preferences) || '{}');
            const color = pref.color || '#4a90e2';

            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);

            // 水波纹颜色跟随偏好色
            document.documentElement.style.setProperty('--ripple-color', `rgba(${r}, ${g}, ${b}, 0.35)`);

            // 桌宠脚下柔光跟随偏好色
            const petCorner = document.getElementById('pet-corner');
            if (petCorner) {
                petCorner.style.background =
                    `radial-gradient(ellipse at 50% 78%, rgba(${r}, ${g}, ${b}, 0.10) 0%, transparent 70%)`;
            }
        } catch (e) {
            console.warn('应用场景背景失败:', e);
        }
    }

    // ============================
    // 初始化
    // ============================

    function init() {
        const initialState = inferInitialState();
        setState(initialState);

        // 应用用户偏好色到场景背景
        applySceneBackground();

        // 绑定气泡选项
        document.querySelectorAll('.bubble-option').forEach(btn => {
            btn.addEventListener('click', () => {
                handleFeeling(btn.dataset.feeling);
            });
        });

        // 绑定状态切换按钮
        document.querySelectorAll('.state-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                setState(btn.dataset.state);
            });
        });

        // 鼠标移动触发水波纹（晕染效果，覆盖整个页面）
        document.addEventListener('mousemove', handleMouseMove);

        // 定时弹出气泡
        scheduleBubble(20000);

        // 启动文字轮换
        startMessageRotation();
    }

    // ---- 手动切换状态 ----
    function cycleState() {
        const states = ['black', 'gray', 'white'];
        const idx = states.indexOf(currentState);
        setState(states[(idx + 1) % states.length]);
    }

    return {
        init,
        setState,
        getState,
        showBubble,
        hideBubble,
        handleFeeling,
        cycleState,
        createRipple,
        applySceneBackground
    };
})();
