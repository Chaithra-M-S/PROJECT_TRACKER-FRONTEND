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
import ChangePassword from "./pages/common/ChangePassword";
import MyProjects from "./pages/manager/MyProjects";
import CreateSubProject from "./pages/pd/CreateSubProject";
import PDDashboard from "./pages/pd/PDDashboard";
import MyTasks from "./pages/employee/MyTasks";
import PDProjectsView from "./pages/pd/PDProjectsView";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/superadmin" element={<SuperAdminLayout />}>
          <Route index element={<SuperAdminDashboard />} />
          <Route path="users" element={<SuperAdminUserManagement />} />
          <Route path="manage-projects" element={<ManageProjects />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>

        {/* //Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>


        {/* //PD routes */}
        <Route path="/pd" element={<PDLayout />}>
          <Route index element={<PDDashboard />} />
          <Route path="create-project" element={<CreateSubProject />} />
          <Route path="project-overview" element={<PDProjectsView/>}/>

          <Route path="change-password" element={<ChangePassword />} />
        </Route>

        {/* //Manager routes */}
        <Route path="/manager" element={<ManagerLayout />}>
          <Route path="my-projects" element={<MyProjects />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>


        {/* {Employee routes} */}
        <Route path="/employee" element={<EmployeeLayout />}>
          <Route path="my-tasks" element={<MyTasks />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>


      </Routes>
    </BrowserRouter>
  );
}

export default App;
