import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useGig } from "../../hooks/useGigs";
import { useBidsByGig, useCreateBid, useHireBid } from "../../hooks/useBids";
import type { Bid } from "../../services/types";

const GigDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();

  // Queries
  const { data: gigData, isLoading, isError } = useGig(id || "");
  const gig = gigData?.data;
  const isOwner = user && gig && user.id === gig.ownerId?._id;

  const { data: bidsData } = useBidsByGig(id || "", !!isOwner);
  const bids = (bidsData?.data || []) as Bid[];

  // Mutations
  const createBidMutation = useCreateBid();
  const hireMutation = useHireBid();

  // Bid form state
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidPrice, setBidPrice] = useState("");
  const [bidMessage, setBidMessage] = useState("");
  const [bidSuccess, setBidSuccess] = useState(false);

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();

    createBidMutation.mutate(
      {
        gigId: id || "",
        price: Number(bidPrice),
        message: bidMessage,
      },
      {
        onSuccess: () => {
          setBidSuccess(true);
          setShowBidForm(false);
          setBidPrice("");
          setBidMessage("");
        },
      }
    );
  };

  const handleHire = (bidId: string) => {
    hireMutation.mutate(bidId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatBudget = (budget: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(budget);
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Error State
  if (isError || !gig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">Gig not found</p>
          <Link
            to="/gigs"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            Back to Gigs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>

        {/* Main Content */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  gig.status === "open"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {gig.status === "open" ? "Open for Bids" : "Assigned"}
              </span>
              <span className="text-gray-400 text-sm">
                Posted {formatDate(gig.createdAt)}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              {gig.title}
            </h1>

            {/* Owner Info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold">
                {gig.ownerId?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <p className="text-gray-900 font-medium">
                  {gig.ownerId?.name || "Unknown"}
                </p>
                <p className="text-gray-400 text-sm">Client</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Description
            </h2>
            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
              {gig.description}
            </p>
          </div>

          {/* Budget & Actions */}
          <div className="p-6 sm:p-8 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-gray-500 text-sm mb-1">Budget</p>
                <p className="text-3xl font-bold text-emerald-600">
                  {formatBudget(gig.budget)}
                </p>
              </div>

              {/* Action Buttons */}
              {gig.status === "open" && !isOwner && (
                <div>
                  {isLoggedIn ? (
                    bidSuccess ? (
                      <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Bid Submitted!
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowBidForm(!showBidForm)}
                        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25"
                      >
                        {showBidForm ? "Cancel" : "Place a Bid"}
                      </button>
                    )
                  ) : (
                    <Link
                      to="/login"
                      className="inline-block px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
                    >
                      Login to Bid
                    </Link>
                  )}
                </div>
              )}

              {gig.status === "assigned" && (
                <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg">
                  This gig has been assigned
                </div>
              )}
            </div>

            {/* Bid Form */}
            {showBidForm && (
              <form
                onSubmit={handleSubmitBid}
                className="mt-6 p-6 bg-white rounded-xl border border-gray-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Submit Your Bid
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Price (USD)
                    </label>
                    <input
                      type="number"
                      value={bidPrice}
                      onChange={(e) => setBidPrice(e.target.value)}
                      placeholder="Enter your price"
                      required
                      min="1"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Proposal Message
                    </label>
                    <textarea
                      value={bidMessage}
                      onChange={(e) => setBidMessage(e.target.value)}
                      placeholder="Describe why you're the best fit for this project..."
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={createBidMutation.isPending}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-semibold rounded-lg transition-colors"
                  >
                    {createBidMutation.isPending
                      ? "Submitting..."
                      : "Submit Bid"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bids Section (Owner Only) */}
        {isOwner && bids.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                Bids Received ({bids.length})
              </h2>
            </div>

            <div className="divide-y divide-gray-100">
              {bids.map((bid) => {
                const freelancer = bid.freelancerId as {
                  _id: string;
                  name: string;
                  email: string;
                };
                return (
                  <div key={bid._id} className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white font-bold">
                            {freelancer?.name?.charAt(0).toUpperCase() || "F"}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {freelancer?.name || "Freelancer"}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {formatDate(bid.createdAt)}
                            </p>
                          </div>
                          <span
                            className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                              bid.status === "hired"
                                ? "bg-emerald-100 text-emerald-700"
                                : bid.status === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {bid.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-2">{bid.message}</p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-400">Bid Amount</p>
                          <p className="text-xl font-bold text-emerald-600">
                            {formatBudget(bid.price)}
                          </p>
                        </div>

                        {gig.status === "open" && bid.status === "pending" && (
                          <button
                            onClick={() => handleHire(bid._id)}
                            disabled={hireMutation.isPending}
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-medium rounded-lg transition-colors"
                          >
                            {hireMutation.isPending ? "..." : "Hire"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {isOwner && bids.length === 0 && gig.status === "open" && (
          <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-gray-500">
              No bids yet. Your gig is live and visible to freelancers!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GigDetail;
