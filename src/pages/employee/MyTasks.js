import React, { useEffect, useState } from "react";
import API from "../../APIs/api";
import "../../css/MyTasks.css";

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("Not Started");
  const [remarks, setRemarks] = useState("");

  /* ===============================
      FETCH MY TASKS
  ================================= */
  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  /* ===============================
      OPEN TASK
  ================================= */
  const openTask = (task) => {
    setSelected(task);
    setStatus(task.status);
    setRemarks(task.remarks || "");
  };

  /* ===============================
      SAVE UPDATE
  ================================= */
  const saveTask = async () => {
    try {
      await API.put(`/tasks/${selected._id}`, {
        status,
        remarks,
      });

      alert("Updated Successfully");
      setSelected(null);
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  const getPriorityClass = (priority) => {
    if (priority === "High") return "high";
    if (priority === "Medium") return "medium";
    return "low";
  };

  return (
    <div className="mytask-page">
      <div className="top-bar">
        <h2>My Tasks</h2>
      </div>

      <div className="task-grid">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task._id}
              className="task-card"
              onClick={() => openTask(task)}
            >
              <div className="task-head">
                <h3>{task.taskName}</h3>

                {task.isSubtask && (
                  <span className="subtask-badge">Subtask</span>
                )}
              </div>

              <p>{task.description}</p>

              <div className="task-footer">
                <span className={getPriorityClass(task.priority)}>
                  {task.priority}
                </span>

                <span className="status-badge">{task.status}</span>
              </div>

              {task.parentTask && (
                <small className="parent-task">
                  Parent: {task.parentTask.taskName}
                </small>
              )}
            </div>
          ))
        ) : (
          <h3>No Tasks Assigned</h3>
        )}
      </div>

      {/* MODAL */}
      {selected && (
        <div className="modal-bg">
          <div className="modal-box">
            <div className="modal-top">
              <h2>{selected.taskName}</h2>

              <button onClick={() => setSelected(null)}>✕</button>
            </div>

            {/* DESCRIPTION */}
            <p>{selected.description}</p>

            {/* DEADLINE */}
            <div className="task-info-row">
              <label>Deadline</label>
              <p className="deadline-text">
                {selected.deadline
                  ? new Date(selected.deadline).toLocaleDateString()
                  : "No Deadline"}
              </p>
            </div>

            {/* PRIORITY */}
            <div className="task-info-row">
              <label>Priority</label>
              <p>{selected.priority}</p>
            </div>

            {/* STATUS */}
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option>Not Started</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>

            {/* REMARKS */}
            <label>Remarks</label>
            <textarea
              rows="5"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />

            <button className="save-btn" onClick={saveTask}>
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTasks;
