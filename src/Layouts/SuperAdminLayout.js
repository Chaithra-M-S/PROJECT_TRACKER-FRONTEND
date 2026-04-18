import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const SuperAdminLayout = () => {
  return (
    <div className="layout">
      <Sidebar role="SUPERADMIN" />

      <div className="content">
        {/* <h2>Super Admin Dashboard</h2> */}

        <Outlet />
      </div>
    </div>
  );
};

export default SuperAdminLayout;