# 🖌️ LiveSketch - Real-Time Collaborative Drawing

LiveSketch is a **real-time** collaborative drawing application built with **Turborepo**. It allows multiple users to draw together in real time, featuring live notifications, real-time shape updates, and room-based collaboration.

## 🚀 Getting Started

### 1️⃣ Prerequisites
Ensure you have the following installed:
- **Node.js** (>=18.x)
- **pnpm** (package manager)
- **PostgreSQL** (if using a database)

### 2️⃣ Install Dependencies
Run the following command to install all dependencies:
pnpm install


### 🛠 Tech Stack
Backend	    Node.js, Express, WebSockets
Database	PostgreSQL (via Prisma ORM)
Real-time	WebSocket
Monorepo	Turborepo

### 📂 Environment Variables
DATABASE_URL=postgres://user:password@localhost:5432/livesketch
PORT=5000  # Change accordingly

### 3️⃣ Setup Prisma
cd packages/db
pnpm prisma generate  # Generate Prisma client
pnpm prisma migrate dev --name init  # Run migrations

### 4️⃣ Start the HTTP Backend
cd apps/http-backend
pnpm run dev

### 5️⃣ Start the WebSocket Backend
cd apps/ws-backend
pnpm run dev

### 6️⃣ Running the Entire Monorepo
pnpm dev
