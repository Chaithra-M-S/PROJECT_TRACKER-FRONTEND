import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
const EmployeeLayout = () => {
  return (
    <div className="layout">
      <Sidebar role="EMPLOYEE" />
      <div className="content">
        <h2>Employee Dashboard</h2>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};
export default EmployeeLayout;