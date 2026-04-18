/**
 * Automatically switches navbar text color (white/black) based on
 * the luminance of the section currently behind the navbar.
 *
 * Uses document.elementsFromPoint (returns full stack from top→bottom)
 * so we can skip the navbar and its children entirely, then find the
 * first element with a real (non-transparent) background-color.
 */
(function () {
    const navbar = document.getElementById('liquid-nav');
    if (!navbar) return;

    function getLuminance(r, g, b) {
        const toLinear = c => {
            c /= 255;
            return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        };
        return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
    }

    function parseRGB(str) {
        const m = str.match(/[\d.]+/g);
        if (!m || m.length < 3) return null;
        return { r: +m[0], g: +m[1], b: +m[2], a: m[3] !== undefined ? +m[3] : 1 };
    }

    function isTransparent(bg) {
        if (!bg || bg === 'transparent') return true;
        // rgba(0,0,0,0) or any rgba with alpha = 0
        const rgb = parseRGB(bg);
        return rgb && rgb.a === 0;
    }

    function getSectionTheme() {
        const navRect = navbar.getBoundingClientRect();
        // Sample just below the navbar's bottom edge at the horizontal center
        const sampleY = navRect.bottom + 8;
        const sampleX = window.innerWidth / 2;

        // elementsFromPoint returns ALL elements at that point, top→bottom
        const stack = document.elementsFromPoint(sampleX, sampleY);

        for (const el of stack) {
            // Skip the navbar itself and every descendant inside it
            if (el === navbar || navbar.contains(el)) continue;
            // Skip cursor overlays
            if (el.classList.contains('cursor-dot') || el.classList.contains('cursor-ring')) continue;
            // Skip page loader overlay
            if (el.id === 'page-loader') continue;
            // Skip html/body — body background is the page default, not a real section
            if (el === document.body || el === document.documentElement) continue;

            const bg = window.getComputedStyle(el).backgroundColor;
            if (isTransparent(bg)) continue;

            const rgb = parseRGB(bg);
            if (!rgb) continue;

            const lum = getLuminance(rgb.r, rgb.g, rgb.b);
            return lum < 0.4 ? 'dark' : 'light';
        }

        // Fallback: check body background (handles pages with no sections covering nav)
        const bodyBg = window.getComputedStyle(document.body).backgroundColor;
        if (!isTransparent(bodyBg)) {
            const rgb = parseRGB(bodyBg);
            if (rgb) {
                return getLuminance(rgb.r, rgb.g, rgb.b) < 0.4 ? 'dark' : 'light';
            }
        }

        return 'dark';
    }

    function updateNavTheme() {
        navbar.setAttribute('data-theme', getSectionTheme());
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateNavTheme();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    updateNavTheme();
    setTimeout(updateNavTheme, 200);
    window.addEventListener('load', updateNavTheme);
})();
