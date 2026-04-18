import React, { useState, useEffect } from "react";

import "../../css/UserManagement.css";
import API from "../../APIs/api";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    designation: "",
    password: "",
  });

  // 🔐 Generate Password
  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#";
    let pass = "";
    for (let i = 0; i < 8; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  // 📦 Load Users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔄 Handle Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🚀 Submit (Create / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        password: form.password,
        role: form.role,
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
        password: generatePassword(),
      });

      setEditId(null);
      setShowForm(false);
      fetchUsers();

    } catch (err) {
      console.log(err.response?.data);
      alert("Error ❌");
    }
  };

  // ✏️ Edit
  const handleEdit = (user) => {
    setShowForm(true);
    setEditId(user._id);

    const names = user.name.split(" ");

    setForm({
      firstName: names[0] || "",
      lastName: names[1] || "",
      email: user.email,
      role: user.role,
      password: "",
    });
  };

  // 🗑 Delete
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

        {/* ================= TABLE VIEW ================= */}
        {!showForm && (
          <>
            <button
              className="create-btn"
              onClick={() => setShowForm(true)}
            >
              + Create User
            </button>

            <h3>Users List</h3>

            <table className="user-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
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

        {/* ================= FORM VIEW ================= */}
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
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <option value="">Select Role</option>
                <option>ADMIN</option>
                <option>PD</option>
                <option>MANAGER</option>
                <option>EMPLOYEE</option>
              </select>

              <select
                name="Project"
                value={form.project}
                onChange={handleChange}
              >
                <option value="">Select Project</option>
                <option>iPGRS</option>
                <option>SSP</option>
                <option>WEB PORTAL</option>

              </select>


            </div>

            <div className="form-row">
              <input
                name="password"
                value={form.password}
                onChange={handleChange}
              />

              <button
                type="button"
                onClick={() =>
                  setForm({ ...form, password: generatePassword() })
                }
              >
                Generate
              </button>
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