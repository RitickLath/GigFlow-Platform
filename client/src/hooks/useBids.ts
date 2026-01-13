import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  createBid,
  fetchBidsByGig,
  fetchMyBids,
  hireBid,
} from "../services/bid.service";
import { gigKeys, bidKeys } from "./queryKeys";
import type { CreateBidInput } from "../services/types";

// Re-export bidKeys for convenience
export { bidKeys };

// Fetch bids for a specific gig (owner only)
export const useBidsByGig = (gigId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: bidKeys.byGig(gigId),
    queryFn: () => fetchBidsByGig(gigId),
    enabled: !!gigId && enabled,
  });
};

// Fetch current user's bids
export const useMyBids = () => {
  return useQuery({
    queryKey: bidKeys.my(),
    queryFn: fetchMyBids,
  });
};

// Submit a new bid
export const useCreateBid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBidInput) => createBid(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: bidKeys.all });
      toast.success(data.message || "Bid submitted successfully!");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to submit bid");
    },
  });
};

// Hire a freelancer
export const useHireBid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bidId: string) => hireBid(bidId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: gigKeys.all });
      queryClient.invalidateQueries({ queryKey: bidKeys.all });
      toast.success(data.message || "Freelancer hired successfully!");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to hire freelancer");
    },
  });
};
