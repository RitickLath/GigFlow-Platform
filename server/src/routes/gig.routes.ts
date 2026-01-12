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

router.get("/", getAllGigs);
router.get("/:id", getGigById);

// Protected routes
router.get("/my", authMiddleware, getMyGigs);
router.post("/", authMiddleware, createGig);
router.delete("/:id", authMiddleware, deleteGig);

export default router;
