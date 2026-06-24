document.addEventListener('DOMContentLoaded', () => {
  // --- Navigation Scroll Effect ---
  const navbar = document.querySelector('.navbar');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check on init

  // --- Mobile Navigation Toggle ---
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
  }

  // Close mobile nav when link is clicked
  const navItems = document.querySelectorAll('.nav-link');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      if (mobileToggle) mobileToggle.classList.remove('open');
      if (navLinks) navLinks.classList.remove('open');
    });
  });

  // --- Scroll Active Nav Link Highlight ---
  const sections = document.querySelectorAll('section');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');
        navItems.forEach(item => {
          if (item.getAttribute('href') === `#${activeId}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => navObserver.observe(section));

  // --- Reveal on Scroll ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // If it's a skills card, trigger skill bars animation
        if (entry.target.classList.contains('skills-card')) {
          animateSkillBars(entry.target);
        }
      }
    });
  }, {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Skill Bars Animation Function ---
  function animateSkillBars(card) {
    const bars = card.querySelectorAll('.skill-bar-fill');
    bars.forEach(bar => {
      const targetPercent = bar.getAttribute('data-percent');
      bar.style.width = targetPercent;
    });
  }

  // --- Project Grid Filtering ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // --- Contact Form Submission ---
  const contactForm = document.getElementById('contactForm');
  const formToast = document.getElementById('formToast');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Get values for feedback
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;

      if (!name || !email || !message) return;

      // Disable inputs & submit button during loading state simulation
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';

      setTimeout(() => {
        // Hide spinner and display success
        submitBtn.innerHTML = 'Message Sent! <i class="fas fa-check"></i>';
        submitBtn.style.backgroundColor = '#10B981'; // Green accent success
        submitBtn.style.borderColor = '#10B981';

        // Display toast message
        if (formToast) {
          formToast.style.display = 'flex';
          formToast.querySelector('.toast-name').textContent = name;
        }

        // Reset form after a delay
        setTimeout(() => {
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
          submitBtn.style.backgroundColor = '';
          submitBtn.style.borderColor = '';
          
          if (formToast) {
            formToast.style.animation = 'slide-out 0.3s ease forwards';
            setTimeout(() => {
              formToast.style.display = 'none';
              formToast.style.animation = '';
            }, 300);
          }
        }, 4000);

      }, 1500);
    });
  }
});
