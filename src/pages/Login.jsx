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

const Login = () => {
  const { signIn, signInWithGoogle } = useAuth();
  const axios = useAxiosSecure();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

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
    <div className="min-h-screen mt-20 bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full flex flex-col lg:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Left Side - Login Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center" data-aos="fade-right">
          <div className="max-w-md mx-auto text-center lg:text-left">
            <Link to="/" className="inline-flex items-center space-x-2 mb-8">
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-400 p-2 rounded-lg shadow-lg">
                <MdForum className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-400 bg-clip-text text-transparent">
                ForumX
              </div>
            </Link>

            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-600 mb-8">Sign in to access your personalized forum feed</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-lg`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", { required: "Password is required" })}
                    className={`block w-full pl-10 pr-10 py-3 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-lg`}
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
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm text-gray-500">Or continue with</div>
            </div>

            {/* Google Sign-In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border rounded-lg shadow-sm bg-white hover:bg-gray-50"
            >
              <FaGoogle className="h-5 w-5 text-red-500 mr-2" /> Continue with Google
            </button>

            <div className="mt-6 text-center text-sm text-gray-600">
              Don't have an account? <Link to="/register" className="text-indigo-600 font-medium hover:underline">Create one now</Link>
            </div>
          </div>
        </div>

        {/* Right Side - Lottie Animation */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-r-2xl relative" data-aos="fade-left">
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
