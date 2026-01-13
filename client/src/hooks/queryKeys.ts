import type { GigsQueryParams } from "../services/types";

// Gig query keys
export const gigKeys = {
  all: ["gigs"] as const,
  lists: () => [...gigKeys.all, "list"] as const,
  list: (params: GigsQueryParams) => [...gigKeys.lists(), params] as const,
  details: () => [...gigKeys.all, "detail"] as const,
  detail: (id: string) => [...gigKeys.details(), id] as const,
  my: () => [...gigKeys.all, "my"] as const,
};

// Bid query keys
export const bidKeys = {
  all: ["bids"] as const,
  byGig: (gigId: string) => [...bidKeys.all, "gig", gigId] as const,
  my: () => [...bidKeys.all, "my"] as const,
};
