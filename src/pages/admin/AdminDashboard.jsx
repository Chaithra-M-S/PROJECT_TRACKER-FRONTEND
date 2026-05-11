import React from "react";

const AdminDashboard = () => {
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Admin Dashboard
        </h2>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-3xl font-bold text-blue-600">5</h3>
          <p className="text-gray-500 mt-2">Total Projects</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-3xl font-bold text-green-600">12</h3>
          <p className="text-gray-500 mt-2">Sub Projects</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-3xl font-bold text-purple-600">48</h3>
          <p className="text-gray-500 mt-2">Total Tasks</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-3xl font-bold text-red-500">76%</h3>
          <p className="text-gray-500 mt-2">Completion Rate</p>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;