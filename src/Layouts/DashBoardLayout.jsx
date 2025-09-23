import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router";
import { FaUser, FaPlusCircle, FaFileAlt, FaCreditCard, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";
import Logo from "../Components/Logo";
import useAuth from "../Hooks/useAuth";
import Swal from "sweetalert2";

const DashboardLayout = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  const menuItems = [
    { key: "dashboard", icon: <FaTachometerAlt />, label: "Dashboard", link: "/dashboard" },
    { key: "profile", icon: <FaUser />, label: "My Profile", link: "profile" },
    { key: "add-post", icon: <FaPlusCircle />, label: "Add Post", link: "add-post" },
    { key: "my-post", icon: <FaFileAlt />, label: "My Posts", link: "my-post" },
    { key: "membership", icon: <FaCreditCard />, label: "Membership", link: "membership" },
    { key: "logout", icon: <FaSignOutAlt />, label: "Logout", action: handleLogout },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-[#19183B] border-r-2 border-indigo-700 text-white w-64 flex-shrink-0 transition-all duration-300 ${sidebarOpen ? "block" : "hidden"} md:block`}
      >
        <div className="flex items-center justify-center py-6 border-b border-indigo-600">
          <Logo />
        </div>
        <nav className="mt-6">
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
      <div className="flex-1 flex flex-col ">
        {/* Header */}
        <header className="flex items-center justify-between bg-gradient-to-r from-indigo-500 to-blue-400 text-white px-6 py-6 shadow-md">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden btn btn-ghost text-white"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FaTachometerAlt /> Dashboard
            </h1>
          </div>

          {/* User Dropdown */}
          {user && (
            <div className="dropdown dropdown-end">
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
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-lg shadow p-6 min-h-[80vh]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
