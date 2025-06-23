const API_URL = import.meta.env.VITE_API_URL + '/api/activity';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const logLogin = async (userId, sessionId) => {
  try {
    await fetch(`${API_URL}/log-login`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ userId, sessionId }),
    });
  } catch (err) {
    console.error('Login log failed:', err);
  }
};

export const logPageVisit = async (page, userId = null, sessionId) => {
  try {
    await fetch(`${API_URL}/log-page-visit`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ page, userId, sessionId }),
    });
  } catch (err) {
    console.error('Page visit log failed:', err);
  }
};
