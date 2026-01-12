export interface CreateGigInput {
  title: string;
  description: string;
  budget: number;
  ownerId: string;
}

export interface GigQueryInput {
  page: number;
  limit: number;
  search?: string;
  status?: "open" | "assigned";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
