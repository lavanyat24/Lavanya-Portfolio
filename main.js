// DOM Elements
const header = document.getElementById('header');
const navLinks = document.querySelector('.nav-links');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const themeToggleIcon = document.getElementById('theme-toggle-icon');
const scrollToTopBtn = document.getElementById('scroll-to-top');
const skillCards = document.querySelectorAll('.skill-card');
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const contactForm = document.getElementById('contact-form');

// Check if dark mode is preferred or was previously set
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.classList.toggle('dark', savedTheme === 'dark');
  updateThemeIcon(savedTheme === 'dark');
}

// Initialize theme on load
initTheme();

// Update theme toggle icon
function updateThemeIcon(isDark) {
  if (!themeToggleIcon) return;
  if (isDark) {
    themeToggleIcon.classList.remove('fa-moon');
    themeToggleIcon.classList.add('fa-sun');
  } else {
    themeToggleIcon.classList.remove('fa-sun');
    themeToggleIcon.classList.add('fa-moon');
  }
}

// Toggle theme on click
if (themeToggleIcon) {
  themeToggleIcon.addEventListener('click', function () {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
  });
}

// Mobile Menu Toggle
if (mobileMenuBtn && navLinks) {
  mobileMenuBtn.addEventListener('click', function (event) {
    event.stopPropagation();
    navLinks.classList.toggle('show');
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function () {
      navLinks.classList.remove('show');
    });
  });

  document.addEventListener('click', function (event) {
    const isClickInsideNav =
      navLinks.contains(event.target) || mobileMenuBtn.contains(event.target);
    if (!isClickInsideNav && navLinks.classList.contains('show')) {
      navLinks.classList.remove('show');
    }
  });
}

// Navbar Scroll Effect
window.addEventListener('scroll', function () {
  if (header) {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }

  if (scrollToTopBtn) {
    scrollToTopBtn.classList.toggle('show', window.scrollY > 500);
  }

  setActiveNavLink();
});

if (scrollToTopBtn) {
  scrollToTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Active Link Highlight
function setActiveNavLink() {
  const sections = document.querySelectorAll('section');
  let currentActive = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      currentActive = section.getAttribute('id');
    }
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentActive}`) {
      link.classList.add('active');
    }
  });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth',
      });

      if (navLinks && navLinks.classList.contains('show')) {
        navLinks.classList.remove('show');
      }
    }
  });
});

// Typewriter Effect in Hero Section
class TypeWriter {
  constructor(txtElement, words, wait = 3000) {
    this.txtElement = txtElement;
    this.words = words;
    this.txt = '';
    this.wordIndex = 0;
    this.wait = parseInt(wait, 10);
    this.type();
    this.isDeleting = false;
  }

  type() {
    const current = this.wordIndex % this.words.length;
    const fullTxt = this.words[current];

    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.txtElement.innerHTML = `${this.txt} |`;

    let typeSpeed = 100;
    if (this.isDeleting) typeSpeed /= 2;

    if (!this.isDeleting && this.txt === fullTxt) {
      typeSpeed = this.wait;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.wordIndex++;
      typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// Initialize Typewriter Effect
function initTypewriter() {
  const txtElement = document.querySelector('.typewriter');
  if (txtElement) {
    const words = ['Web Developer', 'Frontend Developer'];
    new TypeWriter(txtElement, words, 2000);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  initTypewriter();

  // Project Filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        if (
          filterValue === 'all' ||
          card.getAttribute('data-category') === filterValue
        ) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Add animation for skill cards
  const skillsSection = document.getElementById('skills');
  if (skillsSection && skillCards.length > 0) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate'); // Optional class to trigger animation
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    skillCards.forEach(card => observer.observe(card));
  }

  // Form Submission Handler
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const subjectInput = document.getElementById('subject');
      const messageInput = document.getElementById('message');

      let isValid = true;

      if (nameInput.value.trim() === '') {
        isValid = false;
        nameInput.style.borderColor = 'red';
      } else {
        nameInput.style.borderColor = '';
      }

      if (
        emailInput.value.trim() === '' ||
        !isValidEmail(emailInput.value)
      ) {
        isValid = false;
        emailInput.style.borderColor = 'red';
      } else {
        emailInput.style.borderColor = '';
      }

      if (subjectInput.value.trim() === '') {
        isValid = false;
        subjectInput.style.borderColor = 'red';
      } else {
        subjectInput.style.borderColor = '';
      }

      if (messageInput.value.trim() === '') {
        isValid = false;
        messageInput.style.borderColor = 'red';
      } else {
        messageInput.style.borderColor = '';
      }

      if (isValid) {
        alert('Your message has been sent successfully!');
        contactForm.reset();
      } else {
        alert('Please fill all the required fields correctly.');
      }
    });
  }
});

// Email validation helper
function isValidEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
