import React, { useEffect, useState } from "react";
import API from "../../APIs/api";

const ManageDesignation = () => {
  const [designations, setDesignations] = useState([]);
  const [newDesignation, setNewDesignation] = useState("");

  const user = JSON.parse(localStorage.getItem("user")); // admin
  const projectId = user?.project;

  useEffect(() => {
    if (projectId) fetchDesignations();
  }, [projectId]);

  const fetchDesignations = async () => {
    try {
      const res = await API.get(`/designations/${projectId}`);
      setDesignations(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async () => {
    console.log("Project ID:", projectId);
    console.log("Sending:", {
  name: newDesignation,
  project: projectId,
});
    if (!newDesignation.trim()) return;

    try {
      await API.post("/designations", {
        name: newDesignation,
        project: projectId,
      });

      setNewDesignation("");
      fetchDesignations();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this designation?")) return;

    try {
      await API.delete(`/designations/${id}`);
      fetchDesignations();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white p-6 rounded-2xl shadow-md max-w-2xl">

        {/* HEADER */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Manage Designations
        </h2>

        {/* LIST */}
        <div className="space-y-2 mb-6">
          {designations.length > 0 ? (
            designations.map((d) => (
              <div
                key={d._id}
                className="flex justify-between items-center px-4 py-2 bg-gray-50 rounded-lg border hover:shadow-sm transition"
              >
                <span className="text-gray-700">{d.name}</span>

                <button
                  onClick={() => handleDelete(d._id)}
                  className="text-red-500 text-sm hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">
              No designations found
            </p>
          )}
        </div>

        {/* ADD SECTION */}
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Add new designation..."
            value={newDesignation}
            onChange={(e) => setNewDesignation(e.target.value)}
            className="flex-1 border border-gray-300 px-3 py-2 rounded-lg text-sm 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Add
          </button>
        </div>

      </div>
    </div>
  );
};

export default ManageDesignation;