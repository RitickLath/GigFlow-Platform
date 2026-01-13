import { Link } from "react-router-dom";

const Landing = () => {
  const features = [
    {
      icon: "🚀",
      title: "Quick Hiring",
      description: "Post a gig and receive competitive bids within minutes.",
    },
    {
      icon: "🔒",
      title: "Secure Payments",
      description: "Payments protected with escrow until work is delivered.",
    },
    {
      icon: "⭐",
      title: "Verified Talent",
      description: "Every freelancer vetted for quality and reliability.",
    },
    {
      icon: "💬",
      title: "Real-time Chat",
      description: "Communicate seamlessly with integrated messaging.",
    },
  ];

  const stats = [
    { value: "50K+", label: "Freelancers" },
    { value: "120K+", label: "Projects" },
    { value: "98%", label: "Satisfaction" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-white">
      {/* Hero Section */}
      <section className="px-4 pt-16 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 border border-emerald-200 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-emerald-700 text-sm font-medium">
              10,000+ projects posted this week
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Find the Perfect
            <span className="block bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent mt-2">
              Freelance Talent
            </span>
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            Connect with top-tier freelancers, post your projects, and get
            competitive bids. Transform your ideas into reality.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/gigs"
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25"
            >
              Explore Gigs →
            </Link>
            <Link
              to="/register"
              className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border border-gray-200 transition-all hover:border-emerald-300"
            >
              Start Selling
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-4 mt-12">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-md"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="flex text-yellow-500 text-sm">★★★★★</div>
              <p className="text-gray-500 text-sm">
                <span className="text-gray-800 font-medium">4.9/5</span> from
                10K+ reviews
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="mx-auto max-w-4xl px-4">
          <div className="grid grid-cols-3 gap-8 text-center">
            {stats.map((stat, i) => (
              <div key={i}>
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <p className="text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-4">
            Why Choose <span className="text-emerald-600">GigFlow</span>?
          </h2>
          <p className="text-gray-500 text-center max-w-xl mx-auto mb-12">
            Everything you need to hire freelancers and manage projects.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white border border-gray-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/10 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="p-10 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-500 shadow-xl shadow-emerald-500/20">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-emerald-100 mb-8">
              Join thousands of businesses and freelancers on GigFlow.
            </p>
            <Link
              to="/register"
              className="inline-block px-8 py-4 bg-white hover:bg-gray-50 text-emerald-600 font-semibold rounded-xl transition-all hover:scale-105 shadow-lg"
            >
              Create Free Account →
            </Link>
            <p className="text-emerald-200 text-sm mt-4">
              No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-4 bg-white">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-900 font-bold"
          >
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            GigFlow
          </Link>
          <p className="text-gray-400 text-sm">
            © 2026 GigFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
