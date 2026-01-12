import type { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service.js";
import { validateRegister, validateLogin } from "../utils/validation.util.js";
import { BadRequestError } from "../utils/error.util.js";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Validate and sanitize input
    const validation = validateRegister(req.body);
    if (!validation.success) {
      throw new BadRequestError(
        validation.error.issues[0]?.message || "Invalid input"
      );
    }

    // 2. Call service with validated data
    const { user, token } = await authService.register(validation.data);

    // 3. Set HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 8 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Validate and sanitize input
    const validation = validateLogin(req.body);
    if (!validation.success) {
      throw new BadRequestError(
        validation.error.issues[0]?.message || "Invalid input"
      );
    }

    // 2. Call service with validated data
    const { user, token } = await authService.login(validation.data);

    // 3. Set HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 8 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Clear the cookie
    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      throw new BadRequestError("User not authenticated");
    }

    const user = await authService.getUserById(userId);

    if (!user) {
      throw new BadRequestError("User not found");
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};
