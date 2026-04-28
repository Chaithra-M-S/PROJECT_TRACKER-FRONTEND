import React, { useEffect, useState } from "react";
import API from "../../APIs/api";
import "../../css/PDProjectsView.css";

const PDProjectsView = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [replyText, setReplyText] = useState({});

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const openProject = async (project) => {
    try {
      setSelectedProject(project);

      const res = await API.get(`/tasks/project/${project._id}`);
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getStatusClass = (status) => {
    return status.toLowerCase().replace(" ", "-");
  };

  /* =========================
      SAVE PD REPLY
  ========================= */
  const saveReply = async (taskId) => {
    try {
      await API.put(`/tasks/${taskId}`, {
        pdReply: replyText[taskId],
      });

      setReplyText((prev) => ({
        ...prev,
        [taskId]: "",
      }));

      openProject(selectedProject);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="pd-page">
      {!selectedProject ? (
        <>
          <div className="pd-top">
            <h2>Main Projects</h2>
          </div>

          <div className="project-grid">
            {projects.map((project) => (
              <div
                className="project-card"
                key={project._id}
                onClick={() => openProject(project)}
              >
                <h3>{project.name}</h3>
                <p>{project.description}</p>

                <span className="view-btn">View Sub Projects →</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="pd-top">
            <button
              className="back-btn"
              onClick={() => {
                setSelectedProject(null);
                setTasks([]);
              }}
            >
              ← Back
            </button>

            <h2>{selectedProject.name}</h2>
          </div>

          {/* SUB TASKS */}
          <div className="subproject-grid">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div className="sub-card" key={task._id}>
                  <div className="sub-top">
                    <h3>{task.taskName}</h3>

                    <span className={`status ${getStatusClass(task.status)}`}>
                      {task.status}
                    </span>
                  </div>

                  <p className="sub-desc">{task.description}</p>

                  <div className="sub-row">
                    <span>Manager</span>
                    <strong>{task.manager?.name}</strong>
                  </div>

                  <div className="sub-row">
                    <span>Deadline</span>
                    <strong>{task.deadline?.slice(0, 10)}</strong>
                  </div>

                  <div className="sub-row">
                    <span>Priority</span>
                    <strong>{task.priority}</strong>
                  </div>

                  {/* CHAT BOX */}
                  <div className="chat-box">
                    {task.messages?.map((msg, i) => (
                      <div
                        key={i}
                        className={
                          msg.sender === "PD"
                            ? "chat-msg right"
                            : "chat-msg left"
                        }
                      >
                        <p>{msg.text}</p>
                        <small>{msg.sender}</small>
                      </div>
                    ))}

                    <div className="chat-input-row">
                      <input
                        placeholder="Reply..."
                        value={replyText[task._id] || ""}
                        onChange={(e) =>
                          setReplyText({
                            ...replyText,
                            [task._id]: e.target.value,
                          })
                        }
                      />

                      <button
                        onClick={async () => {
                          await API.put(`/tasks/${task._id}`, {
                            message: replyText[task._id],
                          });

                          setReplyText({
                            ...replyText,
                            [task._id]: "",
                          });

                          openProject(selectedProject);
                        }}
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <h3>No Sub Projects Found</h3>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PDProjectsView;
