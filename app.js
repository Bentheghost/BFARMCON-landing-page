/**
 * BFARMCON LIMITED | Farmers Connect
 * Core Interactive Application Logic, Dynamic Role-Based Sourcing & Form Dispatch
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Dark / Light Theme Switcher with LocalStorage Persistence
     ========================================================================== */
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const htmlRoot = document.documentElement;

  // Check saved preference or default to dark theme
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
     2. Typewriter Effect for Hero Motto
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
     4. Operational Compliance Progress Bars (GAP/HACCP, Traceability, Logistics)
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
     5. Stakeholder Intake Form & Role Selection (Dynamic Commodity Mapping)
     ========================================================================== */
  const roleButtons = document.querySelectorAll('.role-btn');
  const selectedRoleInput = document.getElementById('selectedRoleInput');
  const stakeholderForm = document.getElementById('stakeholderInquiryForm');
  const formSuccessBanner = document.getElementById('formSuccessBanner');
  const submitBtn = document.getElementById('submitInquiryBtn');
  const submitBtnText = document.getElementById('submitBtnText');
  const submitBtnIcon = document.getElementById('submitBtnIcon');
  const channelButtons = document.querySelectorAll('.channel-btn');

  const commoditySelect = document.getElementById('commodityInterest');
  const commodityInterestLabel = document.getElementById('commodityInterestLabel');
  const customCommodityGroup = document.getElementById('customCommodityGroup');
  const customCommodityInput = document.getElementById('customCommodityInput');
  const inquiryMessageTextarea = document.getElementById('inquiryMessage');
  const inquiryMessageLabel = document.getElementById('inquiryMessageLabel');

  // Master product catalogue provided by client
  const baseCommodities = [
    'Rice',
    'Cowpea',
    'Yam',
    'Cassava',
    'Cashew Nut',
    'Cocoa',
    'Sesame',
    'Hibiscus Flower',
    'Ginger',
    'Chilli Pepper',
    'Turmeric',
    'Corn',
    'Millet',
    'Sorghum',
    'Soya Beans',
    'Groundnut'
  ];

  // Dynamic configuration tailored to each stakeholder role
  const roleCommodityConfig = {
    'off-taker': {
      label: '<i class="fa-solid fa-wheat-awn"></i> Commodities Available to Buy *',
      options: [
        ...baseCommodities.map(c => `${c} / Buy`),
        'Other Product (Specify Below)...'
      ],
      placeholder: 'Specify estimated purchase volume (e.g. 500 Metric Tons), quality specs/moisture limits, delivery factory destination, and required timeline...',
      messageLabel: 'Detailed Order Specs & Delivery Requirements *'
    },
    'cooperative': {
      label: '<i class="fa-solid fa-hand-holding-dollar"></i> Commodities Available to Sell / Supply *',
      options: [
        ...baseCommodities.map(c => `${c} / Sell`),
        'Other Product (Specify Below)...'
      ],
      placeholder: 'Specify available harvest/aggregation volume (e.g. 200 MT), cluster location, number of farming members, harvest readiness dates...',
      messageLabel: 'Cluster Supply Details & Harvest Specs *'
    },
    'finance': {
      label: '<i class="fa-solid fa-landmark"></i> Commodity / Scope for Trade Finance *',
      options: [
        ...baseCommodities.map(c => `${c} / Trade-Finance`),
        'Input Financing & Tripartite Escrow',
        'Other Facility / Commodity (Specify Below)...'
      ],
      placeholder: 'Specify target funding ticket size, credit tenure, participating cooperative/processor details, or escrow settlement terms...',
      messageLabel: 'Trade Finance Facility Requirements *'
    },
    'general': {
      label: '<i class="fa-solid fa-clipboard-list"></i> Service Scope / Area of Inquiry *',
      options: [
        'General Inquiry • ESG Advisory & Audits',
        'General Inquiry • Market Linkage & Spot Pricing',
        'General Inquiry • Food Safety & Standards (GAP/HACCP)',
        'General Inquiry • Local Buying Agency (LBA Operations)',
        'General Inquiry • Trade-Finance Linkage & Monitoring',
        'General Inquiry • Commodity Aggregation & Warehousing',
        'General Inquiry • Agribusiness Partnership / Advisory',
        'Other Inquiry (Specify Below)...'
      ],
      placeholder: 'Describe your question, partnership inquiry, or service scope requirements in detail...',
      messageLabel: 'Detailed Inquiry / Proposal *'
    }
  };

  function updateCommodityDropdown(roleKey) {
    if (!commoditySelect) return;
    const config = roleCommodityConfig[roleKey] || roleCommodityConfig['off-taker'];

    // Update field label
    if (commodityInterestLabel) {
      commodityInterestLabel.innerHTML = config.label;
    }

    // Update message placeholder & label
    if (inquiryMessageTextarea) {
      inquiryMessageTextarea.placeholder = config.placeholder;
    }
    if (inquiryMessageLabel) {
      inquiryMessageLabel.textContent = config.messageLabel;
    }

    // Populate select options
    commoditySelect.innerHTML = config.options.map(opt => {
      return `<option value="${opt}">${opt}</option>`;
    }).join('');

    // Check if custom commodity input should show
    handleCommodityChange();
  }

  function handleCommodityChange() {
    if (!commoditySelect || !customCommodityGroup) return;
    const val = commoditySelect.value || '';
    const isOther = val.toLowerCase().includes('other') || val.toLowerCase().includes('specify below');
    if (isOther) {
      customCommodityGroup.style.display = 'flex';
      if (customCommodityInput) {
        customCommodityInput.required = true;
        customCommodityInput.focus();
      }
    } else {
      customCommodityGroup.style.display = 'none';
      if (customCommodityInput) {
        customCommodityInput.required = false;
        customCommodityInput.value = '';
      }
    }
  }

  if (commoditySelect) {
    commoditySelect.addEventListener('change', handleCommodityChange);
  }

  // Handle role selection button clicks
  roleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      roleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const role = btn.getAttribute('data-role');
      if (selectedRoleInput) selectedRoleInput.value = role;
      updateCommodityDropdown(role);
    });
  });

  // Channel toggle interaction (Both / WhatsApp / Email)
  channelButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      channelButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const radio = btn.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;

      const channel = btn.getAttribute('data-channel');
      if (submitBtnText && submitBtnIcon) {
        if (channel === 'whatsapp') {
          submitBtnText.textContent = 'CONNECT DIRECTLY ON WHATSAPP';
          submitBtnIcon.className = 'fa-brands fa-whatsapp';
        } else if (channel === 'email') {
          submitBtnText.textContent = 'DISPATCH INQUIRY VIA EMAIL';
          submitBtnIcon.className = 'fa-regular fa-envelope';
        } else {
          submitBtnText.textContent = 'SUBMIT VIA WHATSAPP & EMAIL';
          submitBtnIcon.className = 'fa-solid fa-bolt';
        }
      }
    });
  });

  if (stakeholderForm) {
    // Web3Forms direct email access key (delivers to bfarmcon@gmail.com)
    const WEB3FORMS_ACCESS_KEY = '03cfcc63-f7f7-487b-a289-192a74dcdbc2';

    // Regional hub WhatsApp contact dispatch map
    const hubWhatsAppMap = {
      'Abuja Hub': '2348166982970',
      'Kaduna (Head Office)': '2348068716001',
      'Taraba Hub': '2347075453682',
      'Benue Hub': '2347086646772',
      'Niger Hub': '2347086268954',
      'All Hubs': '2348166982970'
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
      const hub = document.getElementById('targetStateHub')?.value || 'Abuja Hub';
      const rawCommodity = (document.getElementById('commodityInterest')?.value || 'General Inquiry').trim();
      const message = (document.getElementById('inquiryMessage')?.value || '').trim();
      const selectedChannel = document.querySelector('input[name="submission_channel"]:checked')?.value || 'both';

      // Check if user entered a custom commodity
      let commodity = rawCommodity;
      if (rawCommodity.toLowerCase().includes('other') || rawCommodity.toLowerCase().includes('specify below')) {
        const customVal = customCommodityInput ? customCommodityInput.value.trim() : '';
        if (customVal) {
          const actionSuffix = roleKey === 'off-taker' ? ' / Buy' : roleKey === 'cooperative' ? ' / Sell' : roleKey === 'finance' ? ' / Trade-Finance' : '';
          commodity = `${customVal}${actionSuffix} (Custom Entry)`;
        }
      }

      // Target WhatsApp number based on regional selection (fallback to Abuja / Kaduna)
      const targetPhone = hubWhatsAppMap[hub] || '2348166982970';

      // Build structured message for WhatsApp
      const waText = 
`🌾 *NEW BFARMCON INQUIRY*
━━━━━━━━━━━━━━━━━━━━
👤 *Contact:* ${name}
🏢 *Stakeholder:* ${roleText}
📞 *Phone / WhatsApp:* ${phone}
✉️ *Email:* ${email}
📍 *Target Hub:* ${hub}
📦 *Product/Service:* ${commodity}
━━━━━━━━━━━━━━━━━━━━
📝 *Specs / Message:*
${message}
━━━━━━━━━━━━━━━━━━━━
_Transmitted via BFARMCON Website_`;

      const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(waText)}`;

      // Update button state during transmission
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>PROCESSING SUBMISSION...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
      }

      function resetSubmitButton() {
        if (submitBtn) {
          submitBtn.disabled = false;
          if (selectedChannel === 'whatsapp') {
            submitBtn.innerHTML = `<span>CONNECT DIRECTLY ON WHATSAPP</span> <i class="fa-brands fa-whatsapp"></i>`;
          } else if (selectedChannel === 'email') {
            submitBtn.innerHTML = `<span>DISPATCH INQUIRY VIA EMAIL</span> <i class="fa-regular fa-envelope"></i>`;
          } else {
            submitBtn.innerHTML = `<span>SUBMIT VIA WHATSAPP &amp; EMAIL</span> <i class="fa-solid fa-bolt"></i>`;
          }
        }
      }

      function showConfirmation(title, text, showWaLink = true) {
        if (formSuccessBanner) {
          const bannerTitle = document.getElementById('successBannerTitle');
          const bannerMsg = document.getElementById('successBannerMsg');
          if (bannerTitle) bannerTitle.textContent = title;
          if (bannerMsg) {
            bannerMsg.innerHTML = `${text} ${showWaLink ? `<br><a href="${waUrl}" target="_blank" class="banner-chat-link"><i class="fa-brands fa-whatsapp"></i> Click here to open WhatsApp chat</a>` : ''}`;
          }
          formSuccessBanner.style.display = 'flex';
          formSuccessBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

          setTimeout(() => {
            if (formSuccessBanner) formSuccessBanner.style.display = 'none';
          }, 25000);
        }
      }

      // 1. WhatsApp Only
      if (selectedChannel === 'whatsapp') {
        try {
          window.open(waUrl, '_blank');
        } catch (err) {
          console.log('Popup blocked');
        }
        showConfirmation(
          'Connecting to WhatsApp...',
          `Your inquiry for <strong>${commodity}</strong> is loaded for direct messaging with <strong>${hub}</strong>.`
        );
        stakeholderForm.reset();
        updateCommodityDropdown(roleKey);
        resetSubmitButton();
        return;
      }

      // 2. Email Only or Both -> Prepare Email Payload for Web3Forms
      const emailPayload = {
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `🌾 New BFARMCON Inquiry: ${commodity} - ${name} (${hub})`,
        from_name: 'BFARMCON Portal Desk',
        stakeholder_name: name,
        stakeholder_role: roleText,
        email: email,
        phone: phone,
        regional_hub: hub,
        commodity_or_service: commodity,
        submission_channel: selectedChannel,
        inquiry_details: message
      };

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(emailPayload)
      })
      .then(res => res.json())
      .then(data => {
        console.log('Dispatch success:', data);
      })
      .catch(err => {
        console.warn('Web3Forms dispatch error:', err);
      })
      .finally(() => {
        if (selectedChannel === 'both') {
          try {
            window.open(waUrl, '_blank');
          } catch (e) {
            console.log('Direct popup prevented');
          }
          showConfirmation(
            'Inquiry Dispatched via Email & WhatsApp!',
            `A copy for <strong>${commodity}</strong> has been delivered to <strong>bfarmcon@gmail.com</strong> and dispatched to WhatsApp.`
          );
        } else {
          showConfirmation(
            'Inquiry Emailed Successfully!',
            `Your inquiry for <strong>${commodity}</strong> has been delivered directly to <strong>bfarmcon@gmail.com</strong>. Our team will contact you shortly.`,
            false
          );
        }

        stakeholderForm.reset();
        updateCommodityDropdown(roleKey);
        resetSubmitButton();
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

  /* ========================================================================
     11. Draggable WhatsApp Quick-Trade Desk Button
     ======================================================================== */
  const floatingWhatsAppDesk = document.getElementById('floatingWhatsAppDesk');

  if (floatingWhatsAppDesk) {
    const savedPosition = localStorage.getItem('bfarmcon_whatsapp_position');
    let dragState = null;

    if (savedPosition) {
      try {
        const position = JSON.parse(savedPosition);
        floatingWhatsAppDesk.style.left = `${position.left}px`;
        floatingWhatsAppDesk.style.top = `${position.top}px`;
        floatingWhatsAppDesk.style.right = 'auto';
        floatingWhatsAppDesk.style.bottom = 'auto';
      } catch (error) {
        localStorage.removeItem('bfarmcon_whatsapp_position');
      }
    }

    floatingWhatsAppDesk.addEventListener('pointerdown', event => {
      const rect = floatingWhatsAppDesk.getBoundingClientRect();
      dragState = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top,
        moved: false
      };
      floatingWhatsAppDesk.setPointerCapture(event.pointerId);
      floatingWhatsAppDesk.classList.add('is-dragging');
    });

    floatingWhatsAppDesk.addEventListener('pointermove', event => {
      if (!dragState || event.pointerId !== dragState.pointerId) return;

      const movedX = Math.abs(event.clientX - dragState.startX);
      const movedY = Math.abs(event.clientY - dragState.startY);
      if (movedX > 4 || movedY > 4) dragState.moved = true;
      if (!dragState.moved) return;

      const maxLeft = window.innerWidth - floatingWhatsAppDesk.offsetWidth;
      const maxTop = window.innerHeight - floatingWhatsAppDesk.offsetHeight;
      const left = Math.min(Math.max(event.clientX - dragState.offsetX, 0), maxLeft);
      const top = Math.min(Math.max(event.clientY - dragState.offsetY, 0), maxTop);

      floatingWhatsAppDesk.style.left = `${left}px`;
      floatingWhatsAppDesk.style.top = `${top}px`;
      floatingWhatsAppDesk.style.right = 'auto';
      floatingWhatsAppDesk.style.bottom = 'auto';
    });

    floatingWhatsAppDesk.addEventListener('pointerup', event => {
      if (!dragState || event.pointerId !== dragState.pointerId) return;

      if (dragState.moved) {
        event.preventDefault();
        floatingWhatsAppDesk.dataset.wasDragged = 'true';
        localStorage.setItem('bfarmcon_whatsapp_position', JSON.stringify({
          left: floatingWhatsAppDesk.offsetLeft,
          top: floatingWhatsAppDesk.offsetTop
        }));
      }

      floatingWhatsAppDesk.classList.remove('is-dragging');
      floatingWhatsAppDesk.releasePointerCapture(event.pointerId);
      dragState = null;
    });

    floatingWhatsAppDesk.addEventListener('click', event => {
      if (floatingWhatsAppDesk.dataset.wasDragged === 'true') {
        event.preventDefault();
        delete floatingWhatsAppDesk.dataset.wasDragged;
      }
    });

    floatingWhatsAppDesk.addEventListener('pointercancel', () => {
      floatingWhatsAppDesk.classList.remove('is-dragging');
      dragState = null;
    });
  }

});
