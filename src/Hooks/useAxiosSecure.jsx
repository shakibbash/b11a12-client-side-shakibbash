import React from 'react'
import axios from 'axios'

import { useNavigate } from 'react-router'
import useAuth from './useAuth'

// useAxiosSecure() is used whenever you need authenticated requests with Firebase or JWT, and want automatic error handling.
const axiosSecure = axios.create({
    baseURL : `http://localhost:3000`
})

const useAxiosSecure = () => {
  const { user, logOut } = useAuth()
  const navigate = useNavigate()

  // Request interceptor - Add JWT token
  axiosSecure.interceptors.request.use(async (config) => {
    if (user) {
      try {
        // Get fresh Firebase ID token
        const token = await user.getIdToken()
        config.headers.authorization = `Bearer ${token}`
        // console.log(token)
      } catch (error) {
        console.error('Error getting token:', error)
      }
    }
    return config
  }, (error) => {
    return Promise.reject(error)
  })

axiosSecure.interceptors.response.use(
  res => res,
  async (error) => {
    const status = error.response?.status;
    
    if (status === 401 && user) {
      try {
        const token = await user.getIdToken(true); // force refresh
        error.config.headers.authorization = `Bearer ${token}`;
        return axiosSecure(error.config); // retry the original request
      } catch {
        await logOut();
        navigate('/login');
      }
    }
    return Promise.reject(error);
  }
);
  
  return axiosSecure
}

export default useAxiosSecure