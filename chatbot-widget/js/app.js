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

chatToggle.addEventListener('click', () => {
  chatPanel.classList.toggle('open');
  if (chatPanel.classList.contains('open')) {
    chatInput.focus();
    startAnalytics();
  }
});
chatClose.addEventListener('click', () => chatPanel.classList.remove('open'));
document.addEventListener('click', (e) => {
  if (!document.getElementById('chatbot').contains(e.target)) chatPanel.classList.remove('open');
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') chatPanel.classList.remove('open');
});

// ==================== STATE ====================
let conversationHistory = [];
let lastTopic = null;
let messageCount = 0;
let leadCaptured = false;
let leadData = {};
let leadStep = 0; // 0=not started, 1=asking name, 2=asking email, 3=asking phone, 4=done
let bookingStep = 0; // 0=not started, 1=choosing date, 2=choosing time, 3=confirming
let bookingData = {};
let analytics = { conversations: 0, avgResponseMs: 850, topicsHandled: new Set(), startTime: null };
let currentLanguage = 'en';

// ==================== LANGUAGES ====================
const greetings = {
  en: "Hi there! 👋 I'm your AI assistant. How can I help you today?",
  es: "¡Hola! 👋 Soy tu asistente de IA. ¿En qué puedo ayudarte hoy?",
  fr: "Salut ! 👋 Je suis votre assistant IA. Comment puis-je vous aider aujourd'hui ?",
  de: "Hallo! 👋 Ich bin Ihr KI-Assistent. Wie kann ich Ihnen heute helfen?",
  pt: "Olá! 👋 Sou seu assistente de IA. Como posso ajudá-lo hoje?",
  ja: "こんにちは！👋 AIアシスタントです。今日は何をお手伝いしましょうか？",
  zh: "你好！👋 我是你的AI助手。今天有什么可以帮你的吗？",
  hi: "नमस्ते! 👋 मैं आपका AI सहायक हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?"
};

