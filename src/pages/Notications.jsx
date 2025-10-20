import { useEffect, useState } from "react";
import useAuth from "../Hooks/useAuth";
import useAxiosSecure from "../Hooks/useAxiosSecure";

import {
  FaBell,
  FaCheck,
  FaCheckDouble,
  FaTrash,
  FaEnvelope,
  FaComment,
  FaThumbsUp,
  FaUserPlus,
  FaExclamationTriangle,
  FaTimes,
  FaFilter
} from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import { useTheme } from "../Hooks/useTheme";

function Notifications() {
  const { user } = useAuth();
  const { isDarkMode } = useTheme(); 
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true }); // initialize AOS
  }, []);

  useEffect(() => {
    if (!user?.email) return;

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(`/notifications/${user.email}`);
        setNotifications(res.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user, axiosSecure]);

  const markAsRead = async (id) => {
    try {
      await axiosSecure.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axiosSecure.patch(`/notifications/${user.email}/read-all`);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axiosSecure.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await axiosSecure.delete(`/notifications/${user.email}/clear-all`);
      setNotifications([]);
    } catch (err) {
      console.error("Failed to clear all notifications:", err);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "unread") return !notification.read;
    if (filter === "read") return notification.read;
    return true;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'comment':
        return <FaComment className="text-blue-600" />;
      case 'like':
        return <FaThumbsUp className="text-green-600" />;
      case 'follow':
        return <FaUserPlus className="text-purple-600" />;
      case 'system':
        return <FaEnvelope className="text-gray-600" />;
      case 'alert':
        return <FaExclamationTriangle className="text-red-600" />;
      default:
        return <FaBell className="text-indigo-600" />;
    }
  };

  const getNotificationTypeColor = (type) => {
    switch (type) {
      case 'comment':
        return 'border-l-blue-500';
      case 'like':
        return 'border-l-green-500';
      case 'follow':
        return 'border-l-purple-500';
      case 'system':
        return 'border-l-gray-500';
      case 'alert':
        return 'border-l-red-500';
      default:
        return 'border-l-indigo-500';
    }
  };

  if (loading) {
    return (
      <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen pt-20`}>
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-4`}>Loading your notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen pt-20`}>
      <div className="max-w-8xl mx-10 px-4 md:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm p-6 mb-8 border`} data-aos="fade-down">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-600 p-3 rounded-lg">
                <FaBell className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Notifications</h1>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>Stay updated with your community activity</p>
              </div>
            </div>
            
            {/* Stats */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} flex items-center gap-6 rounded-lg p-4 border`}>
              <div className="text-center">
                <div className="text-lg font-bold text-indigo-600">
                  {notifications.filter(n => !n.read).length}
                </div>
                <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'} text-sm`}>Unread</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-lg font-bold">
                  {notifications.length}
                </div>
                <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'} text-sm`}>Total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <FaFilter className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`} />
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} flex gap-1 rounded-lg p-1 border`}>
              {[
                { key: "all", label: "All" },
                { key: "unread", label: "Unread" },
                { key: "read", label: "Read" }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === key
                      ? "bg-indigo-600 text-white"
                      : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={markAllAsRead}
              disabled={!notifications.some(n => !n.read)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              <FaCheckDouble className="w-4 h-4" />
              Mark All Read
            </button>
            <button
              onClick={clearAllNotifications}
              disabled={notifications.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              <FaTrash className="w-4 h-4" />
              Clear All
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm p-12 text-center border`} data-aos="fade-up">
              <div className="text-gray-300 mb-4">
                <FaBell className="text-5xl mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-500 mb-2">
                No notifications found
              </h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                {filter === "all" 
                  ? "You're all caught up! No notifications yet." 
                  : `No ${filter} notifications at the moment.`}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border-l-4 ${getNotificationTypeColor(notification.type)} hover:shadow-md transition-all duration-200`}
                data-aos="fade-up"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} p-3 rounded-lg`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className={`text-base ${
                            notification.read 
                              ? isDarkMode ? 'text-gray-400' : 'text-gray-600' 
                              : isDarkMode ? 'text-white font-medium' : 'text-gray-900 font-medium'
                          }`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-4 mt-3">
                            <span className="text-sm text-gray-500">
                              {new Date(notification.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                              {notification.type}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification._id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Mark as read"
                            >
                              <FaCheck className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete notification"
                          >
                            <FaTimes className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Unread indicator */}
                  {!notification.read && (
                    <div className="flex items-center gap-2 mt-4">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-xs text-red-600 font-medium">New</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Info */}
        {notifications.length > 0 && (
          <div className="mt-8 text-center">
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'} text-sm`}>
              Showing {filteredNotifications.length} of {notifications.length} notifications
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
