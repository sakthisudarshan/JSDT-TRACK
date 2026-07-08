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
  
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedQaStatus, setSelectedQaStatus] = useState("");
  const [selectedTicketStatus, setSelectedTicketStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Edit Modal State
  const [editingEntry, setEditingEntry] = useState(null);
  const [editAssignee, setEditAssignee] = useState("");
  const [editType, setEditType] = useState("Bug");
  const [editFeature, setEditFeature] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState("Medium");
  const [editQaStatus, setEditQaStatus] = useState("Untested");
  const [editTaskId, setEditTaskId] = useState("");
  const [editTicketStatus, setEditTicketStatus] = useState("Ongoing");
  const [editNotes, setEditNotes] = useState("");

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
      (item.feature && item.feature.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.taskId && item.taskId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.type && item.type.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMember = selectedMember ? item.assignee === selectedMember : true;
    const matchesType = selectedType ? item.type === selectedType : true;
    const matchesPriority = selectedPriority ? item.priority === selectedPriority : true;
    const matchesQaStatus = selectedQaStatus ? item.qaStatus === selectedQaStatus : true;
    const matchesTicketStatus = selectedTicketStatus ? item.ticketStatus === selectedTicketStatus : true;
    
    let matchesDate = true;
    if (selectedDate) {
      const [year, month, day] = selectedDate.split("-");
      const formattedFilterDate = `${day}/${month}/${year}`;
      matchesDate = item.date === formattedFilterDate;
    }

    return matchesSearch && matchesMember && matchesType && matchesPriority && matchesQaStatus && matchesTicketStatus && matchesDate;
  });

  // Handle Edit Open
  const handleOpenEdit = (entry) => {
    setEditingEntry(entry);
    setEditAssignee(entry.assignee || entry.member || ""); // fallback compatibility
    setEditType(entry.type || "Bug");
    setEditFeature(entry.feature || "");
    setEditDescription(entry.description || entry.activity || "");
    setEditPriority(entry.priority || "Medium");
    setEditQaStatus(entry.qaStatus || "Untested");
    setEditTaskId(entry.taskId || entry.ticketId || "");
    setEditTicketStatus(entry.ticketStatus || entry.status || "Ongoing");
    setEditNotes(entry.notes || entry.comments || "");
  };

  // Handle Edit Save
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editAssignee || !editFeature.trim() || !editDescription.trim()) {
      alert("Please fill all required fields.");
      return;
    }

    const updated = entries.map((item) => {
      if (item.id === editingEntry.id) {
        return {
          ...item,
          assignee: editAssignee,
          type: editType,
          feature: editFeature,
          description: editDescription,
          priority: editPriority,
          qaStatus: editQaStatus,
          taskId: editTaskId.trim(),
          ticketStatus: editTicketStatus,
          notes: editNotes,
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
    setSelectedType("");
    setSelectedPriority("");
    setSelectedQaStatus("");
    setSelectedTicketStatus("");
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
              Bug Dashboard History
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Browse, search, edit, and export all recorded bug tracking dashboard items.
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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {/* Search Input */}
            <div className="relative col-span-1 sm:col-span-2">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="Search feature, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Assignee Filter */}
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
            >
              <option value="">All Assignees</option>
              {membersList.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
            >
              <option value="">All Types</option>
              <option value="Bug">Bug</option>
              <option value="Feature">Feature</option>
              <option value="Task">Task</option>
              <option value="Improvement">Improvement</option>
            </select>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>

            {/* QA Status Filter */}
            <select
              value={selectedQaStatus}
              onChange={(e) => setSelectedQaStatus(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
            >
              <option value="">All QA Statuses</option>
              <option value="Untested">Untested</option>
              <option value="Passed">Passed</option>
              <option value="Failed">Failed</option>
              <option value="Blocked">Blocked</option>
            </select>

            {/* Ticket Status Filter */}
            <select
              value={selectedTicketStatus}
              onChange={(e) => setSelectedTicketStatus(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
            >
              <option value="">All Ticket Statuses</option>
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
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>

          {(searchQuery || selectedMember || selectedType || selectedPriority || selectedQaStatus || selectedTicketStatus || selectedDate) && (
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
              <p className="text-sm mt-1">Try resetting your search filters or add a new entry.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1200px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700 text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-4 w-28">Date</th>
                    <th className="p-4 w-20 text-center">Type</th>
                    <th className="p-4 w-40">Feature</th>
                    <th className="p-4">Description / Activity</th>
                    <th className="p-4 w-24 text-center">Priority</th>
                    <th className="p-4 w-40">Assignee</th>
                    <th className="p-4 w-28 text-center">QA Status</th>
                    <th className="p-4 w-28 text-center">Task ID</th>
                    <th className="p-4 w-28 text-center">Ticket Status</th>
                    <th className="p-4 w-40">Notes</th>
                    <th className="p-4 w-24 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {filteredEntries.map((item) => (
                    <tr 
                      key={item.id} 
                      className="text-xs hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors align-top"
                    >
                      <td className="p-4 font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {item.date}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded-sm font-bold text-[9px] uppercase ${
                          item.type === "Bug" ? "bg-red-50 text-red-700 dark:bg-red-955/20 dark:text-red-400" :
                          item.type === "Feature" ? "bg-blue-50 text-blue-700 dark:bg-blue-955/20 dark:text-blue-400" :
                          item.type === "Task" ? "bg-slate-50 text-slate-700 dark:bg-slate-955/20 dark:text-slate-400" :
                          "bg-purple-50 text-purple-700 dark:bg-purple-955/20 dark:text-purple-400"
                        }`}>
                          {item.type || "Bug"}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-900 dark:text-white">
                        {item.feature}
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed max-w-sm">
                        {item.description || item.activity}
                      </td>
                      <td className="p-4 text-center font-bold">
                        <span className={`${
                          item.priority === "Critical" ? "text-red-600 dark:text-red-400 underline font-black" :
                          item.priority === "High" ? "text-red-550 dark:text-red-400" :
                          item.priority === "Medium" ? "text-amber-600 dark:text-amber-400" :
                          "text-slate-500 dark:text-slate-450"
                        }`}>
                          {item.priority || "Medium"}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-900 dark:text-white">
                        {item.assignee || item.member}
                      </td>
                      
                      {/* QA Status cell */}
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          item.qaStatus === "Passed" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450" :
                          item.qaStatus === "Failed" ? "bg-red-50 text-red-700 dark:bg-red-955/20 dark:text-red-400" :
                          item.qaStatus === "Blocked" ? "bg-amber-50 text-amber-700 dark:bg-amber-955/20 dark:text-amber-400" :
                          "bg-slate-50 text-slate-500 dark:bg-slate-950/20 dark:text-slate-400"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            item.qaStatus === "Passed" ? "bg-emerald-500" :
                            item.qaStatus === "Failed" ? "bg-red-500" :
                            item.qaStatus === "Blocked" ? "bg-amber-500" :
                            "bg-slate-400"
                          }`}></span>
                          {item.qaStatus || "Untested"}
                        </span>
                      </td>

                      {/* Task ID cell */}
                      <td className="p-4 text-center font-mono text-slate-500 dark:text-slate-400 font-bold whitespace-nowrap">
                        {item.taskId || item.ticketId || "-"}
                      </td>

                      {/* Ticket Status cell */}
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          (item.ticketStatus || item.status) === "Completed" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400" :
                          (item.ticketStatus || item.status) === "Ongoing" ? "bg-amber-50 text-amber-700 dark:bg-amber-955/20 dark:text-amber-400" :
                          (item.ticketStatus || item.status) === "Pending" ? "bg-blue-50 text-blue-700 dark:bg-blue-955/20 dark:text-blue-400" :
                          "bg-red-50 text-red-700 dark:bg-red-955/20 dark:text-red-400"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            (item.ticketStatus || item.status) === "Completed" ? "bg-emerald-500" :
                            (item.ticketStatus || item.status) === "Ongoing" ? "bg-amber-500" :
                            (item.ticketStatus || item.status) === "Pending" ? "bg-blue-500" :
                            "bg-red-500"
                          }`}></span>
                          {item.ticketStatus || item.status || "Ongoing"}
                        </span>
                      </td>

                      {/* Notes cell */}
                      <td className="p-4 text-slate-500 dark:text-slate-400 max-w-xs italic text-[11px] leading-relaxed">
                        {item.notes || item.comments || "-"}
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            title="Edit Entry"
                            className="p-1.5 bg-slate-50 hover:bg-blue-50 dark:bg-slate-700 dark:hover:bg-blue-950/30 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition cursor-pointer"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => setDeletingId(item.id)}
                            title="Delete Entry"
                            className="p-1.5 bg-slate-50 hover:bg-red-50 dark:bg-slate-700 dark:hover:bg-red-950/30 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition cursor-pointer"
                          >
                            <Trash2 size={14} />
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
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl max-w-2xl w-full shadow-2xl p-6 relative animate-fade-in max-h-[90vh] overflow-y-auto">
              <button 
                onClick={() => setEditingEntry(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
                Edit Bug / Task Details
              </h2>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                
                {/* Row 1: Assignee, Type, Priority */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Assignee</label>
                    <select
                      value={editAssignee}
                      onChange={(e) => setEditAssignee(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
                    >
                      {membersList.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Type</label>
                    <select
                      value={editType}
                      onChange={(e) => setEditType(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
                    >
                      <option value="Bug">Bug</option>
                      <option value="Feature">Feature</option>
                      <option value="Task">Task</option>
                      <option value="Improvement">Improvement</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Priority</label>
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>

                {/* Row 2: Task ID & Feature */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Task ID</label>
                    <input
                      type="text"
                      value={editTaskId}
                      onChange={(e) => setEditTaskId(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Feature</label>
                    <input
                      type="text"
                      value={editFeature}
                      onChange={(e) => setEditFeature(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Row 3: QA Status & Ticket Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">QA Status</label>
                    <select
                      value={editQaStatus}
                      onChange={(e) => setEditQaStatus(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
                    >
                      <option value="Untested">Untested</option>
                      <option value="Passed">Passed</option>
                      <option value="Failed">Failed</option>
                      <option value="Blocked">Blocked</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Ticket Status</label>
                    <select
                      value={editTicketStatus}
                      onChange={(e) => setEditTicketStatus(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Description / Activity</label>
                  <textarea
                    rows="3"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Row 5: Notes */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Notes / Comments</label>
                  <textarea
                    rows="2"
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
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