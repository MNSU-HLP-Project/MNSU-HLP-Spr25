"use client";

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Auth from "./Login";
import toast from "react-hot-toast";

function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Show success messages from email verification or password reset
  useEffect(() => {
    if (location.state?.message) {
      if (location.state.verified || location.state.passwordReset) {
        toast.success(location.state.message);
      }
      // Clear the state to prevent showing the message again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
      {/* Navbar */}
      {/* Navbar */}
<nav
  className={`fixed top-0 w-full z-50 transition-all duration-300 ${
    scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-3"
  }`}
>
  <div className="container mx-auto px-4 flex justify-between items-center">
    {/* Logo */}
    <div
      className={`font-bold text-xl sm:text-2xl ${
        scrolled ? "text-blue-600" : "text-white"
      }`}
    >
      MyHLPTracker
    </div>

{/* New HLP GPT Button */}
<div>
  <a
    href="https://chatgpt.com/g/g-67b53457ec208191b9c82aa7e6bcf1a9-high-leverage-practices-hlp-gpt?model=gpt-4o"
    target="_blank"
    rel="noopener noreferrer"
  >
    <button
      className={`px-4 py-1.5 border rounded-full font-medium ${
        scrolled
          ? "border-blue-600 text-blue-600 "
          : "border-white text-white"
      } transition duration-300 text-sm sm:text-base`}
    >
      Ask HLP GPT
    </button>
  </a>
</div>



  </div>
</nav>


      {/* Hero Section */}
      <section className="w-full pt-20 pb-10 sm:pt-32 sm:pb-12 px-4 text-center bg-gradient-to-r from-red-500 via-blue-500 to-purple-500 text-white relative overflow-hidden">

        <div className="container mx-auto max-w-4xl relative">
          <div className="absolute inset-0 bg-white bg-opacity-10 blur-3xl rounded-full transform -translate-y-1/4 scale-150 z-0"></div>
          <div className="relative z-10">
            <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 sm:mb-6 tracking-tight">
              MyHLPTracker
            </h1>
            <h2 className="text-lg sm:text-3xl mb-6 sm:mb-8 font-light">
              Master your High-Leverage Practices (HLPs) with ease!
            </h2>
            <button
              className="px-6 py-3 sm:px-8 sm:py-4 bg-white text-blue-600 font-semibold rounded-full shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-30 text-sm sm:text-base"
              onClick={() => setShowAuth(true)}
            >
              Log In
            </button>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg
            className="relative block w-full h-10 sm:h-16"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            fill="white"
          >
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,0,0,0,0z"></path>
          </svg>
        </div>
      </section>

      
{/* Features Section */}
<section className="w-full pt-6 sm:pt-8 px-2 bg-white">
  <div className="container mx-auto max-w-6xl">
    <h2 className="text-xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-gray-800">
      Why MyHLPTracker?
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
      {[
        {
          icon: "📊",
          title: "Track & Score",
          description: "Track your High-Leverage Practices easily.",
        },
        {
          icon: "📝",
          title: "Easy Journaling",
          description: "Document your teaching journey intuitively.",
        },
        {
          icon: "📈",
          title: "Insights & Progress",
          description: "See your progress and insights over time.",
        },
        {
          icon: "🤝",
          title: "Collaborate",
          description: "Work together with mentors and peers.",
        },
      ].map((feature, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-4 sm:p-4 md:p-3 hover:-translate-y-1 hover:shadow-lg transition text-center border border-gray-100"
        >
          <div className="w-10 h-10 md:w-12 md:h-12 mx-auto bg-gradient-to-r from-red-500 via-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-2 md:mb-3 text-xl md:text-2xl">
            <span className="text-white">{feature.icon}</span>
          </div>
          <h3 className="text-sm md:text-base font-bold mb-1 md:mb-2 text-gray-800">{feature.title}</h3>
          <p className="text-gray-600 text-xs md:text-sm">{feature.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>




      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-11/12 sm:w-96 max-w-md mx-auto overflow-hidden transform transition animate-modal-appear">
            <div className="h-2 bg-gradient-to-r from-red-500 via-blue-500 to-purple-500"></div>
            <div className="p-6">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                onClick={() => setShowAuth(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <Auth />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;

