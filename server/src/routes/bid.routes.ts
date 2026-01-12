import { Router } from "express";
import {
  createBid,
  getBidsByGig,
  hireBid,
  getMyBids,
} from "../controllers/bid.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, createBid);
router.get("/my", authMiddleware, getMyBids);
router.get("/:gigId", authMiddleware, getBidsByGig);
router.patch("/:bidId/hire", authMiddleware, hireBid);

export default router;
