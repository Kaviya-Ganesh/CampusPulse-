# CampusPulse - Software Patterns Lab Demo

A full-stack web application showcasing BEFORE and AFTER refactoring using GoF design patterns.

## Tech Stack
- Frontend: React + Vite + TailwindCSS
- Backend: Node.js + Express
- Database: In-memory arrays (No external DB needed)

## How to Run

### 1. Start the Backend
Open a terminal and run:
```bash
cd backend
npm install
npm run dev
```

### 2. Start the Frontend
Open another terminal and run:
```bash
cd frontend
npm install
npm run dev
```

## Patterns Showcased (AFTER Refactoring)
1. **Decorator Pattern**: Replaced inline middleware/checks (Auth, Error Handling, Logging) with reusable wrapper functions.
2. **Factory Pattern**: Centralized the creation of Events via `EventFactory`.
3. **Strategy Pattern**: Replaced generic if-else trees with polymorphic behavior for notifications (`SendEmailStrategy`, `SendSMSStrategy`).
4. **Observer Pattern**: Established an `EventBus` pub-sub system. Decoupled the booking handler from subsequent operations like notifications and analytics.

**Note:** Both routes work and produce the exact same outcome, highlighting the difference in code architecture. Compare `backend/before/bookingHandler.before.js` with `backend/after/bookingHandler.after.js`.
