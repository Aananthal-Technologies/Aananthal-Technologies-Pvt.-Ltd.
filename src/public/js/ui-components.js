// ui-components.js — Trending UI Interactions
(function () {
  'use strict';

  // ── 1. Magnetic Buttons ─────────────────────────────────────
  function initMagnetic() {
    document.querySelectorAll('.btn-magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${dx * 0.28}px, ${dy * 0.28}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  // ── 2. Button Ripple ────────────────────────────────────────
  function initRipple() {
    document.querySelectorAll('.ripple-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const r = btn.getBoundingClientRect();
        const size = Math.max(r.width, r.height);
        const x = e.clientX - r.left - size / 2;
        const y = e.clientY - r.top - size / 2;

        const wave = document.createElement('span');
        wave.className = 'ripple-wave';
        wave.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
        btn.appendChild(wave);
        wave.addEventListener('animationend', () => wave.remove());
      });
    });
  }

  // ── 3. Cursor Spotlight on Dark Sections ─────────────────────
  function initSpotlight() {
    document.querySelectorAll('.spotlight-section').forEach(sec => {
      sec.addEventListener('mousemove', e => {
        const r = sec.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%';
        const y = ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%';
        sec.style.setProperty('--sx', x);
        sec.style.setProperty('--sy', y);
      });
      sec.addEventListener('mouseleave', () => {
        sec.style.setProperty('--sx', '-200%');
        sec.style.setProperty('--sy', '-200%');
      });
    });
  }

  // ── 4. Floating CTA Pill ────────────────────────────────────
  function initFloatingCTA() {
    const cta = document.getElementById('floating-cta');
    if (!cta) return;

    let shown = false;
    const check = () => {
      const ratio = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      const should = ratio > 0.08 && ratio < 0.91;
      if (should !== shown) {
        shown = should;
        cta.classList.toggle('visible', shown);
      }
    };
    window.addEventListener('scroll', check, { passive: true });
    check();
  }

  // ── 5. Card 3D Tilt ─────────────────────────────────────────
  function initTilt() {
    document.querySelectorAll('.tilt-card').forEach(card => {
      let raf;
      card.addEventListener('mousemove', e => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const r = card.getBoundingClientRect();
          const rx = ((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * -6;
          const ry = ((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * 6;
          card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.025)`;
        });
      });
      card.addEventListener('mouseleave', () => {
        cancelAnimationFrame(raf);
        card.style.transform = '';
      });
    });
  }

  // ── 6. Text Scramble ────────────────────────────────────────
  const POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

  function scramble(el) {
    if (el._busy) return;
    el._busy = true;
    const orig = el.textContent;
    let tick = 0;
    const len = orig.length;
    const id = setInterval(() => {
      el.textContent = orig.split('').map((ch, i) => {
        if (ch === ' ' || ch === '\n') return ch;
        if (i < tick) return ch;
        return POOL[Math.floor(Math.random() * POOL.length)];
      }).join('');
      if (tick >= len) {
        el.textContent = orig;
        clearInterval(id);
        el._busy = false;
      }
      tick += 0.7;
    }, 28);
  }

  function initScramble() {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setTimeout(() => scramble(e.target), 150);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.35 });

    document.querySelectorAll('[data-scramble]').forEach(el => io.observe(el));
  }

  // ── 7. Services Timeline Highlight ──────────────────────────
  function initTimeline() {
    const items = document.querySelectorAll('.process-timeline-item');
    if (!items.length) return;

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        e.target.classList.toggle('tl-active', e.isIntersecting);
      });
    }, { threshold: 0.55, rootMargin: '-5% 0px -5% 0px' });

    items.forEach(item => io.observe(item));
  }

  // ── 8. Animated Stars ───────────────────────────────────────
  function initStars() {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.querySelectorAll('.star').forEach((star, i) => {
          setTimeout(() => star.classList.add('star-lit'), i * 110);
        });
        io.unobserve(e.target);
      });
    }, { threshold: 0.4 });

    document.querySelectorAll('.trust-item').forEach(el => io.observe(el));
  }

  // ── 9. Stat Number Pop ──────────────────────────────────────
  function initStatPop() {
    document.querySelectorAll('[data-count]').forEach(el => {
      new MutationObserver(() => {
        el.classList.remove('stat-pop');
        void el.offsetWidth;
        el.classList.add('stat-pop');
      }).observe(el, { childList: true, subtree: true, characterData: true });
    });
  }

  // ── 10. Nav Link Animated Underline ─────────────────────────
  function initNavUnderline() {
    document.querySelectorAll('.nav-link-custom, .mobile-nav-link').forEach(a => {
      a.classList.add('anim-link');
    });
  }

  // ── 11. Why-Item slide ──────────────────────────────────────
  // (CSS-only, no JS needed — handled via _ui-components.scss)

  // ── 12. Bento Card shimmer ─────────────────────────────────
  // (CSS-only)

  // ── Init ────────────────────────────────────────────────────
  function init() {
    initMagnetic();
    initRipple();
    initSpotlight();
    initFloatingCTA();
    initTilt();
    initScramble();
    initTimeline();
    initStars();
    initStatPop();
    initNavUnderline();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
