import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  FaGoogle,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaUser,
} from "react-icons/fa";
import { MdForum } from "react-icons/md";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import confetti from "canvas-confetti";
import useAuth from "../Hooks/useAuth";

const Register = () => {
  const { createUser, updateUserProfile, signInWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // 📌 Handle Email/Password Registration
  const onSubmit = async (data) => {
    try {
      const { name, email, password, photo } = data;

      // 1️⃣ Create Firebase user
      const userCredential = await createUser(email, password);
      const user = userCredential.user;

      // 2️⃣ Update Firebase profile
      await updateUserProfile(user, {
        displayName: name,
        photoURL: photo?.[0] ? URL.createObjectURL(photo[0]) : "",
      });

      // 3️⃣ Prepare user info for MongoDB
      const userInfo = {
        uid: user.uid,
        name: name,
        email: email,
        photoURL: photo?.[0] ? URL.createObjectURL(photo[0]) : "",
        role: "user",
        badge: "bronze",
        membership: false,
        provider: "email",
        last_login: new Date(),
        aboutMe: "",
      };

      await axios.post("http://localhost:3000/users", userInfo);

      // ✅ Confetti + Bronze Badge Alert + Redirect to login
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      Swal.fire({
        title: "Account Created!",
        html: `
          <div class="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-yellow-600 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3 7h7l-5.5 4.5 2 7-6-4-6 4 2-7L2 9h7l3-7z"/>
            </svg>
          </div>
          Bronze badge awarded!`,
        icon: "success",

      }).then(() => {
        navigate("/");
      });

      reset();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

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
    <div className="min-h-screen mt-15 bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full flex flex-col lg:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-indigo-800 p-12 flex-col justify-center items-center text-white relative">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10 text-center">
            <MdForum className="w-24 h-24 mx-auto mb-6 text-indigo-100 animate-float" />
            <h1 className="text-4xl font-bold mb-4">
              Welcome to <span className="text-indigo-200">Forum</span>X
            </h1>
            <p className="text-xl text-indigo-100">
              Connect, share, and discover discussions across topics you love.
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              Create your account
            </h2>
            <p className="text-gray-600 mb-8">
              Join ForumX to participate in discussions and connect with the community.
            </p>

            {/* Registration Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    {...register("name", { required: true })}
                    className="block w-full pl-10 pr-3 py-3 border rounded-lg"
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-sm">Name is required</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    {...register("email", { required: true })}
                    className="block w-full pl-10 pr-3 py-3 border rounded-lg"
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm">Email is required</p>}
              </div>

              {/* Profile Photo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo (Optional)</label>
                <input type="file" {...register("photo")} accept="image/*" />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", { required: true, minLength: 6 })}
                    className="block w-full pl-10 pr-10 py-3 border rounded-lg"
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
                {errors.password && <p className="text-red-500 text-sm">Password must be at least 6 characters</p>}
              </div>

              {/* Create Account */}
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Create Account
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm text-gray-500">Or continue with</div>
            </div>

            {/* Google Sign Up */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex justify-center items-center py-3 px-4 border rounded-lg shadow-sm bg-white hover:bg-gray-50"
            >
              <FaGoogle className="h-5 w-5 text-red-500 mr-2" /> Continue with Google
            </button>

            {/* Sign In Link */}
            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600 font-medium hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
