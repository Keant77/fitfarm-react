import { useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { useNotification } from "../context/NotificationContext";

export function NotificationPanel({ isOpen, onToggle }) {
  const { notifications, markAsRead, clearNotification, clearAllNotifications, unreadCount } =
    useNotification();

  const panelRef = useRef(null);

  // Tutup panel saat klik di luar
  useEffect(() => {
    if (!isOpen) return;

    function handleOutsideClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onToggle();
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, onToggle]);

  return (
    <div className="notification-wrapper" ref={panelRef}>
      <button
        type="button"
        className="notification-button"
        aria-label="Notifikasi"
        onClick={onToggle}
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <strong>Notifikasi</strong>
            {notifications.length > 0 && (
              <button type="button" onClick={clearAllNotifications}>
                Hapus semua
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="notification-empty">Belum ada notifikasi</div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`notification-item ${item.read ? "read" : "unread"}`}
                  onClick={() => markAsRead(item.id)}
                >
                  <div className="notification-item-content">
                    <span>{item.message}</span>
                  </div>
                  <button
                    type="button"
                    className="notification-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearNotification(item.id);
                    }}
                    aria-label="Hapus notifikasi"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationPanel;
