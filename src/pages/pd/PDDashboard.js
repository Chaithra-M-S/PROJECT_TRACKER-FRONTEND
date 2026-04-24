import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import "../../css/AdminDashboard.css";
import CreateSubProject from "./CreateSubProject";

const PDDashboard = () => {

  const [subProjects, setSubProjects] = useState([]);
  const [form, setForm] = useState({
    mainProject: "",
    subProject: "",
    manager: "",
    deadline: "",
    priority: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleAddSubProject = (e) => {
    e.preventDefault();

    const newSubProject = {
      ...form,
      progress: "0%",
      status: "Not Started"
    };

    setSubProjects([...subProjects, newSubProject]);

    setForm({
      mainProject: "",
      subProject: "",
      manager: "",
      deadline: "",
      priority: ""
    });
  };

  return (
    <div>
      {/* HEADER */}
      <div className="dashboard-header">
        <h2>Project Director Dashboard</h2>
        <span>Manage Projects & Monitor Progress</span>
      </div>

      {/* MAIN PROJECTS */}
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Web Portal</h3>

        </div>

        <div className="dashboard-card">
          <h3>SSP</h3>

        </div>

        <div className="dashboard-card">
          <h3>iPGRS</h3>

        </div>
      </div>
    </div>
  );
};

export default PDDashboard;