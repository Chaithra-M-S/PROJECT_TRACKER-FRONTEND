import React, { useState, useEffect } from "react";

import "../../css/UserManagement.css";
import API from "../../APIs/api";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [projects, setProjects] = useState([]);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    designation: "",
    project: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchUsers();
    fetchProjects();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    try {
      const payload = {
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        password: form.password,
        role: form.role,
        project: form.project,
      };

      if (editId) {
        await API.put(`/users/${editId}`, payload);
        alert("User updated ✅");
      } else {
        await API.post("/users", payload);
        alert("User created ✅");
      }

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "",
        designation: "",
        project: "",
        password: "",
        confirmPassword: "",
      });

      setEditId(null);
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      console.log(err.response?.data);
      alert("Error ❌");
    }
  };

  const handleEdit = (user) => {
    setShowForm(true);
    setEditId(user._id);

    const names = user.name.split(" ");

    setForm({
      firstName: names[0] || "",
      lastName: names[1] || "",
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      designation: user.designation || "",
      project: user.project || "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete user?")) return;

    await API.delete(`/users/${id}`);
    alert("Deleted ✅");
    fetchUsers();
  };

  return (
    <div className="onboard-layout">
      <div className="onboard-content">
        <h2>User Management</h2>

        {!showForm && (
          <>
            <button className="create-btn" onClick={() => setShowForm(true)}>
              + Create User
            </button>

            <h3>Users List</h3>

            <table className="user-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Project</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>{u.project}</td>
                    <td>
                      <button onClick={() => handleEdit(u)}>Edit</button>
                      <button onClick={() => handleDelete(u._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {showForm && (
          <form className="onboard-form" onSubmit={handleSubmit}>
            <h3>{editId ? "Edit User" : "Create User"}</h3>

            <div className="form-row">
              <input
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
              />

              <input
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
              />

              <input
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="">Select Role</option>
                <option>ADMIN</option>
                <option>PD</option>
                <option>MANAGER</option>
                <option>EMPLOYEE</option>
              </select>

              {form.role !== "PD" && (
                <select
                  name="project"
                  value={form.project}
                  onChange={handleChange}
                >
                  <option value="">Select Project</option>

                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="form-row">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
              />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {editId ? "Update" : "Save"}
              </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setShowForm(false);
                  setEditId(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
