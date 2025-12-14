# Sweet Shop Management System

A full-stack **Sweet Shop Management System** built as part of a technical kata to demonstrate **backend architecture**, **Test-Driven Development (TDD)**, **frontend integration**, **clean coding practices**, and **responsible AI usage**.

The system allows:
- Users to browse and purchase sweets
- Admins to manage inventory (add, update, restock, soft-delete sweets)
- Secure authentication with role-based access
- Transaction-safe inventory handling

---

## Objective

The goal of this project is to design and implement a **production-minded full-stack application** that showcases:
- RESTful API design
- Business-rule-driven development
- Proper test coverage using TDD
- Clean Git history and development workflow
- Transparent and effective use of AI tools

---

## Tech Stack

### Backend
- Node.js
- TypeScript
- Express
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Jest + Supertest (Testing)

### Frontend
- Angular (Standalone Components)
- Angular Router
- Angular Forms
- HTTP Interceptor for JWT
- Role-based Route Guards

---

## Features

### Authentication & Authorization
- User registration and login
- JWT-based authentication
- Role-based access control (USER, ADMIN)
- Admin user seeded via database

### Sweets Management
- Create, update, list sweets
- Search and filter sweets
- Soft delete sweets (admin only)

### Inventory & Purchase Flow
- Purchase sweets with stock validation
- Prevents negative inventory
- Transaction-safe purchase logic
- Purchase history logging
- Price snapshot stored at purchase time

### Test-Driven Development (TDD)
- Strict RED → GREEN workflow
- Tests written before implementation
- Business-critical logic fully tested

---

## Getting Started

### Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file:
```
DATABASE_URL=postgresql://user:password@localhost:5432/sweetshop
JWT_SECRET=your_secret_key
```
Run migrations and seed admin:
```bash
npx prisma migrate dev
npx prisma db seed
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
ng serve
```

---

## Running Tests
```bash
npm test
```

---

## My AI Usage

### Tools Used
- ChatGPT (GPT) – brainstorming & design
- Antigravity AI – boilerplate & scaffolding
- Figma AI – frontend UI design

### Reflection
AI was used as an assistant to speed up development and clarify design decisions.
All final code, architecture, and logic decisions were reviewed and owned by me.

---

## 🏁 Final Note
This project focuses on clean architecture, correctness, testability,
and real-world production thinking.
