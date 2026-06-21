/* ============================
   tryrevive — 问卷系统
   管理问卷的展示、答案收集、进度
   ============================ */

const Questionnaire = (function() {
    let currentIndex = 0;
    let answers = {};

    // ---- 渲染当前问题 ----
    function render() {
        const item = QUESTIONNAIRE_ITEMS[currentIndex];
        const content = document.getElementById('question-content');
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');

        // 更新进度
        const progress = ((currentIndex + 1) / QUESTIONNAIRE_ITEMS.length) * 100;
        progressFill.style.width = progress + '%';
        progressText.textContent = `${currentIndex + 1} / ${QUESTIONNAIRE_ITEMS.length}`;

        // 渲染问题内容
        let html = `
            <div class="question-label">${item.label}</div>
            <h2 class="question-title">${item.title}</h2>
            <p class="question-subtitle">${item.subtitle}</p>
        `;

        if (item.type === 'color') {
            html += '<div class="color-options">';
            COLOR_OPTIONS.forEach((color, idx) => {
                const selected = answers.color === color.value ? 'selected' : '';
                html += `
                    <div class="color-option ${selected}"
                         data-value="${color.value}"
                         data-name="${color.name}"
                         style="background: ${color.gradient}; box-shadow: inset 0 1px 0 rgba(255,255,255,0.2);">
                    </div>
                `;
            });
            html += '</div>';
        } else if (item.type === 'choice') {
            html += '<div class="question-options">';
            item.options.forEach((opt, idx) => {
                const key = `q${currentIndex}`;
                const selected = answers[key] === opt.value ? 'selected' : '';
                html += `
                    <button class="question-option ${selected}" data-value="${opt.value}">
                        <span class="option-marker"></span>
                        <span>${opt.text}</span>
                    </button>
                `;
            });
            html += '</div>';
        }

        content.innerHTML = html;
        content.style.animation = 'none';
        requestAnimationFrame(() => {
            content.style.animation = 'fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        });

        bindEvents(item.type);
    }

    // ---- 绑定选项点击事件 ----
    function bindEvents(type) {
        if (type === 'color') {
            document.querySelectorAll('.color-option').forEach(opt => {
                opt.addEventListener('click', () => {
                    document.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
                    opt.classList.add('selected');
                    answers.color = opt.dataset.value;
                    answers.colorName = opt.dataset.name;
                });
            });
        } else if (type === 'choice') {
            document.querySelectorAll('.question-option').forEach(opt => {
                opt.addEventListener('click', () => {
                    document.querySelectorAll('.question-option').forEach(o => o.classList.remove('selected'));
                    opt.classList.add('selected');
                    answers[`q${currentIndex}`] = opt.dataset.value;
                });
            });
        }
    }

    // ---- 上一题 ----
    function prev() {
        if (currentIndex > 0) {
            currentIndex--;
            render();
        }
    }

    // ---- 下一题 ----
    function next() {
        // 检查当前是否有答案
        const item = QUESTIONNAIRE_ITEMS[currentIndex];
        let answered = false;

        if (item.type === 'color') {
            answered = !!answers.color;
        } else {
            answered = !!answers[`q${currentIndex}`];
        }

        if (!answered) {
            // 轻微摇晃提示
            const content = document.getElementById('question-content');
            content.style.animation = 'none';
            requestAnimationFrame(() => {
                content.style.animation = 'fadeInUp 0.3s ease';
            });
            return;
        }

        if (currentIndex < QUESTIONNAIRE_ITEMS.length - 1) {
            currentIndex++;
            render();
        } else {
            // 完成问卷
            finish();
        }
    }

    // ---- 完成问卷 ----
    function finish() {
        // 根据答案推断 MBTI 倾向（简化版）
        let mbti = '';
        const e_i = answers.q1;
        const s_n = answers.q2;
        const t_f = answers.q3;
        const j_p = answers.q4;

        // 简单映射
        const mapEI = { 'I': 'I', 'E-leaning': 'E', 'balanced': 'I' };
        const mapSN = { 'S': 'S', 'N': 'N', 'balanced': 'N' };
        const mapTF = { 'T': 'T', 'F': 'F', 'balanced': 'T' };
        const mapJP = { 'J': 'J', 'P': 'P', 'balanced': 'J' };

        mbti = (mapEI[e_i] || 'I') + (mapSN[s_n] || 'N') + (mapTF[t_f] || 'T') + (mapJP[j_p] || 'J');

        // 保存偏好设置
        const preferences = {
            color: answers.color || '#4a90e2',
            colorName: answers.colorName || '深海蓝',
            mbti: mbti,
            questionnaireCompleted: true,
            completedAt: new Date().toISOString()
        };

        try {
            localStorage.setItem(STORAGE_KEYS.preferences, JSON.stringify(preferences));
            localStorage.setItem(STORAGE_KEYS.questionnaireDone, 'true');
        } catch (e) {
            console.warn('保存偏好失败:', e);
        }

        // 跳转到主页
        App.showHomePage();
    }

    // ---- 初始化问卷页面 ----
    function init() {
        currentIndex = 0;
        answers = {};
        render();
    }

    return { init, prev, next };
})();
