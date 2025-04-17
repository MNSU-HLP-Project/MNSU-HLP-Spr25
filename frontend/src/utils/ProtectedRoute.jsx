import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * A component that protects routes based on user role
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The component to render if authorized
 * @param {string[]} props.allowedRoles - Array of roles allowed to access this route
 * @returns {React.ReactNode} - The protected component or redirect
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('jwtToken');
  // If no token or no role, redirect to login
  if (!token || !role) {
    // Clear localStorage to ensure a clean state
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('role');
    return <Navigate to="/" replace />;
  }

  // If role is not allowed, redirect to main menu
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/mainmenu/" replace />;
  }

  // If authorized, render the children
  return children;
};

export default ProtectedRoute;
