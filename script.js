// ========================================
// HAVEN — Interactions
// ========================================

document.addEventListener('DOMContentLoaded', () => {

    // ── Nav scroll effect ──
    const nav = document.getElementById('nav');

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 80);
    }, { passive: true });

    // ── Mobile menu ──
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');

    toggle.addEventListener('click', () => {
        links.classList.toggle('open');
        toggle.classList.toggle('active');
    });

    links.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            links.classList.remove('open');
            toggle.classList.remove('active');
        });
    });

    // ── Hero parallax ──
    const heroBg = document.querySelector('.hero-bg img');
    const heroContent = document.querySelector('.hero-content');

    // ── Smooth scroll-driven animations ──
    // Uses requestAnimationFrame for buttery performance

    let ticking = false;

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }

    function updateScrollEffects() {
        const y = window.scrollY;
        const vh = window.innerHeight;

        // Hero parallax — image drifts, content fades
        if (y < vh * 1.2) {
            if (heroBg) {
                heroBg.style.transform = `scale(1.1) translateY(${y * 0.2}px)`;
            }
            if (heroContent) {
                heroContent.style.opacity = Math.max(0, 1 - y / (vh * 0.5));
                heroContent.style.transform = `translateY(${y * 0.3}px)`;
            }
        }

        // Parallax images inside sections
        document.querySelectorAll('[data-parallax]').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < vh && rect.bottom > 0) {
                const progress = (vh - rect.top) / (vh + rect.height);
                const speed = parseFloat(el.dataset.parallax) || 0.1;
                const offset = (progress - 0.5) * speed * 200;
                el.style.transform = `translateY(${offset}px) scale(1.08)`;
            }
        });

        // Horizontal slide elements
        document.querySelectorAll('[data-slide]').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < vh && rect.bottom > 0) {
                const progress = Math.min(1, Math.max(0, 1 - rect.top / (vh * 0.75)));
                const dir = el.dataset.slide === 'left' ? -1 : 1;
                const offset = (1 - progress) * 60 * dir;
                el.style.transform = `translateX(${offset}px)`;
                el.style.opacity = progress;
            }
        });

        ticking = false;
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // ── Scroll reveal with varied animations ──
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-scale, .reveal-stagger');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ── Text split reveal ──
    document.querySelectorAll('.text-reveal').forEach(el => {
        const lines = el.innerHTML.split('<br>');
        el.innerHTML = lines.map((line, i) =>
            `<span class="text-reveal-line" style="transition-delay: ${i * 0.12}s"><span class="text-reveal-inner">${line}</span></span>`
        ).join('');
    });

    const textRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('text-revealed');
                textRevealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.text-reveal').forEach(el => textRevealObserver.observe(el));

    // ── Stagger children ──
    document.querySelectorAll('[data-stagger]').forEach(parent => {
        const delay = parseFloat(parent.dataset.stagger) || 0.1;
        Array.from(parent.children).forEach((child, i) => {
            child.classList.add('reveal-up');
            child.style.transitionDelay = `${i * delay}s`;
        });
    });

    // Re-observe newly added reveal elements
    document.querySelectorAll('.reveal-up:not(.is-visible)').forEach(el => revealObserver.observe(el));

    // ── Image reveal on scroll ──
    const imageReveals = document.querySelectorAll('.img-reveal');
    const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('img-revealed');
                imgObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    imageReveals.forEach(el => imgObserver.observe(el));

    // ── Counter / number reveal ──
    document.querySelectorAll('.count-up').forEach(el => {
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCount(el, 0, target, 1200, suffix);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(el);
    });

    function animateCount(el, start, end, duration, suffix) {
        const range = end - start;
        const startTime = performance.now();
        function step(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(start + range * ease).toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    // ── Smooth anchor scroll ──
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ── Form handling ──
    const form = document.getElementById('inquireForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'Thank you — we\'ll be in touch';
            btn.disabled = true;
            btn.style.opacity = '0.7';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
                btn.style.opacity = '1';
                form.reset();
            }, 3000);
        });
    }

    // ── Magnetic cursor on buttons (desktop) ──
    if (window.innerWidth > 900) {
        document.querySelectorAll('.btn, .nav-cta').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }
});
