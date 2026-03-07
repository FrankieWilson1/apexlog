import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background text-white flex">
      {/* LEFT COLUMN: The Form (Full width on mobile, 50% on desktop) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-16 xl:p-24">
        <div className="max-w-md mx-auto w-full">
          <div className="flex flex-col gap-2 mb-10">
            <h1 className="text-3xl lg:text-4xl font-bold text-text-primary">
              Save Your Progress
            </h1>
            <p className="text-muted leading-relaxed">
              Create an account to securely sync your workout history, streaks,
              and volume data across all your devices.
            </p>
          </div>

          <form onSubmit={handleSignUp} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-semibold text-muted mb-2 ml-1">
                Full Name
              </label>
              <input
                type="text"
                required
                className="w-full bg-surface text-white p-4 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                placeholder="Alex Fitness"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-muted mb-2 ml-1">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full bg-surface text-white p-4 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                placeholder="alex@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-muted mb-2 ml-1">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full bg-surface text-white p-4 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white text-lg font-bold py-4 rounded-xl mt-4 active:scale-95 transition-transform shadow-lg shadow-primary/20"
            >
              Create Account
            </button>
          </form>

          <p className="text-center text-muted mt-8">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-bold hover:underline"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-surface/30 border-l border-surface flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 text-center max-w-lg">
          <h2 className="text-4xl font-bold text-white mb-6">
            Track. Overload. Grow.
          </h2>
          <p className="text-muted text-lg">
            Join thousands of lifters treating their bodies like engineered
            machines. Data-driven development starts here.
          </p>
        </div>
      </div>
    </div>
  );
}
