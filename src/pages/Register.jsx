import React, { useState } from 'react'
import { Link } from 'react-router'
import { FaGoogle, FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaCamera } from 'react-icons/fa'
import Lottie from 'lottie-react'
import registerAnimation from '../../Public/assets/register.json'
import { MdForum } from 'react-icons/md'

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen mt-15  bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full flex flex-col lg:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden">
 
    {/* Left Side - Visual Content */}
<div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-indigo-800 p-12 flex-col justify-center items-center text-white relative" data-aos="fade-right" data-aos-duration="1200" data-aos-delay="200">
  <div className="absolute inset-0 bg-black opacity-10"></div>
  <div className="relative z-10 text-center">
    <div className="mb-8" data-aos="zoom-in" data-aos-duration="1000" data-aos-delay="600">
      <MdForum className="w-24 h-24 mx-auto mb-6 text-indigo-100 animate-float" />
      <h1 className="text-4xl font-bold mb-4">
        Welcome to <span className="text-indigo-200">Forum</span>X
      </h1>
      <p className="text-xl text-indigo-100 leading-relaxed">
        Connect, share, and discover discussions across topics you love. Join a vibrant community today!
      </p>
    </div>

    <div className="space-y-6 mt-12">
      <div className="flex items-center space-x-4" data-aos="fade-right" data-aos-duration="800" data-aos-delay="800">
        <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
          <FaUser className="w-6 h-6" />
        </div>
        <div className="text-left">
          <h3 className="font-semibold text-lg">Community Discussions</h3>
          <p className="text-indigo-100">Engage in meaningful conversations with peers</p>
        </div>
      </div>

      <div className="flex items-center space-x-4" data-aos="fade-right" data-aos-duration="800" data-aos-delay="900">
        <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
          <FaEnvelope className="w-6 h-6" />
        </div>
        <div className="text-left">
          <h3 className="font-semibold text-lg">Stay Notified</h3>
          <p className="text-indigo-100">Receive updates for threads and topics you follow</p>
        </div>
      </div>

      <div className="flex items-center space-x-4" data-aos="fade-right" data-aos-duration="800" data-aos-delay="1000">
        <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
          <FaLock className="w-6 h-6" />
        </div>
        <div className="text-left">
          <h3 className="font-semibold text-lg">Secure & Private</h3>
          <p className="text-indigo-100">Your data and discussions are safe with us</p>
        </div>
      </div>
    </div>
  </div>
</div>


        {/* Right Side - Registration Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto">

         

            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Create your account</h2>
            <p className="text-gray-600 mb-8">Join ForumX to participate in discussions and connect with the community.</p>

            <form className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    className="form-input block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

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
                    className="form-input block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              {/* Profile Photo Upload */}
<div className="mb-4" data-aos="fade-left" data-aos-duration="800" data-aos-delay="1100">
  <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
    Profile Photo (Optional)
  </label>

  <div className="flex items-center justify-center w-full">
    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="flex items-center space-x-2 py-2">
        <FaCamera className="w-5 h-5 text-gray-400" />
        <span className="text-sm text-gray-500">Click to upload photo</span>
      </div>
      <input
        id="photo"
        type="file"
        className="hidden"
        accept="image/*"
        // onChange={handlePhotoChange}  // Optional: add later when implementing logic
      />
    </label>
  </div>
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
                    className="form-input block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter your password"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-500">
                      {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Sign Up Button */}
              <button
                type="button"
                className="w-full py-3 px-4 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 font-medium transition-all"
              >
                Create Account
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
                <div className="relative flex justify-center text-sm text-gray-500">Or continue with</div>
              </div>

              {/* Google Sign-Up */}
              <button
                type="button"
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
              >
                <FaGoogle className="h-5 w-5 text-red-500 mr-2" /> Continue with Google
              </button>

              {/* Sign In Link */}
              <div className="mt-6 text-center text-sm text-gray-600">
                Already have an account? <Link to="/login" className="text-indigo-600 font-medium hover:underline">Sign in</Link>
              </div>
            </form>

          </div>
        </div>

      </div>
    </div>
  )
}

export default Register
