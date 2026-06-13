import React, { useEffect, useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";

const NotificationBell = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchNotifications();
      // Poll every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${server}/notifications/${user._id}`);
      if (res.data.success) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      }
    } catch (err) {
      // Silent fail
    }
  };

  const markAllRead = async () => {
    try {
      await axios.put(`${server}/notifications/mark-all-read/${user._id}`);
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {}
  };

  const markRead = async (id) => {
    try {
      await axios.put(`${server}/notifications/mark-read/${id}`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {}
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (!isAuthenticated) return null;

  return (
    <div className="relative">
      {/* Bell Icon */}
      <div
        className="relative cursor-pointer p-1"
        onClick={() => setOpen(!open)}
      >
        <IoNotificationsOutline size={24} color="rgb(255 255 255 / 83%)" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 rounded-full bg-[#ff0000] w-[16px] h-[16px] text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </div>

      {/* Dropdown Panel */}
      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-[98]" onClick={() => setOpen(false)}></div>

          {/* Panel */}
          <div className="absolute right-0 top-[40px] w-[360px] bg-white rounded-lg shadow-2xl border border-[#e7e7e7] z-[99] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#e7e7e7] bg-[#f7f7f7]">
              <h3 className="text-[14px] font-[600] text-[#131921]">Notifications</h3>
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] text-[#0066c0] hover:text-[#c45500] hover:underline"
                  >
                    Mark all read
                  </button>
                )}
                <RxCross1
                  size={14}
                  className="cursor-pointer text-[#555]"
                  onClick={() => setOpen(false)}
                />
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-10 text-center">
                  <span className="text-[30px]">🔔</span>
                  <p className="text-[13px] text-[#555] mt-2">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <Link
                    key={notif._id}
                    to={notif.actionUrl || "/refurbished"}
                    onClick={() => { markRead(notif._id); setOpen(false); }}
                  >
                    <div
                      className={`px-4 py-3 border-b border-[#f0f0f0] hover:bg-[#f7f7f7] transition cursor-pointer ${
                        !notif.read ? "bg-[#fffbf0]" : ""
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div className="w-[36px] h-[36px] rounded-full bg-[#fff3e0] flex items-center justify-center flex-shrink-0">
                          <span className="text-[16px]">
                            {notif.type === "return_nearby" ? "📦" : "🔔"}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-[600] text-[#131921] leading-tight">
                            {notif.title}
                          </p>
                          <p className="text-[11px] text-[#555] mt-1 leading-relaxed line-clamp-2">
                            {notif.message}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            {notif.discount && (
                              <span className="text-[10px] bg-[#cc0c39] text-white px-1.5 py-0.5 rounded font-[600]">
                                {notif.discount}% OFF
                              </span>
                            )}
                            {notif.offerPrice && (
                              <span className="text-[11px] font-[600] text-[#131921]">
                                ₹{notif.offerPrice.toLocaleString()}
                              </span>
                            )}
                            <span className="text-[10px] text-[#999]">
                              {timeAgo(notif.createdAt)}
                            </span>
                          </div>
                        </div>

                        {/* Unread dot */}
                        {!notif.read && (
                          <div className="w-[8px] h-[8px] rounded-full bg-[#ff9900] flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
