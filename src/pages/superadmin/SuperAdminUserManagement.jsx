import React, { useState, useEffect } from "react";
import API from "../../APIs/api";
import Select from "react-select";

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
    project: [],
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchUsers();
    fetchProjects();
  }, []);
  const projectOptions = projects.map((p) => ({
    value: p._id,
    label: p.name,
  }));

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
      project: user.project?.map((p) => p._id) || [],
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
    <div className="p-6">
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-semibold mb-4">User Management</h2>

        {!showForm && (
          <>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
            >
              + Create User
            </button>

            <h3 className="text-lg font-medium mb-3">Users List</h3>

            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Project</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-t">
                      <td className="p-3">{u.name}</td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3">{u.role}</td>
                      <td className="p-3">
                        {Array.isArray(u.project)
                          ? u.project.map((p) => p.name).join(", ")
                          : u.project?.name || "-"}
                      </td>
                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => handleEdit(u)}
                          className="bg-yellow-400 px-3 py-1 rounded text-sm"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(u._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm"
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

        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold">
              {editId ? "Edit User" : "Create User"}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <input
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option value="">Select Role</option>
                <option>ADMIN</option>
                <option>PD</option>
                <option>MANAGER</option>
                <option>TEAMLEAD</option>
                <option>EMPLOYEE</option>
              </select>

              {form.role !== "PD" && (
                <div>
                  <label className="block mb-1 font-medium">
                    Select Projects
                  </label>

                  <Select
                    isMulti
                    options={projectOptions}
                    value={projectOptions.filter((p) =>
                      (form.project || []).includes(p.value),
                    )}
                    onChange={(selected) => {
                      setForm({
                        ...form,
                        project: selected ? selected.map((s) => s.value) : [],
                      });
                    }}
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: "42px",
                        height: "42px",
                        borderRadius: "0.375rem",
                      }),
                      valueContainer: (base) => ({
                        ...base,
                        height: "42px",
                        padding: "0 8px",
                      }),
                      input: (base) => ({
                        ...base,
                        margin: "0px",
                      }),
                      indicatorsContainer: (base) => ({
                        ...base,
                        height: "42px",
                      }),
                    }}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>

            <div className="flex gap-3">
              <button className="bg-green-600 text-white px-4 py-2 rounded">
                {editId ? "Update" : "Save"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditId(null);
                }}
                className="bg-gray-300 px-4 py-2 rounded"
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
