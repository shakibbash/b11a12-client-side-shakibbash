import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  FaUsers,
  FaFileAlt,
  FaComments,
  FaTags,
  FaChartPie,
  FaChartBar,
  FaUserShield,
  FaBullhorn,
  FaTimes,
} from "react-icons/fa";
import AnnouncementsLists from "./AnnouncementLists";

const COLORS = ["#4ade80", "#60a5fa", "#facc15"]; // green, blue, yellow
const DARK_BG = "#1f2937";
const DARK_TEXT = "#f3f4f6";

const AdminProfile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [stats, setStats] = useState({ posts: 0, comments: 0, users: 0 });
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosSecure.get("/admin/stats");
        setStats({
          posts: res.data.totalPosts,
          comments: res.data.totalComments,
          users: res.data.totalUsers,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, [axiosSecure]);

  // Fetch existing tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axiosSecure.get("/tags");
        setTags(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTags();
  }, [axiosSecure]);

  // Fetch recent announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axiosSecure.get("/announcements?limit=5");
        setRecentAnnouncements(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAnnouncements();
  }, [axiosSecure]);

  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    try {
      const res = await axiosSecure.post("/tags", { tags: [newTag] });
      // Re-fetch tags so _id comes from DB
      const updated = await axiosSecure.get("/tags");
      setTags(updated.data);
      setNewTag("");
      Swal.fire("Success", "Tag added successfully", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.response?.data?.message || "Failed to add tag", "error");
    }
  };

  // REMOVE TAG FUNCTION
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

  const pieData = [
    { name: "Posts", value: stats.posts },
    { name: "Comments", value: stats.comments },
    { name: "Users", value: stats.users },
  ];

  const barData = [
    { name: "Posts", value: stats.posts },
    { name: "Comments", value: stats.comments },
    { name: "Users", value: stats.users },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Profile Card */}
      <div className="bg-white shadow-lg rounded-xl p-4 md:p-6 flex flex-col sm:flex-row items-center gap-4 md:gap-6 border-l-4 sm:border-l-8 border-blue-500">
        <img
          src={user?.photoURL || "https://via.placeholder.com/150"}
          alt="Avatar"
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-blue-300"
        />
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 justify-center sm:justify-start">
            <FaUserShield /> {user?.displayName}
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">{user?.email}</p>
          <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-4 justify-center sm:justify-start">
            <span className="badge badge-success flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <FaFileAlt className="text-xs sm:text-sm" /> Posts: {stats.posts}
            </span>
            <span className="badge badge-info flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <FaComments className="text-xs sm:text-sm" /> Comments: {stats.comments}
            </span>
            <span className="badge badge-warning flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <FaUsers className="text-xs sm:text-sm" /> Users: {stats.users}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 bg-white rounded-2xl p-4 sm:p-6">
        <div className="bg-green-100 p-3 sm:p-4 rounded-xl shadow flex items-center gap-3 sm:gap-4 hover:shadow-lg transition cursor-pointer border-r-4 sm:border-r-8 border-green-500">
          <FaFileAlt className="text-green-600 text-2xl sm:text-3xl" />
          <div>
            <p className="font-semibold text-gray-700 text-sm sm:text-base">Posts</p>
            <p className="text-xl sm:text-2xl font-bold text-green-800">{stats.posts}</p>
          </div>
        </div>

        <div className="bg-blue-100 p-3 sm:p-4 rounded-xl shadow flex items-center gap-3 sm:gap-4 hover:shadow-lg transition cursor-pointer border-r-4 sm:border-r-8 border-blue-500">
          <FaComments className="text-blue-600 text-2xl sm:text-3xl" />
          <div>
            <p className="font-semibold text-gray-700 text-sm sm:text-base">Comments</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-800">{stats.comments}</p>
          </div>
        </div>

        <div className="bg-yellow-100 p-3 sm:p-4 rounded-xl shadow flex items-center gap-3 sm:gap-4 hover:shadow-lg transition cursor-pointer border-r-4 sm:border-r-8 border-yellow-500">
          <FaUsers className="text-yellow-600 text-2xl sm:text-3xl" />
          <div>
            <p className="font-semibold text-gray-700 text-sm sm:text-base">Users</p>
            <p className="text-xl sm:text-2xl font-bold text-yellow-800">{stats.users}</p>
          </div>
        </div>
      </div>

      {/* Pie + Bar Charts Dark Mode */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 bg-gray-900 shadow rounded-xl p-4 sm:p-6">
        <div className="mb-6 lg:mb-0">
          <h3 className="font-bold mb-4 text-white flex items-center justify-center gap-2 text-sm sm:text-base">
            <FaChartPie /> Site Activity (Pie)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={{ fill: DARK_TEXT, fontSize: 12 }}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: DARK_BG, color: DARK_TEXT, fontSize: 12 }} />
              <Legend wrapperStyle={{ color: DARK_TEXT, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3 className="font-bold mb-4 text-white flex items-center justify-center gap-2 text-sm sm:text-base">
            <FaChartBar /> Site Activity (Bar)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid stroke="#374151" />
              <XAxis dataKey="name" stroke={DARK_TEXT} fontSize={12} />
              <YAxis stroke={DARK_TEXT} fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: DARK_BG, color: DARK_TEXT, fontSize: 12 }} />
              <Legend wrapperStyle={{ color: DARK_TEXT, fontSize: 12 }} />
              <Bar dataKey="value" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions Linear Cards */}
      <div className="grid gap-4 my-6 sm:my-10 bg-white rounded-2xl p-4 sm:p-6">
        <h3 className="font-bold text-lg sm:text-xl mb-2 flex items-center gap-2 justify-center">
          <FaUserShield /> Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <NavLink
            to="/dashboard/users"
            className="card bg-blue-100 shadow-lg hover:bg-blue-200 transition cursor-pointer p-3 sm:p-4 rounded-xl flex items-center gap-3 sm:gap-4 border-r-4 sm:border-r-8 border-blue-500"
          >
            <FaUsers className="text-blue-600 text-2xl sm:text-3xl" />
            <div className="text-center sm:text-left flex-1">
              <h4 className="font-semibold text-gray-700 text-sm sm:text-base">Manage Users</h4>
              <p className="text-gray-500 text-xs sm:text-sm">View and edit all users</p>
            </div>
          </NavLink>

          <NavLink
            to="/dashboard/posts"
            className="card bg-green-100 shadow-lg hover:bg-green-200 transition cursor-pointer p-3 sm:p-4 rounded-xl flex items-center gap-3 sm:gap-4 border-r-4 sm:border-r-8 border-green-500"
          >
            <FaFileAlt className="text-green-600 text-2xl sm:text-3xl" />
            <div className="text-center sm:text-left flex-1">
              <h4 className="font-semibold text-gray-700 text-sm sm:text-base">Manage Posts</h4>
              <p className="text-gray-500 text-xs sm:text-sm">Review and moderate posts</p>
            </div>
          </NavLink>

          <NavLink
            to="/dashboard/comments"
            className="card bg-yellow-100 shadow-lg hover:bg-yellow-200 transition cursor-pointer p-3 sm:p-4 rounded-xl flex items-center gap-3 sm:gap-4 border-r-4 sm:border-r-8 border-yellow-500"
          >
            <FaComments className="text-yellow-600 text-2xl sm:text-3xl" />
            <div className="text-center sm:text-left flex-1">
              <h4 className="font-semibold text-gray-700 text-sm sm:text-base">Reported Comments</h4>
              <p className="text-gray-500 text-xs sm:text-sm">Check flagged comments</p>
            </div>
          </NavLink>

          <NavLink
            to="/dashboard/announcements"
            className="card bg-orange-100 shadow-lg hover:bg-orange-200 transition cursor-pointer p-3 sm:p-4 rounded-xl flex items-center gap-3 sm:gap-4 border-r-4 sm:border-r-8 border-orange-500"
          >
            <FaBullhorn className="text-orange-600 text-2xl sm:text-3xl" />
            <div className="text-center sm:text-left flex-1">
              <h4 className="font-semibold text-gray-700 text-sm sm:text-base">Announcements</h4>
              <p className="text-gray-500 text-xs sm:text-sm">View or create announcements</p>
            </div>
          </NavLink>
        </div>
      </div>

      {/* Tag Management */}
      <div className="bg-white shadow rounded-xl p-4 sm:p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2 text-sm sm:text-base">
          <FaTags /> Manage Tags
        </h3>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            className="input input-bordered w-full text-sm sm:text-base"
            placeholder="Add new tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
          />
          <button className="btn btn-primary text-sm sm:text-base whitespace-nowrap">
            Add
          </button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {tags.map((tag) => (
            <span
              key={tag._id}
              className="badge badge-outline badge-primary flex items-center gap-1 text-xs sm:text-sm"
            >
              {tag.name}
              <button
                className="ml-1 text-red-500 hover:text-red-700"
                onClick={() => handleRemoveTag(tag._id)}
              >
                <FaTimes className="text-xs" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Recent Announcements */}
      <div className="bg-white shadow rounded-xl p-4 sm:p-6">
        <h3 className="font-bold mb-4 flex justify-center items-center gap-2 text-sm sm:text-base">
          <FaBullhorn /> Recent Announcements
        </h3>
        <AnnouncementsLists />
      </div>
    </div>
  );
};

export default AdminProfile;