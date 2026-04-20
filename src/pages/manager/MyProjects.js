import React, { useEffect, useState } from "react";
import API from "../../APIs/api";
import "../../css/UserManagement.css";

const MyProjects = () => {
  const [tasks, setTasks] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");

      // show only assigned tasks
      const myTasks = res.data.filter(
        (t) => t.manager === user.name
      );

      setTasks(myTasks);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async (id, status, remarks) => {
    try {
      await API.put(`/tasks/${id}`, { status, remarks });
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="onboard-content">
      <h2>My Projects</h2>

      <table className="user-table">
        <thead>
          <tr>
            <th>Project</th>
            <th>Task</th>
            <th>Deadline</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Remarks</th>
            <th>Update</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((t) => (
            <tr key={t._id}>
              <td>{t.project}</td>
              <td>{t.taskName}</td>
              <td>{t.deadline?.split("T")[0]}</td>
              <td>{t.priority}</td>

              <td>
                <select
                  value={t.status}
                  onChange={(e) =>
                    handleUpdate(t._id, e.target.value, t.remarks)
                  }
                >
                  <option>Not Started</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </td>

              <td>
                <input
                  type="text"
                  value={t.remarks || ""}
                  placeholder="Delay / Clarification"
                  onChange={(e) => {
                    const updated = tasks.map((task) =>
                      task._id === t._id
                        ? { ...task, remarks: e.target.value }
                        : task
                    );
                    setTasks(updated);
                  }}
                />
              </td>

              <td>
                <button
                  onClick={() =>
                    handleUpdate(t._id, t.status, t.remarks)
                  }
                >
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyProjects;