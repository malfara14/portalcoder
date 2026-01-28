/* ========================================
   PORTALCODER - INTERAÇÕES MODERNAS
   ======================================== */

// ========================================
// UTILITÁRIOS GERAIS
// ========================================

// Debounce function para otimizar performance
function debounce(func, wait) {
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

// Throttle function para limitar execuções
function throttle(func, limit) {
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
}

// ========================================
// ANIMAÇÕES DE SCROLL
// ========================================

class ScrollAnimations {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    this.init();
  }

  init() {
    // Verificar se o Intersection Observer é suportado
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        this.observerOptions
      );
      this.observeElements();
    } else {
      // Fallback para navegadores sem suporte
      this.fallbackAnimation();
    }
  }

  observeElements() {
    const elements = document.querySelectorAll(
      '.fade-in-on-scroll, .slide-in-left-on-scroll, .slide-in-right-on-scroll, .scale-in-on-scroll'
    );
    
    elements.forEach(element => {
      this.observer.observe(element);
    });
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Parar de observar após a animação
        this.observer.unobserve(entry.target);
      }
    });
  }

  fallbackAnimation() {
    // Aplicar animação imediatamente para navegadores sem suporte
    const elements = document.querySelectorAll(
      '.fade-in-on-scroll, .slide-in-left-on-scroll, .slide-in-right-on-scroll, .scale-in-on-scroll'
    );
    
    elements.forEach(element => {
      element.classList.add('visible');
    });
  }
}

// ========================================
// HEADER SCROLL EFFECT
// ========================================

class HeaderScrollEffect {
  constructor() {
    this.header = document.querySelector('.header');
    if (!this.header) return;
    
    this.init();
  }

  init() {
    const handleScroll = throttle(() => {
      const scrollY = window.scrollY;
      const scrollThreshold = 50; // Começar o efeito mais cedo
      
      if (scrollY > scrollThreshold) {
        this.header.classList.add('scrolled');
        
        // Aplicar transparência progressiva baseada no scroll
        const maxScroll = 200;
        const scrollProgress = Math.min(scrollY / maxScroll, 1);
        const opacity = 0.1 + (scrollProgress * 0.1); // De 0.1 a 0.2
        const blurAmount = 10 + (scrollProgress * 10); // De 10px a 20px
        
        this.header.style.background = `rgba(255, 255, 255, ${opacity})`;
        this.header.style.backdropFilter = `blur(${blurAmount}px)`;
        this.header.style.webkitBackdropFilter = `blur(${blurAmount}px)`;
      } else {
        this.header.classList.remove('scrolled');
        this.header.style.background = '';
        this.header.style.backdropFilter = '';
        this.header.style.webkitBackdropFilter = '';
      }
    }, 16); // ~60fps

    window.addEventListener('scroll', handleScroll);
    
    // Aplicar estado inicial
    handleScroll();
  }
}

// ========================================
// NAVIGATION ACTIVE LINK
// ========================================

class NavigationActiveLink {
  constructor() {
    this.navLinks = document.querySelectorAll('.nav-link');
    this.sections = document.querySelectorAll('section[id]');
    this.init();
  }

  init() {
    if (this.navLinks.length === 0 || this.sections.length === 0) return;

    const handleScroll = throttle(() => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      let currentSection = '';
      
      this.sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          currentSection = section.getAttribute('id');
        }
      });
      
      // Atualizar links ativos
      this.navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
          link.classList.add('active');
        }
      });
    }, 100);

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Aplicar estado inicial
  }
}

// ========================================
// CARD HOVER EFFECTS
// ========================================

class CardHoverEffects {
  constructor() {
    this.cards = document.querySelectorAll('.card');
    this.init();
  }

  init() {
    this.cards.forEach(card => {
      card.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
      card.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    });
  }

  handleMouseEnter(e) {
    const card = e.currentTarget;
    card.style.transform = 'translateY(-8px)';
    card.style.boxShadow = 'var(--shadow-2xl)';
  }

  handleMouseLeave(e) {
    const card = e.currentTarget;
    card.style.transform = 'translateY(0)';
    card.style.boxShadow = 'var(--shadow-md)';
  }
}

// ========================================
// FORM VALIDATION ENHANCEMENTS
// ========================================

class FormEnhancements {
  constructor() {
    this.forms = document.querySelectorAll('form');
    this.init();
  }

  init() {
    this.forms.forEach(form => {
      this.enhanceForm(form);
    });
  }

  enhanceForm(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      // Adicionar classe de foco
      input.addEventListener('focus', () => {
        input.classList.add('input-focus-ring');
      });
      
      input.addEventListener('blur', () => {
        input.classList.remove('input-focus-ring');
      });

      // Validação em tempo real
      input.addEventListener('input', debounce(() => {
        this.validateField(input);
      }, 300));
    });

    // Melhorar feedback de submit
    form.addEventListener('submit', (e) => {
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        this.showLoadingState(submitBtn);
      }
    });
  }

  validateField(input) {
    const isValid = input.checkValidity();
    const formGroup = input.closest('.form-group');
    
    if (formGroup) {
      if (isValid) {
        formGroup.classList.remove('error');
        formGroup.classList.add('success');
      } else {
        formGroup.classList.remove('success');
        formGroup.classList.add('error');
      }
    }
  }

  showLoadingState(button) {
    const originalText = button.textContent;
    button.textContent = 'Processando...';
    button.disabled = true;
    
    // Adicionar spinner
    const spinner = document.createElement('span');
    spinner.className = 'spinner spinner-sm';
    button.appendChild(spinner);
    
    // Restaurar após 3 segundos (ou quando necessário)
    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
      const existingSpinner = button.querySelector('.spinner');
      if (existingSpinner) {
        existingSpinner.remove();
      }
    }, 3000);
  }
}

