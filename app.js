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
     5. SKILLS CONSTELLATION CANVAS
     ───────────────────────────────────────── */
  const skillsCanvas = $('#skills-canvas');
  if (skillsCanvas) {
    const sCtx = skillsCanvas.getContext('2d');
    let skillOrbs = [];
    let sMouse = { x: skillsCanvas.offsetWidth / 2, y: skillsCanvas.offsetHeight / 2 };

    const SKILLS = [
      'Java', 'JavaScript', 'TypeScript', 'Python',
      'Spring', 'React', 'Next.js', 'Node.js',
      'Oracle SQL', 'MySQL', 'DGraph', 'Qdrant',
      'AI / LLM', 'LangGraph', 'Docker', 'AWS',
      'Jenkins', 'Git'
    ];

    const COLORS = [
      '#6366f1', '#818cf8', '#a78bfa', '#c084fc',
      '#f472b6', '#22d3ee', '#34d399', '#fbbf24'
    ];

    function resizeSkillsCanvas() {
      skillsCanvas.width = skillsCanvas.offsetWidth * window.devicePixelRatio;
      skillsCanvas.height = skillsCanvas.offsetHeight * window.devicePixelRatio;
      sCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    resizeSkillsCanvas();
    window.addEventListener('resize', resizeSkillsCanvas);

    class SkillOrb {
      constructor(text, index) {
        this.text = text;
        this.baseRadius = rand(28, 44);
        this.radius = this.baseRadius;
        this.x = rand(80, skillsCanvas.offsetWidth - 80);
        this.y = rand(80, skillsCanvas.offsetHeight - 80);
        this.vx = rand(-0.4, 0.4);
        this.vy = rand(-0.4, 0.4);
        this.color = COLORS[index % COLORS.length];
        this.glowIntensity = rand(0.15, 0.35);
        this.phase = rand(0, Math.PI * 2);
      }
      update(mousePos) {
        const w = skillsCanvas.offsetWidth;
        const h = skillsCanvas.offsetHeight;

        // Drift
        this.x += this.vx;
        this.y += this.vy;

        // Pulse
        this.radius = this.baseRadius + Math.sin(Date.now() / 1200 + this.phase) * 4;

        // Mouse attraction
        const dx = mousePos.x - this.x;
        const dy = mousePos.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 250 && dist > 0) {
          const force = 0.5 / dist;
          this.vx += dx * force;
          this.vy += dy * force;
        }

        // Damping
        this.vx *= 0.985;
        this.vy *= 0.985;

        // Bounds
        if (this.x < this.radius) { this.x = this.radius; this.vx *= -0.6; }
        if (this.x > w - this.radius) { this.x = w - this.radius; this.vx *= -0.6; }
        if (this.y < this.radius) { this.y = this.radius; this.vy *= -0.6; }
        if (this.y > h - this.radius) { this.y = h - this.radius; this.vy *= -0.6; }
      }
      draw(ctx) {
        // Outer glow
        const grd = ctx.createRadialGradient(this.x, this.y, this.radius * 0.4, this.x, this.y, this.radius * 2.5);
        grd.addColorStop(0, this.color + '30');
        grd.addColorStop(1, this.color + '00');
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Orb body
        const bodyGrd = ctx.createRadialGradient(this.x - this.radius * 0.2, this.y - this.radius * 0.2, 0, this.x, this.y, this.radius);
        bodyGrd.addColorStop(0, this.color + 'cc');
        bodyGrd.addColorStop(0.7, this.color + '66');
        bodyGrd.addColorStop(1, this.color + '20');
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = bodyGrd;
        ctx.fill();

        // Border ring
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = this.color + '50';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Text
        ctx.fillStyle = '#fff';
        ctx.font = `500 ${Math.max(10, this.radius * 0.35)}px 'Space Grotesk', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.text, this.x, this.y);
      }
    }

    SKILLS.forEach((s, i) => skillOrbs.push(new SkillOrb(s, i)));

    skillsCanvas.addEventListener('mousemove', (e) => {
      const rect = skillsCanvas.getBoundingClientRect();
      sMouse.x = e.clientX - rect.left;
      sMouse.y = e.clientY - rect.top;
    });
    skillsCanvas.addEventListener('mouseleave', () => {
      sMouse.x = skillsCanvas.offsetWidth / 2;
      sMouse.y = skillsCanvas.offsetHeight / 2;
    });

    function drawConnections() {
      for (let i = 0; i < skillOrbs.length; i++) {
        for (let j = i + 1; j < skillOrbs.length; j++) {
          const a = skillOrbs[i], b = skillOrbs[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            sCtx.beginPath();
            sCtx.moveTo(a.x, a.y);
            sCtx.lineTo(b.x, b.y);
            sCtx.strokeStyle = `rgba(99,102,241,${(1 - dist / 180) * 0.12})`;
            sCtx.lineWidth = 1;
            sCtx.stroke();
          }
        }
      }
    }

    function animateSkills() {
      sCtx.clearRect(0, 0, skillsCanvas.offsetWidth, skillsCanvas.offsetHeight);
      drawConnections();
      skillOrbs.forEach((orb) => { orb.update(sMouse); orb.draw(sCtx); });
      requestAnimationFrame(animateSkills);
    }
    animateSkills();
  }

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
     9. SKILL TAGS PARALLAX REVEAL
     ───────────────────────────────────────── */
  const skillTags = $$('.skills__list span');
  skillTags.forEach((tag, i) => {
    tag.style.transitionDelay = `${i * 0.04}s`;
    tag.style.opacity = '0';
    tag.style.transform = 'translateY(20px)';
  });

  const skillListObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          skillTags.forEach((tag) => {
            tag.style.opacity = '1';
            tag.style.transform = 'translateY(0)';
          });
          skillListObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  const skillsList = $('.skills__list');
  if (skillsList) skillListObserver.observe(skillsList);

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
