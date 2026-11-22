import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { AdminHeader } from "./AdminHeader";

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

  const handleClose = () => setSidebarOpen(false);
  const handleToggle = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="admin-layout">
      {/* Overlay gelap — hanya muncul di mobile saat sidebar terbuka */}
      {sidebarOpen && isMobile() && (
        <div
          className="sidebar-overlay"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={handleClose} />

      <main className="admin-content">
        <AdminHeader onToggleSidebar={handleToggle} />

        <div className="admin-page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
