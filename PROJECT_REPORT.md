# Technical Project Report: SaaS Marketplace Platform

## 1. Project Overview
The **SaaS Marketplace** is a full-stack (MERN) application designed to facilitate the buying and selling of software-as-a-service (SaaS) products. It provides a robust platform for developers (Sellers) to list their projects, for users (Buyers) to purchase or subscribe to them, and for administrators (Admins) to moderate content and manage the platform.

---

## 2. Technology Stack

### Frontend (Client-side)
*   **Framework**: [React 19](https://react.dev/) - Utilizing the latest features and improved rendering.
*   **Build Tool**: [Vite](https://vitejs.dev/) - Provides a fast development environment and optimized production builds.
*   **Language**: [TypeScript](https://www.typescriptlang.org/) - Ensures type safety and better developer experience.
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapid and consistent UI development.
*   **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react) - A library of beautiful, simple icons.
*   **Animations**: [Framer Motion](https://www.framer.com/motion/) - Used for smooth transitions and interactive UI elements.
*   **Charts**: [Recharts](https://recharts.org/) - For data visualization in the Seller and Admin dashboards.
*   **Routing**: [React Router Dom v7](https://reactrouter.com/) - For handling client-side navigation.
*   **Notifications**: [React Hot Toast](https://react-hot-toast.com/) - For user feedback through toast notifications.

### Backend (Server-side)
*   **Runtime**: [Node.js](https://nodejs.org/)
*   **Framework**: [Express.js v5](https://expressjs.com/) - A fast, unopinionated, minimalist web framework for Node.js.
*   **Language**: [JavaScript (CommonJS)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#commonjs_modules)
*   **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/) & [bcryptjs](https://www.npmjs.com/package/bcryptjs) for secure password hashing.
*   **Validation**: [Joi](https://joi.dev/) - Schema description language and data validator for JavaScript.
*   **Logging**: [Morgan](https://www.npmjs.com/package/morgan) - HTTP request logger middleware.

### Database
*   **Database**: [MongoDB](https://www.mongodb.com/) - A NoSQL, document-oriented database.
*   **ORM/ODM**: [Mongoose](https://mongoosejs.com/) - Provides a straight-forward, schema-based solution to model application data.

---

## 3. Core Architecture & Workflows

### User Roles & Permissions
1.  **Buyer**: Can browse the marketplace, search for listings, save projects, and purchase or subscribe to SaaS products.
2.  **Seller**: Can create and manage their own listings, track sales, and view customer analytics.
3.  **Admin**: Has full platform access, including user management, listing moderation (approve/reject), and global platform settings.

### Authentication Workflow
The system uses a stateful authentication approach combined with JWTs.
1.  User registers/logins via `/api/v1/auth`.
2.  The server generates a JWT and sends it back.
3.  The frontend stores the token in `localStorage` and provides it in the `Authorization` header for subsequent requests.
4.  `AuthContext` handles the global user state across the React application.

### Moderation Workflow
1.  A Seller creates a listing (Status: `pending`).
2.  The listing appears in the Admin's **Moderation Queue**.
3.  An Admin reviews and updates the status to `approved` or `rejected`.
4.  Only `approved` listings are visible in the public marketplace.

### Subscription System
The platform supports both one-time purchases and subscription-based (monthly/yearly) models.
*   Orders track the transaction history.
*   Subscriptions manage the lifecycle (active, cancelled, expired) using next billing dates.

---

## 4. Security Implementation
*   **Helmet**: Sets various HTTP headers to secure the app.
*   **CORS**: Cross-Origin Resource Sharing is configured to only allow requests from the trusted frontend URL.
*   **Rate Limiting**: Prevents brute-force attacks by limiting requests from a single IP.
*   **HPP**: Prevents HTTP Parameter Pollution.
*   **Data Sanitization**: Cleaning user input to prevent NoSQL injection attacks.
*   **Environment Variables**: Securely managed using `dotenv` and validated via `envalid`.

---

## 5. Project Directory Structure

```text
/saas-marketplace (Root)
├── package.json          # Frontend dependencies & scripts
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind CSS design tokens
├── /src                  # Frontend Source Code
│   ├── /components       # Reusable UI components
│   ├── /context          # Auth & Global state
│   ├── /pages            # Page-level components (Landing, Dashboard, etc.)
│   ├── /lib              # Utility functions (shadcn/ui utils)
│   └── App.tsx           # Main application router
├── /server               # Backend Source Code
│   ├── server.js         # Entry point (Starts the server)
│   ├── package.json      # Backend dependencies & scripts
│   ├── .env              # Sensitive configuration
│   └── /src
│       ├── /models       # Mongoose Schemas (User, Listing, Order, etc.)
│       ├── /controllers  # Logic for handling requests
│       ├── /routes       # API endpoint definitions
│       └── /middlewares  # Authentication & Error handling layers
```

---

## 6. Key Dependencies (Significant Packages)

| Package Category | Backend | Frontend |
|------------------|---------|----------|
| **Core** | `express`, `mongoose` | `react`, `react-dom`, `vite` |
| **Security** | `helmet`, `cors`, `bcryptjs`, `jsonwebtoken` | - |
| **Logic/Data** | `joi`, `envalid` | `recharts`, `react-router-dom` |
| **UI/UX** | - | `tailwindcss`, `framer-motion`, `lucide-react` |
| **Utility** | `morgan`, `dotenv` | `clsx`, `tailwind-merge` |

---

## 7. Database Models (Mongoose)
1.  **User**: Stores profile info, roles (Admin, Seller, Buyer), and authentication credentials.
2.  **Listing**: Contains SaaS project details (Title, Description, Price, Status, Category, Stats).
3.  **Order**: Tracks every transaction, linking a Buyer, Seller, and Listing.
4.  **PlatformSettings**: A singleton document for global site config (Maintenance mode, Fees).
5.  **AdminLog**: Tracks administrative actions for audit purposes.

---

## 8. Setup & Development
1.  **Database**: Requires MongoDB running on `localhost:27017`.
2.  **Backend**: `cd server` -> `npm install` -> `npm run dev` (Runs on port 5000).
3.  **Frontend**: `npm install` -> `npm run dev` (Runs on port 5173).
4.  **Environment Variables**: `.env` file must be present in the `server` folder with variables like `MONGO_URI`, `JWT_SECRET`, and `NODE_ENV`.

---
*Report Generated: 2026-03-19*
