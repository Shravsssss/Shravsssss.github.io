// Ultra Smooth Background System
class UltraSmoothBackground {
    constructor() {
        this.gradient1 = document.getElementById('gradient1');
        this.gradient2 = document.getElementById('gradient2');
        this.colors = [
            { r: 255, g: 235, b: 238 }, // Soft Pink (#FFEBEE)
            { r: 243, g: 229, b: 245 }, // Light Purple (#F3E5F5)
            { r: 232, g: 234, b: 246 }, // Soft Blue (#E8EAF6)
            { r: 232, g: 245, b: 243 }, // Mint Green (#E8F5E9)
            { r: 255, g: 243, b: 224 }, // Warm Cream (#FFF3E0)
            { r: 251, g: 233, b: 231 }, // Soft Peach (#FBE9E7)
            { r: 240, g: 244, b: 248 }, // Cool Gray (#F0F4F8)
            { r: 244, g: 240, b: 247 }, // Lavender Mist (#F4F0F7)
            { r: 255, g: 248, b: 225 }  // Light Yellow (#FFF8E1)
        ];
        this.currentColorIndex = 0;
        this.nextColorIndex = 1;
        this.transitionProgress = 0;
        this.scrollVelocity = 0;
        this.lastScrollY = 0;
        this.targetScrollY = 0;
        this.currentScrollY = 0;
        this.animationFrame = null;
        this.init();
    }

    init() {
        this.updateGradients();
        this.startAnimation();
        this.setupScrollListener();
    }

    // Cubic easing function
    cubicEase(t) {
        return t < 0.5 
            ? 4 * t * t * t 
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    // Linear interpolation for smooth color transitions
    lerp(start, end, progress) {
        return start + (end - start) * progress;
    }

    // Interpolate between colors
    interpolateColor(color1, color2, progress) {
        const easedProgress = this.cubicEase(progress);
        return {
            r: Math.round(this.lerp(color1.r, color2.r, easedProgress)),
            g: Math.round(this.lerp(color1.g, color2.g, easedProgress)),
            b: Math.round(this.lerp(color1.b, color2.b, easedProgress))
        };
    }

    // Create gradient string from color
    createGradient(color1, color2, angle = 135) {
        const c1 = `rgb(${color1.r}, ${color1.g}, ${color1.b})`;
        const c2 = `rgb(${color2.r}, ${color2.g}, ${color2.b})`;
        return `linear-gradient(${angle}deg, ${c1} 0%, ${c2} 100%)`;
    }

    // Update gradient layers
    updateGradients() {
        const currentColor = this.colors[this.currentColorIndex];
        const nextColor = this.colors[this.nextColorIndex];
        const thirdColorIndex = (this.nextColorIndex + 1) % this.colors.length;
        const thirdColor = this.colors[thirdColorIndex];
        
        // Interpolate colors based on transition progress
        const interpolatedColor1 = this.interpolateColor(currentColor, nextColor, this.transitionProgress);
        const interpolatedColor2 = this.interpolateColor(nextColor, thirdColor, this.transitionProgress);
        
        // Apply gradients with different angles for depth
        if (this.gradient1 && this.gradient2) {
            this.gradient1.style.background = this.createGradient(interpolatedColor1, interpolatedColor2, 135);
            this.gradient2.style.background = this.createGradient(interpolatedColor2, interpolatedColor1, 225);
            this.gradient2.style.opacity = 0.7 + Math.sin(this.transitionProgress * Math.PI) * 0.3;
        }
    }

    // Smooth scroll handling
    setupScrollListener() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            this.targetScrollY = window.scrollY;
            
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.updateScrollBasedTransition();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // Update transition based on scroll
    updateScrollBasedTransition() {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = this.currentScrollY / maxScroll;
        
        // Calculate which colors to transition between
        const totalTransitions = this.colors.length - 1;
        const currentTransition = scrollProgress * totalTransitions;
        
        this.currentColorIndex = Math.floor(currentTransition) % this.colors.length;
        this.nextColorIndex = (this.currentColorIndex + 1) % this.colors.length;
        this.transitionProgress = currentTransition - Math.floor(currentTransition);
        
        this.updateGradients();
    }

    // Main animation loop
    startAnimation() {
        const animate = () => {
            // Smooth scroll interpolation
            const scrollDiff = this.targetScrollY - this.currentScrollY;
            this.currentScrollY += scrollDiff * 0.1; // Smooth factor
            
            // Update scroll-based transition
            this.updateScrollBasedTransition();
            
            // Continue animation
            this.animationFrame = requestAnimationFrame(animate);
        };
        
        animate();
    }

    // Cleanup
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
}

// Smooth scrolling SPA functionality
let currentSection = 0;
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-links a');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu-links a');
let ultraSmoothBg = null;

