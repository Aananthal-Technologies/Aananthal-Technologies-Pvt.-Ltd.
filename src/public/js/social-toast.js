(function () {
  const vibes = {
    facebook: [
      "Not live yet — something's being built. 🔧",
      "We'll be there. Just not today.",
      "Coming soon. Worth the wait."
    ],
    instagram: [
      "Content is in the works. Stay tuned. 📸",
      "The feed is being prepared — check back soon.",
      "Something visual is coming. Watch this space. 👀"
    ],
    youtube: [
      "Video content is on the way. 🎬",
      "We're building before we broadcast.",
      "Studio mode. Coming soon."
    ],
    twitter: [
      "Not on this platform yet. LinkedIn is where we are.",
      "Coming soon — stay connected on LinkedIn."
    ],
    x: [
      "Not active here yet. Follow us on LinkedIn.",
      "Coming soon. Find us on LinkedIn for now."
    ]
  };

  const styles = `
    .sgt-toast {
      position: fixed;
      bottom: 32px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: #111;
      color: #fff;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0.01em;
      padding: 14px 24px;
      border-radius: 100px;
      white-space: nowrap;
      z-index: 99999;
      opacity: 0;
      transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
      pointer-events: none;
      box-shadow: 0 8px 32px rgba(0,0,0,0.28);
      border: 1px solid rgba(255,255,255,0.08);
    }
    .sgt-toast.sgt-show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  let activeToast = null;
  let hideTimer = null;

  function showToast(msg) {
    if (activeToast) {
      clearTimeout(hideTimer);
      activeToast.remove();
    }
    const toast = document.createElement('div');
    toast.className = 'sgt-toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    activeToast = toast;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add('sgt-show'));
    });

    hideTimer = setTimeout(() => {
      toast.classList.remove('sgt-show');
      setTimeout(() => { toast.remove(); activeToast = null; }, 350);
    }, 3200);
  }

  document.addEventListener('click', function (e) {
    const el = e.target.closest('[data-social]');
    if (!el) return;
    const social = el.dataset.social;
    if (social === 'linkedin') return;
    e.preventDefault();
    const pool = vibes[social] || ["Coming soon. Stay tuned."];
    showToast(pool[Math.floor(Math.random() * pool.length)]);
  });
})();
