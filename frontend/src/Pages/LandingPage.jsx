import React, { useState } from "react";
import Auth from "./Login";

function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center bg-white text-gray-900">
      {/* ✅ Hero Section */}
      <section className="w-full px-6 py-12 text-center bg-gradient-to-r from-red-500 via-blue-500 to-purple-500 text-white">
        <h1 className="font-sans text-5xl font-bold mb-8">TeachTrack</h1>
        <h2 className="text-2xl mb-8">
          Master your High-Leverage Practices (HLPs) with ease!{" "}
        </h2>
        {/* <p className="text-xl mb-6">
          TeachTrack is your all-in-one platform for tracking progress,
          reflecting on experiences, and receiving valuable feedback.
        </p> */}
        <button
          className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-200"
          onClick={() => setShowAuth(true)}
        >
          Log In
        </button>
      </section>

      {/* ✅ Features Section */}
      <section className="w-full max-w-lg text-center py-12 px-4">
        <h2 className="text-2xl font-bold mb-6">Why TeachTrack?</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col items-center">
            <span className="text-4xl">📊</span>
            <p className="text-lg mt-2">Track & Score HLPs</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl">📝</span>
            <p className="text-lg mt-2">Easy Journaling</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl">📈</span>
            <p className="text-lg mt-2">Insights & Progress</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl">🤝</span>
            <p className="text-lg mt-2">Collaborate & Share</p>
          </div>
        </div>
      </section>

      {/* ✅ Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-11/12 max-w-md">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              onClick={() => setShowAuth(false)}
            >
              ✖
            </button>
            <Auth />
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