// ==================== TOPIC ENGINE ====================
const topics = {
  greeting: {
    keywords: ['hello', 'hi', 'hey', 'yo', 'sup', 'good morning', 'good afternoon', 'good evening', 'howdy', 'greetings', 'hola', 'bonjour', 'hallo'],
    responses: [
      "Hey there! 👋 Welcome to ChatFlow. What brings you here today?",
      "Hi! Great to see you here. How can I help you out?",
      "Hello! 😊 I'm the ChatFlow assistant. What would you like to know?",
      "Hey! Thanks for stopping by. What can I do for you?"
    ]
  },
  services: {
    keywords: ['service', 'offer', 'do you do', 'what do you', 'provide', 'help with', 'specialize', 'capabilities', 'what can you'],
    responses: [
      "Great question! We help businesses add smart chat to their websites:\n\n• AI chatbot widgets — answers 24/7\n• Lead capture — qualifies visitors automatically\n• Appointment booking — connects to your calendar\n• FAQ automation — handles repetitive questions\n• Custom integrations — CRM, Slack, email\n\nWant me to dive deeper into any of these?",
      "We make it dead simple to add an AI assistant to your website:\n\n🔹 Smart chat widgets\n🔹 Lead qualification bots\n🔹 Appointment scheduling\n🔹 Customer support automation\n\nWhich one sounds most useful for you?"
    ]
  },
  pricing: {
    keywords: ['price', 'cost', 'how much', 'pricing', 'plan', 'expensive', 'cheap', 'budget', 'affordable', 'fee', 'subscription', 'free trial', 'plan'],
    responses: [
      "We've got flexible plans:\n\n• **Starter** — $29/mo (1,000 chats, 1 site)\n• **Pro** — $79/mo (10,000 chats, 5 sites)\n• **Business** — $199/mo (unlimited)\n\nAll plans include a 14-day free trial — no credit card needed. Want to try it?",
      "Honest answer: depends on your traffic. Starter is $29/mo for most small businesses. Pro at $79/mo for bigger sites.\n\nEvery plan includes:\n✅ AI responses\n✅ Custom branding\n✅ Analytics\n✅ 14-day free trial\n\nWant to start with the free trial?"
    ]
  },
  start: {
    keywords: ['start', 'begin', 'get started', 'sign up', 'setup', 'install', 'how do i', 'onboard', 'create account', 'register'],
    responses: [
      "Super easy — 5 minutes:\n\n1. Sign up at chatflow.ai (no credit card)\n2. Customize your widget (colors, greeting, logo)\n3. Copy one line of code into your website\n4. You're live! 🎉\n\nWant me to walk you through it?",
      "Getting started is the easiest part:\n\n1️⃣ Create your free account\n2️⃣ Set up your widget (templates available)\n3️⃣ Add one line of JavaScript\n4️⃣ Watch it work!\n\nMost people are up in under 10 minutes."
    ]
  },
  timeline: {
    keywords: ['time', 'long', 'duration', 'fast', 'quick', 'minute', 'hour', 'day', 'week', 'deploy', 'set up time', 'how long'],
    responses: [
      "Lightning fast:\n\n⚡ Sign up: 2 min\n⚡ Customize: 5 min\n⚡ Install: 1 min (one line of code)\n⚡ Total: under 10 minutes\n\nThe AI starts answering immediately. No training needed.",
      "Most people are fully set up in under 10 minutes. Not exaggerating.\n\nWant custom FAQs or integrations? Add 15-20 min more."
    ]
  },
  portfolio: {
    keywords: ['portfolio', 'example', 'demo', 'work', 'show', 'case study', 'client', 'built', 'project', 'sample'],
    responses: [
      "We power 10,000+ websites! Highlights:\n\n• Real estate agency — 43% more leads\n• E-commerce store — 60% fewer tickets\n• SaaS company — 28% more demo bookings\n• Law firm — 35 after-hours inquiries/week\n\nThe widget on this page is a live demo — try it! 👆",
      "You can see our widget right on this page — click the chat bubble!\n\nClient results:\n📊 60% fewer support tickets\n📊 40% more leads\n📊 4.9/5 satisfaction\n\nWant specifics for your industry?"
    ]
  },
  contact: {
    keywords: ['contact', 'email', 'phone', 'call', 'reach', 'talk to', 'speak', 'support team', 'sales team', 'human', 'real person'],
    responses: [
      "Here's how to reach us:\n\n📧 hello@chatflow.ai\n📞 1-800-CHATFLOW\n💬 Live chat: you're here! 😄\n\nI can also schedule a call. Want me to set that up?",
      "Reach us anytime:\n\n• Sales → sales@chatflow.ai\n• Support → support@chatflow.ai\n• Phone → 1-800-CHATFLOW (Mon-Fri 9-6 EST)\n\nOr ask me right now — I can handle most questions!"
    ]
  },
  support: {
    keywords: ['support', 'help', 'issue', 'problem', 'bug', 'broken', 'not working', 'error', 'trouble'],
    responses: [
      "Let me help!\n\n🔧 Docs: docs.chatflow.ai\n📧 support@chatflow.ai (2hr response)\n📞 1-800-CHATFLOW for urgent issues\n\nPro/Business plans get 30-min priority response.\n\nWhat's going on? I might fix it right now."
    ]
  },
  features: {
    keywords: ['feature', 'functionality', 'capability', 'what does', 'can it', 'does it', 'smart', 'ai feature', 'advanced'],
    responses: [
      "ChatFlow is packed with features:\n\n🤖 **AI Responses** — understands context, not keywords\n📊 **Analytics** — conversations, questions, conversions\n🎨 **Custom Branding** — colors, logo, tone\n📅 **Calendar Booking** — direct appointments\n🔗 **CRM Sync** — HubSpot, Salesforce, Pipedrive\n🌐 **50+ Languages**\n📱 **Mobile Optimized**\n🔒 **SOC 2, GDPR compliant**\n\nWhich matters most to your business?"
    ]
  },
  integrations: {
    keywords: ['integrat', 'connect', 'crm', 'hubspot', 'salesforce', 'slack', 'zapier', 'api', 'webhook', 'plugin', 'wordpress', 'shopify'],
    responses: [
      "We integrate with everything:\n\n🔗 CRM: HubSpot, Salesforce, Pipedrive, Zoho\n📧 Email: Mailchimp, SendGrid\n💬 Chat: Slack, Teams, Discord\n📅 Calendar: Google, Calendly\n🛒 E-commerce: Shopify, WooCommerce, BigCommerce\n⚙️ Automation: Zapier, Make, n8n (1000+ apps)\n\nPlus REST API + webhooks for custom stuff.\n\nWhat tools are you using?"
    ]
  },
  security: {
    keywords: ['security', 'secure', 'privacy', 'gdpr', 'encrypt', 'compli', 'safe', 'data', 'hipaa', 'soc'],
    responses: [
      "Security is non-negotiable:\n\n🔒 End-to-end encryption\n🏛️ SOC 2 Type II\n🇪🇺 GDPR compliant\n🏥 HIPAA-ready (Business)\n🔐 SSO/SAML\n📋 Audit logs\n🇺🇸 US-hosted (EU available)\n\nYour data stays safe. Period."
    ]
  },
  team: {
    keywords: ['team', 'who', 'about you', 'company', 'behind', 'founded', 'history', 'people'],
    responses: [
      "We're 25 people in SF, founded in 2023. Founders previously built support tools at Zendesk and Intercom.\n\nBacked by Y Combinator, serving 10,000+ businesses. Small team, big impact. 💪"
    ]
  },
  location: {
    keywords: ['location', 'where', 'office', 'based', 'hour', 'open', 'available', 'timezone', 'country'],
    responses: [
      "HQ in SF, but remote-first with team in 12 countries.\n\n🕐 Support: 24/7 chat, 9am-6pm EST phone\n🌍 Widget works globally — 50+ languages\n\nThe widget works 24/7 on YOUR site, wherever customers are!"
    ]
  },
  process: {
    keywords: ['process', 'how does it work', 'how it works', 'workflow', 'step', 'explain', 'understand'],
    responses: [
      "Here's how ChatFlow works:\n\n1️⃣ **Install** — One script tag\n2️⃣ **Learn** — AI reads your site automatically\n3️⃣ **Customize** — FAQs, tone, colors\n4️⃣ **Deploy** — Live instantly\n5️⃣ **Improve** — Gets smarter with every chat\n\nIt learns from real conversations. The more it chats, the better."
    ]
  },
  comparison: {
    keywords: ['compare', 'vs', 'versus', 'better than', 'alternative', 'other', 'competitor', 'instead of', 'difference between'],
    responses: [
      "What makes ChatFlow different:\n\n⚡ **Setup** — 5 min vs days\n🤖 **True AI** — context-aware, not keyword matching\n💰 **Pricing** — $29/mo vs $99+ competitors\n🎨 **White-label** — full branding included\n📊 **Analytics** — built-in\n🔌 **50+ integrations** — out of the box\n\nOur AI actually *understands* your business. Not a glorified FAQ search."
    ]
  },
  techstack: {
    keywords: ['tech', 'technology', 'react', 'node', 'javascript', 'python', 'language', 'framework', 'wordpress', 'code', 'developer', 'api', 'sdk'],
    responses: [
      "Platform-agnostic:\n\n✅ ANY website — one script tag\n✅ WordPress plugin\n✅ Shopify app\n✅ React/Vue/Angular library\n✅ REST API + webhooks\n✅ JS SDK for custom builds\n\nUnder the hood: custom LLM fine-tuned for support, sales, and booking.\n\nWant our API docs?"
    ]
  },
  ecommerce: {
    keywords: ['ecommerce', 'e-commerce', 'shop', 'store', 'product', 'order', 'checkout', 'shopify', 'woocommerce', 'sell'],
    responses: [
      "E-commerce is huge for us:\n\n🛒 Product recommendations\n📦 Order tracking\n🔄 Returns/exchanges\n💳 Checkout help (reduces cart abandonment 25%)\n⭐ Review collection\n\nShopify stores see 30% fewer support tickets. Want a demo?"
    ]
  },
  mobile: {
    keywords: ['mobile', 'app', 'ios', 'android', 'phone', 'responsive', 'tablet'],
    responses: [
      "Works perfectly on mobile:\n\n📱 Responsive — adapts to any screen\n⚡ Fast — under 200KB, loads in <1s\n🎯 Touch-optimized — thumb-friendly\n🌐 Any mobile browser\n\nWe also have an iOS/Android SDK for native apps. Want details?"
    ]
  },
  testimonials: {
    keywords: ['review', 'testimonial', 'feedback', 'rating', 'customer', 'satisfaction', 'happy', 'love', 'recommend'],
    responses: [
      "What customers say:\n\n⭐⭐⭐⭐⭐ \"Cut our support tickets in half.\" — Sarah K., SaaS Founder\n\n⭐⭐⭐⭐⭐ \"Setup took 7 minutes. Leads on day one.\" — Mike R., Agency\n\n⭐⭐⭐⭐⭐ \"4.9/5 satisfaction score.\" — Lisa T., E-commerce\n\n4.9/5 on G2, Capterra, Product Hunt. Want more?"
    ]
  },
  booking: {
    keywords: ['book', 'appointment', 'schedule', 'meeting', 'consultation', 'demo', 'calendar'],
    responses: [
      "I can book that for you right now! 📅\n\nPick a date — I'll show you available slots."
    ]
  },
  lead: {
    keywords: ['interested', 'buy', 'sign me up', 'want to try', 'ready', 'let\'s do it', 'take my', 'order'],
    responses: ["Let's get you set up! I just need a few details."]
  },
  goodbye: {
    keywords: ['bye', 'goodbye', 'thanks', 'thank', 'done', 'see you', 'gotta go', 'take care', 'cheers', 'later'],
    responses: [
      "Thanks for chatting! 😊 I'm always here if you need anything. Have a great day! 👋",
      "Happy to help! Come back anytime. Take care! 🙌",
      "Glad I could help! Reach out whenever. Bye! 👋",
      "Anytime! Have an awesome day! ✨"
    ]
  }
};

