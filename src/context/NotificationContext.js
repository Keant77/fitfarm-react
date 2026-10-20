
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback(
    (message, type = "info") => {
      const newNotification = {
        id: Date.now(),
        message,
        type,
        read: false,
      };

      setNotifications((prevNotifications) => [
        newNotification,
        ...prevNotifications,
      ]);
    },
    []
  );

  const markAsRead = useCallback((id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  const clearNotification = useCallback((id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter(
        (notification) => notification.id !== id
      )
    );
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = useMemo(
    () =>
      notifications.filter(
        (notification) => !notification.read
      ).length,
    [notifications]
  );

  const contextValue = useMemo(
    () => ({
      notifications,
      showNotification,
      markAsRead,
      clearNotification,
      clearAllNotifications,
      unreadCount,
    }),
    [
      notifications,
      showNotification,
      markAsRead,
      clearNotification,
      clearAllNotifications,
      unreadCount,
    ]
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotification harus digunakan di dalam NotificationProvider"
    );
  }

  return context;
};

export default NotificationContext;
