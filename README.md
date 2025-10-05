# Civic Issue Management System

A full-stack web application that enables citizens to report civic issues (such as potholes, garbage, or broken streetlights) and allows administrators to manage and resolve them. The system is designed to promote smarter, more responsive cities.

---

## Features

* User authentication (Register & Login with Supabase Auth)
* Report issues with title, description, category, location, and images
* Issue listing and filtering (by status, category, date, area)
* Issue details with comments, updates, and photos
* Admin dashboard to view, assign, and update issue statuses
* Analytics dashboard (track open, in-progress, and resolved issues)
* Notifications or emails when status or comments change
* Modern UI with animated background and enhanced color palette (Royal Blue, Champagne Gold, Emerald highlights)

---

## Tech Stack

**Frontend**

* React + Tailwind CSS (responsive UI and animations)

**Backend**

* Node.js + Express (API layer)
* Supabase (PostgreSQL, Auth, File Storage)

**Deployment**

* Frontend: Netlify / Vercel
* Backend: Bolt AI / Render / Heroku

---

## Project Structure

```
civic-issue-management/
│── frontend/         # React + Tailwind frontend
│   ├── components/   # UI components
│   ├── pages/        # Page routes
│   ├── utils/        # Helper functions
│   └── ...
│
│── backend/          # Node.js + Express backend
│   ├── routes/       # API endpoints
│   ├── models/       # Database models
│   ├── controllers/  # Business logic
│   └── ...
│
└── README.md         # Documentation
```

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/civic-issue-management.git
cd civic-issue-management
```

### 2. Install dependencies

```bash
cd frontend && npm install
cd ../backend && npm install
```

### 3. Configure environment variables

Create `.env` files in both `frontend/` and `backend/`.

**Frontend .env**

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Backend .env**

```
DATABASE_URL=your_supabase_db_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
PORT=5000
```

### 4. Run locally

Frontend:

```bash
cd frontend
npm run dev
```

Backend:

```bash
cd backend
npm start
```

---

## Deployment

* Frontend can be deployed on Netlify or Vercel
* Backend can be deployed on Render, Heroku, or Bolt AI
* Ensure Supabase is configured and environment variables are set

---

## Contributing

Contributions are welcome. Please fork the repository, create a branch, and submit a pull request.

---

## License

This project is licensed under the MIT License.

---
