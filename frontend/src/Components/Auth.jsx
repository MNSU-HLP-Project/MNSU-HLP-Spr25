import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'student',
    org: ''
  });
  const navigate = useNavigate();
  const { login, api } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const userData = await login({
          username: formData.username,
          password: formData.password
        });
        
        // Debug logging
        console.log('Login response:', userData);
        console.log('User role:', userData.role);
        
        // Strict role checking
        if (userData.role === 'teacher') {
          console.log('Navigating to teacher dashboard');
          navigate('/teacher-dashboard');
        } else {
          console.log('Navigating to student dashboard');
          navigate('/student-dashboard');
        }
      } else {
        const response = await api.post('/register/', formData);
        
        // Debug logging
        console.log('Registration response:', response.data);
        
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        
        const userData = await login({
          username: formData.username,
          password: formData.password
        });
        
        // Debug logging
        console.log('Post-registration login response:', userData);
        console.log('User role after registration:', userData.role);
        
        if (userData.role === 'teacher') {
          navigate('/teacher-dashboard');
        } else {
          navigate('/student-dashboard');
        }
      }
    } catch (error) {
      console.error('Auth error:', error.response?.data || error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-md mx-auto"
    >
      <h2 className="text-3xl font-bold text-center mb-8">
        {isLogin ? 'Welcome Back!' : 'Create Account'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 rounded-lg border"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
          />
        </div>
        
        {!isLogin && (
          <>
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 rounded-lg border"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            
            <div className="flex gap-4">
              <button
                type="button"
                className={`flex-1 py-2 rounded-lg ${formData.role === 'student' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setFormData({...formData, role: 'student'})}
              >
                Student
              </button>
              <button
                type="button"
                className={`flex-1 py-2 rounded-lg ${formData.role === 'teacher' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setFormData({...formData, role: 'teacher'})}
              >
                Teacher
              </button>
            </div>
            
            <div>
              <input
                type="text"
                placeholder="Organization"
                className="w-full px-4 py-2 rounded-lg border"
                value={formData.org}
                onChange={(e) => setFormData({...formData, org: e.target.value})}
              />
            </div>
          </>
        )}
        
        <div>
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-lg border"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
        </div>
        
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>
      
      <p className="text-center mt-4">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          className="text-blue-500 hover:underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </p>
    </motion.div>
  );
};

export default Auth;
