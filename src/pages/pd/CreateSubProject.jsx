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
    status: "Not Started",
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

    setForm({ ...form, project: projectId });

    try {
      const res = await API.get(`/users/managers/${projectId}`);
      setManagers(res.data);
    } catch (err) {
      console.error("Error fetching managers:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.project || !form.taskName || !form.manager) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const res = await API.post("/tasks", form);
      fetchTasks();

      setForm({
        project: "",
        taskName: "",
        description: "",
        manager: "",
        deadline: "",
        priority: "",
        status: "Not Started",
      });
    } catch (err) {
      console.error("CREATE TASK ERROR:", err.response?.data || err.message);
    }
  };

  const getStatusClass = (status) => {
    if (status === "Completed") return "bg-green-100 text-green-600";
    if (status === "In Progress") return "bg-yellow-100 text-yellow-600";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      
      <h3 className="text-xl font-semibold mb-4">
        Create Sub Project / Task
      </h3>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="project"
            value={form.project}
            onChange={handleProjectChange}
            className="p-2 border rounded"
          >
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>

          <input
            name="taskName"
            placeholder="Task Name"
            value={form.taskName}
            onChange={handleChange}
            className="p-2 border rounded"
          />
        </div>

        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="manager"
            value={form.manager}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option value="" disabled>
              Assign Manager
            </option>
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
            className="p-2 border rounded"
          />
        </div>

        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        >
          <option value="">Priority</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Create Task
        </button>
      </form>

      {/* TABLE */}
      <h3 className="text-xl font-semibold mt-8 mb-4">Sub Projects</h3>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Project</th>
              <th className="p-3">Task</th>
              <th className="p-3">Description</th>
              <th className="p-3">Manager</th>
              <th className="p-3">Deadline</th>
              <th className="p-3">Priority</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((t, index) => (
              <tr key={index} className="border-t">
                <td className="p-3">{t.project?.name}</td>
                <td className="p-3">{t.taskName}</td>
                <td className="p-3">{t.description}</td>
                <td className="p-3">{t.manager?.name}</td>
                <td className="p-3">{t.deadline}</td>
                <td className="p-3">{t.priority}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${getStatusClass(
                      t.status
                    )}`}
                  >
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default CreateSubProject;