import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    // Push them straight to the Dashboard after "logging in"
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background text-white p-6 flex flex-col justify-center max-w-md mx-auto border-x border-surface">
      
      {/* The Header Area */}
      <div className="flex flex-col gap-2 mb-10">
        <h1 className="text-3xl font-bold text-text-primary">Welcome Back</h1>
        <p className="text-muted leading-relaxed">
          Log in to continue crushing your goals and tracking your volume.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="flex flex-col gap-5">
        
        {/* Email Input */}
        <div>
          <label className="block text-sm font-semibold text-muted mb-2 ml-1">Email Address</label>
          <input
            type="email"
            required
            className="w-full bg-surface text-white p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary placeholder-muted/50 transition-shadow"
            placeholder="alex@example.com"
          />
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-sm font-semibold text-muted mb-2 ml-1">Password</label>
          <input
            type="password"
            required
            className="w-full bg-surface text-white p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary placeholder-muted/50 transition-shadow"
            placeholder="••••••••"
          />
        </div>

        {/* The Submit Button */}
        <button
          type="submit"
          className="w-full bg-primary text-white text-lg font-bold py-4 rounded-xl mt-4 active:scale-95 transition-transform shadow-lg shadow-primary/20"
        >
          Log In
        </button>
      </form>

      {/* The Toggle Link */}
      <p className="text-center text-muted mt-8">
        Don't have an account?{' '}
        {/* Link back to the Sign Up page */}
        <Link to="/signup" className="text-primary font-bold hover:underline">
          Sign Up
        </Link>
      </p>

    </div>
  );
}