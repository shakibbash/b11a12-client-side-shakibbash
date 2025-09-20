import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { FaGoogle, FaEye, FaEyeSlash, FaEnvelope, FaLock } from 'react-icons/fa';
import { MdForum } from 'react-icons/md';
import Lottie from 'lottie-react';
import loginAnimation from '../../Public/assets/login.json';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useAuth from '../Hooks/useAuth';
import axios from 'axios';


const Login = () => {
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

 // Inside onSubmit for email/password login
const onSubmit = async (data) => {
  setLoading(true);
  try {
    const userCredential = await signIn(data.email, data.password);
    const user = userCredential.user;

    // Store user info in a variable
    const userInfo = {
      uid: user.uid,
      name: user.displayName || "",
      email: user.email,
      photoURL: user.photoURL || "",
      provider: "email",
    };

    // Send to backend
    await axios.post("http://localhost:3000/users", userInfo);

    // Confetti + Swal
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    Swal.fire({
      title: "Logged in successfully!",
      html: `<div class="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-yellow-600 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3 7h7l-5.5 4.5 2 7-6-4-6 4 2-7L2 9h7l3-7z"/>
              </svg>
             </div>
             Bronze badge awarded!`,
      icon: "success",
      confirmButtonText: "Awesome!",
    });

    setTimeout(() => navigate("/"), 2000);

  } catch (error) {
    Swal.fire("Error", error.message, "error");
  } finally {
    setLoading(false);
  }
};

// Inside handleGoogleSignIn for Google login
const handleGoogleSignIn = async () => {
  try {
    const result = await signInWithGoogle();
    const user = result.user;

    // Prepare user info for MongoDB
    const userInfo = {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      role: "user",
      badge: "bronze",
      membership: false,
      provider: "google",
      last_login: new Date(),
      aboutMe: "",
    };

    // POST to /users → backend handles existing/new user
    const res = await axios.post("http://localhost:3000/users", userInfo);

    const isNewUser = res.status === 201; // 201 = new user created

    // Show confetti only for new users
    if (isNewUser) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }

    // SweetAlert
    Swal.fire({
      title: isNewUser ? "Account Created!" : "Signed in successfully!",
      html: isNewUser
        ? `
        <div class="flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-yellow-600 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3 7h7l-5.5 4.5 2 7-6-4-6 4 2-7L2 9h7l3-7z"/>
          </svg>
        </div>
        Bronze badge awarded!`
        : "Welcome back!",
      icon: "success",
      confirmButtonText: "Awesome!",
    }).then(() => {
      // Redirect after closing SweetAlert
      window.location.href = "/";
    });

  } catch (error) {
    Swal.fire("Error", error.message, "error");
  }
};

  return (
    <div className="min-h-screen mt-15 bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {confetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      <div className="max-w-6xl w-full flex flex-col lg:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Left Side - Login Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })}
                    className={`form-input block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
                    className={`form-input block w-full pl-10 pr-10 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Enter your password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400">
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 font-medium transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

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

            <div className="mt-6 text-center text-sm text-gray-600">
              Don't have an account? <Link to="/register" className="text-indigo-600 font-medium hover:underline">Create one now</Link>
            </div>
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
