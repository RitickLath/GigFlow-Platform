import { Router } from "express";
import {
  getAllGigs,
  getGigById,
  createGig,
  getMyGigs,
} from "../controllers/gig.controller.js";

const router = Router();

router.get("/", getAllGigs);
router.get("/my", getMyGigs);
router.get("/:id", getGigById);
router.post("/", createGig);

export default router;
