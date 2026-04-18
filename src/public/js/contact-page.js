// ─── Phone: numbers only ──────────────────────────────────
document.getElementById('contact-phone').addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '').slice(0, 10);
});

// ─── Contact Form Submit ──────────────────────────────────
document.getElementById('contact-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn = this.querySelector('.form-submit-btn');
    btn.disabled = true;
    btn.innerHTML = 'Sending… <span class="material-icons">hourglass_top</span>';
    const phone = document.getElementById('phone-country').value + document.getElementById('contact-phone').value;
    const body = JSON.stringify({
        name: document.getElementById('contact-name').value,
        email: document.getElementById('contact-email').value,
        phone: document.getElementById('contact-phone').value ? phone : '',
        interest: document.getElementById('contact-interest').value,
        message: document.getElementById('contact-message').value,
    });
    try {
        const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
        const json = await res.json();
        if (json.success) {
            btn.innerHTML = 'Sent! <span class="material-icons">check_circle</span>';
            btn.style.background = '#1a1a1a';
            this.reset();
        } else {
            btn.disabled = false;
            btn.innerHTML = 'Send Message <span class="material-icons">send</span>';
            alert(json.message || 'Something went wrong. Please try again.');
        }
    } catch {
        btn.disabled = false;
        btn.innerHTML = 'Send Message <span class="material-icons">send</span>';
        alert('Network error. Please try again.');
    }
});

// ─── Flag Dropdown ────────────────────────────────────────
const flagSelectBtn = document.getElementById('flag-select-btn');
const flagDropdown = document.getElementById('flag-dropdown');
const flagImg = document.getElementById('flag-img');
const flagCode = document.getElementById('flag-code');
const phoneCountry = document.getElementById('phone-country');

flagSelectBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = flagSelectBtn.getAttribute('aria-expanded') === 'true';
    flagSelectBtn.setAttribute('aria-expanded', !isOpen);
    flagDropdown.classList.toggle('open');
});

flagDropdown.querySelectorAll('.flag-option').forEach(opt => {
    opt.addEventListener('click', () => {
        flagImg.src = `https://flagcdn.com/20x15/${opt.dataset.iso}.png`;
        flagImg.alt = opt.textContent.trim();
        flagCode.textContent = opt.dataset.code;
        phoneCountry.value = opt.dataset.code;
        flagDropdown.classList.remove('open');
        flagSelectBtn.setAttribute('aria-expanded', 'false');
    });
});

document.addEventListener('click', (e) => {
    if (!document.getElementById('flag-select').contains(e.target)) {
        flagDropdown.classList.remove('open');
        flagSelectBtn.setAttribute('aria-expanded', 'false');
    }
});
