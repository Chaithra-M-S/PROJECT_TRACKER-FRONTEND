import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
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
    <div className="p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Project Director Dashboard
        </h2>
        <span className="text-gray-500 text-sm">
          Manage Projects & Monitor Progress
        </span>
      </div>

      {/* MAIN PROJECTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-gray-700">
            Web Portal
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-gray-700">
            SSP
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-gray-700">
            iPGRS
          </h3>
        </div>

      </div>
    </div>
  );
};

export default PDDashboard;