import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";
import type { Gig } from "../generic/GigCard";

interface Bid {
  _id: string;
  gigId: {
    _id: string;
    title: string;
    budget: number;
    status: "open" | "assigned";
  };
  message: string;
  price: number;
  status: "pending" | "hired" | "rejected";
  createdAt: string;
}

type TabType = "my-gigs" | "my-bids";

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("my-gigs");

  // My Gigs State
  const [myGigs, setMyGigs] = useState<Gig[]>([]);
  const [gigsLoading, setGigsLoading] = useState(true);

  // My Bids State
  const [myBids, setMyBids] = useState<Bid[]>([]);
  const [bidsLoading, setBidsLoading] = useState(true);

  const fetchMyGigs = async () => {
    try {
      setGigsLoading(true);
      const response = await api.get("/gigs/my");
      if (response.data.success) {
        setMyGigs(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching my gigs:", err);
    } finally {
      setGigsLoading(false);
    }
  };

  const fetchMyBids = async () => {
    try {
      setBidsLoading(true);
      const response = await api.get("/bids/my");
      if (response.data.success) {
        setMyBids(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching my bids:", err);
    } finally {
      setBidsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyGigs();
    fetchMyBids();
  }, []);

  const handleDeleteGig = async (gigId: string) => {
    if (!confirm("Are you sure you want to delete this gig?")) return;

    try {
      const response = await api.delete(`/gigs/${gigId}`);
      if (response.data.success) {
        toast.success("Gig deleted successfully");
        fetchMyGigs();
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to delete gig");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatBudget = (budget: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(budget);
  };

  // Stats calculation
  const stats = {
    totalGigs: myGigs.length,
    openGigs: myGigs.filter((g) => g.status === "open").length,
    assignedGigs: myGigs.filter((g) => g.status === "assigned").length,
    totalBids: myBids.length,
    pendingBids: myBids.filter((b) => b.status === "pending").length,
    hiredBids: myBids.filter((b) => b.status === "hired").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Welcome back, {user?.name?.split(" ")[0] || "User"}!
              </h1>
              <p className="text-gray-500 mt-1">
                Manage your gigs and track your bids
              </p>
            </div>
            <Link
              to="/create-gig"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
            >
              + Post New Gig
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-gray-500 text-sm">My Gigs</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalGigs}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-gray-500 text-sm">Open</p>
            <p className="text-2xl font-bold text-emerald-600">
              {stats.openGigs}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-gray-500 text-sm">Assigned</p>
            <p className="text-2xl font-bold text-blue-600">
              {stats.assignedGigs}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-gray-500 text-sm">My Bids</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalBids}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-gray-500 text-sm">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.pendingBids}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-gray-500 text-sm">Hired</p>
            <p className="text-2xl font-bold text-emerald-600">
              {stats.hiredBids}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100">
            <div className="flex">
              <button
                onClick={() => setActiveTab("my-gigs")}
                className={`flex-1 sm:flex-none px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === "my-gigs"
                    ? "text-emerald-600 border-b-2 border-emerald-500 bg-emerald-50/50"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                My Gigs ({stats.totalGigs})
              </button>
              <button
                onClick={() => setActiveTab("my-bids")}
                className={`flex-1 sm:flex-none px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === "my-bids"
                    ? "text-emerald-600 border-b-2 border-emerald-500 bg-emerald-50/50"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                My Bids ({stats.totalBids})
              </button>
            </div>
          </div>

          {/* My Gigs Tab */}
          {activeTab === "my-gigs" && (
            <div className="p-4 sm:p-6">
              {gigsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : myGigs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    No gigs yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Create your first gig to start receiving bids
                  </p>
                  <Link
                    to="/create-gig"
                    className="inline-flex items-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                  >
                    Create Gig
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {myGigs.map((gig) => (
                    <div
                      key={gig._id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Link
                            to={`/gigs/${gig._id}`}
                            className="font-semibold text-gray-900 hover:text-emerald-600 transition-colors"
                          >
                            {gig.title}
                          </Link>
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                              gig.status === "open"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {gig.status}
                          </span>
                        </div>
                        <p className="text-gray-500 text-sm">
                          {formatBudget(gig.budget)} • Posted{" "}
                          {formatDate(gig.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/gigs/${gig._id}`}
                          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-lg transition-colors"
                        >
                          View
                        </Link>
                        {gig.status === "open" && (
                          <button
                            onClick={() => handleDeleteGig(gig._id)}
                            className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* My Bids Tab */}
          {activeTab === "my-bids" && (
            <div className="p-4 sm:p-6">
              {bidsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : myBids.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    No bids yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Browse gigs and submit your proposals
                  </p>
                  <Link
                    to="/gigs"
                    className="inline-flex items-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                  >
                    Browse Gigs
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {myBids.map((bid) => (
                    <div
                      key={bid._id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Link
                            to={`/gigs/${bid.gigId._id}`}
                            className="font-semibold text-gray-900 hover:text-emerald-600 transition-colors"
                          >
                            {bid.gigId.title}
                          </Link>
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${
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
                        <p className="text-gray-500 text-sm mb-2">
                          Your bid: {formatBudget(bid.price)} • Submitted{" "}
                          {formatDate(bid.createdAt)}
                        </p>
                        <p className="text-gray-600 text-sm line-clamp-1">
                          {bid.message}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-xs text-gray-400">Gig Budget</p>
                          <p className="font-semibold text-gray-900">
                            {formatBudget(bid.gigId.budget)}
                          </p>
                        </div>
                        <Link
                          to={`/gigs/${bid.gigId._id}`}
                          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-lg transition-colors"
                        >
                          View Gig
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Recent Activity Summary */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-xl font-bold text-gray-900">
                    {stats.totalBids > 0
                      ? Math.round((stats.hiredBids / stats.totalBids) * 100)
                      : 0}
                    %
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Projects</p>
                  <p className="text-xl font-bold text-gray-900">
                    {stats.assignedGigs + stats.hiredBids}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
