import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { FaGoogle, FaEye, FaEyeSlash, FaEnvelope, FaLock } from 'react-icons/fa';
import { MdForum } from 'react-icons/md';
import Lottie from 'lottie-react';
import loginAnimation from '../../Public/assets/login.json';
import { useForm } from 'react-hook-form';

import Swal from 'sweetalert2';
import useAuth from '../Hooks/useAuth';

const Login = () => {
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await signIn(data.email, data.password);
      Swal.fire({
        icon: 'success',
        title: 'Logged in successfully!',
        showConfirmButton: false,
        timer: 1500,
      });
      navigate('/');
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Login failed',
        text: error.message || 'Please check your credentials',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      Swal.fire({
        icon: 'success',
        title: 'Logged in with Google!',
        showConfirmButton: false,
        timer: 1500,
      });
      navigate('/');
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Google login failed',
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-15 bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full flex flex-col lg:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Left Side - Login Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto">
            {/* Logo */}
            <div className="text-center lg:text-left mb-8">
              <Link to="/" className="inline-flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <div className="bg-gradient-to-r from-indigo-600 to-indigo-400 p-2 rounded-lg shadow-lg">
                    <MdForum className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-400 bg-clip-text text-transparent">
                    ForumX
                  </div>
                </div>
              </Link>
            </div>

            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-600 mb-8">Sign in to access your personalized forum feed</p>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })}
                    className={`form-input block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
                    className={`form-input block w-full pl-10 pr-10 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Enter your password"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-500">
                      {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 font-medium transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
                <div className="relative flex justify-center text-sm text-gray-500">Or continue with</div>
              </div>

              {/* Google Sign-In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
              >
                <FaGoogle className="h-5 w-5 text-red-500 mr-2" /> Continue with Google
              </button>

              {/* Sign Up Link */}
              <div className="mt-6 text-center text-sm text-gray-600">
                Don't have an account? <Link to="/register" className="text-indigo-600 font-medium hover:underline">Create one now</Link>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Lottie Animation */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-r-2xl relative">
          <div className="absolute inset-0 bg-black opacity-10 rounded-r-2xl"></div>
          <div className="relative w-full h-full flex justify-center items-center p-12">
            <Lottie animationData={loginAnimation} loop={true} className="w-full h-full" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
