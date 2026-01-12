import { User, type IUser } from "../models/user.model.js";
import { generateToken } from "../utils/helper.util.js";
import { ConflictError, UnauthorizedError } from "../utils/error.util.js";
import type {
  AuthResponse,
  LoginInput,
  RegisterInput,
} from "../types/auth.type.js";

class AuthService {
  async register(data: RegisterInput): Promise<AuthResponse> {
    const { name, email, password } = data;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError("User with this email already exists");
    }

    // Create user (password hashed via pre-save hook)
    const user = await User.create({ name, email, password });

    // Generate token
    const token = generateToken(user._id.toString());

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
      token,
    };
  }

  async login(data: LoginInput): Promise<AuthResponse> {
    const { email, password } = data;

    // Find user with password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // Generate token
    const token = generateToken(user._id.toString());

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
      token,
    };
  }

  async getUserById(userId: string): Promise<IUser | null> {
    return User.findById(userId);
  }
}

export const authService = new AuthService();
