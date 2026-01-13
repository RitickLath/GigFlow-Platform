// User Types
export interface User {
  id: string;
  name: string;
  email: string;
}

// Gig Types
export interface GigOwner {
  _id: string;
  name: string;
  email: string;
}

export interface Gig {
  _id: string;
  title: string;
  description: string;
  budget: number;
  status: "open" | "assigned";
  ownerId: GigOwner;
  hiredFreelancerId?: string;
  hiredBidId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGigInput {
  title: string;
  description: string;
  budget: number;
}

// Bid Types
export interface BidFreelancer {
  _id: string;
  name: string;
  email: string;
}

export interface BidGig {
  _id: string;
  title: string;
  budget: number;
  status: "open" | "assigned";
}

export interface Bid {
  _id: string;
  gigId: string | BidGig;
  freelancerId: string | BidFreelancer;
  message: string;
  price: number;
  status: "pending" | "hired" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface CreateBidInput {
  gigId: string;
  message: string;
  price: number;
}

// Pagination Types
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GigsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "open" | "assigned";
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: PaginationInfo;
}
