# Smart Inclusion App for PwDs — Empowering Independence and Inclusion


## 📌 Project Overview

**Smart Inclusion App** is a social-impact platform that empowers Persons with Disabilities (PwDs) by providing verified, real-time information about accessibility, emergency support, community volunteers/NGOs, and inclusive events and schemes. The goal is to improve independence, safety, and social inclusion for PwDs.

---

## 🎯 Key Objectives

* Help PwDs discover **accessible places** and infrastructure.
* Provide immediate **emergency support** (SOS + location sharing).
* Connect users to **volunteers and NGOs** in their area.
* Share **events and government/NGO schemes** relevant to PwDs.
* Enable crowdsourced reviews and verification to keep data reliable.

---

## 🧩 Features

* **Accessibility Map** (Map view showing accessible places and their features)
* **Emergency SOS** button with one-tap location sharing
* **Volunteer & NGO Directory** with contact details and verification status
* **Scheme Finder** — list and filter government / NGO schemes
* **Event Calendar** — inclusive events, workshops and programs
* **User Profiles** — accessibility preferences and favorite locations
* **Crowdsourcing & Reviews** — users add and review accessibility entries
* **Push Notifications** (for emergencies, events, and scheme updates)

---

## 🛠️ Tech Stack

* **Frontend (Mobile):** React Native (Expo recommended)
* **Frontend (Web):** HTML/CSS, React (optional)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Atlas or self-hosted)
* **Maps & Location:** Google Maps API / Places API
* **Push Notifications:** Firebase Cloud Messaging (FCM)
* **Authentication (suggested):** JWT or Firebase Auth

---

## 📦 Repository Structure (recommended)

```
smart-inclusion-app/
├─ mobile/                # React Native (Expo) app
├─ web/                   # Web frontend (React or static HTML/CSS)
├─ server/                # Node.js + Express backend
│  ├─ controllers/
│  ├─ models/
│  ├─ routes/
│  ├─ utils/
│  ├─ app.js
│  └─ server.js
├─ scripts/               # seeding, migration scripts
├─ README.md
└─ .env.example
```

---

## ⚙️ Installation & Local Setup

> These steps assume you have Node.js, npm/yarn, and MongoDB (or MongoDB Atlas) available.

### Backend (server)

1. Clone the repo:

```bash
git clone <repo-url>
cd smart-inclusion-app/server
```

2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Create a `.env` file (see Environment Variables below).

4. Start the server in development:

```bash
npm run dev
# or
node server.js
```

### Mobile (React Native - Expo recommended)

1. Navigate to the mobile folder:

```bash
cd ../mobile
```

2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Run the app:

```bash
expo start
```

> For a bare React Native project, use `npx react-native run-android` / `npx react-native run-ios` after configuring native dependencies.

### Web (optional)

1. Navigate to web frontend:

```bash
cd ../web
npm install
npm start
```

---

## 🔑 Environment Variables (.env.example)

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
FIREBASE_SERVER_KEY=your_firebase_server_key
FIREBASE_PROJECT_ID=your_firebase_project_id
```

**Note:** Keep sensitive keys secret. Use platform secret managers in production (e.g., GitHub Actions Secrets, AWS Secrets Manager).

---

## 📡 APIs & Third-party Services

* **Google Maps / Places API** — displaying accessible places and reverse geocoding
* **Firebase Cloud Messaging (FCM)** — push notifications and emergency alerts
* **MongoDB Atlas** (recommended) — managed database hosting

---

## 🔁 Sample Endpoints (Backend)

> (Example routes — adapt as required)

* `POST /api/auth/register` — Register user
* `POST /api/auth/login` — Login user (returns JWT)
* `GET /api/places` — List accessible places, supports query filters (city, feature, rating)
* `POST /api/places` — Add a new accessible place (authenticated)
* `GET /api/places/:id` — Get place details and reviews
* `POST /api/places/:id/reviews` — Add a review
* `POST /api/sos` — Trigger SOS (sends notifications to nearby volunteers/NGOs)
* `GET /api/volunteers` — List volunteers/NGOs
* `GET /api/events` — List events and schemes

---

## 🧪 Testing

* Unit tests: Jest + Supertest for API endpoints
* Integration tests: run against a test database (MongoDB in-memory server recommended)

---

## 🔒 Security & Privacy Considerations

* **Location Privacy:** Share location only after user confirmation — default to approximate location when possible.
* **Verification:** Implement verification workflows for volunteers and NGOs (email, phone otp, manual admin approval).
* **Data Retention:** Keep a clear privacy policy and provide options to delete user data.
* **Rate Limiting & Abuse Prevention:** Protect SOS and notification endpoints from misuse.

---

## ♿ Accessibility & UX Notes

* Follow WCAG guidelines for color contrast, touch target sizes, and readable fonts.
* Provide alternate text for images and descriptive labels for controls.
* Allow users to set personal accessibility preferences (e.g., large text, simplified UI, high contrast).

---

## 🚀 Deployment (high-level)

* **Backend:** Deploy to Heroku / DigitalOcean / AWS Elastic Beanstalk / Vercel (serverless) depending on preference.
* **Database:** Use MongoDB Atlas for reliable managed hosting.
* **Mobile app:** Publish to Google Play Store and Apple App Store (follow their guidelines for accessibility features).
* **Push Notifications:** Configure FCM credentials for production environment.

---
