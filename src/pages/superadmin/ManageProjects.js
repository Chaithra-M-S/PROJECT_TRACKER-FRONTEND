import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/ManageProject.css";

const ManageProjects = () => {
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    assignedAdmin: "",
  });

  const [admin, setadmins] = useState([]);

  // 🔹 Fetch Project Directors
  // Fetch admins
  const fetchAdmins = async () => {
    const res = await axios.get("http://localhost:5000/api/projects/available-admins");
    setadmins(res.data);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // 🔹 Handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/projects/create", formData);

      alert("Project Created Successfully");

      // Reset form
      setFormData({
        name: "",
        description: "",
        assignedAdmin: "",
      });

      setShowForm(false);
    } catch (err) {
      console.error("Error creating project", err);
      alert("Error creating project");
    }
  };

  return (
    <div className="manage-projects-container">
      {/* Header */}
      <div className="header">
        <h1>Manage Projects</h1>
        <button className="create-btn" onClick={() => setShowForm(!showForm)}>
          + Create Project
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="form-card">
          <h2>Create Project</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Project Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

           

            <button className="submit-btn">Create Project</button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Table Placeholder */}
      <div className="table-card">
        <p>Project list will appear here...</p>
      </div>
    </div>
  );
};

export default ManageProjects;
