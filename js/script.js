document.addEventListener('DOMContentLoaded', () => {
  // --- Navbar Scroll Effect ---
  const navbar = document.querySelector('.navbar-monokai');
  const handleScrollNavbar = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScrollNavbar);
  handleScrollNavbar(); // Initial check

  // --- Scroll-to-Reveal Animation (Intersection Observer) ---
  const fadeElements = document.querySelectorAll('.fade-in');
  const fadeObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-visible');
        observer.unobserve(entry.target); // Animates only once
      }
    });
  }, fadeObserverOptions);

  fadeElements.forEach(el => fadeObserver.observe(el));

  // --- Back to Top Button ---
  const backToTopButton = document.getElementById('backToTop');
  const handleScrollBackToTop = () => {
    if (window.scrollY > 400) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  };
  window.addEventListener('scroll', handleScrollBackToTop);
  handleScrollBackToTop(); // Initial check

  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // --- Active Link Highlighting on Scroll (Scrollspy fallback) ---
  const sections = document.querySelectorAll('section, header');
  const scrollspyLinks = document.querySelectorAll('.navbar-monokai .nav-link');

  const handleScrollSpy = () => {
    let currentSectionId = '';
    const scrollPos = window.scrollY + 120; // offset for sticky navbar

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      scrollspyLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${currentSectionId}` || 
            (currentSectionId === 'hero' && href === '#') ||
            ((currentSectionId === 'work-experience' || currentSectionId === 'organization-experience') && href === '#experience')) {
          link.classList.add('active');
        }
      });
    }
  };
  window.addEventListener('scroll', handleScrollSpy);
  handleScrollSpy(); // Initial check

  // --- Smooth Scrolling for Navbar Links & Dropdown Items ---
  const scrollLinks = document.querySelectorAll('.navbar-monokai .nav-link, .navbar-monokai .dropdown-item');
  scrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');

      // If href is just #, scroll to top
      if (targetId === '#') {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        // Collapse mobile menu if open
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) {
          const toggler = document.querySelector('.navbar-toggler');
          toggler.click();
        }
        return;
      }

      if (targetId && targetId.startsWith('#')) {
        // If clicking parent Experience dropdown trigger, bypass scrolling
        if (targetId === '#experience') {
          return;
        }

        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          e.preventDefault();
          const offsetTop = targetSection.offsetTop - 80; // Offset for navbar height
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });

          // Close dropdown menu on link selection
          if (dropdownMenu && dropdownMenu.classList.contains('show')) {
            dropdownToggle.classList.remove('show');
            dropdownToggle.setAttribute('aria-expanded', 'false');
            dropdownMenu.classList.remove('show');
          }

          // Collapse mobile menu if open
          const navbarCollapse = document.querySelector('.navbar-collapse');
          if (navbarCollapse.classList.contains('show')) {
            const toggler = document.querySelector('.navbar-toggler');
            toggler.click();
          }
        }
      }
    });
  });

  // --- Dropdown Hover & Accessibility Behavior (Desktop & Mobile) ---
  const dropdownToggle = document.querySelector('.navbar-monokai .dropdown-toggle');
  const dropdownMenu = document.querySelector('.navbar-monokai .dropdown-menu-monokai');
  const dropdownContainer = document.querySelector('.navbar-monokai .dropdown');
  
  let hoverTimeout = null;

  const showDropdown = () => {
    if (window.innerWidth >= 992) {
      clearTimeout(hoverTimeout);
      dropdownToggle.classList.add('show');
      dropdownToggle.setAttribute('aria-expanded', 'true');
      dropdownMenu.classList.add('show');
    }
  };

  const hideDropdown = () => {
    if (window.innerWidth >= 992) {
      clearTimeout(hoverTimeout);
      hoverTimeout = setTimeout(() => {
        dropdownToggle.classList.remove('show');
        dropdownToggle.setAttribute('aria-expanded', 'false');
        dropdownMenu.classList.remove('show');
      }, 180); // 180ms delay to prevent flickering
    }
  };

  if (dropdownContainer && dropdownToggle && dropdownMenu) {
    dropdownContainer.addEventListener('mouseenter', showDropdown);
    dropdownContainer.addEventListener('mouseleave', hideDropdown);

    // Custom toggle triggers
    dropdownToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (window.innerWidth < 992) {
        // Mobile toggle behavior
        const isOpen = dropdownMenu.classList.contains('show');
        if (isOpen) {
          dropdownToggle.classList.remove('show');
          dropdownToggle.setAttribute('aria-expanded', 'false');
          dropdownMenu.classList.remove('show');
        } else {
          dropdownToggle.classList.add('show');
          dropdownToggle.setAttribute('aria-expanded', 'true');
          dropdownMenu.classList.add('show');
        }
      } else {
        // Desktop click: ensure it opens/remains open
        if (!dropdownMenu.classList.contains('show')) {
          showDropdown();
        }
      }
    });

    // Close when clicking outside dropdown container
    document.addEventListener('click', (event) => {
      if (!dropdownContainer.contains(event.target)) {
        clearTimeout(hoverTimeout);
        dropdownToggle.classList.remove('show');
        dropdownToggle.setAttribute('aria-expanded', 'false');
        dropdownMenu.classList.remove('show');
      }
    });

    // Keyboard Accessibility Support (Arrows & Escape)
    dropdownContainer.addEventListener('keydown', (e) => {
      const items = Array.from(dropdownMenu.querySelectorAll('.dropdown-item'));
      const activeElement = document.activeElement;
      const index = items.indexOf(activeElement);

      if (e.key === 'Escape') {
        clearTimeout(hoverTimeout);
        dropdownToggle.classList.remove('show');
        dropdownToggle.setAttribute('aria-expanded', 'false');
        dropdownMenu.classList.remove('show');
        dropdownToggle.focus();
      } else if (e.key === 'ArrowDown') {
        if (!dropdownMenu.classList.contains('show')) {
          dropdownToggle.classList.add('show');
          dropdownToggle.setAttribute('aria-expanded', 'true');
          dropdownMenu.classList.add('show');
          items[0].focus();
        } else if (index === -1) {
          items[0].focus();
        } else if (index < items.length - 1) {
          items[index + 1].focus();
        }
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        if (index > 0) {
          items[index - 1].focus();
        } else if (index === 0) {
          dropdownToggle.focus();
        }
        e.preventDefault();
      }
    });
  }

  // --- Gallery Lightbox Modal Setup ---
  const galleryModal = document.getElementById('galleryModal');
  if (galleryModal) {
    galleryModal.addEventListener('show.bs.modal', (event) => {
      const triggerLink = event.relatedTarget;
      const title = triggerLink.getAttribute('data-bs-title');
      const desc = triggerLink.getAttribute('data-bs-desc');
      
      const modalTitle = galleryModal.querySelector('#galleryModalLabel');
      const previewTitle = galleryModal.querySelector('#galleryPreviewTitle');
      const previewDesc = galleryModal.querySelector('#galleryPreviewDesc');
      
      modalTitle.textContent = title;
      previewTitle.textContent = title;
      previewDesc.textContent = desc;
    });
  }

  // --- Console Easter Egg ---
  console.log(
    '%cHello Developer! 👋%c\nIf you are inspecting this, you might be looking for a software developer intern. Let\'s build something together!\nEmail: oliviajsanusi@gmail.com',
    'color: #FF6188; font-size: 20px; font-weight: bold; font-family: monospace;',
    'color: #78DCE8; font-size: 14px; font-family: monospace;'
  );
});

