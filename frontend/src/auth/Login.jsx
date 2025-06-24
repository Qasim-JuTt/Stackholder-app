import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

import { logLogin } from '../../api/trackerApi.js'; 

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  setIsLoading(true);
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/users/login`,
      formData
    );

    const { token, user } = response.data;

    // Store only limited user info
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({
      id: user.id,
      email: user.email,
      role: user.role
    }));
    localStorage.setItem('role', user.role);

    // ✅ Generate or get existing sessionId
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('sessionId', sessionId);
    }

    // ✅ Track login activity
    await logLogin(user.id, sessionId);

    alert('Login successful!');

    // Redirect based on role
    const role = user.role;
    if (['admin', 'main', 'sub'].includes(role)) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }

  } catch (error) {
    const message = error.response?.data?.error || 'Login failed';
    alert(message);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 relative overflow-hidden">
      <div className="absolute inset-0 blur-[120px] opacity-20 bg-gradient-to-tr from-purple-300 to-blue-400 z-0"></div>
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md p-8 bg-white/80 backdrop-blur-lg border border-gray-200 rounded-3xl shadow-[0_15px_60px_-15px_rgba(0,0,0,0.3)]"
      >
        <h2 className="text-3xl font-extrabold text-center text-[#101C46] mb-6 tracking-tight">
          Login to Your Account
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <InputField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="you@example.com"
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="••••••••"
          />
          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.01 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2.5 rounded-xl shadow-md hover:from-blue-700 hover:to-purple-700 transition-all duration-300 ease-in-out disabled:opacity-70"
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </motion.button>
        </form>

        <p className="mt-5 text-sm text-center text-gray-700">
          Don&apos;t have an account?{' '}
          <a href="/sign-up-user" className="text-blue-600 font-medium hover:underline">
            Sign up
          </a>
        </p>
      </motion.div>
    </section>
  );
};

const InputField = ({ label, name, type = 'text', value, onChange, error, placeholder }) => (
  <div className="relative">
    <label className="block text-sm font-medium text-gray-800 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className={`w-full px-4 py-2.5 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
    />
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
);

export default Login;
