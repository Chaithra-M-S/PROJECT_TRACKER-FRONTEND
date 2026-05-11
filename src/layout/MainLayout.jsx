import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const MainLayout = ({ role }) => {
  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar role={role} />

      {/* Main Section */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Navbar */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
          <h1 className="text-lg font-semibold text-gray-700 capitalize">
            {role?.toLowerCase()} dashboard
          </h1>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{role}</span>

            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
              {role?.charAt(0)}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-100">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default MainLayout;