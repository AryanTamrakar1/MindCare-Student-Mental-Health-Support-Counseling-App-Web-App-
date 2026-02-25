import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, X, Trash2 } from "lucide-react";
import axios from "axios";

const NotificationDropdown = () => {
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(function () {
    fetchUnreadCount();
  }, []);

  async function fetchUnreadCount() {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.get(
        "http://127.0.0.1:5050/api/notifications/unread-count",
        { headers: { Authorization: "Bearer " + token } },
      );
      setUnreadCount(res.data.count);
    } catch (error) {
      console.log("Failed to fetch unread count");
    }
  }

  async function fetchNotifications() {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.get("http://127.0.0.1:5050/api/notifications", {
        headers: { Authorization: "Bearer " + token },
      });
      setNotifications(res.data.notifications);
    } catch (error) {
      console.log("Failed to fetch notifications");
    }
  }

  function toggleNotifications() {
    if (showNotifications) {
      setShowNotifications(false);
    } else {
      setShowNotifications(true);
      fetchNotifications();
    }
  }

  function closeNotifications() {
    setShowNotifications(false);
  }

  async function handleNotificationClick(notif) {
    try {
      const token = sessionStorage.getItem("token");
      await axios.put(
        "http://127.0.0.1:5050/api/notifications/" + notif._id + "/read",
        {},
        { headers: { Authorization: "Bearer " + token } },
      );

      if (!notif.isRead) {
        setUnreadCount(function (prev) {
          if (prev > 0) return prev - 1;
          return 0;
        });
      }

      const updated = [];
      for (let i = 0; i < notifications.length; i++) {
        if (notifications[i]._id === notif._id) {
          updated.push({ ...notifications[i], isRead: true });
        } else {
          updated.push(notifications[i]);
        }
      }
      setNotifications(updated);

      if (notif.link) {
        setShowNotifications(false);
        navigate(notif.link);
      }
    } catch (error) {
      console.log("Failed to mark as read");
    }
  }

  async function handleMarkAllRead() {
    try {
      const token = sessionStorage.getItem("token");
      await axios.put(
        "http://127.0.0.1:5050/api/notifications/mark-all-read",
        {},
        { headers: { Authorization: "Bearer " + token } },
      );
      setUnreadCount(0);

      const updated = [];
      for (let i = 0; i < notifications.length; i++) {
        updated.push({ ...notifications[i], isRead: true });
      }
      setNotifications(updated);
    } catch (error) {
      console.log("Failed to mark all as read");
    }
  }

  async function handleDeleteOne(e, notifId, isRead) {
    e.stopPropagation();
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete("http://127.0.0.1:5050/api/notifications/" + notifId, {
        headers: { Authorization: "Bearer " + token },
      });

      const updated = [];
      for (let i = 0; i < notifications.length; i++) {
        if (notifications[i]._id !== notifId) {
          updated.push(notifications[i]);
        }
      }
      setNotifications(updated);

      if (!isRead) {
        setUnreadCount(function (prev) {
          if (prev > 0) return prev - 1;
          return 0;
        });
      }
    } catch (error) {
      console.log("Failed to delete notification");
    }
  }

  async function handleDeleteAll() {
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete("http://127.0.0.1:5050/api/notifications/delete-all", {
        headers: { Authorization: "Bearer " + token },
      });
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.log("Failed to delete all notifications");
    }
  }

  function timeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return diffMins + "m ago";
    if (diffHours < 24) return diffHours + "h ago";
    return diffDays + "d ago";
  }

  return (
    <div className="relative">
      <button
        onClick={toggleNotifications}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="fixed inset-0 z-40" onClick={closeNotifications}></div>
      )}

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-[420px] bg-white rounded-xl shadow-xl border border-gray-200 z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-indigo-600 font-semibold hover:underline"
                >
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={handleDeleteAll}
                  className="text-xs text-red-500 font-semibold hover:underline"
                >
                  Clear all
                </button>
              )}
              <button onClick={closeNotifications}>
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-gray-400">
                No notifications yet
              </div>
            )}

            {notifications.map(function (notif) {
              let rowClass =
                "px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition";
              if (!notif.isRead) {
                rowClass =
                  "px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-indigo-50 transition bg-indigo-50";
              }

              return (
                <div
                  key={notif._id}
                  className={rowClass}
                  onClick={function () {
                    handleNotificationClick(notif);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1.5 flex-shrink-0">
                      {!notif.isRead ? (
                        <span className="w-2 h-2 bg-indigo-500 rounded-full block"></span>
                      ) : (
                        <span className="w-2 h-2 rounded-full block"></span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">
                        {notif.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {notif.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {timeAgo(notif.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={function (e) {
                        handleDeleteOne(e, notif._id, notif.isRead);
                      }}
                      className="ml-2 mt-1 text-gray-300 hover:text-red-400 transition flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
