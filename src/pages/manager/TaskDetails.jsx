import React, { useEffect, useState } from "react";
import Select from "react-select";
import API from "../../APIs/api";
import socket from "../../socket";
console.log("Socket connected:", socket.connected);

const TaskDetails = ({ taskId, onClose }) => {
  const [task, setTask] = useState(null);
  const [teamLeads, setTeamLeads] = useState([]);
  const [members, setMembers] = useState([]);
  const [message, setMessage] = useState("");
  const [managerMessage, setManagerMessage] = useState("");
  const [subtaskMessage, setSubtaskMessage] = useState("");

  const [subtaskMessages, setSubtaskMessages] = useState([]);

  const [status, setStatus] = useState("Not Started");
  const [showSubtaskForm, setShowSubtaskForm] = useState(false);
  const [selectedSubtask, setSelectedSubtask] = useState(null);
  const [taskMessages, setTaskMessages] = useState([]);

  const [showMention, setShowMention] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionList, setMentionList] = useState([]);
  const [editingSubtask, setEditingSubtask] = useState(null);

  const [showAssignForm, setShowAssignForm] = useState(false);

  const [assignForm, setAssignForm] = useState({
    assignedTo: [],
    teamLead: "",
  });

  const [subtaskForm, setSubtaskForm] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "Medium",
    assignees: [],
    teamLead: "",
  });

  const user = JSON.parse(sessionStorage.getItem("user"));
  useEffect(() => {
    fetchTask();
    fetchTaskMessages();
  }, [taskId]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const joinRooms = () => {
      console.log("✅ JOINING TASK ROOM:", taskId);

      socket.emit("joinTask", String(taskId));

      if (selectedSubtask) {
        console.log("✅ JOINING SUBTASK ROOM:", selectedSubtask._id);

        socket.emit("joinTask", String(selectedSubtask._id));
      }
    };

    // initial join
    joinRooms();

    // rejoin after reconnect
    socket.on("connect", joinRooms);

    const handler = (msg) => {
      const getRoomId = (msg) => {
        return String(
          msg.taskId ||
            (typeof msg.task === "object" ? msg.task._id : msg.task),
        );
      };
      const msgTaskId = getRoomId(msg);

      // MAIN TASK CHAT
      if (msgTaskId === String(taskId)) {
        setTaskMessages((prev) => [...prev, msg]);
      }

      if (selectedSubtask && msgTaskId === String(selectedSubtask._id)) {
        setSubtaskMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receiveMessage", handler);

    return () => {
      socket.off("connect", joinRooms);
      socket.off("receiveMessage", handler);
    };
  }, [taskId, selectedSubtask]);

  const fetchTeamLeads = async (projectId) => {
    try {
      const res = await API.get(`/users/project/${projectId}`);

      const leads = res.data.filter((u) => u.role === "TEAMLEAD");

      setTeamLeads(leads);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTaskMessages = async () => {
    const res = await API.get(`/messages/${taskId}`);
    setTaskMessages(res.data);
  };

  const fetchSubtaskMessages = async (id) => {
    const res = await API.get(`/messages/${id}`);
    setSubtaskMessages(res.data);
  };

  const fetchTask = async () => {
    try {
      const res = await API.get(`/tasks/${taskId}`);
      setTask(res.data);
      setStatus(res.data.status);

      const projectId =
        res.data.project?._id || res.data.project || user.project;

      fetchEmployees(projectId);
      fetchTeamLeads(projectId);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchEmployees = async (projectId) => {
    try {
      const res = await API.get(`/users/project/${projectId}`);

      // only employees + teamleads
      const filtered = res.data.filter(
        (u) => u.role === "EMPLOYEE" || u.role === "TEAMLEAD",
      );

      setMembers(filtered);
    } catch (err) {
      console.log(err);
    }
  };

  const saveTask = async () => {
    try {
      socket.emit("sendMessage", {
        taskId,
        text: message,
        sender: {
          _id: user._id,
          name: user.name,
        },
      });

      setMessage("");
      alert("Updated");
    } catch (err) {
      console.log(err);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    // 1. Save in DB
    const res = await API.post("/messages", {
      taskId,
      text: newMessage,
    });

    const savedMessage = res.data;

    // 2. Emit via socket
    socket.emit("sendMessage", {
      taskId,
      ...savedMessage,
    });

    setNewMessage("");
  };

  const assignMainTask = async () => {
  try {
    await API.put(`/tasks/${taskId}`, {
      assignedTo: assignForm.assignedTo,
      teamLead: assignForm.teamLead,
    });

    alert("Task Assigned");

    setShowAssignForm(false);

    fetchTask();
  } catch (err) {
    console.log(err);
  }
};

  const saveSubtask = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const payload = {
        taskName: subtaskForm.title,
        description: subtaskForm.description,
        deadline: subtaskForm.deadline,
        priority: subtaskForm.priority,
        assignedTo: subtaskForm.assignees,
        teamLead: subtaskForm.teamLead,
      };

      if (editingSubtask) {
        // ✅ UPDATE
        await API.put(`/tasks/${editingSubtask._id}`, payload);
        alert("Subtask Updated");
      } else {
        // ✅ CREATE
        await API.post("/tasks", {
          ...payload,
          project: task.project?._id || task.project || user.project,
          manager: task.manager?._id || task.manager || user.id,
          parentTask: task._id,
          isSubtask: true,
        });
        alert("Subtask Created");
      }

      // RESET
      setEditingSubtask(null);
      setShowSubtaskForm(false);
      setSubtaskForm({
        title: "",
        description: "",
        deadline: "",
        priority: "Medium",
        assignees: [],
        assignedTeams: [],
      });

      fetchTask(); // refresh UI
    } catch (err) {
      console.log(err.response?.data || err);
    }
  };

  if (!task) return <h2 className="p-4">Loading...</h2>;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-lg p-6 overflow-y-auto max-h-[90vh]">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-xs text-gray-500">
              TASK-{task._id.slice(-4)}
            </span>
            <h2 className="text-xl font-semibold">{task.taskName}</h2>
          </div>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div>
              <h3 className="font-semibold mb-1">Description</h3>
              <p className="text-gray-600">{task.description}</p>
            </div>

            {/* Details */}
            <div>
              <h3 className="font-semibold mb-2">Task Details</h3>

              <div className="text-sm space-y-1">
                <p>
                  <span className="font-medium">Priority:</span> {task.priority}
                </p>
                <p>
                  <span className="font-medium">Deadline:</span>{" "}
                  {task.deadline?.slice(0, 10)}
                </p>
              </div>
            </div>

            {/* ASSIGN MAIN TASK */}
            {showAssignForm && (
              <div className="mt-4 space-y-3 border p-4 rounded-lg bg-gray-50">
                <h3 className="font-semibold text-lg">Assign Entire Task</h3>

                {/* EMPLOYEES */}
                <Select
                  isMulti
                  options={members.map((member) => ({
                    value: member._id,
                    label: `${member.name} ${
                      member.designation?.name
                        ? `(${member.designation.name} || "EMPLOYEE)`
                        : ""
                    }`,
                  }))}
                  value={members
                    .filter((member) =>
                      assignForm.assignedTo.includes(member._id),
                    )
                    .map((member) => ({
                      value: member._id,
                      label: `${member.name} ${
                        member.designation?.name
                          ? `(${member.designation.name  || "EMPLOYEE"})`
                          : ""
                      }`,
                    }))}
                  onChange={(selected) =>
                    setAssignForm({
                      ...assignForm,
                      assignedTo: selected
                        ? selected.map((item) => item.value)
                        : [],
                    })
                  }
                  placeholder="Assign Employees"
                />

                {/* TEAMLEAD */}
                <Select
                  options={teamLeads.map((lead) => ({
                    value: lead._id,
                    label: `${lead.name} ${
                      lead.designation?.title
                        ? `(${lead.designation.title})`
                        : ""
                    }`,
                  }))}
                  value={
                    teamLeads
                      .filter((lead) => lead._id === assignForm.teamLead)
                      .map((lead) => ({
                        value: lead._id,
                        label: `${lead.name} ${
                          lead.designation?.title
                            ? `(${lead.designation.title})`
                            : ""
                        }`,
                      }))[0] || null
                  }
                  onChange={(selected) =>
                    setAssignForm({
                      ...assignForm,
                      teamLead: selected ? selected.value : "",
                    })
                  }
                  placeholder="Assign TeamLead"
                />

                <button
                  className="bg-green-600 text-white px-4 py-2 rounded"
                  onClick={assignMainTask}
                >
                  Save Assignment
                </button>
              </div>
            )}

            {/* Subtasks */}
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Subtasks</h3>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowAssignForm(!showAssignForm)}
                  className="bg-purple-600 text-white px-3 py-1 rounded text-sm"
                >
                  Assign Task
                </button>

                <button
                  onClick={() => setShowSubtaskForm(!showSubtaskForm)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  + Add Subtask
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-1 flex flex-col h-[520px] border rounded-2xl shadow-sm bg-white">
            {/* HEADER */}
            <div className="p-3 border-b font-semibold text-gray-700 bg-gray-50 rounded-t-2xl">
              PD ↔ Manager Chat
            </div>

            {/* CHAT BODY */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {taskMessages.map((msg) => {
                const isMe =
                  msg.sender?._id === user._id || msg.sender === user._id;

                return (
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
                );
              })}
            </div>

            {/* INPUT AREA */}
            <div className="p-2 border-t flex gap-2">
              <input
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Type message..."
                value={managerMessage}
                onChange={(e) => setManagerMessage(e.target.value)}
              />

              <button
                className="bg-blue-600 text-white px-3"
                onClick={async () => {
                  if (!managerMessage.trim()) return;

                  try {
                    const res = await API.post("/messages", {
                      taskId,
                      text: managerMessage,
                    });

                    // ✅ ONLY emit ONCE and send CORRECT structure
                    // socket.emit("sendMessage", {
                    //   taskId: taskId,
                    //   text: res.data.text,
                    //   sender: res.data.sender, // already populated from backend
                    // });

                    socket.emit("sendMessage", res.data);

                    setManagerMessage("");
                  } catch (err) {
                    console.log(err);
                  }
                }}
              >
                Send
              </button>
            </div>

            {/* STATUS SECTION */}
            <div className="p-3 border-t bg-gray-50 rounded-b-2xl">
              <select
                className="w-full p-2 border rounded mb-2"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>Not Started</option>
                <option>In Progress</option>
                <option>Under Review</option>
                <option>Completed</option>
              </select>

              <button
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                onClick={async () => {
                  await API.put(`/tasks/${taskId}`, { status });
                  alert("Status Updated");
                  fetchTask();
                }}
              >
                Update Status
              </button>
            </div>
          </div>
          {selectedSubtask && (
            <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
              <div className="bg-white w-[600px] p-5 rounded-xl">
                {/* Header */}
                <div className="flex justify-between mb-3">
                  <h2 className="font-semibold">{selectedSubtask.taskName}</h2>
                  <button onClick={() => setSelectedSubtask(null)}>✕</button>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-3">
                  {selectedSubtask.description}
                </p>

                {/* Assigned Users */}
                <div className="mb-3">
                  <h4 className="font-medium">Assigned Users</h4>
                  <ul className="text-sm text-gray-600">
                    {selectedSubtask.assignedTo?.length > 0 ? (
                      selectedSubtask.assignedTo.map((u, i) => (
                        <li key={i}>
                          • {u.name || u} {/* handles both object and string */}
                        </li>
                      ))
                    ) : (
                      <li>No users assigned</li>
                    )}
                  </ul>
                </div>

                {/*//SubTask Chat */}
                <div className="h-40 overflow-y-auto border p-2 rounded bg-gray-50">
                  {subtaskMessages.map((msg) => {
                    const isMe =
                      msg.sender?._id === user._id || msg.sender === user._id;

                    return (
                      <div
                        key={msg._id}
                        className={`p-2 mb-2 rounded max-w-[75%] ${
                          isMe
                            ? "ml-auto bg-blue-100 text-right"
                            : "bg-gray-200"
                        }`}
                      >
                        <p>{msg.text}</p>
                        <small className="text-xs text-gray-500">
                          {msg.sender.name}
                        </small>
                      </div>
                    );
                  })}
                </div>

                {/* Input */}
                <div className="flex gap-2 mt-2">
                  <div className="relative flex-1">
                    <input
                      className="w-full border p-2 rounded"
                      value={subtaskMessage}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSubtaskMessage(val);

                        // detect LAST word starting with @
                        const match = val.match(/(^|\s)@(\w*)$/);

                        if (match) {
                          setShowMention(true);

                          const query = match[2].toLowerCase();

                          const filteredUsers = (
                            selectedSubtask.assignedTo || []
                          ).filter((u) => u.name.toLowerCase().includes(query));

                          setMentionList(filteredUsers);
                        } else {
                          setShowMention(false);
                        }
                      }}
                    />

                    {/* MENTION DROPDOWN */}
                    {showMention && mentionList.length > 0 && (
                      <div className="absolute bottom-12 left-0 bg-white border rounded shadow w-full max-h-40 overflow-y-auto z-50">
                        {mentionList.map((user) => (
                          <div
                            key={user._id}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setSubtaskMessage((prev) =>
                                prev.replace(/(^|\s)@\w*$/, `$1@${user.name} `),
                              );
                              setShowMention(false);
                            }}
                          >
                            {user.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    className="bg-blue-600 text-white px-3"
                    onClick={async () => {
                      if (!subtaskMessage.trim()) return;

                      try {
                        const res = await API.post("/messages", {
                          taskId: selectedSubtask._id,
                          text: subtaskMessage,
                        });

                        // ✅ ONLY emit ONCE and send CORRECT structure
                        // socket.emit("sendMessage", {
                        //   taskId: selectedSubtask._id,
                        //   text: res.data.text,
                        //   sender: res.data.sender, // already populated from backend
                        // });
                        socket.emit("sendMessage", res.data);

                        setSubtaskMessage("");
                      } catch (err) {
                        console.log(err);
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
      </div>
    </div>
  );
};

export default TaskDetails;
