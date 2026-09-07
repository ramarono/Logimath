/* ═══════════════════════════════════════════════════════════════
   LogV-1 MATH — JavaScript
   ═══════════════════════════════════════════════════════════════ */

'use strict';

// ── Footer year ───────────────────────────────────────────────
document.getElementById('footerYear').textContent = new Date().getFullYear();

// ── Navbar scroll state ───────────────────────────────────────
const navbar = document.getElementById('navbar');

function onNavbarScroll() {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
}
window.addEventListener('scroll', onNavbarScroll, { passive: true });
onNavbarScroll();

// ── Mobile hamburger ──────────────────────────────────────────
const hamburger = document.getElementById('navHamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// ── Active nav link on scroll ────────────────────────────────
const sections   = document.querySelectorAll('main section[id]');
const navItems   = document.querySelectorAll('.nav-link[data-section]');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navItems.forEach(link => {
        link.classList.toggle('active', link.dataset.section === id);
      });
    }
  });
}, {
  rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '72')}px 0px -55% 0px`,
  threshold: 0,
});

sections.forEach(s => sectionObserver.observe(s));

// ── Reveal on scroll (IntersectionObserver) ──────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Activities tabs ──────────────────────────────────────────
const actTabs   = document.querySelectorAll('.act-tab');
const actPanels = document.querySelectorAll('.act-panel');

actTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.getAttribute('aria-controls');

    // Update tabs
    actTabs.forEach(t => {
      const isActive = t === tab;
      t.classList.toggle('active', isActive);
      t.setAttribute('aria-selected', String(isActive));
    });

    // Update panels
    actPanels.forEach(panel => {
      panel.classList.toggle('active', panel.id === target);
    });
  });

  // Keyboard navigation
  tab.addEventListener('keydown', e => {
    const tabList = [...actTabs];
    const idx = tabList.indexOf(tab);
    let nextIdx = -1;

    if (e.key === 'ArrowRight') nextIdx = (idx + 1) % tabList.length;
    if (e.key === 'ArrowLeft')  nextIdx = (idx - 1 + tabList.length) % tabList.length;

    if (nextIdx >= 0) {
      tabList[nextIdx].focus();
      tabList[nextIdx].click();
    }
  });
});

// ── Contact form ──────────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    const btn  = contactForm.querySelector('[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = '✓ ¡Mensaje enviado!';
    btn.style.background = '#22c55e';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      btn.disabled = false;
      contactForm.reset();
    }, 3500);
  });
}

// ── Smooth hover parallax on hero shapes ─────────────────────
const heroSection = document.querySelector('.section--hero');
if (heroSection) {
  heroSection.addEventListener('mousemove', e => {
    const { clientX: x, clientY: y } = e;
    const { innerWidth: w, innerHeight: h } = window;
    const mx = (x / w - .5) * 20;
    const my = (y / h - .5) * 20;

    document.querySelectorAll('.shape').forEach((shape, i) => {
      const factor = (i + 1) * 0.4;
      shape.style.transform = `translate(${mx * factor}px, ${my * factor}px)`;
    });
  });

  heroSection.addEventListener('mouseleave', () => {
    document.querySelectorAll('.shape').forEach(shape => {
      shape.style.transform = '';
    });
  });
}

// ── Number counter animation ──────────────────────────────────
function animateCounter(el, target, duration = 1500, suffix = '') {
  const start = performance.now();
  const startVal = 0;

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
    const current  = Math.round(startVal + (target - startVal) * ease);

    el.textContent = current + suffix;

    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// Trigger counters when stats become visible
const statsEl = document.querySelector('.hero-stats');
if (statsEl) {
  const counterData = [
    { selector: '.stat-card:nth-child(1) .stat-num', target: 500, suffix: '+' },
    { selector: '.stat-card:nth-child(3) .stat-num', target: 98,  suffix: '%' },
    { selector: '.stat-card:nth-child(5) .stat-num', target: 12,  suffix: '+' },
  ];

  let animated = false;
  const counterObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      counterData.forEach(({ selector, target, suffix }) => {
        const el = document.querySelector(selector);
        if (el) animateCounter(el, target, 1800, suffix);
      });
    }
  }, { threshold: .5 });

  counterObserver.observe(statsEl);
}

// ── Scroll-driven animations (native, with fallback) ─────────
// Entry/exit reveal — already handled by IntersectionObserver above.
// For browsers with native scroll-driven animation support, the CSS
// handles additional parallax decorations (defined in styles.css).

// ── Floating math symbols drift ──────────────────────────────
// Subtle mouse-tracking drift for the math float symbols
if (window.matchMedia('(pointer: fine)').matches) {
  document.addEventListener('mousemove', e => {
    const { clientX: x, clientY: y } = e;
    const { innerWidth: w, innerHeight: h } = window;
    const rx = x / w - .5;
    const ry = y / h - .5;

    document.querySelectorAll('.mf').forEach((mf, i) => {
      const depth = ((i % 5) + 1) * 6;
      mf.style.transform = `translate(${rx * depth}px, ${ry * depth}px)`;
    });
  });
}

// ── iOS height fix ────────────────────────────────────────────
function setVhVar() {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * .01}px`);
}
setVhVar();
window.addEventListener('resize', setVhVar, { passive: true });
