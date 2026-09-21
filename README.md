# AETHERIA

[![AETHERIA](https://img.shields.io/badge/AETHERIA-Productivity%20Quest%20Platform-gold)](https://github.com/)

***AETHERIA is a gamified productivity and habit-tracking platform inspired by the magical world of Hogwarts.***

*The main goal of this project is to help users turn their daily goals and habits into* ***quests*** *that can be completed to earn* ***XP, maintain streaks, level up, and contribute points to their chosen house.*** *Users can also activate spells, craft potions, view their statistics, and compete through the* ***House Cup and Wizard Leaderboard.***

---

### Architecture

[![Architecture](https://img.shields.io/badge/Architecture-MERN%20Monorepo-blue)](#architecture)

```text
                         AETHERIA
                            │
             ┌──────────────┴──────────────┐
             │                             │
        React Frontend                Express Backend
             │                             │
       React + Vite                    REST API
       Tailwind CSS                       │
       React Router                       │
       Axios                              │
             │                             │
             └──────────────┬──────────────┘
                            │
                         MongoDB
                            │
                         Mongoose
```

---

## FEATURES

[![Features](https://img.shields.io/badge/Features-Core%20Functionality-purple)](#features)

* 🧙 **User Authentication** — Secure registration and login using JWT authentication
* 🏰 **House Selection** — Choose between Gryffindor, Ravenclaw, Slytherin, and Hufflepuff
* ⚔️ **Quest System** — Create, update, complete, fail, and delete personal quests
* ⭐ **XP & Level System** — Earn XP from completed quests and level up
* 🔥 **Daily Streaks** — Maintain activity streaks through consistent quest completion
* ❤️ **HP System** — Completing quests restores HP while failing quests reduces it
* 🧪 **Potion System** — Unlock special XP multipliers through quest combinations
* ✨ **Spell System** — Activate temporary productivity spells
* 🦉 **Daily Owl** — Receive productivity suggestions based on recent activity
* 🏆 **House Cup** — Houses compete through accumulated points
* 🧙‍♂️ **Wizard Leaderboard** — Users are ranked according to their XP
* 📊 **Statistics Dashboard** — Track XP history, completed quests, house activity, and active abilities
* 👤 **Profile Management** — View and update user information
* 📱 **Responsive UI** — Designed to work across different screen sizes

---

## 🛠️ Tech Stack

### Frontend

[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB)](#frontend)

* **React.js**
* **TypeScript**
* **Vite**
* **Tailwind CSS**
* **React Router**
* **Axios**
* **Lucide React**
* **clsx**

### Backend

[![Backend](https://img.shields.io/badge/Backend-Node%20%2B%20Express-green)](#backend)

* **Node.js & Express.js**
* **TypeScript**
* **MongoDB & Mongoose**
* **JWT** — Authentication & authorization
* **bcryptjs** — Password hashing
* **express-validator** — Request validation
* **CORS**
* **dotenv**

### Database

[![Database](https://img.shields.io/badge/Database-MongoDB-green)](#database)

* **MongoDB**
* **Mongoose ODM**

---

## 📁 Project Structure

[![Structure](https://img.shields.io/badge/Project%20Structure-Monorepo-orange)](#-project-structure)

```text
project-root/
├── frontend/
├── backend/
├── shared/
├── package.json
└── README.md
```

### Frontend

```text
frontend/
└── src/
    ├── components/
    │   ├── ui/
    │   ├── HouseCard.tsx
    │   ├── LoadingScreen.tsx
    │   ├── Navbar.tsx
    │   ├── ProtectedRoute.tsx
    │   ├── QuestCard.tsx
    │   ├── StatChip.tsx
    │   ├── Toast.tsx
    │   └── XPBar.tsx
    │
    ├── context/
    │   ├── AuthContext.tsx
    │   ├── QuestContext.tsx
    │   └── ToastContext.tsx
    │
    ├── pages/
    │   ├── DashboardPage.tsx
    │   ├── Home.tsx
    │   ├── HouseSelectionPage.tsx
    │   ├── LeaderboardPage.tsx
    │   ├── LoginPage.tsx
    │   ├── ProfilePage.tsx
    │   ├── QuestsPage.tsx
    │   ├── RegisterPage.tsx
    │   └── SpellsPage.tsx
    │
    ├── lib/
    │   └── axios.ts
    │
    ├── App.tsx
    ├── main.tsx
    └── index.css
```

### Backend

```text
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── houseController.ts
│   │   ├── leaderboardController.ts
│   │   ├── owlController.ts
│   │   ├── questController.ts
│   │   ├── spellController.ts
│   │   ├── statsController.ts
│   │   └── userController.ts
│   │
│   ├── models/
│   │   ├── HouseCup.ts
│   │   ├── Potion.ts
│   │   ├── Quest.ts
│   │   ├── Spell.ts
│   │   └── User.ts
│   │
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── houses.ts
│   │   ├── leaderboard.ts
│   │   ├── owl.ts
│   │   ├── quests.ts
│   │   ├── spells.ts
│   │   ├── stats.ts
│   │   └── users.ts
│   │
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── errorHandler.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   └── server.ts
│
├── package.json
└── tsconfig.json
```

### Shared

```text
shared/
└── package.json
```

---

## ⚔️ Quest & XP System

[![Quest System](https://img.shields.io/badge/Quest%20System-XP%20%26%20Streaks-yellow)](#-quest--xp-system)

Users can create quests and assign them to one of the four houses.

Each quest contains:

* **Title**
* **House**
* **XP Reward**
* **Type**
* **Due Date**
* **Status**

Available quest types:

```text
daily
trial
exam
```

Quest statuses:

```text
pending
completed
failed
```

When a quest is completed:

```text
Quest Completed
      │
      ├── XP awarded
      ├── Level updated
      ├── HP increased
      ├── Streak updated
      └── House Cup points increased
```

---

## 🏰 Houses

[![Houses](https://img.shields.io/badge/Houses-Gryffindor%20%7C%20Ravenclaw%20%7C%20Slytherin%20%7C%20Hufflepuff-red)](#-houses)

### 🦁 Gryffindor

Focused around:

* Bravery
* Courage
* Daring
* Nerve
* Chivalry

### 🦅 Ravenclaw

Focused around:

* Intelligence
* Wit
* Wisdom
* Creativity
* Learning

### 🐍 Slytherin

Focused around:

* Ambition
* Cunning
* Leadership
* Resourcefulness

### 🦡 Hufflepuff

Focused around:

* Loyalty
* Patience
* Hard Work
* Fairness
* Kindness

---

## 🧪 Potions

[![Potions](https://img.shields.io/badge/Potions-Productivity%20Boost-red)](#-potions)

AETHERIA contains a potion system that rewards users for completing different types of quests.

Completing both **Gryffindor** and **Ravenclaw** quests on the same day can unlock a:

> 🧪 **Focus Potion**

The Focus Potion provides a **2× XP multiplier** when applied to a quest.

---

## ✨ Spells

[![Spells](https://img.shields.io/badge/Spells-Productivity%20Mode-purple)](#-spells)

Users can activate temporary spells to represent different productivity modes.

Available spell types:

```text
focus_charm
grind_spell
shield_spell
wingardium
```

Each spell can be activated for a configurable duration.

The system ensures that only one active spell is maintained for a user at a time.

---

## 🦉 Daily Owl

[![Owl](https://img.shields.io/badge/Daily%20Owl-Smart%20Suggestions-brown)](#-daily-owl)

The Daily Owl analyzes recent user activity and provides productivity suggestions.

It checks:

* Recent quest completion
* Neglected houses
* Current streak
* Today's completed quests
* Potion availability

The system can generate:

* Suggested quests
* Streak warnings
* Potion availability information
* Motivational quotes

---

## 🏆 Leaderboards

[![Leaderboard](https://img.shields.io/badge/Leaderboard-House%20Cup%20%26%20Wizards-gold)](#-leaderboards)

### House Cup

Houses compete by accumulating points through completed quests.

```text
Gryffindor ──────┐
Ravenclaw ────────┤
Slytherin ────────┼──► House Cup
Hufflepuff ───────┘
```

### Wizard Leaderboard

Individual users are ranked according to their XP.

The leaderboard displays:

* Rank
* Username
* House
* Level
* XP

---

## 📊 Statistics

[![Stats](https://img.shields.io/badge/Statistics-XP%20%26%20Progress-blue)](#-statistics)

Users can track their productivity through:

* Quests completed today
* Total quests completed
* XP history
* XP earned by house
* Quest distribution by house
* Active potion
* Active spell

The XP history endpoint also provides daily XP data for the previous 30 days.

---

## 🔐 Authentication

[![Auth](https://img.shields.io/badge/Auth-JWT-red)](#-authentication)

AETHERIA uses JWT-based authentication.

```text
Register / Login
       │
       ▼
   JWT Token
       │
       ▼
Frontend Storage
       │
       ▼
Authorization Header
       │
       ▼
Auth Middleware
       │
       ▼
Protected API
```

Passwords are hashed using **bcryptjs** before being stored in MongoDB.

Protected endpoints require:

```http
Authorization: Bearer <token>
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have:

* **Node.js**
* **npm**
* **MongoDB**

installed on your system.

### Clone the repository

```bash
git clone <repository-url>
cd AETHERIA
```

### Install dependencies

```bash
npm run install-all
```

Or install them individually:

```bash
cd backend
npm install

cd ../frontend
npm install
```

### Environment Variables

Create a `.env` file inside `backend/`:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

Create a `.env` file inside `frontend/` if required by your API configuration:

```env
VITE_API_URL=http://localhost:5001/api
```

### Run the project

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend:

```bash
cd frontend
npm run dev
```

The application will be available at:

```text
Frontend → http://localhost:5173
Backend  → http://localhost:5001
```

---

## 📜 Available Scripts

### Frontend

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

### Backend

```bash
npm run dev
npm run build
npm run start
```

---

## 🤝 Contributing

[![Contributing](https://img.shields.io/badge/Contributions-Welcome-brightgreen)](#-contributing)

*Contributions, suggestions, feature requests, and issue reports are welcome.*

```bash
# Fork → clone → create branch → push → open PR

git checkout -b feature/your-feature-name
```

Please create a separate branch for each feature or fix and open a pull request when your changes are ready.

---

### Author

[![GitHub](https://img.shields.io/badge/GitHub-Aarsh--HV-black)](https://github.com/Harsh-vardhan09)

* **Aarsh-HV**

---

### ⭐ If you like the project

Give the repository a ⭐ and feel free to contribute!
