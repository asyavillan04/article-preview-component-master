(function() {
  "use strict";

  // Elements
  const button = document.querySelector('.shareButton');  
  const systemButton = document.querySelector('.systemShareButton'); 
  const menu = document.querySelector('.shareMenu');

  if (!button || !menu) return;

  // Page data
  const pageData = {
    url: window.location.href,
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.content || '',
    image: document.querySelector('meta[property="og:image"]')?.content || ''
  };

  // Dynamic links
  function updateShareLinks() {
    const encodedUrl = encodeURIComponent(pageData.url);
    const encodedTitle = encodeURIComponent(pageData.title);
    const encodedDescription = encodeURIComponent(pageData.description);
    const encodedImage = encodeURIComponent(pageData.image);

    const links = menu.querySelectorAll('a');
    links.forEach(link => {
      const aria = link.getAttribute('aria-label') || '';
      if (aria.includes('Facebook')) {
        link.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      } else if (aria.includes('X') || aria.includes('Twitter')) {
        link.href = `https://x.com/intent/post?url=${encodedUrl}&text=${encodedTitle}`;
      } else if (aria.includes('Pinterest')) {
        link.href = `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedDescription}`;
      }
    });
  }
  updateShareLinks();

  // Menu controls
  function closeMenu() {
    menu.classList.remove('active');
    button.setAttribute('aria-expanded', 'false');
    button.focus();
  }

  function openMenu() {
    menu.offsetHeight;
    menu.classList.add('active');
    menu.style.transform = '';
    button.setAttribute('aria-expanded', 'true');
    const firstLink = menu.querySelector('a');
    if (firstLink) firstLink.focus();
  }

  function toggleMenu() {
    if (menu.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  // Share button
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // System share
  if (systemButton) {
    systemButton.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navigator.share) {
        navigator.share({
          title: pageData.title,
          url: pageData.url
        }).catch(console.log);
      } else {
        alert('System menu is unavailable.');
      }
    });
  }

  // ========== CLOSE ON OUTSIDE CLICK ==========
  document.addEventListener('click', (e) => {
    if (!menu.classList.contains('active')) return;
    
    const isClickOnButton = button.contains(e.target) || (systemButton && systemButton.contains(e.target));
    const isClickInsideMenu = menu.contains(e.target);
    
    if (!isClickOnButton && !isClickInsideMenu) {
      closeMenu();
    }
  });

  // ========== CLOSE ON ESCAPE ==========
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('active')) {
      closeMenu();
      e.preventDefault();
    }
  });

  // ========== CLOSE ON FOCUS OUT ==========
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

  // Initialisation
  menu.classList.remove('active');
  button.setAttribute('aria-expanded', 'false');
})();