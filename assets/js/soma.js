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

  const priceToggle = document.querySelector('[data-price-toggle]');
  if (priceToggle) {
    const radioInputs = Array.from(priceToggle.querySelectorAll('input[type="radio"]'));
    const priceItems = Array.from(document.querySelectorAll('[data-price]'));
    const labels = Array.from(priceToggle.querySelectorAll('.price-toggle__option'));

    const setActiveLabel = (value) => {
      labels.forEach((label) => {
        const input = label.getAttribute('for');
        const targetInput = input ? document.getElementById(input) : null;
        const isActive = targetInput ? targetInput.value === value : false;
        label.classList.toggle('is-active', isActive);
      });
    };

    const updatePrices = (value) => {
      priceItems.forEach((item) => {
        const isActive = item.getAttribute('data-price') === value;
        item.setAttribute('data-price-active', isActive ? 'true' : 'false');
        item.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      });
      setActiveLabel(value);
    };

    const handleChange = (event) => {
      if (event.target instanceof HTMLInputElement) {
        updatePrices(event.target.value);
      }
    };

    radioInputs.forEach((input) => {
      input.addEventListener('change', handleChange);
    });

    const checked = radioInputs.find((input) => input.checked) || radioInputs[0];
    if (checked) {
      updatePrices(checked.value);
    }
  }

  const quizForm = document.querySelector('[data-plan-quiz]');
  if (quizForm) {
    const resultContainer = quizForm.querySelector('[data-quiz-result]');
    const resultTitle = quizForm.querySelector('[data-quiz-result-title]');
    const resultText = quizForm.querySelector('[data-quiz-result-text]');
    const resultLink = quizForm.querySelector('[data-quiz-result-link]');

    const planMap = {
      'remoto-1x': {
        title: 'Remoto Essencial+',
        text: 'Boa escolha para quem quer encontros semanais no remoto com suporte integrado.',
        link: '#plano-remoto-essencial',
      },
      'remoto-2x': {
        title: 'Remoto Integrado+',
        text: 'Ideal para quem busca evolução consistente com dois encontros por semana.',
        link: '#plano-remoto-integrado',
      },
      'remoto-3x': {
        title: 'Remoto Performance+',
        text: 'Para quem precisa de frequência alta e ajustes constantes.',
        link: '#plano-remoto-performance',
      },
      'presencial-1x': {
        title: 'Presencial Essencial+',
        text: 'Para quem valoriza presença semanal e alinhamento contínuo.',
        link: '#plano-presencial-essencial',
      },
      'presencial-2x': {
        title: 'Presencial Integrado+',
        text: 'Para quem quer acompanhamento presencial mais frequente.',
        link: '#plano-presencial-integrado',
      },
      'presencial-3x': {
        title: 'Presencial Performance+',
        text: 'Para quem busca intensidade máxima no presencial.',
        link: '#plano-presencial-performance',
      },
    };

    quizForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const nivel = quizForm.querySelector('input[name="nivel"]:checked');
      const formato = quizForm.querySelector('input[name="formato"]:checked');
      const frequencia = quizForm.querySelector('input[name="frequencia"]:checked');

      if (!resultContainer || !resultTitle || !resultText || !resultLink) {
        return;
      }

      if (!nivel || !formato || !frequencia) {
        resultTitle.textContent = 'Responda todas as perguntas para ver a recomendação.';
        resultText.textContent = 'Assim conseguimos sugerir o plano mais próximo do seu ritmo.';
        resultLink.textContent = 'Ver todos os planos';
        resultLink.setAttribute('href', '#planos');
        return;
      }

      if (nivel.value === 'assessoria') {
        resultTitle.textContent = 'Assessoria SOMA (Plano Base)';
        resultText.textContent = 'Perfeito para quem busca autonomia com suporte pontual e plano claro.';
        resultLink.textContent = 'Ir para Assessoria SOMA';
        resultLink.setAttribute('href', '#plano-assessoria');
        return;
      }

      const key = `${formato.value}-${frequencia.value}`;
      const plan = planMap[key];

      if (plan) {
        resultTitle.textContent = plan.title;
        resultText.textContent = plan.text;
        resultLink.textContent = 'Ver detalhes do plano';
        resultLink.setAttribute('href', plan.link);
        return;
      }

      resultTitle.textContent = 'Confira todos os planos SOMA';
      resultText.textContent = 'Use o comparativo para entender qual plano te atende melhor.';
      resultLink.textContent = 'Ver planos';
      resultLink.setAttribute('href', '#planos');
    });
  }

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
})();
