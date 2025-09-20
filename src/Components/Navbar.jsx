import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { FaBell, FaHome, FaUserFriends, FaInfoCircle } from "react-icons/fa";
import { MdForum } from "react-icons/md";
import useAuth from "../Hooks/useAuth";
import Swal from "sweetalert2";
import Logo from "./Logo";

const Navbar = ({ notifications }) => {
  const { user, logOut  } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
      confirmButtonColor: "#ef4444", // red
      cancelButtonColor: "#6b7280", // gray
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        logOut ();
        Swal.fire("Logged Out!", "You have been successfully logged out.", "success");
      }
    });
  };

  return (
    <nav className="bg-white/90 shadow-lg fixed top-0 left-0 w-full z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto sm:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
           <Logo></Logo>
          </div>

          {/* Center Links */}
          <div className="hidden md:flex space-x-8 items-center justify-center flex-1">
            <Link to="/" className="flex items-center space-x-1 hover:text-indigo-400 font-medium transition-colors duration-200">
              <FaHome /> <span>Home</span>
            </Link>
              {/* Only show Membership if user exists and is NOT a member */}
  {user && !user.membership && (
    <Link to="/membership" className="flex items-center space-x-1 hover:text-indigo-400 font-medium transition-colors duration-200">
      <FaUserFriends /> <span>Membership</span>
    </Link>
  )}
            <Link to="/about" className="flex items-center space-x-1 hover:text-indigo-400 font-medium transition-colors duration-200">
              <FaInfoCircle /> <span>About</span>
            </Link>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Notification */}
            <div className="relative">
              <FaBell className="text-xl cursor-pointer hover:text-indigo-400 transition-colors duration-200" />
              {notifications?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 animate-pulse">
                  {notifications.length}
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
                    
                    {/* Profile Image */}
                    <div className="flex justify-center">
                      <img
                        src={user.photoURL || "/default-avatar.png"}
                        alt="Profile"
                        className="w-20 h-20 rounded-full border-4 border-indigo-100 shadow-md"
                      />
                    </div>

                    {/* User Name */}
                    <p className="mt-3 font-semibold text-gray-800">{user.displayName}</p>
                    <p className="text-gray-400 text-sm">{user.email}</p>

                    {/* Dashboard Link */}
                    <Link
                      to="/dashboard"
                      className="mt-4 block mx-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 font-medium hover:bg-indigo-100 transition-all"
                    >
                      Dashboard
                    </Link>

                    {/* Logout Button */}
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
