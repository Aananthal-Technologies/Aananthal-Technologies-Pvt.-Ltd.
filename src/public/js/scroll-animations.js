/* Premium Scroll Animation Engine — Aananthal Technologies */
(function () {
  'use strict';

  // ─── Helpers ────────────────────────────────────────────
  function onVisible(selector, callback, opts) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry.target, observer);
        }
      });
    }, Object.assign({ threshold: 0.1, rootMargin: '0px 0px -48px 0px' }, opts));

    document.querySelectorAll(selector).forEach(el => observer.observe(el));
    return observer;
  }

  // ─── Scroll Progress Bar ────────────────────────────────
  function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (scrollTop / docHeight * 100) + '%';
    }, { passive: true });
  }

  // ─── Back to Top ────────────────────────────────────────
  function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 700);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ─── data-anim Elements ──────────────────────────────────
  function initAnimElements() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || '0');
        setTimeout(() => el.classList.add('is-visible'), delay);
        obs.unobserve(el);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('[data-anim]').forEach(el => obs.observe(el));
  }

  // ─── Stagger Children ───────────────────────────────────
  function initStagger() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const base = parseInt(entry.target.dataset.staggerBase || '0');
        const step = parseInt(entry.target.dataset.staggerStep || '80');
        entry.target.querySelectorAll('[data-stagger-child]').forEach((child, i) => {
          setTimeout(() => child.classList.add('is-visible'), base + i * step);
        });
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-stagger]').forEach(el => obs.observe(el));
  }

  // ─── Counter Animation ───────────────────────────────────
  function animateCount(el) {
    const target  = parseFloat(el.dataset.count);
    const suffix  = el.dataset.suffix  || '';
    const decimal = el.dataset.decimal === 'true';
    const dur     = 1800;
    let   start   = null;

    const tick = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3); // ease-out-cubic
      const v = e * target;
      el.textContent = (decimal ? v.toFixed(1) : Math.floor(v)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function initCounters() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('[data-count]').forEach(animateCount);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count-section]').forEach(el => obs.observe(el));
  }

  // ─── Typing Effect for hero taglines ──────────────────
  function initSplitText() {
    document.querySelectorAll('[data-split]').forEach(el => {
      const text = el.textContent;
      el.innerHTML = text.split('').map((c, i) =>
        `<span class="split-char" style="--ci:${i}">${c === ' ' ? '&nbsp;' : c}</span>`
      ).join('');

      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.querySelectorAll('.split-char').forEach((s, i) => {
            setTimeout(() => s.classList.add('is-visible'), i * 28);
          });
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.5 });
      obs.observe(el);
    });
  }

  // ─── Parallax Orbs ──────────────────────────────────────
  function initParallax() {
    const orbs = document.querySelectorAll('.parallax-orb');
    if (!orbs.length) return;
    window.addEventListener('scroll', () => {
      const sy = window.scrollY;
      orbs.forEach(orb => {
        const speed = parseFloat(orb.dataset.speed || '0.15');
        orb.style.transform = `translateY(${sy * speed}px)`;
      });
    }, { passive: true });
  }

  // ─── Section reveal fade (bg-reveal class) ───────────────
  function initSectionReveal() {
    onVisible('.reveal-section', (el, obs) => {
      el.classList.add('is-revealed');
      obs.unobserve(el);
    }, { threshold: 0.05 });
  }

  // ─── Hover tilt on cards ────────────────────────────────
  function initTiltCards() {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const cx   = rect.left + rect.width / 2;
        const cy   = rect.top  + rect.height / 2;
        const dx   = (e.clientX - cx) / (rect.width  / 2);
        const dy   = (e.clientY - cy) / (rect.height / 2);
        card.style.transform = `perspective(800px) rotateY(${dx * 4}deg) rotateX(${-dy * 4}deg) scale(1.02)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ─── Line grow on scroll ─────────────────────────────────
  function initLineGrow() {
    onVisible('[data-anim="line-grow"]', (el, obs) => {
      el.classList.add('is-visible');
      obs.unobserve(el);
    }, { threshold: 0.5 });
  }

  // ─── Init All ────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initBackToTop();
    initAnimElements();
    initStagger();
    initCounters();
    initSplitText();
    initParallax();
    initSectionReveal();
    initTiltCards();
    initLineGrow();
  });
})();
