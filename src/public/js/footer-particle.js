(function () {
    const revealCanvas = document.getElementById("canvas");
    const revealCtx = revealCanvas.getContext("2d");
    const revealWrapper = document.getElementById("wrapper");
    let particles = [], hovered = false;
    const text = "Humans \u00d7 AI";
    let fontSize = window.innerWidth <= 768 ? 44 : 64;

    function updateFontSize() { fontSize = window.innerWidth <= 768 ? 44 : 64; }

    function resizeReveal() {
        updateFontSize();
        revealCanvas.width = revealWrapper.offsetWidth;
        revealCanvas.height = revealWrapper.offsetHeight;
        createParticles();
    }

    function createParticles() {
        revealCtx.clearRect(0, 0, revealCanvas.width, revealCanvas.height);
        revealCtx.fillStyle = "#fff";
        revealCtx.font = fontSize + "px sans-serif";
        revealCtx.textAlign = "center";
        revealCtx.textBaseline = "middle";
        revealCtx.fillText(text, revealCanvas.width / 2, revealCanvas.height / 2);
        const imageData = revealCtx.getImageData(0, 0, revealCanvas.width, revealCanvas.height).data;
        particles = [];
        for (let y = 0; y < revealCanvas.height; y += 3) {
            for (let x = 0; x < revealCanvas.width; x += 3) {
                const i = (y * revealCanvas.width + x) * 4;
                if (imageData[i + 3] > 150) {
                    particles.push({ x, y: revealCanvas.height / 2 + (Math.random() - 0.5) * 20, baseX: x, baseY: y, vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2, opacity: 0.6 });
                }
            }
        }
    }

    function animateReveal() {
        revealCtx.clearRect(0, 0, revealCanvas.width, revealCanvas.height);
        particles.forEach(p => {
            if (hovered) { p.opacity += (0 - p.opacity) * 0.2; }
            else {
                p.x += p.vx * 0.2; p.y += p.vy * 0.2;
                p.x += Math.sin(Date.now() * 0.001 + p.baseX) * 0.2;
                p.y += Math.cos(Date.now() * 0.001 + p.baseY) * 0.2;
                p.opacity += (0.6 - p.opacity) * 0.05;
                if (Math.abs(p.y - revealCanvas.height / 2) > 25) p.y = revealCanvas.height / 2 + (Math.random() - 0.5) * 20;
            }
            if (p.opacity > 0.02) { revealCtx.fillStyle = "rgba(255,255,255," + p.opacity + ")"; revealCtx.fillRect(p.x, p.y, 2, 2); }
        });
        requestAnimationFrame(animateReveal);
    }

    const showText = () => { hovered = true; };
    const hideText = () => { hovered = false; };
    revealWrapper.addEventListener("mouseenter", showText);
    revealWrapper.addEventListener("mouseleave", hideText);
    revealWrapper.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") showText(); });
    revealWrapper.addEventListener("pointerup", (e) => { if (e.pointerType !== "mouse") hideText(); });
    revealWrapper.addEventListener("pointercancel", hideText);
    window.addEventListener("resize", resizeReveal);
    resizeReveal();
    animateReveal();
})();