// ==================== SUGGESTIONS ====================
const followUpSuggestions = {
  greeting: ["What services do you offer?", "How much does it cost?", "How do I get started?"],
  services: ["How much does it cost?", "How do I get started?", "Do you have a free trial?"],
  pricing: ["Is there a free trial?", "What's included?", "Can I upgrade later?"],
  start: ["How much does it cost?", "Do you integrate with WordPress?", "How does the AI work?"],
  timeline: ["How do I get started?", "Do you offer a free trial?", "What integrations do you have?"],
  portfolio: ["How much does it cost?", "Can I see more examples?", "How do I get started?"],
  contact: ["Book a demo", "What's your pricing?", "How do I get started?"],
  support: ["What's your email?", "Do you have docs?", "Priority support details?"],
  features: ["How much does it cost?", "Do you integrate with HubSpot?", "Is it secure?"],
  integrations: ["Do you have an API?", "Does it work with Shopify?", "How do I get started?"],
  security: ["What integrations do you have?", "How much does it cost?", "HIPAA details?"],
  team: ["How do I get started?", "What makes you different?", "What's your pricing?"],
  location: ["How do I contact you?", "What's your pricing?", "Do you support my language?"],
  process: ["How do I get started?", "How much does it cost?", "What tech do you use?"],
  comparison: ["How much does it cost?", "How do I get started?", "Can I see a demo?"],
  techstack: ["Do you have an API?", "Does it work with WordPress?", "How do I get started?"],
  ecommerce: ["How much does it cost?", "Does it work with Shopify?", "How do I get started?"],
  mobile: ["How much does it cost?", "How do I get started?", "Does it work on all devices?"],
  testimonials: ["How much does it cost?", "How do I get started?", "More reviews?"],
  booking: ["Available time slots?", "How much does it cost?", "What's in the demo?"],
  goodbye: ["What services do you offer?", "How much does it cost?", "How do I get started?"],
  lead: ["What's the pricing?", "How do I get started?", "Book a demo"]
};

