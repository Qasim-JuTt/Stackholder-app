import axios from 'axios';

// Configure base URL (adjust according to your environment)
const api = axios.create({
  baseURL: "http://localhost:5000/api"
});

// Add request interceptor for auth tokens
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// User Management Functions
export const fetchAllUsers = async () => {
  try {
    const response = await api.get('/users/all');
    console.log(response.data)
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.response?.data?.error || 'Failed to fetch users' };
  }
};

export const fetchUnapprovedUsers = async () => {
  try {
    const response = await api.get('/users/unapproved');
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.response?.data?.error || 'Failed to fetch unapproved users' };
  }
};

export const approveUser = async (id) => {
  try {
    const response = await api.put(`/users/approve/${id}`);
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.response?.data?.error || 'Approval failed' };
  }
};

export const registerUser = async (formData) => {
  try {
    const response = await api.post('/users/register', formData);
    return { data: response.data, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: error.response?.data?.error || 'Registration failed',
      validationErrors: error.response?.data?.errors 
    };
  }
};

export const loginUser = async (formData) => {
  try {
    const response = await api.post('/users/login', formData);
    // Store token automatically if login succeeds
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.response?.data?.error || 'Login failed' };
  }
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  return { data: { message: 'Logged out successfully' }, error: null };
};

// Additional useful user functions
export const getUserProfile = async () => {
  try {
    const response = await api.get('/users/me');
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.response?.data?.error || 'Failed to fetch profile' };
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/users/${id}`, userData);
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.response?.data?.error || 'Update failed' };
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.response?.data?.error || 'Deletion failed' };
  }
};