// ===== INTRO SCREEN =====
(function () {
    // Only run on non-admin pages, once per session
    if (document.body.classList.contains('admin-body')) return;
    if (sessionStorage.getItem('gymfit-intro-seen')) return;
    sessionStorage.setItem('gymfit-intro-seen', '1');

    // Lock scroll while intro plays
    document.body.style.overflow = 'hidden';

    // Build the two curtain halves
    const topHalf = document.createElement('div');
    topHalf.classList.add('intro-half', 'intro-top');

    const bottomHalf = document.createElement('div');
    bottomHalf.classList.add('intro-half', 'intro-bottom');

    // Build the content layer
    const content = document.createElement('div');
    content.classList.add('intro-content');

    const letters = ['G', 'Y', 'M', 'F', 'I', 'T'];
    const logoHTML = letters
        .map((l, i) => `<span class="intro-char" style="transition-delay:${0.25 + i * 0.09}s">${l}</span>`)
        .join('');

    content.innerHTML = `
        <div class="intro-line"></div>
        <div class="intro-logo-text">${logoHTML}</div>
        <div class="intro-line"></div>
        <p class="intro-tagline">Train &nbsp;·&nbsp; Transform &nbsp;·&nbsp; Thrive</p>
        <div class="intro-progress"><div class="intro-progress-fill"></div></div>
    `;

    document.body.appendChild(topHalf);
    document.body.appendChild(bottomHalf);
    document.body.appendChild(content);

    // Trigger active state on next frame so CSS transitions fire
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            content.classList.add('active');
        });
    });

    // Exit: curtain splits apart
    const EXIT_DELAY = 2700; // ms before curtain opens
    const EXIT_DURATION = 950; // ms curtain transition

    setTimeout(() => {
        content.classList.add('exit');
        topHalf.classList.add('exit');
        bottomHalf.classList.add('exit');

        setTimeout(() => {
            topHalf.remove();
            bottomHalf.remove();
            content.remove();
            document.body.style.overflow = '';
        }, EXIT_DURATION + 50);
    }, EXIT_DELAY);
})();

