/**
 * NextUp V3 — App JavaScript
 * Navigation, scroll reveals, counters, FAQ accordion
 */

(function () {
  'use strict';

  // ===== NAVIGATION =====
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  let lastScrollY = 0;
  let ticking = false;

  function handleNavScroll() {
    const currentScrollY = window.scrollY;

    // Add scrolled class
    if (currentScrollY > 60) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }

    // Hide/show on scroll direction
    if (currentScrollY > 400) {
      if (currentScrollY > lastScrollY + 5) {
        nav.classList.add('nav--hidden');
      } else if (currentScrollY < lastScrollY - 5) {
        nav.classList.remove('nav--hidden');
      }
    } else {
      nav.classList.remove('nav--hidden');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(handleNavScroll);
      ticking = true;
    }
  }, { passive: true });

  // Mobile toggle
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('nav--menu-open');
      navToggle.classList.toggle('nav__toggle--open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu on link click
    navLinks.querySelectorAll('.nav__link, .nav__cta').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('nav--menu-open');
        navToggle.classList.remove('nav__toggle--open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }


  // ===== SCROLL REVEAL (IntersectionObserver fallback) =====
  // Only activate JS-based reveals if CSS scroll-driven animations not supported
  const supportsScrollTimeline = CSS.supports && CSS.supports('animation-timeline', 'view()');

  if (!supportsScrollTimeline) {
    const revealElements = document.querySelectorAll('.reveal');

    if (revealElements.length > 0) {
      const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      revealElements.forEach(function (el) {
        revealObserver.observe(el);
      });
    }
  } else {
    // If scroll-driven animations are supported, remove the JS reveal opacity
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.style.opacity = '';
      el.classList.add('fade-in');
    });
  }


  // ===== COUNTER ANIMATION =====
  const countElements = document.querySelectorAll('.count-up');

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1200;
    const startTime = performance.now();

    function easeOut(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOut(progress);
      const currentValue = Math.round(easedProgress * target);

      el.textContent = currentValue;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(step);
  }

  if (countElements.length > 0) {
    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5
    });

    countElements.forEach(function (el) {
      counterObserver.observe(el);
    });
  }


  // ===== FAQ ACCORDION =====
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq-item__question');
    const answer = item.querySelector('.faq-item__answer');

    question.addEventListener('click', function () {
      const isOpen = item.classList.contains('faq-item--open');

      // Close all other items
      faqItems.forEach(function (otherItem) {
        if (otherItem !== item) {
          otherItem.classList.remove('faq-item--open');
          const otherAnswer = otherItem.querySelector('.faq-item__answer');
          otherAnswer.style.maxHeight = null;
          otherItem.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      if (isOpen) {
        item.classList.remove('faq-item--open');
        answer.style.maxHeight = null;
        question.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('faq-item--open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });


  // ===== SMOOTH SCROLL for anchor links =====
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = nav.offsetHeight;
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

})();
