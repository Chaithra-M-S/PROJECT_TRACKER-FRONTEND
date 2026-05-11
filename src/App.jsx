import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

import Login from "./auth/Login";

// Layout
import MainLayout from "./layout/MainLayout";

// Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";

import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import ManageProjects from "./pages/superadmin/ManageProjects";
import SuperAdminUserManagement from "./pages/superadmin/SuperAdminUserManagement";

import PDDashboard from "./pages/pd/PDDashboard";
import CreateSubProject from "./pages/pd/CreateSubProject";
import PDProjectsView from "./pages/pd/PDProjectsView";

import MyProjects from "./pages/manager/MyProjects";
import CreateTeam from "./pages/manager/CreateTeam";

import MyTasks from "./pages/employee/MyTasks";

import TeamDashboard from "./pages/teamlead/TeamDashboard";
import AssignTask from "./pages/teamlead/AssignTask";
import TeamMembers from "./pages/teamlead/TeamMembers";

import ChangePassword from "./pages/common/ChangePassword";
import ManageDesignation from "./pages/admin/ManageDesignation";


function App() {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const role = user.role;

  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route path="/" element={<Login />} />

        {/* SUPER ADMIN */}
        <Route path="/superadmin" element={<MainLayout role="SUPERADMIN" />}>
          <Route index element={<SuperAdminDashboard />} />
          <Route path="users" element={<SuperAdminUserManagement />} />
          <Route path="manage-projects" element={<ManageProjects />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>

        {/* ADMIN */}
        <Route path="/admin" element={<MainLayout role="ADMIN" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="designation" element={<ManageDesignation />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>

        {/* PD */}
        <Route path="/pd" element={<MainLayout role="PD" />}>
          <Route index element={<PDDashboard />} />
          <Route path="create-project" element={<CreateSubProject />} />
          <Route path="project-overview" element={<PDProjectsView />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>

        {/* MANAGER */}
        <Route path="/manager" element={<MainLayout role="MANAGER" />}>
          <Route path="my-projects" element={<MyProjects />} />
          <Route path="create-team" element={<CreateTeam />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>

        {/* TEAMLEAD */}
        <Route path="/teamlead" element={<MainLayout role="TEAMLEAD" />}>
          <Route index element={<TeamDashboard />} />
          <Route path="assign-task" element={<AssignTask />} />
          <Route path="team-members" element={<TeamMembers />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>

        {/* EMPLOYEE */}
        <Route path="/employee" element={<MainLayout role="EMPLOYEE" />}>
          <Route path="my-tasks" element={<MyTasks />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>

        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
