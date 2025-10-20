import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaBell,
  FaHome,
  FaUserFriends,
  FaInfoCircle,
  FaBars,
  FaTimes,
  FaPhoneAlt,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import useAuth from "../Hooks/useAuth";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import Logo from "./Logo";
import { useTheme } from "../Hooks/useTheme";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme(); // Add this hook
  const axiosSecure = useAxiosSecure();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch announcements
  const { data: announcements = [] } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => (await axiosSecure.get("/announcements")).data,
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout confirmation
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out from your account!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Logout",
    }).then((result) => {
      if (result.isConfirmed) {
        logOut();
        Swal.fire(
          "Logged Out!",
          "You have been successfully logged out.",
          "success"
        );
      }
    });
  };

  // Scroll to notifications
  const goToNotifications = () => {
    const notifSection = document.getElementById("notifications");
    if (notifSection) notifSection.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={`max-w-8xl mx-auto px-20 ${isDarkMode ? 'bg-gray-900/90 text-white' : 'bg-white/90 text-gray-800'} shadow-lg fixed top-0 left-0 w-full z-50 backdrop-blur-md transition-colors duration-300`}>
      <div className="">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-1 ${isDarkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-500'} font-medium transition`}
            >
              <FaHome /> <span>Home</span>
            </Link>

            <Link
              to="/membership"
              className={`flex items-center space-x-1 ${isDarkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-500'} font-medium transition`}
            >
              <FaUserFriends /> <span>Membership</span>
            </Link>

            <Link
              to="/about"
              className={`flex items-center space-x-1 ${isDarkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-500'} font-medium transition`}
            >
              <FaInfoCircle /> <span>About</span>
            </Link>
            <Link
              to="/contact"
              className={`flex items-center space-x-1 ${isDarkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-500'} font-medium transition`}
            >
              <FaPhoneAlt /> <span>Contact</span>
            </Link>

            {user && (
              <Link
                to="/notifications"
                className={`flex items-center space-x-1 ${isDarkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-500'} font-medium transition`}
              >
                <FaBell /> <span>Notifications</span>
              </Link>
            )}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
            </button>

            {/* Notification Icon */}
            <div
              className="relative cursor-pointer"
              onClick={goToNotifications}
            >
              <FaBell className={`text-xl ${isDarkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-700 hover:text-indigo-500'} transition`} />
              {announcements.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 animate-pulse">
                  {announcements.length}
                </span>
              )}
            </div>

            {/* Auth Section */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <img
                  src={user.photoURL || "/default-avatar.png"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600 cursor-pointer hover:scale-105 transition"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                />
                {dropdownOpen && (
                  <div className={`absolute right-0 mt-3 w-56 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border py-4 z-50 text-center`}>
                    <img
                      src={user.photoURL || "/default-avatar.png"}
                      alt="Profile"
                      className="w-20 h-20 mx-auto rounded-full border-4 border-indigo-100 shadow-md"
                    />
                    <p className={`mt-3 font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                      {user.displayName}
                    </p>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                      {user.email}
                    </p>

                    <Link
                      to="/dashboard/admin-profile"
                      className={`mt-4 block mx-4 py-2 rounded-lg ${
                        isDarkMode 
                          ? 'bg-indigo-900/40 text-indigo-300 hover:bg-indigo-800' 
                          : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                      } font-medium transition`}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="mt-2 w-[calc(100%-16px)] mx-2 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2.5 font-medium bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
              >
                Join Us
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700 text-yellow-400' 
                  : 'bg-gray-200 text-gray-700'
              }`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`${isDarkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-500'} focus:outline-none`}
            >
              {mobileMenuOpen ? (
                <FaTimes className="w-6 h-6" />
              ) : (
                <FaBars className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-t shadow-lg`}>
          <div className="px-5 py-4 space-y-3">
            <Link
              to="/"
              className={`flex items-center space-x-2 ${isDarkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-500'} font-medium`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaHome /> <span>Home</span>
            </Link>

            <Link
              to="/membership"
              className={`flex items-center space-x-2 ${isDarkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-500'} font-medium`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaUserFriends /> <span>Membership</span>
            </Link>

            <Link
              to="/about"
              className={`flex items-center space-x-2 ${isDarkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-500'} font-medium`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaInfoCircle /> <span>About</span>
            </Link>

            <Link
              to="/contact"
              className={`flex items-center space-x-2 ${isDarkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-500'} font-medium`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaPhoneAlt /> <span>Contact</span>
            </Link>

            {user && (
              <Link
                to="/notifications"
                className={`flex items-center space-x-2 ${isDarkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-500'} font-medium`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaBell /> <span>Notifications</span>
              </Link>
            )}

            {/* Mobile Auth Section */}
            {user ? (
              <div className="space-y-2 mt-3">
                <Link
                  to="/dashboard"
                  className={`block py-2 px-3 rounded-lg ${
                    isDarkMode 
                      ? 'bg-indigo-900/40 text-indigo-300 hover:bg-indigo-800' 
                      : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                  } font-medium`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full py-2 px-3 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="block py-2 px-3 rounded-lg bg-indigo-500 text-white font-medium hover:bg-indigo-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Join Us
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;