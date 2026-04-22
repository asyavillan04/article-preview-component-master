(function() {
  "use strict";

  // Elements
  const button = document.querySelector('.shareButton');
  const systemButton = document.querySelector('.systemShareButton');
  const menu = document.querySelector('.shareMenu');

  if (!button || !menu) return;

  // Page data (used for system share)
  const pageData = {
    url: window.location.href,
    title: document.title
  };

  // Menu controls
  function closeMenu() {
    menu.classList.remove('active');
    button.setAttribute('aria-expanded', 'false');
    button.focus();
  }

  function openMenu() {
    // Force reflow for mobile animation
    menu.style.transform = 'translateY(100%)';
    menu.offsetHeight; // reflow
    menu.classList.add('active');
    menu.style.transform = '';
    button.setAttribute('aria-expanded', 'true');
    
    // Focus first interactive element
    const firstInteractive = menu.querySelector('button');
    if (firstInteractive) firstInteractive.focus();
  }

  function toggleMenu() {
    if (menu.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  // Share button (custom menu)
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // System share button
  if (systemButton) {
    systemButton.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navigator.share) {
        navigator.share({
          title: pageData.title,
          url: pageData.url
        }).catch(console.log);
      } else {
        alert('System share is not available on this device.');
      }
    });
  }

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!menu.classList.contains('active')) return;

    const isClickOnButton = button.contains(e.target) || (systemButton && systemButton.contains(e.target));
    const isClickInsideMenu = menu.contains(e.target);

    if (!isClickOnButton && !isClickInsideMenu) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('active')) {
      closeMenu();
      e.preventDefault();
    }
  });

  // Close on focus out
  menu.addEventListener('focusout', () => {
    setTimeout(() => {
      if (!menu.classList.contains('active')) return;

      const activeElement = document.activeElement;
      const isFocusInside = menu.contains(activeElement);
      const isFocusOnButton = button.contains(activeElement) || (systemButton && systemButton.contains(activeElement));

      if (!isFocusInside && !isFocusOnButton) {
        closeMenu();
      }
    }, 0);
  });

  // Initialize Sharer.js for social media buttons
  if (typeof Sharer !== 'undefined' && Sharer.init) {
    Sharer.init();
  }

  // Initial state
  menu.classList.remove('active');
  button.setAttribute('aria-expanded', 'false');
})();