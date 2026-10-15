/**
 * FoodLoop — Food Waste Reduction System
 * Initial Demo Data & LocalStorage Management
 */

const STORAGE_KEYS = {
  DONATIONS: 'foodloop_donations_v1',
  RESERVATIONS: 'foodloop_reservations_v1',
  STATS: 'foodloop_stats_v1',
  USER: 'foodloop_current_user_v1',
  USERS: 'foodloop_registered_users_v1'
};

// Reliable high-quality Unsplash food photography with curated URLs
const SAMPLE_IMAGES = {
  bakery: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
  produce: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80',
  prepared: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  dairy: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
  fruits: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
  sandwiches: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
  pasta: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
  fallback: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80'
};

// Helper for relative timestamps (e.g., today + hours)
function getFutureISO(hoursAhead) {
  const d = new Date();
  d.setHours(d.getHours() + hoursAhead);
  return d.toISOString();
}

function getPastISO(hoursAgo) {
  const d = new Date();
  d.setHours(d.getHours() - hoursAgo);
  return d.toISOString();
}

// Initial realistic dataset
const INITIAL_DONATIONS = [
  {
    id: 'fl-don-101',
    name: 'Artisan Sourdough & Pastry Assortment',
    category: 'Bakery',
    dietary: 'Vegetarian',
    quantity: 18,
    unit: 'items (~9 kg)',
    weightKg: 9.0,
    mealsEst: 20,
    donorName: 'The Daily Bakehouse',
    donorType: 'Bakery & Cafe',
    donorId: 'donor_me', // created by user in demo
    isMyDonation: true,
    location: '42 Green St, Downtown Market',
    deadline: getFutureISO(4),
    status: 'Available', // Available | Reserved | Picked Up | Delivered | Cancelled
    image: SAMPLE_IMAGES.bakery,
    notes: 'Baked fresh at 5:00 AM. Includes rustic sourdough loaves, croissants, and blueberry brioche.',
    createdAt: getPastISO(2)
  },
  {
    id: 'fl-don-102',
    name: 'Fresh Organic Farm Harvest Box',
    category: 'Produce',
    dietary: 'Vegan',
    quantity: 15,
    unit: 'kg',
    weightKg: 15.0,
    mealsEst: 32,
    donorName: 'Sun Valley Organic Farm Stand',
    donorType: 'Produce Market',
    donorId: 'donor_farm',
    isMyDonation: false,
    location: '88 Riverbed Road, North Pavilion',
    deadline: getFutureISO(7),
    status: 'Available',
    image: SAMPLE_IMAGES.produce,
    notes: 'Crisp romaine lettuce, rainbow carrots, radishes, and organic kale. Washed and packed in crates.',
    createdAt: getPastISO(3)
  },
  {
    id: 'fl-don-103',
    name: 'Gourmet Roasted Veggie Lasagna Trays',
    category: 'Prepared Meals',
    dietary: 'Vegetarian',
    quantity: 24,
    unit: 'portions (~12 kg)',
    weightKg: 12.0,
    mealsEst: 24,
    donorName: 'Bistro Verde Catering Co.',
    donorType: 'Commercial Kitchen',
    donorId: 'donor_bistro',
    isMyDonation: false,
    location: '15 Crescent Ave, Culinary Hall',
    deadline: getFutureISO(3),
    status: 'Available',
    image: SAMPLE_IMAGES.pasta,
    notes: 'Chilled catering surplus from private lunchtime banquet. Kept under commercial refrigeration at 3°C.',
    createdAt: getPastISO(1)
  },
  {
    id: 'fl-don-104',
    name: 'Organic Oat Milk & Greek Yogurt Crates',
    category: 'Dairy & Groceries',
    dietary: 'Vegetarian',
    quantity: 20,
    unit: 'units (~10 kg)',
    weightKg: 10.0,
    mealsEst: 25,
    donorName: 'Metro Fresh Supermarket',
    donorType: 'Supermarket',
    donorId: 'donor_metro',
    isMyDonation: false,
    location: '120 Central Boulevard, Bay 4',
    deadline: getFutureISO(22),
    status: 'Available',
    image: SAMPLE_IMAGES.dairy,
    notes: 'Surplus cold stock. Best-by date is in 3 days. High nutritional density, great for community pantries.',
    createdAt: getPastISO(5)
  },
  {
    id: 'fl-don-105',
    name: 'Seasonal Citrus & Sweet Apple Crates',
    category: 'Produce',
    dietary: 'Vegan',
    quantity: 30,
    unit: 'kg',
    weightKg: 30.0,
    mealsEst: 65,
    donorName: 'Orchard Express Hub',
    donorType: 'Wholesale Depot',
    donorId: 'donor_orchard',
    isMyDonation: false,
    location: '5 Logistics Way, Cold Storage B',
    deadline: getFutureISO(28),
    status: 'Available',
    image: SAMPLE_IMAGES.fruits,
    notes: 'Sweet Valencia oranges and Fuji apples. Premium eating quality, boxed in 10kg easy-carry cartons.',
    createdAt: getPastISO(8)
  },
  {
    id: 'fl-don-106',
    name: 'Artisan Ciabatta Sandwiches & Wraps',
    category: 'Prepared Meals',
    dietary: 'Vegetarian',
    quantity: 16,
    unit: 'boxes (~7 kg)',
    weightKg: 7.0,
    mealsEst: 16,
    donorName: 'Corner Deli & Espresso',
    donorType: 'Cafe',
    donorId: 'donor_me',
    isMyDonation: true,
    location: '74 Campus Promenade, Suite 102',
    deadline: getFutureISO(5),
    status: 'Reserved',
    image: SAMPLE_IMAGES.sandwiches,
    notes: 'Assorted roasted pepper & mozzarella ciabatta sandwiches individually packed with napkin and compostable wrap.',
    createdAt: getPastISO(4)
  },
  {
    id: 'fl-don-107',
    name: 'Mediterranean Quinoa Salad Bowls',
    category: 'Prepared Meals',
    dietary: 'Vegan',
    quantity: 12,
    unit: 'bowls (~6 kg)',
    weightKg: 6.0,
    mealsEst: 12,
    donorName: 'Harvest Health Kitchen',
    donorType: 'Restaurant',
    donorId: 'donor_harvest',
    isMyDonation: false,
    location: '310 Pine Street, Kitchen Dock',
    deadline: getFutureISO(2),
    status: 'Picked Up',
    image: SAMPLE_IMAGES.prepared,
    notes: 'Wholesome quinoa, chickpeas, cherry tomatoes, and tahini dressing. Pre-portioned in sealed eco-containers.',
    createdAt: getPastISO(6)
  },
  {
    id: 'fl-don-108',
    name: 'Wholesale French Baguettes & Rolls',
    category: 'Bakery',
    dietary: 'Vegetarian',
    quantity: 25,
    unit: 'loaves (~8 kg)',
    weightKg: 8.0,
    mealsEst: 22,
    donorName: 'The Daily Bakehouse',
    donorType: 'Bakery',
    donorId: 'donor_me',
    isMyDonation: true,
    location: '42 Green St, Downtown Market',
    deadline: getPastISO(1),
    status: 'Delivered',
    image: SAMPLE_IMAGES.bakery,
    notes: 'Completed delivery to St. Jude Family Shelter earlier today.',
    createdAt: getPastISO(12)
  }
];

