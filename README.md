# FoodLoop — Surplus Food Waste Reduction & Redistribution Platform 🍱

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-success?style=for-the-badge&logo=vercel)](https://foodloop-ten-peach.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg?style=for-the-badge&logo=node.js)](https://nodejs.org)

> **"Turn Surplus Food Into Community Nourishment"**  
> A civic-tech web and mobile platform connecting bakeries, restaurants, caterers, and banquets with local shelters, NGOs, and volunteers to rescue quality surplus food before it goes to waste.

🌐 **Live Web Application:** [https://foodloop-ten-peach.vercel.app/](https://foodloop-ten-peach.vercel.app/)

---

## 🌟 Key Features

### 1. 🔐 Minimal & Seamless Authentication (`auth.html`)
- **Separate Dedicated Auth Portal**: Minimal, distraction-free sign-in and registration.
- **Role-Based Onboarding**:
  - 🍱 **Food Recipient / NGO / Volunteer**: Browse, claim, and coordinate pickups for community shelters and individuals in need.
  - 🏢 **Food Donor / Restaurant / Business**: List surplus food batches in seconds with freshness deadlines and dietary tags.
- **Unique FoodLoop ID Generation**:
  - Automatically generates verified IDs (`FLD-REC-XXXX` for Recipients, `FLD-DON-XXXX` for Donors).
  - Quick 1-click **Demo Accounts** for instant testing without manual typing.

### 2. 🍲 Real-Time Surplus Food Marketplace (`#browse`)
- Visual food cards with real-time countdowns (**Expiring in X hours!**).
- Clear distance indicators, estimated community meals (`~X Meals`), and safety-verified badges.
- Dynamic filtering by category (**Bakery & Bread**, **Produce**, **Prepared Meals**, **Dairy & Groceries**).
- Dietary filters (**Vegetarian**, **Vegan**, **All**).
- Single-click **Reserve Food** modal with automated verification PINs.

### 3. 📊 Real-Time Operations Dashboard (`#dashboard`)
- Real-time KPI summary: Total kg Rescued, Active Listings, Active Courier Tasks, and Meals Delivered.
- Recent Food Donations & Status Pipeline monitoring table.
- Direct demo data reset for quick demonstrations.

### 4. 🚚 Courier & Volunteer Pickup Board (`#reservations`)
- 4-step status stepper: **Reserved** &rarr; **Picked Up** &rarr; **Delivered** (or **Cancelled**).
- Secure 4-digit PIN verification displayed for courier and donor verification.

### 5. 📱 Android Application
- Packaged as a lightweight Android app (`FoodLoop.apk`, 5.8 MB) with native offline assets and webview caching.

---

## 🛠️ Technology Stack

- **Frontend Core**: Vanilla HTML5, Modern CSS3 (CSS Variables, Flexbox, CSS Grid, Glassmorphism).
- **Design System**: Plus Jakarta Sans typography, clean modern responsive layout.
- **Logic & State**: Modern ES6+ JavaScript, Client-side persistence via `localStorage`.
- **Local Server**: Pure Node.js HTTP server (`serve.js`) with auto-fallback port management.
- **Deployment**: Live on Vercel at [https://foodloop-ten-peach.vercel.app/](https://foodloop-ten-peach.vercel.app/).
- **Mobile Wrapper**: Android Studio native Gradle wrapper with offline-capable WebView.

---

## 🚀 Quick Start

### 1. Live Deployment
Simply open: **[https://foodloop-ten-peach.vercel.app/](https://foodloop-ten-peach.vercel.app/)**

### 2. Run Locally (Node.js)
1. Clone the repository:
   ```bash
   git clone https://github.com/iamadarss/foodloop.git
   cd foodloop
   ```
2. Start the local server:
   ```bash
   node serve.js
   ```
3. Open **[http://localhost:5000](http://localhost:5000)** in your browser.  
   *(If port 5000 is occupied, the server automatically selects the next available port like 5001).*

---

## 📄 License
MIT License (c) 2026 FoodLoop Community Initiative.
