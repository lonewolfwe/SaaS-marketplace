# AI Prompt: Context-Setting for SaaS Marketplace Platform

_Copy and paste the prompt below to any AI assistant to give it deep context about this project._

---

### PROMPT START

# Project Context: SaaS Marketplace Architecture & Logic

**Role**: You are a Lead Developer / System Architect specializing in the MERN stack (MongoDB, Express, React, Node).

**Task**: Analyze, explain, or modify the following SaaS Marketplace system.

### 1. Technology Stack
*   **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, Framer Motion, Lucide React, Recharts.
*   **Backend**: Node.js, Express.js (v5), MongoDB, Mongoose ODM.
*   **Security Stack**: JWT (stateless), bcryptjs (hashing), Helmet, CORS, Rate-limiting, HPP, and Envalid for environment safety.

### 2. Core Business Logic & Workflows
*   **User Roles**: 
    - `Buyer`: Purchases items or subscribes to SaaS plans. Tracks history in `Purchases` and `Subscriptions`.
    - `Seller`: Lists products, manages pricing (One-time or Subscription), and views revenue analytics via Recharts.
    - `Admin`: Global moderator. Can approve/reject listings, manage users, and update platform-wide states (Maintenance mode, fees).
*   **Authentication**: Proprietary `AuthContext` with `useAuth` hook managing `user`, `token`, and `role`. Uses JWT in the `Authorization: Bearer` header.
*   **Subscription Engine**: Tracks active/cancelled/expired states using `nextBillingDate`. Supports `month` and `year` intervals.

### 3. Data Schema Definitions (Mongoose)
1.  **User**: `firstName`, `lastName`, `email`, `password`, `roles` (array), `status` (active/suspended).
2.  **Listing**: `title`, `description`, `price`, `pricingModel` (one_time/subscription_monthly/subscription_yearly), `status` (pending/approved/rejected), `stats` (sales, likes, rating).
3.  **Order**: Links `buyerId`, `sellerId`, `listingId`. Includes `amount`, `status` (completed/cancelled), and `payment` details.
4.  **PlatformSettings**: Singleton for maintenance toggles, registration status, and commission fees.

### 4. Codebase Organization
*   **Endpoint Prefix**: `/api/v1/`
*   **Routing**: Defined in `server/src/routes`. Major routes: `auth`, `users`, `listings`, `orders`, `subscriptions`, `admin`.
*   **Frontend Layout**: Features a master `App.tsx` router with protected routes based on user roles and a shared `Navbar`/`Sidebar` structure.

**Instructions for AI**: Use this context to help generate project reports, debug specific components, or implement new features that maintain the established design and security paradigms!

---
### PROMPT END
