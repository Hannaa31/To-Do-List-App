# 📝 To Do List App by Sakshi

A robust and secure **PostgreSQL + Express + React + Node.js** task
management application built with **Vite** and **Tailwind CSS**.\
It allows users to **register and login**, manage personal tasks, update
profiles, and features **Role-Based Access Control (RBAC)** for
administrators.
**Live Demo:** [Frontend Link (Vercel)](https://to-do-list-app-iota-ten.vercel.app/) | [Backend API (Render)](https://to-do-list-app-7s9i.onrender.com/)
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
## 📈 Scalability Considerations

### Frontend Scaling (React/Vite)
* **CDN & Caching:** Deploy static assets (JS, CSS, Images) via a CDN (like Cloudflare or Vercel Edge Network) to reduce latency globally.
* **State Management:** As the app grows, replace `useState/useEffect` with **Redux Toolkit** or **TanStack Query** to handle server-state caching and minimize API calls.
* **Code Splitting:** Implement lazy loading (`React.lazy`) for routes like the Admin Dashboard to reduce the initial bundle size.

### Backend Scaling (Node.js/Express)
* **Horizontal Scaling:** Use a Load Balancer (like NGINX or AWS ALB) to distribute traffic across multiple instances of the Node.js server.
* **Database Optimization:**
    * **Indexing:** Ensure frequently queried columns (like `user_id` and `email`) are indexed in PostgreSQL.
    * **Connection Pooling:** Use `pg-pool` (already implemented) to manage database connections efficiently under load.
    * **Read Replicas:** Separate Read and Write database operations to handle high traffic.
* **Caching Strategy:** Implement **Redis** to cache user sessions and frequently accessed To-Do lists, reducing direct database hits.
* **Microservices:** If the "Admin" features grow complex, extract the Admin/User management into a separate microservice, decoupled from the core "To-Do" logic.
------------------------------------------------------------------------

## 🧑‍💻 Developed by
**Sakshi**  
GitHub: [Hannaa31](https://github.com/Hannaa31)  
Website: [To Do List App by Sakshi](https://to-do-list-app-iota-ten.vercel.app/)

