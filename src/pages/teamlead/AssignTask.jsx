import React, { useEffect, useState } from "react";
import axios from "axios";

const AssignTask = () => {

  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [formData, setFormData] = useState({
    taskName: "",
    description: "",
    assignedTo: "",
    priority: "Medium",
    dueDate: "",
     project: user.project,
  });

  const [attachment, setAttachment] = useState(null);

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    fetchTeamMembers();
    fetchTasks();
  }, []);

  // FETCH TASKS
  const fetchTasks = async () => {
    try {

      const res = await axios.get(
        "http://localhost:5000/api/tasks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  // FETCH TEAM MEMBERS
  const fetchTeamMembers = async () => {
    try {

      const res = await axios.get(
        "http://localhost:5000/api/team/my-team",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTeamMembers(res.data.team.employees);

    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // FILE HANDLER
  const handleFileChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const allowed = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowed.includes(file.type)) {
      alert("Only JPG PNG PDF DOC DOCX allowed");
      return;
    }

    if (file.size > 10 * 1024) {
      alert("File size must be under 10KB");
      return;
    }

    setAttachment(file);
  };

  // SUBMIT
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const data = new FormData();

      data.append("taskName", formData.taskName);
      data.append("description", formData.description);
      data.append("assignedTo", formData.assignedTo);
      data.append("priority", formData.priority);
      data.append("dueDate", formData.dueDate);
      data.append("project", formData.project);

      if (attachment) {
        data.append("attachment", attachment);
      }

      await axios.post(
        "http://localhost:5000/api/tasks",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Task Assigned Successfully");

      setFormData({
        taskName: "",
        description: "",
        assignedTo: "",
        priority: "Medium",
        dueDate: "",
      });

      setAttachment(null);

      fetchTasks();

      setShowForm(false);

    } catch (error) {

      console.log(error);

      alert("Failed To Assign Task");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            Team Tasks
          </h1>

          <p className="text-gray-500 mt-2">
            Manage and assign tasks to employees
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg"
        >
          + Assign Task
        </button>
      </div>

      {/* EXISTING TASKS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {tasks.map((task) => (

          <div
            key={task._id}
            className="bg-white rounded-3xl shadow-md border border-gray-200 p-6"
          >
            <div className="flex items-start justify-between">

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {task.taskName}
                </h2>

                <p className="text-gray-500 mt-2 text-sm">
                  {task.description}
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                {task.priority}
              </span>
            </div>

            <div className="mt-5 space-y-2 text-sm text-gray-600">

              <p>
                Assigned To:
                <span className="font-semibold ml-1">
                  {task.assignedTo?.name}
                </span>
              </p>

              <p>
                Due:
                <span className="font-semibold ml-1">
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </p>

              {task.attachment && (
                <a
                  href={`http://localhost:5000/uploads/${task.attachment}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  View Attachment
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* FORM */}
      {showForm && (

        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            <input
              type="text"
              name="taskName"
              placeholder="Task Title"
              value={formData.taskName}
              onChange={handleChange}
              required
              className="w-full border rounded-2xl px-4 py-3"
            />

            <textarea
              rows="5"
              name="description"
              placeholder="Task Description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full border rounded-2xl px-4 py-3"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                required
                className="border rounded-2xl px-4 py-3"
              >
                <option value="">
                  Select Employee
                </option>

                {teamMembers.map((emp) => (
                  <option
                    key={emp._id}
                    value={emp._id}
                  >
                    {emp.name}
                  </option>
                ))}
              </select>

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="border rounded-2xl px-4 py-3"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>

              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                className="border rounded-2xl px-4 py-3"
              />
            </div>

            {/* FILE */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Attachment
              </label>

              <input
                type="file"
                onChange={handleFileChange}
                className="w-full border rounded-2xl px-4 py-3"
              />

              <p className="text-xs text-gray-500 mt-2">
                JPG PNG PDF DOC DOCX only | Max 10KB
              </p>
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-semibold"
            >
              Assign Task
            </button>

          </form>
        </div>
      )}
    </div>
  );
};

export default AssignTask;