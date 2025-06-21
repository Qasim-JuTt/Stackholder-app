import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const SignUp = ({ role }) => {
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
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        ...formData,
        role,
      })
      alert('Registration successful! Redirecting...')
      const userRole = response.data.role
      if (['admin', 'developer'].includes(userRole)) navigate('/admindashboard')
      else if (['client', 'investor'].includes(userRole)) navigate('/userdashboard')
      else navigate('/')
    } catch (error) {
      alert(error.response?.data?.message || 'Signup failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 relative overflow-hidden">
      <div className="absolute inset-0 blur-[120px] opacity-20 bg-gradient-to-tr from-blue-300 to-purple-400 z-0"></div>
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md p-8 bg-white/80 backdrop-blur-lg border border-gray-200 rounded-3xl shadow-[0_15px_60px_-15px_rgba(0,0,0,0.3)]"
      >
        <h2 className="text-3xl font-extrabold text-center text-[#101C46] mb-6 tracking-tight">Create Your Account</h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <InputField label="Name" name="name" value={formData.name} onChange={handleChange} error={errors.name} placeholder="Saad Abbas" />
          <InputField label="Email" name="email" value={formData.email} onChange={handleChange} error={errors.email} placeholder="you@example.com" type="email" />
          <InputField label="Password" name="password" value={formData.password} onChange={handleChange} error={errors.password} placeholder="••••••••" type="password" />
          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.01 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2.5 rounded-xl shadow-md hover:from-blue-700 hover:to-purple-700 transition-all duration-300 ease-in-out disabled:opacity-70"
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </motion.button>
        </form>
        <p className="mt-5 text-sm text-center text-gray-700">
          Already have an account? <a href="/" className="text-blue-600 font-medium hover:underline">Log in</a>
        </p>
      </motion.div>
    </section>
  )
}

const InputField = ({ label, name, type = 'text', value, onChange, error, placeholder }) => (
  <div className="relative">
    <label className="block text-sm font-medium text-gray-800 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-2.5 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${error ? 'border-red-500' : 'border-gray-300'}`}
    />
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
)

export default SignUp
