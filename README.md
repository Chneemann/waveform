# Waveform

A modern, high-performance real-time chat application, designed for seamless communication.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwind-css)

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Route Groups)
- **UI & Styling:** [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/)
- **Authentication:** [Auth.js v5 (NextAuth)](https://authjs.dev/) with Credentials Provider & bcrypt hashing _(planned)_
- **Database & ORM:** [PostgreSQL](https://www.postgresql.org/) managed via [Drizzle ORM](https://orm.drizzle.team/) & Drizzle Kit _(planned)_
- **DevOps & Infrastructure:** Docker & Docker Compose, Caddy Reverse Proxy, Forgejo Actions _(planned)_

## 📂 Architecture & Structure

The project uses Next.js Route Groups without a `src/` directory to maintain a clean root layout:

- `app/(app)/` — Application routes (Layout, Home)
- `public/` — Static assets (images, icons, fonts)

## 🎯 Current Status

_In Progress_ — Application scaffold initialized with Next.js 16, React 19, Tailwind CSS v4, and TypeScript. Database integration, authentication, and DevOps infrastructure will be implemented in subsequent phases.
