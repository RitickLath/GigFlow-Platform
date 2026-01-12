import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { gigService } from "../services/gig.service.js";
import { BadRequestError } from "../utils/error.util.js";
import {
  validateCreateGig,
  validateGigQuery,
} from "../utils/validation.util.js";

// Fetch all open gigs (with search & pagination)
export const getAllGigs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Validate query params
    const validation = validateGigQuery(req.query);
    if (!validation.success) {
      throw new BadRequestError(
        validation.error.issues[0]?.message || "Invalid query parameters"
      );
    }

    const { page, limit, search, status } = validation.data;

    // 2. Call service with validated data
    const result = await gigService.getAllGigs({
      page,
      limit,
      search: search || "",
      status: status || "open",
    });

    res.status(200).json({
      success: true,
      message: "Gigs fetched successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// Get gigs posted by current user
export const getMyGigs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      throw new BadRequestError("User not authenticated");
    }

    const gigs = await gigService.getMyGigs(userId);

    res.status(200).json({
      success: true,
      message: "My gigs fetched successfully",
      data: gigs,
    });
  } catch (error) {
    next(error);
  }
};

// Get single gig by ID
export const getGigById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id || typeof id !== "string" || !mongoose.isValidObjectId(id)) {
      throw new BadRequestError("Invalid gig ID");
    }

    const gig = await gigService.getGigById(id);

    res.status(200).json({
      success: true,
      message: "Gig fetched successfully",
      data: gig,
    });
  } catch (error) {
    next(error);
  }
};

// Create a new gig
export const createGig = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      throw new BadRequestError("User not authenticated");
    }

    // 1. Validate request body
    const validation = validateCreateGig(req.body);
    if (!validation.success) {
      throw new BadRequestError(
        validation.error.issues[0]?.message || "Invalid input"
      );
    }

    // 2. Call service with validated data
    const gig = await gigService.createGig({
      ...validation.data,
      ownerId: userId,
    });

    res.status(201).json({
      success: true,
      message: "Gig created successfully",
      data: gig,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a gig
export const deleteGig = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Validate ID
    if (!id || typeof id !== "string" || !mongoose.isValidObjectId(id)) {
      throw new BadRequestError("Invalid gig ID");
    }

    if (!userId) {
      throw new BadRequestError("User not authenticated");
    }

    await gigService.deleteGig(id, userId);

    res.status(200).json({
      success: true,
      message: "Gig deleted successfully",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
