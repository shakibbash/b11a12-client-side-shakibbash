import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaBell, FaHome, FaUserFriends, FaInfoCircle, FaBars, FaTimes } from "react-icons/fa";
import useAuth from "../Hooks/useAuth";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import Logo from "./Logo";

const Navbar = () => {
  const { user, logOut } = useAuth();
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

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out from your account!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        logOut();
        Swal.fire("Logged Out!", "You have been successfully logged out.", "success");
      }
    });
  };

  const goToNotifications = () => {
    const notifSection = document.getElementById("notifications");
    if (notifSection) {
      notifSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="bg-white/90 shadow-lg fixed top-0 left-0 w-full z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Logo />
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8 items-center flex-1 justify-center">
            <Link to="/" className="flex items-center space-x-1 hover:text-indigo-400 font-medium transition-colors duration-200">
              <FaHome /> <span>Home</span>
            </Link>
            {user && !user.membership && (
              <Link to="/membership" className="flex items-center space-x-1 hover:text-indigo-400 font-medium transition-colors duration-200">
                <FaUserFriends /> <span>Membership</span>
              </Link>
            )}
            <Link to="/about" className="flex items-center space-x-1 hover:text-indigo-400 font-medium transition-colors duration-200">
              <FaInfoCircle /> <span>About</span>
            </Link>
            <Link to="/notifications" className="flex items-center space-x-1 hover:text-indigo-400 font-medium transition-colors duration-200">
  <FaBell /> <span>Notifications</span>
</Link>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">

            {/* Notification */}
            <div className="relative cursor-pointer" onClick={goToNotifications}>
              <FaBell className="text-xl hover:text-indigo-400 transition-colors duration-200" />
              {announcements.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 animate-pulse">
                  {announcements.length}
                </span>
              )}
            </div>

            {/* User Auth */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <img
                  src={user.photoURL || "/default-avatar.png"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-300 hover:scale-105 transition-transform duration-200"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                />
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-4 z-50 overflow-hidden text-center">
                    <div className="flex justify-center">
                      <img
                        src={user.photoURL || "/default-avatar.png"}
                        alt="Profile"
                        className="w-20 h-20 rounded-full border-4 border-indigo-100 shadow-md"
                      />
                    </div>
                    <p className="mt-3 font-semibold text-gray-800">{user.displayName}</p>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                    <Link
                      to="/dashboard"
                      className="mt-4 block mx-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 font-medium hover:bg-indigo-100 transition-all"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="mt-2 w-[calc(100%-16px)] mx-2 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-all"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2.5 font-medium bg-blue-50 hover:bg-blue-100 hover:text-blue-600 text-blue-500 rounded-lg text-sm"
              >
                Join Us
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-800 hover:text-indigo-500 focus:outline-none"
            >
              {mobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-4 space-y-2">
            <Link to="/" className="flex items-center space-x-2 hover:text-indigo-400 font-medium">
              <FaHome /> <span>Home</span>
            </Link>
            {user && !user.membership && (
              <Link to="/membership" className="flex items-center space-x-2 hover:text-indigo-400 font-medium">
                <FaUserFriends /> <span>Membership</span>
              </Link>
            )}
            <Link to="/about" className="flex items-center space-x-2 hover:text-indigo-400 font-medium">
              <FaInfoCircle /> <span>About</span>
            </Link>
            <Link to="/notifications" className="flex items-center space-x-2 hover:text-indigo-400 font-medium">
  <FaBell /> <span>Notifications</span>
</Link>
            <div className="flex items-center gap-2 mt-2 cursor-pointer" onClick={goToNotifications}>
              <FaBell className="text-xl" />
              {announcements.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 animate-pulse">
                  {announcements.length}
                </span>
              )}
            </div>

            {user ? (
              <div className="space-y-2 mt-2">
                <Link to="/dashboard" className="block py-2 px-3 rounded-lg bg-indigo-50 text-indigo-600 font-medium hover:bg-indigo-100">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full py-2 px-3 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="block py-2 px-3 rounded-lg bg-blue-50 text-blue-500 font-medium hover:bg-blue-100 hover:text-blue-600"
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
