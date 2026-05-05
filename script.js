// ─── FADE-IN ON SCROLL ─────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.03 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));



// ─── ACCORDION ─────────────────────────────────────────

function openDetail(container) {
  container.style.maxHeight = 'none';
  const realH = container.scrollHeight;
  container.style.maxHeight = '0px';

  container.classList.add('open');
  container.style.maxHeight = realH + 'px';

  container.addEventListener('transitionend', () => {
    if (container.classList.contains('open')) {
      container.style.maxHeight = 'none';
    }
  }, { once: true });

  // Mostra il bottone fuori dal container
  const closeRow = container.nextElementSibling;
  if (closeRow?.classList.contains('card-close-row')) {
    closeRow.classList.add('visible');
  }

  startReveal(container);
}


function closeDetail(container) {
  container.style.maxHeight = container.scrollHeight + 'px';
  container.classList.add('closing');

  const items = container.querySelectorAll(
    '.detail-col--visual > *, .detail-col--text > *'
  );
  items.forEach(el => {
    el.classList.remove('revealed');
    el.style.transitionDelay = '';
  });

  requestAnimationFrame(() => {
    container.style.maxHeight = '0px';
  });

  container.addEventListener('transitionend', () => {
    container.classList.remove('open', 'closing');
    container.style.maxHeight = '';
  }, { once: true });

  // Nasconde il bottone fuori dal container
  const closeRow = container.nextElementSibling;
  if (closeRow?.classList.contains('card-close-row')) {
    closeRow.classList.remove('visible');
  }
}


function startReveal(container) {
  const visualItems = [...container.querySelectorAll('.detail-col--visual > *')];
  const textItems   = [...container.querySelectorAll('.detail-col--text > *')];

  [...visualItems, ...textItems].forEach((el, i) => {
    el.style.transitionDelay = `${i * 80}ms`;
  });

  const revealIo = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        revealIo.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });

  [...visualItems, ...textItems].forEach(el => revealIo.observe(el));

  // Auto-close: osserva il bottone fuori dal container
  const card = container.closest('.project-card');
  const closeRow = container.nextElementSibling;
  const closeBtn = closeRow?.querySelector('.card-close-btn');

  if (!closeBtn) return;

  const exitIo = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      const scrolledPast = e.boundingClientRect.top < 0;
      if (!e.isIntersecting && scrolledPast) {
        closeDetail(container);

        const offset = card.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: offset, behavior: 'smooth' });

        exitIo.disconnect();
      }
    });
  }, { threshold: 0 });

  exitIo.observe(closeBtn);
}



// ─── CLICK APERTURA ────────────────────────────────────
document.querySelectorAll('.project-header').forEach(header => {
  header.addEventListener('click', () => {
    const container = header.nextElementSibling;
    if (container.classList.contains('open')) {
      closeDetail(container);
    } else {
      openDetail(container);
    }
  });
});



// ─── CLICK CHIUDI (bottone) ────────────────────────────
document.addEventListener('click', e => {
  if (e.target.classList.contains('card-close-btn')) {
    const card = e.target.closest('.project-card');
    const container = card.querySelector('.project-detail-container');

    closeDetail(container);

    const offset = card.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  }
});
