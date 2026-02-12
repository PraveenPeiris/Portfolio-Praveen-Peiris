/* ═══════════════════════════════════════════════════════════
   PRAVEEN PEIRIS — DIGITAL TWIN PORTFOLIO
   Interactive Engine: Parallax · Particles · Skills Canvas
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────
     0. UTILITIES
     ───────────────────────────────────────── */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);
  const lerp = (a, b, t) => a + (b - a) * t;
  const rand = (min, max) => Math.random() * (max - min) + min;

  /* ─────────────────────────────────────────
     1. NAVBAR — Scroll Effects + Mobile Toggle
     ───────────────────────────────────────── */
  const nav = $('#main-nav');
  const navToggle = $('#nav-toggle');
  const navLinks = $('.nav__links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Close mobile menu on link click
  $$('.nav__link').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });

  /* ─────────────────────────────────────────
     2. SCROLL REVEAL (IntersectionObserver)
     ───────────────────────────────────────── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  $$('.reveal-up, .reveal-text').forEach((el) => revealObserver.observe(el));

  // Stagger reveal-text elements in the hero
  $$('.hero .reveal-text').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.15 + 0.3}s`;
  });

  // Trigger hero reveals on load
  setTimeout(() => {
    $$('.hero .reveal-text').forEach((el) => el.classList.add('visible'));
  }, 200);

  /* ─────────────────────────────────────────
     3. HERO PARALLAX
     ───────────────────────────────────────── */
  const heroWrapper = $('.hero__image-wrapper');
  const hero = $('.hero');
  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  });

  function animateParallax() {
    currentX = lerp(currentX, mouseX, 0.08);
    currentY = lerp(currentY, mouseY, 0.08);
    if (heroWrapper) {
      const depth = parseFloat(heroWrapper.dataset.depth) || 0.3;
      heroWrapper.style.transform = `translateY(${Math.sin(Date.now() / 1000) * 18}px) translate(${currentX * depth * 30}px, ${currentY * depth * 20}px)`;
    }
    requestAnimationFrame(animateParallax);
  }
  animateParallax();

  /* ─────────────────────────────────────────
     4. HERO PARTICLE CANVAS
     ───────────────────────────────────────── */
  const particleCanvas = $('#hero-particles');
  if (particleCanvas) {
    const ctx = particleCanvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 80;

    function resizeParticleCanvas() {
      particleCanvas.width = particleCanvas.offsetWidth * window.devicePixelRatio;
      particleCanvas.height = particleCanvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    resizeParticleCanvas();
    window.addEventListener('resize', resizeParticleCanvas);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = rand(0, particleCanvas.offsetWidth);
        this.y = rand(0, particleCanvas.offsetHeight);
        this.size = rand(0.5, 2.5);
        this.speedX = rand(-0.15, 0.15);
        this.speedY = rand(-0.3, -0.05);
        this.opacity = rand(0.15, 0.6);
        this.fadeSpeed = rand(0.002, 0.008);
        this.growing = Math.random() > 0.5;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.growing) {
          this.opacity += this.fadeSpeed;
          if (this.opacity >= 0.6) this.growing = false;
        } else {
          this.opacity -= this.fadeSpeed;
          if (this.opacity <= 0.05) this.reset();
        }
        if (this.y < -10 || this.x < -10 || this.x > particleCanvas.offsetWidth + 10) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,102,241,${this.opacity})`;
        ctx.fill();
        // Subtle glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,102,241,${this.opacity * 0.15})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    function animateParticles() {
      ctx.clearRect(0, 0, particleCanvas.offsetWidth, particleCanvas.offsetHeight);
      particles.forEach((p) => { p.update(); p.draw(); });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* ─────────────────────────────────────────
     5. DUAL-CORE SKILLS — Frontier Orb Stagger
     ───────────────────────────────────────── */
  $$('.skill-orb--frontier').forEach((orb, i) => {
    orb.style.setProperty('--i', i);
  });

  /* ─────────────────────────────────────────
     6. CRT RANDOM FLICKER
     ───────────────────────────────────────── */
  const crtFlicker = $('.crt-flicker');
  if (crtFlicker) {
    setInterval(() => {
      const r = Math.random();
      if (r < 0.05) {
        crtFlicker.style.opacity = '0.15';
        setTimeout(() => { crtFlicker.style.opacity = '0'; }, 60);
      }
    }, 100);
  }

  /* ─────────────────────────────────────────
     7. SMOOTH SCROLL for Anchor Links
     ───────────────────────────────────────── */
  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ─────────────────────────────────────────
     8. TIMELINE DOT ACTIVATION ON SCROLL
     ───────────────────────────────────────── */
  const timelineDots = $$('.timeline__dot');
  const dotObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('timeline__dot--active');
        }
      });
    },
    { threshold: 0.5 }
  );
  timelineDots.forEach((dot) => dotObserver.observe(dot));



  /* ─────────────────────────────────────────
     10. PROGRESS BAR ANIMATION
     ───────────────────────────────────────── */
  const progressFill = $('.watchlist__progress-fill');
  if (progressFill) {
    const progressObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            progressFill.style.width = '78%';
            progressObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    progressFill.style.width = '0%';
    progressObserver.observe(progressFill);
  }

  /* ─────────────────────────────────────────
     11. BADMINTON SCHEDULE BAR ANIMATION
     ───────────────────────────────────────── */
  const scheduleFills = $$('.badminton-schedule__fill');
  scheduleFills.forEach((fill) => {
    const target = fill.style.width;
    fill.style.width = '0%';
    const barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fill.style.width = target;
            barObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    barObserver.observe(fill);
  });

  /* ─────────────────────────────────────────
     12. ABOUT STATS COUNTER ANIMATION
     ───────────────────────────────────────── */
  const statNumbers = $$('.about__stat-number');
  statNumbers.forEach((stat) => {
    const finalText = stat.textContent;
    const finalNum = parseInt(finalText);
    const hasSuffix = finalText.includes('+');
    stat.textContent = '0' + (hasSuffix ? '+' : '');

    const statObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            let current = 0;
            const duration = 1600;
            const step = finalNum / (duration / 16);
            const counter = setInterval(() => {
              current += step;
              if (current >= finalNum) {
                current = finalNum;
                clearInterval(counter);
              }
              stat.textContent = Math.round(current) + (hasSuffix ? '+' : '');
            }, 16);
            statObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    statObserver.observe(stat);
  });

})();
