import React, { useState, useEffect } from "react";
import Auth from "../Components/Auth";
import { motion } from "framer-motion";

function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative">
      {/* Dynamic Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute w-96 h-96 bg-blue-500 rounded-full blur-3xl -top-10 -left-10 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-purple-500 rounded-full blur-3xl top-1/2 left-1/2 animate-pulse delay-700"></div>
          <div className="absolute w-96 h-96 bg-pink-500 rounded-full blur-3xl bottom-0 right-0 animate-pulse delay-1000"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative h-screen flex items-center justify-center px-6"
        >
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h1 className="text-7xl font-bold mb-6 text-white tracking-tight">
                Transform Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                  Teaching Journey
                </span>
              </h1>
              <p className="text-2xl text-white/90 mb-8 leading-relaxed">
                TeachTrack revolutionizes how educators track progress, collaborate, 
                and grow professionally. Experience the future of educational development.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex gap-4 justify-center"
            >
              <button
                onClick={() => setShowAuth(true)}
                className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-full 
                         shadow-lg hover:shadow-xl transform hover:scale-105 transition-all
                         duration-300 text-lg"
              >
                Get Started Free
              </button>
              <a
                href="#features"
                className="px-8 py-4 bg-transparent border-2 border-white text-white 
                         font-semibold rounded-full hover:bg-white/10 transition-all
                         duration-300 text-lg"
              >
                Learn More
              </a>
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <section id="features" className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-4">
                Empower Your Teaching Practice
              </h2>
              <p className="text-xl text-white/80">
                Discover the tools that will revolutionize your educational journey
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon="📊"
                title="Smart Progress Tracking"
                description="Track HLPs with intuitive tools and real-time insights"
                delay={0.2}
              />
              <FeatureCard
                icon="🎯"
                title="Goal Setting"
                description="Set and achieve meaningful professional development goals"
                delay={0.4}
              />
              <FeatureCard
                icon="🤝"
                title="Collaborative Growth"
                description="Connect with mentors and peers for shared learning"
                delay={0.6}
              />
              <FeatureCard
                icon="📈"
                title="Data-Driven Insights"
                description="Make informed decisions with comprehensive analytics"
                delay={0.8}
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-6 bg-white/10 backdrop-blur-lg">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            <StatCard number="1000+" label="Active Users" />
            <StatCard number="50+" label="School Districts" />
            <StatCard number="95%" label="Satisfaction Rate" />
          </motion.div>
        </section>
      </div>

      {/* Auth Modal */}
      {showAuth && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-8 w-11/12 max-w-md relative"
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setShowAuth(false)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <Auth />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="bg-white/20 backdrop-blur-lg rounded-xl p-8 text-center text-white
              transform hover:scale-105 transition-all duration-300 hover:bg-white/30"
  >
    <span className="text-5xl mb-6 block">{icon}</span>
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-white/80">{description}</p>
  </motion.div>
);

const StatCard = ({ number, label }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="text-center text-white p-6"
  >
    <h3 className="text-5xl font-bold mb-2">{number}</h3>
    <p className="text-xl text-white/80">{label}</p>
  </motion.div>
);

export default LandingPage;
