import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import {
  FaGoogle,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaUser,
} from "react-icons/fa";
import { MdForum } from "react-icons/md";
import Swal from "sweetalert2";
import confetti from "canvas-confetti";
import useAuth from "../Hooks/useAuth";
import useAxiosSecure from "../Hooks/useAxiosSecure";

import Lottie from "lottie-react";
import bronzeBadge from "../../Public/assets/New Medal.json";
import AOS from "aos";
import "aos/dist/aos.css";
import { useTheme } from "../Hooks/useTheme";

const Register = () => {
  const { createUser, updateUserProfile, signInWithGoogle } = useAuth();
  const { isDarkMode } = useTheme();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const {
    register: formRegister,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const validatePassword = (password) => {
    if (password.length < 6)
      return "Password must be at least 6 characters long";
    if (!/[A-Z]/.test(password))
      return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(password))
      return "Password must contain at least one lowercase letter";
    return "";
  };

  const showBadgeAlert = () => {
    Swal.fire({
      title: "Account Created!",
      html: `<div id="lottie-container" style="width:200px;height:200px;margin:0 auto;"></div><p>Bronze badge awarded!</p>`,
      showConfirmButton: true,
      didOpen: () => {
        const container = document.getElementById("lottie-container");
        if (container) {
          const div = document.createElement("div");
          container.appendChild(div);
          import("react-dom/client").then((ReactDOM) => {
            ReactDOM.createRoot(div).render(
              <Lottie animationData={bronzeBadge} loop={true} />
            );
          });
        }
      },
    }).then(() => navigate("/"));
  };

  const onSubmit = async (data) => {
    try {
      const { name, email, password, photo } = data;
      const validationError = validatePassword(password);
      if (validationError) {
        setPasswordError(validationError);
        Swal.fire("Password Error", validationError, "error");
        return;
      }

      const userCredential = await createUser(email, password);
      const user = userCredential.user;

      await updateUserProfile(user, {
        displayName: name,
        photoURL: photo?.[0] ? URL.createObjectURL(photo[0]) : "",
      });

      const userInfo = {
        uid: user.uid,
        name,
        email,
        photoURL: photo?.[0] ? URL.createObjectURL(photo[0]) : "",
        role: "user",
        badge: "bronze",
        membership: false,
        provider: "email",
        last_login: new Date(),
        aboutMe: "",
      };

      await axiosSecure.post("/users", userInfo);

      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      showBadgeAlert();

      reset();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;

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

      const res = await axiosSecure.post("/users", userInfo);
      const isNewUser = res.status === 201;

      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      if (isNewUser) showBadgeAlert();
      else
        Swal.fire("Signed in successfully!", "Welcome back!", "success").then(
          () => navigate("/")
        );
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <div
      className={`min-h-screen pt-20 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-500 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div
        className={`max-w-7xl w-full flex flex-col lg:flex-row rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Left Section */}
        <div
          className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-indigo-800 p-12 flex-col justify-center items-center text-white relative"
          data-aos="fade-right"
        >
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
        <div
          className={`w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center transition-colors ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          }`}
          data-aos="fade-left"
        >
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-extrabold mb-2">Create your account</h2>
            <p className={`mb-8 ${ isDarkMode ? "text-white" :"text-gray-800"} `}>
              Join ForumX to participate in discussions and connect with the
              community.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div data-aos="fade-up">
                <label className="block text-sm font-medium mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    {...formRegister("name", { required: true })}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-100"
                        : "bg-white border-gray-300"
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm">Name is required</p>
                )}
              </div>

              {/* Email */}
              <div data-aos="fade-up" data-aos-delay="100">
                <label className="block text-sm font-medium mb-1">Email *</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    {...formRegister("email", { required: true })}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-100"
                        : "bg-white border-gray-300"
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm">Email is required</p>
                )}
              </div>

              {/* Profile Photo */}
              <div data-aos="fade-up" data-aos-delay="200">
                <label className="block text-sm font-medium mb-1">
                  Profile Photo (Optional)
                </label>
                <input
                  type="file"
                  {...formRegister("photo")}
                  accept="image/*"
                  className="w-full file-input file-input-bordered file-input-neutral"
                />
              </div>

              {/* Password */}
              <div data-aos="fade-up" data-aos-delay="300">
                <label className="block text-sm font-medium mb-1">
                  Password *
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...formRegister("password", { required: true })}
                    onChange={(e) =>
                      setPasswordError(validatePassword(e.target.value))
                    }
                    className={`block w-full pl-10 pr-10 py-3 border rounded-lg ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-100"
                        : "bg-white border-gray-300"
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
                {passwordError && (
                  <p className="text-red-500 text-sm">{passwordError}</p>
                )}
                {errors.password && (
                  <p className="text-red-500 text-sm">Password is required</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!!passwordError}
                className="w-full py-3 px-4 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Create Account
              </button>
            </form>

            {/* Divider */}
            <div
              className="relative my-6"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm text-gray-500 dark:text-gray-400">
                Or continue with
              </div>
            </div>

            {/* Google */}
            <button
              onClick={handleGoogleSignIn}
              className={`w-full flex justify-center items-center py-3 px-4 border rounded-lg shadow-sm transition ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 hover:bg-gray-600"
                  : "bg-white hover:bg-gray-50"
              }`}
              data-aos="fade-up"
              data-aos-delay="500"
            >
              <FaGoogle className="h-5 w-5 text-red-500 mr-2" /> Continue with
              Google
            </button>

            {/* Sign In Link */}
            <div
              className="mt-6 text-center text-sm"
              data-aos="fade-up"
              data-aos-delay="600"
            >
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-600 font-medium hover:underline"
              >
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
