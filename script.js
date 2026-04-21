(function() {
  "use strict";

  const activePopups = new Set();

  const wrapper = document.querySelector('.shareWrapper');
  const button = document.querySelector('.shareButton');
  const menu = document.querySelector('.shareMenu');

  if (!wrapper || !button || !menu) {
    console.warn('Не найдены необходимые элементы');
    return;
  }

  const component = { wrapper, button, menu };

  function closePopup(comp) {
    const { menu, button } = comp;
    if (!menu.classList.contains('active')) return;

    menu.classList.remove('active');
    button.setAttribute('aria-expanded', 'false');
    activePopups.delete(comp);
    button.focus();
  }

  function openPopup(comp) {
    const { menu, button } = comp;
    if (menu.classList.contains('active')) return;

    for (const other of activePopups) {
      closePopup(other);
    }

    menu.classList.add('active');
    button.setAttribute('aria-expanded', 'true');
    activePopups.add(comp);

    const firstLink = menu.querySelector('a');
    if (firstLink) firstLink.focus();
  }

  function togglePopup(comp) {
    const { menu } = comp;
    if (menu.classList.contains('active')) {
      closePopup(comp);
    } else {
      openPopup(comp);
    }
  }

  button.addEventListener('click', () => {
    togglePopup(component);
  });

  document.addEventListener('click', (event) => {
    for (const comp of activePopups) {
      const { menu, button } = comp;
      const isClickInsideMenu = menu.contains(event.target);
      const isClickOnButton = button.contains(event.target);
      if (!isClickInsideMenu && !isClickOnButton) {
        closePopup(comp);
      }
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && activePopups.size > 0) {
      for (const comp of activePopups) {
        closePopup(comp);
      }
      event.preventDefault();
    }
  });

  menu.addEventListener('focusout', () => {
    setTimeout(() => {
      if (menu.classList.contains('active') && !menu.contains(document.activeElement) && document.activeElement !== button) {
        closePopup(component);
      }
    }, 0);
  });

  // Начальное состояние — скрыто
  menu.classList.remove('active');
  button.setAttribute('aria-expanded', 'false');
})();