// ==================== LEAD QUALIFICATION FLOW ====================
function startLeadCapture() {
  if (leadCaptured || leadStep > 0) return false;
  if (messageCount < 2) return false; // Don't ask too early
  return true;
}

function handleLeadStep(msg) {
  if (leadStep === 1) {
    leadData.name = msg.trim();
    leadStep = 2;
    return `Nice to meet you, ${leadData.name}! 😊 What's your email address? We'll send you a personalized demo link.`;
  }
  if (leadStep === 2) {
    if (!msg.includes('@') || !msg.includes('.')) {
      return "Hmm, that doesn't look like a valid email. Could you double-check? 📧";
    }
    leadData.email = msg.trim();
    leadStep = 3;
    return "Got it! And what's the best phone number to reach you? (Just in case we need to follow up) 📞";
  }
  if (leadStep === 3) {
    leadData.phone = msg.trim();
    leadStep = 4;
    leadCaptured = true;
    analytics.conversations++;
    return `Perfect! Here's what I've got:\n\n👤 Name: ${leadData.name}\n📧 Email: ${leadData.email}\n📞 Phone: ${leadData.phone}\n\nI've sent your info to our sales team. You'll receive a personalized demo link within the hour! 🎉\n\nIs there anything else I can help with?`;
  }
  return null;
}

