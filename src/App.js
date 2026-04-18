import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./auth/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";

import AdminLayout from "./Layouts/AdminLayout";
import ManagerLayout from "./Layouts/ManagerLayout";
import PDLayout from "./Layouts/PDLayout";
import EmployeeLayout from "./Layouts/EmployeeLayout";
import UserManagement from "./pages/admin/UserManagement";
import SuperAdminLayout from "./Layouts/SuperAdminLayout";
import ManageProjects from "./pages/superadmin/ManageProjects";
import SuperAdminUserManagement from "./pages/superadmin/SuperAdminUserManagement";
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/superadmin" element={<SuperAdminLayout />}>
          <Route index element={<SuperAdminDashboard />} />
          <Route path="users" element={<SuperAdminUserManagement />} />
          <Route path="manage-projects" element={<ManageProjects />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
        </Route>
        <Route path="/pd" element={<PDLayout />} />
        <Route path="/manager" element={<ManagerLayout />} />
        <Route path="/employee" element={<EmployeeLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
