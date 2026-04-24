import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoginError(""); // clear old errors

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/auth/login",
          form,
        );

        // Save user
        localStorage.setItem(
          "user",
          JSON.stringify({
            token: res.data.token,
            _id: res.data.user._id,
            name: res.data.user.name,
            email: res.data.user.email,
            role: res.data.user.role,
            project: res.data.user.project,
          }),
        );

        // Navigation
        const role = res.data.user.role;

        if (role === "SUPERADMIN") navigate("/superadmin");
        else if (role === "ADMIN") navigate("/admin");
        else if (role === "PD") navigate("/pd");
        else if (role === "MANAGER") navigate("/manager");
        else navigate("/employee");
      } catch (error) {
        setLoginError(error.response?.data?.message || "Login failed");
      }
    }
  };
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Project Tracker</h1>
          <p>Task Management System</p>
        </div>

        <h2 className="login-title">Sign in</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" onChange={handleChange} />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" onChange={handleChange} />
            {errors.password && (
              <span className="error">{errors.password}</span>
            )}
          </div>

          {loginError && <div className="error">{loginError}</div>}

          <button className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
