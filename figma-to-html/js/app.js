/**
 * DataFlow Landing Page - JavaScript Interactions
 * Handles smooth scroll, pricing toggle, FAQ accordion, mobile menu, and hover effects
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===== NAVBAR SCROLL EFFECT =====
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    function handleNavbarScroll() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleNavbarScroll);

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });

    // ===== MOBILE MENU =====
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const navActions = document.querySelector('.nav-actions');

    function toggleMobileMenu() {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        navActions.classList.toggle('active');
    }

    function closeMobileMenu() {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
        navActions.classList.remove('active');
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navbar.contains(e.target) && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // ===== PRICING TOGGLE =====
    const pricingToggle = document.getElementById('pricingToggle');
    const toggleLabels = document.querySelectorAll('.toggle-label');
    const priceAmounts = document.querySelectorAll('.price-amount');
    let isAnnual = false;

    function updatePricing() {
        priceAmounts.forEach(amount => {
            const monthly = amount.getAttribute('data-monthly');
            const annual = amount.getAttribute('data-annual');
            
            if (monthly && annual) {
                const price = isAnnual ? annual : monthly;
                amount.textContent = `$${price}`;
            }
        });
    }

    function togglePricing() {
        isAnnual = !isAnnual;
        pricingToggle.classList.toggle('active', isAnnual);
        
        toggleLabels.forEach(label => {
            const period = label.getAttribute('data-period');
            if ((period === 'annual' && isAnnual) || (period === 'monthly' && !isAnnual)) {
                label.classList.add('active');
            } else {
                label.classList.remove('active');
            }
        });
        
        updatePricing();
    }

    if (pricingToggle) {
        pricingToggle.addEventListener('click', togglePricing);
        
        // Initialize
        toggleLabels.forEach(label => {
            const period = label.getAttribute('data-period');
            if (period === 'monthly') {
                label.classList.add('active');
            }
        });
    }

    // ===== FAQ ACCORDION =====
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active', !isActive);
            question.setAttribute('aria-expanded', !isActive);
        });
    });

    // ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .pricing-card, .testimonial-card, .stat-item, .showcase-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // ===== CHART BAR ANIMATION =====
    const chartBars = document.querySelectorAll('.chart-bar');
    
    function animateChartBars() {
        chartBars.forEach((bar, index) => {
            const height = bar.style.height;
            bar.style.height = '0';
            
            setTimeout(() => {
                bar.style.height = height;
            }, index * 100);
        });
    }

    // Animate chart bars when hero section is visible
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateChartBars();
                    heroObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        heroObserver.observe(heroSection);
    }

    // ===== CTA FORM HANDLING =====
    const ctaForm = document.getElementById('ctaForm');
    
    if (ctaForm) {
        ctaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // Simulate form submission
                const button = this.querySelector('button');
                const originalText = button.textContent;
                
                button.textContent = 'Sending...';
                button.disabled = true;
                
                setTimeout(() => {
                    button.textContent = 'Success!';
                    button.style.background = '#22c55e';
                    emailInput.value = '';
                    
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.style.background = '';
                        button.disabled = false;
                    }, 2000);
                }, 1500);
            }
        });
    }

    // ===== HOVER EFFECTS FOR CARDS =====
    const cards = document.querySelectorAll('.feature-card, .pricing-card, .testimonial-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // ===== STATS COUNTER ANIMATION =====
    const statValues = document.querySelectorAll('.stat-value');
    
    function animateCounter(element, target, suffix = '') {
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format number
            let displayValue;
            if (target >= 1000000) {
                displayValue = (current / 1000000).toFixed(0) + 'M+';
            } else if (target >= 1000) {
                displayValue = (current / 1000).toFixed(0) + '+';
            } else if (target < 10) {
                displayValue = current.toFixed(1);
            } else {
                displayValue = Math.floor(current);
            }
            
            element.textContent = displayValue + suffix;
        }, 16);
    }

    // Observe stats section
    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    statValues.forEach(stat => {
                        const text = stat.textContent;
                        let value, suffix = '';
                        
                        if (text.includes('M+')) {
                            value = parseFloat(text) * 1000000;
                            suffix = '';
                        } else if (text.includes('%')) {
                            value = parseFloat(text);
                            suffix = '%';
                        } else if (text.includes('+')) {
                            value = parseFloat(text);
                            suffix = '+';
                        } else {
                            value = parseFloat(text);
                        }
                        
                        if (!isNaN(value)) {
                            animateCounter(stat, value, suffix);
                        }
                    });
                    
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsBar);
    }

    // ===== LIVE INDICATOR ANIMATION =====
    const liveDot = document.querySelector('.live-dot');
    if (liveDot) {
        setInterval(() => {
            liveDot.style.opacity = liveDot.style.opacity === '0.5' ? '1' : '0.5';
        }, 1000);
    }

    // ===== KEYBOARD ACCESSIBILITY =====
    document.addEventListener('keydown', function(e) {
        // Close mobile menu on Escape
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
        
        // FAQ accordion keyboard navigation
        if (e.key === 'Enter' || e.key === ' ') {
            if (document.activeElement.classList.contains('faq-question')) {
                e.preventDefault();
                document.activeElement.click();
            }
        }
    });

    // ===== PARALLAX EFFECT FOR HERO GLOW =====
    const heroGlow = document.querySelector('.hero-glow');
    if (heroGlow) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            heroGlow.style.transform = `translate(-50%, calc(-50% + ${rate}px))`;
        });
    }

    // ===== TRUST LOGOS HOVER EFFECT =====
    const trustLogos = document.querySelectorAll('.trust-logo');
    trustLogos.forEach(logo => {
        logo.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        logo.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // ===== FEATURE ICON HOVER EFFECT =====
    const featureIcons = document.querySelectorAll('.feature-icon');
    featureIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'rotate(5deg) scale(1.1)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'rotate(0deg) scale(1)';
        });
    });

    // ===== SMOOTH REVEAL ON LOAD =====
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });

    console.log('DataFlow Landing Page initialized successfully!');
});
