import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  fetchGigs,
  fetchGigById,
  fetchMyGigs,
  createGig,
  deleteGig,
} from "../services/gig.service";
import { gigKeys } from "./queryKeys";
import type { GigsQueryParams, CreateGigInput } from "../services/types";

// Re-export gigKeys for convenience
export { gigKeys };

// Fetch all gigs with search/pagination
export const useGigs = (params: GigsQueryParams = {}) => {
  return useQuery({
    queryKey: gigKeys.list(params),
    queryFn: () => fetchGigs(params),
  });
};

// Fetch single gig by ID
export const useGig = (id: string) => {
  return useQuery({
    queryKey: gigKeys.detail(id),
    queryFn: () => fetchGigById(id),
    enabled: !!id,
  });
};

// Fetch current user's gigs
export const useMyGigs = () => {
  return useQuery({
    queryKey: gigKeys.my(),
    queryFn: fetchMyGigs,
  });
};

// Create a new gig
export const useCreateGig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGigInput) => createGig(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: gigKeys.all });
      toast.success(data.message || "Gig created successfully!");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to create gig");
    },
  });
};

// Delete a gig
export const useDeleteGig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteGig(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: gigKeys.all });
      toast.success(data.message || "Gig deleted successfully!");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to delete gig");
    },
  });
};
