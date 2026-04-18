// ─── Hero Canvas ──────────────────────────────────────────
const themes = [
    { id: 'robotics', folder: 'hero-frames-robotics', start: 1, end: 207 },
    { id: 'phms',     folder: 'hero-frames-phms',     start: 1, end: 208 },
    { id: 'vfd',      folder: 'hero-frames-vfd',      start: 1, end: 222 }
];
let currentThemeIndex = 0;
const imagesCache = { robotics: [], phms: [], vfd: [] };

const canvas = document.getElementById('hero-canvas');
const context = canvas.getContext('2d');
const slides = document.querySelectorAll('.hero-slide');
const indicators = document.querySelectorAll('.indicator');

const preloadTheme = (index) => {
    const theme = themes[index];
    const cache = imagesCache[theme.id];
    if (cache.length > 0) return;
    for (let i = theme.start; i <= theme.end; i++) {
        const img = new Image();
        img.src = `/hero-main-frames/${theme.folder}/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;
        cache.push(img);
    }
};

preloadTheme(0);
setTimeout(() => preloadTheme(1), 2000);
setTimeout(() => preloadTheme(2), 4000);

function drawImageCover(ctx, img) {
    const c = ctx.canvas;
    const r = Math.max(c.width / img.width, c.height / img.height);
    const cx = (c.width - img.width * r) / 2;
    const cy = (c.height - img.height * r) / 2;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(img, 0, 0, img.width, img.height, cx, cy, img.width * r, img.height * r);
}

function updateCanvas(frameIndex) {
    const cache = imagesCache[themes[currentThemeIndex].id];
    const img = cache[frameIndex];
    if (img && img.complete) drawImageCover(context, img);
    else if (img) img.onload = () => drawImageCover(context, img);
}

function switchTheme(index) {
    if (index === currentThemeIndex) return;
    slides[currentThemeIndex].classList.remove('active');
    indicators[currentThemeIndex].classList.remove('active');
    currentThemeIndex = index;
    slides[currentThemeIndex].classList.add('active');
    indicators[currentThemeIndex].classList.add('active');
    updateCanvas(0);
}

document.getElementById('next-hero').onclick = () => { switchTheme((currentThemeIndex + 1) % themes.length); resetAutoplay(); };
document.getElementById('prev-hero').onclick = () => { switchTheme((currentThemeIndex - 1 + themes.length) % themes.length); resetAutoplay(); };
indicators.forEach((ind, i) => ind.onclick = () => { switchTheme(i); resetAutoplay(); });

let autoplayTimer = null, scrollPauseTimer = null;

function startAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => switchTheme((currentThemeIndex + 1) % themes.length), 5000);
}
function stopAutoplay() { clearInterval(autoplayTimer); autoplayTimer = null; }
function resetAutoplay() { stopAutoplay(); clearTimeout(scrollPauseTimer); scrollPauseTimer = setTimeout(startAutoplay, 2000); }

startAutoplay();

window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
        stopAutoplay();
        clearTimeout(scrollPauseTimer);
        scrollPauseTimer = setTimeout(startAutoplay, 2000);
    }
}, { passive: true });

function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; updateCanvas(0); }
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            const heroSequence = document.getElementById('hero-sequence');
            const maxScroll = heroSequence.scrollHeight - window.innerHeight;
            if (maxScroll > 0) {
                const fraction = Math.max(0, Math.min(1, window.scrollY / maxScroll));
                const cache = imagesCache[themes[currentThemeIndex].id];
                if (cache.length > 0) updateCanvas(Math.min(cache.length - 1, Math.floor(fraction * cache.length)));
            }
            ticking = false;
        });
        ticking = true;
    }
});

// ─── Scroll Reveal ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                entry.target.querySelectorAll('.stat-number[data-target]').forEach(el => animateCounter(el, parseInt(el.dataset.target)));
            }
        });
    }, { threshold: 0.08 });
    document.querySelectorAll('.fade-section').forEach(s => observer.observe(s));
});

// ─── Counter Animation ────────────────────────────────────
function animateCounter(el, target) {
    let start = 0;
    const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / 1400, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + '+';
        if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

// ─── Process Steps Stagger ────────────────────────────────
const processObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.process-step, .process-arrow').forEach((el, i) => {
                setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, i * 80);
            });
        }
    });
}, { threshold: 0.2 });

const innovationEl = document.getElementById('innovation-section');
if (innovationEl) {
    innovationEl.querySelectorAll('.process-step, .process-arrow').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    processObserver.observe(innovationEl);
}

// ─── File Drop Zone ───────────────────────────────────────
const dropZone = document.getElementById('file-drop-zone');
const fileInput = document.getElementById('resume-upload');
const dropContent = document.getElementById('file-drop-content');

function showFile(file) {
    dropContent.innerHTML = `
        <span class="material-icons file-drop-icon" style="color:#fff">description</span>
        <p class="file-drop-text" style="color:#fff;font-weight:600">${file.name}</p>
        <p class="file-drop-hint">${(file.size / 1024).toFixed(0)} KB — <span class="file-drop-browse">Change</span></p>
    `;
}

if (dropZone && fileInput) {
    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', e => {
        e.preventDefault(); dropZone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file) { fileInput.files = e.dataTransfer.files; showFile(file); }
    });
    fileInput.addEventListener('change', () => { if (fileInput.files[0]) showFile(fileInput.files[0]); });
}

// ─── Careers Form Submit ──────────────────────────────────
document.getElementById('collaboration-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn = document.getElementById('careers-submit-btn');
    const label = document.getElementById('careers-submit-label');
    btn.disabled = true;
    label.textContent = 'SENDING…';
    try {
        const res = await fetch('/api/careers', { method: 'POST', body: new FormData(this) });
        const json = await res.json();
        if (json.success) {
            label.textContent = 'APPLICATION SENT!';
            btn.style.background = '#1a1a1a';
            launchConfetti();
            this.reset();
            dropContent.innerHTML = `
                <span class="material-icons file-drop-icon">cloud_upload</span>
                <p class="file-drop-text">Drop your resume here or <span class="file-drop-browse">browse</span></p>
                <p class="file-drop-hint">PDF, DOC or DOCX — max 5 MB</p>
            `;
        } else {
            label.textContent = 'APPLY NOW'; btn.disabled = false;
            alert(json.message || 'Something went wrong. Please try again.');
        }
    } catch {
        label.textContent = 'APPLY NOW'; btn.disabled = false;
        alert('Network error. Please try again.');
    }
});

// ─── News Modal ───────────────────────────────────────────
window.openNewsModal = function (card) {
    document.getElementById('nm-num').textContent = card.dataset.newsNum;
    document.getElementById('nm-title').textContent = card.dataset.newsTitle;
    document.getElementById('nm-desc').textContent = card.dataset.newsDesc;
    document.getElementById('nm-full').textContent = card.dataset.newsFull;
    document.getElementById('news-modal-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
};
window.closeNewsModal = function () {
    document.getElementById('news-modal-overlay').classList.remove('open');
    document.body.style.overflow = '';
};
document.addEventListener('keydown', e => { if (e.key === 'Escape') window.closeNewsModal(); });

// ─── Confetti ─────────────────────────────────────────────
function launchConfetti() {
    const c = document.createElement('canvas');
    c.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999999';
    document.body.appendChild(c);
    const ctx = c.getContext('2d');
    c.width = window.innerWidth; c.height = window.innerHeight;
    const colors = ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#c77dff','#ff9f1c','#fff'];
    const particles = Array.from({ length: 160 }, () => ({
        x: Math.random() * c.width, y: -20 - Math.random() * 80,
        w: Math.random() * 12 + 5, h: Math.random() * 7 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 4, vy: Math.random() * 5 + 2,
        rot: Math.random() * Math.PI * 2, rotV: (Math.random() - 0.5) * 0.18, gravity: 0.06
    }));
    const start = performance.now();
    function draw(now) {
        ctx.clearRect(0, 0, c.width, c.height);
        particles.forEach(p => {
            p.vy += p.gravity; p.x += p.vx; p.y += p.vy; p.rot += p.rotV;
            ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, 1 - (now - start) / 3200);
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        });
        if (now - start < 3500) requestAnimationFrame(draw); else c.remove();
    }
    requestAnimationFrame(draw);
}

// ─── Footer Particle Text ─────────────────────────────────
window.addEventListener('DOMContentLoaded', function () {
    const revealCanvas = document.getElementById('canvas');
    if (!revealCanvas) return;
    const revealCtx = revealCanvas.getContext('2d');
    const revealWrapper = document.getElementById('wrapper');
    let particles = [], hovered = false;

    function resizeReveal() {
        revealCanvas.width = revealWrapper.offsetWidth;
        revealCanvas.height = revealWrapper.offsetHeight;
        createParticles();
    }

    function createParticles() {
        revealCtx.clearRect(0, 0, revealCanvas.width, revealCanvas.height);
        revealCtx.fillStyle = '#fff';
        revealCtx.font = '90px sans-serif';
        revealCtx.textAlign = 'center';
        revealCtx.textBaseline = 'middle';
        revealCtx.fillText('Humans × AI', revealCanvas.width / 2, revealCanvas.height / 2);
        const data = revealCtx.getImageData(0, 0, revealCanvas.width, revealCanvas.height).data;
        particles = [];
        for (let y = 0; y < revealCanvas.height; y += 3) {
            for (let x = 0; x < revealCanvas.width; x += 3) {
                if (data[(y * revealCanvas.width + x) * 4 + 3] > 150) {
                    particles.push({
                        x, y: revealCanvas.height / 2 + (Math.random() - 0.5) * 20,
                        baseX: x, baseY: y,
                        vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2,
                        opacity: 0.6
                    });
                }
            }
        }
    }

    function animateReveal() {
        revealCtx.clearRect(0, 0, revealCanvas.width, revealCanvas.height);
        particles.forEach(p => {
            if (hovered) {
                p.opacity += (0 - p.opacity) * 0.2;
            } else {
                p.x += Math.sin(Date.now() * 0.001 + p.baseX) * 0.2;
                p.y += Math.cos(Date.now() * 0.001 + p.baseY) * 0.2;
                p.opacity += (0.6 - p.opacity) * 0.05;
                if (Math.abs(p.y - revealCanvas.height / 2) > 25)
                    p.y = revealCanvas.height / 2 + (Math.random() - 0.5) * 20;
            }
            if (p.opacity > 0.02) {
                revealCtx.fillStyle = `rgba(255,255,255,${p.opacity})`;
                revealCtx.fillRect(p.x, p.y, 2, 2);
            }
        });
        requestAnimationFrame(animateReveal);
    }

    revealWrapper.addEventListener('mouseenter', () => hovered = true);
    revealWrapper.addEventListener('mouseleave', () => hovered = false);
    window.addEventListener('resize', resizeReveal);
    resizeReveal();
    animateReveal();
})();
