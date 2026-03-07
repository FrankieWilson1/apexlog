import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background text-white flex flex-row-reverse">
      {/* LEFT COLUMN: The Form (50% on desktop) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-16 xl:p-24">
        <div className="max-w-md mx-auto w-full">
          <div className="flex flex-col gap-2 mb-10">
            <h1 className="text-3xl lg:text-4xl font-bold text-text-primary">
              Welcome Back
            </h1>
            <p className="text-muted leading-relaxed">
              Log in to continue crushing your goals and tracking your volume.
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
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
              Log In
            </button>
          </form>

          <p className="text-center text-muted mt-8">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary font-bold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: The Graphic (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-surface/30 border-r border-surface flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="relative z-10 text-center max-w-lg">
          <h2 className="text-4xl font-bold text-white mb-6">
            Welcome Back to the Grind.
          </h2>
          <p className="text-muted text-lg">
            Your data is ready. Let's log another session.
          </p>
        </div>
      </div>
    </div>
  );
}
