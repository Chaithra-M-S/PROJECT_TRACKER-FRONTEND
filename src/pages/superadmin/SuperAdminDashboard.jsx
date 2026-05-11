import React from "react";

const SuperAdminDashboard = () => {
  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Super Admin Dashboard
        </h2>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <h3 className="text-2xl font-bold text-blue-600">8</h3>
          <p className="text-gray-500 mt-1">Total Admins</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <h3 className="text-2xl font-bold text-green-600">15</h3>
          <p className="text-gray-500 mt-1">Total Projects</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <h3 className="text-2xl font-bold text-purple-600">124</h3>
          <p className="text-gray-500 mt-1">Total Employees</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <h3 className="text-2xl font-bold text-orange-500">76%</h3>
          <p className="text-gray-500 mt-1">Completion Rate</p>
        </div>

      </div>

    </div>
  );
};

export default SuperAdminDashboard;