// Initial demo reservations linking to the sample donations
const INITIAL_RESERVATIONS = [
  {
    id: 'res-901',
    donationId: 'fl-don-106',
    foodName: 'Artisan Ciabatta Sandwiches & Wraps',
    category: 'Prepared Meals',
    quantity: 16,
    unit: 'boxes (~7 kg)',
    weightKg: 7.0,
    mealsEst: 16,
    reservedBy: 'Adarsh (Demo Volunteer / Hope Kitchen)',
    recipientOrg: 'Hope Street Community Pantry',
    pickupLocation: '74 Campus Promenade, Suite 102',
    donorName: 'Corner Deli & Espresso',
    deadline: getFutureISO(5),
    reservedAt: getPastISO(2),
    pickedUpAt: null,
    deliveredAt: null,
    status: 'Reserved', // Reserved -> Picked Up -> Delivered
    pickupCode: 'FL-6821',
    contactPhone: '+1 (555) 321-9988'
  },
  {
    id: 'res-902',
    donationId: 'fl-don-107',
    foodName: 'Mediterranean Quinoa Salad Bowls',
    category: 'Prepared Meals',
    quantity: 12,
    unit: 'bowls (~6 kg)',
    weightKg: 6.0,
    mealsEst: 12,
    reservedBy: 'Sarah Jenkins (FoodLoop Courier)',
    recipientOrg: 'Downtown Youth Haven',
    pickupLocation: '310 Pine Street, Kitchen Dock',
    donorName: 'Harvest Health Kitchen',
    deadline: getFutureISO(2),
    reservedAt: getPastISO(4),
    pickedUpAt: getPastISO(1),
    deliveredAt: null,
    status: 'Picked Up',
    pickupCode: 'FL-4402',
    contactPhone: '+1 (555) 789-2341'
  },
  {
    id: 'res-903',
    donationId: 'fl-don-108',
    foodName: 'Wholesale French Baguettes & Rolls',
    category: 'Bakery',
    quantity: 25,
    unit: 'loaves (~8 kg)',
    weightKg: 8.0,
    mealsEst: 22,
    reservedBy: 'Marcus Vance',
    recipientOrg: 'St. Jude Family Shelter',
    pickupLocation: '42 Green St, Downtown Market',
    donorName: 'The Daily Bakehouse',
    deadline: getPastISO(1),
    reservedAt: getPastISO(8),
    pickedUpAt: getPastISO(5),
    deliveredAt: getPastISO(1),
    status: 'Delivered',
    pickupCode: 'FL-1190',
    contactPhone: '+1 (555) 456-1122'
  }
];

