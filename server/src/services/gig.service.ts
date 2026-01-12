import { Gig, type IGig } from "../models/gig.model.js";
import type {
  CreateGigInput,
  GigQueryInput,
  PaginatedResponse,
} from "../types/gig.type.js";
import {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
  ConflictError,
} from "../utils/error.util.js";

class GigService {
  async getAllGigs(query: GigQueryInput): Promise<PaginatedResponse<IGig>> {
    const { page, limit, search, status } = query;
    const skip = (page - 1) * limit;

    // Build filter
    const filter: Record<string, unknown> = {};

    // Default to open gigs unless specified
    filter.status = status || "open";

    // Search by title (text search)
    if (search && search.length > 3) {
      filter.$text = { $search: search };
    }

    // Get total count and gigs
    const [gigs, totalItems] = await Promise.all([
      Gig.find(filter)
        .populate("ownerId", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Gig.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: gigs,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async getGigById(gigId: string): Promise<IGig> {
    const gig = await Gig.findById(gigId).populate("ownerId", "name email");

    if (!gig) {
      throw new NotFoundError("Gig not found");
    }

    return gig;
  }

  async createGig(data: CreateGigInput): Promise<IGig> {
    const { title, description, budget, ownerId } = data;

    // Check if same user already has a gig with same title
    const duplicateTitle = await Gig.findOne({
      ownerId,
      title: { $regex: new RegExp(`^${title}$`, "i") },
    });
    if (duplicateTitle) {
      throw new ConflictError("You already have a gig with this title");
    }

    // Limit active open gigs per user (prevent spam)
    const openGigsCount = await Gig.countDocuments({
      ownerId,
      status: "open",
    });
    if (openGigsCount >= 10) {
      throw new BadRequestError(
        "You can only have 10 open gigs at a time. Close some gigs first or Enroll for premium."
      );
    }

    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId,
      status: "open",
    });

    return gig;
  }

  // TODO: Pagination
  async getMyGigs(userId: string): Promise<IGig[]> {
    const gigs = await Gig.find({ ownerId: userId }).sort({ createdAt: -1 });
    return gigs;
  }

  async deleteGig(gigId: string, userId: string): Promise<void> {
    const gig = await Gig.findById(gigId);

    if (!gig) {
      throw new NotFoundError("Gig not found");
    }

    if (gig.ownerId.toString() !== userId) {
      throw new ForbiddenError("You can only delete your own gigs");
    }

    if (gig.status === "assigned") {
      throw new BadRequestError("Cannot delete an assigned gig");
    }

    await Gig.findByIdAndDelete(gigId);
  }
}

export const gigService = new GigService();
