import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import useAuth from './useAuth';
import axios from 'axios';

// Create Axios instance
const axiosSecure = axios.create({
  baseURL: 'https://forum-x-server.vercel.app',
});

const useAxiosSecure = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const updateToken = async () => {
      if (user) {
        try {
          const token = await user.getIdToken(true);
          localStorage.setItem('firebase-token', token);
        } catch (err) {
          console.error('Error getting token:', err);
          localStorage.removeItem('firebase-token');
        }
      } else {
        localStorage.removeItem('firebase-token');
      }
    };

    updateToken();

    const intervalId = setInterval(updateToken, 55 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [user]);

  // Request interceptor
  axiosSecure.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('firebase-token');
      if (token) config.headers.authorization = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor for 401
  axiosSecure.interceptors.response.use(
    (res) => res,
    async (error) => {
      if (error.response?.status === 401 && user) {
        try {
          const newToken = await user.getIdToken(true);
          localStorage.setItem('firebase-token', newToken);
          error.config.headers.authorization = `Bearer ${newToken}`;
          return axiosSecure(error.config);
        } catch {
          localStorage.removeItem('firebase-token');
          await logOut();
          navigate('/login');
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;
