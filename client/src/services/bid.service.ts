import api from "../api/axios";
import type { Bid, CreateBidInput, ApiResponse } from "./types";

// Submit a bid for a gig
export const createBid = async (
  data: CreateBidInput
): Promise<ApiResponse<Bid>> => {
  const response = await api.post("/bids", data);
  return response.data;
};

// Fetch all bids for a specific gig (owner only)
export const fetchBidsByGig = async (
  gigId: string
): Promise<ApiResponse<Bid[]>> => {
  const response = await api.get(`/bids/${gigId}`);
  return response.data;
};

// Fetch current user's bids
export const fetchMyBids = async (): Promise<ApiResponse<Bid[]>> => {
  const response = await api.get("/bids/my");
  return response.data;
};

// Hire a freelancer
export const hireBid = async (
  bidId: string
): Promise<
  ApiResponse<{ gig: object; hiredBid: object; rejectedCount: number }>
> => {
  const response = await api.patch(`/bids/${bidId}/hire`);
  return response.data;
};