document.addEventListener('DOMContentLoaded', () => {
    const isAdmin = document.body.classList.contains('admin-body');

    // ─── HELPER: observe and reveal ───────────────────────────────
    const observe = (el, opts = {}) => {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: opts.threshold || 0.12, rootMargin: opts.margin || '0px' });
        io.observe(el);
    };

    // ─── 1. NAV: cinematic fade-down on load ──────────────────────
    const nav = document.querySelector('nav');
    if (nav && !isAdmin) {
        nav.classList.add('cin-nav');
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // ─── 2. PAGE TITLE BANNER ─────────────────────────────────────
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) {
        pageTitle.classList.add('cin-page-title');
        // Animate h1 and p inside it
        pageTitle.querySelectorAll('h1, p').forEach((el, i) => {
            el.style.animationDelay = `${0.1 + i * 0.18}s`;
            el.classList.add('cin-page-title-child');
        });
    }

    // ─── 3. SECTION TITLES: cinematic word reveal ─────────────────
    document.querySelectorAll('h2.section-title').forEach(h2 => {
        if (h2.dataset.cinDone) return;
        h2.dataset.cinDone = '1';
        const text = h2.innerText;
        h2.innerHTML = '';
        h2.classList.add('cin-section-title');

        text.split(' ').forEach((word, wi) => {
            const wrapper = document.createElement('span');
            wrapper.style.cssText = 'display:inline-block; overflow:hidden; vertical-align:bottom;';
            const inner = document.createElement('span');
            inner.innerText = word;
            inner.classList.add('cin-word');
            inner.style.transitionDelay = `${wi * 0.1}s`;
            wrapper.appendChild(inner);
            h2.appendChild(wrapper);
            if (wi < text.split(' ').length - 1) h2.appendChild(document.createTextNode('\u00A0'));
        });
        observe(h2);
    });

    // ─── 4. SECTION SUB HEADINGS ──────────────────────────────────
    document.querySelectorAll('p.section-sub').forEach(el => {
        el.classList.add('cin-fade-up');
        observe(el);
    });

    // ─── 5. CARDS (facility, plan, trainer) ───────────────────────
    // Group-aware stagger
    document.querySelectorAll('.grid-3, .grid-4, .trainers-grid').forEach(group => {
        group.querySelectorAll('.card, .plan-card, .trainer-card').forEach((card, i) => {
            card.classList.add('cin-card');
            card.style.setProperty('--cin-delay', `${i * 90}ms`);
            observe(card, { threshold: 0.08 });
        });
    });
    // Cards not inside a grid group
    document.querySelectorAll('.card:not(.cin-card), .plan-card:not(.cin-card)').forEach((card, i) => {
        card.classList.add('cin-card');
        card.style.setProperty('--cin-delay', `${i * 70}ms`);
        observe(card, { threshold: 0.08 });
    });

    // ─── 6. TABLE ROWS ────────────────────────────────────────────
    document.querySelectorAll('table:not(.footer-hours) tbody tr').forEach((row, i) => {
        row.classList.add('cin-row');
        row.style.animationDelay = `${i * 55}ms`;
        observe(row, { threshold: 0.05 });
    });
    // Table itself: border sweep
    document.querySelectorAll('table:not(.footer-hours)').forEach(t => {
        t.classList.add('cin-table');
        observe(t, { threshold: 0.05 });
    });

    // ─── 7. FORM ELEMENTS ─────────────────────────────────────────
    document.querySelectorAll('.form-card, .form-group, fieldset, .contact-info').forEach((el, i) => {
        el.classList.add('cin-fade-up');
        el.style.transitionDelay = `${i * 0.06}s`;
        observe(el, { threshold: 0.05 });
    });

    // ─── 8. PAGE BODY PARAGRAPHS (sections) ───────────────────────
    document.querySelectorAll('main p:not(.section-sub):not(.price):not(.stat-label):not(.stat-sub):not(.stat-value)').forEach((el, i) => {
        el.classList.add('cin-fade-up');
        el.style.transitionDelay = `${i * 0.04}s`;
        observe(el, { threshold: 0.1 });
    });

    // ─── 9. HERO TEXT ─────────────────────────────────────────────
    const heroH1 = document.querySelector('.hero-text h1');
    if (heroH1 && !heroH1.dataset.cinDone) {
        heroH1.dataset.cinDone = '1';
        const orig = heroH1.innerHTML;
        // Wrap whole h1 in reveal
        heroH1.classList.add('cin-hero-title');
        // Stagger hero sub-elements
        const heroP = document.querySelector('.hero-text p');
        const heroH4 = document.querySelector('.hero-text h4');
        const heroBtn = document.querySelector('.hero-text .btn');
        [heroH4, heroP, heroBtn].forEach((el, i) => {
            if (!el) return;
            el.classList.add('cin-fade-up');
            el.style.transitionDelay = `${0.6 + i * 0.2}s`;
        });
        // Trigger hero immediately (it's above fold)
        setTimeout(() => {
            heroH1.classList.add('show');
            [heroH4, heroP, heroBtn].forEach(el => el && el.classList.add('show'));
        }, 300);
    }

    // ─── 10. FOOTER ───────────────────────────────────────────────
    document.querySelectorAll('.footer-col').forEach((col, i) => {
        col.classList.add('cin-fade-up');
        col.style.transitionDelay = `${i * 0.1}s`;
        observe(col, { threshold: 0.1 });
    });
    const footerBar = document.querySelector('.footer-bar');
    if (footerBar) { footerBar.classList.add('cin-fade-up'); observe(footerBar); }

    // ─── 11. TRAINER CARDS (individual if not in grid) ────────────
    document.querySelectorAll('.trainer-card:not(.cin-card)').forEach((card, i) => {
        card.classList.add('cin-card');
        card.style.setProperty('--cin-delay', `${i * 80}ms`);
        observe(card, { threshold: 0.08 });
    });

    // ─── 12. STATS GRID (admin & index) ───────────────────────────
    document.querySelectorAll('.stats-grid .stat-card').forEach((card, i) => {
        card.classList.add('cin-stat');
        card.style.setProperty('--cin-delay', `${i * 80}ms`);
        observe(card, { threshold: 0.1 });
    });

    // ─── 13. ADMIN CARDS ──────────────────────────────────────────
    document.querySelectorAll('.admin-card').forEach((card, i) => {
        card.classList.add('cin-fade-up');
        card.style.transitionDelay = `${0.35 + i * 0.12}s`;
        observe(card, { threshold: 0.05 });
    });

    // ─── 14. MARQUEE: already animated via CSS ────────────────────

    // ─── 15. STICKY NAV scroll behavior ───────────────────────────
    if (isAdmin) {
        // Admin table rows stagger
        document.querySelectorAll('.admin-table tbody tr').forEach((row, i) => {
            row.style.animationDelay = `${0.5 + i * 0.07}s`;
        });
    }

    // ─── 16. PARALLAX HERO ────────────────────────────────────────
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            hero.style.setProperty('--parallax-y', `${window.scrollY * 0.4}px`);
        }, { passive: true });
    }

    // ─── 17. CUSTOM CURSOR (non-admin) ────────────────────────────
    if (!isAdmin) {
        document.body.classList.add('custom-cursor');
        let cursor = document.querySelector('.cursor');
        let follower = document.querySelector('.cursor-follower');
        if (!cursor) { cursor = document.createElement('div'); cursor.classList.add('cursor'); document.body.appendChild(cursor); }
        if (!follower) { follower = document.createElement('div'); follower.classList.add('cursor-follower'); document.body.appendChild(follower); }
        let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX; mouseY = e.clientY;
            cursor.style.left = `${mouseX}px`; cursor.style.top = `${mouseY}px`;
        });
        const animateFollower = () => {
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            follower.style.left = `${followerX}px`; follower.style.top = `${followerY}px`;
            requestAnimationFrame(animateFollower);
        };
        animateFollower();
        document.querySelectorAll('a, .btn, button, input').forEach(el => {
            el.addEventListener('mouseenter', () => follower.classList.add('hovering'));
            el.addEventListener('mouseleave', () => follower.classList.remove('hovering'));
        });
    }

    // ─── 18. CINEMATIC TEXT REVEAL (hero h1 chars) ────────────────
    const heroTitle = document.querySelector('.hero-text h1');
    if (heroTitle && !heroTitle.dataset.charDone) {
        heroTitle.dataset.charDone = '1';
        let text = heroTitle.innerText;
        heroTitle.innerHTML = '';
        heroTitle.classList.add('reveal-text');
        text.split(' ').forEach((word, wi) => {
            const ws = document.createElement('span');
            ws.style.cssText = 'display:inline-block;white-space:nowrap;';
            word.split('').forEach((ch, ci) => {
                const cs = document.createElement('span');
                cs.innerText = ch; cs.classList.add('char');
                if (word.toUpperCase() === 'BODY') { cs.style.color = 'var(--accent)'; cs.style.fontStyle = 'italic'; }
                cs.style.transitionDelay = `${(wi * 0.1) + (ci * 0.03)}s`;
                ws.appendChild(cs);
            });
            heroTitle.appendChild(ws);
            if (wi < text.split(' ').length - 1) heroTitle.appendChild(document.createTextNode('\u00A0'));
        });
        setTimeout(() => heroTitle.classList.add('show'), 400);
    }

    // ─── 19. ADMIN STAT COUNTERS ──────────────────────────────────
    if (isAdmin) {
        const animateCounter = (el) => {
            const raw = el.innerText.trim();
            const m = raw.match(/^([\d,\.]+)(.*)/);
            if (!m) return;
            const target = parseFloat(m[1].replace(/,/g, ''));
            const suffix = m[2];
            const isFloat = m[1].includes('.');
            const dur = 1400, t0 = performance.now();
            const tick = (now) => {
                const p = Math.min((now - t0) / dur, 1);
                const ease = 1 - Math.pow(1 - p, 3);
                const v = target * ease;
                el.innerText = (isFloat ? v.toFixed(1) : Math.floor(v).toLocaleString()) + suffix;
                if (p < 1) requestAnimationFrame(tick); else el.innerText = raw;
            };
            requestAnimationFrame(tick);
        };
        const statObs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    const v = e.target.querySelector('.stat-value');
                    if (v) animateCounter(v);
                    statObs.unobserve(e.target);
                }
            });
        }, { threshold: 0.3 });
        document.querySelectorAll('.stat-card').forEach(c => statObs.observe(c));
    }
});

