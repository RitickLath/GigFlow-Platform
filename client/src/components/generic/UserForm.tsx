import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface UserFormProps {
  mode: "login" | "register";
}

const UserForm = ({ mode }: UserFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const location = useLocation();

  const isRegister = mode === "register";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation for register
    if (isRegister && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }

      const from =
        (location.state as { from?: Location })?.from?.pathname || "/dashboard";

      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-12">
        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
        <span className="text-gray-700 font-medium">GigFlow</span>
      </div>

      {/* Heading */}
      <h1 className="text-4xl font-bold text-gray-900 mb-2">
        {isRegister ? (
          <>
            Create
            <br />
            Account
          </>
        ) : (
          <>
            Hello,
            <br />
            Welcome Back
          </>
        )}
      </h1>
      <p className="text-gray-500 mb-8">
        {isRegister
          ? "Join GigFlow and start your journey"
          : "Hey, welcome back to your special place"}
      </p>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        />
        {isRegister && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? isRegister
              ? "Creating Account..."
              : "Signing in..."
            : isRegister
            ? "Sign Up"
            : "Sign In"}
        </button>
      </form>

      {/* Toggle Link */}
      <p className="mt-8 text-gray-500">
        {isRegister ? (
          <>
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-emerald-500 font-medium hover:underline"
            >
              Sign In
            </Link>
          </>
        ) : (
          <>
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-emerald-500 font-medium hover:underline"
            >
              Sign Up
            </Link>
          </>
        )}
      </p>
    </div>
  );
};

export default UserForm;
