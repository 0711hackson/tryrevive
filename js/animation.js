/* ============================
   tryrevive — 火柴人动画 & 状态管理
   处理三种状态的切换、气泡提问
   ============================ */

const Animation = (function() {
    let currentState = 'gray';
    let bubbleTimer = null;
    let bubbleShown = false;

    // ---- 根据 MBTI 获取随机提问 ----
    function getRandomQuestion(mbti) {
        const questions = MBTI_QUESTIONS[mbti] || MBTI_QUESTIONS.default;
        return questions[Math.floor(Math.random() * questions.length)];
    }

    // ---- 设置状态（black / gray / white） ----
    function setState(state) {
        if (!['black', 'gray', 'white'].includes(state)) return;
        currentState = state;
        document.body.setAttribute('data-state', state);

        // 更新状态文本
        const statusText = document.getElementById('status-text');
        if (statusText) {
            statusText.textContent = STATE_TEXTS[state];
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
        // 默认 gray
        let state = 'gray';

        try {
            const saved = localStorage.getItem(STORAGE_KEYS.state);
            if (saved) {
                const data = JSON.parse(saved);
                state = data.state || 'gray';

                // 如果状态是 24 小时前设置的，重置为 gray
                if (data.updatedAt) {
                    const hoursPassed = (new Date() - new Date(data.updatedAt)) / (1000 * 60 * 60);
                    if (hoursPassed > 24) {
                        state = 'gray';
                    }
                }
            }
        } catch (e) {}

        return state;
    }

    // ---- 显示气泡提问 ----
    function showBubble(customText) {
        const bubble = document.getElementById('question-bubble');
        const bubbleText = document.getElementById('bubble-text');

        if (!bubble || !bubbleText) return;

        // 获取偏好中的 MBTI
        let mbti = '';
        try {
            const pref = JSON.parse(localStorage.getItem(STORAGE_KEYS.preferences) || '{}');
            mbti = pref.mbti || '';
        } catch (e) {}

        bubbleText.textContent = customText || getRandomQuestion(mbti);
        bubble.classList.remove('hidden');

        // 30 秒后自动隐藏
        setTimeout(() => {
            bubble.classList.add('hidden');
        }, 30000);
    }

    // ---- 隐藏气泡 ----
    function hideBubble() {
        const bubble = document.getElementById('question-bubble');
        if (bubble) {
            bubble.classList.add('hidden');
        }
    }

    // ---- 设置定期气泡（可选，在页面加载后一段时间弹出） ----
    function scheduleBubble(delay) {
        if (bubbleTimer) clearTimeout(bubbleTimer);
        bubbleTimer = setTimeout(() => {
            if (!bubbleShown) {
                showBubble();
                bubbleShown = true;
            }
        }, delay || 15000); // 默认15秒后首次提问
    }

    // ---- 处理用户在气泡中的反馈 ----
    function handleFeeling(feeling) {
        // 根据反馈调整状态
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

        // 显示反馈提示（短暂显示）
        setTimeout(() => {
            const bubbleText = document.getElementById('bubble-text');
            const bubble = document.getElementById('question-bubble');
            if (bubbleText && bubble) {
                bubbleText.textContent = message;
                bubble.classList.remove('hidden');
                // 隐藏选项按钮
                const opts = bubble.querySelector('.bubble-options');
                if (opts) opts.style.display = 'none';

                setTimeout(() => {
                    bubble.classList.add('hidden');
                    if (opts) opts.style.display = 'flex';
                }, 2500);
            }
        }, 300);
    }

    // ---- 初始化动画 ----
    function init() {
        const initialState = inferInitialState();
        setState(initialState);

        // 绑定气泡选项点击
        document.querySelectorAll('.bubble-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const feeling = btn.dataset.feeling;
                handleFeeling(feeling);
            });
        });

        // 定时弹出气泡
        scheduleBubble(20000);
    }

    // ---- 手动切换状态（测试用） ----
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
        cycleState
    };
})();
