/**
 * STUDIO FORMA — Premium Architecture Site
 * JavaScript interactions and animations
 */
(function () {
  'use strict';

  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => [...(c || document).querySelectorAll(s)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Loader ── */
  function initLoader() {
    const loader = $('#loader');
    if (!loader) return;
    if (reducedMotion) {
      loader.classList.add('done');
      animateHero();
      return;
    }
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('done');
        animateHero();
      }, 1600);
    });
  }

  /* ── Hero Animation ── */
  function animateHero() {
    const hero = $('.hero');
    if (!hero) return;
    setTimeout(() => hero.classList.add('hero--ready'), 150);
  }

  /* ── Navbar ── */
  function initNav() {
    const nav = $('#nav');
    if (!nav) return;

    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 80);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Burger / Mobile Menu ── */
  function initBurger() {
    const burger = $('#navBurger');
    const menu = $('#menu');
    if (!burger || !menu) return;

    burger.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('active');
      burger.classList.toggle('active');
      document.body.classList.toggle('no-scroll', isOpen);
    });

    $$('.menu__link', menu).forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('active');
        burger.classList.remove('active');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  /* ── Smooth Scroll ── */
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (!id || id === '#') return;
        const target = $(id);
        if (!target) return;
        e.preventDefault();
        const nav = $('#nav');
        const offset = nav ? nav.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' });
      });
    });
  }

  /* ── Scroll Reveal ── */
  function initReveal() {
    const els = $$('.reveal');
    if (!els.length) return;
    if (reducedMotion) {
      els.forEach(el => el.classList.add('visible'));
      return;
    }
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
    );
    els.forEach(el => observer.observe(el));
  }

  /* ── Counter Animation ── */
  function initCounters() {
    $$('.studio__stat-num[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      if (isNaN(target)) return;
      if (reducedMotion) { el.textContent = target; return; }

      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const duration = 2200;
              const start = performance.now();
              const tick = now => {
                const p = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - p, 4);
                el.textContent = Math.round(eased * target);
                if (p < 1) requestAnimationFrame(tick);
                else el.textContent = target;
              };
              requestAnimationFrame(tick);
              observer.unobserve(el);
            }
          });
        },
        { threshold: 0.5 }
      );
      observer.observe(el);
    });
  }

  /* ── Active Nav Link ── */
  function initActiveNav() {
    const sections = $$('section[id]');
    const links = $$('.nav__link');
    if (!sections.length || !links.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            links.forEach(l =>
              l.classList.toggle('nav__link--active', l.getAttribute('href') === '#' + id)
            );
          }
        });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    sections.forEach(s => observer.observe(s));
  }

  /* ── WhatsApp Float ── */
  function initWhatsApp() {
    const btn = $('.whatsapp');
    if (!btn) return;
    const check = () => {
      btn.classList.toggle('show', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', check, { passive: true });
    check();
  }

  /* ── Parallax (subtle) ── */
  function initParallax() {
    if (reducedMotion) return;
    const heroMedia = $('.hero__media');
    const destaqueMedia = $('.destaque__media');
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const sy = window.scrollY;
        if (heroMedia && sy < window.innerHeight) {
          heroMedia.style.transform = 'translate3d(0,' + (sy * 0.2) + 'px,0)';
        }
        if (destaqueMedia) {
          const rect = destaqueMedia.getBoundingClientRect();
          const offset = rect.top * 0.08;
          destaqueMedia.style.transform = 'translate3d(0,' + offset + 'px,0)';
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── Image Reveal on Load ── */
  function initImageReveal() {
    if (reducedMotion) return;
    $$('img[loading="lazy"]').forEach(img => {
      if (img.complete) return;
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.8s ease';
      img.addEventListener('load', () => { img.style.opacity = '1'; }, { once: true });
    });
  }

  /* ── Magnetic CTA (subtle) ── */
  function initMagnetic() {
    if (reducedMotion) return;
    $$('.hero__cta, .destaque__cta, .cta__btn').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.12;
        const y = (e.clientY - r.top - r.height / 2) * 0.12;
        btn.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initNav();
    initBurger();
    initSmoothScroll();
    initReveal();
    initCounters();
    initActiveNav();
    initWhatsApp();
    initParallax();
    initImageReveal();
    initMagnetic();
  });
})();
