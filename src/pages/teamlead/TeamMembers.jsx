import React, { useEffect, useState } from "react";
import Select from "react-select";
import API from "../../APIs/api";

const TeamMembers = () => {
  const [team, setTeam] = useState(null);
  const [teamName, setTeamName] = useState("");
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    fetchMyTeam();
    fetchProjectEmployees();
  }, []);

  const fetchMyTeam = async () => {
    try {
      const res = await API.get("/team/my-team");

      setTeam(res.data.team);

      if (res.data.team) {
        setTeamName(res.data.team.teamName || "");
      }

      if (res.data.team?.employees) {
        setSelectedEmployees(
          res.data.team.employees.map((emp) => ({
            value: emp._id,
            label: `${emp.name} (${emp.designation?.title || "Employee"})`,
          })),
        );
      }
    } catch (err) {

  // No team yet → normal case for new TeamLead
  if (err.response?.status === 404) {
    setTeam(null);
    return;
  }

  console.log(err);
    }
  };

  const fetchProjectEmployees = async () => {
    try {
      const res = await API.get(`/users/project/${user.project}`);

      const filtered = res.data.filter((u) => u.role === "EMPLOYEE");

      setEmployees(filtered);
    } catch (err) {
      console.log(err);
    }
  };

  const saveMembers = async () => {
    try {
      const payload = {
        teamName,
        employees: selectedEmployees.map((e) => e.value),
        project: user.project,
      };

      if (team) {
        // UPDATE EXISTING TEAM
        await API.put(`/team/${team._id}/members`, payload);
      } else {
        // CREATE NEW TEAM
        await API.post("/team/create", payload);
      }

      alert("Team saved");

      fetchMyTeam();
      alert("Team updated");

      fetchMyTeam();
    } catch (err) {
      console.log(err);
      alert("Failed");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="mb-4">
        <label className="block mb-2 font-medium">Team Name</label>

        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Enter Team Name"
          className="w-full border p-2 rounded-lg"
        />
      </div>
      <h2 className="text-2xl font-semibold mb-5">Manage Team Members</h2>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Select Employees</label>

        <Select
          isMulti
          options={employees.map((emp) => ({
            value: emp._id,
            label: `${emp.name} (${emp.designation?.title || "Employee"})`,
          }))}
          value={selectedEmployees}
          onChange={(selected) => setSelectedEmployees(selected || [])}
        />
      </div>

      <button
        onClick={saveMembers}
        className="bg-blue-600 text-white px-5 py-2 rounded-lg"
      >
        Save Team
      </button>

      {/* Current Members */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-3">Current Team Members</h3>

        <div className="space-y-2">
          {team?.employees?.map((emp) => (
            <div
              key={emp._id}
              className="border rounded-lg p-3 flex justify-between"
            >
              <div>
                <p className="font-medium">{emp.name}</p>
                <p className="text-sm text-gray-500">{emp.email}</p>
              </div>

              <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                {emp.designation?.title || "Employee"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamMembers;
