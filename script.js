
// Smooth scroll is handled by CSS scroll-behavior.
// This script adds: mobile nav toggle, active link highlight, reveal-on-scroll, and basic form validation.

// Mobile nav toggle
const toggle = document.querySelector('.nav__toggle');
const menu = document.getElementById('navMenu');
if (toggle && menu){
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true' || false;
    toggle.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('show');
  });
  // Close menu on link click (mobile)
  menu.addEventListener('click', (e) => {
    if (e.target.matches('.nav__link')){
      menu.classList.remove('show');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Active section link highlighting
const observerSections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.getAttribute('id');
    const link = document.querySelector(`.nav__link[href="#${id}"]`);
    if (link){
      if (entry.isIntersecting){
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}, { threshold: 0.5 });

observerSections.forEach(s => sectionObserver.observe(s));

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

// Dynamic year
document.getElementById('year').textContent = new Date().getFullYear();

// Contact form validation (client-side only)
const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');

function setHint(id, message){
  const hint = document.querySelector(`.field__hint[data-hint-for="${id}"]`);
  if (hint) hint.textContent = message || '';
}

if (form){
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    // Simple validations
    if (!name){ valid = false; setHint('name', 'Please enter your name.'); } else setHint('name');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ valid = false; setHint('email', 'Enter a valid email.'); } else setHint('email');
    if (!subject){ valid = false; setHint('subject', 'Subject is required.'); } else setHint('subject');
    if (!message || message.length < 10){ valid = false; setHint('message', 'Please write at least 10 characters.'); } else setHint('message');

    if (!valid){
      statusEl.hidden = false;
      statusEl.textContent = 'Please fix the errors above.';
      statusEl.style.color = '#fca5a5';
      return;
    }

    // Success (no backend connected)
    statusEl.hidden = false;
    statusEl.textContent = 'Thanks! Your message is ready to send. Connect a backend to deliver it.';
    statusEl.style.color = '#86efac';

    // Example: to integrate with Formspree, uncomment and replace ENDPOINT
    // fetch('https://formspree.io/f/your-endpoint', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ name, email, subject, message })
    // }).then(() => {
    //   statusEl.textContent = 'Message sent successfully!';
    // }).catch(() => {
    //   statusEl.textContent = 'Something went wrong. Please try again later.';
    //   statusEl.style.color = '#fca5a5';
    // });
  });
}
