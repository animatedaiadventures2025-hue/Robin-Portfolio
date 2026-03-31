// ==================== NAVBAR ====================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ==================== MENU TABS ====================
const menuTabs = document.querySelectorAll('.menu-tab');
const menuItems = document.querySelectorAll('.menu-item');

menuTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    menuTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const category = tab.dataset.tab;
    menuItems.forEach(item => {
      item.style.display = item.dataset.category === category ? 'block' : 'none';
    });
  });
});

// ==================== RESERVATION FORM ====================
const reservationForm = document.getElementById('reservationForm');
const formSuccess = document.getElementById('formSuccess');

reservationForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = reservationForm.querySelector('button[type="submit"]');
  btn.textContent = 'Reserving...';
  btn.disabled = true;

  setTimeout(() => {
    formSuccess.style.display = 'block';
    btn.textContent = 'Reservation Confirmed ✓';
    setTimeout(() => {
      reservationForm.reset();
      btn.textContent = 'Confirm Reservation';
      btn.disabled = false;
      formSuccess.style.display = 'none';
    }, 4000);
  }, 1000);
});

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ==================== INTERSECTION OBSERVER ====================
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.special-card, .menu-item, .testimonial-card, .gallery-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// ==================== SET MIN DATE FOR RESERVATION ====================
const dateInput = document.getElementById('resDate');
const today = new Date().toISOString().split('T')[0];
dateInput.setAttribute('min', today);
