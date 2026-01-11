import { Router } from "express";
import authRoutes from "./auth.routes.js";
import gigRoutes from "./gig.routes.js";
import bidRoutes from "./bid.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/gigs", gigRoutes);
router.use("/bids", bidRoutes);

export default router;
