import React from "react";
import Sidebar from "../../components/Sidebar";
import "../../css/AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <div className="dashboard-layout">
      

      <div className="dashboard-content">

        <div className="dashboard-header">
          <h2>Admin Dashboard</h2>
        </div>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h3>5</h3>
            <p>Total Projects</p>
          </div>

          <div className="dashboard-card">
            <h3>12</h3>
            <p>Sub Projects</p>
          </div>

          <div className="dashboard-card">
            <h3>48</h3>
            <p>Total Tasks</p>
          </div>

          <div className="dashboard-card">
            <h3>76%</h3>
            <p>Completion Rate</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;