// Historical aggregate baseline for impressive realistic impact stats
const BASELINE_METRICS = {
  historicalKgRescued: 142.5,
  historicalMealsServed: 310,
  historicalCo2SavedKg: 270.8,
  partnerShelters: 14,
  activeVolunteers: 48
};

// Data service helpers
const DataService = {
  getDonations() {
    const raw = localStorage.getItem(STORAGE_KEYS.DONATIONS);
    if (!raw) {
      this.resetData();
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.DONATIONS));
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error('Error parsing stored donations:', e);
      return INITIAL_DONATIONS;
    }
  },

  saveDonations(donations) {
    localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(donations));
  },

  getReservations() {
    const raw = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    if (!raw) {
      this.resetData();
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.RESERVATIONS));
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error('Error parsing stored reservations:', e);
      return INITIAL_RESERVATIONS;
    }
  },

  saveReservations(reservations) {
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
  },

  getDonationById(id) {
    const list = this.getDonations();
    return list.find(d => d.id === id);
  },

  addDonation(newDonation) {
    const donations = this.getDonations();
    donations.unshift(newDonation);
    this.saveDonations(donations);
    return newDonation;
  },

  updateDonation(updatedDonation) {
    const donations = this.getDonations();
    const index = donations.findIndex(d => d.id === updatedDonation.id);
    if (index !== -1) {
      donations[index] = { ...donations[index], ...updatedDonation };
      this.saveDonations(donations);
      return true;
    }
    return false;
  },

  deleteDonation(id) {
    let donations = this.getDonations();
    donations = donations.filter(d => d.id !== id);
    this.saveDonations(donations);

    // Also update any reservations linked to this
    let reservations = this.getReservations();
    reservations = reservations.filter(r => r.donationId !== id);
    this.saveReservations(reservations);
    return true;
  },

  createReservation(donationId, claimQuantity, recipientName, recipientOrg) {
    const donations = this.getDonations();
    const target = donations.find(d => d.id === donationId);

    if (!target) {
      throw new Error('Donation item not found.');
    }

    if (target.status !== 'Available') {
      throw new Error(`Item is no longer available (Current status: ${target.status}).`);
    }

    const reservations = this.getReservations();
    // Check for duplicate pending reservation by same user on same donation
    const existing = reservations.find(r => r.donationId === donationId && r.status !== 'Delivered' && r.status !== 'Cancelled');
    if (existing) {
      throw new Error('This donation is already reserved in our system.');
    }

    // Generate random pickup verification code
    const pin = 'FL-' + Math.floor(1000 + Math.random() * 9000);
    const newReservation = {
      id: 'res-' + Date.now(),
      donationId: target.id,
      foodName: target.name,
      category: target.category,
      quantity: target.quantity,
      unit: target.unit,
      weightKg: target.weightKg || (target.quantity * 0.5),
      mealsEst: target.mealsEst || Math.round(target.quantity * 1.5),
      reservedBy: recipientName || 'Volunteer (Demo User)',
      recipientOrg: recipientOrg || 'Community Food Network',
      pickupLocation: target.location,
      donorName: target.donorName,
      deadline: target.deadline,
      reservedAt: new Date().toISOString(),
      pickedUpAt: null,
      deliveredAt: null,
      status: 'Reserved',
      pickupCode: pin,
      contactPhone: '+1 (555) 019-' + Math.floor(1000 + Math.random() * 9000)
    };

    // Update donation status
    target.status = 'Reserved';
    this.saveDonations(donations);

    reservations.unshift(newReservation);
    this.saveReservations(reservations);

    return newReservation;
  },

  updateReservationStatus(reservationId, newStatus) {
    const reservations = this.getReservations();
    const res = reservations.find(r => r.id === reservationId);
    if (!res) throw new Error('Reservation not found');

    const validTransitions = {
      'Reserved': ['Picked Up', 'Cancelled'],
      'Picked Up': ['Delivered'],
      'Delivered': [],
      'Cancelled': []
    };

    if (!validTransitions[res.status].includes(newStatus)) {
      throw new Error(`Cannot transition from ${res.status} to ${newStatus}.`);
    }

    res.status = newStatus;
    const nowISO = new Date().toISOString();
    if (newStatus === 'Picked Up') {
      res.pickedUpAt = nowISO;
    } else if (newStatus === 'Delivered') {
      res.deliveredAt = nowISO;
    }

    // Also update parent donation status
    const donations = this.getDonations();
    const parent = donations.find(d => d.id === res.donationId);
    if (parent) {
      if (newStatus === 'Cancelled') {
        parent.status = 'Available';
      } else {
        parent.status = newStatus;
      }
      this.saveDonations(donations);
    }

    this.saveReservations(reservations);
    return res;
  },

  getStats() {
    const donations = this.getDonations();
    const reservations = this.getReservations();

    const availableCount = donations.filter(d => d.status === 'Available').length;
    const pendingPickups = reservations.filter(r => r.status === 'Reserved' || r.status === 'Picked Up').length;
    const completedReservations = reservations.filter(r => r.status === 'Delivered');

    // Calculate dynamic totals added to baseline
    const dynamicDeliveredKg = completedReservations.reduce((acc, curr) => acc + (Number(curr.weightKg) || 0), 0);
    const dynamicMeals = completedReservations.reduce((acc, curr) => acc + (Number(curr.mealsEst) || 0), 0);
    const dynamicCo2Kg = dynamicDeliveredKg * 1.9; // 1.9 kg CO2e saved per kg of rescued food

    const totalRescuedKg = (BASELINE_METRICS.historicalKgRescued + dynamicDeliveredKg).toFixed(1);
    const totalMealsSaved = BASELINE_METRICS.historicalMealsServed + dynamicMeals;
    const totalCo2Saved = (BASELINE_METRICS.historicalCo2SavedKg + dynamicCo2Kg).toFixed(1);

    return {
      availableDonations: availableCount,
      pendingPickups: pendingPickups,
      completedDonations: completedReservations.length,
      totalDonations: donations.length,
      totalRescuedKg: Number(totalRescuedKg),
      totalMealsSaved: totalMealsSaved,
      totalCo2Saved: Number(totalCo2Saved),
      partnerShelters: BASELINE_METRICS.partnerShelters,
      activeVolunteers: BASELINE_METRICS.activeVolunteers
    };
  },

  // ==========================================================================
  // User Authentication & Profile Management
  // ==========================================================================
  getUsers() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    const defaults = [
      { id: 'FLD-REC-108', name: 'Asha Community Shelter', email: 'asha@shelter.org', phone: '+91 98765 01234', role: 'recipient', org: 'Asha Shelter Foundation', city: 'Delhi NCR', password: 'password123', createdAt: new Date().toISOString() },
      { id: 'FLD-DON-204', name: 'The Daily Bakehouse', email: 'donor@dailybake.com', phone: '+91 98111 22334', role: 'donor', org: 'Bakehouse & Cafe', city: 'Delhi NCR', password: 'password123', createdAt: new Date().toISOString() }
    ];
    this.saveUsers(defaults);
    return defaults;
  },

  saveUsers(users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getCurrentUser() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return null;
  },

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
    return user;
  },

  registerUser({ name, email, phone, role, organization, city, password }) {
    const users = this.getUsers();
    const cleanEmail = email.trim().toLowerCase();
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('An account with this email already exists. Please sign in.');
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const prefix = role === 'donor' ? 'FLD-DON' : 'FLD-REC';
    const newId = `${prefix}-${randomNum}`;

    const newUser = {
      id: newId,
      name: name.trim(),
      email: cleanEmail,
      phone: phone ? phone.trim() : '+91 98000 12345',
      role: role || 'recipient',
      org: organization ? organization.trim() : (role === 'donor' ? 'Independent Donor' : 'Grassroots Shelter / Individual'),
      city: city ? city.trim() : 'Delhi NCR',
      password: password || 'pass',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);
    this.setCurrentUser(newUser);
    return newUser;
  },

  loginUser(emailOrPhone, password) {
    const users = this.getUsers();
    const cleanQuery = emailOrPhone.trim().toLowerCase();
    const user = users.find(u => 
      u.email.toLowerCase() === cleanQuery || 
      (u.phone && u.phone.replace(/\D/g, '') === cleanQuery.replace(/\D/g, ''))
    );

    if (!user) {
      throw new Error('User not found. Please register or use one of the Demo accounts.');
    }

    if (password && password !== user.password && password !== 'demo' && password !== 'pass' && password !== 'password123') {
      throw new Error('Incorrect password. (Hint: Use demo login or any standard password)');
    }

    this.setCurrentUser(user);
    return user;
  },

  logoutUser() {
    this.setCurrentUser(null);
  },

  resetData() {
    localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(INITIAL_DONATIONS));
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(INITIAL_RESERVATIONS));
    return true;
  }
};

// Expose globally for browser usage
window.FoodLoopData = DataService;
window.SAMPLE_IMAGES = SAMPLE_IMAGES;