// Update active navigation and background based on scroll
function updateActiveNavigation() {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop - 72;
        const sectionHeight = section.offsetHeight;
        const sectionBottom = sectionTop + sectionHeight;
        
        // Calculate how much of the section is visible
        const sectionMiddle = sectionTop + sectionHeight / 2;
        const viewportMiddle = scrollPosition + windowHeight / 2;
        
        // Check if section is in viewport for navigation
        if (viewportMiddle >= sectionTop && viewportMiddle < sectionBottom) {
            
            // Update nav links with smooth transition
            navLinks.forEach((link, i) => {
                if (i === index) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
            
            // Update mobile menu links
            mobileMenuLinks.forEach((link, i) => {
                link.classList.toggle('active', i === index);
            });
            
            // Update current section for tracking
            if (currentSection !== index) {
                currentSection = index;
            }
        }
    });
}

// Reveal elements on scroll with advanced effects
function revealOnScroll() {
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;
    
    sections.forEach((section, sectionIndex) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionMiddle = sectionTop + sectionHeight / 2;
        const sectionBottom = sectionTop + sectionHeight;
        
        // Calculate visibility percentage
        const visibleTop = Math.max(0, windowHeight - (sectionTop - scrollY));
        const visibleBottom = Math.max(0, sectionBottom - scrollY);
        const visibilityPercentage = Math.min(visibleTop, visibleBottom) / windowHeight;
        
        // Trigger visibility when 30% visible
        if (visibilityPercentage > 0.3 && !section.classList.contains('visible')) {
            section.classList.add('visible');
            
            // Stagger animations for different element types
            const cards = section.querySelectorAll('.glass-card');
            const orbs = section.querySelectorAll('.project-orb');
            const certs = section.querySelectorAll('.cert-card');
            const pubs = section.querySelectorAll('.pub-card');
            const skills = section.querySelectorAll('.skill-bubble');
            
            // Animate cards with wave effect
            cards.forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0) rotateX(0)';
                }, index * 80);
            });
            
            // Animate orbs in a spiral pattern
            orbs.forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'scale(1) translateY(0)';
                }, index * 60);
            });
            
            // Animate other elements
            [...certs, ...pubs].forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 100);
            });
            
            // Animate skill bubbles with ripple effect
            skills.forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'scale(1)';
                }, index * 30);
            });
        }
        
        // Parallax effect based on scroll position
        if (section.classList.contains('visible')) {
            const parallaxElements = section.querySelectorAll('[data-parallax]');
            parallaxElements.forEach(el => {
                const speed = el.dataset.parallax || 0.5;
                const offset = (scrollY - sectionTop) * speed;
                el.style.transform = `translateY(${offset}px)`;
            });
        }
    });
}

// Parallax scrolling effect (only for about image)
function parallaxScroll() {
    const scrolled = window.scrollY;
    const parallaxElements = document.querySelectorAll('.about-image');
    
    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
}

// Smooth scroll to section with custom easing
function scrollToSection(index) {
    if (index < 0 || index >= sections.length) return;
    
    const targetSection = sections[index];
    const targetPosition = targetSection.offsetTop - 72; // Account for header
    
    smoothScrollTo(targetPosition, 1200);
}

// Smooth scroll with enhanced easing
function smoothScrollTo(target, duration = 1200) {
    const start = window.scrollY;
    const distance = target - start;
    const startTime = performance.now();
    
    function cubicEaseInOut(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    function scroll() {
        const currentTime = performance.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = cubicEaseInOut(progress);
        
        window.scrollTo(0, start + distance * easedProgress);
        
        if (progress < 1) {
            requestAnimationFrame(scroll);
        }
    }
    
    requestAnimationFrame(scroll);
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize ultra smooth background
    ultraSmoothBg = new UltraSmoothBackground();
    
    // Make first section visible
    if (sections[0]) {
        sections[0].classList.add('visible');
    }
    
    // Navigation link clicks
    navLinks.forEach((link, index) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = parseInt(link.getAttribute('data-section'));
            scrollToSection(targetSection);
        });
    });
    
    // Mobile menu link clicks
    mobileMenuLinks.forEach((link, index) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = parseInt(link.getAttribute('data-section'));
            scrollToSection(targetSection);
            
            // Close mobile menu
            const mobileMenu = document.querySelector('.mobile-menu');
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
            }
        });
    });
    
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }
    
    // Scroll event listeners
    let ticking = false;
    function scrollHandler() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveNavigation();
                revealOnScroll();
                parallaxScroll();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', scrollHandler);
    
    // Initial check
    updateActiveNavigation();
    revealOnScroll();
    
    // Smooth hover effects
    const cards = document.querySelectorAll('.glass-card, .cert-card, .pub-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Project orb interactions
    const orbs = document.querySelectorAll('.project-orb');
    orbs.forEach(orb => {
        orb.addEventListener('mouseenter', function() {
            const inner = this.querySelector('.orb-inner');
            inner.style.transform = 'scale(1.1) rotate(5deg)';
            inner.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        orb.addEventListener('mouseleave', function() {
            const inner = this.querySelector('.orb-inner');
            inner.style.transform = 'scale(1) rotate(0)';
        });
    });
    
    // Magnetic cursor effect for buttons
    const magneticButtons = document.querySelectorAll('.submit-btn, .pub-link');
    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            this.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0)';
        });
    });
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
        }
    }
});

// Smooth scroll with mouse wheel (optional - more like traditional scrolling)
let scrollTimeout;
window.addEventListener('wheel', (e) => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        updateActiveNavigation();
    }, 100);
}, { passive: true });