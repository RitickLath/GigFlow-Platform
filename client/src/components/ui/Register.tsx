import UserForm from "../generic/UserForm";

const Register = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <UserForm mode="register" />
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-600 items-center justify-center p-8">
        <div className="text-center text-white">
          <svg
            className="w-64 h-64 mx-auto mb-8 opacity-90"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <h2 className="text-3xl font-bold mb-4">Start Your Journey</h2>
          <p className="text-white/80 max-w-sm">
            Post gigs, bid on projects, and connect with talented professionals
            worldwide.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
