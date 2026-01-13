# GigFlow Platform

A mini-freelance marketplace platform where Clients can post jobs (Gigs) and Freelancers can apply for them (Bids).

## Features

### Core Features

- **User Authentication**: Secure sign-up and login with JWT HttpOnly cookies
- **Fluid Roles**: Any user can post a gig (Client) or bid on a gig (Freelancer)
- **Gig Management**: Create, browse, search, and delete gigs
- **Bidding System**: Submit proposals with message and price
- **Hiring Logic**: Hire freelancers with atomic transaction support

### Technical Highlights

- MongoDB Transactions for race condition prevention
- HttpOnly cookie authentication
- Search and pagination
- Context API for state management
- Responsive UI with Tailwind CSS

## Tech Stack

| Layer                | Technology                                  |
| -------------------- | ------------------------------------------- |
| **Frontend**         | React.js (Vite) + TypeScript + Tailwind CSS |
| **Backend**          | Node.js + Express.js + TypeScript           |
| **Database**         | MongoDB (Mongoose)                          |
| **State Management** | Context API                                 |
| **Authentication**   | JWT with HttpOnly Cookies                   |

## 📁 Project Structure

```
GigFlow-Platform/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/           # Axios instance
│   │   ├── components/    # UI & Generic components
│   │   ├── hooks/         # Custom hooks (useAuth)
│   │   └── App.tsx        # Main app with routes
│   └── package.json
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── middlewares/   # Auth middleware
│   │   └── utils/         # Error handling, validation
│   └── package.json
│
└── README.md
```

## API Endpoints

### Authentication

| Method | Endpoint                | Description                 |
| ------ | ----------------------- | --------------------------- |
| POST   | `/api/v1/auth/register` | Register new user           |
| POST   | `/api/v1/auth/login`    | Login & set HttpOnly cookie |
| POST   | `/api/v1/auth/logout`   | Logout user                 |
| GET    | `/api/v1/auth/me`       | Get current user            |

### Gigs

| Method | Endpoint           | Description                                  |
| ------ | ------------------ | -------------------------------------------- |
| GET    | `/api/v1/gigs`     | Fetch all open gigs (with search/pagination) |
| GET    | `/api/v1/gigs/:id` | Get single gig                               |
| GET    | `/api/v1/gigs/my`  | Get user's gigs (protected)                  |
| POST   | `/api/v1/gigs`     | Create new gig (protected)                   |
| DELETE | `/api/v1/gigs/:id` | Delete a gig (protected)                     |

### Bids

| Method | Endpoint                   | Description                         |
| ------ | -------------------------- | ----------------------------------- |
| POST   | `/api/v1/bids`             | Submit a bid (protected)            |
| GET    | `/api/v1/bids/my`          | Get user's bids (protected)         |
| GET    | `/api/v1/bids/:gigId`      | Get all bids for a gig (owner only) |
| PATCH  | `/api/v1/bids/:bidId/hire` | Hire a freelancer (atomic)          |

## Database Schema

### User

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed)
}
```

### Gig

```javascript
{
  title: String,
  description: String,
  budget: Number,
  ownerId: ObjectId (ref: User),
  status: "open" | "assigned",
  hiredFreelancerId: ObjectId (optional),
  hiredBidId: ObjectId (optional)
}
```

### Bid

```javascript
{
  gigId: ObjectId (ref: Gig),
  freelancerId: ObjectId (ref: User),
  message: String,
  price: Number,
  status: "pending" | "hired" | "rejected"
}
```

## ⚡ Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/GigFlow-Platform.git
cd GigFlow-Platform
```

2. **Setup Backend**

```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
```

3. **Setup Frontend**

```bash
cd client
npm install
npm run dev
```

4. **Access the app**

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=3001
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/gigflow
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:5173
```

## Hiring Logic (Bonus 1: Transactional Integrity)

The hiring process uses MongoDB transactions to ensure atomicity and prevent race conditions:

```javascript
// In bid.service.ts - hireBid()
const session = await mongoose.startSession();
session.startTransaction();

try {
  // 1. Get bid and gig within transaction
  // 2. Verify ownership and gig status
  // 3. Update gig status to "assigned"
  // 4. Mark chosen bid as "hired"
  // 5. Reject all other bids atomically
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
}
```

This ensures that if two people click "Hire" simultaneously, only one succeeds.

## Screenshots

### Landing Page

Clean, modern landing page with hero section and feature highlights.

### Gig Listing

Browse all open gigs with search functionality and pagination.

### Dashboard

View your posted gigs and submitted bids with stats overview.

### Gig Detail

View gig details, place bids, and hire freelancers.
