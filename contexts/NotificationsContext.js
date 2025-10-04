import { createContext, useContext, useState } from "react";
import { fetchNotifications } from "../services/notificationService";

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [badgeCount, setBadgeCount] = useState(0);

  const loadNotifications = async (userId) => {
    const res = await fetchNotifications(userId);
    if (res.success) {
      setNotifications(res.data);
      const unreadCount = res.data.filter((n) => !n.read).length;
      setBadgeCount(unreadCount);
    }
  };

  const clearBadge = () => setBadgeCount(0);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        badgeCount,
        loadNotifications,
        clearBadge,
        setNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);
