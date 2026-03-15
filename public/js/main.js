/**
 * Baztit Tech — Main JS
 * Phase 1: Lenis + GSAP | Phase 3: Counter, Reveal, Headline, Typewriter, Cursor, Horizontal Scroll, Progress Bars
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.documentElement.setAttribute('data-reduced-motion', 'true');
  }

  const reducedMotion = document.documentElement.getAttribute('data-reduced-motion') === 'true';

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  function scrollToHash(e) {
    const link = e.target.closest ? e.target.closest('a') : e.target;
    if (link && link.getAttribute('href')?.startsWith('#')) {
      const id = link.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ block: 'start' });
      }
    }
  }
  document.addEventListener('click', scrollToHash, true);

  /* 4.1 NAV — scroll class + hamburger */
  const header = document.getElementById('header');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (header) {
    function onScroll() {
      header.classList.toggle('scrolled', window.scrollY > 50);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !expanded);
      navMenu.classList.toggle('is-open', !expanded);
    });
    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-open');
      });
    });
  }

  /* 4.13 Contact Form — validation, loading, success */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    const nameInput = document.getElementById('name');
    const messengerInput = document.getElementById('messenger');
    const taskInput = document.getElementById('task');
    const submitBtn = document.getElementById('form-submit');
    const successEl = document.getElementById('form-success');

    function showError(input, msg) {
      const id = input.id + '-error';
      const err = document.getElementById(id);
      if (err) {
        err.textContent = msg;
        input.setAttribute('aria-invalid', 'true');
      }
    }

    function clearError(input) {
      const id = input.id + '-error';
      const err = document.getElementById(id);
      if (err) {
        err.textContent = '';
        input.setAttribute('aria-invalid', 'false');
      }
    }

    function validate() {
      var valid = true;
      if (nameInput && nameInput.value.trim().length === 0) {
        showError(nameInput, 'Name is required');
        valid = false;
      } else if (nameInput) clearError(nameInput);
      if (messengerInput && messengerInput.value.trim().length === 0) {
        showError(messengerInput, 'Telegram or WhatsApp is required');
        valid = false;
      } else if (messengerInput) clearError(messengerInput);
      if (taskInput && taskInput.value.trim().length === 0) {
        showError(taskInput, 'Please describe your task');
        valid = false;
      } else if (taskInput) clearError(taskInput);
      return valid;
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) return;

      if (submitBtn) {
        submitBtn.classList.add('is-loading');
        submitBtn.disabled = true;
      }

      fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      })
        .then(function (res) {
          if (res.ok) {
            contactForm.reset();
            if (successEl) {
              successEl.hidden = false;
            }
          } else {
            throw new Error('Form submission failed');
          }
        })
        .catch(function () {
          if (messengerInput) showError(messengerInput, 'Something went wrong. Try Telegram: @volknick');
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.classList.remove('is-loading');
            submitBtn.disabled = false;
          }
        });
    });

    [nameInput, messengerInput, taskInput].filter(Boolean).forEach(function (el) {
      el.addEventListener('input', function () { clearError(el); });
    });

    function validateField(input) {
      if (!input) return true;
      var msg = '';
      if (input === nameInput && nameInput.value.trim().length === 0) msg = 'Name is required';
      else if (input === messengerInput && messengerInput.value.trim().length === 0) msg = 'Telegram or WhatsApp is required';
      else if (input === taskInput && taskInput.value.trim().length === 0) msg = 'Please describe your task';
      if (msg) {
        showError(input, msg);
        return false;
      }
      clearError(input);
      return true;
    }

    [nameInput, messengerInput, taskInput].filter(Boolean).forEach(function (el) {
      el.addEventListener('blur', function () { validateField(el); });
    });
  }

  /* 5.4 Solutions Filter + 5.5 Modal */
  const solutionsFilter = document.querySelector('#solutions-filter');
  const solutionsCards = document.querySelector('.solutions-cards');
  const solutionModal = document.getElementById('solution-modal');

  if (solutionsFilter && solutionsCards) {
    const pills = solutionsFilter.querySelectorAll('.filter-pill');
    const cards = solutionsCards.querySelectorAll('.solution-catalog-card');

    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        const category = pill.getAttribute('data-category');
        pills.forEach(function (p) { p.classList.remove('active'); });
        pill.classList.add('active');

        cards.forEach(function (card) {
          const cardCat = card.getAttribute('data-category');
          const match = category === 'all' || cardCat === category;
          card.classList.toggle('is-hidden', !match);

          if (match && typeof gsap !== 'undefined') {
            gsap.fromTo(card, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' });
          }
        });
      });
    });
  }

  if (solutionModal) {
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalPrice = document.getElementById('modal-price');
    const modalClose = solutionModal.querySelector('.modal-close');
    const modalContent = solutionModal.querySelector('.modal-content');

    function openModal(card) {
      if (modalTitle) modalTitle.textContent = card.getAttribute('data-modal-title') || '';
      if (modalBody) modalBody.innerHTML = card.getAttribute('data-modal-body') || '';
      if (modalPrice) modalPrice.textContent = card.getAttribute('data-modal-price') || '';
      solutionModal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      if (modalClose) modalClose.focus();

      var focusables = solutionModal.querySelectorAll('button, [href], input, select, textarea, a[href]');
      var firstFocus = focusables[0];
      var lastFocus = focusables[focusables.length - 1];

      function handleKeydown(e) {
        if (e.key === 'Escape') {
          closeModal();
          return;
        }
        if (e.key !== 'Tab') return;
        if (e.shiftKey) {
          if (document.activeElement === firstFocus) {
            e.preventDefault();
            lastFocus.focus();
          }
        } else {
          if (document.activeElement === lastFocus) {
            e.preventDefault();
            firstFocus.focus();
          }
        }
      }

      solutionModal._keyHandler = handleKeydown;
      document.addEventListener('keydown', handleKeydown);
    }

    function closeModal() {
      solutionModal.classList.remove('is-open');
      document.body.style.overflow = '';
      if (solutionModal._keyHandler) {
        document.removeEventListener('keydown', solutionModal._keyHandler);
      }
    }

    document.querySelectorAll('.modal-trigger').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = btn.closest('.solution-catalog-card');
        if (card) openModal(card);
      });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);

    solutionModal.addEventListener('click', function (e) {
      if (e.target === solutionModal) closeModal();
    });

    if (modalContent) {
      modalContent.addEventListener('click', function (e) { e.stopPropagation(); });
    }
  }

  if (reducedMotion) return;

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  /* 3.2 Counter Animation */
  const counters = document.querySelectorAll('.counter[data-target]');
  if (counters.length) {
    gsap.to(counters, {
      innerText: (i, el) => parseInt(el.getAttribute('data-target'), 10),
      duration: 2,
      ease: 'power2.out',
      snap: { innerText: 1 },
      stagger: 0.15,
      scrollTrigger: {
        trigger: '.hero-numbers',
        start: 'top 80%',
        once: true
      }
    });
  }

  /* 3.3 Scroll Reveal — per section */
  const sections = document.querySelectorAll('section');
  sections.forEach(function (section) {
    const revealEls = section.querySelectorAll('.reveal');
    if (revealEls.length) {
      gsap.fromTo(revealEls, { y: 40, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          once: true
        }
      });
    }

    const staggerGrids = section.querySelectorAll('.reveal-stagger');
    staggerGrids.forEach(function (grid) {
      const children = grid.children;
      if (children.length) {
        gsap.fromTo(children, { y: 40, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: grid,
            start: 'top 85%',
            once: true
          }
        });
      }
    });
  });

  /* 3.4 Headline Word-by-Word */
  const heroH1 = document.querySelector('#hero h1');
  if (heroH1 && !heroH1.querySelector('.word')) {
    const text = heroH1.textContent;
    heroH1.innerHTML = text.split(/\s+/).map(function (w) {
      return '<span class="word"><span class="word-inner">' + w + '</span></span>';
    }).join(' ');

    const words = heroH1.querySelectorAll('.word');
    const wordInners = heroH1.querySelectorAll('.word-inner');
    gsap.set(words, { overflow: 'hidden' });
    gsap.set(wordInners, { y: '110%', opacity: 0 });

    gsap.to(wordInners, {
      y: '0%',
      opacity: 1,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.08,
      delay: 0.3
    });
  }

  /* 3.5 Typewriter */
  function startTypewriter() {
    const sub = document.querySelector('.hero-subheadline');
    if (!sub) return;

    const fullText = "We're a small team of engineers with 10+ years of hands-on IT experience. Custom software, bots, CRM integrations, and automations — at prices that used to be available only to enterprises. We show you a working prototype first. You pay only if you love it.";

    if (reducedMotion) {
      sub.textContent = fullText;
      return;
    }

    sub.innerHTML = '<span class="typewriter-text"></span><span class="typewriter-cursor">|</span>';
    const target = sub.querySelector('.typewriter-text');
    const cursor = sub.querySelector('.typewriter-cursor');
    let i = 0;

    const typeInterval = setInterval(function () {
      if (i < fullText.length) {
        target.textContent += fullText[i];
        i++;
      } else {
        clearInterval(typeInterval);
        if (cursor) cursor.style.display = 'none';
      }
    }, 35);
  }

  /* 3.6 Custom Cursor */
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;
  if (!isTouch) {
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (dot && ring) {
      let mx = 0, my = 0, cx = 0, cy = 0;

      document.addEventListener('mousemove', function (e) {
        mx = e.clientX;
        my = e.clientY;
        dot.style.transform = 'translate(' + mx + 'px, ' + my + 'px)';
      });

      const interactive = document.querySelectorAll('a, button, .glass-card, .btn-primary, .btn-secondary');
      interactive.forEach(function (el) {
        el.addEventListener('mouseenter', function () { ring.classList.add('cursor-hover'); });
        el.addEventListener('mouseleave', function () { ring.classList.remove('cursor-hover'); });
      });

      function tick() {
        cx += (mx - cx) * 0.1;
        cy += (my - cy) * 0.1;
        ring.style.transform = 'translate(' + (cx - 16) + 'px, ' + (cy - 16) + 'px)';
        requestAnimationFrame(tick);
      }
      tick();
    }
  }

  /* 3.12 Progress Bars */
  const bars = document.querySelectorAll('.bar[data-width]');
  bars.forEach(function (bar) {
    const fill = bar.querySelector('.bar-fill');
    const width = parseInt(bar.getAttribute('data-width'), 10);
    if (fill && !isNaN(width)) {
      gsap.fromTo(fill, { width: '0%' }, {
        width: width + '%',
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: bar,
          start: 'top 90%',
          once: true
        }
      });
    }
  });
})();
