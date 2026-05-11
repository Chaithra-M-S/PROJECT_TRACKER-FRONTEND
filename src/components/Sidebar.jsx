import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

const Sidebar = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    navigate("/");
  };

  const isTeamLead = sessionStorage.getItem("isTeamLead");

  const user = JSON.parse(sessionStorage.getItem("user"));

  const linkClass =
    "block px-4 py-2 rounded-lg text-gray-200 hover:bg-gray-700 hover:text-white transition";

  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white shadow-lg flex flex-col justify-between">
      {/* TOP */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-blue-600 mb-6">Tracker</h3>

        {role === "SUPERADMIN" && (
          <ul className="space-y-2">
            <li>
              <Link className={linkClass} to="/superadmin">
                Dashboard
              </Link>
            </li>
            <li>
              <Link className={linkClass} to="/superadmin/users">
                Manage Admin
              </Link>
            </li>
            <li>
              <Link className={linkClass} to="/superadmin/manage-projects">
                Manage Projects
              </Link>
            </li>
            <li>
              <Link className={linkClass} to="/superadmin/reports">
                Reports
              </Link>
            </li>
            <li>
              <Link className={linkClass} to="/superadmin/change-password">
                Change Password
              </Link>
            </li>
          </ul>
        )}

        {role === "ADMIN" && (
          <ul className="space-y-2">
            <li>
              <Link className={linkClass} to="/admin">
                Dashboard
              </Link>
            </li>
            <li>
              <Link className={linkClass} to="/admin/users">
                Manage Users
              </Link>
            </li>
            <li>
              <Link className={linkClass} to="/admin/designation">
                {" "}
                Manage Designations
              </Link>
            </li>
            <li>
              <Link className={linkClass} to="/admin/reports">
                Reports
              </Link>
            </li>
            <li>
              <Link className={linkClass} to="/admin/change-password">
                Change Password
              </Link>
            </li>
          </ul>
        )}

        {role === "PD" && (
          <ul className="space-y-2">
            <li>
              <Link className={linkClass} to="/pd">
                Dashboard
              </Link>
            </li>
            <li>
              <Link className={linkClass} to="/pd/create-project">
                Create Project
              </Link>
            </li>
            <li>
              <Link className={linkClass} to="/pd/assign-managers">
                Assign Managers
              </Link>
            </li>
            <li>
              <Link className={linkClass} to="/pd/project-overview">
                Project Overview
              </Link>
            </li>
            <li>
              <Link className={linkClass} to="/pd/change-password">
                Change Password
              </Link>
            </li>
          </ul>
        )}

        {role === "MANAGER" && (
          <ul className="space-y-2">
            <li>
              <Link className={linkClass} to="/manager">
                Dashboard
              </Link>
            </li>
            <li>
              <Link className={linkClass} to="/manager/my-projects">
                My Projects
              </Link>
            </li>
            <li>
              <Link className={linkClass} to="/manager/create-team">
                Create Teams
              </Link>
            </li>
            <li>
              <Link className={linkClass} to="/manager/task-status">
                Task Status
              </Link>
            </li>
            <li>
              <Link className={linkClass} to="/manager/change-password">
                Change Password
              </Link>
            </li>
          </ul>
        )}

        {role === "TEAMLEAD" && (
          <ul className="space-y-2">
            <li>
              <Link className={linkClass} to="/teamlead">
                Dashboard
              </Link>
            </li>

            <li>
              <Link className={linkClass} to="/teamlead/assign-task">
                Assign Subtasks
              </Link>
            </li>

            <li>
              <Link className={linkClass} to="/teamlead/team-members">
                Team Members
              </Link>
            </li>

           

            <li>
              <Link className={linkClass} to="/teamlead/change-password">
                Change Password
              </Link>
            </li>
          </ul>
        )}

        {role === "EMPLOYEE" && (
          <ul className="space-y-2">
            <li className="px-4 py-2 text-gray-500">Dashboard</li>
            <li>
              <Link className={linkClass} to="/employee/my-tasks">
                My Tasks
              </Link>
            </li>
            {/* <li className="px-4 py-2 text-gray-500">Update Status</li> */}
            <li>
              <Link className={linkClass} to="/user/change-password">
                Change Password
              </Link>
            </li>
          </ul>
        )}
      </div>

      {/* BOTTOM */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-4 py-2 text-red-400 hover:bg-red-500/20 rounded-lg transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
