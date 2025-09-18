(function() {
  const menuButton = document.querySelector('[data-menu-button]');
  const navs = Array.from(document.querySelectorAll('[data-nav]'));
  const overlay = document.querySelector('[data-overlay]');

  if (!menuButton || navs.length === 0) {
    return;
  }

  const isMobileNav = (nav) => nav.tagName === 'NAV' && nav.classList.contains('lg:hidden');
  const mobileNav = navs.find(isMobileNav);

  const openNav = () => {
    if (mobileNav) {
      mobileNav.classList.remove('hidden');
    }
    menuButton.setAttribute('aria-expanded', 'true');
    if (overlay) {
      overlay.classList.remove('hidden');
    }
    mobileNav?.querySelector('a, button')?.focus();
  };

  const closeNav = () => {
    if (mobileNav) {
      mobileNav.classList.add('hidden');
    }
    menuButton.setAttribute('aria-expanded', 'false');
    if (overlay) {
      overlay.classList.add('hidden');
    }
    menuButton.focus();
  };

  const toggleNav = () => {
    const shouldOpen = mobileNav ? mobileNav.classList.contains('hidden') : true;
    if (shouldOpen) {
      openNav();
    } else {
      closeNav();
    }
  };

  menuButton.addEventListener('click', toggleNav);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobileNav && !mobileNav.classList.contains('hidden')) {
      closeNav();
    }
  });

  if (overlay) {
    overlay.addEventListener('click', closeNav);
  }

  if (mobileNav) {
    mobileNav.addEventListener('click', (event) => {
      if (event.target instanceof Element && event.target.tagName === 'A') {
        closeNav();
      }
    });
  }
})();
