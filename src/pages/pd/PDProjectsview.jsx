import React, { useEffect, useState, useRef } from "react";
import API from "../../APIs/api";
import socket from "../../socket";

const PDProjectsView = () => {
  const user = JSON.parse(sessionStorage.getItem("user")) || {};

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [messagesMap, setMessagesMap] = useState({}); // ✅ store messages per task
  const [openTasks, setOpenTasks] = useState([]);
  const [selectedTaskForChat, setSelectedTaskForChat] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

  const chatRefs = useRef({});

 

//   useEffect(() => {
//   if (!socket.connected) {
//     socket.connect();
//   }

//   fetchProjects();

//   const joinRooms = () => {
//     console.log("🔄 PD REJOINING ROOMS");

//     tasks.forEach((task) => {
//       console.log("✅ JOIN:", task._id);

//       socket.emit("joinTask", String(task._id));
//     });
//   };

//   // initial join
//   joinRooms();

//   // rejoin after reconnect
//   socket.on("connect", joinRooms);

//   const handler = (msg) => {
//     console.log("RECEIVED IN PD:", msg);

//     const getRoomId = (msg) => {
//   return String(
//     msg.taskId ||
//     (typeof msg.task === "object"
//       ? msg.task._id
//       : msg.task)
//   );
// };

//     setMessagesMap((prev) => ({
//       ...prev,
//       [roomId]: [...(prev[roomId] || []), msg],
//     }));
//   };

//   socket.on("receiveMessage", handler);

//   return () => {
//     socket.off("connect", joinRooms);
//     socket.off("receiveMessage", handler);
//   };
// }, [tasks]);

useEffect(() => {
  if (!socket.connected) {
    socket.connect();
  }
  fetchProjects();

  const handler = (msg) => {
    console.log("RECEIVED IN PD:", msg);

    const roomId = String(
      msg.taskId ||
      (typeof msg.task === "object"
        ? msg.task._id
        : msg.task)
    );

    setMessagesMap((prev) => ({
      ...prev,
      [roomId]: [...(prev[roomId] || []), msg],
    }));
  };

  socket.on("receiveMessage", handler);

  return () => {
    socket.off("receiveMessage", handler);
  };
}, []);

  useEffect(() => {
    Object.values(chatRefs.current).forEach((el) => {
      if (el) el.scrollTop = el.scrollHeight;
    });
  }, [messagesMap]);

  const toggleTask = (taskId) => {
    setOpenTasks(
      (prev) =>
        prev.includes(taskId)
          ? prev.filter((id) => id !== taskId) // close
          : [...prev, taskId], // open
    );
  };

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchMessages = async (taskId) => {
    try {
      const res = await API.get(`/messages/${taskId}`);
      setMessagesMap((prev) => ({
        ...prev,
        [taskId]: res.data,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const openProject = async (project) => {
    setMessagesMap({});
    try {
      setSelectedProject(project);

      const res = await API.get(`/tasks/project/${project._id}`);
      setTasks(res.data);


      // ✅ join rooms + fetch messages
     res.data.forEach((task) => {
  console.log("✅ PD JOINING ROOM:", task._id);

  socket.emit("joinTask", String(task._id));

  fetchMessages(task._id);
});
    } catch (err) {
      console.log(err);
    }
  };

  const getStatusClass = (status) => {
    if (status === "Completed") return "bg-green-100 text-green-600";
    if (status === "In Progress") return "bg-yellow-100 text-yellow-600";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {!selectedProject ? (
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Main Projects
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-white p-5 rounded-2xl shadow hover:shadow-lg"
              >
                <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {project.description}
                </p>

                <button
                  onClick={() => openProject(project)}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  View Tasks
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => {
                setSelectedProject(null);
                setTasks([]);
              }}
              className="text-blue-600"
            >
              ← Back
            </button>

            <h2 className="text-2xl font-semibold">{selectedProject.name}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white p-5 rounded-2xl shadow space-y-4"
              >
                {/* TASK HEADER */}
                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">{task.taskName}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded ${getStatusClass(task.status)}`}
                    >
                      {task.status}
                    </span>
                  </div>

                  {/* DESCRIPTION */}
                  <p className="text-sm text-gray-600 mt-1">
                    {task.description || "No description"}
                  </p>
                </div>

                {/* TASK DETAILS */}
                <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded border space-y-1">
                  <p>
                    <strong>Priority:</strong> {task.priority || "N/A"}
                  </p>

                  <p>
                    <strong>Deadline:</strong>{" "}
                    {task.deadline
                      ? new Date(task.deadline).toLocaleDateString()
                      : "N/A"}
                  </p>

                  <p>
                    <strong>Assigned To:</strong>{" "}
                    {task.assignedTo && task.assignedTo.length > 0
                      ? task.assignedTo.map((user) => user.name).join(", ")
                      : "N/A"}
                  </p>

                  <p>
                    <strong>Manager:</strong> {task.manager?.name || "N/A"}
                  </p>
                  <button
                    onClick={() => setSelectedTaskForChat(task)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    View
                  </button>
                </div>

                {selectedTaskForChat && (
                  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-lg rounded-xl p-4 shadow-lg">
                      {/* HEADER */}
                      <div className="flex justify-between items-center mb-3">
                        <h2 className="font-semibold text-lg">
                          {selectedTaskForChat.taskName}
                        </h2>
                        <button
                          onClick={() => setSelectedTaskForChat(null)}
                          className="text-red-500"
                        >
                          ✕
                        </button>
                      </div>

                      {/* CHAT */}
                      <div className="h-60 overflow-y-auto bg-gray-50 p-2 rounded space-y-2 border mb-3">
                        {(messagesMap[selectedTaskForChat._id] || []).map(
                          (msg) => {
                            const isMe = msg.sender?._id === user._id;

                            return (
                              <div
                                key={msg._id}
                                className={`flex ${
                                  isMe ? "justify-end" : "justify-start"
                                }`}
                              >
                                <div
                                  key={msg._id}
                                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                                >
                                  <div
                                    className={`px-3 py-2 rounded-lg max-w-[70%] text-sm shadow ${
                                      isMe
                                        ? "bg-blue-600 text-white rounded-br-none"
                                        : "bg-gray-200 text-gray-800 rounded-bl-none"
                                    }`}
                                  >
                                    <p>{msg.text}</p>

                                    <div className="text-[10px] mt-1 opacity-70 text-right">
                                      {msg.sender?.name}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          },
                        )}
                      </div>

                      {/* INPUT */}
                      <div className="flex gap-2">
                        <input
                          className="flex-1 border p-2 rounded"
                          placeholder="Type message..."
                          value={replyText[selectedTaskForChat._id] || ""}
                          onChange={(e) =>
                            setReplyText({
                              ...replyText,
                              [selectedTaskForChat._id]: e.target.value,
                            })
                          }
                        />
                        <button
                          className="bg-blue-600 text-white px-3 rounded"
                          //                           onClick={() => {
                          //                             const text = replyText[selectedTaskForChat._id];
                          //                             if (!text) return;

                          //                             // socket.emit("sendMessage", {
                          //                             //   taskId: selectedTaskForChat._id,
                          //                             //   text,
                          //                             //   sender: {
                          //                             //     _id: user._id,
                          //                             //     name: user.name,
                          //                             //   },
                          //                             // });
                          //                             const res = await API.post("/messages", {
                          //   taskId: selectedTaskForChat._id,
                          //   text,
                          // });

                          // socket.emit("sendMessage", res.data); // ✅ real message from DB

                          //                             setReplyText({
                          //                               ...replyText,
                          //                               [selectedTaskForChat._id]: "",
                          //                             });
                          //                           }}
                          onClick={async () => {
                            const text = replyText[selectedTaskForChat._id];
                            if (!text) return;

                            try {
                              console.log("Sending message:", text);

                              const res = await API.post("/messages", {
                                taskId: selectedTaskForChat._id,
                                text,
                              });

                              console.log("Saved message:", res.data);

                              socket.emit("sendMessage", {
  taskId: res.data.task,   // ✅ USE THIS (comes from backend)
  text: res.data.text,
  sender: res.data.sender,
});
                              setReplyText({
                                ...replyText,
                                [selectedTaskForChat._id]: "",
                              });
                            } catch (err) {
                              console.log(
                                "SEND ERROR:",
                                err.response?.data || err.message,
                              );
                            }
                          }}
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PDProjectsView;
