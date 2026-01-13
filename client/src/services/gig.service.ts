import api from "../api/axios";
import type {
  Gig,
  CreateGigInput,
  GigsQueryParams,
  ApiResponse,
  PaginatedResponse,
} from "./types";

// Fetch all gigs with optional search and pagination
export const fetchGigs = async (
  params: GigsQueryParams = {}
): Promise<PaginatedResponse<Gig[]>> => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.append("page", params.page.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());
  if (params.search) searchParams.append("search", params.search);
  if (params.status) searchParams.append("status", params.status);

  const response = await api.get(`/gigs?${searchParams.toString()}`);
  return response.data;
};

// Fetch single gig by ID
export const fetchGigById = async (id: string): Promise<ApiResponse<Gig>> => {
  const response = await api.get(`/gigs/${id}`);
  return response.data;
};

// Fetch current user's gigs
export const fetchMyGigs = async (): Promise<ApiResponse<Gig[]>> => {
  const response = await api.get("/gigs/my");
  return response.data;
};

// Create a new gig
export const createGig = async (
  data: CreateGigInput
): Promise<ApiResponse<Gig>> => {
  const response = await api.post("/gigs", data);
  return response.data;
};

// Delete a gig
export const deleteGig = async (id: string): Promise<ApiResponse<object>> => {
  const response = await api.delete(`/gigs/${id}`);
  return response.data;
};
