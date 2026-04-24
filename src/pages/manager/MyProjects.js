import React, { useEffect, useState } from "react";
import API from "../../APIs/api";
import "../../css/MyProjects.css";

const MyProjects = () => {
  const [tasks, setTasks] = useState([]);
  const [selected, setSelected] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");

      // support both id and _id from login data
      const userId = user._id || user.id;

      const myTasks = res.data.filter((t) => {
        if (!t.manager) return false;

        // manager populated object
        if (typeof t.manager === "object") {
          return (
            t.manager._id === userId ||
            t.manager.name === user.name
          );
        }

        // manager plain id string
        return t.manager === userId;
      });

      setTasks(myTasks);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSave = async () => {
    try {
      await API.put(`/tasks/${selected._id}`, {
        status: selected.status,
        remarks: selected.remarks,
      });

      setSelected(null);
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  const getPriorityClass = (priority) => {
    if (priority === "High") return "priority-high";
    if (priority === "Medium") return "priority-medium";
    return "priority-low";
  };

  return (
    <div className="project-page">
      <h2>My Tasks</h2>

      <div className="project-card">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {tasks.length > 0 ? (
              tasks.map((t) => (
                <tr key={t._id}>
                  <td>{t.taskName}</td>
                  <td>{t.description}</td>

                  <td>
                    <span className={getPriorityClass(t.priority)}>
                      {t.priority}
                    </span>
                  </td>

                  <td>{t.status}</td>

                  <td>
                    <button
                      className="update-btn"
                      onClick={() =>
                        setSelected({
                          ...t,
                          status: t.status,
                        })
                      }
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No Tasks Assigned
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="modal-bg">
          <div className="modal-box">
            <h3>Update Task</h3>

            <select
              value={selected.status}
              onChange={(e) =>
                setSelected({
                  ...selected,
                  status: e.target.value,
                })
              }
            >
              <option>Not Started</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>

            <textarea
              placeholder="Remarks"
              value={selected.remarks || ""}
              onChange={(e) =>
                setSelected({
                  ...selected,
                  remarks: e.target.value,
                })
              }
            />

            <div className="modal-actions">
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setSelected(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProjects;