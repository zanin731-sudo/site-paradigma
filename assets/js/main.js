(function() {
  const menuButton = document.querySelector('[data-menu-button]');
  const mobileNav = document.querySelector('[data-nav-mobile]');
  const overlay = document.querySelector('[data-overlay]');
  const header = menuButton ? menuButton.closest('header') : null;

  if (!menuButton || !mobileNav) {
    return;
  }

  let lastFocusedElement = null;

  const updateNavTop = () => {
    if (header instanceof HTMLElement) {
      const { bottom } = header.getBoundingClientRect();
      const offset = Math.max(0, Math.round(bottom));
      mobileNav.style.setProperty('--mobile-nav-top', `${offset}px`);
    } else {
      mobileNav.style.removeProperty('--mobile-nav-top');
    }
  };

  const focusFirstLink = () => {
    const firstFocusable = mobileNav.querySelector('a[href], button:not([disabled]), [tabindex="0"]');
    if (firstFocusable instanceof HTMLElement) {
      firstFocusable.focus();
    }
  };

  const openNav = () => {
    lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : menuButton;
    updateNavTop();
    mobileNav.classList.remove('hidden');
    mobileNav.classList.add('mobile-nav-open');
    menuButton.setAttribute('aria-expanded', 'true');
    if (overlay) {
      overlay.classList.remove('hidden');
    }
    document.body.classList.add('overflow-hidden');
    focusFirstLink();
  };

  const closeNav = () => {
    const wasOpen = mobileNav.classList.contains('mobile-nav-open');
    if (wasOpen) {
      const hideNav = () => {
        mobileNav.classList.add('hidden');
      };
      mobileNav.addEventListener('transitionend', hideNav, { once: true });
      // Fallback in case the transition is interrupted.
      window.setTimeout(() => {
        if (!mobileNav.classList.contains('mobile-nav-open')) {
          mobileNav.classList.add('hidden');
        }
      }, 250);
    } else {
      mobileNav.classList.add('hidden');
    }
    mobileNav.classList.remove('mobile-nav-open');
    menuButton.setAttribute('aria-expanded', 'false');
    if (overlay) {
      overlay.classList.add('hidden');
    }
    document.body.classList.remove('overflow-hidden');
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    } else {
      menuButton.focus();
    }
  };

  const toggleNav = () => {
    const shouldOpen = mobileNav.classList.contains('hidden');
    if (shouldOpen) {
      openNav();
    } else {
      closeNav();
    }
  };

  menuButton.addEventListener('click', toggleNav);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobileNav.classList.contains('mobile-nav-open')) {
      closeNav();
    }
  });

  if (overlay) {
    overlay.addEventListener('click', closeNav);
  }

  mobileNav.addEventListener('click', (event) => {
    const link = event.target instanceof Element ? event.target.closest('a') : null;
    if (link) {
      closeNav();
    }
  });

  const desktopMediaQuery = window.matchMedia('(min-width: 1024px)');
  const handleViewportChange = (event) => {
    if (event.matches && mobileNav.classList.contains('mobile-nav-open')) {
      closeNav();
    }
  };

  if (typeof desktopMediaQuery.addEventListener === 'function') {
    desktopMediaQuery.addEventListener('change', handleViewportChange);
  } else {
    desktopMediaQuery.addListener(handleViewportChange);
  }

  const handleResize = () => {
    if (mobileNav.classList.contains('mobile-nav-open')) {
      updateNavTop();
    }
  };

  window.addEventListener('resize', handleResize);
  window.addEventListener('scroll', handleResize);
})();

(function somaInit() {
  const isSoma = document.getElementById('planos')
    || document.querySelector('.soma-hero')
    || document.querySelector('.soma-main');
  if (!isSoma) {
    return;
  }

  document.documentElement.classList.add('js-enabled');

  const anoFooter = document.getElementById('ano-footer');
  if (anoFooter) {
    anoFooter.textContent = new Date().getFullYear().toString();
  }

  const scrollLinks = document.querySelectorAll('[data-scroll-target]');
  scrollLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetSelector = link.getAttribute('data-scroll-target');
      const target = targetSelector ? document.querySelector(targetSelector) : null;
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.setAttribute('tabindex', '-1');
        try {
          target.focus({ preventScroll: true });
        } catch (error) {
          target.focus();
        }
        target.removeAttribute('tabindex');
      }
    });
  });

  const planos = document.getElementById('planos');
  if (planos) {
    const toggle = planos.querySelector('[data-plan-toggle]');
    const buttons = toggle ? Array.from(toggle.querySelectorAll('[data-group-btn]')) : [];

    const setActiveGroup = (group) => {
      const nextGroup = group || 'assessoria';
      planos.setAttribute('data-active-group', nextGroup);
      buttons.forEach((button) => {
        const isActiveGroup = button.dataset.groupBtn === nextGroup;
        button.classList.toggle('is-active', isActiveGroup);
        button.setAttribute('aria-selected', isActiveGroup ? 'true' : 'false');
      });
    };

    const initialGroup = planos.getAttribute('data-active-group') || 'assessoria';
    setActiveGroup(initialGroup);

    buttons.forEach((button, index) => {
      button.addEventListener('click', () => {
        setActiveGroup(button.dataset.groupBtn);
      });

      button.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Enter', ' '].includes(event.key)) {
          return;
        }

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setActiveGroup(button.dataset.groupBtn);
          return;
        }

        event.preventDefault();
        const direction = event.key === 'ArrowRight' ? 1 : -1;
        const nextIndex = (index + direction + buttons.length) % buttons.length;
        const nextButton = buttons[nextIndex];
        if (nextButton) {
          nextButton.focus();
          setActiveGroup(nextButton.dataset.groupBtn);
        }
      });
    });
  }

  const revealElements = Array.from(document.querySelectorAll('[data-reveal]'));
  if (!revealElements.length) {
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    revealElements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  }
})();
