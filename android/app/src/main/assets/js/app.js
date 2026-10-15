/**
 * FoodLoop — Food Waste Reduction System
 * Core Application Logic & Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const AppState = {
    currentView: 'home',
    searchQuery: '',
    selectedCategory: 'all',
    selectedDietary: 'all',
    sortBy: 'deadline-asc',
    currentDonationToReserve: null,
    currentDonationToEdit: null,
    pendingClaimDonationId: null
  };

  // DOM Elements
  const DOM = {
    navLinks: document.querySelectorAll('.nav-link[data-view]'),
    appViews: document.querySelectorAll('.app-view'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    navLinksContainer: document.getElementById('navLinksContainer'),
    navAuthContainer: document.getElementById('navAuthContainer'),
    
    // Auth & Profile Elements
    authModal: document.getElementById('authModal'),
    profileModal: document.getElementById('profileModal'),
    tabRegisterBtn: document.getElementById('tabRegisterBtn'),
    tabSignInBtn: document.getElementById('tabSignInBtn'),
    registerForm: document.getElementById('registerForm'),
    signInForm: document.getElementById('signInForm'),
    demoLoginRecipientBtn: document.getElementById('demoLoginRecipientBtn'),
    demoLoginDonorBtn: document.getElementById('demoLoginDonorBtn'),
    roleCardRecipient: document.getElementById('roleCardRecipient'),
    roleCardDonor: document.getElementById('roleCardDonor'),
    profileModalAvatar: document.getElementById('profileModalAvatar'),
    profileModalName: document.getElementById('profileModalName'),
    profileModalRoleBadge: document.getElementById('profileModalRoleBadge'),
    profileModalId: document.getElementById('profileModalId'),
    profileModalEmail: document.getElementById('profileModalEmail'),
    profileModalPhone: document.getElementById('profileModalPhone'),
    profileModalOrg: document.getElementById('profileModalOrg'),
    profileModalCity: document.getElementById('profileModalCity'),
    profileLogoutBtn: document.getElementById('profileLogoutBtn'),
    profileGoBrowseBtn: document.getElementById('profileGoBrowseBtn'),
    profileGoDonateBtn: document.getElementById('profileGoDonateBtn'),
    
    // Browse view elements
    foodCardsGrid: document.getElementById('foodCardsGrid'),
    browseSearchInput: document.getElementById('browseSearchInput'),
    categoryPills: document.querySelectorAll('.cat-pill'),
    dietarySelect: document.getElementById('dietarySelect'),
    sortSelect: document.getElementById('sortSelect'),
    browseResultsCount: document.getElementById('browseResultsCount'),
    
    // Add Food Form elements
    addFoodForm: document.getElementById('addFoodForm'),
    foodNameInput: document.getElementById('foodNameInput'),
    categorySelect: document.getElementById('categorySelect'),
    dietaryRadio: document.querySelectorAll('input[name="dietary"]'),
    quantityInput: document.getElementById('quantityInput'),
    unitInput: document.getElementById('unitInput'),
    locationInput: document.getElementById('locationInput'),
    deadlineInput: document.getElementById('deadlineInput'),
    imageUrlInput: document.getElementById('imageUrlInput'),
    notesInput: document.getElementById('notesInput'),
    photoPills: document.querySelectorAll('.photo-pill'),
    detectLocationBtn: document.getElementById('detectLocationBtn'),
    
    // Live Preview elements
    previewCard: document.getElementById('previewCard'),
    prevImg: document.getElementById('prevImg'),
    prevTitle: document.getElementById('prevTitle'),
    prevCategory: document.getElementById('prevCategory'),
    prevQuantity: document.getElementById('prevQuantity'),
    prevLocation: document.getElementById('prevLocation'),
    prevDeadline: document.getElementById('prevDeadline'),

    // Reservations elements
    reservationsContainer: document.getElementById('reservationsContainer'),
    reservationsEmptyState: document.getElementById('reservationsEmptyState'),
    
    // My Donations elements
    myDonationsContainer: document.getElementById('myDonationsContainer'),
    myDonationsEmptyState: document.getElementById('myDonationsEmptyState'),

    // Modals
    reserveModal: document.getElementById('reserveModal'),
    reserveForm: document.getElementById('reserveForm'),
    reserveFoodName: document.getElementById('reserveFoodName'),
    reserveDonorName: document.getElementById('reserveDonorName'),
    reserveAvailableQty: document.getElementById('reserveAvailableQty'),
    reserveRecipientName: document.getElementById('reserveRecipientName'),
    reserveRecipientOrg: document.getElementById('reserveRecipientOrg'),
    
    editModal: document.getElementById('editModal'),
    editForm: document.getElementById('editForm'),
    editFoodId: document.getElementById('editFoodId'),
    editFoodName: document.getElementById('editFoodName'),
    editQuantity: document.getElementById('editQuantity'),
    editLocation: document.getElementById('editLocation'),
    editDeadline: document.getElementById('editDeadline'),

    // Reset Demo Data
    resetDemoBtn: document.getElementById('resetDemoBtn'),
    resetBannerBtn: document.getElementById('resetBannerBtn'),

    // Auth & Navigation Elements
    navAuthContainer: document.getElementById('navAuthWrapper') || document.getElementById('navAuthContainer'),
    navMyDonationsItem: document.getElementById('navMyDonationsItem'),

    // Toast Container
    toastContainer: document.getElementById('toastContainer')
  };

  // ==========================================================================
  // Router & View Controller
  // ==========================================================================
  function switchView(viewName, updateHash = true) {
    if (!viewName) viewName = 'home';
    
    DOM.appViews.forEach(view => {
      if (view.id === `view-${viewName}`) {
        view.classList.add('active-view');
      } else {
        view.classList.remove('active-view');
      }
    });

    DOM.navLinks.forEach(link => {
      if (link.getAttribute('data-view') === viewName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    AppState.currentView = viewName;
    if (updateHash) {
      window.location.hash = `#${viewName}`;
    }

    // Close mobile menu if open
    if (DOM.navLinksContainer) {
      DOM.navLinksContainer.classList.remove('mobile-open');
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // View-specific renders
    if (viewName === 'browse') {
      renderBrowseFood();
    } else if (viewName === 'dashboard') {
      updateDashboardStats();
      if (window.FoodLoopCharts) {
        window.FoodLoopCharts.renderAll();
      }
    } else if (viewName === 'reservations') {
      renderReservations();
    } else if (viewName === 'my-donations') {
      const user = window.FoodLoopData.getCurrentUser();
      if (!user) {
        openAuthModal('signin', 'Please register or sign in to view your donation listings.');
        switchView('home');
        return;
      }
      renderMyDonations();
    } else if (viewName === 'impact') {
      switchView('dashboard', updateHash);
      return;
    } else if (viewName === 'home') {
      updateDashboardStats();
    }
  }

  // Handle URL Hash navigation
  function handleHashChange() {
    const hash = window.location.hash.replace('#', '').trim();
    if (hash === 'impact') {
      switchView('dashboard', false);
    } else if (hash && document.getElementById(`view-${hash}`)) {
      switchView(hash, false);
    } else {
      switchView('home', false);
    }
  }

  window.addEventListener('hashchange', handleHashChange);

  // Bind Navbar Clicks
  DOM.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = link.getAttribute('data-view');
      switchView(targetView);
    });
  });

  // Mobile Menu Toggle
  if (DOM.mobileMenuBtn && DOM.navLinksContainer) {
    DOM.mobileMenuBtn.addEventListener('click', () => {
      DOM.navLinksContainer.classList.toggle('mobile-open');
    });
  }

  // Bind Hero Action Buttons
  document.querySelectorAll('[data-action-view]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-action-view');
      switchView(target);
    });
  });

  // ==========================================================================
  // Toast Notification System
  // ==========================================================================
  function showToast(message, type = 'info') {
    if (!DOM.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
    } else {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D9488" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    }

    toast.innerHTML = `
      ${iconSvg}
      <span>${message}</span>
    `;

    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // ==========================================================================
  // Formatted Date & Time Utilities
  // ==========================================================================
  function formatDeadlineTime(isoString) {
    if (!isoString) return 'Flexible';
    const date = new Date(isoString);
    const now = new Date();
    const diffHours = (date - now) / (1000 * 60 * 60);

    if (diffHours < 0) {
      return 'Expired (Past deadline)';
    } else if (diffHours < 1) {
      const minutes = Math.max(1, Math.round(diffHours * 60));
      return `Expiring in ${minutes}m!`;
    } else if (diffHours < 24) {
      return `Expiring in ${Math.round(diffHours)} hours`;
    } else {
      const days = Math.round(diffHours / 24);
      return `In ${days} day${days > 1 ? 's' : ''}`;
    }
  }

  function formatDateTimeLocal(date = new Date()) {
    const pad = (n) => String(n).padStart(2, '0');
    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const min = pad(date.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  }

  // ==========================================================================
  // Dashboard & Impact Statistics Updater
  // ==========================================================================
  function updateDashboardStats() {
    const stats = window.FoodLoopData.getStats();

    // Update numbers on Dashboard View
    const statElements = {
      'statTotalRescued': `${stats.totalRescuedKg} kg`,
      'statAvailable': stats.availableDonations,
      'statPendingPickups': stats.pendingPickups,
      'statCompleted': stats.completedDonations,
      'statMealsSaved': stats.totalMealsSaved.toLocaleString(),
      'statCo2Saved': `${stats.totalCo2Saved} kg`,
      // KPI grid mappings
      'kpiTotalRescued': `${stats.totalRescuedKg} kg`,
      'kpiMealsEquivalent': `~${stats.totalMealsSaved} Meals Provided`,
      'kpiActiveListings': stats.availableDonations,
      'kpiPendingPickups': stats.pendingPickups,
      'kpiCompletedRescues': stats.completedDonations,
      'kpiCo2Saved': `~${stats.totalCo2Saved} kg CO2 Prevented`,
      // Home page quick stats
      'homeHeroRescued': `${stats.totalRescuedKg} kg`,
      'homeHeroMeals': stats.totalMealsSaved.toLocaleString(),
      'homeHeroAvailable': stats.availableDonations,
      'homeHeroPending': stats.pendingPickups
    };

    Object.keys(statElements).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = statElements[id];
    });

    // Update badge counters on Nav
    const navAvailableBadge = document.getElementById('navAvailableBadge');
    if (navAvailableBadge) {
      navAvailableBadge.textContent = stats.availableDonations;
      navAvailableBadge.style.display = stats.availableDonations > 0 ? 'inline-block' : 'none';
    }

    const navPendingBadge = document.getElementById('navPendingBadge');
    if (navPendingBadge) {
      navPendingBadge.textContent = stats.pendingPickups;
      navPendingBadge.style.display = stats.pendingPickups > 0 ? 'inline-block' : 'none';
    }

    // Populate dashboard table
    renderDashboardActivityTable();

    // Refresh charts if on dashboard or impact view
    if ((AppState.currentView === 'dashboard' || AppState.currentView === 'impact') && window.FoodLoopCharts) {
      window.FoodLoopCharts.refresh();
    }
  }

  function updateImpactView() {
    updateDashboardStats();
    if (window.FoodLoopCharts) {
      window.FoodLoopCharts.refresh();
    }
  }

  // ==========================================================================
  // Browse Food View
  // ==========================================================================
  function renderBrowseFood() {
    if (!DOM.foodCardsGrid) return;

    let donations = window.FoodLoopData.getDonations();

    // Filter by Search Query
    if (AppState.searchQuery.trim() !== '') {
      const q = AppState.searchQuery.toLowerCase();
      donations = donations.filter(d => 
        d.name.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q) ||
        d.donorName.toLowerCase().includes(q) ||
        (d.notes && d.notes.toLowerCase().includes(q))
      );
    }

    // Filter by Category
    if (AppState.selectedCategory !== 'all') {
      donations = donations.filter(d => d.category === AppState.selectedCategory);
    }

    // Filter by Dietary
    if (AppState.selectedDietary !== 'all') {
      donations = donations.filter(d => d.dietary === AppState.selectedDietary);
    }

    // Sort listings
    if (AppState.sortBy === 'deadline-asc') {
      donations.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    } else if (AppState.sortBy === 'newest') {
      donations.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (AppState.sortBy === 'qty-desc') {
      donations.sort((a, b) => (b.quantity || 0) - (a.quantity || 0));
    }

    if (DOM.browseResultsCount) {
      DOM.browseResultsCount.textContent = `Showing ${donations.length} food listing${donations.length === 1 ? '' : 's'}`;
    }

    if (donations.length === 0) {
      DOM.foodCardsGrid.innerHTML = `
        <div class="col-span-full py-12 text-center" style="grid-column: 1 / -1; padding: 4rem 1rem; text-align: center;">
          <div style="width: 56px; height: 56px; border-radius: 50%; background: #ECFDF5; color: #10B981; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <h3 style="font-size: 1.35rem; font-weight: 700; color: #16345C; margin-bottom: 0.5rem;">No food listings found</h3>
          <p style="color: #64748B; max-width: 420px; margin: 0 auto 1.5rem;">Try adjusting your search criteria, or add a new food donation to help the community.</p>
          <button class="btn btn-primary" onclick="window.FoodLoopApp.navigateTo('add')">
            + Donate Food Now
          </button>
        </div>
      `;
      return;
    }

    DOM.foodCardsGrid.innerHTML = donations.map(d => {
      const isAvailable = d.status === 'Available';
      const deadlineText = formatDeadlineTime(d.deadline);
      const isUrgent = deadlineText.includes('m!') || deadlineText.includes('hours');

      let statusBadgeClass = 'status-available';
      if (d.status === 'Reserved') statusBadgeClass = 'status-reserved';
      else if (d.status === 'Picked Up') statusBadgeClass = 'status-picked-up';
      else if (d.status === 'Delivered') statusBadgeClass = 'status-delivered';

      return `
        <article class="food-card" data-id="${d.id}">
          <div class="food-card-media">
            <img 
              src="${d.image}" 
              alt="${d.name}" 
              class="food-card-img" 
              loading="lazy"
              onerror="this.onerror=null; this.src='${SAMPLE_IMAGES.fallback}';"
            />
            <span class="food-badge-category">${d.category}</span>
            <span class="food-badge-status ${statusBadgeClass}">${d.status}</span>
          </div>

          <div class="food-card-body">
            <h3 class="food-card-title">${d.name}</h3>
            
            <div class="food-card-donor">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>${d.donorName}</span>
              ${d.dietary ? `<span style="margin-left: auto; font-size: 0.75rem; background: #F1F5F9; color: #475569; padding: 0.15rem 0.5rem; border-radius: 999px;">${d.dietary}</span>` : ''}
            </div>

            <!-- Enhanced Badges: Distance, Portions, Verified -->
            <div class="card-quick-pills">
              <span class="card-pill-tag pill-distance">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                ${['1.2 km away', '0.8 km away', '2.4 km away', '1.7 km away', '3.1 km away'][Math.abs(d.id.charCodeAt(d.id.length - 1)) % 5]}
              </span>
              <span class="card-pill-tag pill-portions">👥 ~${d.mealsEst || Math.round(d.quantity * 2)} Meals</span>
              <span class="card-pill-tag pill-verified">🛡️ Safety Verified</span>
            </div>

            <div class="food-card-meta-list">
              <div class="meta-row">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>${d.location}</span>
              </div>
              <div class="meta-row">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span class="${isUrgent ? 'deadline-tag' : ''}">${deadlineText}</span>
              </div>
            </div>

            ${d.notes ? `<p style="font-size: 0.825rem; color: #64748B; margin-bottom: 1rem; line-height: 1.4;">${d.notes}</p>` : ''}

            <div class="food-card-footer">
              <div class="quantity-tag">
                ${d.quantity} <small>${d.unit}</small>
              </div>

              <div>
                ${isAvailable ? `
                  <button class="btn btn-primary btn-sm btn-reserve-trigger" data-donation-id="${d.id}">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                    Reserve Food
                  </button>
                ` : `
                  <button class="btn btn-secondary btn-sm" disabled style="opacity: 0.7; cursor: not-allowed;">
                    ${d.status}
                  </button>
                `}
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach Reserve button listeners
    document.querySelectorAll('.btn-reserve-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-donation-id');
        openReserveModal(id);
      });
    });
  }

  // Browse Search & Filters Binding
  if (DOM.browseSearchInput) {
    DOM.browseSearchInput.addEventListener('input', (e) => {
      AppState.searchQuery = e.target.value;
      renderBrowseFood();
    });
  }

  DOM.categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      DOM.categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      AppState.selectedCategory = pill.getAttribute('data-category');
      renderBrowseFood();
    });
  });

  if (DOM.dietarySelect) {
    DOM.dietarySelect.addEventListener('change', (e) => {
      AppState.selectedDietary = e.target.value;
      renderBrowseFood();
    });
  }

  if (DOM.sortSelect) {
    DOM.sortSelect.addEventListener('change', (e) => {
      AppState.sortBy = e.target.value;
      renderBrowseFood();
    });
  }

  // ==========================================================================
  // Authentication & User Profile Controller
  // ==========================================================================
  function renderNavAuthState() {
    const user = window.FoodLoopData.getCurrentUser();

    // Toggle My Donations visibility per user voice instruction:
    // "My Donations tab tab aana chahiye jab mai register kar chuka hoon, pehle nahi aana chahiye."
    const myDonItem = document.getElementById('navMyDonationsItem');
    if (myDonItem) {
      myDonItem.style.display = user ? 'inline-block' : 'none';
    }

    if (!DOM.navAuthContainer) return;

    if (!user) {
      DOM.navAuthContainer.innerHTML = `
        <button class="nav-auth-btn" id="openAuthModalBtn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          <span>Login / Register</span>
        </button>
      `;
      const btn = document.getElementById('openAuthModalBtn');
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          openAuthModal('register');
        });
      }
    } else {
      const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
      const roleLabel = user.role === 'donor' ? 'Donor' : 'Recipient';

      DOM.navAuthContainer.innerHTML = `
        <div class="user-profile-pill" id="userProfilePill" title="Click to view your FoodLoop ID & profile">
          <div class="user-avatar-badge">${initials}</div>
          <div class="user-info-text">
            <span class="user-name">${user.name}</span>
            <span class="user-role-tag">${roleLabel}</span>
          </div>
          <button class="btn-logout" id="navLogoutBtn" title="Sign Out">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </button>
        </div>
      `;

      const pill = document.getElementById('userProfilePill');
      if (pill) {
        pill.addEventListener('click', (e) => {
          if (e.target.closest('#navLogoutBtn')) return;
          openProfileModal();
        });
      }

      const navLogout = document.getElementById('navLogoutBtn');
      if (navLogout) {
        navLogout.addEventListener('click', (e) => {
          e.stopPropagation();
          handleLogout();
        });
      }
    }
  }

  function openAuthModal(defaultTab = 'register', message = '') {
    if (DOM.authModal) {
      DOM.authModal.classList.add('active');
      switchAuthTab(defaultTab);
      if (message) {
        showToast(message, 'info');
      }
    }
  }

  function closeAuthModal() {
    if (DOM.authModal) DOM.authModal.classList.remove('active');
  }

  function switchAuthTab(tab) {
    if (tab === 'register') {
      if (DOM.tabRegisterBtn) DOM.tabRegisterBtn.classList.add('active');
      if (DOM.tabSignInBtn) DOM.tabSignInBtn.classList.remove('active');
      if (DOM.registerForm) DOM.registerForm.classList.add('active');
      if (DOM.signInForm) DOM.signInForm.classList.remove('active');
    } else {
      if (DOM.tabSignInBtn) DOM.tabSignInBtn.classList.add('active');
      if (DOM.tabRegisterBtn) DOM.tabRegisterBtn.classList.remove('active');
      if (DOM.signInForm) DOM.signInForm.classList.add('active');
      if (DOM.registerForm) DOM.registerForm.classList.remove('active');
    }
  }

  function openProfileModal() {
    const user = window.FoodLoopData.getCurrentUser();
    if (!user) {
      openAuthModal('signin');
      return;
    }

    if (DOM.profileModalName) DOM.profileModalName.textContent = user.name;
    if (DOM.profileModalId) DOM.profileModalId.textContent = user.id;
    if (DOM.profileModalEmail) DOM.profileModalEmail.textContent = user.email || 'N/A';
    if (DOM.profileModalPhone) DOM.profileModalPhone.textContent = user.phone || 'N/A';
    if (DOM.profileModalOrg) DOM.profileModalOrg.textContent = user.org || 'Individual Beneficiary';
    if (DOM.profileModalCity) DOM.profileModalCity.textContent = user.city || 'India';

    if (DOM.profileModalAvatar) {
      DOM.profileModalAvatar.textContent = user.name ? user.name[0].toUpperCase() : 'U';
    }

    if (DOM.profileModalRoleBadge) {
      DOM.profileModalRoleBadge.textContent = user.role === 'donor' ? 'Food Donor' : 'Food Recipient';
      DOM.profileModalRoleBadge.style.background = user.role === 'donor' ? '#FEF3C7' : '#DCFCE7';
      DOM.profileModalRoleBadge.style.color = user.role === 'donor' ? '#92400E' : '#065F46';
    }

    if (DOM.profileModal) DOM.profileModal.classList.add('active');
  }

  function closeProfileModal() {
    if (DOM.profileModal) DOM.profileModal.classList.remove('active');
  }

  function handleLogout() {
    window.FoodLoopData.logoutUser();
    renderNavAuthState();
    closeProfileModal();
    showToast('You have been signed out successfully.', 'info');
  }

  // Setup Auth Events
  if (DOM.tabRegisterBtn) DOM.tabRegisterBtn.addEventListener('click', () => switchAuthTab('register'));
  if (DOM.tabSignInBtn) DOM.tabSignInBtn.addEventListener('click', () => switchAuthTab('signin'));

  // Role card toggle
  if (DOM.roleCardRecipient && DOM.roleCardDonor) {
    DOM.roleCardRecipient.addEventListener('click', () => {
      DOM.roleCardRecipient.classList.add('active');
      DOM.roleCardDonor.classList.remove('active');
      const radio = DOM.roleCardRecipient.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });

    DOM.roleCardDonor.addEventListener('click', () => {
      DOM.roleCardDonor.classList.add('active');
      DOM.roleCardRecipient.classList.remove('active');
      const radio = DOM.roleCardDonor.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  }

  // Demo 1-Click login buttons
  if (DOM.demoLoginRecipientBtn) {
    DOM.demoLoginRecipientBtn.addEventListener('click', () => {
      try {
        const u = window.FoodLoopData.loginUser('asha@shelter.org', 'password123');
        closeAuthModal();
        renderNavAuthState();
        showToast(`Signed in as ${u.name} (ID: ${u.id})!`, 'success');
        if (AppState.pendingClaimDonationId) {
          const pId = AppState.pendingClaimDonationId;
          AppState.pendingClaimDonationId = null;
          openReserveModal(pId);
        }
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }

  if (DOM.demoLoginDonorBtn) {
    DOM.demoLoginDonorBtn.addEventListener('click', () => {
      try {
        const u = window.FoodLoopData.loginUser('donor@dailybake.com', 'password123');
        closeAuthModal();
        renderNavAuthState();
        showToast(`Signed in as ${u.name} (ID: ${u.id})!`, 'success');
        if (AppState.pendingClaimDonationId) {
          const pId = AppState.pendingClaimDonationId;
          AppState.pendingClaimDonationId = null;
          openReserveModal(pId);
        }
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }

  // Register Form Submit (Simplified: Full Name, Mobile, Email, Area, Shelter, Password)
  if (DOM.registerForm) {
    DOM.registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('regName')?.value.trim();
      const phone = document.getElementById('regPhone')?.value.trim();
      const email = document.getElementById('regEmail')?.value.trim();
      const city = document.getElementById('regCity')?.value.trim();
      const org = document.getElementById('regOrg')?.value.trim();
      const password = document.getElementById('regPassword')?.value;
      const role = (org && (org.toLowerCase().includes('restaurant') || org.toLowerCase().includes('baker') || org.toLowerCase().includes('hotel'))) ? 'donor' : 'recipient';

      try {
        const newUser = window.FoodLoopData.registerUser({
          name, phone, email, city, organization: org, password, role
        });
        closeAuthModal();
        renderNavAuthState();
        showToast(`Account created! FoodLoop ID: ${newUser.id}. Welcome, ${newUser.name}!`, 'success');
        
        // If there was a pending food claim, immediately resume it!
        if (AppState.pendingClaimDonationId) {
          const pId = AppState.pendingClaimDonationId;
          AppState.pendingClaimDonationId = null;
          openReserveModal(pId);
        }
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }

  // Sign In Form Submit
  if (DOM.signInForm) {
    DOM.signInForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail')?.value.trim();
      const password = document.getElementById('loginPassword')?.value;

      try {
        const user = window.FoodLoopData.loginUser(email, password);
        closeAuthModal();
        renderNavAuthState();
        showToast(`Welcome back, ${user.name}! (ID: ${user.id})`, 'success');

        if (AppState.pendingClaimDonationId) {
          const pId = AppState.pendingClaimDonationId;
          AppState.pendingClaimDonationId = null;
          openReserveModal(pId);
        }
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }

  // Profile modal action buttons
  if (DOM.profileLogoutBtn) DOM.profileLogoutBtn.addEventListener('click', handleLogout);
  if (DOM.profileGoBrowseBtn) {
    DOM.profileGoBrowseBtn.addEventListener('click', () => {
      closeProfileModal();
      switchView('browse');
    });
  }
  if (DOM.profileGoDonateBtn) {
    DOM.profileGoDonateBtn.addEventListener('click', () => {
      closeProfileModal();
      switchView('add');
    });
  }

  // ==========================================================================
  // Reservation Modal & Handling
  // ==========================================================================
  function openReserveModal(donationId) {
    const donation = window.FoodLoopData.getDonationById(donationId);
    if (!donation) return;

    if (donation.status !== 'Available') {
      showToast(`This item has already been marked ${donation.status}.`, 'warning');
      return;
    }

    const currentUser = window.FoodLoopData.getCurrentUser();
    if (!currentUser) {
      AppState.pendingClaimDonationId = donationId;
      openAuthModal('register', 'Please register or sign in to generate your FoodLoop ID and claim food.');
      return;
    }

    AppState.currentDonationToReserve = donation;

    if (DOM.reserveFoodName) DOM.reserveFoodName.textContent = donation.name;
    if (DOM.reserveDonorName) DOM.reserveDonorName.textContent = donation.donorName;
    if (DOM.reserveAvailableQty) DOM.reserveAvailableQty.textContent = `${donation.quantity} ${donation.unit}`;

    if (DOM.reserveRecipientName) DOM.reserveRecipientName.value = currentUser.name;
    if (DOM.reserveRecipientOrg) DOM.reserveRecipientOrg.value = currentUser.org || 'Community Beneficiary';

    if (DOM.reserveModal) DOM.reserveModal.classList.add('active');
  }

  function closeReserveModal() {
    if (DOM.reserveModal) DOM.reserveModal.classList.remove('active');
    AppState.currentDonationToReserve = null;
  }

  document.querySelectorAll('.modal-close-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      closeReserveModal();
      closeEditModal();
      closeAuthModal();
      closeProfileModal();
    });
  });

  // Close modals when clicking outside on the backdrop overlay
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeReserveModal();
        closeEditModal();
        closeAuthModal();
        closeProfileModal();
      }
    });
  });

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeReserveModal();
      closeEditModal();
      closeAuthModal();
      closeProfileModal();
    }
  });

  if (DOM.reserveForm) {
    DOM.reserveForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!AppState.currentDonationToReserve) return;

      const recipientName = DOM.reserveRecipientName.value.trim();
      const recipientOrg = DOM.reserveRecipientOrg.value.trim();

      try {
        const newRes = window.FoodLoopData.createReservation(
          AppState.currentDonationToReserve.id,
          AppState.currentDonationToReserve.quantity,
          recipientName,
          recipientOrg
        );

        closeReserveModal();
        showToast(`Successfully reserved "${newRes.foodName}"! Pickup PIN: ${newRes.pickupCode}`, 'success');
        updateDashboardStats();
        
        // Redirect to Reservations view so user can advance status
        switchView('reservations');
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }

  // ==========================================================================
  // Reservations & Pickup/Delivery Management
  // ==========================================================================
  function renderReservations() {
    if (!DOM.reservationsContainer) return;

    const reservations = window.FoodLoopData.getReservations();

    if (reservations.length === 0) {
      if (DOM.reservationsEmptyState) DOM.reservationsEmptyState.style.display = 'block';
      DOM.reservationsContainer.innerHTML = '';
      return;
    }

    if (DOM.reservationsEmptyState) DOM.reservationsEmptyState.style.display = 'none';

    DOM.reservationsContainer.innerHTML = reservations.map(r => {
      const isReserved = r.status === 'Reserved';
      const isPickedUp = r.status === 'Picked Up';
      const isDelivered = r.status === 'Delivered';

      return `
        <article class="res-card" data-res-id="${r.id}">
          <div class="res-card-head">
            <div>
              <span class="food-badge-category" style="position: static; display: inline-block; margin-bottom: 0.4rem;">${r.category}</span>
              <h3 style="font-size: 1.35rem; font-weight: 800; color: #16345C;">${r.foodName}</h3>
              <p style="font-size: 0.875rem; color: #64748B;">Donor: <strong>${r.donorName}</strong> | Claimed for: <strong>${r.recipientOrg}</strong></p>
            </div>

            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div class="res-pin-badge" title="Show this code to donor at pickup">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <span>PIN: ${r.pickupCode}</span>
              </div>
              <span class="food-badge-status ${isReserved ? 'status-reserved' : isPickedUp ? 'status-picked-up' : 'status-delivered'}" style="position: static;">
                ${r.status}
              </span>
            </div>
          </div>

          <!-- Interactive Stepper with Delivery Vehicle / Scooter Indicator -->
          <div class="stepper-pipeline">
            <div class="stepper-pipeline-track">
              <div class="stepper-pipeline-fill" style="width: ${isDelivered ? '100%' : isPickedUp ? '66%' : isReserved ? '33%' : '0%'};"></div>
            </div>
            <div class="step-node completed">
              <div class="step-node-bubble">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span class="step-node-label">Donated</span>
            </div>
            <div class="step-node ${isReserved ? 'current' : 'completed'}">
              <div class="step-node-bubble">
                ${isReserved ? '●' : '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>'}
              </div>
              <span class="step-node-label">Reserved</span>
            </div>
            <div class="step-node ${isPickedUp ? 'current' : isDelivered ? 'completed' : ''}">
              <div class="step-node-bubble">
                ${isDelivered ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : isPickedUp ? '●' : '3'}
              </div>
              <span class="step-node-label">Picked Up</span>
            </div>
            <div class="step-node ${isDelivered ? 'completed' : ''}">
              <div class="step-node-bubble">
                ${isDelivered ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : '4'}
              </div>
              <span class="step-node-label">Delivered</span>
            </div>
          </div>

          <!-- Live Courier / Delivery Scooter Position Indicator -->
          <div style="display: flex; align-items: center; justify-content: flex-start; margin-top: -0.25rem; margin-bottom: 0.75rem;">
            ${isReserved ? `
              <div class="stepper-vehicle-badge pickup-pending">
                <span class="stepper-vehicle-icon">🛵</span>
                <span><strong>Courier Assigned</strong> &rarr; On the way to pickup at ${r.pickupLocation}</span>
              </div>
            ` : isPickedUp ? `
              <div class="stepper-vehicle-badge transit">
                <span class="stepper-vehicle-icon">🛵💨</span>
                <span><strong>In Transit to Destination</strong> &rarr; Delivering to ${r.recipientOrg}</span>
              </div>
            ` : `
              <div class="stepper-vehicle-badge delivered">
                <span class="stepper-vehicle-icon">🏁</span>
                <span><strong>Delivered Successfully</strong> &rarr; Handed over at ${r.recipientOrg}</span>
              </div>
            `}
          </div>

          <!-- Pickup Details & Action Buttons -->
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; padding-top: 0.75rem; border-top: 1px solid #E2E8F0;">
            <div style="display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.85rem; color: #475569;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span><strong>Pickup:</strong> ${r.pickupLocation}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                <span><strong>Quantity:</strong> ${r.quantity} ${r.unit} (~${r.mealsEst} meals)</span>
              </div>
            </div>

            <div class="action-status-btn-group">
              ${isReserved ? `
                <button class="btn btn-outline-teal btn-sm btn-pickup-action" data-res-id="${r.id}">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 16l4-4-4-4"/><path d="M20 12H8"/></svg>
                  Confirm Food Picked Up
                </button>
              ` : ''}

              ${isPickedUp ? `
                <button class="btn btn-primary btn-sm btn-deliver-action" data-res-id="${r.id}" style="background: linear-gradient(135deg, #10B981 0%, #047857 100%);">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  Mark as Delivered
                </button>
              ` : ''}

              ${isDelivered ? `
                <div style="display: flex; align-items: center; gap: 0.5rem; color: #047857; font-size: 0.875rem; font-weight: 700;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Delivered & Saved! (${r.weightKg} kg rescued)</span>
                </div>
              ` : ''}
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach Status Action Handlers
    document.querySelectorAll('.btn-pickup-action').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-res-id');
        try {
          window.FoodLoopData.updateReservationStatus(id, 'Picked Up');
          showToast('Status updated to Picked Up. Safe travels on delivery!', 'info');
          renderReservations();
          updateDashboardStats();
        } catch (e) {
          showToast(e.message, 'error');
        }
      });
    });

    document.querySelectorAll('.btn-deliver-action').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-res-id');
        try {
          const res = window.FoodLoopData.updateReservationStatus(id, 'Delivered');
          showToast(`Success! ${res.foodName} delivered! Community impact recorded.`, 'success');
          renderReservations();
          updateDashboardStats();
        } catch (e) {
          showToast(e.message, 'error');
        }
      });
    });
  }

  // ==========================================================================
  // Add Food Form & Dynamic Preview
  // ==========================================================================
  function updateLivePreview() {
    if (!DOM.prevTitle) return;

    const name = DOM.foodNameInput.value.trim() || 'Organic Artisan Bread & Rolls';
    const cat = DOM.categorySelect.value || 'Bakery';
    const qty = DOM.quantityInput.value.trim() || '12';
    const unit = DOM.unitInput.value.trim() || 'items';
    const loc = DOM.locationInput.value.trim() || '124 Market Street, Downtown';
    const deadline = DOM.deadlineInput.value;
    const imgUrl = DOM.imageUrlInput.value.trim() || SAMPLE_IMAGES.bakery;

    DOM.prevTitle.textContent = name;
    DOM.prevCategory.textContent = cat;
    DOM.prevQuantity.textContent = `${qty} ${unit}`;
    DOM.prevLocation.textContent = loc;
    DOM.prevDeadline.textContent = deadline ? formatDeadlineTime(deadline) : 'In 4 hours';
    DOM.prevImg.src = imgUrl;
  }

  // Bind live form inputs to update preview
  [
    DOM.foodNameInput,
    DOM.categorySelect,
    DOM.quantityInput,
    DOM.unitInput,
    DOM.locationInput,
    DOM.deadlineInput,
    DOM.imageUrlInput
  ].forEach(input => {
    if (input) {
      input.addEventListener('input', updateLivePreview);
      input.addEventListener('change', updateLivePreview);
    }
  });

  // Preset Photo Pills Click
  DOM.photoPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const preset = pill.getAttribute('data-preset');
      if (SAMPLE_IMAGES[preset] && DOM.imageUrlInput) {
        DOM.imageUrlInput.value = SAMPLE_IMAGES[preset];
        updateLivePreview();
        showToast(`Loaded ${preset} sample photo`, 'info');
      }
    });
  });

  // Mock GPS Detect Location
  if (DOM.detectLocationBtn && DOM.locationInput) {
    DOM.detectLocationBtn.addEventListener('click', () => {
      DOM.detectLocationBtn.disabled = true;
      DOM.detectLocationBtn.textContent = 'Detecting...';
      
      setTimeout(() => {
        const mockLocations = [
          '42 Green St, Downtown Hub',
          '18 Metro Plaza, Food Court',
          '77 Ocean Ave, West Community Hall',
          '105 University Ave, Student Union'
        ];
        const randomLoc = mockLocations[Math.floor(Math.random() * mockLocations.length)];
        DOM.locationInput.value = randomLoc;
        updateLivePreview();
        DOM.detectLocationBtn.disabled = false;
        DOM.detectLocationBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
          Current Location
        `;
        showToast(`Detected location: ${randomLoc}`, 'success');
      }, 500);
    });
  }

  // Set default deadline date-time (now + 5 hours)
  if (DOM.deadlineInput && !DOM.deadlineInput.value) {
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 5);
    DOM.deadlineInput.value = formatDateTimeLocal(futureDate);
    updateLivePreview();
  }

  // Add Food Form Submission
  if (DOM.addFoodForm) {
    DOM.addFoodForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = DOM.foodNameInput.value.trim();
      const category = DOM.categorySelect.value;
      const quantity = parseFloat(DOM.quantityInput.value);
      const unit = DOM.unitInput.value.trim();
      const location = DOM.locationInput.value.trim();
      const deadline = DOM.deadlineInput.value;
      const imageUrl = DOM.imageUrlInput.value.trim() || SAMPLE_IMAGES.fallback;
      const notes = DOM.notesInput.value.trim();

      let dietary = 'Vegetarian';
      DOM.dietaryRadio.forEach(radio => {
        if (radio.checked) dietary = radio.value;
      });

      // Basic validation
      if (!name || isNaN(quantity) || quantity <= 0 || !location || !deadline) {
        showToast('Please fill out all required fields with valid details.', 'error');
        return;
      }

      const weightKg = parseFloat((quantity * (category === 'Produce' ? 1.0 : 0.5)).toFixed(1));
      const mealsEst = Math.round(quantity * (category === 'Prepared Meals' ? 1.0 : 1.5));

      const newDonation = {
        id: 'fl-don-' + Date.now(),
        name: name,
        category: category,
        dietary: dietary,
        quantity: quantity,
        unit: unit,
        weightKg: weightKg,
        mealsEst: mealsEst,
        donorName: 'Demo User (Your Listing)',
        donorType: 'Community Donor',
        donorId: 'donor_me',
        isMyDonation: true,
        location: location,
        deadline: new Date(deadline).toISOString(),
        status: 'Available',
        image: imageUrl,
        notes: notes || 'Prepared with care for community rescue.',
        createdAt: new Date().toISOString()
      };

      window.FoodLoopData.addDonation(newDonation);
      showToast(`Success! "${name}" has been listed on FoodLoop.`, 'success');
      
      // Reset form
      DOM.addFoodForm.reset();
      const defaultFuture = new Date();
      defaultFuture.setHours(defaultFuture.getHours() + 5);
      DOM.deadlineInput.value = formatDateTimeLocal(defaultFuture);
      updateLivePreview();

      updateDashboardStats();

      // Navigate to Browse view to see newly added food card
      switchView('browse');
    });
  }

  // ==========================================================================
  // My Donations View (View, Edit, Cancel)
  // ==========================================================================
  function renderMyDonations() {
    if (!DOM.myDonationsContainer) return;

    const donations = window.FoodLoopData.getDonations();
    const myListings = donations.filter(d => d.isMyDonation === true || d.donorId === 'donor_me');

    if (myListings.length === 0) {
      if (DOM.myDonationsEmptyState) DOM.myDonationsEmptyState.style.display = 'block';
      DOM.myDonationsContainer.innerHTML = '';
      return;
    }

    if (DOM.myDonationsEmptyState) DOM.myDonationsEmptyState.style.display = 'none';

    DOM.myDonationsContainer.innerHTML = myListings.map(d => {
      let badgeClass = 'status-available';
      if (d.status === 'Reserved') badgeClass = 'status-reserved';
      else if (d.status === 'Picked Up') badgeClass = 'status-picked-up';
      else if (d.status === 'Delivered') badgeClass = 'status-delivered';

      return `
        <article class="res-card" data-my-id="${d.id}">
          <div class="res-card-head">
            <div style="display: flex; align-items: center; gap: 1rem;">
              <img src="${d.image}" alt="${d.name}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 12px;" onerror="this.onerror=null; this.src='${SAMPLE_IMAGES.fallback}';"/>
              <div>
                <span class="food-badge-category" style="position: static; display: inline-block; margin-bottom: 0.25rem;">${d.category}</span>
                <h3 style="font-size: 1.25rem; font-weight: 800; color: #16345C;">${d.name}</h3>
                <p style="font-size: 0.85rem; color: #64748B; display: flex; align-items: center; gap: 6px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span>${d.location} | Quantity: <strong>${d.quantity} ${d.unit}</strong></span>
                </p>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span class="food-badge-status ${badgeClass}" style="position: static;">${d.status}</span>
            </div>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; padding-top: 0.75rem; border-top: 1px solid #E2E8F0;">
            <div style="font-size: 0.85rem; color: #64748B; display: flex; align-items: center; gap: 6px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>Pickup Deadline: <strong>${formatDeadlineTime(d.deadline)}</strong></span>
            </div>

            <div style="display: flex; align-items: center; gap: 0.65rem;">
              <button class="btn btn-secondary btn-sm btn-edit-listing" data-edit-id="${d.id}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                Edit
              </button>
              <button class="btn btn-sm btn-cancel-listing" data-cancel-id="${d.id}" style="color: #EF4444; border: 1px solid #FEE2E2; background: #FEF2F2;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                Cancel
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach Edit and Cancel Handlers
    document.querySelectorAll('.btn-edit-listing').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-edit-id');
        openEditModal(id);
      });
    });

    document.querySelectorAll('.btn-cancel-listing').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-cancel-id');
        if (confirm('Are you sure you want to cancel and remove this donation listing?')) {
          window.FoodLoopData.deleteDonation(id);
          showToast('Listing cancelled and removed.', 'info');
          renderMyDonations();
          updateDashboardStats();
        }
      });
    });
  }

  function openEditModal(donationId) {
    const d = window.FoodLoopData.getDonationById(donationId);
    if (!d) return;

    AppState.currentDonationToEdit = d;
    if (DOM.editFoodId) DOM.editFoodId.value = d.id;
    if (DOM.editFoodName) DOM.editFoodName.value = d.name;
    if (DOM.editQuantity) DOM.editQuantity.value = d.quantity;
    if (DOM.editLocation) DOM.editLocation.value = d.location;
    if (DOM.editDeadline) {
      DOM.editDeadline.value = formatDateTimeLocal(new Date(d.deadline));
    }

    if (DOM.editModal) DOM.editModal.classList.add('active');
  }

  function closeEditModal() {
    if (DOM.editModal) DOM.editModal.classList.remove('active');
    AppState.currentDonationToEdit = null;
  }

  if (DOM.editForm) {
    DOM.editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!AppState.currentDonationToEdit) return;

      const updated = {
        id: AppState.currentDonationToEdit.id,
        name: DOM.editFoodName.value.trim(),
        quantity: parseFloat(DOM.editQuantity.value),
        location: DOM.editLocation.value.trim(),
        deadline: new Date(DOM.editDeadline.value).toISOString()
      };

      window.FoodLoopData.updateDonation(updated);
      closeEditModal();
      showToast('Donation details updated successfully!', 'success');
      renderMyDonations();
      updateDashboardStats();
    });
  }

  // ==========================================================================
  // Reset Demo Data Handling
  // ==========================================================================
  function handleResetDemo() {
    if (confirm('Reset demo data to initial realistic sample state? All test listings will be restored.')) {
      window.FoodLoopData.resetData();
      showToast('Demo data reset to default sample state.', 'info');
      updateDashboardStats();
      if (AppState.currentView === 'browse') renderBrowseFood();
      else if (AppState.currentView === 'reservations') renderReservations();
      else if (AppState.currentView === 'my-donations') renderMyDonations();
      else if (AppState.currentView === 'impact') updateImpactView();
    }
  }

  if (DOM.resetDemoBtn) DOM.resetDemoBtn.addEventListener('click', handleResetDemo);
  if (DOM.resetBannerBtn) DOM.resetBannerBtn.addEventListener('click', handleResetDemo);

  // Expose global helper for inline calls
  window.FoodLoopApp = {
    navigateTo(viewName) {
      switchView(viewName);
    },
    resetData() {
      handleResetDemo();
    }
  };

  // Initial App Startup
  handleHashChange();
  updateDashboardStats();
  renderNavAuthState();
});
