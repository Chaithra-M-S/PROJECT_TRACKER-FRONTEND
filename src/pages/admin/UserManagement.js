import React, { useState, useEffect } from "react";

import "../../css/UserManagement.css";
import API from "../../APIs/api";


const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    designation: "",
    password: "",
    confirmPassword: ""
  });



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

    let newErrors = {};

    // ✅ Frontend validation
    if (!editId && form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!form.email) {
      newErrors.email = "Email is required";
    }

    if (!form.firstName) {
      newErrors.firstName = "First name is required";
    }

    // Stop if errors exist
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload = {
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        password: form.password,
        role: form.role,
        designation: form.designation
      };

      if (editId) {
        await API.put(`/users/${editId}`, payload);
        alert("User updated ✅");
      } else {
        await API.post("/users", payload);
        alert("User created ✅");
      }

      setErrors({}); // ✅ clear errors

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "",
        designation: "",
        password: "",
        confirmPassword: ""
      });

      setEditId(null);
      setShowForm(false);
      fetchUsers();

    } catch (err) {
      const message = err.response?.data?.message;

      // ✅ Backend error handling
      if (message === "User already exists") {
        setErrors({ email: "User with this email already exists" });
      } else {
        setErrors({ general: "Something went wrong" });
      }
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
              />{errors.firstName && <p className="error-text">{errors.firstName}</p>}

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
              />{errors.email && <p className="error-text">{errors.email}</p>}

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

                <option>MANAGER</option>
                <option>EMPLOYEE</option>
              </select>
            </div>
            <div className="form-row">
              <input
                name="designation"
                placeholder="Designation"
                value={form.designation}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            </div>{errors.confirmPassword && (
              <p className="error-text">{errors.confirmPassword}</p>
            )}

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {editId ? "Update" : "Create"}
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