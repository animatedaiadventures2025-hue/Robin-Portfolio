// ==================== STATE ====================
let selectedService = { name: 'Free Consultation', price: 0, duration: 30 };
let selectedDate = null;
let selectedTime = null;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let bookings = JSON.parse(localStorage.getItem('bookeasy_bookings') || '[]');

// ==================== NAVBAR ====================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 50));
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

// ==================== SERVICE SELECTION ====================
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach(card => {
  card.addEventListener('click', () => {
    serviceCards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedService = {
      name: card.querySelector('h3').textContent,
      price: parseInt(card.dataset.price),
      duration: parseInt(card.dataset.duration)
    };
    updateSummary();
  });
});

// ==================== CALENDAR ====================
const calendarDates = document.getElementById('calendarDates');
const calendarTitle = document.getElementById('calendarTitle');
const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function renderCalendar() {
  calendarTitle.textContent = `${months[currentMonth]} ${currentYear}`;
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let html = '';
  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    html += '<button class="empty" disabled></button>';
  }
  // Days
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(currentYear, currentMonth, d);
    const isPast = date < today;
    const isToday = date.getTime() === today.getTime();
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isSelected = selectedDate === dateStr;
    const classes = [];
    if (isPast) classes.push('past');
    if (isToday) classes.push('today');
    if (isSelected) classes.push('selected');
    const disabled = isPast ? 'disabled' : '';
    html += `<button class="${classes.join(' ')}" ${disabled} data-date="${dateStr}">${d}</button>`;
  }
  calendarDates.innerHTML = html;

  // Bind date clicks
  calendarDates.querySelectorAll('button:not(.empty):not(.past)').forEach(btn => {
    btn.addEventListener('click', () => {
      calendarDates.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedDate = btn.dataset.date;
      renderTimeSlots();
      updateSummary();
    });
  });
}

document.getElementById('prevMonth').addEventListener('click', () => {
  currentMonth--;
  if (currentMonth < 0) { currentMonth = 11; currentYear--; }
  renderCalendar();
});
document.getElementById('nextMonth').addEventListener('click', () => {
  currentMonth++;
  if (currentMonth > 11) { currentMonth = 0; currentYear++; }
  renderCalendar();
});

// ==================== TIME SLOTS ====================
const timeSlotsGrid = document.getElementById('timeSlotsGrid');
const selectedDateDisplay = document.getElementById('selectedDateDisplay');
const allSlots = ['9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM',
  '1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM'];

function renderTimeSlots() {
  if (!selectedDate) {
    timeSlotsGrid.innerHTML = '<p class="time-slots-empty">Select a date to see available times</p>';
    return;
  }
  const date = new Date(selectedDate + 'T00:00:00');
  const dateStr = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  selectedDateDisplay.textContent = dateStr;

  // Randomly hide some slots (simulate booked)
  const seed = date.getDate() + date.getMonth();
  let html = '';
  allSlots.forEach((slot, i) => {
    const isBooked = (seed + i) % 3 === 0;
    if (isBooked) {
      html += `<button class="time-slot" disabled style="opacity:0.4;cursor:not-allowed;text-decoration:line-through">${slot}</button>`;
    } else {
      const isSelected = selectedTime === slot;
      html += `<button class="time-slot ${isSelected ? 'selected' : ''}" data-time="${slot}">${slot}</button>`;
    }
  });
  timeSlotsGrid.innerHTML = html;

  timeSlotsGrid.querySelectorAll('.time-slot:not([disabled])').forEach(btn => {
    btn.addEventListener('click', () => {
      timeSlotsGrid.querySelectorAll('.time-slot').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedTime = btn.dataset.time;
      updateSummary();
    });
  });
}

// ==================== SUMMARY ====================
function updateSummary() {
  document.getElementById('summaryService').textContent = selectedService.name;
  document.getElementById('summaryDate').textContent = selectedDate
    ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    : 'Not selected';
  document.getElementById('summaryTime').textContent = selectedTime || 'Not selected';
  document.getElementById('summaryDuration').textContent = `${selectedService.duration} min`;
  document.getElementById('summaryTotal').textContent = selectedService.price === 0 ? 'Free' : `$${selectedService.price}`;
}

// ==================== BOOKING FORM ====================
const bookingFormEl = document.getElementById('bookingFormEl');
const confirmModal = document.getElementById('confirmModal');

bookingFormEl.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!selectedDate || !selectedTime) {
    alert('Please select a date and time');
    return;
  }
  const booking = {
    id: Date.now(),
    service: selectedService.name,
    price: selectedService.price,
    duration: selectedService.duration,
    date: selectedDate,
    time: selectedTime,
    name: document.getElementById('bookName').value,
    email: document.getElementById('bookEmail').value,
    phone: document.getElementById('bookPhone').value,
    notes: document.getElementById('bookNotes').value,
    createdAt: new Date().toISOString()
  };
  bookings.push(booking);
  localStorage.setItem('bookeasy_bookings', JSON.stringify(bookings));

  // Show modal
  const dateObj = new Date(selectedDate + 'T00:00:00');
  document.getElementById('modalDetails').innerHTML = `
    <div><span>Service</span><span>${booking.service}</span></div>
    <div><span>Date</span><span>${dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span></div>
    <div><span>Time</span><span>${booking.time}</span></div>
    <div><span>Duration</span><span>${booking.duration} min</span></div>
    <div><span>Total</span><span>${booking.price === 0 ? 'Free' : '$' + booking.price}</span></div>
  `;
  confirmModal.classList.add('active');

  // Reset form
  bookingFormEl.reset();
  selectedDate = null;
  selectedTime = null;
  document.querySelectorAll('.service-card').forEach(c => c.classList.remove('selected'));
  document.querySelectorAll('.calendar-dates button').forEach(b => b.classList.remove('selected'));
  document.querySelectorAll('.time-slot').forEach(b => b.classList.remove('selected'));
  renderTimeSlots();
  updateSummary();
  renderBookings();
});

document.getElementById('modalClose').addEventListener('click', () => {
  confirmModal.classList.remove('active');
});
confirmModal.addEventListener('click', (e) => {
  if (e.target === confirmModal) confirmModal.classList.remove('active');
});

// ==================== MY BOOKINGS ====================
function renderBookings() {
  const list = document.getElementById('bookingsList');
  const empty = document.getElementById('bookingsEmpty');
  // Remove all booking cards
  list.querySelectorAll('.booking-card').forEach(c => c.remove());
  if (bookings.length === 0) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  bookings.forEach(b => {
    const dateObj = new Date(b.date + 'T00:00:00');
    const div = document.createElement('div');
    div.className = 'booking-card';
    div.innerHTML = `
      <div class="booking-card-info">
        <h4>${b.service}</h4>
        <p>${b.name} · ${b.email}</p>
      </div>
      <div class="booking-card-meta">
        <div class="date">${dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
        <div class="time">${b.time}</div>
        <button class="booking-card-delete" data-id="${b.id}">Cancel</button>
      </div>
    `;
    list.appendChild(div);
  });
  list.querySelectorAll('.booking-card-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      bookings = bookings.filter(b => b.id !== parseInt(btn.dataset.id));
      localStorage.setItem('bookeasy_bookings', JSON.stringify(bookings));
      renderBookings();
    });
  });
}

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ==================== INIT ====================
renderCalendar();
updateSummary();
renderBookings();
