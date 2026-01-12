import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../utils/error.util.js";

interface JwtPayload {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from cookie
    const token = req.cookies?.token;

    if (!token) {
      throw new UnauthorizedError("Access denied. No token provided.");
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "ritick_fallback_secret"
    ) as JwtPayload;

    // Attach userId to request
    req.userId = decoded.id;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new UnauthorizedError("Invalid token"));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(new UnauthorizedError("Token expired"));
    }
    next(error);
  }
};
