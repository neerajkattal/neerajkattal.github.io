// ============ THEME TOGGLE ============
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  if (themeToggle) themeToggle.textContent = theme === 'light' ? '🌙' : '☀';
}
const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(current);
  });
}

// ============ NAV SCROLL EFFECT + ACTIVE LINK ============
const nav = document.querySelector('nav');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const progressBar = document.querySelector('.scroll-progress');
const backToTop = document.querySelector('.back-to-top');

function onScroll() {
  const scrollY = window.scrollY;
  nav.classList.toggle('scrolled', scrollY > 30);

  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
  if (progressBar) progressBar.style.width = progress + '%';

  if (backToTop) backToTop.classList.toggle('show', scrollY > 500);

  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (scrollY >= top) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ============ MOBILE NAV TOGGLE ============
const navToggle = document.getElementById('navToggle');
const navLinksEl = document.getElementById('navLinks');
if (navToggle && navLinksEl) {
  navToggle.addEventListener('click', () => {
    navLinksEl.classList.toggle('open');
    navToggle.classList.toggle('open');
  });
  navLinksEl.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinksEl.classList.remove('open');
    navToggle.classList.remove('open');
  }));
}

// ============ BACK TO TOP CLICK ============
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============ SCROLL REVEAL ANIMATION ============
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// ============ HERO TYPING EFFECT ============
const typedEl = document.getElementById('typedText');
if (typedEl) {
  const phrases = [
    'Full-Stack Developer',
    'Software Engineering Student',
    'FastAPI & React Builder',
    'Auckland, NZ'
  ];
  let phraseIndex = 0, charIndex = 0, deleting = false;

  function type() {
    const current = phrases[phraseIndex];
    if (!deleting) {
      typedEl.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(type, 1600);
        return;
      }
    } else {
      typedEl.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? 45 : 75);
  }
  type();
}

// ============ ANIMATED STAT COUNTERS ============
const statNums = document.querySelectorAll('.stat-num[data-target]');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => statObserver.observe(el));

function animateCounter(el) {
  const target = el.getAttribute('data-target');
  const suffix = el.getAttribute('data-suffix') || '';
  const numMatch = target.match(/[\d.]+/);
  if (!numMatch) { el.textContent = target; return; }
  const num = parseFloat(numMatch[0]);
  const duration = 1200;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = (num * eased);
    el.textContent = (num % 1 === 0 ? Math.round(current) : current.toFixed(1)) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ============ PROJECT FILTERING ============
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');

    projectCards.forEach(card => {
      const tags = card.getAttribute('data-tags') || '';
      const show = filter === 'all' || tags.includes(filter);
      card.style.display = show ? 'flex' : 'none';
    });
  });
});

// ============ SMOOTH SCROLL ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId.length > 1) {
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
      }
    }
  });
});
