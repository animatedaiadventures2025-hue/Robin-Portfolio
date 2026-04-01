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

document.addEventListener('click', (e) => {
  if (!document.getElementById('chatbot').contains(e.target)) {
    chatPanel.classList.remove('open');
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') chatPanel.classList.remove('open');
});

// ==================== CONVERSATION STATE ====================
let conversationHistory = [];
let lastTopic = null;
let messageCount = 0;

// ==================== AI RESPONSE ENGINE ====================
const topics = {
  greeting: {
    keywords: ['hello', 'hi', 'hey', 'yo', 'sup', 'good morning', 'good afternoon', 'good evening', 'howdy', 'greetings'],
    responses: [
      "Hey there! 👋 Welcome to ChatFlow. What brings you here today?",
      "Hi! Great to see you here. How can I help you out?",
      "Hello! 😊 I'm the ChatFlow assistant. What would you like to know?",
      "Hey! Thanks for stopping by. What can I do for you?",
      "Hi there! 👋 Ready to answer any questions you have about ChatFlow."
    ]
  },
  services: {
    keywords: ['service', 'offer', 'do you do', 'what do you', 'provide', 'help with', 'specialize', 'capabilities', 'what can you'],
    responses: [
      "Great question! We help businesses add smart chat to their websites. Here's what we do:\n\n• AI chatbot widgets — answers customer questions 24/7\n• Lead capture — qualifies visitors while you sleep\n• Appointment booking — connects to your calendar\n• FAQ automation — handles repetitive questions\n• Custom integrations — connects to your CRM, Slack, email\n\nWant me to dive deeper into any of these?",
      "We make it dead simple to add an AI assistant to your website. Think of it as a 24/7 receptionist that never sleeps, never takes breaks, and actually knows your business inside out.\n\nMain services:\n🔹 Smart chat widgets\n🔹 Lead qualification bots\n🔹 Appointment scheduling\n🔹 Customer support automation\n\nWhich one sounds most useful for you?"
    ]
  },
  pricing: {
    keywords: ['price', 'cost', 'how much', 'pricing', 'plan', 'expensive', 'cheap', 'budget', 'affordable', 'fee', 'subscription', 'free trial'],
    responses: [
      "We've got flexible plans for every size:\n\n• **Starter** — $29/mo (1,000 chats, 1 website)\n• **Pro** — $79/mo (10,000 chats, 5 websites, priority support)\n• **Business** — $199/mo (unlimited everything)\n\nAll plans include a 14-day free trial — no credit card needed. Want me to help you pick the right one?",
      "Honest answer: it depends on your traffic. Our Starter plan is $29/mo which handles most small businesses. Bigger sites with 10K+ monthly visitors usually go Pro at $79/mo.\n\nThe cool part? Every plan includes:\n✅ AI-powered responses\n✅ Custom branding\n✅ Analytics dashboard\n✅ 14-day free trial\n\nWant to start with the free trial and see if it's worth it?"
    ]
  },
  start: {
    keywords: ['start', 'begin', 'get started', 'sign up', 'setup', 'install', 'how do i', 'onboard', 'create account', 'register'],
    responses: [
      "Super easy — takes about 5 minutes:\n\n1. Sign up at chatflow.ai (no credit card needed)\n2. Customize your widget (colors, greeting, logo)\n3. Copy one line of code into your website\n4. You're live! 🎉\n\nWant me to walk you through it step by step?",
      "Getting started is the easiest part:\n\n1️⃣ Create your free account\n2️⃣ Set up your chat widget (we have templates)\n3️⃣ Add one line of JavaScript to your site\n4️⃣ Watch it work!\n\nMost people are up and running in under 10 minutes. Want to try it?"
    ]
  },
  timeline: {
    keywords: ['time', 'long', 'duration', 'fast', 'quick', 'minute', 'hour', 'day', 'week', 'deploy', 'set up time', 'how long'],
    responses: [
      "Lightning fast, honestly:\n\n⚡ Sign up: 2 minutes\n⚡ Customize widget: 5 minutes\n⚡ Install on your site: 1 minute (literally one line of code)\n⚡ Total: under 10 minutes\n\nThe AI starts answering questions immediately. No training needed — it learns from your website content automatically.",
      "Most people are fully set up in under 10 minutes. I'm not exaggerating — the widget is designed to be drop-in simple.\n\nIf you want to train it on custom FAQs or connect integrations, add another 15-20 minutes. But the basic setup? Under 10 minutes, guaranteed."
    ]
  },
  portfolio: {
    keywords: ['portfolio', 'example', 'demo', 'work', 'show', 'case study', 'client', 'built', 'project', 'sample'],
    responses: [
      "We've powered chat widgets for 10,000+ websites! Here are some highlights:\n\n• A real estate agency — 43% more leads captured\n• An e-commerce store — support tickets dropped 60%\n• A SaaS company — 28% increase in demo bookings\n• A law firm — after-hours inquiries went from 0 to 35/week\n\nWant to see the widget in action? Just scroll up to the interactive demo! 👆",
      "Absolutely! You can see our widget working right on this page — just click the chat bubble in the bottom right corner. That's a live ChatFlow widget.\n\nAs for client results:\n📊 60% fewer support tickets (average)\n📊 40% more leads captured\n📊 4.9/5 customer satisfaction\n\nWant specifics for your industry?"
    ]
  },
  contact: {
    keywords: ['contact', 'email', 'phone', 'call', 'reach', 'talk to', 'speak', 'support team', 'sales team', 'human'],
    responses: [
      "I'd love to connect you with our team! Here's how:\n\n📧 Email: hello@chatflow.ai\n📞 Phone: 1-800-CHATFLOW\n💬 Live chat: you're already here! 😄\n\nOr I can schedule a call for you. What works best?",
      "You can reach our team anytime:\n\n• Sales questions → sales@chatflow.ai\n• Technical support → support@chatflow.ai\n• General inquiries → hello@chatflow.ai\n• Phone → 1-800-CHATFLOW (Mon-Fri 9am-6pm EST)\n\nOr just ask me and I'll do my best to help right now!"
    ]
  },
  support: {
    keywords: ['support', 'help', 'issue', 'problem', 'bug', 'broken', 'not working', 'error', 'trouble'],
    responses: [
      "Sorry to hear you're having trouble! Let me help.\n\nFor immediate support:\n🔧 Check our docs at docs.chatflow.ai\n💬 Email support@chatflow.ai (response within 2 hours)\n📞 Call 1-800-CHATFLOW for urgent issues\n\nPro and Business plans get priority support with 30-minute response times.\n\nCan you tell me what's going on? I might be able to help right now."
    ]
  },
  features: {
    keywords: ['feature', 'functionality', 'capability', 'what does', 'can it', 'does it', 'smart', 'ai feature', 'advanced'],
    responses: [
      "ChatFlow is packed with features:\n\n🤖 **AI-Powered Responses** — understands context, not just keywords\n📊 **Analytics Dashboard** — track conversations, common questions, conversion rates\n🎨 **Custom Branding** — match your colors, logo, and tone\n📅 **Calendar Integration** — books appointments directly\n🔗 **CRM Integration** — syncs with HubSpot, Salesforce, Pipedrive\n🌐 **Multi-language** — supports 50+ languages\n📱 **Mobile Optimized** — works perfectly on all devices\n🔒 **Enterprise Security** — SOC 2, GDPR compliant\n\nWhich feature matters most to your business?"
    ]
  },
  integrations: {
    keywords: ['integrat', 'connect', 'crm', 'hubspot', 'salesforce', 'slack', 'zapier', 'api', 'webhook', 'plugin', 'wordpress', 'shopify'],
    responses: [
      "We integrate with everything you already use:\n\n🔗 **CRM:** HubSpot, Salesforce, Pipedrive, Zoho\n📧 **Email:** Mailchimp, SendGrid, ConvertKit\n💬 **Chat:** Slack, Microsoft Teams, Discord\n📅 **Calendar:** Google Calendar, Calendly, Cal.com\n🛒 **E-commerce:** Shopify, WooCommerce, BigCommerce\n⚙️ **Automation:** Zapier, Make, n8n (1000+ apps)\n\nPlus a full REST API and webhooks for custom integrations.\n\nWhich tools are you currently using?"
    ]
  },
  security: {
    keywords: ['security', 'secure', 'privacy', 'gdpr', 'encrypt', 'compli', 'safe', 'data', 'hipaa', 'soc'],
    responses: [
      "Security is non-negotiable for us:\n\n🔒 End-to-end encryption on all messages\n🏛️ SOC 2 Type II certified\n🇪🇺 GDPR compliant\n🏥 HIPAA-ready (Business plan)\n🔐 SSO/SAML support\n📋 Full audit logs\n🇺🇸 Data hosted in US (EU available)\n📊 Regular third-party security audits\n\nYour customers' data stays safe. Period."
    ]
  },
  team: {
    keywords: ['team', 'who', 'about you', 'company', 'behind', 'founded', 'history', 'people'],
    responses: [
      "We're a team of 25 people based in San Francisco, founded in 2023. Our founders previously built customer support tools at Zendesk and Intercom — so we know this space inside out.\n\nWe're backed by Y Combinator and serve 10,000+ businesses worldwide. Small team, big impact. 💪"
    ]
  },
  location: {
    keywords: ['location', 'where', 'office', 'based', 'hour', 'open', 'available', 'timezone', 'country'],
    responses: [
      "Our HQ is in San Francisco, but we're a remote-first company with team members across 12 countries.\n\n🕐 Support hours: 24/7 for chat, 9am-6pm EST for phone\n🌍 Our widget works globally — supports 50+ languages\n\nAnd of course, the widget itself works 24/7 on YOUR website, no matter where your customers are!"
    ]
  },
  process: {
    keywords: ['process', 'how does it work', 'how it works', 'workflow', 'step', 'explain', 'understand'],
    responses: [
      "Here's exactly how ChatFlow works:\n\n1️⃣ **Install** — One line of JavaScript on your site\n2️⃣ **Learn** — The AI reads your website content automatically\n3️⃣ **Customize** — Add FAQs, set your tone, pick colors\n4️⃣ **Deploy** — Widget goes live instantly\n5️⃣ **Improve** — AI gets smarter with every conversation\n\nThe best part? It learns from real customer interactions. The more it chats, the better it gets."
    ]
  },
  comparison: {
    keywords: ['compare', 'vs', 'versus', 'better than', 'alternative', 'other', 'competitor', 'instead of', 'difference between'],
    responses: [
      "Fair question! Here's what makes ChatFlow different:\n\n⚡ **Setup speed** — 5 minutes vs days/weeks for competitors\n🤖 **True AI** — understands context, not just keyword matching\n💰 **Pricing** — starts at $29/mo (competitors: $99+)\n🎨 **Customization** — full white-labeling included\n📊 **Analytics** — built-in, not an add-on\n🔌 **Integrations** — 50+ native integrations out of the box\n\nThe biggest difference? Our AI actually *understands* your business. It's not a glorified FAQ search — it's a real conversation partner."
    ]
  },
  techstack: {
    keywords: ['tech', 'technology', 'react', 'node', 'javascript', 'python', 'language', 'framework', 'wordpress', 'code', 'developer', 'api', 'sdk'],
    responses: [
      "For your website, we're platform-agnostic:\n\n✅ Works with ANY website — just one script tag\n✅ WordPress plugin available\n✅ Shopify app in the App Store\n✅ React/Vue/Angular component library\n✅ Full REST API + webhooks\n✅ JavaScript SDK for custom implementations\n\nUnder the hood, we use a custom LLM fine-tuned for customer conversations. Think ChatGPT but specifically trained on support, sales, and booking scenarios.\n\nWant to see our API docs?"
    ]
  },
  ecommerce: {
    keywords: ['ecommerce', 'e-commerce', 'shop', 'store', 'product', 'order', 'checkout', 'shopify', 'woocommerce', 'sell'],
    responses: [
      "E-commerce is one of our biggest use cases! Here's how ChatFlow helps online stores:\n\n🛒 **Product recommendations** — suggests items based on browsing\n📦 **Order tracking** — answers \"where's my order?\" instantly\n🔄 **Returns & exchanges** — handles the process automatically\n💳 **Checkout help** — reduces cart abandonment by 25%\n⭐ **Review collection** — follows up with happy customers\n\nOur Shopify stores see an average 30% reduction in support tickets. Want to see a demo?"
    ]
  },
  mobile: {
    keywords: ['mobile', 'app', 'ios', 'android', 'phone', 'responsive', 'tablet'],
    responses: [
      "ChatFlow works perfectly on mobile:\n\n📱 Responsive widget — adapts to any screen size\n⚡ Fast loading — under 200KB, loads in under 1 second\n🎯 Touch-optimized — designed for thumb-friendly chat\n🌐 Works on any mobile browser\n\nIf you're looking for a native mobile app with chat, we also offer an SDK for iOS and Android. Want details?"
    ]
  },
  testimonials: {
    keywords: ['review', 'testimonial', 'feedback', 'rating', 'customer', 'satisfaction', 'happy', 'love', 'recommend'],
    responses: [
      "Here's what our customers say:\n\n⭐⭐⭐⭐⭐ \"Cut our support tickets in half. Best investment we made this year.\" — Sarah K., SaaS Founder\n\n⭐⭐⭐⭐⭐ \"Setup took 7 minutes. Started getting leads on day one.\" — Mike R., Agency Owner\n\n⭐⭐⭐⭐⭐ \"Our customers love the instant responses. 4.9/5 satisfaction score.\" — Lisa T., E-commerce Manager\n\nWe maintain a 4.9/5 rating across G2, Capterra, and Product Hunt. Want to see more?"
    ]
  },
  booking: {
    keywords: ['book', 'appointment', 'schedule', 'meeting', 'call', 'consultation', 'demo', 'calendar'],
    responses: [
      "I'd love to set that up! Here's how:\n\n📅 Click below to book a free demo:\n→ chatflow.ai/book-demo\n\nOr give us your email and I'll send you a personalized demo link. Takes 15 minutes, and we'll show you exactly how ChatFlow would work for your specific business.\n\nWhat's your email? 📧"
    ]
  },
  goodbye: {
    keywords: ['bye', 'goodbye', 'thanks', 'thank', 'done', 'see you', 'gotta go', 'take care', 'cheers', 'later'],
    responses: [
      "Thanks for chatting! 😊 If you ever have more questions, I'm always here. Have a great day! 👋",
      "Happy to help! Don't hesitate to come back anytime. Take care! 🙌",
      "Glad I could help! Feel free to reach out whenever you need. Bye for now! 👋",
      "Anytime! That's what I'm here for. Have an awesome day! ✨"
    ]
  }
};

// Suggestions that follow each topic
const followUpSuggestions = {
  greeting: ["What services do you offer?", "How much does it cost?", "How do I get started?"],
  services: ["How much does it cost?", "How do I get started?", "Do you have a free trial?"],
  pricing: ["Is there a free trial?", "What's included in each plan?", "Can I upgrade later?"],
  start: ["How much does it cost?", "Do you integrate with WordPress?", "How does the AI work?"],
  timeline: ["How do I get started?", "Do you offer a free trial?", "What integrations do you have?"],
  portfolio: ["How much does it cost?", "Can I see more examples?", "How do I get started?"],
  contact: ["Book a demo", "What's your pricing?", "How do I get started?"],
  support: ["What's your email?", "Do you have docs?", "What plan includes priority support?"],
  features: ["How much does it cost?", "Do you integrate with HubSpot?", "Is it secure?"],
  integrations: ["Do you have an API?", "Does it work with Shopify?", "How do I get started?"],
  security: ["What integrations do you have?", "How much does it cost?", "Do you have HIPAA?"],
  team: ["How do I get started?", "What makes you different?", "What's your pricing?"],
  location: ["How do I contact you?", "What's your pricing?", "Do you support my language?"],
  process: ["How do I get started?", "How much does it cost?", "What tech do you use?"],
  comparison: ["How much does it cost?", "How do I get started?", "Can I see a demo?"],
  techstack: ["Do you have an API?", "Does it work with WordPress?", "How do I get started?"],
  ecommerce: ["How much does it cost?", "Does it work with Shopify?", "How do I get started?"],
  mobile: ["How much does it cost?", "How do I get started?", "Does it work on all devices?"],
  testimonials: ["How much does it cost?", "How do I get started?", "Can I see more reviews?"],
  booking: ["What's included in the demo?", "How much does it cost?", "How long is the demo?"],
  goodbye: ["What services do you offer?", "How much does it cost?", "How do I get started?"]
};

function detectTopic(msg) {
  const lower = msg.toLowerCase();
  
  // Check each topic, scoring by keyword matches
  let bestTopic = null;
  let bestScore = 0;
  
  for (const [topic, data] of Object.entries(topics)) {
    let score = 0;
    for (const keyword of data.keywords) {
      if (lower.includes(keyword)) {
        score += keyword.length; // Longer keywords = more specific match
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestTopic = topic;
    }
  }
  
  return bestTopic;
}

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getAIResponse(msg) {
  messageCount++;
  
  // Detect topic
  const topic = detectTopic(msg);
  
  // Handle follow-ups: if same topic or vague message, acknowledge context
  if (!topic && lastTopic && messageCount > 1) {
    // Vague follow-up like "yes", "ok", "more", "tell me more"
    const vagueWords = ['yes', 'yeah', 'yep', 'ok', 'sure', 'more', 'tell me more', 'go on', 'continue', 'explain', 'details', 'interesting'];
    const lower = msg.toLowerCase().trim();
    if (vagueWords.some(w => lower === w || lower.startsWith(w + ' ') || lower.endsWith(' ' + w))) {
      const responses = [
        `Sure thing! Let me give you more details about ${lastTopic}. ${getRandomItem(topics[lastTopic].responses)}`,
        `Absolutely! Here's a bit more: ${getRandomItem(topics[lastTopic].responses)}`,
        `Great, diving deeper! ${getRandomItem(topics[lastTopic].responses)}`
      ];
      return getRandomItem(responses);
    }
  }
  
  // Get response for detected topic
  if (topic) {
    lastTopic = topic;
    conversationHistory.push({ role: 'user', msg, topic });
    return getRandomItem(topics[topic].responses);
  }
  
  // Handle common short messages
  const lower = msg.toLowerCase().trim();
  if (['yes', 'yeah', 'yep', 'sure', 'ok', 'okay'].includes(lower)) {
    return "Awesome! What would you like to know more about? I can tell you about our features, pricing, how to get started, or anything else. 😊";
  }
  if (['no', 'nah', 'nope', 'not really'].includes(lower)) {
    return "No worries at all! If you change your mind or have other questions, I'm always here. Anything else I can help with? 😊";
  }
  if (['thanks', 'thank you', 'thx'].includes(lower)) {
    return getRandomItem(topics.goodbye.responses);
  }
  if (['?', 'what', 'how', 'why', 'when', 'where', 'who'].includes(lower)) {
    return "Good question! 😄 I can help with info about our services, pricing, how to get started, integrations, and more. What specifically would you like to know?";
  }
  
  // Context-aware fallback
  conversationHistory.push({ role: 'user', msg, topic: 'unknown' });
  
  const fallbacks = [
    "That's a great question! I'd love to help, but I want to make sure I give you the most accurate answer. Could you tell me a bit more about what you're looking for? For example:\n\n• Are you looking to add chat to your website?\n• Do you have questions about pricing?\n• Want to know how it works?",
    "Hmm, I want to make sure I help you properly. I'm best at answering questions about:\n\n🔹 Our chat widget features\n🔹 Pricing and plans\n🔹 How to get started\n🔹 Integrations and tech details\n\nWhat would be most useful for you?",
    "I appreciate the question! While I might not have the perfect answer right away, I can definitely help with:\n\n• Product features and capabilities\n• Pricing and plan details\n• Setup and onboarding\n• Technical integrations\n\nWhat would you like to explore?",
    "Interesting! I want to give you the best possible answer. Could you rephrase that or tell me more about what you need? In the meantime, I can help with anything about ChatFlow — features, pricing, setup, you name it! 😊"
  ];
  
  return getRandomItem(fallbacks);
}

function getSuggestions(topic) {
  return followUpSuggestions[topic] || ["What services do you offer?", "How much does it cost?", "How do I get started?"];
}

function updateSuggestions(topic) {
  // Remove old suggestions
  const existing = chatMessages.querySelectorAll('.msg-suggestions');
  existing.forEach(el => el.remove());
  
  // Get new suggestions for this topic
  const suggestions = getSuggestions(topic);
  
  // Find last bot message
  const botMessages = chatMessages.querySelectorAll('.bot-message');
  const lastBot = botMessages[botMessages.length - 1];
  if (!lastBot) return;
  
  const bubble = lastBot.querySelector('.msg-bubble');
  const div = document.createElement('div');
  div.className = 'msg-suggestions';
  suggestions.forEach(text => {
    const btn = document.createElement('button');
    btn.className = 'suggestion';
    btn.dataset.question = text;
    btn.textContent = text;
    btn.addEventListener('click', () => {
      chatInput.value = text;
      sendMessage();
    });
    div.appendChild(btn);
  });
  bubble.appendChild(div);
}

// ==================== ADD MESSAGE ====================
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

// ==================== SEND MESSAGE ====================
function sendMessage() {
  const msg = chatInput.value.trim();
  if (!msg) return;
  addMessage(msg, true);
  chatInput.value = '';
  chatInput.focus();

  // Show typing
  showTyping();

  // Simulate AI thinking (faster for follow-ups, slightly longer for new topics)
  const delay = 600 + Math.random() * 1000;
  setTimeout(() => {
    hideTyping();
    const response = getAIResponse(msg);
    addMessage(response);
    
    // Update suggestions based on detected topic
    const detectedTopic = detectTopic(msg) || lastTopic || 'greeting';
    setTimeout(() => updateSuggestions(detectedTopic), 100);
  }, delay);
}

chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// Initial suggestion buttons
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
