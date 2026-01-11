import type { Request, Response } from "express";

// GET /api/gigs - Fetch all open gigs (with search query)
export const getAllGigs = async (req: Request, res: Response) => {
  res.status(200).json({ message: "Get all gigs endpoint" });
};

// GET /api/gigs/:id - Get single gig by ID
export const getGigById = async (req: Request, res: Response) => {
  res.status(200).json({ message: "Get gig by ID endpoint" });
};

// POST /api/gigs - Create a new job post
export const createGig = async (req: Request, res: Response) => {
  res.status(201).json({ message: "Create gig endpoint" });
};

// GET /api/gigs/my - Get gigs posted by current user
export const getMyGigs = async (req: Request, res: Response) => {
  res.status(200).json({ message: "Get my gigs endpoint" });
};
