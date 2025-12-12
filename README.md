# 📝 Full Stack PERN Dashboard by Sakshi

A robust and secure **PostgreSQL + Express + React + Node.js** task
management application built with **Vite** and **Tailwind CSS**.\
It allows users to **register and login**, manage personal tasks, update
profiles, and features **Role-Based Access Control (RBAC)** for
administrators.

------------------------------------------------------------------------

## 🚀 Features

-   🔐 Secure JWT Authentication (Login/Register)
-   🛡️ Role-Based Access Control (Admin Dashboard)
-   📝 Create, edit, delete, and toggle tasks
-   🔍 Server-side Search and Filtering
-   ☁️ Cloud Database (Neon.tech PostgreSQL)
-   💅 Modern Glassmorphism UI with Tailwind CSS
-   ⚡ Built using Vite for super-fast builds
-   ✨ Smooth animations with Framer Motion

------------------------------------------------------------------------

## 🛠️ Tech Stack

**Frontend:** React, Vite\
**Backend:** Node.js, Express.js\
**Database:** PostgreSQL (Neon Cloud)\
**Styling:** Tailwind CSS\
**Animations:** Framer Motion\
**Icons:** Lucide React

------------------------------------------------------------------------

## 📂 Project Structure

    to-do-list-app/
    ├── client/              # React Frontend
    │   ├── src/
    │   │   ├── components/  # Dashboard, Login, Register
    │   │   ├── App.jsx
    │   │   └── main.jsx
    │   └── vite.config.js
    ├── server/              # Node.js Backend
    │   ├── routes/          # Auth, Dashboard, Admin routes
    │   ├── middleware/      # JWT verification, Admin check
    │   ├── db.js            # Database connection
    │   └── index.js         # Entry point
    └── README.md

------------------------------------------------------------------------

## ⚙️ Setup and Installation

### 1. Clone the repository

``` bash
git clone https://github.com/Hannaa31/To-Do-List-App
cd to-do-list-app
```

### 2. Setup Backend

``` bash
cd server
npm install
```

Create a `.env` file inside **server**:

    PORT=5000
    DATABASE_URL=your_neon_postgres_connection_string
    jwtSecret=your_random_secret_key

### 3. Setup Database (PostgreSQL)

Run:

``` sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE todos (
  todo_id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  description VARCHAR(255) NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Setup Frontend

``` bash
cd client
npm install
```

------------------------------------------------------------------------

## ▶️ Run Locally

Backend:

``` bash
npm run dev
```

Frontend:

``` bash
npm run dev
```

App URL: **http://localhost:5173**

------------------------------------------------------------------------

## 🌐 Deployment

### Backend:

Deploy **server/** on: - Render

Set environment variable: `DATABASE_URL`

### Frontend:

Deploy **client/** on: - Vercel

Update fetch URLs in frontend to point to deployed backend.

------------------------------------------------------------------------

## 🧑‍💻 Developed by

**Sakshi**\
- GitHub: **Hannaa31**
- Website: **To Do List by Sakshi**
