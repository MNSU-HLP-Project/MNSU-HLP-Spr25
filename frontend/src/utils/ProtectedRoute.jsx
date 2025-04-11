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

  console.log('ProtectedRoute - Current path:', window.location.pathname);
  console.log('ProtectedRoute - User role:', role);
  console.log('ProtectedRoute - Allowed roles:', allowedRoles);
  console.log('ProtectedRoute - Has token:', !!token);

  // If no token or no role, redirect to login
  if (!token || !role) {
    console.log('No token or no role found, redirecting to login');
    // Clear localStorage to ensure a clean state
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('role');
    return <Navigate to="/" replace />;
  }

  // If role is not allowed, redirect to main menu
  if (!allowedRoles.includes(role)) {
    console.log(`Role ${role} not allowed to access this route. Allowed roles: ${allowedRoles.join(', ')}`);
    console.log('Redirecting to main menu due to unauthorized role');
    return <Navigate to="/mainmenu/" replace />;
  }

  // If authorized, render the children
  console.log('User authorized, rendering protected content');
  return children;
};

export default ProtectedRoute;
