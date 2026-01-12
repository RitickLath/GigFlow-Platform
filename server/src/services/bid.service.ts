import mongoose from "mongoose";
import { Bid, type IBid } from "../models/bid.model.js";
import { Gig } from "../models/gig.model.js";
import type { CreateBidInput, HireResult } from "../types/bid.type.js";
import {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
  ConflictError,
} from "../utils/error.util.js";

class BidService {
  async createBid(data: CreateBidInput): Promise<IBid> {
    const { gigId, freelancerId, message, price } = data;

    // 1. Check if gig exists and is open
    const gig = await Gig.findById(gigId);
    if (!gig) {
      throw new NotFoundError("Gig not found");
    }
    if (gig.status !== "open") {
      throw new BadRequestError("This gig is no longer accepting bids");
    }

    // 2. Prevent gig owner from bidding on their own gig
    if (gig.ownerId.toString() === freelancerId) {
      throw new ForbiddenError("You cannot bid on your own gig");
    }

    // 3. Check for duplicate bid
    const existingBid = await Bid.findOne({ gigId, freelancerId });
    if (existingBid) {
      throw new ConflictError("You have already submitted a bid for this gig");
    }

    const bid = await Bid.create({
      gigId,
      freelancerId,
      message,
      price,
      status: "pending",
    });

    return bid;
  }

  async getBidsByGig(gigId: string, requesterId: string): Promise<IBid[]> {
    // 1. Check if gig exists
    const gig = await Gig.findById(gigId);
    if (!gig) {
      throw new NotFoundError("Gig not found");
    }

    // 2. Only gig owner can view all bids
    if (gig.ownerId.toString() !== requesterId) {
      throw new ForbiddenError("Only the gig owner can view bids");
    }

    // 3. TODO: POSSIBILITY OF PAGINATION REQUIREMENT
    const bids = await Bid.find({ gigId })
      .populate("freelancerId", "name email")
      .sort({ createdAt: -1 });

    return bids;
  }

  async getMyBids(freelancerId: string): Promise<IBid[]> {
    // 1. TODO: POSSIBILITY OF PAGINATION REQUIREMENT
    const bids = await Bid.find({ freelancerId })
      .populate("gigId", "title budget status")
      .sort({ createdAt: -1 });

    return bids;
  }

  // Hire logic with atomic update
  async hireBid(bidId: string, requesterId: string): Promise<HireResult> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Get the bid
      const bid = await Bid.findById(bidId).session(session);
      if (!bid) {
        throw new NotFoundError("Bid not found");
      }

      // 2. Get the gig
      const gig = await Gig.findById(bid.gigId).session(session);
      if (!gig) {
        throw new NotFoundError("Gig not found");
      }

      // 3. Verify requester is the gig owner
      if (gig.ownerId.toString() !== requesterId) {
        throw new ForbiddenError("Only the gig owner can hire freelancers");
      }

      // 4. Check gig is still open (preventing race condition)
      if (gig.status !== "open") {
        throw new BadRequestError("This gig has already been assigned");
      }

      // 5. Update gig status to "assigned"
      gig.status = "assigned";
      gig.hiredFreelancerId = bid.freelancerId;
      gig.hiredBidId = bid._id as mongoose.Types.ObjectId;
      await gig.save({ session });

      // 6. Mark chosen bid as "hired"
      bid.status = "hired";
      await bid.save({ session });

      // 7. Reject all other bids for this gig
      const rejectResult = await Bid.updateMany(
        { gigId: bid.gigId, _id: { $ne: bidId } },
        { status: "rejected" },
        { session }
      );

      // Commit transaction
      await session.commitTransaction();

      return {
        gig: {
          id: gig._id.toString(),
          title: gig.title,
          status: gig.status,
        },
        hiredBid: {
          id: bid._id.toString(),
          freelancerId: bid.freelancerId.toString(),
          price: bid.price,
        },
        rejectedCount: rejectResult.modifiedCount,
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}

export const bidService = new BidService();
