import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaBell, FaCheckCircle, FaTimesCircle, FaComment, FaFileAlt } from "react-icons/fa";

const Notifications = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const notificationRef = useRef(null);

  // Fetch notifications on component mount and every 30 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Add click outside listener to close notification panel
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationRef]);

  // Function to fetch notifications
  const fetchNotifications = async () => {
    if (!token) return;
    
    try {
      const response = await axios.post("http://localhost:8000/api/notifications/", {
        token: token
      });
      
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unread_count);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Failed to load notifications");
    }
  };

  // Function to mark a notification as read
  const markAsRead = async (notificationId) => {
    try {
      await axios.post(`http://localhost:8000/api/mark-notification-read/${notificationId}/`, {
        token: token
      });
      
      // Update local state
      setNotifications(notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      ));
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Function to mark all notifications as read
  const markAllAsRead = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:8000/api/mark-all-notifications-read/", {
        token: token
      });
      
      // Update local state
      setNotifications(notifications.map(notification => ({ ...notification, read: true })));
      setUnreadCount(0);
      setLoading(false);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      setLoading(false);
    }
  };

  // Function to handle notification click
  const handleNotificationClick = (notification) => {
    // Mark as read
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // Navigate based on notification type
    if (notification.notification_type === 'comment' && notification.entry) {
      navigate(`/entry-comments/${notification.entry}`, { 
        state: { entryId: notification.entry } 
      });
    } else if (notification.notification_type === 'entry') {
      navigate('/my-entries/');
    }
    
    // Close notification panel
    setShowNotifications(false);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'comment':
        return <FaComment className="text-blue-500" />;
      case 'entry':
        return <FaFileAlt className="text-green-500" />;
      default:
        return <FaBell className="text-yellow-500" />;
    }
  };

  return (
    <div className="relative" ref={notificationRef}>
      {/* Notification Bell */}
      <button
        className="relative p-2 text-gray-700 hover:text-blue-600 focus:outline-none"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <FaBell className="text-xl" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>
      
      {/* Notification Panel */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
            {unreadCount > 0 && (
              <button
                className="text-sm text-blue-600 hover:text-blue-800"
                onClick={markAllAsRead}
                disabled={loading}
              >
                Mark all as read
              </button>
            )}
          </div>
          
          {error && (
            <div className="p-4 text-center text-red-600">
              <FaTimesCircle className="mx-auto mb-2 text-2xl" />
              <p>{error}</p>
            </div>
          )}
          
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-600">
              <FaCheckCircle className="mx-auto mb-2 text-2xl text-green-500" />
              <p>No notifications</p>
            </div>
          ) : (
            <div>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3 mt-1">
                      {getNotificationIcon(notification.notification_type)}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${!notification.read ? 'text-blue-800' : 'text-gray-800'}`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(notification.created_at)}</p>
                    </div>
                    {!notification.read && (
                      <div className="ml-2 w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
