import { Link, useNavigate } from "react-router-dom";
import "../css/Sidebar.css";
import { LogOut } from "lucide-react";

const Sidebar = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="sidebar">

      {/* 🔥 TOP SECTION */}
      <div className="sidebar-top">
        <h3 className="logo">Tracker</h3>

        {role === "SUPERADMIN" && (

          <ul>
            <li>
              <Link to="/superadmin">Dashboard</Link>
            </li>

            <li>
              <Link to="/superadmin/users">Create Admin</Link>
            </li>



            <li>
              <Link to="/superadmin/manage-projects">Manage Projects</Link>
            </li>

            <li>
              <Link to="/superadmin/reports">Reports</Link>
            </li>

            <li>
              <Link to="/superadmin/change-password">Change Password</Link>
            </li>
          </ul>
        )}

        {role === "ADMIN" && (
          <ul>
            <li><Link to="/admin">Dashboard</Link></li>
            <li><Link to="/admin/users">Manage Users</Link></li>
            <li><Link to="/admin/reports">Reports</Link></li>
            <li><Link to="/admin/change-password">Change Password</Link></li>
          </ul>
        )}

        {role === "PD" && (
          <ul>
            <li><Link to="/pd">Dashboard</Link></li>
            <li><Link to="/pd/create-project">Create Project</Link></li>
            <li><Link to="/pd/assign-managers">Assign Managers</Link></li>
            <li><Link to="/pd/project-overview">Project Overview</Link></li>
            <li><Link to="/pd/change-password">Change Password</Link></li>
          </ul>
        )}

        {role === "MANAGER" && (
          <ul>
            <li><Link to="/manager">Dashboard</Link></li>
            <li><Link to="/manager/my-projects">My Projects</Link></li>
            <li><Link to="/manager/create-tasks">Create Tasks</Link></li>
            <li><Link to="/manager/task-status">Task Status</Link></li>
            <li><Link to="/manager/change-password">Change Password</Link></li>
          </ul>
        )}

        {role === "EMPLOYEE" && (
          <ul>
            <li>Dashboard</li>
            <li><Link to="/employee/my-tasks">My Tasks</Link></li>
            <li>Update Status</li>
            <li><Link to="/user/change-password">Change Password</Link></li>
          </ul>
        )}
      </div>

      {/* 🔥 BOTTOM SECTION */}
      <div className="logout-section">
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={16} /> Logout
        </button>
      </div>

    </div>
  );
};

export default Sidebar;






// import {
//   LayoutDashboard,
//   Users,
//   FolderKanban,
//   FileText,
//   Settings,
//   PlusCircle,
//   UserCheck,
//   ListTodo,
// } from "lucide-react";

// const Sidebar = ({ role }) => {
//   const location = useLocation();

//   // helper for active menu
//   const isActive = (path) => location.pathname === path;

//   const menuClass = (path) =>
//     `flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all
//      ${isActive(path) ? "bg-blue-500 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`;

//   return (
//     <div className="h-screen w-64 bg-gray-900 text-white p-4 flex flex-col">

//       {/* Logo */}
//       <h1 className="text-2xl font-bold mb-8">Tracker</h1>

//       {/* ADMIN MENU */}
//       {role === "ADMIN" && (
//         <ul className="space-y-3">
//           <li>
//             <Link to="/admin" className={menuClass("/admin")}>
//               <LayoutDashboard size={18} /> Dashboard
//             </Link>
//           </li>

//           <li>
//             <Link to="/admin/users" className={menuClass("/admin/users")}>
//               <Users size={18} /> Manage Users
//             </Link>
//           </li>

//           <li>
//             <Link to="/admin/projects" className={menuClass("/admin/projects")}>
//               <FolderKanban size={18} /> Projects
//             </Link>
//           </li>

//           <li>
//             <Link to="/admin/reports" className={menuClass("/admin/reports")}>
//               <FileText size={18} /> Reports
//             </Link>
//           </li>

//           <li>
//             <Link to="/admin/settings" className={menuClass("/admin/settings")}>
//               <Settings size={18} /> Settings
//             </Link>
//           </li>
//         </ul>
//       )}

//       {/* PD MENU */}
//       {role === "PD" && (
//         <ul className="space-y-3">
//           <li>
//             <Link to="/pd" className={menuClass("/pd")}>
//               <LayoutDashboard size={18} /> Dashboard
//             </Link>
//           </li>

//           <li>
//             <Link to="/pd/create-project" className={menuClass("/pd/create-project")}>
//               <PlusCircle size={18} /> Create Project
//             </Link>
//           </li>

//           <li>
//             <Link to="/pd/assign-manager" className={menuClass("/pd/assign-manager")}>
//               <UserCheck size={18} /> Assign Managers
//             </Link>
//           </li>

//           <li>
//             <Link to="/pd/overview" className={menuClass("/pd/overview")}>
//               <FolderKanban size={18} /> Project Overview
//             </Link>
//           </li>
//         </ul>
//       )}

//       {/* MANAGER MENU */}
//       {role === "MANAGER" && (
//         <ul className="space-y-3">
//           <li>
//             <Link to="/manager" className={menuClass("/manager")}>
//               <LayoutDashboard size={18} /> Dashboard
//             </Link>
//           </li>

//           <li>
//             <Link to="/manager/projects" className={menuClass("/manager/projects")}>
//               <FolderKanban size={18} /> My Projects
//             </Link>
//           </li>

//           <li>
//             <Link to="/manager/tasks" className={menuClass("/manager/tasks")}>
//               <ListTodo size={18} /> Tasks
//             </Link>
//           </li>
//         </ul>
//       )}

//       {/* EMPLOYEE MENU */}
//       {role === "EMPLOYEE" && (
//         <ul className="space-y-3">
//           <li>
//             <Link to="/employee" className={menuClass("/employee")}>
//               <LayoutDashboard size={18} /> Dashboard
//             </Link>
//           </li>

//           <li>
//             <Link to="/employee/tasks" className={menuClass("/employee/tasks")}>
//               <ListTodo size={18} /> My Tasks
//             </Link>
//           </li>
//         </ul>
//       )}

//     </div>
//   );
// };

// export default Sidebar;
