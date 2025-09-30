import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router'
import useAuth from './useAuth'

const axiosSecure = axios.create({
  baseURL: `https://forum-x-server.vercel.app`
})

const useAxiosSecure = () => {
  const { user, logOut } = useAuth()
  const navigate = useNavigate()

  // Request interceptor - Add JWT token
  axiosSecure.interceptors.request.use(
    async (config) => {
      let token = localStorage.getItem("firebase-token")

      if (user && !token) {
        try {
          // Get fresh Firebase ID token if not in localStorage
          token = await user.getIdToken()
          localStorage.setItem("firebase-token", token)
        } catch (error) {
          console.error("Error getting token:", error)
        }
      }

      if (token) {
        config.headers.authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  // Response interceptor - handle expired/unauthorized tokens
  axiosSecure.interceptors.response.use(
    (res) => res,
    async (error) => {
      const status = error.response?.status

      if (status === 401 && user) {
        try {
          // force refresh token
          const newToken = await user.getIdToken(true)
          localStorage.setItem("firebase-token", newToken)

          error.config.headers.authorization = `Bearer ${newToken}`
          return axiosSecure(error.config)
        } catch {
          localStorage.removeItem("firebase-token")
          await logOut()
          navigate("/login")
        }
      }
      return Promise.reject(error)
    }
  )

  return axiosSecure
}

export default useAxiosSecure
