import axios from 'axios';
import Cookies from 'js-cookie';

if (!import.meta.env.PUBLIC_BACKEND_URL) {
  throw new Error('PUBLIC_BACKEND_URL is undefined.');
}

export const client = axios.create({
  baseURL: import.meta.env.PUBLIC_BACKEND_URL,

  // withCredentials: true,
});

client.interceptors.request.use((config) => {
  const token = Cookies.get('authToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
