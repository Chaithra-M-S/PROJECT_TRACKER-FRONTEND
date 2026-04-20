import Sidebar from "../components/Sidebar";
import "../css/Layout.css";
import { Outlet } from "react-router-dom";
const PDLayout = () => {
  return (
    <div className="layout">
      <Sidebar role="PD" />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};
export default PDLayout;