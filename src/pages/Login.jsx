import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useForm } from "react-hook-form";
import { FaGoogle, FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { MdForum } from "react-icons/md";
import Swal from "sweetalert2";
import useAuth from "../Hooks/useAuth";
import useAxiosSecure from "../Hooks/useAxiosSecure";

import Lottie from "lottie-react";
import loginAnimation from "../../Public/assets/login.json";
import AOS from "aos";
import "aos/dist/aos.css";
import { useTheme } from "../Hooks/useTheme";

const Login = () => {
  const { signIn, signInWithGoogle } = useAuth();
  const axios = useAxiosSecure();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const { isDarkMode } = useTheme(); 

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const userCredential = await signIn(data.email, data.password);
      const user = userCredential.user;

      await axios.put(`/users/${user.email}`, { last_login: new Date() });

      Swal.fire("Welcome back!", "Logged in successfully", "success")
        .then(() => navigate(from, { replace: true }));
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      const user = result.user;

      await axios.put(`/users/${user.email}`, { last_login: new Date() });

      Swal.fire("Welcome back!", "Logged in successfully", "success")
        .then(() => navigate(from, { replace: true }));
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen pt-20 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-all duration-300
      ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}
    >
      <div
        className={`max-w-8xl mx-10  w-full flex flex-col lg:flex-row rounded-2xl shadow-2xl overflow-hidden transition-all duration-300
        ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
      >
        {/* Left Side - Login Form */}
     <div
  className="w-full lg:w-[70%] p-20 flex flex-col justify-center"
  data-aos="fade-right"
>
  {/* removed max-w-md to allow full width */}
  <div className="mx-auto w-full px-6 lg:px-12 text-center lg:text-left">
    <Link to="/" className="inline-flex items-center space-x-2 mb-8">
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-400 p-2 rounded-lg shadow-lg">
        <MdForum className="w-8 h-8 text-white" />
      </div>
      <div className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">
        ForumX
      </div>
    </Link>

    <h2 className="text-3xl font-extrabold mb-2">Welcome back</h2>
    <p
      className={`mb-8 ${
        isDarkMode ? "text-gray-400" : "text-gray-600"
      }`}
    >
      Sign in to access your personalized forum feed
    </p>

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
      {/* Email Field */}
      <div className="w-full">
        <label className="block text-sm font-medium mb-1">
          Email Address *
        </label>
        <div className="relative w-full">
          <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className={`block w-full pl-10 pr-3 py-3 border rounded-lg outline-none transition-all duration-200 ${
              errors.email
                ? "border-red-500"
                : isDarkMode
                ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-900"
            }`}
            placeholder="Enter your email"
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="w-full">
        <label className="block text-sm font-medium mb-1">
          Password *
        </label>
        <div className="relative w-full">
          <FaLock className="absolute left-3 top-3 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            {...register("password", { required: "Password is required" })}
            className={`block w-full pl-10 pr-10 py-3 border rounded-lg outline-none transition-all duration-200 ${
              errors.password
                ? "border-red-500"
                : isDarkMode
                ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-900"
            }`}
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 px-4 rounded-lg text-white transition-all duration-300 ${
          loading
            ? "opacity-50 cursor-not-allowed"
            : "hover:scale-[1.02]"
        } ${
          isDarkMode
            ? "bg-indigo-500 hover:bg-indigo-600"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {loading ? "Signing In..." : "Sign In"}
      </button>
    </form>

    {/* Divider */}
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div
          className={`w-full border-t ${
            isDarkMode ? "border-gray-600" : "border-gray-300"
          }`}
        />
      </div>
      <div
        className={`relative flex justify-center text-sm ${
          isDarkMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        Or continue with
      </div>
    </div>

    {/* Google Sign-In Button */}
    <button
      onClick={handleGoogleSignIn}
      disabled={loading}
      className={`w-full flex justify-center items-center py-3 px-4 border rounded-lg shadow-sm transition-all duration-300 ${
        isDarkMode
          ? "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
          : "bg-white border-gray-300 text-gray-800 hover:bg-gray-50"
      }`}
    >
      <FaGoogle className="h-5 w-5 text-red-500 mr-2" /> Continue with Google
    </button>

    {/* Register Link */}
    <div
      className={`mt-6 text-center text-sm ${
        isDarkMode ? "text-gray-400" : "text-gray-600"
      }`}
    >
      Don’t have an account?{" "}
      <Link
        to="/register"
        className="text-indigo-500 font-medium hover:underline"
      >
        Create one now
      </Link>
    </div>
  </div>
</div>


        {/* Right Side - Lottie Animation */}
        <div
          className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-r-2xl relative"
          data-aos="fade-left"
        >
          <div className="absolute inset-0 bg-black opacity-10 rounded-r-2xl"></div>
          <div className="relative w-full h-full flex justify-center items-center p-12">
            <Lottie
              animationData={loginAnimation}
              loop={true}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
