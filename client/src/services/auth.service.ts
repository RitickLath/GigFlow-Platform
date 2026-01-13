import api from "../api/axios";
import type { User, ApiResponse } from "./types";

// Register a new user
export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<ApiResponse<User>> => {
  const response = await api.post("/auth/register", { name, email, password });
  return response.data;
};

// Login user
export const loginUser = async (
  email: string,
  password: string
): Promise<ApiResponse<User>> => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

// Logout user
export const logoutUser = async (): Promise<ApiResponse<object>> => {
  const response = await api.post("/auth/logout");
  return response.data;
};

// Get current authenticated user
export const fetchCurrentUser = async (): Promise<ApiResponse<User>> => {
  const response = await api.get("/auth/me");
  return response.data;
};
