import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {!isLogin && (
          <>
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="First Name"
                className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Last Name"
                className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Organization"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <label className="text-gray-700 font-medium">Role:</label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="" disabled>
                  Select an option...
                </option>
                <option value="General educator">General Educator</option>
                <option value="Special educator">Special Educator</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </>
        )}

        <div className="mt-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mt-4">
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {!isLogin && (
          <div className="mt-4">
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <button className="w-full mt-4 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          {isLogin ? "Login" : "Create Account"}
        </button>

        <div className="relative w-full flex justify-center mt-4">
          <span className="absolute bg-white px-2 text-gray-500 text-sm">
            or
          </span>
          <div className="w-full border-t border-gray-300 mt-3"></div>
        </div>

        <button className="w-full mt-6 flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-100 shadow-sm">
          <FcGoogle className="text-2xl" />
          {isLogin ? "Login with Google" : "Sign up with Google"}
        </button>

        <p className="mt-4 text-center text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            className="text-blue-500 hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Auth;
