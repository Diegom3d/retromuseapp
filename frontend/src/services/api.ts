import axios from 'axios';

const api = axios.create({
  baseURL: (import.meta as unknown as { env: Record<string, string> }).env.VITE_API_URL || 'http://localhost:4000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('retromuse_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle expired tokens globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('retromuse_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
