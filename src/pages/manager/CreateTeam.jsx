import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  UserCheck,
  Search,
  Plus,
} from "lucide-react";

const CreateTeam = () => {
  const [teamName, setTeamName] = useState("");
  const [teamLead, setTeamLead] = useState("");
  const [employees, setEmployees] = useState([]);
  const [employeeSearch, setEmployeeSearch] = useState("");

  const [employeeList, setEmployeeList] = useState([]);

  const [loading, setLoading] = useState(false);

  const token = sessionStorage.getItem("token");

  // Logged in user
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fetch employees of manager project
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/users/project/${user.project}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEmployeeList(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Select Employees
  const handleEmployeeChange = (id) => {
    if (employees.includes(id)) {
      setEmployees(employees.filter((emp) => emp !== id));
    } else {
      setEmployees([...employees, id]);
    }
  };

  // Create Team
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
console.log("TOKEN:", token);
      const res = await axios.post(
        
        "http://localhost:5000/api/team/create",
        {
          teamName,
          teamLead,
          employees,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);

      setTeamName("");
      setTeamLead("");
      setEmployees([]);
    } catch (error) {
      console.log(error);
      alert("Failed to create team");
    } finally {
      setLoading(false);
    }
  };

  // Filter employees
  const filteredEmployees = employeeList.filter((emp) =>
    emp.name.toLowerCase().includes(employeeSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">

        {/* Header */}
        <div className="border-b border-gray-200 p-8 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">
            <Users className="text-blue-600" size={32} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Create Team
            </h1>

            <p className="text-gray-500 mt-1">
              Select a Team Lead and add employees to the team.
            </p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-8 space-y-8"
        >

          {/* Team Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Team Name
            </label>

            <div className="relative">
              <Users
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />

              <input
                type="text"
                placeholder="Enter Team Name"
                value={teamName}
                onChange={(e) =>
                  setTeamName(e.target.value)
                }
                required
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Team Lead */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Team Lead
            </label>

            <div className="relative">
              <UserCheck
                className="absolute left-4 top-5 text-gray-400"
                size={20}
              />

              <select
                value={teamLead}
                onChange={(e) =>
                  setTeamLead(e.target.value)
                }
                required
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">
                  Choose Team Lead
                </option>

                {/* ALL EMPLOYEES OF PROJECT */}
                {employeeList.map((emp) => (
                  <option
                    key={emp._id}
                    value={emp._id}
                  >
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>

            <p className="text-sm text-gray-500 mt-2">
              Team Lead is selected from project employees.
            </p>
          </div>

          {/* Employees */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Team Members
            </label>

            {/* Search */}
            <div className="relative mb-5">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />

              <input
                type="text"
                placeholder="Search employees..."
                value={employeeSearch}
                onChange={(e) =>
                  setEmployeeSearch(e.target.value)
                }
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Employee Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto border border-gray-200 rounded-2xl p-5 bg-gray-50">

              {filteredEmployees.map((emp) => (

                // Don't show selected team lead in members
                emp._id !== teamLead && (

                  <div
                    key={emp._id}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                      employees.includes(emp._id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-blue-300"
                    }`}
                    onClick={() =>
                      handleEmployeeChange(emp._id)
                    }
                  >
                    <input
                      type="checkbox"
                      checked={employees.includes(emp._id)}
                      onChange={() =>
                        handleEmployeeChange(emp._id)
                      }
                      className="w-5 h-5 accent-blue-600"
                    />

                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                      {emp.name?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {emp.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {emp.email}
                      </p>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">

            <button
              type="button"
              className="px-6 py-3 rounded-2xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-lg"
            >
              <Plus size={18} />

              {loading
                ? "Creating..."
                : "Create Team"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeam;