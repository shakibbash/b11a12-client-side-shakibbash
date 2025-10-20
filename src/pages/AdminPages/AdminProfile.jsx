import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";
import {
  FaUsers,
  FaFileAlt,
  FaCrown,
  FaMoneyCheck,
  FaChartPie,
  FaChartLine,
  FaUserShield,
  FaBullhorn,
  FaTags,
  FaComments,
  FaTimes,
} from "react-icons/fa";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";
import AnnouncementsLists from "./AnnouncementLists";

const AdminProfile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [stats, setStats] = useState({
    totalUsers: 0,
    bronzeUsers: 0,
    goldenUsers: 0,
    totalPosts: 0,
    totalComments: 0,
  });
  const [payments, setPayments] = useState([]);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, paymentsRes, tagsRes, announcementsRes] =
          await Promise.all([
            axiosSecure.get("/stats/counts"),
            axiosSecure.get("/membership-payments"),
            axiosSecure.get("/tags"),
            axiosSecure.get("/announcements?limit=5"),
          ]);

        setStats(statsRes.data || {});
        setPayments(paymentsRes.data?.data || []);
        setTags(tagsRes.data || []);
        setRecentAnnouncements(announcementsRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        Swal.fire(
          "Error",
          "Failed to load dashboard data",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [axiosSecure]);

  // Safe total revenue
  const totalRevenue =
    payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

  // Revenue chart data
  const revenueData = payments.slice(0, 6).map((p) => ({
    date: new Date(p.date || p.createdAt || Date.now()).toLocaleDateString(),
    revenue: p.amount || 0,
  }));

 // Membership distribution

const membershipData = [
  { name: "Gold Members", value: stats.goldenUsers || 0, color: "#6366f1" }, 
  { name: "Bronze Members", value: stats.bronzeUsers || 0, color: "#4f46e5" }, 
  {
    name: "Regular Users",
    value: Math.max(
      0,
      (stats.totalUsers || 0) - ((stats.goldenUsers || 0) + (stats.bronzeUsers || 0))
    ),
    color: "#4338ca", // Indigo-700
  },
];



  const activityData = [
    { name: "Posts", value: stats.totalPosts || 0, color: "#4f46e5" },
    { name: "Comments", value: stats.totalComments || 0, color: "#10b981" },
    { name: "Users", value: stats.totalUsers || 0, color: "#f59e0b" },
  ];

  // Tag management
  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    try {
      await axiosSecure.post("/tags", { tags: [newTag] });
      const updated = await axiosSecure.get("/tags");
      setTags(updated.data || []);
      setNewTag("");
      Swal.fire("Success", "Tag added successfully", "success");
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to add tag",
        "error"
      );
    }
  };

  const handleRemoveTag = async (tagId) => {
    try {
      await axiosSecure.delete(`/tags/${tagId}`);
      setTags((prev) => prev.filter((tag) => tag._id !== tagId));
      Swal.fire("Deleted!", "Tag has been removed.", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to remove tag", "error");
    }
  };

  if (loading) {
    return (
       <div className="flex flex-col items-center justify-center py-16">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="text-gray-600 mt-4 font-medium">
        Loading Dashboard
        </p>
        <p className="text-gray-400 text-sm mt-2">Please wait a moment</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 space-y-6">
      {/* Header */}
<div className="bg-white rounded-2xl p-6 text-black shadow-lg flex justify-between items-center">
  <div className="flex items-center gap-5">
    {/* User Avatar */}
    <div className="relative w-20 h-20">
      <img
        src={user?.photoURL || "https://via.placeholder.com/80"}
        alt={user?.displayName}
        className="w-20 h-20 rounded-full border-4 border-indigo-500 object-cover shadow-md"
      />
      <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></span>
    </div>

    <div>
      <h1 className="text-3xl font-semibold drop-shadow-md">Admin Dashboard</h1>
      <p className="text-gray-700 mt-1">Welcome back, {user?.displayName}</p>
    </div>
  </div>

  <div className="text-right bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl">
    <p className="text-sm text-black">Total Revenue</p>
    <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
  </div>
</div>



      {/* Stats */}
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Total Users */}
  <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500 flex items-center justify-between">
    <div>
      <p className="text-gray-600">Total Users</p>
      <h2 className="text-3xl font-bold">
        {(stats.totalUsers || 0).toLocaleString()}
      </h2>
      <p className="text-sm text-gray-500">
        Gold: {stats.goldenUsers || 0} • Bronze: {stats.bronzeUsers || 0}
      </p>
    </div>
    <FaUsers className="text-blue-500 text-3xl" />
  </div>

  {/* Total Posts */}
  <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-green-500 flex items-center justify-between">
    <div>
      <p className="text-gray-600">Total Posts</p>
      <h2 className="text-3xl font-bold">
        {(stats.totalPosts || 0).toLocaleString()}
      </h2>
      <p className="text-sm text-gray-500">
        {(stats.totalComments || 0).toLocaleString()} Comments
      </p>
    </div>
    <FaFileAlt className="text-green-500 text-3xl" />
  </div>

  {/* Premium Members */}
  <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-yellow-500 flex items-center justify-between">
    <div>
      <p className="text-gray-600">Premium Members</p>
      <h2 className="text-3xl font-bold">
        {((stats.goldenUsers || 0) + (stats.bronzeUsers || 0)).toLocaleString()}
      </h2>
    </div>
    <FaCrown className="text-yellow-500 text-3xl" />
  </div>

  {/* Total Revenue */}
  <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-purple-500 flex items-center justify-between">
    <div>
      <p className="text-gray-600">Total Revenue</p>
      <h2 className="text-3xl font-bold">${totalRevenue.toLocaleString()}</h2>
    </div>
    <FaMoneyCheck className="text-purple-500 text-3xl" />
  </div>
</div>


      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-2 rounded-2xl shadow-sm">
          <h3 className="text-lg text-center">Membership Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={membershipData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(1)}%)`
                }
              >
                {membershipData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, "Users"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h3>Recent Payments</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
              <Area
                type="monotone"
                dataKey="revenue"
                 fill="#c7d2fe"  
                 stroke="#4f46e5" 
    
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
      </div>
      {/* Activity & Actions Section */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Site Activity */}
  <div className="bg-white rounded-2xl shadow-sm p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
      <FaChartLine className="text-indigo-600" />
      Platform Activity
    </h3>
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={activityData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => [value.toLocaleString(), "Count"]} />
        <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* Quick Actions */}
  <div className="bg-white rounded-2xl shadow-sm p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
      <FaUserShield className="text-indigo-600" />
      Quick Actions
    </h3>
    <div className="grid grid-cols-2 gap-4">
      {[
        { to: "/dashboard/manage-users", icon: FaUsers, label: "Manage Users", color: "blue" },
        { to: "/dashboard/posts", icon: FaFileAlt, label: "Manage Posts", color: "green" },
       
        { to: "/dashboard/announcement", icon: FaBullhorn, label: "Announcements", color: "orange" },
        { to: "/dashboard/reports", icon: FaChartLine, label: "View Reports", color: "purple" },
 
      ].map((action, index) => (
        <NavLink
          key={index}
          to={action.to}
          className={`p-8 rounded-xl  transition-all duration-200 hover:shadow-md flex flex-col items-center text-center bg-gray-50 hover:bg-gray-100`}
        >
          <action.icon className="text-indigo-600 text-2xl mb-2" />
          <p className="font-medium text-gray-900 text-sm">{action.label}</p>
        </NavLink>
      ))}
    </div>
  </div>
</div>

{/* Bottom Section */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Tag Management */}
  <div className="bg-white rounded-2xl shadow-sm p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <FaTags className="text-indigo-600" />
        Manage Tags
      </h3>
      <span className="text-sm text-gray-500">
        {(tags?.length || 0)} tags
      </span>
    </div>
    <div className="flex gap-3 mb-4">
      <input
        type="text"
        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        placeholder="Add new tag..."
        value={newTag}
        onChange={(e) => setNewTag(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
      />
      <button
        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50"
        onClick={handleAddTag}
        disabled={!newTag.trim()}
      >
        Add Tag
      </button>
    </div>
    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
      {(tags || []).map((tag) => (
        <span
          key={tag._id}
          className="bg-indigo-100 text-indigo-800 px-3 py-2 rounded-full text-sm flex items-center gap-2 hover:bg-indigo-200 transition-colors"
        >
          <FaTags className="text-indigo-600 text-xs" />
          {tag.name}
          <button
            className="ml-1 text-red-500 hover:text-red-700 transition-colors"
            onClick={() => handleRemoveTag(tag._id)}
            title="Remove tag"
          >
            <FaTimes className="text-xs" />
          </button>
        </span>
      ))}
    </div>
  </div>

  {/* Recent Announcements */}
  <div className="bg-white rounded-2xl shadow-sm p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <FaBullhorn className="text-indigo-600" />
        Recent Announcements
      </h3>
      <NavLink
        to="/dashboard/announcements"
        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
      >
        View All
      </NavLink>
    </div>
    {recentAnnouncements?.length > 0 ? (
      <AnnouncementsLists announcements={recentAnnouncements} />
    ) : (
      <div className="text-center py-8">
        <FaBullhorn className="text-gray-300 text-4xl mx-auto mb-3" />
        <p className="text-gray-500">No announcements yet</p>
        <NavLink
          to="/dashboard/announcements/create"
          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mt-2 inline-block"
        >
          Create your first announcement
        </NavLink>
      </div>
    )}
  </div>
</div>

    </div>
  );
};

export default AdminProfile;
