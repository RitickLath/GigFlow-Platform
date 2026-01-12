import UserForm from "../generic/UserForm";

const Login = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <UserForm mode="login" />
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 items-center justify-center p-8">
        <div className="text-center text-white">
          <svg
            className="w-64 h-64 mx-auto mb-8 opacity-90"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          >
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <circle cx="12" cy="10" r="3" />
            <path d="M6 20c0-3 2.5-5 6-5s6 2 6 5" />
          </svg>
          <h2 className="text-3xl font-bold mb-4">Find Your Next Gig</h2>
          <p className="text-white/80 max-w-sm">
            Connect with clients and freelancers. Post gigs, place bids, and
            grow your career.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
