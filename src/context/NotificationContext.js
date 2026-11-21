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
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "info", duration = 3000) => {
      const id = Date.now() + Math.random();
      const newToast = { id, message, type };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const showNotification = useCallback(
    (message, type = "info") => {
      const newNotification = {
        id: Date.now(),
        message,
        type,
        read: false,
      };

      setNotifications((prev) => [newNotification, ...prev]);
      showToast(message, type);
    },
    [showToast]
  );

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const clearNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const contextValue = useMemo(
    () => ({
      notifications,
      toasts,
      showNotification,
      showToast,
      removeToast,
      markAsRead,
      clearNotification,
      clearAllNotifications,
      unreadCount,
    }),
    [
      notifications,
      toasts,
      showNotification,
      showToast,
      removeToast,
      markAsRead,
      clearNotification,
      clearAllNotifications,
      unreadCount,
    ]
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      {/* GLOBAL TOAST STACK */}
      {toasts.length > 0 && (
        <div className="toast-container" role="status" aria-live="polite">
          {toasts.map((toast) => (
            <div key={toast.id} className={`toast toast-${toast.type}`}>
              <span className="toast-message">{toast.message}</span>
              <button
                type="button"
                className="toast-close"
                onClick={() => removeToast(toast.id)}
                aria-label="Tutup notifikasi"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
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
