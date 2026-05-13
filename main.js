/**
 * ============================================
 * ИНДИВИДУАЛЬНЫЙ ПРОЕКТ - Premium JavaScript
 * Advanced animations and interactivity
 * Enhanced with counter animations and effects
 * Mobile-optimized with touch support
 * ============================================
 */

(function() {
  'use strict';

  // ============================================
  // Device Detection
  // ============================================
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ============================================
  // DOM Ready Handler
  // ============================================
  document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initRevealAnimations();
    
    // Only init parallax on desktop
    if (!isMobile && !prefersReducedMotion) {
      initParallaxEffects();
      initMagneticButtons();
    }
    
    initBeforeAfterSlider();
    
    // Reduce particles on mobile
    initParticles(isMobile ? 15 : 30);
    
    initMobileMenu();
    initSmoothScroll();
    initButtonInteractions();
    initScrollProgress();
    initGlassCardHover();
    initCounterAnimation();
    
    // Only init cursor glow on desktop
    if (!isMobile) {
      initCursorGlow();
    }
    
    initStaggeredReveal();
    initImageLazyLoad();
  });

  // ============================================
  // Navbar Scroll Effect
  // ============================================
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let lastScroll = 0;
    let ticking = false;

    function updateNavbar() {
      const scrollY = window.scrollY;

      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      ticking = false;
    }

    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    }, { passive: true });
  }

  // ============================================
  // Reveal Animations on Scroll
  // ============================================
  function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-from-left, .reveal-from-right, .reveal-scale');
    if (!revealElements.length) return;

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ============================================
  // Staggered Reveal Items
  // ============================================
  function initStaggeredReveal() {
    const staggerItems = document.querySelectorAll('.stagger-item');
    if (!staggerItems.length) return;

    staggerItems.forEach((item, index) => {
      item.style.transitionDelay = `${index * 0.1}s`;
    });
  }

  // ============================================
  // Parallax Effects for Glow Orbs - Mobile Optimized
  // ============================================
  function initParallaxEffects() {
    // Skip on mobile or reduced motion
    if (isMobile || prefersReducedMotion) return;
    
    const orbs = document.querySelectorAll('.glow-orb');
    if (!orbs.length) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    function animate() {
      currentX += (mouseX - currentX) * 0.05;
      currentY += (mouseY - currentY) * 0.05;

      orbs.forEach(orb => {
        const factor = parseFloat(orb.dataset.parallaxFactor) || 0.02;
        const xShift = currentX * 60 * factor;
        const yShift = currentY * 60 * factor;
        orb.style.transform = `translate3d(${xShift}px, ${yShift}px, 0)`;
      });

      requestAnimationFrame(animate);
    }

    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    animate();

    // Scroll parallax - reduced on mobile
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      requestAnimationFrame(() => {
        orbs.forEach((orb, index) => {
          const speed = 0.02 + (index * 0.01);
          orb.style.marginTop = `${scrolled * speed}px`;
        });
      });
    }, { passive: true });
  }

  // ============================================
  // Magnetic Button Effect - Desktop Only
  // ============================================
  function initMagneticButtons() {
    // Skip on mobile
    if (isMobile) return;
    
    const magneticWraps = document.querySelectorAll('.magnetic-wrap');
    if (!magneticWraps.length) return;

    magneticWraps.forEach(wrap => {
      const btn = wrap.querySelector('.magnetic-btn, .apple-button, a, button');
      if (!btn) return;

      wrap.addEventListener('mousemove', (e) => {
        const rect = wrap.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        wrap.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });

      wrap.addEventListener('mouseleave', () => {
        wrap.style.transform = 'translate(0, 0)';
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  // ============================================
  // Before-After Slider - Enhanced with Mobile Support
  // ============================================
  function initBeforeAfterSlider() {
    const sliders = document.querySelectorAll('#before-after-slider, .before-after-slider, #dlss-comparison');
    if (!sliders.length) return;

    sliders.forEach(slider => {
      const beforeContainer = slider.querySelector('#before-container, .before-container');
      const handle = slider.querySelector('#slider-handle, .slider-handle');

      if (!beforeContainer || !handle) return;

      // Установить ползунок посередине изначально
      beforeContainer.style.clipPath = 'inset(0 50% 0 0)';
      handle.style.left = '50%';

      let isDragging = false;
      let animationFrame = null;
      let startX = 0;

      function moveSlider(clientX) {
        if (animationFrame) return;

        animationFrame = requestAnimationFrame(() => {
          const rect = slider.getBoundingClientRect();
          let x = clientX - rect.left;
          x = Math.max(0, Math.min(x, rect.width));
          const percent = (x / rect.width) * 100;

          beforeContainer.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
          handle.style.left = `${percent}%`;

          animationFrame = null;
        });
      }

      // Mouse events
      handle.addEventListener('mousedown', (e) => {
        isDragging = true;
        document.body.style.cursor = 'ew-resize';
        handle.classList.add('dragging');
        e.preventDefault();
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        moveSlider(e.clientX);
      });

      window.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          document.body.style.cursor = '';
          handle.classList.remove('dragging');
        }
      });

      // Touch events - Enhanced for mobile
      handle.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        handle.classList.add('dragging');
        e.preventDefault();
      }, { passive: false });

      window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        // Prevent page scroll while dragging slider
        e.preventDefault();
        moveSlider(e.touches[0].clientX);
      }, { passive: false });

      window.addEventListener('touchend', () => {
        if (isDragging) {
          isDragging = false;
          handle.classList.remove('dragging');
        }
      });

      // Click on slider to jump to position
      slider.addEventListener('click', (e) => {
        if (!isDragging) {
          moveSlider(e.clientX);
        }
      });

      // Prevent image drag on mobile
      const images = slider.querySelectorAll('img');
      images.forEach(img => {
        img.addEventListener('dragstart', (e) => e.preventDefault());
      });
    });
  }

  // ============================================
  // Particle System - Enhanced with Mobile Optimization
  // ============================================
  function initParticles(particleCount = 30) {
    const container = document.getElementById('particles-container');
    if (!container) return;

    // Reduce particles on mobile for better performance
    const count = isMobile ? Math.floor(particleCount / 2) : particleCount;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle animate-drift';

      const size = Math.random() * 4 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 10}s`;
      particle.style.animationDuration = `${20 + Math.random() * 30}s`;
      particle.style.opacity = Math.random() * 0.5 + 0.2;

      fragment.appendChild(particle);
    }

    container.appendChild(fragment);
  }

  // ============================================
  // Mobile Menu - Enhanced Touch Support
  // ============================================
  function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const menuLinks = document.querySelectorAll('.mobile-menu a');

    if (!menuBtn || !mobileMenu) return;

    function toggleMenu() {
      const isActive = mobileMenu.classList.toggle('active');
      if (overlay) overlay.classList.toggle('active');
      menuBtn.setAttribute('aria-expanded', isActive);
      
      // Toggle body scroll with delay for animation
      if (isActive) {
        document.body.style.overflow = 'hidden';
        // Prevent iOS rubber band scrolling
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
      } else {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
      }
    }

    menuBtn.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', toggleMenu);

    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
      });
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        toggleMenu();
      }
    });

    // Handle swipe to close gesture
    let touchStartY = 0;
    let touchEndY = 0;

    mobileMenu.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    mobileMenu.addEventListener('touchmove', (e) => {
      touchEndY = e.touches[0].clientY;
    }, { passive: true });

    mobileMenu.addEventListener('touchend', () => {
      if (!touchStartY || !touchEndY) return;
      
      // Swipe down to close
      if (touchEndY - touchStartY > 100) {
        mobileMenu.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
      }
      
      touchStartY = 0;
      touchEndY = 0;
    });
  }

  // ============================================
  // Smooth Scroll for Anchor Links
  // ============================================
  function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#' || href.length < 2) return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        const navbarHeight = document.getElementById('navbar')?.offsetHeight || 80;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update URL without scrolling
        history.pushState(null, null, href);
      });
    });
  }

  // ============================================
  // Button Interactions & Ripple Effect
  // ============================================
  function initButtonInteractions() {
    const buttons = document.querySelectorAll('.apple-button, button, .glass-card, .processing-btn');

    buttons.forEach(button => {
      button.addEventListener('click', function(e) {
        // Add click animation
        this.style.transform = 'scale(0.97)';
        setTimeout(() => {
          this.style.transform = '';
        }, 150);

        // Create ripple effect for buttons
        if (this.classList.contains('apple-button')) {
          createRipple(e, this);
        }
      });
    });
  }

  function createRipple(event, button) {
    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) existingRipple.remove();

    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple-animation 0.6s ease-out;
      pointer-events: none;
    `;

    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  }

  // ============================================
  // Scroll Progress Indicator
  // ============================================
  function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.className = 'progress-bar';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      progressBar.style.width = `${scrollPercent}%`;
    }, { passive: true });
  }

  // ============================================
  // Glass Card Hover Effect - Mouse Tracking
  // ============================================
  function initGlassCardHover() {
    const cards = document.querySelectorAll('.glass-card, .upload-zone');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }

  // ============================================
  // Counter Animation
  // ============================================
  function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number, [data-count]');
    if (!counters.length) return;

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  function animateCounter(element) {
    const text = element.textContent.trim();
    
    // Check if it's a percentage
    if (text.includes('%')) {
      const numText = text.replace('%', '').replace('до ', '').replace('-', '');
      const target = parseInt(numText);
      if (isNaN(target)) return;
      
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;
      const prefix = text.includes('до ') ? 'до ' : '';
      const isNegative = text.startsWith('-');

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          element.textContent = (isNegative ? '-' : '') + prefix + target + '%';
          clearInterval(timer);
        } else {
          element.textContent = (isNegative ? '-' : '') + prefix + Math.floor(current) + '%';
        }
      }, 16);
    }
    // Check if it's a number with K/M suffix
    else if (text.includes('K') || text.includes('M')) {
      const suffix = text.includes('K') ? 'K' : 'M';
      const numText = text.replace(suffix, '').replace('+', '');
      const target = parseInt(numText);
      if (isNaN(target)) return;
      
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;
      const hasPlus = text.includes('+');

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          element.textContent = target + suffix + (hasPlus ? '+' : '');
          clearInterval(timer);
        } else {
          element.textContent = Math.floor(current) + suffix;
        }
      }, 16);
    }
    // Check if it's "8K" resolution
    else if (text === '8K') {
      // No animation needed, just display
    }
    // Check if it's "AI" text
    else if (text === 'AI') {
      // No animation needed
    }
    // Check if it's "6x" multiplier
    else if (text.includes('x')) {
      const numText = text.replace('x', '');
      const target = parseInt(numText);
      if (isNaN(target)) return;
      
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          element.textContent = target + 'x';
          clearInterval(timer);
        } else {
          element.textContent = Math.floor(current) + 'x';
        }
      }, 16);
    }
    // Regular number
    else {
      const target = parseInt(text);
      if (isNaN(target)) return;
      
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          element.textContent = target;
          clearInterval(timer);
        } else {
          element.textContent = Math.floor(current);
        }
      }, 16);
    }
  }

  // ============================================
  // Cursor Glow Effect - Desktop Only
  // ============================================
  function initCursorGlow() {
    // Skip on mobile - not needed for touch devices
    if (isMobile) return;
    
    const glowElements = document.querySelectorAll('.glass-card, .feature-icon-box');
    if (!glowElements.length) return;

    document.addEventListener('mousemove', (e) => {
      glowElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        el.style.setProperty('--cursor-x', `${x}px`);
        el.style.setProperty('--cursor-y', `${y}px`);
      });
    });
  }

  // ============================================
  // Image Lazy Loading
  // ============================================
  function initImageLazyLoad() {
    const images = document.querySelectorAll('img[data-src]');
    if (!images.length) return;

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    }, { threshold: 0.1 });

    images.forEach(img => imageObserver.observe(img));
  }

  // ============================================
  // Utility Functions
  // ============================================
  window.utils = {
    // Debounce function
    debounce: function(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    // Throttle function
    throttle: function(func, limit) {
      let inThrottle;
      return function(...args) {
        if (!inThrottle) {
          func.apply(this, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    },

    // Show toast notification
    showToast: function(message, type = 'info') {
      const existingToast = document.querySelector('.toast-notification');
      if (existingToast) existingToast.remove();

      const toast = document.createElement('div');
      toast.className = 'toast-notification';
      toast.textContent = message;
      toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'rgba(0, 168, 107, 0.95)' : 'rgba(173, 198, 255, 0.95)'};
        color: white;
        border-radius: 1rem;
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        font-weight: 600;
        font-size: 0.875rem;
      `;

      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => toast.remove(), 400);
      }, 3000);
    }
  };

  // Add toast animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
    @keyframes ripple-animation {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

})();
