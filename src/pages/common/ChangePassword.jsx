import React, { useState } from "react";
import API from "../../APIs/api";

const ChangePassword = () => {
  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    try {
      await API.put("/users/change-password", {
        password: form.newPassword
      });

      alert("Password updated successfully ✅");

      setForm({
        newPassword: "",
        confirmPassword: ""
      });

    } catch (err) {
      console.log(err);
      alert("Error updating password ❌");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] p-4">

      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">

        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Change Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={form.newPassword}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
          >
            Update Password
          </button>

        </form>

      </div>
    </div>
  );
};

export default ChangePassword;