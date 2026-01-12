import z from "zod";

// Auth Schemas
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

// Gig Schemas
const createGigSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title cannot exceed 100 characters"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(2000, "Description cannot exceed 2000 characters"),
  budget: z
    .number()
    .positive("Budget must be a positive number")
    .min(1, "Budget must be at least 1"),
});

const gigQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  search: z.string().optional(),
  status: z.enum(["open", "assigned"]).optional(),
});

// Bid Schemas
const createBidSchema = z.object({
  gigId: z.string().min(1, "Gig ID is required"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message cannot exceed 1000 characters"),
  price: z
    .number()
    .positive("Price must be a positive number")
    .min(1, "Price must be at least 1"),
});

// Auth Validators
export const validateRegister = (data: unknown) => {
  return registerSchema.safeParse(data);
};

export const validateLogin = (data: unknown) => {
  return loginSchema.safeParse(data);
};

// Gig Validators
export const validateCreateGig = (data: unknown) => {
  return createGigSchema.safeParse(data);
};

export const validateGigQuery = (data: unknown) => {
  return gigQuerySchema.safeParse(data);
};

// Bid Validators
export const validateCreateBid = (data: unknown) => {
  return createBidSchema.safeParse(data);
};
