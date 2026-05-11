import React, { useEffect, useState } from "react";
import API from "../../APIs/api";
import TaskDetails from "./TaskDetails";

const MyProjects = () => {
  const [tasks, setTasks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [employees, setEmployees] = useState([]);

  const user = JSON.parse(
  sessionStorage.getItem("user")
);

const token = user?.token;
  const managerId = user._id;

  const fetchEmployees = async () => {
    try {
      const res = await API.get(`/tasks`);
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await API.get(`/tasks`);
      console.log("Tasks:", res.data);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!managerId) return;

    fetchTasks();
    fetchEmployees();
  }, []);

  const handleSave = async () => {
    try {
      await API.put(`/tasks/${selected._id}`, {
        status: selected.status,
        remarks: selected.remarks,
        assignedTo: selected.assignedTo
      });

      setSelected(null);
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  const getPriorityClass = (priority) => {
    if (priority === "High") return "bg-red-100 text-red-600 px-2 py-1 rounded text-xs";
    if (priority === "Medium") return "bg-yellow-100 text-yellow-600 px-2 py-1 rounded text-xs";
    return "bg-green-100 text-green-600 px-2 py-1 rounded text-xs";
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Tasks</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.length > 0 ? (
          tasks.map((t) => (
            <div
              key={t._id}
              onClick={() => setSelected(t)}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg cursor-pointer transition"
            >
              <h4 className="text-lg font-semibold mb-2">{t.taskName}</h4>

              <p className="text-gray-600 text-sm mb-4">{t.description}</p>

              <div className="flex justify-between items-center">
                <span className={getPriorityClass(t.priority)}>
                  {t.priority}
                </span>

                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                  {t.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No Tasks Assigned</p>
        )}
      </div>

      {selected && (
        <TaskDetails
          taskId={selected._id}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
};

export default MyProjects;