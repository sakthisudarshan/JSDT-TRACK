import Layout from "../components/layout/layout";
import { getToday } from "../utils/dateFormatter";
import { useState, useEffect } from "react";
import { saveEntry, getTeamMembers } from "../services/storageService";
import { useNavigate } from "react-router-dom";
import taskTemplates from "../data/taskTemplates";

function DailyStatus() {
  const navigate = useNavigate();
  const [membersList, setMembersList] = useState([]);
  
  // Bug tracking dashboard fields
  const [assignee, setAssignee] = useState("");
  const [type, setType] = useState("Bug");
  const [feature, setFeature] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [qaStatus, setQaStatus] = useState("Untested");
  const [taskId, setTaskId] = useState("");
  const [ticketStatus, setTicketStatus] = useState("Ongoing");
  const [notes, setNotes] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const list = getTeamMembers();
    Promise.resolve().then(() => {
      setMembersList(list);
    });
  }, []);

  const handleApplyTemplate = (tpl) => {
    setType(tpl.type || "Bug");
    setFeature(tpl.feature || "");
    setDescription(tpl.description || "");
    setPriority(tpl.priority || "Medium");
    setQaStatus(tpl.qaStatus || "Untested");
    setTaskId(tpl.taskId || "");
    setTicketStatus(tpl.ticketStatus || "Ongoing");
    setNotes(tpl.notes || "");
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!assignee || assignee === "Select Assignee") {
      setError("Please select an assignee.");
      return;
    }
    if (!feature.trim()) {
      setError("Please enter a feature name.");
      return;
    }
    if (!description.trim()) {
      setError("Please enter description / activity details.");
      return;
    }

    setError("");
    const entry = {
      type,
      feature,
      description,
      priority,
      assignee,
      qaStatus,
      taskId: taskId.trim(),
      ticketStatus,
      notes,
    };

    saveEntry(entry);
    setSuccess(true);
    setTimeout(() => {
      navigate("/history");
    }, 1000);
  };

  const handleClear = () => {
    setAssignee("");
    setType("Bug");
    setFeature("");
    setDescription("");
    setPriority("Medium");
    setQaStatus("Untested");
    setTaskId("");
    setTicketStatus("Ongoing");
    setNotes("");
    setError("");
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Daily Bug/Task Entry
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Add a new item to the Bug Tracking Dashboard.
            </p>
          </div>
          <div className="mt-4 md:mt-0 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold px-4 py-2 rounded-xl text-sm border border-blue-100 dark:border-blue-800">
            📅 Today: {getToday()}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-sm font-medium flex items-center gap-2">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-xl text-sm font-medium flex items-center gap-2">
            ✅ Status saved successfully! Redirecting to history...
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl shadow-sm p-6 space-y-6">
              
              {/* Row 1: Assignee, Type, Priority */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Assignee <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="">Select Assignee</option>
                    {membersList.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="Bug">Bug</option>
                    <option value="Feature">Feature</option>
                    <option value="Task">Task</option>
                    <option value="Improvement">Improvement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Priority <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Task ID (Ticket ID) and Feature Name */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Task ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. JSDT-123"
                    value={taskId}
                    onChange={(e) => setTaskId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Feature <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. User Authentication"
                    value={feature}
                    onChange={(e) => setFeature(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Row 3: QA Status and Ticket Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    QA Status <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={qaStatus}
                    onChange={(e) => setQaStatus(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="Untested">Untested</option>
                    <option value="Passed">Passed</option>
                    <option value="Failed">Failed</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Ticket Status <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={ticketStatus}
                    onChange={(e) => setTicketStatus(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Pending">Pending</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Description / Activity <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="4"
                  placeholder="Detail the bug report, test results, or task description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              {/* Row 5: Notes */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Notes / Comments
                </label>
                <textarea
                  rows="3"
                  placeholder="Any blockages, observations, or QA notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 shadow-lg shadow-blue-500/10 cursor-pointer"
                >
                  💾 Save Bug/Task Status
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold py-3 px-6 rounded-xl transition duration-200 cursor-pointer"
                >
                  🧹 Clear
                </button>
              </div>

            </form>
          </div>

          {/* Quick Templates sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-6">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                ⚡ Quick Templates
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                Click a template to auto-fill common JSDT bug tracker formats.
              </p>

              <div className="space-y-4">
                {taskTemplates.map((tpl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleApplyTemplate(tpl)}
                    className="w-full text-left bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500/60 p-4 rounded-xl shadow-sm hover:shadow transition group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        tpl.type === "Bug" ? "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400" : "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
                      }`}>
                        {tpl.type}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase font-extrabold">
                        {tpl.priority}
                      </span>
                    </div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-sm transition">
                      {tpl.feature}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                      {tpl.description}
                    </p>
                    <div className="mt-3 flex items-center text-xs text-blue-600 dark:text-blue-400 font-medium opacity-0 group-hover:opacity-100 transition">
                      Apply Template &rarr;
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}

export default DailyStatus;