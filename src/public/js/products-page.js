// ─── Industrial Drives Readout Animation ──────────────────
const readout = document.getElementById('vfd-readout');
if (readout) {
    let freq = 50.0, dir = 1;
    setInterval(() => {
        freq += dir * (Math.random() * 0.3);
        if (freq > 60) dir = -1;
        if (freq < 30) dir = 1;
        readout.textContent = freq.toFixed(1) + ' Hz';
    }, 800);
}

// ─── Scroll Reveal ────────────────────────────────────────
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in');
            entry.target.querySelectorAll('.feature-chip, .tech-pill').forEach((el, i) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(16px)';
                el.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`;
                setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'none'; }, 100 + i * 60);
            });
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
