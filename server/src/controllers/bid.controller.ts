import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { bidService } from "../services/bid.service.js";
import { validateCreateBid } from "../utils/validation.util.js";
import { BadRequestError } from "../utils/error.util.js";

// Submit a bid for a gig
export const createBid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      throw new BadRequestError("User not authenticated");
    }

    // 1. Validate input
    const validation = validateCreateBid(req.body);
    if (!validation.success) {
      throw new BadRequestError(
        validation.error.issues[0]?.message || "Invalid input"
      );
    }

    // 2. Validate gigId is valid ObjectId
    if (!mongoose.isValidObjectId(validation.data.gigId)) {
      throw new BadRequestError("Invalid gig ID");
    }

    // 3. Call service
    const bid = await bidService.createBid({
      ...validation.data,
      freelancerId: userId,
    });

    res.status(201).json({
      success: true,
      message: "Bid submitted successfully",
      data: bid,
    });
  } catch (error) {
    next(error);
  }
};

// Get all bids for a specific gig (Owner only)
export const getBidsByGig = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { gigId } = req.params;
    const userId = req.userId;

    if (!userId) {
      throw new BadRequestError("User not authenticated");
    }

    if (
      !gigId ||
      typeof gigId !== "string" ||
      !mongoose.isValidObjectId(gigId)
    ) {
      throw new BadRequestError("Invalid gig ID");
    }

    const bids = await bidService.getBidsByGig(gigId, userId);

    res.status(200).json({
      success: true,
      message: "Bids fetched successfully",
      data: bids,
    });
  } catch (error) {
    next(error);
  }
};

// Get all bids made by current user
export const getMyBids = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      throw new BadRequestError("User not authenticated");
    }

    const bids = await bidService.getMyBids(userId);

    res.status(200).json({
      success: true,
      message: "My bids fetched successfully",
      data: bids,
    });
  } catch (error) {
    next(error);
  }
};

// Hire a freelancer (Atomic update)
export const hireBid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bidId } = req.params;
    const userId = req.userId;

    if (!userId) {
      throw new BadRequestError("User not authenticated");
    }

    if (
      !bidId ||
      typeof bidId !== "string" ||
      !mongoose.isValidObjectId(bidId)
    ) {
      throw new BadRequestError("Invalid bid ID");
    }

    const result = await bidService.hireBid(bidId, userId);

    res.status(200).json({
      success: true,
      message: "Freelancer hired successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
