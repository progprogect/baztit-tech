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

  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: function (t) {
        return Math.min(1, 1.001 - Math.pow(2, -10 * t));
      }
    });

    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
    }

    if (typeof gsap !== 'undefined') {
      gsap.ticker.add(function (time) {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }

  function scrollToHash(e) {
    const link = e.target.closest ? e.target.closest('a') : e.target;
    if (link && link.getAttribute('href')?.startsWith('#')) {
      const id = link.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el && lenis) {
        e.preventDefault();
        lenis.scrollTo(el, { offset: 0 });
      }
    }
  }
  document.addEventListener('click', scrollToHash, true);

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
      delay: 0.3,
      onComplete: startTypewriter
    });
  } else if (document.querySelector('.hero-subheadline')) {
    setTimeout(startTypewriter, 1500);
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

  /* 3.8 Horizontal Scroll */
  const casesTrack = document.querySelector('.cases-track');
  const casesSection = document.querySelector('.cases-section');
  if (casesTrack && casesSection && casesTrack.children.length > 0 && window.innerWidth >= 768) {
    const endX = -(casesTrack.scrollWidth - window.innerWidth + 96);
    gsap.to(casesTrack, {
      x: endX,
      ease: 'none',
      scrollTrigger: {
        trigger: casesSection,
        pin: true,
        scrub: 1,
        start: 'top top',
        end: function () { return '+' + (casesTrack.scrollWidth - window.innerWidth); }
      }
    });
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
