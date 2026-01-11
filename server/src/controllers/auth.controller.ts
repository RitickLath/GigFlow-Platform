import type { Request, Response } from "express";

// POST /api/auth/register - Register new user
export const register = async (req: Request, res: Response) => {
  res.status(201).json({ message: "Register endpoint" });
};

// POST /api/auth/login - Login & set HttpOnly Cookie
export const login = async (req: Request, res: Response) => {
  res.status(200).json({ message: "Login endpoint" });
};

// POST /api/auth/logout - Clear cookie
export const logout = async (req: Request, res: Response) => {
  res.status(200).json({ message: "Logout endpoint" });
};

// GET /api/auth/me - Get current user
export const getMe = async (req: Request, res: Response) => {
  res.status(200).json({ message: "Get current user endpoint" });
};
