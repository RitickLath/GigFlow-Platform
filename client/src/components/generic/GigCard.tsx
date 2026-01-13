import { Link } from "react-router-dom";
import type { Gig } from "../../services/types";

interface GigCardProps {
  gig: Gig;
}

const GigCard = ({ gig }: GigCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const formatBudget = (budget: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(budget);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
  };

  return (
    <Link
      to={`/gigs/${gig._id}`}
      className="block p-6 bg-white rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/10 transition-all group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <span
          className={`px-2.5 py-1 text-xs font-medium rounded-full ${
            gig.status === "open"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {gig.status === "open" ? "Open" : "Assigned"}
        </span>
        <span className="text-gray-400 text-sm">
          {formatDate(gig.createdAt)}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
        {truncateText(gig.title, 60)}
      </h3>

      {/* Description */}
      <p className="text-gray-500 text-sm mb-4 line-clamp-2">
        {truncateText(gig.description, 120)}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        {/* Owner */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
            {gig.ownerId?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <span className="text-gray-600 text-sm">
            {gig.ownerId?.name || "Unknown"}
          </span>
        </div>

        {/* Budget */}
        <div className="text-right">
          <p className="text-xs text-gray-400">Budget</p>
          <p className="text-emerald-600 font-bold">
            {formatBudget(gig.budget)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;
