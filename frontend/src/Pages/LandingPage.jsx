"use client"

import { useState, useEffect } from "react"
import Auth from "./Login"

function LandingPage() {
  const [showAuth, setShowAuth] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
      {/* Navbar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center">
            <div
              className={`font-bold text-2xl ${
                scrolled ? "text-blue-600" : "text-white"
              }`}
            >
              TeachTrack
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full pt-32 pb-20 px-6 text-center bg-gradient-to-r from-red-500 via-blue-500 to-purple-500 text-white clip-hero relative">
        <div className="container mx-auto max-w-4xl relative">
          <div className="absolute inset-0 bg-white bg-opacity-10 blur-3xl rounded-full transform -translate-y-1/4 scale-150 z-0"></div>
          <div className="relative z-10">
            <h1 className="font-sans text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
              TeachTrack
            </h1>
            <h2 className="text-2xl md:text-3xl mb-8 font-light">
              Master your High-Leverage Practices (HLPs) with ease!
            </h2>
            <button
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-full shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-30"
              onClick={() => setShowAuth(true)}
            >
              Log In
            </button>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg
            className="relative block w-full h-16 md:h-24"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            fill="white"
          >
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,0,0,0,0z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 px-6 bg-white">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Why TeachTrack?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "📊",
                title: "Track & Score HLPs",
                description: "Easily track and score your High-Leverage Practices",
              },
              {
                icon: "📝",
                title: "Easy Journaling",
                description: "Document your teaching journey with our intuitive journaling tools",
              },
              {
                icon: "📈",
                title: "Insights & Progress",
                description: "Gain valuable insights and visualize your progress over time",
              },
              {
                icon: "🤝",
                title: "Collaborate & Share",
                description: "Work together with mentors and peers to improve your skills",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border border-gray-100"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-500 via-blue-500 to-purple-500 flex items-center justify-center mb-4 text-3xl">
                  <span className="text-white">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl relative w-11/12 max-w-md overflow-hidden transform transition-all duration-300 animate-modal-appear">
            <div className="h-2 bg-gradient-to-r from-red-500 via-blue-500 to-purple-500"></div>
            <div className="p-8">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
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
  )
}

export default LandingPage
