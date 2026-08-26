/* =========================================
   SIGestion Landing Page – Scripts
   Pure JavaScript, no frameworks
   ========================================= */

(function () {
    'use strict';

    /* ---------- DOM Ready ---------- */
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initMobileMenu();
        initHeaderScroll();
        initScrollAnimations();
        initModuleCards();
        initContactForm();
        initSmoothScroll();
    }

    /* ---------- Mobile Menu ---------- */
    function initMobileMenu() {
        const toggle = document.getElementById('menu-toggle');
        const close = document.getElementById('menu-close');
        const menu = document.getElementById('mobile-menu');
        const links = menu.querySelectorAll('.mobile-link');

        if (!toggle || !close || !menu) return;

        function openMenu() {
            menu.classList.add('active');
            menu.setAttribute('aria-hidden', 'false');
            toggle.classList.add('active');
            toggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            menu.classList.remove('active');
            menu.setAttribute('aria-hidden', 'true');
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }

        toggle.addEventListener('click', function () {
            if (menu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        close.addEventListener('click', closeMenu);

        links.forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });

        // Close on Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && menu.classList.contains('active')) {
                closeMenu();
                toggle.focus();
            }
        });
    }

    /* ---------- Header Scroll Effect ---------- */
    function initHeaderScroll() {
        const header = document.getElementById('header');
        if (!header) return;

        let ticking = false;

        function onScroll() {
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    if (window.scrollY > 20) {
                        header.classList.add('scrolled');
                    } else {
                        header.classList.remove('scrolled');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ---------- Scroll Animations (IntersectionObserver) ---------- */
    function initScrollAnimations() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        if (!elements.length) return;

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            elements.forEach(function (el) {
                el.classList.add('visible');
            });
            return;
        }

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(
                function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            observer.unobserve(entry.target);
                        }
                    });
                },
                {
                    threshold: 0.1,
                    rootMargin: '0px 0px -40px 0px'
                }
            );

            elements.forEach(function (el) {
                observer.observe(el);
            });
        } else {
            // Fallback: show everything
            elements.forEach(function (el) {
                el.classList.add('visible');
            });
        }
    }

    /* ---------- Module Cards (Expand on Click) ---------- */
    function initModuleCards() {
        const cards = document.querySelectorAll('.module-card');

        cards.forEach(function (card) {
            card.addEventListener('click', function () {
                const wasExpanded = card.classList.contains('expanded');

                // Close all other cards
                cards.forEach(function (c) {
                    c.classList.remove('expanded');
                });

                // Toggle this card
                if (!wasExpanded) {
                    card.classList.add('expanded');
                }
            });

            card.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });
    }

    /* ---------- Contact Form ---------- */
    function initContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = form.querySelector('#name');
            const email = form.querySelector('#email');
            const phone = form.querySelector('#phone');
            const message = form.querySelector('#message');

            // Simple validation
            let isValid = true;

            if (!name.value.trim()) {
                shakeField(name);
                isValid = false;
            }

            if (!email.value.trim() || !isValidEmail(email.value)) {
                shakeField(email);
                isValid = false;
            }

            if (!isValid) return;

            // Simulate form submission
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<span style="display:inline-flex;align-items:center;gap:8px;">✓ ¡Enviado con éxito!</span>';
            submitBtn.style.background = '#10B981';
            submitBtn.style.boxShadow = '0 4px 14px rgba(16, 185, 129, 0.3)';
            submitBtn.disabled = true;

            // Reset after 3 seconds
            setTimeout(function () {
                form.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.style.boxShadow = '';
                submitBtn.disabled = false;
            }, 3000);
        });
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function shakeField(field) {
        field.style.borderColor = '#EF4444';
        field.style.animation = 'shake 0.5s ease';
        field.focus();

        setTimeout(function () {
            field.style.borderColor = '';
            field.style.animation = '';
        }, 1000);
    }

    /* ---------- Smooth Scroll for Anchor Links ---------- */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (!target) return;

                e.preventDefault();

                const headerHeight = 72;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }
})();

/* ---------- Shake Animation (injected via JS) ---------- */
(function () {
    var style = document.createElement('style');
    style.textContent = '@keyframes shake{0%,100%{transform:translateX(0)}10%,30%,50%,70%,90%{transform:translateX(-4px)}20%,40%,60%,80%{transform:translateX(4px)}}';
    document.head.appendChild(style);
})();