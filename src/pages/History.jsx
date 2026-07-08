import Layout from "../components/layout/layout";
import { useState, useEffect } from "react";
import { getEntries, saveEntries, getTeamMembers } from "../services/storageService";
import { exportToExcel } from "../utils/excelExport";
import { 
  Search, 
  Trash2, 
  Edit, 
  X, 
  SlidersHorizontal,
  Download,
  AlertTriangle,
  FileText
} from "lucide-react";

function History() {
  const [entries, setEntries] = useState([]);
  const [membersList, setMembersList] = useState([]);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Edit Modal State
  const [editingEntry, setEditingEntry] = useState(null);
  const [editMember, setEditMember] = useState("");
  const [editTask, setEditTask] = useState("");
  const [editActivity, setEditActivity] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editDeliverable, setEditDeliverable] = useState("");
  const [editComments, setEditComments] = useState("");
  const [editTicketId, setEditTicketId] = useState("");

  // Delete Confirmation State
  const [deletingId, setDeletingId] = useState(null);

  // Load data on mount
  useEffect(() => {
    const list = getEntries();
    const members = getTeamMembers();
    Promise.resolve().then(() => {
      setEntries(list);
      setMembersList(members);
    });
  }, []);

  const refreshData = () => {
    setEntries(getEntries());
  };

  // Filtered Entries
  const filteredEntries = entries.filter((item) => {
    const matchesSearch = 
      item.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.ticketId && item.ticketId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.deliverable.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.comments && item.comments.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMember = selectedMember ? item.member === selectedMember : true;
    const matchesStatus = selectedStatus ? item.status === selectedStatus : true;
    
    // Auto date string matches: item.date is usually formatted en-GB as "DD/MM/YYYY" or similar, 
    // or if we use Date input it's "YYYY-MM-DD". Let's convert selectedDate to DD/MM/YYYY for comparison.
    let matchesDate = true;
    if (selectedDate) {
      const [year, month, day] = selectedDate.split("-");
      const formattedFilterDate = `${day}/${month}/${year}`;
      matchesDate = item.date === formattedFilterDate;
    }

    return matchesSearch && matchesMember && matchesStatus && matchesDate;
  });

  // Handle Edit Open
  const handleOpenEdit = (entry) => {
    setEditingEntry(entry);
    setEditMember(entry.member);
    setEditTask(entry.task);
    setEditTicketId(entry.ticketId || "");
    setEditActivity(entry.activity);
    setEditStatus(entry.status);
    setEditDeliverable(entry.deliverable);
    setEditComments(entry.comments || "");
  };

  // Handle Edit Save
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editMember || !editTask.trim() || !editActivity.trim() || !editDeliverable.trim()) {
      alert("Please fill all required fields.");
      return;
    }

    const updated = entries.map((item) => {
      if (item.id === editingEntry.id) {
        return {
          ...item,
          member: editMember,
          task: editTask,
          ticketId: editTicketId,
          activity: editActivity,
          status: editStatus,
          deliverable: editDeliverable,
          comments: editComments,
        };
      }
      return item;
    });

    saveEntries(updated);
    setEditingEntry(null);
    refreshData();
  };

  // Handle Delete Entry
  const handleDeleteConfirm = () => {
    const updated = entries.filter((item) => item.id !== deletingId);
    saveEntries(updated);
    setDeletingId(null);
    refreshData();
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedMember("");
    setSelectedStatus("");
    setSelectedDate("");
  };

  const handleExportFiltered = () => {
    exportToExcel(filteredEntries);
  };

  return (
    <Layout>
      <div className="animate-fade-in space-y-6">
        
        {/* Page title and Export */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Status History
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Browse, search, edit, and export all recorded status entries.
            </p>
          </div>
          <button
            onClick={handleExportFiltered}
            disabled={filteredEntries.length === 0}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition duration-200 self-start md:self-auto cursor-pointer"
          >
            <Download size={18} />
            <span>Export View to Excel</span>
          </button>
        </div>

        {/* Filters Panel */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-700/50 text-slate-700 dark:text-slate-300">
            <SlidersHorizontal size={18} />
            <span className="font-bold text-sm uppercase tracking-wider">Search & Filters</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Search size={18} />
              </span>
              <input
                type="text"
                placeholder="Search task, activity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Member Filter */}
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option value="">All Team Members</option>
              {membersList.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option value="">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Pending">Pending</option>
              <option value="Blocked">Blocked</option>
            </select>

            {/* Date Picker */}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {(searchQuery || selectedMember || selectedStatus || selectedDate) && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Showing {filteredEntries.length} of {entries.length} records matching current criteria.
              </span>
              <button
                onClick={handleClearFilters}
                className="text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <X size={14} />
                <span>Reset Filters</span>
              </button>
            </div>
          )}
        </div>

        {/* Entries Table */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl shadow-sm overflow-hidden">
          {filteredEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <FileText size={48} className="mb-4 text-slate-300 dark:text-slate-600" />
              <p className="font-semibold text-lg">No records found</p>
              <p className="text-sm mt-1">Try resetting your search filters or add a new status entry.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-4 w-28">Date</th>
                    <th className="p-4 w-40">Member</th>
                    <th className="p-4 w-32">Ticket ID</th>
                    <th className="p-4 w-52">Task</th>
                    <th className="p-4">Activity</th>
                    <th className="p-4 w-32">Status</th>
                    <th className="p-4 w-44">Deliverable</th>
                    <th className="p-4 w-44">Comments</th>
                    <th className="p-4 w-24 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {filteredEntries.map((item) => (
                    <tr 
                      key={item.id} 
                      className="text-sm hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors align-top"
                    >
                      <td className="p-4 font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {item.date}
                      </td>
                      <td className="p-4 font-bold text-slate-900 dark:text-white">
                        {item.member}
                      </td>
                      <td className="p-4 font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {item.ticketId || "-"}
                      </td>
                      <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">
                        {item.task}
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed max-w-sm">
                        {item.activity}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          item.status === "Completed" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400" :
                          item.status === "Ongoing" ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400" :
                          item.status === "Pending" ? "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400" :
                          "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            item.status === "Completed" ? "bg-emerald-500" :
                            item.status === "Ongoing" ? "bg-amber-500" :
                            item.status === "Pending" ? "bg-blue-500" :
                            "bg-red-500"
                          }`}></span>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                        {item.deliverable}
                      </td>
                      <td className="p-4 text-slate-500 dark:text-slate-400 max-w-xs italic text-xs leading-relaxed">
                        {item.comments || "-"}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            title="Edit Entry"
                            className="p-1.5 bg-slate-50 hover:bg-blue-50 dark:bg-slate-700 dark:hover:bg-blue-950/30 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition cursor-pointer"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => setDeletingId(item.id)}
                            title="Delete Entry"
                            className="p-1.5 bg-slate-50 hover:bg-red-50 dark:bg-slate-700 dark:hover:bg-red-950/30 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Edit Modal Overlay */}
        {editingEntry && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl max-w-lg w-full shadow-2xl p-6 relative animate-fade-in">
              <button 
                onClick={() => setEditingEntry(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
                Edit Status Details
              </h2>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Team Member</label>
                    <select
                      value={editMember}
                      onChange={(e) => setEditMember(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    >
                      {membersList.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    >
                      <option value="Completed">Completed</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Pending">Pending</option>
                      <option value="Blocked">Blocked</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Ticket ID</label>
                    <input
                      type="text"
                      value={editTicketId}
                      onChange={(e) => setEditTicketId(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Task Title</label>
                    <input
                      type="text"
                      value={editTask}
                      onChange={(e) => setEditTask(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Activity</label>
                  <textarea
                    rows="3"
                    value={editActivity}
                    onChange={(e) => setEditActivity(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Deliverable</label>
                  <input
                    type="text"
                    value={editDeliverable}
                    onChange={(e) => setEditDeliverable(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Comments</label>
                  <textarea
                    rows="2"
                    value={editComments}
                    onChange={(e) => setEditComments(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition duration-200 cursor-pointer"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingEntry(null)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold py-2.5 rounded-xl transition duration-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingId && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl max-w-sm w-full shadow-2xl p-6 text-center animate-fade-in">
              <div className="mx-auto w-12 h-12 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Delete Status Entry?</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                Are you sure you want to remove this record? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl transition duration-200 cursor-pointer"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeletingId(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold py-2.5 rounded-xl transition duration-200 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}

export default History;