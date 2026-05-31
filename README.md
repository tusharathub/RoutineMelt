# ROUTINEMELT. 

A premium, high-impact **brutalist habit & routine tracker** designed with a sand & red editorial aesthetic. RoutineMelt helps creators, developers, and writers build unstoppable momentum by logging daily accomplishments and visualizing consistency through an annual streak calendar.

### 🔗 [Live Deployment Workspace](https://routine-melt.vercel.app/)

---

## 🎨 Design Philosophy & Aesthetic
RoutineMelt moves away from typical SaaS dashboards, adopting a layout inspired by modern fashion and design editorials:
*   **Sand Theme (Default):** Warm, high-contrast cream background (`#f9f9f0`), charcoal text (`#1A1A1A`), and striking green-scale streak visualization.
*   **Dark Theme:** Deep carbon background (`#0D0D0D`), sand-tinted text (`#F2EBE4`), and vibrant red-scale streak engines.
*   **Brutalist Layouts:** Saturated red borders (`#FF0800`), bold typographic layouts (Google Font *Outfit*), and tight tracking.
*   **Responsive Fluidity:** Adaptable grid sections, collapsible header branding (`RM` on mobile, `ROUTINEMELT` on desktop), and scrollable horizontal calendars ensuring a seamless experience across all viewports.

---

## ✨ Features

*   🔑 **Secure Tokenized Auth** – Powered by Clerk for instant, passwordless credentials authorization.
*   🗓️ **Annual Streak Visualization** – Interactive GitHub-style heatmap displaying logs across 11 months past and 1 month ahead.
*   🟢🔴 **Theme-Synchronized Streaks** – High-contrast green scaling in Light (Sand) mode and red scaling in Dark mode.
*   📝 **Micro-Log CRUD Manager** – Click on any cell in the grid to pull up a themed, underline-styled day logger to add accomplishments.
*   🚨 **Custom Themed Warn Popup** – Custom-themed confirmation modal in ALL CAPS (`ARE YOU SURE YOU WANT TO DELETE THIS LOG?`) replacing generic browser dialogs.
*   📱 **Mobile-First Responsive Design** – Clean navigation elements, auto-wrapping statistics cards, and scrollable heatmap zones.
*   🔒 **Data Privacy & Integrity** – Direct client-to-database routing with zero telemetry scripts, tracking pixels, or bloat.

---

## 🛠️ Modern Tech Stack

*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack Engine)
*   **Core**: [React 19](https://react.dev/)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (using CSS variables mapping)
*   **Authentication**: [Clerk SDK](https://clerk.com/)
*   **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) (via native MongoClient driver pooling)
*   **Visualization**: [react-calendar-heatmap](https://github.com/patientslikeme/react-calendar-heatmap)

---

## 🚀 Local Development Setup

To spin up RoutineMelt on your local machine, follow these steps:

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/tusharathub/RoutineMelt.git
cd RoutineMelt
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory and insert your secure API credentials:
```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Clerk Redirect Routes
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/grid
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/grid
```

### 3. Run the Development Server
```bash
npm run dev
```
Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

### 4. Build for Production
```bash
npm run build
```

---

## 📂 Architecture Key Directories
```text
├── src/
│   ├── app/
│   │   ├── api/             # MongoDB serverless routes (tasks GET, POST, DELETE, PUT)
│   │   ├── grid/            # Main Tracker Dashboard page (/grid)
│   │   ├── lib/             # MongoDB database connection pooler and Theme hook
│   │   ├── globals.css      # Core theme mapping variables and custom scrollbar overrides
│   │   ├── layout.tsx       # ClerkProvider setup and Outfit font initialization
│   │   └── page.tsx         # Responsive Landing Page and Streak Simulator
```

---

## 🔗 Connect With Me

Let's discuss systems, design, and consistency.

[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://portf-wheat.vercel.app)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/tushar-nailwal/)
[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://x.com/tushar_nerd/)

---

*RoutineMelt is open source and forever free to use.*
