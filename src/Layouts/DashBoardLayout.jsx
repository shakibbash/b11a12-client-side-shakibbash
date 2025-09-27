import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router";
import {
  FaUser,
  FaPlusCircle,
  FaFileAlt,
  FaCreditCard,
  FaSignOutAlt,
  FaTachometerAlt,
  FaHome,
  FaBars,
  FaTimes,
  FaBullhorn,
  FaUsers,
  FaExclamationTriangle,
} from "react-icons/fa";
import Logo from "../Components/Logo";
import useAuth from "../Hooks/useAuth";

import Swal from "sweetalert2";
import useUserRole from "../Hooks/useUserRole";

const DashboardLayout = () => {
  const { user, logOut } = useAuth();
  const { isAdmin, isUser } = useUserRole(); 
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logOut();
      Swal.fire({
        title: "Logged Out",
        text: "You have been logged out successfully!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/");
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Logout failed. Try again!",
        icon: "error",
      });
      console.error("Logout failed:", error);
    }
  };

  //  User Sidebar Links
  const userMenuItems = [
    { key: "dashboard", icon: <FaTachometerAlt />, label: "Dashboard", link: "/dashboard" },
    { key: "profile", icon: <FaUser />, label: "My Profile", link: "profile" },
    { key: "add-post", icon: <FaPlusCircle />, label: "Add Post", link: "add-post" },
    { key: "my-post", icon: <FaFileAlt />, label: "My Posts", link: "my-post" },
    { key: "membership", icon: <FaCreditCard />, label: "Membership", link: "/membership" },
  ];

  //  Admin Sidebar Links
  const adminMenuItems = [
    { key: "dashboard", icon: <FaTachometerAlt />, label: "Admin Dashboard", link: "/dashboard" },
    { key: "profile", icon: <FaUser />, label: "Admin Profile", link: "profile" },
    { key: "manage-users", icon: <FaUsers />, label: "Manage Users", link: "manage-users" },
    { key: "reports", icon: <FaExclamationTriangle />, label: "Reported Activities", link: "reports" },
    { key: "announcement", icon: <FaBullhorn />, label: "Make Announcement", link: "announcement" },
  ];

  //  Common Links
  const commonItems = [
    { key: "back-to-home", icon: <FaHome />, label: "Back to Home", link: "/" },
    { key: "logout", icon: <FaSignOutAlt />, label: "Logout", action: handleLogout },
  ];

  //  Final menu depending on role
  const menuItems = isAdmin ? [...adminMenuItems, ...commonItems] : [...userMenuItems, ...commonItems];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for md+ */}
      <aside className="hidden md:flex flex-col bg-[#19183B] w-64 text-white border-r-2 border-indigo-700 flex-shrink-0 transition-all duration-300">
        <div className="flex items-center justify-center py-6 border-b border-indigo-600">
          <Logo />
        </div>
        <nav className="mt-6 flex-1">
          {menuItems.map((item) =>
            item.link ? (
              <Link
                key={item.key}
                to={item.link}
                className="flex items-center gap-3 py-3 px-6 hover:bg-indigo-600 transition-colors rounded-lg"
              >
                {item.icon} <span>{item.label}</span>
              </Link>
            ) : (
              <button
                key={item.key}
                onClick={item.action}
                className="flex items-center gap-3 py-3 px-6 w-full text-left hover:bg-indigo-600 transition-colors rounded-lg"
              >
                {item.icon} <span>{item.label}</span>
              </button>
            )
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between bg-gradient-to-r from-indigo-500 to-blue-400 text-white px-6 py-6 shadow-md relative">
          <div className="flex items-center gap-3">
            {/* Hamburger for mobile */}
            <button
              className="md:hidden text-2xl focus:outline-none cursor-pointer"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FaTachometerAlt /> Dashboard
            </h1>
          </div>

          {/* User Dropdown */}
          {user && (
            <div className="dropdown dropdown-end hidden md:block">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img src={user.photoURL || "https://via.placeholder.com/150"} alt="avatar" />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-white rounded-box w-52 text-black"
              >
                <li>
                  <span className="font-bold">{user.email}</span>
                </li>
                <li>
                  <Link to="profile">My Profile</Link>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </div>
          )}

          {/* Mobile dropdown menu */}
          {mobileMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-[#19183B] shadow-md md:hidden z-50">
              <nav className="flex flex-col">
                {menuItems.map((item) =>
                  item.link ? (
                    <Link
                      key={item.key}
                      to={item.link}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 py-3 px-6 hover:bg-indigo-600"
                    >
                      {item.icon} <span>{item.label}</span>
                    </Link>
                  ) : (
                    <button
                      key={item.key}
                      onClick={() => {
                        item.action();
                        setMobileMenuOpen(false);
                      }}
                      className="cursor-pointer flex items-center gap-3 py-3 px-6 border-b text-left hover:bg-indigo-600"
                    >
                      {item.icon} <span>{item.label}</span>
                    </button>
                  )
                )}
              </nav>
            </div>
          )}
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="rounded-lg p-6 min-h-[80vh]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
