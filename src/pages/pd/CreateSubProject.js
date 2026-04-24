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

  const fetchTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  useEffect(() => {
    fetchProjects();
    fetchTasks();

  }, []);

  const fetchProjects = async () => {
    const res = await API.get("/projects");
    setProjects(res.data);
  };

  const handleProjectChange = async (e) => {
    const projectId = e.target.value;

    console.log("SELECTED PROJECT:", projectId); // debug

    setForm({ ...form, project: projectId });

    try {
      const res = await API.get(`/users/managers/${projectId}`);
      setManagers(res.data);
      console.log("Managers API response:", res.data);
    } catch (err) {
      console.error("Error fetching managers:", err);
    }
  };




  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ validate FIRST
    if (!form.project || !form.taskName || !form.manager) {
      alert("Please fill all required fields");
      return;
    }

    try {
      console.log("FORM DATA:", form);

      const res = await API.post("/tasks", form);

      console.log("Task saved:", res.data);

      fetchTasks();

      setForm({
        project: "",
        taskName: "",
        description: "",
        manager: "",
        deadline: "",
        priority: "",
        status: "Not Started"
      });

    } catch (err) {
      console.error("CREATE TASK ERROR:", err.response?.data || err.message);
    }
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
            <option value="" disabled> Assign Manager</option>
            {managers.map((m) => (
              <option key={m._id} value={m._id}>
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
              <td>{t.manager?.name}</td>
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