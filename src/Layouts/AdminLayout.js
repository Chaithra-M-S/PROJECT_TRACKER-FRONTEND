import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <Sidebar role="ADMIN" />
      </div>

      {/* Main Section */}
      <div className="admin-main">
        {/* Top Navbar */}
        <div className="admin-navbar">
          {/* <h1>Admin Dashboard</h1> */}

          <div className="admin-profile">
            {/* <span>Admin</span> */}
            <div className="admin-avatar"></div>
          </div>
        </div>

        {/* Dynamic Page Content */}
        <div className="admin-page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;