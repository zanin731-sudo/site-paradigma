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

  const stickyCta = document.querySelector('[data-sticky-cta]');
  const stickySentinel = document.querySelector('[data-sticky-sentinel]');

  if (stickyCta && stickySentinel) {
    const toggleSticky = (shouldShow) => {
      stickyCta.classList.toggle('is-visible', shouldShow);
      stickyCta.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            toggleSticky(!entry.isIntersecting);
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(stickySentinel);
    } else {
      const handleScroll = () => {
        const show = window.scrollY > 240;
        toggleSticky(show);
      };
      window.addEventListener('scroll', handleScroll);
      handleScroll();
    }
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