// ========================================
// TOAST NOTIFICATIONS
// ========================================

class ToastNotifications {
  constructor() {
    this.container = this.createContainer();
    this.init();
  }

  createContainer() {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
      `;
      document.body.appendChild(container);
    }
    return container;
  }

  init() {
    // Interceptar alertas existentes
    this.interceptAlerts();
  }

  interceptAlerts() {
    const originalAlert = window.alert;
    window.alert = (message) => {
      this.show(message, 'info');
    };
  }

  show(message, type = 'info', duration = 5000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} toast-slide-in`;
    toast.style.cssText = `
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-lg);
      padding: var(--space-4);
      box-shadow: var(--shadow-xl);
      color: var(--text-primary);
      font-weight: var(--font-weight-medium);
      max-width: 300px;
      position: relative;
    `;

    // Adicionar linha colorida no topo
    const line = document.createElement('div');
    line.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: var(--gradient-${type === 'error' ? 'accent' : type === 'success' ? 'secondary' : 'primary'});
      border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    `;
    toast.appendChild(line);

    // Conteúdo do toast
    const content = document.createElement('div');
    content.textContent = message;
    toast.appendChild(content);

    // Botão de fechar
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
      position: absolute;
      top: 8px;
      right: 8px;
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      color: var(--text-muted);
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all var(--transition-fast);
    `;
    
    closeBtn.addEventListener('click', () => {
      this.hide(toast);
    });
    
    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.background = 'var(--neutral-200)';
    });
    
    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.background = 'none';
    });
    
    toast.appendChild(closeBtn);
    this.container.appendChild(toast);

    // Auto-remover após duração
    setTimeout(() => {
      this.hide(toast);
    }, duration);
  }

  hide(toast) {
    toast.classList.add('toast-slide-out');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }
}

// ========================================
// LOADING STATES
// ========================================

class LoadingStates {
  constructor() {
    this.init();
  }

  init() {
    // Adicionar skeleton loading para elementos que carregam dados
    this.addSkeletonLoading();
  }

  addSkeletonLoading() {
    const elements = document.querySelectorAll('[data-loading]');
    
    elements.forEach(element => {
      const skeleton = this.createSkeleton(element);
      element.appendChild(skeleton);
      
      // Simular carregamento
      setTimeout(() => {
        skeleton.remove();
        element.classList.add('loaded');
      }, 2000);
    });
  }

  createSkeleton(element) {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton-container';
    skeleton.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--glass-bg);
      border-radius: var(--radius-lg);
      padding: var(--space-4);
    `;

    // Adicionar linhas skeleton
    for (let i = 0; i < 3; i++) {
      const line = document.createElement('div');
      line.className = 'skeleton skeleton-text';
      line.style.width = i === 2 ? '60%' : '100%';
      skeleton.appendChild(line);
    }

    return skeleton;
  }
}

// ========================================
// MOBILE MENU
// ========================================

class MobileMenu {
  constructor() {
    this.menuButton = document.querySelector('.mobile-menu-button');
    this.menu = document.querySelector('.mobile-menu');
    this.init();
  }

  init() {
    if (!this.menuButton || !this.menu) return;

    this.menuButton.addEventListener('click', () => {
      this.toggle();
    });

    // Fechar ao clicar fora
    document.addEventListener('click', (e) => {
      if (!this.menu.contains(e.target) && !this.menuButton.contains(e.target)) {
        this.close();
      }
    });
  }

  toggle() {
    this.menu.classList.toggle('active');
    this.menuButton.classList.toggle('active');
  }

  open() {
    this.menu.classList.add('active');
    this.menuButton.classList.add('active');
  }

  close() {
    this.menu.classList.remove('active');
    this.menuButton.classList.remove('active');
  }
}

// ========================================
// PERFORMANCE OPTIMIZATIONS
// ========================================

class PerformanceOptimizations {
  constructor() {
    this.init();
  }

  init() {
    // Lazy loading para imagens
    this.lazyLoadImages();
    
    // Preload de recursos críticos
    this.preloadCriticalResources();
    
    // Otimizar animações para dispositivos com prefers-reduced-motion
    this.respectReducedMotion();
  }

  lazyLoadImages() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  preloadCriticalResources() {
    // Preload da fonte Inter
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap';
    link.as = 'style';
    document.head.appendChild(link);
  }

  respectReducedMotion() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Desabilitar animações para usuários que preferem movimento reduzido
      document.documentElement.style.setProperty('--transition-fast', '0s');
      document.documentElement.style.setProperty('--transition-normal', '0s');
      document.documentElement.style.setProperty('--transition-slow', '0s');
    }
  }
}

// ========================================
// INICIALIZAÇÃO
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar todos os módulos
  new ScrollAnimations();
  new HeaderScrollEffect();
  new NavigationActiveLink();
  new CardHoverEffects();
  new FormEnhancements();
  new ToastNotifications();
  new LoadingStates();
  new MobileMenu();
  new PerformanceOptimizations();

  // Adicionar classe de carregamento completo
  document.body.classList.add('loaded');
  
  console.log('🎉 PortalCoder - Interações modernas carregadas!');
});

// ========================================
// EXPORTS PARA USO GLOBAL
// ========================================

window.PortalCoder = {
  ToastNotifications,
  debounce,
  throttle
};
