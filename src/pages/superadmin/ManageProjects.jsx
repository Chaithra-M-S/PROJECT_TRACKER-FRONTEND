import React, { useState, useEffect } from "react";
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
      description: project.description,
    });
  };

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    console.log("FORM DATA:", formData);
    e.preventDefault();

    try {
      if (editId) {
        await API.put(`/projects/${editId}`, formData);
        alert("Project Updated ✅");
      } else {
        await API.post("/projects/create", formData);
        alert("Project Created ✅");
      }

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
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Manage Projects
        </h1>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Create Project
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editId ? "Edit Project" : "Create Project"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Project Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="flex gap-3">
              <button className="bg-green-600 text-white px-4 py-2 rounded">
                {editId ? "Update Project" : "Create Project"}
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Project Name</th>
              <th className="p-3">Description</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {projects.length > 0 ? (
              projects.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="p-3">{p.name}</td>

                  <td className="p-3">
                    {p.description ? (
                      p.description
                    ) : (
                      <span className="text-gray-400">
                        No description
                      </span>
                    )}
                  </td>

                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="bg-yellow-400 px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(p._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-500">
                  No projects found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default ManageProjects;