
// Enhanced Cricket Fusion Website JavaScript

// Utility functions
const utils = {
    // Smooth scroll to element
    scrollTo: (element) => {
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    },

    // Generate random purchase code
    generatePurchaseCode: (modName) => {
        const prefix = 'CRICKET';
        const modCode = modName.toUpperCase().replace(/\s+/g, '-').substring(0, 10);
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        return `${prefix}-${modCode}-${randomNum}`;
    },

    // Copy text to clipboard
    copyToClipboard: async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        }
    },

    // Debounce function for search
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Animation controller
const animations = {
    // Intersection Observer for scroll animations
    createScrollObserver: (options = {}) => {
        const defaultOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observerOptions = { ...defaultOptions, ...options };
        
        return new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, observerOptions);
    },

    // Initialize scroll animations
    initScrollAnimations: () => {
        const observer = animations.createScrollObserver();
        
        // Observe all animatable elements
        document.querySelectorAll('.feature-card, .mod-card, .stat-card, .animate-on-scroll').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    },

    // Parallax effect for background
    initParallax: () => {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax');
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }
};

// Navigation controller
const navigation = {
    // Update active navigation link
    updateActiveNav: () => {
        const sections = document.querySelectorAll('section[id], .hero');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id') || 'home';
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            if ((currentSection === 'home' && href === '#') || 
                href === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    },

    // Mobile menu toggle
    initMobileMenu: () => {
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (menuToggle && navLinks) {
            menuToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                menuToggle.innerHTML = navLinks.classList.contains('active') 
                    ? '<i class="fas fa-times"></i>' 
                    : '<i class="fas fa-bars"></i>';
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                    navLinks.classList.remove('active');
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        }
    },

    // Smooth scroll for navigation links
    initSmoothScroll: () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    utils.scrollTo(target);
                    
                    // Close mobile menu if open
                    const navLinks = document.querySelector('.nav-links');
                    const menuToggle = document.querySelector('.menu-toggle');
                    
                    if (navLinks && navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                        if (menuToggle) {
                            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                        }
                    }
                }
            });
        });
    }
};

// Enhanced particle system
const particles = {
    particleCount: 0,
    maxParticles: 15,
    
    // Create particle on mouse move
    createParticle: (x, y) => {
        if (particles.particleCount >= particles.maxParticles) return;
        
        particles.particleCount++;
        const particle = document.createElement('div');
        const types = ['✦', '●', '◆', '★', '▲'];
        const colors = ['#00ff88', '#8b5cf6', '#ff6b35'];
        
        particle.innerHTML = types[Math.floor(Math.random() * types.length)];
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            color: ${colors[Math.floor(Math.random() * colors.length)]};
            font-size: ${Math.random() * 8 + 8}px;
            pointer-events: none;
            z-index: 1000;
            animation: particleFloat ${Math.random() * 2 + 2}s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
            particles.particleCount--;
        }, 3000);
    },

    // Initialize particle system
    init: () => {
        // Add particle animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes particleFloat {
                0% {
                    opacity: 1;
                    transform: scale(1) translateY(0) rotate(0deg);
                }
                100% {
                    opacity: 0;
                    transform: scale(0) translateY(-100px) rotate(360deg);
                }
            }
        `;
        document.head.appendChild(style);

        // Mouse move listener
        document.addEventListener('mousemove', (e) => {
            if (Math.random() < 0.02) { // 2% chance
                particles.createParticle(e.clientX, e.clientY);
            }
        });
    }
};

// Performance optimization
const performance = {
    // Throttle function for scroll events
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Optimize scroll events
    optimizeScrollEvents: () => {
        const throttledUpdateNav = performance.throttle(navigation.updateActiveNav, 100);
        window.addEventListener('scroll', throttledUpdateNav);
    }
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    navigation.initMobileMenu();
    navigation.initSmoothScroll();
    animations.initScrollAnimations();
    animations.initParallax();
    particles.init();
    performance.optimizeScrollEvents();
    
    // Add animate-in class for visible elements
    setTimeout(() => {
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.classList.add('animate-in');
        });
    }, 500);
});

// Handle page visibility change for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.querySelectorAll('*').forEach(el => {
            if (el.style.animationPlayState) {
                el.style.animationPlayState = 'paused';
            }
        });
    } else {
        // Resume animations when page is visible
        document.querySelectorAll('*').forEach(el => {
            if (el.style.animationPlayState) {
                el.style.animationPlayState = 'running';
            }
        });
    }
});

// Export utilities for use in other scripts
window.ParthXMods = {
    utils,
    animations,
    navigation,
    particles,
    performance
};
