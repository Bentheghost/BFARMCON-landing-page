/**
 * BFARMCON LIMITED | FARMERS CONNECT (SOP v2.0)
 * Interactive Application Logic & Micro-Interactions
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Dark / Light Theme Switcher with LocalStorage Persistence
     ========================================================================== */
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const htmlRoot = document.documentElement;

  // Check saved preference or default to dark (matches video aesthetic)
  const savedTheme = localStorage.getItem('bfarmcon_theme') || 'dark';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('bfarmcon_theme', newTheme);
    });
  }

  /* ==========================================================================
     2. Typewriter Effect for Hero Motto (Matched to Video)
     ========================================================================== */
  const typingElement = document.getElementById('typingText');
  const wordsToType = [
    'Everyone.',
    'Smallholder Farmers.',
    'Corporate Off-takers.',
    'Food Processors.',
    'Rural Communities.'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeWriter() {
    if (!typingElement) return;

    const currentWord = wordsToType[wordIndex];

    if (isDeleting) {
      typingElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typingElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 110;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      // Pause at full word
      typingSpeed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % wordsToType.length;
      typingSpeed = 400;
    }

    setTimeout(typeWriter, typingSpeed);
  }

  typeWriter();

  /* ==========================================================================
     3. Animated Numbers Counter
     ========================================================================== */
  const counterElements = document.querySelectorAll('.counter-val');
  let countersAnimated = false;

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        counterElements.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-count'), 10);
          const duration = 1600;
          const stepTime = 30;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = target;
              clearInterval(timer);
            } else {
              counter.textContent = Math.floor(current);
            }
          }, stepTime);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const metricsSection = document.querySelector('.metrics-counter-section');
  if (metricsSection) {
    counterObserver.observe(metricsSection);
  }

  /* ==========================================================================
     4. Operational Compliance Progress Bars (Skill Bars from Video)
     ========================================================================== */
  const progressBars = document.querySelectorAll('.progress-bar-fill');
  let barsAnimated = false;

  const progressObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !barsAnimated) {
        barsAnimated = true;
        progressBars.forEach(bar => {
          const progress = bar.getAttribute('data-progress');
          bar.style.width = `${progress}%`;
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.2 });

  const aboutSection = document.querySelector('.about-section');
  if (aboutSection) {
    progressObserver.observe(aboutSection);
  }

  /* ==========================================================================
     5. On-Page SOP Interactive Tabs (SOP 1, SOP 2, SOP 3)
     ========================================================================== */
  const sopPills = document.querySelectorAll('.sop-tab-pill');
  const sopPanels = document.querySelectorAll('.sop-panel');
  if (sopPills.length > 0) {
    sopPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const targetId = pill.getAttribute('data-sop-target');
        sopPills.forEach(p => p.classList.remove('active'));
        sopPanels.forEach(panel => panel.classList.remove('active'));

        pill.classList.add('active');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  }

  /* ==========================================================================
     8. Stakeholder Intake Form & Role Selection
     ========================================================================== */
  const roleButtons = document.querySelectorAll('.role-btn');
  const selectedRoleInput = document.getElementById('selectedRoleInput');
  const stakeholderForm = document.getElementById('stakeholderInquiryForm');
  const formSuccessBanner = document.getElementById('formSuccessBanner');
  const submitBtn = document.getElementById('submitInquiryBtn');

  roleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      roleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const role = btn.getAttribute('data-role');
      if (selectedRoleInput) selectedRoleInput.value = role;
    });
  });

  if (stakeholderForm) {
    // Web3Forms direct email access key (configured for bfarmcon@gmail.com)
    const WEB3FORMS_ACCESS_KEY = '03cfcc63-f7f7-487b-a289-192a74dcdbc2';

    // Regional hub WhatsApp contact dispatch map
    const hubWhatsAppMap = {
      'Kaduna (Head Office)': '2348068716001',
      'Taraba Hub': '2347075453682',
      'Benue Hub': '2347086646772',
      'Niger Hub': '2347086268954',
      'All Hubs': '2348068716001'
    };

    const roleLabels = {
      'off-taker': 'Off-taker / Industrial Processor',
      'cooperative': 'Farmer Cooperative Lead',
      'finance': 'Trade Financier / Bank',
      'general': 'General Inquiry'
    };

    stakeholderForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Extract form values
      const roleKey = selectedRoleInput ? selectedRoleInput.value : 'off-taker';
      const roleText = roleLabels[roleKey] || roleKey;
      const name = (document.getElementById('contactName')?.value || '').trim();
      const email = (document.getElementById('contactEmail')?.value || '').trim();
      const phone = (document.getElementById('contactPhone')?.value || '').trim();
      const hub = document.getElementById('targetStateHub')?.value || 'Kaduna (Head Office)';
      const commodity = document.getElementById('commodityInterest')?.value || 'General Inquiry';
      const message = (document.getElementById('inquiryMessage')?.value || '').trim();

      // Target WhatsApp number based on regional selection (fallback to Kaduna HQ)
      const targetPhone = hubWhatsAppMap[hub] || '2348068716001';

      // Build structured message for WhatsApp
      const waText = 
`🌾 *NEW BFARMCON INQUIRY (Farmers Connect)*
━━━━━━━━━━━━━━━━━━━━
👤 *Contact:* ${name}
🏢 *Stakeholder:* ${roleText}
📞 *Phone / WhatsApp:* ${phone}
✉️ *Email:* ${email}
📍 *Target Hub:* ${hub}
📦 *Commodity/Service:* ${commodity}
━━━━━━━━━━━━━━━━━━━━
📝 *Specs / Message:*
${message}
━━━━━━━━━━━━━━━━━━━━
_Transmitted via bfarmcon website_`;

      const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(waText)}`;

      // Update button state during transmission
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>DISPATCHING EMAIL &amp; WHATSAPP...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
      }

      // Prepare payload for Web3Forms (delivers to bfarmcon@gmail.com)
      const emailPayload = {
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `🌾 New BFARMCON Inquiry: ${commodity} - ${name} (${hub})`,
        from_name: 'BFARMCON Farmers Connect Portal',
        stakeholder_name: name,
        stakeholder_role: roleText,
        email: email,
        phone: phone,
        regional_hub: hub,
        commodity_or_service: commodity,
        inquiry_details: message
      };

      // Asynchronously send to Web3Forms API
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(emailPayload)
      })
      .then(res => res.json())
      .catch(err => {
        console.warn('Web3Forms dispatch error:', err);
      })
      .finally(() => {
        // Reset submit button state
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span>SUBMIT INQUIRY &amp; CONNECT ON WHATSAPP</span> <i class="fa-brands fa-whatsapp"></i>`;
        }

        // Update fallback manual link in success banner
        const manualLink = document.getElementById('manualWhatsAppLink');
        if (manualLink) {
          manualLink.href = waUrl;
        }

        // Show confirmation banner
        if (formSuccessBanner) {
          formSuccessBanner.style.display = 'flex';
          formSuccessBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // Open WhatsApp chat in new tab/app
        try {
          window.open(waUrl, '_blank');
        } catch (e) {
          console.log('Direct popup prevented, link ready in banner');
        }

        // Reset the form
        stakeholderForm.reset();

        // Keep success banner visible for 20s
        setTimeout(() => {
          if (formSuccessBanner) formSuccessBanner.style.display = 'none';
        }, 20000);
      });
    });
  }

  /* ==========================================================================
     9. Mobile Navigation Drawer
     ========================================================================== */
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuToggle && mobileNavDrawer) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileNavDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  function closeMobileDrawer() {
    if (mobileNavDrawer) {
      mobileNavDrawer.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeMobileDrawer);
  mobileNavLinks.forEach(link => link.addEventListener('click', closeMobileDrawer));

  /* ==========================================================================
     10. Back to Top Button & Scroll Spy
     ========================================================================== */
  const backToTopBtn = document.getElementById('backToTopBtn');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Back to top visibility
    if (window.scrollY > 400) {
      if (backToTopBtn) backToTopBtn.classList.add('visible');
    } else {
      if (backToTopBtn) backToTopBtn.classList.remove('visible');
    }

    // Scroll spy for active navbar state
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});
