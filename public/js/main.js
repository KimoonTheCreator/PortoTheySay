/* ============================================================
   main.js — Portfolio Interactions & Animations
   PortoTheySay | Bram Sebastian
   ============================================================ */

'use strict';

// ════════════════════════════════════════════════════════════
// 1. CUSTOM CURSOR
// ════════════════════════════════════════════════════════════
(function initCursor() {
  const cursor         = document.getElementById('cursor');
  const cursorFollower = document.getElementById('cursor-follower');
  if (!cursor || !cursorFollower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
  let isAnimating = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';

    if (!isAnimating) {
      isAnimating = true;
      animateFollower();
    }
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.13;
    followerY += (mouseY - followerY) * 0.13;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }

  // Hover effect on interactive elements
  const interactiveEls = document.querySelectorAll(
    'a, button, .project-card, .skill-category, .timeline-item, .form-input'
  );
  interactiveEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('is-hovered');
      cursorFollower.classList.add('is-hovered');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-hovered');
      cursorFollower.classList.remove('is-hovered');
    });
  });

  // Hide cursor when it leaves window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorFollower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorFollower.style.opacity = '1';
  });
})();


// ════════════════════════════════════════════════════════════
// 2. SCROLL PROGRESS BAR
// ════════════════════════════════════════════════════════════
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  function updateProgress() {
    const scrollTop  = window.pageYOffset;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width  = progress + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
})();


// ════════════════════════════════════════════════════════════
// 3. NAVBAR — scroll behavior (hide/show + backdrop)
// ════════════════════════════════════════════════════════════
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  if (!navbar) return;

  let lastScrollY = 0;

  function updateNavbar() {
    const scrollY = window.scrollY;

    // Add backdrop blur after scrolling 60px
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Hide on scroll down, show on scroll up (only after 200px)
    if (scrollY > lastScrollY && scrollY > 200) {
      navbar.classList.add('hidden');
    } else {
      navbar.classList.remove('hidden');
    }

    lastScrollY = scrollY <= 0 ? 0 : scrollY;
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();
})();


// ════════════════════════════════════════════════════════════
// 4. MOBILE HAMBURGER MENU
// ════════════════════════════════════════════════════════════
(function initHamburger() {
  const hamburger = document.getElementById('nav-hamburger');
  const mobileNav = document.getElementById('nav-mobile');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    mobileNav.setAttribute('aria-hidden', isOpen ? 'false' : 'true');

    if (isOpen) {
      mobileNav.style.display = 'block';
      requestAnimationFrame(() => mobileNav.classList.add('open'));
    } else {
      mobileNav.classList.remove('open');
      setTimeout(() => { mobileNav.style.display = ''; }, 350);
    }
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('open');
      mobileNav.setAttribute('aria-hidden', 'true');
      setTimeout(() => { mobileNav.style.display = ''; }, 350);
    });
  });
})();


// ════════════════════════════════════════════════════════════
// 5. ACTIVE NAV LINK (highlight based on scroll position)
// ════════════════════════════════════════════════════════════
(function initActiveNav() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  function updateActive() {
    const scrollY = window.scrollY + 160;

    let current = '';
    sections.forEach(section => {
      if (scrollY >= section.offsetTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
})();


// ════════════════════════════════════════════════════════════
// 6. SMOOTH SCROLL for anchor links
// ════════════════════════════════════════════════════════════
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href   = anchor.getAttribute('href');
      if (href === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 76;
        const top       = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();


// ════════════════════════════════════════════════════════════
// 7. FADE-IN ON SCROLL (Intersection Observer)
// ════════════════════════════════════════════════════════════
(function initFadeIn() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay) || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold:  0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();


// ════════════════════════════════════════════════════════════
// 8. TEXT SCRAMBLE EFFECT (Hero Name)
// ════════════════════════════════════════════════════════════
class TextScramble {
  constructor(el) {
    this.el     = el;
    this.chars  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!<>-_\\/[]{}—=+*^?#@';
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const length = newText.length;
    const promise = new Promise(resolve => (this.resolve = resolve));
    this.queue = [];

    for (let i = 0; i < length; i++) {
      const to    = newText[i];
      const start = Math.floor(Math.random() * 12);
      const end   = start + Math.floor(Math.random() * 14) + 6;
      this.queue.push({ to, start, end, char: '' });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output   = '';
    let complete = 0;

    for (let i = 0; i < this.queue.length; i++) {
      const { to, start, end } = this.queue[i];
      let   { char }           = this.queue[i];

      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.3) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="scramble-char">${char}</span>`;
      } else {
        output += to; // keep letter but invisible until start
      }
    }

    this.el.innerHTML = output;

    if (complete === this.queue.length) {
      this.el.textContent = this.queue.map(q => q.to).join(''); // clean HTML
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// Trigger scramble on load
window.addEventListener('load', () => {
  const heroName = document.getElementById('hero-name');
  if (!heroName) return;

  // ✅ GANTI: teks di bawah ini harus sama dengan nama kamu di HTML
  const TARGET_NAME = 'BRAM SEBASTIAN';

  const fx = new TextScramble(heroName);
  heroName.textContent = TARGET_NAME; // fallback jika JS lambat

  setTimeout(() => {
    heroName.textContent = '';
    fx.setText(TARGET_NAME);
  }, 700);
});


// ════════════════════════════════════════════════════════════
// 9. CONTACT FORM (placeholder submit handler)
// ════════════════════════════════════════════════════════════
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    // ✅ GANTI: Hapus e.preventDefault() dan tambahkan action Formspree
    //          jika kamu sudah siapkan backend / Formspree
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    btn.textContent  = 'Mengirim...';
    btn.disabled     = true;

    // Simulasi kirim (hapus timeout ini jika pakai backend nyata)
    setTimeout(() => {
      btn.textContent = 'Terkirim! ✓';
      btn.style.background = 'transparent';
      btn.style.color = 'var(--clr-white)';
      btn.style.borderColor = 'var(--clr-border-2)';

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.color = '';
        btn.style.borderColor = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
    }, 1200);
  });
})();


// ════════════════════════════════════════════════════════════
// 10. STAGGER DELAYS untuk cards
// ════════════════════════════════════════════════════════════
(function initStaggerDelays() {
  // Project cards
  document.querySelectorAll('.projects-grid .project-card').forEach((card, i) => {
    if (!card.dataset.delay) card.dataset.delay = i * 130;
  });

  // Skill categories
  document.querySelectorAll('.skills-grid .skill-category').forEach((cat, i) => {
    if (!cat.dataset.delay) cat.dataset.delay = i * 100;
  });

  // Timeline items
  document.querySelectorAll('.timeline-item').forEach((item, i) => {
    if (!item.dataset.delay) item.dataset.delay = i * 150;
  });
})();


// ════════════════════════════════════════════════════════════
// 11. BACK TO TOP
// ════════════════════════════════════════════════════════════
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
