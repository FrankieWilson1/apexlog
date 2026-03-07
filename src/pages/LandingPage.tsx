import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full overflow-hidden">
      {/* ================= HERO SECTION ================= */}
      <div className="relative min-h-[90vh] flex flex-col bg-background text-white">
        {/* Background Image with Dark Overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-background/80 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
        </div>

        {/* Navbar */}
        <nav className="relative z-10 flex justify-between items-center p-6 lg:px-12 max-w-7xl mx-auto w-full border-b border-white/10">
          <div className="text-2xl font-bold tracking-tighter">
            Apex<span className="text-primary">Log</span>
          </div>

          <div className="hidden md:flex gap-8 text-sm font-medium text-white/80">
            <span className="hover:text-white cursor-pointer transition-colors">
              Features
            </span>
            <span className="hover:text-white cursor-pointer transition-colors">
              Library
            </span>
            <span className="hover:text-white cursor-pointer transition-colors">
              Pricing
            </span>
          </div>

          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-primary/20 border border-primary text-primary font-semibold rounded-full hover:bg-primary hover:text-white transition-all"
          >
            Start Training
          </button>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-6 lg:px-12 max-w-7xl mx-auto w-full pt-10 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6">
              Master Your Gains <br /> with Precision <br /> Engineering
            </h1>
            <p className="text-lg text-white/70 mb-10 max-w-xl leading-relaxed">
              The engineering-first workout logger designed to track every set,
              visualize your volume, and master your progress.
            </p>
            <button
              onClick={() => navigate("/signup")}
              className="px-8 py-4 bg-primary text-white font-bold text-lg rounded-full hover:bg-primary/90 transition-transform active:scale-95 shadow-lg shadow-primary/30"
            >
              Start Training For Free
            </button>
          </motion.div>
        </div>
      </div>

      {/* ================= FEATURES SECTION ================= */}
      {/* Using a very light pink/gray background to match your Figma grid area */}
      <div className="py-24 bg-[#FFF5F5] text-background px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16 text-background"
          >
            Engineered For Results
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1: Analytics */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-card text-white p-8 rounded-3xl flex flex-col items-center text-center shadow-xl border border-surface"
            >
              <h3 className="text-xl font-bold mb-3">Real-Time Analytics</h3>
              <p className="text-muted text-sm mb-8">
                Visualize your weekly volume and frequency with dynamic,
                auto-generated charts.
              </p>
              {/* Bar Chart Icon Placeholder */}
              <div className="h-20 w-24 border-b-2 border-l-2 border-surface flex items-end justify-center gap-2 p-2">
                <div className="w-5 bg-primary h-10 rounded-t-sm"></div>
                <div className="w-5 bg-primary h-16 rounded-t-sm"></div>
                <div className="w-5 bg-primary h-8 rounded-t-sm"></div>
              </div>
            </motion.div>

            {/* Feature 2: Logging */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-card text-white p-8 rounded-3xl flex flex-col items-center text-center shadow-xl border border-surface"
            >
              <h3 className="text-xl font-bold mb-3">Rapid-Fire Logging</h3>
              <p className="text-muted text-sm mb-8">
                Designed for the gym floor. Log sets, reps, and RPE in seconds
                without breaking your flow.
              </p>
              {/* List Icon Placeholder */}
              <div className="h-20 w-24 flex flex-col justify-center gap-3 border-2 border-surface rounded-xl p-3">
                <div className="h-2 w-full bg-primary/80 rounded"></div>
                <div className="h-2 w-full bg-primary/80 rounded"></div>
                <div className="h-2 w-3/4 bg-primary/80 rounded"></div>
              </div>
            </motion.div>

            {/* Feature 3: Library */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-card text-white p-8 rounded-3xl flex flex-col items-center text-center shadow-xl border border-surface"
            >
              <h3 className="text-xl font-bold mb-3">1,000+ Exercises</h3>
              <p className="text-muted text-sm mb-8">
                Access a massive library of movements with detailed instructions
                and tracking history.
              </p>
              {/* Search Icon Placeholder */}
              <div className="h-20 w-24 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-primary relative">
                  <div className="absolute -bottom-3 -right-3 w-6 h-4 bg-primary rotate-45 rounded-sm"></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ================= FOOTER CTA SECTION ================= */}
      <div className="bg-background text-white py-20 px-6 border-t border-surface flex flex-col items-center text-center">
        <h2 className="text-3xl font-bold mb-8">Ready to Level Up?</h2>
        <button
          onClick={() => navigate("/signup")}
          className="px-10 py-4 bg-primary text-white font-bold text-xl rounded-full hover:bg-primary/90 transition-transform active:scale-95 shadow-lg shadow-primary/20 mb-16"
        >
          Get Started For Free
        </button>

        {/* Footer Nav */}
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-center text-sm text-muted pt-8 border-t border-surface/50">
          <div className="font-bold text-white mb-4 md:mb-0">ApexLog</div>
          <div className="flex gap-6 mb-4 md:mb-0">
            <span className="hover:text-white cursor-pointer">Features</span>
            <span className="hover:text-white cursor-pointer">Library</span>
            <span className="hover:text-white cursor-pointer">Pricing</span>
          </div>
          <div className="flex gap-4">
            <span>Privacy Policy | Terms of Service</span>
          </div>
        </div>
      </div>
    </div>
  );
}
