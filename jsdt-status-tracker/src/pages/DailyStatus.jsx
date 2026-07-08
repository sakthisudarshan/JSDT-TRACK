import Layout from "../components/layout/layout";
import { getToday } from "../utils/dateFormatter";
import { useState, useEffect } from "react";
import { saveEntry, getTeamMembers } from "../services/storageService";
import { useNavigate } from "react-router-dom";
import taskTemplates from "../data/taskTemplates";

function DailyStatus() {
  const navigate = useNavigate();
  const [membersList, setMembersList] = useState([]);
  
  const [member, setMember] = useState("");
  const [task, setTask] = useState("");
  const [activity, setActivity] = useState("");
  const [status, setStatus] = useState("Ongoing");
  const [deliverable, setDeliverable] = useState("");
  const [comments, setComments] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const list = getTeamMembers();
    Promise.resolve().then(() => {
      setMembersList(list);
    });
    // Auto select first member if available or load last selected if needed
  }, []);

  const handleApplyTemplate = (tpl) => {
    setTask(tpl.title || "");
    setActivity(tpl.activity || "");
    setDeliverable(tpl.deliverable || "");
    setComments(tpl.comments || "");
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!member || member === "Select Team Member") {
      setError("Please select a team member.");
      return;
    }
    if (!task.trim()) {
      setError("Please enter a task title.");
      return;
    }
    if (!activity.trim()) {
      setError("Please enter the activity details.");
      return;
    }
    if (!deliverable.trim()) {
      setError("Please enter the deliverable.");
      return;
    }

    setError("");
    const entry = {
      member,
      task,
      activity,
      status,
      deliverable,
      comments,
    };

    saveEntry(entry);
    setSuccess(true);
    setTimeout(() => {
      navigate("/history");
    }, 1000);
  };

  const handleClear = () => {
    setMember("");
    setTask("");
    setActivity("");
    setStatus("Ongoing");
    setDeliverable("");
    setComments("");
    setError("");
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Daily Status Entry
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Add your work details for today.
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Team Member <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={member}
                    onChange={(e) => setMember(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="">Select Team Member</option>
                    {membersList.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Current Status <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Pending">Pending</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. End-to-End Testing"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Activity Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="4"
                  placeholder="Describe your work done, modules updated, or issues verified..."
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Deliverable <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Testing completed, checklist updated, git pull request #12"
                  value={deliverable}
                  onChange={(e) => setDeliverable(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Comments
                </label>
                <textarea
                  rows="3"
                  placeholder="Any blocks, next steps, dependencies, or remarks..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 shadow-lg shadow-blue-500/10 cursor-pointer"
                >
                  💾 Save Status
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
                Click a template to auto-fill common JSDT tasks.
              </p>

              <div className="space-y-4">
                {taskTemplates.map((tpl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleApplyTemplate(tpl)}
                    className="w-full text-left bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500/60 p-4 rounded-xl shadow-sm hover:shadow transition group cursor-pointer"
                  >
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-sm transition">
                      {tpl.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                      {tpl.activity}
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