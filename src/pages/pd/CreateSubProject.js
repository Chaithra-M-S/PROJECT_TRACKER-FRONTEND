import React, { useState, useEffect } from "react";
import API from "../../APIs/api";

const CreateSubProject = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [managers, setManagers] = useState([]);

  const [form, setForm] = useState({
    project: "",
    taskName: "",
    description: "",
    manager: "",
    deadline: "",
    priority: "",
    status: "Not Started"
  });

  useEffect(() => {
    fetchProjects();

  }, []);

  const fetchProjects = async () => {
    const res = await API.get("/projects");
    setProjects(res.data);
  };



  const handleProjectChange = async (e) => {
    const projectId = e.target.value;

    console.log("SELECTED PROJECT ID:", projectId); // 👈 MUST print valid ID

    // update form FIRST
    setForm((prev) => ({
      ...prev,
      project: projectId
    }));

    // ❗ STOP if empty
    if (!projectId) {
      console.log("No project selected");
      return;
    }

    try {
      const res = await API.get(`/users/managers/${projectId}`);
      console.log("Managers:", res.data);
      setManagers(res.data);
    } catch (err) {
      console.error("Error fetching managers:", err);
    }
  };


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTask = {
      ...form,
      progress: form.status === "Completed" ? "100%" : "0%"
    };

    setTasks([...tasks, newTask]);

    setForm({
      project: "",
      taskName: "",
      description: "",
      manager: "",
      deadline: "",
      priority: "",
      status: "Not Started"
    });
  };

  return (
    <div className="dashboard-table">
      <h3>Create Sub Project / Task</h3>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="onboard-form">

        <div className="form-row">
          <select name="project" value={form.project} onChange={handleProjectChange}>
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>

          <input
            name="taskName"
            placeholder="Task Name"
            value={form.taskName}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <select name="manager" value={form.manager} onChange={handleChange}>
            <option value="">Assign Manager</option>
            {managers.map((m) => (
              <option key={m._id} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <select name="priority" value={form.priority} onChange={handleChange}>
            <option value="">Priority</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>

        <button className="submit-btn">Create Task</button>
      </form>

      {/* TABLE */}
      <h3 style={{ marginTop: "20px" }}>Sub Projects</h3>

      <table className="user-table">
        <thead>
          <tr>
            <th>Project</th>
            <th>Task</th>
            <th>Description</th>
            <th>Manager</th>
            <th>Deadline</th>
            <th>Priority</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((t, index) => (
            <tr key={index}>
              <td>{t.project?.name}</td>
              <td>{t.taskName}</td>
              <td>{t.description}</td>
              <td>{t.manager}</td>
              <td>{t.deadline}</td>
              <td>{t.priority}</td>
              <td>
                <span className={`status ${t.status.toLowerCase().replace(" ", "-")}`}>
                  {t.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CreateSubProject;