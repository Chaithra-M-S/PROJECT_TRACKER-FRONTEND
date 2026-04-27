import React, { useEffect, useState } from "react";
import Select from "react-select";
import API from "../../APIs/api";
import "../../css/TaskDetails.css";

const TaskDetails = ({ taskId, onClose }) => {
  const [task, setTask] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [status, setStatus] = useState("Not Started");
  const [showSubtaskForm, setShowSubtaskForm] = useState(false);

  const [subtaskForm, setSubtaskForm] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "Medium",
    assignees: [],
  });

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchTask();
  }, []);

  /* =========================
      FETCH TASK
  ========================= */
  const fetchTask = async () => {
    try {
      const res = await API.get(`/tasks/${taskId}`);

      setTask(res.data);
      setStatus(res.data.status);

      const projectId =
        res.data.project?._id || res.data.project || user.project;

      console.log("PROJECT:", projectId);

      fetchEmployees(projectId);
    } catch (err) {
      console.log(err);
    }
  };

  /* =========================
      FETCH EMPLOYEES
  ========================= */
  const fetchEmployees = async (projectId) => {
    try {
      const res = await API.get(`/users/project/${projectId}`);

      console.log("Employees:", res.data);

      setEmployees(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  /* =========================
      UPDATE STATUS
  ========================= */
  const saveTask = async () => {
    try {
      await API.put(`/tasks/${taskId}`, {
        status,
      });

      fetchTask();
      alert("Updated");
    } catch (err) {
      console.log(err);
    }
  };

  /* =========================
      CREATE SUBTASK
  ========================= */
  const saveSubtask = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      await API.post("/tasks", {
        taskName: subtaskForm.title,
        description: subtaskForm.description,
        deadline: subtaskForm.deadline,
        priority: subtaskForm.priority,

        project: task.project?._id || task.project || user.project,

        manager: task.manager?._id || task.manager || user.id,

        parentTask: task._id,
        isSubtask: true,

        assignedTo: subtaskForm.assignees,
      });

      alert("Subtask Created");

      setShowSubtaskForm(false);

      setSubtaskForm({
        title: "",
        description: "",
        deadline: "",
        priority: "Medium",
        assignees: [],
      });
    } catch (err) {
      console.log(err.response?.data || err);
    }
  };
  if (!task) return <h2>Loading...</h2>;

  return (
    <div className="task-overlay">
      <div className="task-modal">
        {/* HEADER */}
        <div className="task-header">
          <div>
            <span className="task-id">TASK-{task._id.slice(-4)}</span>

            <h2>{task.taskName}</h2>
          </div>

          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="task-body">
          {/* LEFT */}
          {/* LEFT */}
          <div className="task-left">
            {/* DESCRIPTION */}
            <div className="task-section">
              <h3>Description</h3>
              <p>{task.description}</p>
            </div>

            {/* TASK DETAILS BELOW DESCRIPTION */}
            <div className="task-section">
              <h3>Task Details</h3>

              <div className="detail-row">
                <span>Priority:</span>
                <strong>{task.priority}</strong>
              </div>

              <div className="detail-row">
                <span>Deadline:</span>
                <strong>{task.deadline?.slice(0, 10)}</strong>
              </div>
            </div>

            {/* SUBTASK SECTION */}
            <div className="task-section">
              <div className="section-top">
                <h3>Subtasks</h3>

                <button
                  className="add-btn"
                  onClick={() => setShowSubtaskForm(!showSubtaskForm)}
                >
                  + Add Subtask
                </button>
              </div>

              {/* SHOW CREATED SUBTASKS */}
              {task.subtasks?.length > 0 && (
                <div className="saved-subtasks">
                  {task.subtasks.map((sub) => (
                    <div className="subtask-card" key={sub._id}>
                      <h4>{sub.taskName}</h4>
                      <p>{sub.description}</p>

                      <div className="mini-row">
                        <span>{sub.priority}</span>
                        <span>{sub.deadline?.slice(0, 10)}</span>
                      </div>

                      <small>{sub.status}</small>
                    </div>
                  ))}
                </div>
              )}

              {/* ADD SUBTASK FORM */}
              {showSubtaskForm && (
                <div className="subtask-form">
                  <input
                    placeholder="Subtask Name"
                    value={subtaskForm.title}
                    onChange={(e) =>
                      setSubtaskForm({
                        ...subtaskForm,
                        title: e.target.value,
                      })
                    }
                  />

                  <textarea
                    placeholder="Description"
                    value={subtaskForm.description}
                    onChange={(e) =>
                      setSubtaskForm({
                        ...subtaskForm,
                        description: e.target.value,
                      })
                    }
                  />

                  <input
                    type="date"
                    value={subtaskForm.deadline}
                    onChange={(e) =>
                      setSubtaskForm({
                        ...subtaskForm,
                        deadline: e.target.value,
                      })
                    }
                  />

                  <select
                    value={subtaskForm.priority}
                    onChange={(e) =>
                      setSubtaskForm({
                        ...subtaskForm,
                        priority: e.target.value,
                      })
                    }
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>

                  {/* EMPLOYEES */}
                  <Select
                    isMulti
                    options={employees.map((emp) => ({
                      value: emp._id,
                      label: emp.name,
                    }))}
                    value={employees
                      .filter((emp) => subtaskForm.assignees.includes(emp._id))
                      .map((emp) => ({
                        value: emp._id,
                        label: emp.name,
                      }))}
                    onChange={(selected) =>
                      setSubtaskForm({
                        ...subtaskForm,
                        assignees: selected
                          ? selected.map((item) => item.value)
                          : [],
                      })
                    }
                    placeholder="Select Employees"
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />

                  <button className="save-btn" onClick={saveSubtask}>
                    Save Subtask
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="task-right">
            {/* STATUS BOX */}
            <div className="status-box">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>Not Started</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>

              <button className="save-btn" onClick={saveTask}>
                Save
              </button>
            </div>

            {/* SUBTASKS CARD */}
            <div className="task-section">
              <h3>Subtasks</h3>

              {task.subtasks?.length > 0 ? (
                <div className="saved-subtasks">
                  {task.subtasks.map((sub) => (
                    <div className="subtask-card" key={sub._id}>
                      <h4>{sub.taskName}</h4>

                      <p>{sub.description}</p>

                      <div className="mini-row">
                        <span>{sub.priority}</span>

                        <span>{sub.deadline?.slice(0, 10)}</span>
                      </div>

                      <small>{sub.status}</small>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No Subtasks Created</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
