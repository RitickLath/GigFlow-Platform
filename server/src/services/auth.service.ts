import { User, type IUser } from "../models/user.model.js";
import { generateToken } from "../utils/helper.util.js";
import {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
} from "../utils/error.util.js";
import { validateRegister, validateLogin } from "../utils/validation.util.js";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

class AuthService {
  async register(data: RegisterInput): Promise<AuthResponse> {
    // 1. Validate input
    const validation = validateRegister(data);
    if (!validation.success) {
      throw new BadRequestError(
        validation.error.issues[0]?.message || "Invalid input"
      );
    }

    const { name, email, password } = data;

    // 2. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError("User with this email already exists");
    }

    // 3. Create user (password hashed via pre-save hook)
    const user = await User.create({ name, email, password });

    // 4. Generate token
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
    // 1. Validate input
    const validation = validateLogin(data);
    if (!validation.success) {
      throw new BadRequestError(
        validation.error.issues[0]?.message || "Invalid input"
      );
    }

    const { email, password } = data;

    // 2. Find user with password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // 3. Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // 4. Generate token
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
