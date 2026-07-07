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
  const navLinks = document.querySelectorAll('.navbar-monokai .nav-link');
  
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
      navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${currentSectionId}` || (currentSectionId === 'hero' && href === '#')) {
          link.classList.add('active');
        }
      });
    }
  };
  window.addEventListener('scroll', handleScrollSpy);
  handleScrollSpy(); // Initial check

  // --- Smooth Scrolling for Navbar Links ---
  navLinks.forEach(link => {
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

      if (targetId.startsWith('#')) {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          e.preventDefault();
          const offsetTop = targetSection.offsetTop - 80; // Offset for navbar height
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });

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

  // --- Projects Slider Navigation ---
  const slider = document.getElementById('projectsSlider');
  const btnPrev = document.getElementById('sliderPrev');
  const btnNext = document.getElementById('sliderNext');

  if (slider && btnPrev && btnNext) {
    btnPrev.addEventListener('click', () => {
      const slideWidth = slider.querySelector('.project-slide').offsetWidth + 24;
      slider.scrollBy({ left: -slideWidth, behavior: 'smooth' });
    });

    btnNext.addEventListener('click', () => {
      const slideWidth = slider.querySelector('.project-slide').offsetWidth + 24;
      slider.scrollBy({ left: slideWidth, behavior: 'smooth' });
    });
  }

  // --- Console Easter Egg ---
  console.log(
    '%cHello Developer! 👋%c\nIf you are inspecting this, you might be looking for a software developer intern. Let\'s build something together!\nEmail: alex.rivera@example.com',
    'color: #FF6188; font-size: 20px; font-weight: bold; font-family: monospace;',
    'color: #78DCE8; font-size: 14px; font-family: monospace;'
  );
});
