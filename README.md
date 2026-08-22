# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

# 🌍 GlobeTrotter — AI-Powered Travel Planning Platform

> Plan smarter. Explore further. Travel better.

GlobeTrotter is a modern, interactive travel planning platform designed to make discovering destinations and creating personalized trips simple, engaging, and visually immersive.

The platform combines an interactive 3D travel globe, destination discovery, trip planning, user authentication, and an admin dashboard into one unified experience.

---

## ✨ Key Features

### 🌎 Interactive 3D Travel Globe
- Interactive Spline-powered 3D Earth.
- Displays travel destinations and locations.
- Visual travel routes connecting destinations.
- Animated and immersive travel experience.
- Designed to provide an engaging way to explore the world.

### 🧳 Smart Trip Planning
- Explore destinations around the world.
- Discover places based on travel interests.
- Create and manage travel plans.
- Organize destinations into personalized trips.
- View travel information in a simple dashboard.

### 🔐 Authentication System
GlobeTrotter provides separate access for different types of users:

**User**
- Sign up
- Login
- Access personal travel dashboard
- Manage travel plans

**Admin**
- Dedicated admin login
- Admin dashboard
- Manage platform-related information

### 🗺️ Destination Discovery
- Attractive destination cards.
- Destination information and visuals.
- Explore different locations around the globe.
- Interactive travel-focused interface.

### 📊 Interactive Dashboard
The dashboard provides users with an overview of their travel activities, destinations, and planned journeys.

### ⚡ Demo-Friendly Interactive Experience
The platform is designed to provide a smooth experience during demonstrations:

- Interactive buttons
- Working navigation
- Responsive forms
- Animated components
- Dynamic UI updates
- Notifications and feedback
- Interactive destination exploration

---

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- Tailwind CSS

### 3D / Visualization
- Spline
- Interactive 3D Globe
- Animated travel routes

### UI & Animation
- Modern responsive UI
- CSS animations
- Interactive components
- Travel-focused visual design

### Authentication / Backend
- Authentication system for users and administrators
- Demo-friendly authentication flow

---

## 🏗️ Project Structure

```text
GlobeTrotter/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── assets/
│   ├── services/
│   └── App.jsx
│
├── public/
├── package.json
├── README.md
└── ...
