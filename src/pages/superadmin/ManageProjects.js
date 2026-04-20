import React, { useState, useEffect } from "react";

import "../../css/ManageProject.css";
import API from "../../APIs/api";

const ManageProjects = () => {
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [projects, setProjects] = useState([]);
  const [editId, setEditId] = useState(null);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.log(err);
    }
  };



  const handleEdit = (project) => {
    setShowForm(true);
    setEditId(project._id);

    setFormData({
      name: project.name,
      description: project.description
    });
  };

  //DELETE FUNCTION
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;

    try {
      await API.delete(`/projects/${id}`);
      alert("Deleted ✅");
      fetchProjects();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProjects();
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
    console.log("FORM DATA:", formData);
    e.preventDefault();

    try {
      if (editId) {
        // ✅ UPDATE
        await API.put(`/projects/${editId}`, formData);
        alert("Project Updated ✅");
      } else {
        // ✅ CREATE
        await API.post("/projects/create", formData);
        alert("Project Created ✅");
      }

      // Reset
      setFormData({
        name: "",
        description: "",
      });

      setEditId(null);
      setShowForm(false);

      fetchProjects();

    } catch (err) {
      console.error(err);
      alert("Error ❌");
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



            <button className="submit-btn">
              {editId ? "Update Project" : "Create Project"}
            </button>
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
      <table className="project-table">
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {projects.length > 0 ? (
            projects.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>
                  {p.description ? (
                    p.description
                  ) : (
                    <span className="no-data">No description</span>
                  )}
                </td>

                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(p)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(p._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No projects found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageProjects;
