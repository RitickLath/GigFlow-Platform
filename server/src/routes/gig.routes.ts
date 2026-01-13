import { Router } from "express";
import {
  getAllGigs,
  getGigById,
  createGig,
  getMyGigs,
  deleteGig,
} from "../controllers/gig.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.get("/", getAllGigs);

// Protected routes (order matters: /my must come before /:id)
router.get("/my", authMiddleware, getMyGigs);
router.post("/", authMiddleware, createGig);
router.delete("/:id", authMiddleware, deleteGig);

// Dynamic route last (catches all other IDs)
router.get("/:id", getGigById);

export default router;
