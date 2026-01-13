# GigFlow Platform

A mini-freelance marketplace where Clients can post jobs (Gigs) and Freelancers can apply for them (Bids).

## Tech Stack

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT with HttpOnly cookies
- **Validation:** Zod

### Frontend

- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS
- **State Management:** Redux Toolkit / Context API

## Features

### User Authentication

- Secure Sign-up and Login
- JWT tokens stored in HttpOnly cookies
- Password hashing with bcrypt
- Fluid roles (any user can be Client or Freelancer)

### Gig Management

- Browse all open gigs
- Search gigs by title
- Pagination support
- Create new job posts
- Delete own gigs

### Bidding System

- Submit bids with message and price
- View all bids for your gig (Owner only)
- View your submitted bids

### Hiring Logic (Atomic)

- Hire a freelancer with single click
- Gig status → "assigned"
- Chosen bid → "hired"
- Other bids → "rejected"
- **MongoDB Transactions** for race condition prevention

## API Endpoints

### Authentication

| Method | Endpoint                | Description           |
| ------ | ----------------------- | --------------------- |
| POST   | `/api/v1/auth/register` | Register new user     |
| POST   | `/api/v1/auth/login`    | Login & set cookie    |
| POST   | `/api/v1/auth/logout`   | Logout & clear cookie |
| GET    | `/api/v1/auth/me`       | Get current user      |

### Gigs

| Method | Endpoint           | Description        |
| ------ | ------------------ | ------------------ |
| GET    | `/api/v1/gigs`     | Get all open gigs  |
| GET    | `/api/v1/gigs/:id` | Get single gig     |
| GET    | `/api/v1/gigs/my`  | Get my posted gigs |
| POST   | `/api/v1/gigs`     | Create new gig     |
| DELETE | `/api/v1/gigs/:id` | Delete gig         |

### Bids

| Method | Endpoint                   | Description        |
| ------ | -------------------------- | ------------------ |
| POST   | `/api/v1/bids`             | Submit a bid       |
| GET    | `/api/v1/bids/my`          | Get my bids        |
| GET    | `/api/v1/bids/:gigId`      | Get bids for a gig |
| PATCH  | `/api/v1/bids/:bidId/hire` | Hire freelancer    |

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to server directory:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create environment file:

   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your values:

   ```env
   PORT=3000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/gigflow
   JWT_SECRET=your_secret_key
   CLIENT_URL=http://localhost:5173
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to client directory:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
GigFlow-Platform/
├── client/                 # React frontend
│   ├── src/
│   └── ...
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/        # Database config
│   │   ├── controllers/   # Route handlers
│   │   ├── middlewares/   # Auth, error handling
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── types/         # TypeScript types
│   │   ├── utils/         # Validation, errors
│   │   └── index.ts       # Entry point
│   ├── .env.example
│   └── package.json
└── README.md
```

## Bonus Features

### Bonus 1: Transactional Integrity

Implemented MongoDB transactions in the hire logic to prevent race conditions:

- Uses `mongoose.startSession()` and `startTransaction()`
- Atomic updates for gig status, bid status, and rejections
- If two people click "Hire" simultaneously, only one succeeds

### 🔲 Bonus 2: Real-time Updates

Socket.io integration for instant notifications (To be implemented)

## Environment Variables

| Variable     | Description               | Default               |
| ------------ | ------------------------- | --------------------- |
| `PORT`       | Server port               | 3000                  |
| `NODE_ENV`   | Environment               | development           |
| `MONGO_URI`  | MongoDB connection string | -                     |
| `JWT_SECRET` | Secret for JWT signing    | -                     |
| `CLIENT_URL` | Frontend URL for CORS     | http://localhost:5173 |

## License

MIT
