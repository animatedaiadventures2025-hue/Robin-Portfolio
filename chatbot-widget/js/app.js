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

// ==================== CHATBOT WIDGET ====================
const chatToggle = document.getElementById('chatToggle');
const chatPanel = document.getElementById('chatPanel');
const chatClose = document.getElementById('chatClose');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');

// Toggle panel
chatToggle.addEventListener('click', () => {
  chatPanel.classList.toggle('open');
  if (chatPanel.classList.contains('open')) chatInput.focus();
});
chatClose.addEventListener('click', () => chatPanel.classList.remove('open'));

// Click outside to close
document.addEventListener('click', (e) => {
  if (!document.getElementById('chatbot').contains(e.target)) {
    chatPanel.classList.remove('open');
  }
});

// Escape to close
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') chatPanel.classList.remove('open');
});

// AI responses
function getAIResponse(msg) {
  const lower = msg.toLowerCase();
  if (lower.includes('service') || lower.includes('offer') || lower.includes('what do you'))
    return "We offer web development, mobile apps, and cloud solutions. Our team specializes in React, Node.js, and cloud infrastructure. Would you like to know more about any specific service? 🚀";
  if (lower.includes('price') || lower.includes('cost') || lower.includes('how much'))
    return "Our projects start at $500 for basic websites and scale based on complexity. Here's a quick breakdown:\n\n• Basic Website: $500–$1,500\n• Web App: $2,000–$10,000\n• Mobile App: $5,000–$25,000\n\nWant a custom quote? I can connect you with our team! 💰";
  if (lower.includes('start') || lower.includes('begin') || lower.includes('how do i'))
    return "Great question! Here's how to get started:\n\n1. Book a free consultation call\n2. We'll discuss your project needs\n3. You'll receive a detailed proposal\n4. We start building!\n\nShall I book a consultation for you? 📅";
  if (lower.includes('time') || lower.includes('long') || lower.includes('duration') || lower.includes('fast'))
    return "Timelines depend on project scope:\n\n• Simple website: 1–2 weeks\n• Web application: 4–8 weeks\n• Full platform: 2–4 months\n\nWe work in 2-week sprints so you see progress every step of the way! ⚡";
  if (lower.includes('team') || lower.includes('who') || lower.includes('about'))
    return "We're a team of 12 developers, designers, and project managers. We've been building web and mobile apps for 5+ years, serving clients from startups to Fortune 500 companies. 👥";
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey'))
    return "Hey there! 👋 Great to meet you. How can I help you today?";
  return "Thanks for your message! I'd be happy to help with that. Would you like to schedule a quick call with our team to discuss your specific needs? Just say 'book a call' and I'll set it up! 😊";
}

// Add message
function addMessage(text, isUser = false) {
  const div = document.createElement('div');
  if (isUser) {
    div.className = 'user-message';
    div.innerHTML = `<div class="user-bubble"><p>${text.replace(/\n/g, '<br>')}</p></div>`;
  } else {
    div.className = 'bot-message';
    div.innerHTML = `
      <div class="msg-avatar">🤖</div>
      <div class="msg-bubble"><p>${text.replace(/\n/g, '<br>')}</p></div>
    `;
  }
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Typing indicator
function showTyping() {
  const div = document.createElement('div');
  div.className = 'typing-msg';
  div.id = 'typingIndicator';
  div.innerHTML = `<div class="msg-avatar">🤖</div><div class="typing-dots"><span></span><span></span><span></span></div>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTyping() {
  const t = document.getElementById('typingIndicator');
  if (t) t.remove();
}

// Send message
function sendMessage() {
  const msg = chatInput.value.trim();
  if (!msg) return;
  addMessage(msg, true);
  chatInput.value = '';
  chatInput.focus();

  // Show typing
  showTyping();

  // Simulate AI thinking
  const delay = 800 + Math.random() * 1200;
  setTimeout(() => {
    hideTyping();
    addMessage(getAIResponse(msg));
  }, delay);
}

chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// Suggestion buttons
document.querySelectorAll('.suggestion').forEach(btn => {
  btn.addEventListener('click', () => {
    chatInput.value = btn.dataset.question;
    sendMessage();
  });
});

// ==================== WIDGET CUSTOMIZATION ====================
const positionSelect = document.getElementById('widgetPosition');
const colorInput = document.getElementById('widgetColor');

if (positionSelect) {
  positionSelect.addEventListener('change', () => {
    const widget = document.getElementById('chatbot');
    widget.classList.toggle('left', positionSelect.value === 'left');
  });
}

if (colorInput) {
  colorInput.addEventListener('input', () => {
    document.documentElement.style.setProperty('--primary', colorInput.value);
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
