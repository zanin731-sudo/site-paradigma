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
