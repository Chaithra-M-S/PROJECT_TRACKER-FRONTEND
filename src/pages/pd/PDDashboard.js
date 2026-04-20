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
          <p>Main Project</p>
        </div>

        <div className="dashboard-card">
          <h3>SSP</h3>
          <p>Main Project</p>
        </div>

        <div className="dashboard-card">
          <h3>iPGRS</h3>
          <p>Main Project</p>
        </div>
      </div>



      <CreateSubProject />

      {/* SUB PROJECT LIST */}
      <div className="dashboard-table">
        <h3>Sub Projects</h3>

        <table>
          <thead>
            <tr>
              <th>Main Project</th>
              <th>Sub Project</th>
              <th>Manager</th>
              <th>Deadline</th>
              <th>Priority</th>
              <th>Progress</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {subProjects.map((sp, index) => (
              <tr key={index}>
                <td>{sp.mainProject}</td>
                <td>{sp.subProject}</td>
                <td>{sp.manager}</td>
                <td>{sp.deadline}</td>
                <td>{sp.priority}</td>
                <td>{sp.progress}</td>
                <td className="status pending">{sp.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* REPORTS */}
      <div className="dashboard-table">
        <h3>Reports & Analytics</h3>

        <p>Total Sub Projects: {subProjects.length}</p>
        <p>Completion Rate: 0% (dynamic later)</p>
      </div>

    </div>
  );
};

export default PDDashboard;