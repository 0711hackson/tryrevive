/* ============================
   tryrevive — 冥想空间
   ============================ */

const Meditation = (function() {
    let starInterval = null;
    let shootingStarTimer = null;
    let bubbleCooldown = false;

    // 生成星星
    function generateStars(count) {
        const container = document.getElementById('meditation-stars');
        if (!container) return;
        container.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.className = 'meditation-star';
            const size = Math.random() * 2 + 1;
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.setProperty('--twinkle-duration', (Math.random() * 3 + 2) + 's');
            star.style.setProperty('--twinkle-delay', Math.random() * 3 + 's');
            container.appendChild(star);
        }
    }

    // 生成流星
    function createShootingStar() {
        const container = document.getElementById('meditation-shooting-stars');
        if (!container) return;

        const star = document.createElement('div');
        star.className = 'shooting-star';

        // 随机起点（四个角落之一）
        const corners = [
            { top: Math.random() * 30 + '%', left: '-5%', angle: 20 },
            { top: Math.random() * 30 + '%', left: '105%', angle: 160 },
            { top: '-5%', left: Math.random() * 50 + '%', angle: 65 },
            { top: '-5%', left: Math.random() * 50 + 50 + '%', angle: 115 }
        ];
        const corner = corners[Math.floor(Math.random() * corners.length)];
        star.style.top = corner.top;
        star.style.left = corner.left;

        // 尾迹角度
        star.style.setProperty('--trail-angle', corner.angle + 'deg');

        container.appendChild(star);

        // 用 animation 让流星划过
        const duration = 1200 + Math.random() * 800;
        const endTop = parseFloat(corner.top) + 60;
        const endLeft = corner.left === '-5%' ? 105 : (corner.left === '105%' ? -5 : parseFloat(corner.left) + 40);

        star.animate([
            { transform: 'translate(0, 0)', opacity: 0 },
            { transform: 'translate(20px, 20px)', opacity: 1, offset: 0.1 },
            { transform: `translate(${endLeft - parseFloat(corner.left)}vw, ${endTop}vh)`, opacity: 0 }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.4, 0, 0.6, 1)'
        });

        setTimeout(() => star.remove(), duration + 100);
    }

    function scheduleShootingStar() {
        const delay = Math.random() * 10000 + 5000; // 5-15秒
        shootingStarTimer = setTimeout(() => {
            createShootingStar();
            scheduleShootingStar();
        }, delay);
    }

    // 生成文字气泡
    function createBubble() {
        if (bubbleCooldown) return;
        bubbleCooldown = true;
        setTimeout(() => { bubbleCooldown = false; }, 1500);

        const container = document.getElementById('meditation-bubbles');
        if (!container) return;

        const messages = MEDITATION_MESSAGES || ['静下心来'];
        const text = messages[Math.floor(Math.random() * messages.length)];

        const bubble = document.createElement('div');
        bubble.className = 'meditation-bubble';
        bubble.textContent = text;

        // 随机水平偏移
        const offsetX = (Math.random() - 0.5) * 200;
        bubble.style.marginLeft = offsetX + 'px';

        container.appendChild(bubble);

        setTimeout(() => bubble.remove(), 6000);
    }

    // 进入冥想空间
    function enter() {
        const page = document.getElementById('meditation-page');
        if (!page) return;
        page.classList.remove('hidden');
        generateStars(150);
        scheduleShootingStar();
    }

    // 退出冥想空间
    function exit() {
        const page = document.getElementById('meditation-page');
        if (!page) return;
        page.classList.add('hidden');
        if (shootingStarTimer) {
            clearTimeout(shootingStarTimer);
            shootingStarTimer = null;
        }
        // 清理星星和气泡
        const stars = document.getElementById('meditation-stars');
        const bubbles = document.getElementById('meditation-bubbles');
        if (stars) stars.innerHTML = '';
        if (bubbles) bubbles.innerHTML = '';
    }

    // 初始化
    function init() {
        // 冥想空间底部按钮 → 生成文字气泡
        const triggerBtn = document.getElementById('meditation-trigger-btn');
        if (triggerBtn) {
            triggerBtn.addEventListener('click', createBubble);
        }

        // 退出按钮
        const closeBtn = document.getElementById('meditation-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', exit);
        }
    }

    return { init, enter, exit, createBubble };
})();
