import React, { useEffect, useState } from "react";
import API from "../../APIs/api";
import axios from "axios";
import socket from "../../socket";

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("Not Started");
  const [remarks, setRemarks] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showMention, setShowMention] = useState(false);
  const [mentionList, setMentionList] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const token = sessionStorage.getItem("token");

  const fetchTasks = async () => {
    try {
      console.log("TOKEN:", token);
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    socket.on("notifyMention", (data) => {
      setNotifications((prev) => [
        ...prev,
        {
          ...data,
          id: Date.now(),
          read: false,
        },
      ]);
    });

    return () => socket.off("notifyMention");
  }, []);

  useEffect(() => {
    const handler = (msg) => {
      if (msg.task === selected?._id || msg.taskId === selected?._id) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receiveMessage", handler);

    return () => socket.off("receiveMessage", handler);
  }, [selected]);

  useEffect(() => {
    socket.on("notifyMention", (data) => {
      alert(`You were mentioned: ${data.message}`);
    });

    return () => socket.off("notifyMention");
  }, []);

  const user = JSON.parse(sessionStorage.getItem("user"));

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    // save in DB
    const res = await API.post("/messages", {
      taskId: selected._id,
      text: newMessage,
    });

    // emit via socket
    socket.emit("sendMessage", {
      ...res.data,
      taskId: selected._id,
      sender: {
        _id: user._id,
        name: user.name,
      },
    });
    const mentionedUsers = (selected.assignedTo || []).filter((u) =>
      newMessage.includes(`@${u.name}`),
    );

    if (mentionedUsers.length > 0) {
      socket.emit("mentionNotification", {
        users: mentionedUsers.map((u) => u._id),
        taskId: selected._id,
        message: newMessage,
      });
    }

    setNewMessage("");
  };
  const openTaskById = async (taskId) => {
    try {
      const res = await API.get(`/tasks/${taskId}`);
      openTask(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const openTask = async (task) => {
    setSelected(task);
    setStatus(task.status);
    setRemarks(task.remarks || "");

    socket.emit("joinTask", task._id); // ✅ JOIN ROOM

    try {
      const res = await API.get(`/messages/${task._id}`);
      setMessages(res.data);
    } catch (err) {
      console.log(err);
    }
  };

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
    if (priority === "High") return "bg-red-100 text-red-600";
    if (priority === "Medium") return "bg-yellow-100 text-yellow-600";
    return "bg-green-100 text-green-600";
  };

  return (
    <div className="flex gap-6">
      <div className="relative cursor-pointer">
        🔔
        {notifications.filter((n) => !n.read).length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
            {notifications.filter((n) => !n.read).length}
          </span>
        )}
      </div>
      <div className="absolute right-0 mt-2 w-64 bg-white shadow rounded z-50">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="p-2 border-b hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              openTaskById(n.taskId); // 👈 implement this
              setNotifications((prev) =>
                prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)),
              );
            }}
          >
            <p className="text-sm">{n.message}</p>
          </div>
        ))}
      </div>
      {/* LEFT SIDE - TASK LIST */}
      <div className="flex-1">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">My Tasks</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div
                key={task._id}
                onClick={() => openTask(task)}
                className="bg-white p-5 rounded-2xl shadow hover:shadow-lg cursor-pointer transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg">{task.taskName}</h3>

                  {task.isSubtask && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                      Subtask
                    </span>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-3">{task.description}</p>

                <div className="flex justify-between items-center">
                  <span
                    className={`text-xs px-2 py-1 rounded ${getPriorityClass(
                      task.priority,
                    )}`}
                  >
                    {task.priority}
                  </span>

                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {task.status}
                  </span>
                </div>

                {task.parentTask && (
                  <p className="text-xs text-gray-500 mt-2">
                    Parent: {task.parentTask.taskName}
                  </p>
                )}
              </div>
            ))
          ) : (
            <h3 className="text-gray-500">No Tasks Assigned</h3>
          )}
        </div>
      </div>

      {/* RIGHT SIDE - TASK DETAILS + CHAT */}
      {selected && (
        <div className="w-[400px] bg-white rounded-2xl shadow-lg p-4 flex flex-col h-[85vh]">
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">{selected.taskName}</h2>
            <button
              onClick={() => setSelected(null)}
              className="text-gray-500 hover:text-red-500"
            >
              ✕
            </button>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-2">{selected.description}</p>

          {/* Deadline */}
          <p className="text-xs text-gray-500 mb-2">
            Deadline:{" "}
            {selected.deadline
              ? new Date(selected.deadline).toLocaleDateString()
              : "No Deadline"}
          </p>

          {/* Priority */}
          <p className="text-xs mb-2">Priority: {selected.priority}</p>

          {/* Status */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mb-3 p-2 border rounded"
          >
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>

          {/* Remarks */}

          {/* CHAT AREA */}
          <div className="flex-1 border rounded p-2 overflow-y-auto mb-2">
            {messages.length === 0 ? (
              <p className="text-gray-400 text-sm text-center">
                No messages yet
              </p>
            ) : (
              messages.map((msg) => {
                const isMe =
                  msg.sender?._id === user._id || msg.sender === user._id;

                return (
                  <div
                    key={msg._id}
                    className={`mb-2 ${isMe ? "text-right" : "text-left"}`}
                  >
                    <div
                      className={`inline-block px-3 py-2 rounded text-sm ${
                        isMe ? "bg-blue-500 text-white" : "bg-gray-200"
                      }`}
                    >
                      <p>
                        {msg.text.split(" ").map((word, i) => {
                          if (word.startsWith("@")) {
                            return (
                              <span
                                key={i}
                                className="bg-blue-100 text-blue-700 px-1 rounded font-medium"
                              >
                                {word}
                              </span>
                            );
                          }
                          return word + " ";
                        })}
                      </p>

                      <div className="text-[10px] opacity-60">
                        {msg.sender?.name || "Unknown"}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <textarea
                rows={2}
                placeholder="Type a message..."
                className="w-full border p-2 rounded resize-none"
                value={newMessage}
                onChange={(e) => {
                  const val = e.target.value;
                  setNewMessage(val);

                  const lastWord = val.split(" ").pop();

                  if (lastWord.startsWith("@")) {
                    const users = selected.assignedTo || [];

                    setShowMention(true);
                    setMentionList(
                      users.filter((u) =>
                        (u.name || u)
                          .toLowerCase()
                          .includes(lastWord.slice(1).toLowerCase()),
                      ),
                    );
                  } else {
                    setShowMention(false);
                  }
                }}
              />

              {/* MENTION DROPDOWN */}
              {showMention && mentionList.length > 0 && (
                <div className="absolute bottom-14 left-0 bg-white border rounded shadow w-full max-h-40 overflow-y-auto z-50">
                  {mentionList.map((u, i) => {
                    const name = u.name || u;

                    return (
                      <div
                        key={i}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setNewMessage((prev) =>
                            prev.replace(/@\w*$/, `@${name} `),
                          );
                          setShowMention(false);
                        }}
                      >
                        {name}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              className="bg-blue-600 text-white px-3 rounded"
              onClick={handleSend}
            >
              Send
            </button>
          </div>

          {/* Save */}
          <button
            onClick={saveTask}
            className="mt-3 bg-green-600 text-white py-2 rounded"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default MyTasks;
