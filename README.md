# Personal Finance Tracker

A full-stack personal finance tracker application built with Nuxt 3 (frontend) and Hono + Prisma + PostgreSQL (backend).

---

## Project Structure

```
personal-finance-tracker/
│
├── api/         # Backend API (Node.js, Hono, Prisma, PostgreSQL)
└── web/         # Frontend (Nuxt 3, Vue 3, Tailwind CSS)
```

---

## Features

- Track income and expenses by categories
- Manage categories with custom colors
- Responsive, accessible UI
- Modern stack: Nuxt 3, Vue 3, Tailwind CSS, Hono, Prisma, PostgreSQL

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL database

---

### 1. Clone the repository

```sh
git clone https://github.com/your-username/personal-finance-tracker.git
cd personal-finance-tracker
```

---

### 2. Setup the Backend (api/)

1. Copy `.env.example` to `.env` and set your `DATABASE_URL`.
2. Install dependencies:

   ```sh
   cd api
   npm install
   ```

3. Run database migrations:

   ```sh
   npx prisma migrate deploy
   ```

4. Start the backend server:

   ```sh
   npm run dev
   ```

   The API will be available at `http://localhost:3001` (or your configured port).

---

### 3. Setup the Frontend (web/)

1. Install dependencies:

   ```sh
   cd web
   npm install
   ```

2. Start the development server:

   ```sh
   npm run dev
   ```

   The app will be available at `http://localhost:3000`.

---

## Build for Production

### Backend

```sh
cd api
npm run build
```

### Frontend

```sh
cd web
npm run build
```

---

## Environment Variables

- **Backend:**

  - `DATABASE_URL` — PostgreSQL connection string

- **Frontend:**
  - See .env for available variables

---

## Technologies Used

- **Frontend:** Nuxt 3, Vue 3, Tailwind CSS
- **Backend:** Node.js, Hono, Prisma ORM
- **Database:** PostgreSQL

---

## License

MIT

---

## Acknowledgements

- [Nuxt](https://nuxt.com/)
- [Hono](https://hono.dev/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)

---
