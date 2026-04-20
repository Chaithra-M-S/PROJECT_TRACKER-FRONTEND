import React, { useState } from "react";
import API from "../../APIs/api";
import "../../css/ChangePassword.css";

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
    <div className="change-password-container">
      <h2>Change Password</h2>

      <form onSubmit={handleSubmit} className="change-password-form">

        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={form.newPassword}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit">Update Password</button>

      </form>
    </div>
  );
};

export default ChangePassword;