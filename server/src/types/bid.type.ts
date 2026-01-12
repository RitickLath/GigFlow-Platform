export interface CreateBidInput {
  gigId: string;
  freelancerId: string;
  message: string;
  price: number;
}

export interface HireResult {
  gig: {
    id: string;
    title: string;
    status: string;
  };
  hiredBid: {
    id: string;
    freelancerId: string;
    price: number;
  };
  rejectedCount: number;
}
