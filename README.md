# Waveform

A modern, high-performance real-time chat application, designed for seamless communication.

[![Deployment Status](https://git.andre-kempf.com/Chneemann/waveform/badges/workflows/deploy.yml/badge.svg?branch=main)](https://git.andre-kempf.com/Chneemann/waveform/actions)
[![Website Status](https://img.shields.io/badge/website-online-brightgreen?style=flat-square&logo=google-chrome&logoColor=white)](https://waveform.andre-kempf.com)
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
- **DevOps & Infrastructure:** Docker & Docker Compose, Caddy Reverse Proxy, Forgejo Actions (CI/CD Automated Deployment)

## 📂 Architecture & Structure

The project uses Next.js Route Groups without a `src/` directory to maintain a clean root layout:

- `app/(app)/` — Application routes (Layout, Home, Components)
- `app/(auth)/` — Public authentication routes (Login, Register)
- `app/api/` — Backend API endpoints & Auth handlers (`[...nextauth]`)
- `components/` — Modular UI components (Chat, Navigation, Sidebars)
- `db/` — Database schema definitions, migrations, and Drizzle configuration (`drizzle.config.ts`)
- `lib/` — Centralized core logic folder containing:
  - `stores/` — State management stores
  - `schemas/` — Zod validation schemas
  - `types/` — Global TypeScript interfaces and type definitions
  - `services/` — Business logic layers and external API integration services
- `public/` — Static assets (images, icons, fonts)

## 🚀 CI/CD & Deployment

Deployments are fully automated using **Forgejo Actions** and SSH:

1. **Automated Trigger:** Pushes to the `main` branch trigger the SSH deployment workflow.
2. **Database Schema Sync:** Migrations are applied in milliseconds using `drizzle-kit push` executed directly inside the active `waveform-studio` container.
3. **Zero-Downtime Container Rebuild:** Rebuilds production Docker images (`waveform`) without disrupting live database volumes.

## 🎯 Current Status

_In Progress_ — Application scaffold initialized with Next.js 16, React 19, Tailwind CSS v4, and TypeScript. Database layer fully set up with PostgreSQL and Drizzle ORM schemas, full authentication (Auth.js v5). DevOps infrastructure implemented.
