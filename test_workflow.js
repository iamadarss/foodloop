/**
 * FoodLoop — Full End-to-End Logic & HTTP Verification Suite
 * Tests the complete workflow:
 * Add Food -> Browse Food -> Reserve Food -> Update Pickup Status -> Mark Delivered -> Update Dashboard
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// 1. Mock LocalStorage in Node environment
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();
global.localStorage = localStorageMock;
global.window = {
  location: { hash: '' }
};

// 2. Load Data Service
const dataCode = fs.readFileSync(path.join(__dirname, 'js', 'data.js'), 'utf8');
eval(dataCode); // Populates window.FoodLoopData

const FoodLoopData = window.FoodLoopData;

console.log('--- 🧪 STARTING FOODLOOP TEST SUITE ---');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ FAIL: ${testName}`);
    process.exitCode = 1;
  }
}

// TEST 1: Initial Data Load
const initialDonations = FoodLoopData.getDonations();
assert(Array.isArray(initialDonations) && initialDonations.length >= 8, 'Initial donations loaded (>= 8 listings)');

const initialReservations = FoodLoopData.getReservations();
assert(Array.isArray(initialReservations) && initialReservations.length >= 3, 'Initial reservations loaded (>= 3 reservations)');

const initialStats = FoodLoopData.getStats();
console.log('Initial stats:', initialStats);
assert(initialStats.availableDonations > 0, 'Available donations count > 0');
assert(initialStats.totalRescuedKg > 0, 'Total rescued kg > 0');

// TEST 2: Add Food Workflow
const newFood = {
  id: 'fl-don-test-999',
  name: 'Artisan Brioche Buns (Test Batch)',
  category: 'Bakery',
  dietary: 'Vegetarian',
  quantity: 20,
  unit: 'buns (~5 kg)',
  weightKg: 5.0,
  mealsEst: 25,
  donorName: 'Golden Grain Bakery',
  donorType: 'Bakery',
  donorId: 'donor_me',
  isMyDonation: true,
  location: '42 Green St, Downtown',
  deadline: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
  status: 'Available',
  image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
  notes: 'Freshly baked brioche buns.',
  createdAt: new Date().toISOString()
};

FoodLoopData.addDonation(newFood);
const afterAddList = FoodLoopData.getDonations();
const addedFound = afterAddList.find(d => d.id === 'fl-don-test-999');
assert(!!addedFound && addedFound.status === 'Available', 'Step 1 (Add Food): Item successfully saved to storage');

// TEST 3: Browse Food Filtering
const availableList = FoodLoopData.getDonations().filter(d => d.status === 'Available');
assert(availableList.some(d => d.name.includes('Brioche')), 'Step 2 (Browse Food): Item appears in Available listings');

// TEST 4: Reserve Food Workflow
let reservation;
try {
  reservation = FoodLoopData.createReservation(
    'fl-don-test-999',
    20,
    'Adarsh (Volunteer)',
    'Community Care Kitchen'
  );
  assert(!!reservation && reservation.status === 'Reserved', 'Step 3 (Reserve Food): Created reservation with status Reserved');
  assert(!!reservation.pickupCode && reservation.pickupCode.startsWith('FL-'), 'Step 3: Verification PIN code generated');
} catch (e) {
  assert(false, `Step 3 (Reserve Food) threw error: ${e.message}`);
}

// Verify donation status changed to Reserved
const donationAfterReserve = FoodLoopData.getDonationById('fl-don-test-999');
assert(donationAfterReserve.status === 'Reserved', 'Donation item status transitioned to Reserved');

// TEST 5: Duplicate Reservation Prevention
let duplicateBlocked = false;
try {
  FoodLoopData.createReservation('fl-don-test-999', 20, 'Another Volunteer', 'Other Shelter');
} catch (e) {
  duplicateBlocked = true;
}
assert(duplicateBlocked, 'Step 4 (Prevent Duplicate): Successfully blocked duplicate reservation on reserved item');

// TEST 6: Update Pickup Status: Reserved -> Picked Up
const pickedUpRes = FoodLoopData.updateReservationStatus(reservation.id, 'Picked Up');
assert(pickedUpRes.status === 'Picked Up' && !!pickedUpRes.pickedUpAt, 'Step 5 (Pickup Status): Updated to Picked Up with timestamp');
const donationAfterPickup = FoodLoopData.getDonationById('fl-don-test-999');
assert(donationAfterPickup.status === 'Picked Up', 'Donation status matched to Picked Up');

// TEST 7: Mark Delivered: Picked Up -> Delivered
const deliveredRes = FoodLoopData.updateReservationStatus(reservation.id, 'Delivered');
assert(deliveredRes.status === 'Delivered' && !!deliveredRes.deliveredAt, 'Step 6 (Mark Delivered): Updated to Delivered with timestamp');
const donationAfterDelivery = FoodLoopData.getDonationById('fl-don-test-999');
assert(donationAfterDelivery.status === 'Delivered', 'Donation status matched to Delivered');

// TEST 8: Dashboard & Stats Dynamic Recalculation
const finalStats = FoodLoopData.getStats();
console.log('Final updated stats:', finalStats);
assert(finalStats.completedDonations > initialStats.completedDonations, 'Step 7 (Update Dashboard): Completed donations count increased');
assert(finalStats.totalRescuedKg >= initialStats.totalRescuedKg + 5.0, 'Step 7: Total rescued kg increased by delivered weight (>= +5kg)');
assert(finalStats.totalMealsSaved >= initialStats.totalMealsSaved + 25, 'Step 7: Total meals saved increased by delivered meals (>= +25)');
assert(finalStats.totalCo2Saved > initialStats.totalCo2Saved, 'Step 7: CO2 savings recalculated dynamically');

// TEST 9: Reset Demo Data
FoodLoopData.resetData();
const resetDonations = FoodLoopData.getDonations();
const resetStats = FoodLoopData.getStats();
assert(resetDonations.length === initialDonations.length, 'Step 8 (Reset Demo Data): Restores initial sample dataset');

// TEST 10: HTTP Server Verification (index.html & technology.html)
function checkHttpUrl(urlPath, searchString, testDescription) {
  return new Promise((resolve) => {
    http.get(`http://localhost:8080/${urlPath}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasText = data.includes(searchString);
        assert(res.statusCode === 200 && hasText, testDescription);
        resolve();
      });
    }).on('error', (err) => {
      assert(false, `${testDescription} - HTTP Error: ${err.message}`);
      resolve();
    });
  });
}

(async () => {
  await checkHttpUrl('index.html', 'FoodLoop', 'HTTP 200 on index.html containing FoodLoop');
  await checkHttpUrl('explain.html', 'Kaise Kaam Karta Hai', 'HTTP 200 on explain.html containing Guide content');
  await checkHttpUrl('technology.html', 'Under the Hood of', 'HTTP 200 on technology.html containing Architecture content');
  await checkHttpUrl('css/styles.css', '--color-saffron', 'HTTP 200 on css/styles.css containing Tiranga CSS variables');
  await checkHttpUrl('js/app.js', 'FoodLoopApp', 'HTTP 200 on js/app.js');
  await checkHttpUrl('js/charts.js', 'FoodLoopCharts', 'HTTP 200 on js/charts.js');

  console.log(`\n🎉 TEST RESULTS: ${passedTests}/${totalTests} tests passed successfully!`);
})();
