import { Link, useNavigate } from 'react-router-dom';

export default function SignUp() {
  const navigate = useNavigate();

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    navigate('/');
  };

  return (
    // Centered vertically with justify-center to look perfect on any phone screen
    <div className="min-h-screen bg-background text-white p-6 flex flex-col justify-center max-w-md mx-auto border-x border-surface">
      
      {/* Header Area */}
      <div className="flex flex-col gap-2 mb-10">
        <h1 className="text-3xl font-bold text-text-primary">Save Your Progress</h1>
        <p className="text-muted leading-relaxed">
          Create an account to securely sync your workout history, streaks, and volume data across all your devices.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSignUp} className="flex flex-col gap-5">
        
        {/* Name Input */}
        <div>
          <label className="block text-sm font-semibold text-muted mb-2 ml-1">Full Name</label>
          <input
            type="text"
            required
            className="w-full bg-surface text-white p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary placeholder-muted/50 transition-shadow"
            placeholder="Alex Fitness"
          />
        </div>

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

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-primary text-white text-lg font-bold py-4 rounded-xl mt-4 active:scale-95 transition-transform shadow-lg shadow-primary/20"
        >
          Create Account
        </button>
      </form>

      {/* Toggle Link */}
      <p className="text-center text-muted mt-8">
        Already have an account?{' '}
        {/*  Link component to swap the page without reloading */}
        <Link to="/login" className="text-primary font-bold hover:underline">
          Log In
        </Link>
      </p>

    </div>
  );
}