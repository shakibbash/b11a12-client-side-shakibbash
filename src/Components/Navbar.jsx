import { useState } from "react";
import { Link } from "react-router";
import { FaBell, FaHome, FaUserFriends, FaInfoCircle } from "react-icons/fa";
import { MdForum } from "react-icons/md";

const Navbar = ({ user, notifications }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="bg-white/90 shadow-lg   fixed top-0 left-0 w-full z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto sm:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-400 p-2 rounded-lg shadow-lg">
                <MdForum className="w-6 h-6 text-white" />
              </div>
              <div className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-indigo-400 bg-clip-text text-transparent">
                ForumX
              </div>
            </div>
          </div>

          {/* Center Links */}
          <div className="hidden md:flex space-x-8 items-center justify-center flex-1">
            <Link
              to="/"
              className="flex items-center space-x-1 hover:text-indigo-400 font-medium transition-colors duration-200"
            >
              <FaHome /> <span>Home</span>
            </Link>
            <Link
              to="/membership"
              className="flex items-center space-x-1 hover:text-indigo-400 font-medium transition-colors duration-200"
            >
              <FaUserFriends /> <span>Membership</span>
            </Link>
            <Link
              to="/about"
              className="flex items-center space-x-1 hover:text-indigo-400 font-medium transition-colors duration-200"
            >
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
              <div className="relative">
                <img
                  src={user.photoURL || "/default-avatar.png"}
                  alt="Profile"
                  className="w-8 h-8 rounded-full cursor-pointer border-2 border-gray-400 hover:scale-105 transition-transform duration-200"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                />
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-md py-2 z-50">
                    <p className="px-4 py-2 font-semibold border-b">{user.displayName}</p>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 hover:bg-indigo-50 transition-colors duration-200"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => console.log("Logout")}
                      className="w-full text-left px-4 py-2 hover:bg-indigo-50 transition-colors duration-200"
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

          {/* Mobile Menu (Optional) */}
          <div className="md:hidden">
            {/* Hamburger Menu */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