// ==================== BOOKING FLOW ====================
function handleBookingStep(msg) {
  const lower = msg.toLowerCase().trim();

  if (bookingStep === 1) {
    // User picks a day
    const days = ['today', 'tomorrow', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const matched = days.find(d => lower.includes(d));
    if (matched) {
      bookingData.date = matched.charAt(0).toUpperCase() + matched.slice(1);
      bookingStep = 2;
      return `Great! ${bookingData.date} works. Here are the available slots:\n\n🕐 10:00 AM EST\n🕐 11:30 AM EST\n🕐 2:00 PM EST\n🕐 3:30 PM EST\n\nWhich time works best?`;
    }
    return "Pick a day — I'll show you available slots. Try saying 'tomorrow' or a specific day!";
  }

  if (bookingStep === 2) {
    // User picks a time
    const timeMatch = lower.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm|a\.m\.|p\.m\.)?/);
    if (timeMatch || lower.includes('10') || lower.includes('11') || lower.includes('2') || lower.includes('3')) {
      let time = '10:00 AM';
      if (lower.includes('11')) time = '11:30 AM';
      else if (lower.includes('2')) time = '2:00 PM';
      else if (lower.includes('3')) time = '3:30 PM';
      bookingData.time = time;
      bookingStep = 3;
      return `You're booking a demo:\n\n📅 ${bookingData.date}\n🕐 ${bookingData.time} EST\n\nI just need your email to send the confirmation. What's your email?`;
    }
    return "Just pick a time from the list — 10 AM, 11:30 AM, 2 PM, or 3:30 PM?";
  }

  if (bookingStep === 3) {
    if (msg.includes('@') && msg.includes('.')) {
      bookingData.email = msg.trim();
      bookingStep = 0;
      analytics.conversations++;
      return `🎉 You're all set!\n\n📅 Demo: ${bookingData.date} at ${bookingData.time} EST\n📧 Confirmation sent to: ${bookingData.email}\n\nOur team will walk you through ChatFlow and show you how it works for your specific business. See you then!\n\nAnything else I can help with?`;
    }
    return "Just need your email to send the confirmation! 📧";
  }
  return null;
}

