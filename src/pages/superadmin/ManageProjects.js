// ===============================
// File: src/pages/superadmin/ManageProjects.jsx
// ===============================
import React from "react";

const ManageProjects = () => {
  const projects = [
    { name: "Web Portal", admin: "John" },
    { name: "SSP", admin: "Rahul" },
    { name: "iPGRS", admin: "Priya" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">Manage Projects</h1>

      <table className="w-full bg-white rounded shadow">
        <thead className="bg-blue-900 text-white">
          <tr>
            <th className="p-3 text-left">Project Name</th>
            <th className="p-3 text-left">Assigned Admin</th>
          </tr>
        </thead>

        <tbody>
          {projects.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="p-3">{item.name}</td>
              <td className="p-3">{item.admin}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageProjects;