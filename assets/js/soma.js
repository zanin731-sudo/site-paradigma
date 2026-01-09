(function() {
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
        const isActive = button.dataset.groupBtn === nextGroup;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-selected', isActive ? 'true' : 'false');
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
