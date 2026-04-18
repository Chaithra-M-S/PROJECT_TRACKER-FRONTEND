import React from "react";
import "../../css/AdminDashboard.css";

const SuperAdminDashboard = () => {
  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h2>Super Admin Dashboard</h2>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>8</h3>
          <p>Total Admins</p>
        </div>

        <div className="dashboard-card">
          <h3>15</h3>
          <p>Total Projects</p>
        </div>

        <div className="dashboard-card">
          <h3>124</h3>
          <p>Total Employees</p>
        </div>

        <div className="dashboard-card">
          <h3>76%</h3>
          <p>Completion Rate</p>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;