// Virixy Landing Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Dark Mode System
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;
    
    // Get saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    // Theme toggle functionality
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
            
            // Track theme change
            trackEvent('theme_toggle', { theme: newTheme });
        });
    }
    
    function updateThemeIcon(theme) {
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
    
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            }
        });
    });
    
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });
    
    // Form handling and validation
    const waitlistForms = document.querySelectorAll('.waitlist-form');
    
    waitlistForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = form.querySelector('input[type="email"]');
            const submitButton = form.querySelector('.cta-button');
            const email = emailInput.value.trim();
            
            // Basic email validation
            if (!isValidEmail(email)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Joining...';
            submitButton.disabled = true;
            
            // Simulate form submission (replace with actual FormSubmit.co handling)
            setTimeout(() => {
                // Reset button state
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                
                // Show success message
                showMessage('Thanks for joining our waitlist! We\'ll be in touch soon.', 'success');
                
                // Clear form
                emailInput.value = '';
                
                // Track conversion (you can add analytics here)
                trackConversion('waitlist_signup');
                
            }, 1500);
        });
    });
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll (optional)
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.step, .feature-card, .testimonial, .problem-item, .solution-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // CTA button click tracking
    const ctaButtons = document.querySelectorAll('.cta-button, .nav-cta');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            trackEvent('cta_click', { button_text: buttonText });
        });
    });
    
    // Feature card hover effects
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Testimonial carousel (if you want to add one later)
    let currentTestimonial = 0;
    const testimonials = document.querySelectorAll('.testimonial');
    
    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.style.display = i === index ? 'block' : 'none';
        });
    }
    
    // Auto-rotate testimonials (optional)
    // Only enable carousel on small screens. On larger screens show all testimonials as a grid.
    let testimonialInterval = null;
    const testimonialMQ = window.matchMedia('(max-width: 768px)');

    function enableTestimonialCarousel() {
        if (testimonialInterval || testimonials.length <= 1) return;
        // make sure only the current testimonial is shown when carousel starts
        showTestimonial(currentTestimonial);
        testimonialInterval = setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }, 5000);
    }

    function disableTestimonialCarousel() {
        if (testimonialInterval) {
            clearInterval(testimonialInterval);
            testimonialInterval = null;
        }
        // restore default display for all testimonials (allow CSS grid to lay them out)
        testimonials.forEach(t => {
            t.style.display = '';
        });
    }

    // Initialize based on current viewport
    if (testimonials.length > 0) {
        if (testimonialMQ.matches) {
            enableTestimonialCarousel();
        } else {
            disableTestimonialCarousel();
        }

        // Toggle behavior on viewport change
        if (typeof testimonialMQ.addEventListener === 'function') {
            testimonialMQ.addEventListener('change', (e) => {
                if (e.matches) enableTestimonialCarousel(); else disableTestimonialCarousel();
            });
        } else if (typeof testimonialMQ.addListener === 'function') {
            // Fallback for older browsers
            testimonialMQ.addListener((e) => {
                if (e.matches) enableTestimonialCarousel(); else disableTestimonialCarousel();
            });
        }
    }
    
    // Scroll-based translation animations
    const animatedElements = document.querySelectorAll('.hero-text, .hero-visual, .section-header, .step, .feature-card, .testimonial, .problem-item, .solution-item');
    
    function handleScrollAnimations() {
        const scrollY = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        animatedElements.forEach((element, index) => {
            const elementTop = element.offsetTop;
            const elementHeight = element.offsetHeight;
            const elementCenter = elementTop + elementHeight / 2;
            
            // Calculate distance from viewport center
            const distanceFromCenter = elementCenter - (scrollY + windowHeight / 2);
            
            // Apply translation based on distance (parallax effect)
            const translateY = distanceFromCenter * 0.1;
            const opacity = Math.max(0, 1 - Math.abs(distanceFromCenter) / (windowHeight * 0.8));
            
            // Apply transforms with smooth easing
            element.style.transform = `translateY(${translateY}px)`;
            element.style.opacity = opacity;
            
            // Add entrance animation when element comes into view
            if (distanceFromCenter < windowHeight * 0.5 && distanceFromCenter > -windowHeight * 0.5) {
                element.classList.add('animate-in');
            }
        });
    }
    
    // Throttled scroll handler for better performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(handleScrollAnimations, 16); // ~60fps
    });
    
    // Initial call
    handleScrollAnimations();
    
    // Loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
    
    // Utility Functions
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showMessage(message, type = 'info') {
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${type}`;
        messageEl.textContent = message;
        
        // Style the message
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease-in-out;
        `;
        
        document.body.appendChild(messageEl);
        
        // Animate in
        setTimeout(() => {
            messageEl.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            messageEl.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(messageEl);
            }, 300);
        }, 5000);
    }
    
    function trackEvent(eventName, properties = {}) {
        // Add your analytics tracking here
        console.log('Event tracked:', eventName, properties);
        
        // Example: Google Analytics 4
        // gtag('event', eventName, properties);
        
        // Example: Mixpanel
        // mixpanel.track(eventName, properties);
    }
    
    function trackConversion(conversionType) {
        // Track conversion events
        trackEvent('conversion', { type: conversionType });
        
        // Example: Facebook Pixel
        // fbq('track', 'Lead');
        
        // Example: Google Ads
        // gtag('event', 'conversion', {
        //     'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL'
        // });
    }
    
    // Keyboard navigation for accessibility
    document.addEventListener('keydown', function(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
        
        // Enter key on FAQ questions
        if (e.key === 'Enter' && e.target.classList.contains('faq-question')) {
            e.target.click();
        }
    });
    
    // Preload critical resources
    function preloadResources() {
        const criticalImages = [
            // Add any critical image URLs here
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }
    
    preloadResources();
    
    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }, 0);
        });
    }
    
    // Service Worker registration (for PWA features)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            // Uncomment when you have a service worker file
            // navigator.serviceWorker.register('/sw.js')
            //     .then(registration => console.log('SW registered'))
            //     .catch(error => console.log('SW registration failed'));
        });
    }
    
    // Error handling
    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e.error);
        // You can send error reports to your analytics service here
    });
    
    // Unhandled promise rejection handling
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled promise rejection:', e.reason);
        // You can send error reports to your analytics service here
    });
    
});

// Additional CSS for JavaScript interactions
const additionalStyles = `
    .navbar.scrolled {
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }
    
    .nav-menu.active {
        display: flex;
        position: fixed;
        top: 70px;
        left: 0;
        right: 0;
        background: white;
        flex-direction: column;
        padding: 2rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 999;
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    .loaded {
        opacity: 1;
    }
    
    body {
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            display: none;
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
