import React, { useState, useEffect } from "react";
import API from "../../APIs/api";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [projects, setProjects] = useState([]);
  const [designations, setDesignations] = useState([]);
   const [projectId, setProjectId] = useState(null);

useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("Loaded user:", user);

  if (user?.project) {
    setProjectId(user.project);
  }
}, []);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    project: "",
    designation: "",
    password: "",
    confirmPassword: "",
  });

  const fetchProjects = async () => {
    const res = await API.get("/projects");
    setProjects(res.data);
  };

    const fetchDesignations = async () => {
    try {
       console.log("Calling API with:", projectId);
     
      const res = await API.get(`/designations/${projectId}`);
      setDesignations(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
  fetchUsers();
  fetchProjects();
}, []);

useEffect(() => {
  if (projectId) {
    fetchDesignations();
  }
}, [projectId]);



  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!editId && form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!form.email) newErrors.email = "Email is required";
    if (!form.firstName) newErrors.firstName = "First name is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload = {
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        role: form.role,
        designation: form.designation,
      };

      if (form.password && form.password.trim() !== "") {
  payload.password = form.password;
}

      if (editId) {
        await API.put(`/users/${editId}`, payload);
        alert("User updated ✅");
      } else {
        await API.post("/users", payload);
        alert("User created ✅");
      }

      setErrors({});
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "",
        project: "",
        designation: "",
        password: "",
        confirmPassword: "",
      });

      setEditId(null);
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      const message = err.response?.data?.message;

      if (message === "User already exists") {
        setErrors({ email: "User with this email already exists" });
      } else {
        setErrors({ general: "Something went wrong" });
      }
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
      role: user.role,
      designation: user.designation?._id || "",
      password: "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete user?")) return;

    await API.delete(`/users/${id}`);
    alert("Deleted ✅");
    fetchUsers();
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4">User Management</h2>

      {/* TABLE */}
      {!showForm && (
        <>
          <button
            onClick={() => setShowForm(true)}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Create User
          </button>

          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Designation</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-t">
                    <td className="p-3">{u.name}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">{u.designation?.name || "—"}</td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => handleEdit(u)}
                        className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* FORM */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-xl font-semibold">
            {editId ? "Edit User" : "Create User"}
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">{errors.firstName}</p>
              )}
            </div>

            <input
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <input
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Role</option>
            <option>MANAGER</option>
            <option>TEAMLEAD</option>
            <option>EMPLOYEE</option>
          </select>

          <select
            name="designation"
            value={form.designation}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Select Designation</option>
            {designations.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {editId ? "Update" : "Create"}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditId(null);
              }}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserManagement;
