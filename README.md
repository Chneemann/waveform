# Waveform

A modern, high-performance real-time chat application, designed for seamless communication.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwind-css)
![Auth.js](https://img.shields.io/badge/Auth.js-v5-purple?style=flat-square)
![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=flat-square&logo=drizzle)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql)

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Route Groups)
- **UI & Styling:** [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/)
- **Database & ORM:** [PostgreSQL](https://www.postgresql.org/) managed via [Drizzle ORM](https://orm.drizzle.team/) & Drizzle Kit (Studio included)
- **Authentication:** [Auth.js v5 (NextAuth)](https://authjs.dev/) with Credentials Provider & bcrypt hashing
- **DevOps & Infrastructure:** Docker & Docker Compose, Caddy Reverse Proxy, Forgejo Actions _(planned)_

## 📂 Architecture & Structure

The project uses Next.js Route Groups without a `src/` directory to maintain a clean root layout:

- `app/(app)/` — Application routes (Layout, Home, Components)
- `app/api/` — Backend API endpoints & Auth handlers (`[...nextauth]`)
- `components/` — Modular UI components (Chat, Navigation, Sidebars)
- `db/` — Database schema definitions, migrations, and Drizzle configuration (`drizzle.config.ts`)
- `lib/` — Centralized core logic folder containing:
  - `store/` — State management stores
  - `types/` — Global TypeScript interfaces and type definitions
- `public/` — Static assets (images, icons, fonts)

## 🎯 Current Status

_In Progress_ — Application scaffold initialized with Next.js 16, React 19, Tailwind CSS v4, and TypeScript. Database layer fully set up with PostgreSQL and Drizzle ORM schemas, full authentication (Auth.js v5). DevOps infrastructure will be implemented in subsequent phases.
