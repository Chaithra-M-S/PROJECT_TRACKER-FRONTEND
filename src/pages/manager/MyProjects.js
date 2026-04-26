import React, { useEffect, useState } from "react";
import API from "../../APIs/api";
import "../../css/MyProjects.css";
import TaskDetails from "./TaskDetails";

const MyProjects = () => {
  const [tasks, setTasks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [employees, setEmployees] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const managerId = user._id;

  const fetchEmployees = async () => {
    try {
      const res = await API.get(`/users/manager/${managerId}`);
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };


  const fetchTasks = async () => {
    try {
      const res = await API.get(`/tasks/my-tasks`);
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
    if (priority === "High") return "priority-high";
    if (priority === "Medium") return "priority-medium";
    return "priority-low";
  };

  return (
    <div className="project-page">
      <h2>My Tasks</h2>

      <div className="task-grid">
        {tasks.length > 0 ? (
          tasks.map((t) => (
            <div
              key={t._id}
              className="task-card"
              onClick={() => setSelected(t)}
            >
              <h4>{t.taskName}</h4>
              <p className="desc">{t.description}</p>

              <div className="card-footer">
                <span className={getPriorityClass(t.priority)}>
                  {t.priority}
                </span>

                <span className="status-badge">
                  {t.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p>No Tasks Assigned</p>
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