// ==================== DETECT TOPIC ====================
function detectTopic(msg) {
  const lower = msg.toLowerCase();
  let bestTopic = null;
  let bestScore = 0;

  for (const [topic, data] of Object.entries(topics)) {
    let score = 0;
    for (const keyword of data.keywords) {
      if (lower.includes(keyword)) score += keyword.length;
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

// ==================== MAIN RESPONSE ENGINE ====================
function getAIResponse(msg) {
  const startTime = performance.now();
  messageCount++;

  // Check if we're in a lead capture flow
  if (leadStep > 0 && leadStep < 4) {
    const response = handleLeadStep(msg);
    if (response) {
      analytics.topicsHandled.add('lead_capture');
      return response;
    }
  }

  // Check if we're in a booking flow
  if (bookingStep > 0) {
    const response = handleBookingStep(msg);
    if (response) {
      analytics.topicsHandled.add('booking');
      return response;
    }
  }

  const topic = detectTopic(msg);
  const lower = msg.toLowerCase().trim();

  // Language switching
  if (lower.includes('switch to') || lower.includes('language') || lower.includes('hablar') || lower.includes('parler')) {
    const langs = { spanish: 'es', french: 'fr', german: 'de', portuguese: 'pt', japanese: 'ja', chinese: 'zh', hindi: 'hi' };
    for (const [name, code] of Object.entries(langs)) {
      if (lower.includes(name)) {
        currentLanguage = code;
        return `Language switched! 🌐\n\n${greetings[code]}\n\n(Type 'english' to switch back)`;
      }
    }
    return "We support 50+ languages! Try saying 'switch to Spanish' or 'switch to French' 🌐";
  }
  if (['english', 'switch to english', 'in english'].includes(lower)) {
    currentLanguage = 'en';
    return "Switched back to English! How can I help? 😊";
  }

  // Booking trigger
  if (topic === 'booking') {
    bookingStep = 1;
    bookingData = {};
    return getRandomItem(topics.booking.responses);
  }

  // Lead capture trigger — offer after a few messages about pricing/services
  if (topic === 'lead' || (messageCount >= 3 && !leadCaptured && (topic === 'pricing' || topic === 'start'))) {
    // 30% chance to offer lead capture
    if (!leadStep && Math.random() < 0.3) {
      leadStep = 1;
      return "It sounds like you're seriously considering ChatFlow! 🎉 I'd love to set you up with a personalized demo. What's your name?";
    }
  }

  // Detect "yes" to lead capture offer
  if (['yes', 'yeah', 'yep', 'sure', 'ok', 'absolutely', 'let\'s do it'].includes(lower) && !leadStep && messageCount >= 3 && !leadCaptured) {
    leadStep = 1;
    return "Awesome! Let's get you set up with a demo. First, what's your name? 😊";
  }

  // Handle vague follow-ups
  if (!topic && lastTopic && messageCount > 1) {
    const vagueWords = ['yes', 'yeah', 'yep', 'ok', 'sure', 'more', 'tell me more', 'go on', 'continue', 'explain', 'details', 'interesting', 'nice', 'cool', 'great', 'awesome'];
    if (vagueWords.includes(lower)) {
      const responses = [
        `Sure! Here's more about ${lastTopic}: ${getRandomItem(topics[lastTopic]?.responses || ["I'd be happy to help with that!"])}`,
        `Absolutely! ${getRandomItem(topics[lastTopic]?.responses || ["Let me know what you'd like to know more about."])}`,
        `Great, diving deeper! ${getRandomItem(topics[lastTopic]?.responses || ["What else can I tell you?"])}`
      ];
      return getRandomItem(responses);
    }
  }

  // Short message handling
  if (['no', 'nah', 'nope', 'not really'].includes(lower)) {
    return "No worries! If you have other questions, I'm here. What else can I help with? 😊";
  }
  if (['thanks', 'thank you', 'thx', 'appreciate it'].includes(lower)) {
    return getRandomItem(topics.goodbye.responses);
  }
  if (['?', 'what', 'how', 'why', 'when', 'where', 'who'].includes(lower)) {
    return "Good question! 😄 I can help with features, pricing, how to get started, integrations, and more. What specifically?";
  }

  // Topic response
  if (topic) {
    lastTopic = topic;
    conversationHistory.push({ role: 'user', msg, topic });
    analytics.topicsHandled.add(topic);
    return getRandomItem(topics[topic].responses);
  }

  // Smart fallback with context
  conversationHistory.push({ role: 'user', msg, topic: 'unknown' });
  const recentTopics = [...new Set(conversationHistory.slice(-5).map(h => h.topic).filter(Boolean))];

  let contextHint = '';
  if (recentTopics.length > 0) {
    contextHint = `\n\nWe were talking about ${recentTopics.join(', ')} — want to continue on that, or ask about something new?`;
  }

  const fallbacks = [
    `That's a great question! I want to give you the best answer.${contextHint}\n\nI'm best at:\n🔹 Features & capabilities\n🔹 Pricing & plans\n🔹 How to get started\n🔹 Integrations & tech\n\nWhat would be most useful?`,
    `Hmm, I want to help properly.${contextHint}\n\nI can answer questions about our chat widgets, pricing, setup, integrations, and more. What's on your mind?`,
    `Interesting question! While I work on the perfect answer, here's what I know best:\n\n• Product features\n• Pricing details\n• Setup & onboarding\n• Technical integrations${contextHint}\n\nWhat would you like to explore?`,
    `I appreciate the question! Let me help you best I can.${contextHint}\n\nYou can ask me about:\n🔹 How ChatFlow works\n🔹 Our pricing plans\n🔹 Getting started\n🔹 Integrations\n\nWhat would you like to know?`
  ];

  return getRandomItem(fallbacks);
}

// ==================== SUGGESTIONS ====================
function getSuggestions(topic) {
  return followUpSuggestions[topic] || ["What services do you offer?", "How much does it cost?", "How do I get started?"];
}

function updateSuggestions(topic) {
  const existing = chatMessages.querySelectorAll('.msg-suggestions');
  existing.forEach(el => el.remove());

  const suggestions = getSuggestions(topic);
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

// ==================== MESSAGES ====================
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

// ==================== ANALYTICS ====================
function startAnalytics() {
  if (!analytics.startTime) analytics.startTime = Date.now();
  updateAnalyticsBar();
}

function updateAnalyticsBar() {
  let bar = document.getElementById('analyticsBar');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'analyticsBar';
    bar.style.cssText = `
      padding: 8px 16px;
      background: rgba(99,102,241,0.05);
      border-top: 1px solid rgba(255,255,255,0.04);
      display: flex; justify-content: space-around;
      font-size: 0.7rem; color: rgba(255,255,255,0.4);
    `;
    chatPanel.insertBefore(bar, chatPanel.querySelector('.chatbot-input'));
  }
  const elapsed = analytics.startTime ? Math.round((Date.now() - analytics.startTime) / 1000) : 0;
  const topics = analytics.topicsHandled.size;
  bar.innerHTML = `
    <span>💬 ${messageCount} messages</span>
    <span>📊 ${topics} topics</span>
    <span>⚡ ~${analytics.avgResponseMs}ms</span>
    <span>🕐 ${elapsed}s</span>
  `;
}

// ==================== SEND ====================
function sendMessage() {
  const msg = chatInput.value.trim();
  if (!msg) return;
  addMessage(msg, true);
  chatInput.value = '';
  chatInput.focus();

  showTyping();

  const responseStart = performance.now();
  const delay = 500 + Math.random() * 800;
  setTimeout(() => {
    hideTyping();
    const responseTime = Math.round(performance.now() - responseStart + delay);
    analytics.avgResponseMs = Math.round((analytics.avgResponseMs + responseTime) / 2);

    const response = getAIResponse(msg);
    addMessage(response);

    const detectedTopic = detectTopic(msg) || lastTopic || 'greeting';
    setTimeout(() => {
      updateSuggestions(detectedTopic);
      updateAnalyticsBar();
    }, 100);
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
    document.getElementById('chatbot').classList.toggle('left', positionSelect.value === 'left');
  });
}
if (colorInput) {
  colorInput.addEventListener('input', () => {
    const hex = colorInput.value;
    // Convert hex to RGB for lighter/darker variants
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    // Lighter hover color (mix with white)
    const hover = `rgb(${Math.round(r + (255 - r) * 0.3)}, ${Math.round(g + (255 - g) * 0.3)}, ${Math.round(b + (255 - b) * 0.3)})`;
    // Very light version for suggestion backgrounds
    const light = `rgba(${r}, ${g}, ${b}, 0.1)`;
    // Border version
    const border = `rgba(${r}, ${g}, ${b}, 0.2)`;
    // Glow version for toggle button
    const glow = `rgba(${r}, ${g}, ${b}, 0.4)`;
    
    document.documentElement.style.setProperty('--primary', hex);
    document.documentElement.style.setProperty('--primary-hover', hover);
    
    // Update elements that use inline styles
    document.querySelectorAll('.suggestion').forEach(btn => {
      btn.style.background = light;
      btn.style.borderColor = border;
      btn.style.color = hover;
    });
    document.querySelectorAll('.chatbot-toggle').forEach(btn => {
      btn.style.boxShadow = `0 4px 20px ${glow}`;
    });
    document.querySelectorAll('.chatbot-header').forEach(el => {
      el.style.background = `rgba(${r}, ${g}, ${b}, 0.1)`;
    });
    // Update the hero badge
    document.querySelectorAll('.hero-badge').forEach(el => {
      el.style.background = light;
      el.style.color = hex;
      el.style.borderColor = border;
    });
    // Update section labels
    document.querySelectorAll('.section-label').forEach(el => {
      el.style.color = hex;
    });
    // Update stat numbers
    document.querySelectorAll('.hero-stat-num').forEach(el => {
      el.style.color = hex;
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
