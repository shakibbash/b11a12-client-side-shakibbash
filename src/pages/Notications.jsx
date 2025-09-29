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
  FaTimes
} from "react-icons/fa";

function Notifications() {
  const { user } = useAuth(); 
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all"); // "all", "unread", "read"
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

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

  // Mark as read
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

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await axiosSecure.patch(`/notifications/${user.email}/read-all`);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  // Delete notification
  const deleteNotification = async (id) => {
    try {
      await axiosSecure.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    try {
      await axiosSecure.delete(`/notifications/${user.email}/clear-all`);
      setNotifications([]);
    } catch (err) {
      console.error("Failed to clear all notifications:", err);
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (filter === "unread") return !notification.read;
    if (filter === "read") return notification.read;
    return true;
  });

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'comment':
        return <FaComment className="text-blue-500" />;
      case 'like':
        return <FaThumbsUp className="text-green-500" />;
      case 'follow':
        return <FaUserPlus className="text-purple-500" />;
      case 'system':
        return <FaEnvelope className="text-gray-500" />;
      case 'alert':
        return <FaExclamationTriangle className="text-red-500" />;
      default:
        return <FaBell className="text-indigo-500" />;
    }
  };

  // Get notification type color
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20">
        <div className="max-w-4xl mx-auto p-4">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-gray-600 mt-4">Loading notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
                <FaBell className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                  Notifications
                </h1>
                <p className="text-gray-600 mt-1">
                  Stay updated with your latest activities
                </p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-3 border border-gray-200">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {notifications.filter(n => !n.read).length}
                </div>
                <div className="text-xs text-gray-500">Unread</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-600">
                  {notifications.length}
                </div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          {/* Filter Buttons */}
          <div className="flex gap-2 bg-white rounded-xl p-2 shadow-sm border border-gray-200">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "all" 
                  ? "bg-blue-500 text-white shadow-sm" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "unread" 
                  ? "bg-red-500 text-white shadow-sm" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setFilter("read")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "read" 
                  ? "bg-green-500 text-white shadow-sm" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Read
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={markAllAsRead}
              disabled={!notifications.some(n => !n.read)}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              <FaCheckDouble />
              Mark All Read
            </button>
            <button
              onClick={clearAllNotifications}
              disabled={notifications.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              <FaTrash />
              Clear All
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
              <div className="text-gray-400 mb-4">
                <FaBell className="text-6xl mx-auto mb-4 opacity-30" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No notifications found
              </h3>
              <p className="text-gray-500">
                {filter === "all" 
                  ? "You're all caught up! No notifications yet." 
                  : `No ${filter} notifications at the moment.`
                }
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`bg-white rounded-2xl shadow-lg border-l-4 ${getNotificationTypeColor(notification.type)} border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      <div className="bg-gray-100 p-3 rounded-xl">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className={`text-lg font-medium ${
                            notification.read ? 'text-gray-700' : 'text-gray-900'
                          }`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              <FaBell className="text-xs" />
                              {notification.type?.charAt(0).toUpperCase() + notification.type?.slice(1)}
                            </span>
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              <FaEnvelope className="text-xs" />
                              {new Date(notification.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification._id)}
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                              title="Mark as read"
                            >
                              <FaCheck className="text-sm" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification._id)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            title="Delete notification"
                          >
                            <FaTimes className="text-sm" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Unread indicator */}
                  {!notification.read && (
                    <div className="flex items-center gap-2 mt-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-red-500 font-medium">New</span>
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
            <p className="text-gray-500 text-sm">
              Showing {filteredNotifications.length} of {notifications.length} notifications
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;