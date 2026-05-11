import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

    setLoginError("");

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        console.log(form);
        const res = await axios.post(
          "http://localhost:5000/api/auth/login",
          form,
        );

        // Store token separately
        sessionStorage.setItem("token", res.data.token);
        const teamLeadRes = await axios.get(
          "http://localhost:5000/api/team/check-teamlead",
          {
            headers: {
              Authorization: `Bearer ${res.data.token}`,
            },
          },
        );
        // Store user separately
        sessionStorage.setItem(
          "user",
          JSON.stringify({
            _id: res.data.user._id,
            name: res.data.user.name,
            email: res.data.user.email,
            role: res.data.user.role,
            project: res.data.user.project,
          }),
        );

        // Store team lead status
        sessionStorage.setItem("isTeamLead", teamLeadRes.data.isTeamLead);

        const role = res.data.user.role;

        if (role === "SUPERADMIN") navigate("/superadmin");
        else if (role === "ADMIN") navigate("/admin");
        else if (role === "PD") navigate("/pd");
        else if (role === "MANAGER") navigate("/manager");
        else if (role === "TEAMLEAD") navigate("/teamlead");
        else navigate("/employee");
      } catch (error) {
        setLoginError(error.response?.data?.message || "Login failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Project Tracker</h1>
          <p className="text-gray-500 text-sm">Task Management System</p>
        </div>

        <h2 className="text-xl font-semibold text-center mb-6">Sign in</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password}</span>
            )}
          </div>

          {loginError && (
            <div className="text-red-500 text-sm text-center">{loginError}</div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
