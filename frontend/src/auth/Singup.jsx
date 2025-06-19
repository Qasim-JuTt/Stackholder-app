// src/pages/SignUp.jsx
import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const SignUp = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) setErrors({ ...errors, [name]: null })
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 6) newErrors.password = 'Min 6 characters'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, formData)
      alert('Registration successful! Please login.')
      navigate('/login-page')
    } catch (error) {
      alert(error.response?.data?.message || 'Signup failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100">
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-center text-[#101C46] mb-6">Create Your Account</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <InputField label="Name" name="name" value={formData.name} onChange={handleChange} error={errors.name} placeholder="Saad Abbas" />
          <InputField label="Email" name="email" value={formData.email} onChange={handleChange} error={errors.email} placeholder="you@example.com" type="email" />
          <InputField label="Password" name="password" value={formData.password} onChange={handleChange} error={errors.password} placeholder="••••••••" type="password" />
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-70"
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </motion.button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account? <a href="/login-page" className="text-teal-600 hover:underline">Log in</a>
        </p>
      </motion.div>
    </section>
  )
}

const InputField = ({ label, name, type = 'text', value, onChange, error, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
    />
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
)

export default SignUp
