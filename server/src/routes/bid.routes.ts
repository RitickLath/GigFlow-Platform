import { Router } from "express";
import {
  createBid,
  getBidsByGig,
  hireBid,
  getMyBids,
} from "../controllers/bid.controller.js";

const router = Router();

router.post("/", createBid);
router.get("/my", getMyBids);
router.get("/:gigId", getBidsByGig);
router.patch("/:bidId/hire", hireBid);

export default router;
