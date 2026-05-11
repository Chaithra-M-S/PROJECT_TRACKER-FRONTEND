import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  ClipboardList,
  CheckCircle,
  Clock,
  User,
  Briefcase,
} from "lucide-react";

const TeamDashboard = () => {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = sessionStorage.getItem("token");

  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/team/my-team", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTeam(res.data.team);
    } catch (error) {
      // Team not created yet
      if (error.response?.status === 404) {
        setTeam(null);
        return;
      }

      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl font-semibold text-gray-700">
          Loading Team Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-blue-100 flex items-center justify-center">
              <Users className="text-blue-600" size={40} />
            </div>

            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                Team Dashboard
              </h1>

              <p className="text-gray-500 mt-2 text-lg">
                Welcome back, {user?.name}
              </p>
            </div>
          </div>

          <div className="bg-blue-50 px-6 py-4 rounded-2xl border border-blue-100">
            <p className="text-sm text-gray-500">Team Name</p>

            <h2 className="text-2xl font-bold text-blue-700 mt-1">
              {team?.teamName || "No Team Assigned"}
            </h2>
          </div>
        </div>

        {!team && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-5 rounded-2xl">
            No team created yet. Please go to Team Members and create your team.
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Members */}
          <div className="bg-white rounded-3xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Team Members</p>

                <h2 className="text-4xl font-bold text-gray-800 mt-2">
                  {team?.employees?.length || 0}
                </h2>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                <Users className="text-blue-600" size={28} />
              </div>
            </div>
          </div>

          {/* Total Tasks */}
          <div className="bg-white rounded-3xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Tasks</p>

                <h2 className="text-4xl font-bold text-gray-800 mt-2">18</h2>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center">
                <ClipboardList className="text-purple-600" size={28} />
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-white rounded-3xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Completed Tasks</p>

                <h2 className="text-4xl font-bold text-gray-800 mt-2">12</h2>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
                <CheckCircle className="text-green-600" size={28} />
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white rounded-3xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Tasks</p>

                <h2 className="text-4xl font-bold text-gray-800 mt-2">6</h2>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">
                <Clock className="text-orange-600" size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Team Members</h2>

              <p className="text-gray-500 mt-1">
                Employees working under your team
              </p>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {team?.employees?.map((emp) => (
              <div
                key={emp._id}
                className="border border-gray-200 rounded-3xl p-5 hover:shadow-lg transition-all bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-2xl font-bold">
                    {emp.name?.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {emp.name}
                    </h3>

                    <p className="text-gray-500 text-sm mt-1">{emp.email}</p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center gap-3 text-gray-600 text-sm">
                    <User size={16} />
                    Employee
                  </div>

                  <div className="flex items-center gap-3 text-gray-600 text-sm">
                    <Briefcase size={16} />
                    Active Tasks: 3
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDashboard;
