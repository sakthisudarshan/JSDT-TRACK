import Layout from "../components/layout/layout";
import { useState, useEffect } from "react";
import { getEntries, getTeamMembers } from "../services/storageService";
import { exportToExcel } from "../utils/excelExport";
import StatusCard from "../components/StatusCard";
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  AlertCircle,
  Printer,
  Calendar,
  User
} from "lucide-react";

function Reports() {
  const [entries, setEntries] = useState([]);
  const [membersList, setMembersList] = useState([]);
  const [reportPeriod, setReportPeriod] = useState("today"); // "today", "weekly", "monthly"

  useEffect(() => {
    const list = getEntries();
    const members = getTeamMembers();
    Promise.resolve().then(() => {
      setEntries(list);
      setMembersList(members);
    });
  }, []);

  // Helper to parse DD/MM/YYYY into Date object
  const parseEntryDate = (dateStr) => {
    if (!dateStr) return new Date();
    const [day, month, year] = dateStr.split("/");
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  // Filter entries based on selected period
  const getFilteredEntries = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return entries.filter((item) => {
      const entryDate = parseEntryDate(item.date);
      entryDate.setHours(0, 0, 0, 0);

      if (reportPeriod === "today") {
        return entryDate.getTime() === today.getTime();
      } else if (reportPeriod === "weekly") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        return entryDate >= sevenDaysAgo && entryDate <= today;
      } else if (reportPeriod === "monthly") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        thirtyDaysAgo.setHours(0, 0, 0, 0);
        return entryDate >= thirtyDaysAgo && entryDate <= today;
      }
      return true;
    });
  };

  const filteredEntries = getFilteredEntries();

  // Calculate statistics using ticketStatus (Completed, Ongoing, Pending, Blocked)
  const stats = {
    completed: filteredEntries.filter((e) => (e.ticketStatus || e.status) === "Completed").length,
    ongoing: filteredEntries.filter((e) => (e.ticketStatus || e.status) === "Ongoing").length,
    pending: filteredEntries.filter((e) => (e.ticketStatus || e.status) === "Pending").length,
    blocked: filteredEntries.filter((e) => (e.ticketStatus || e.status) === "Blocked").length,
    total: filteredEntries.length,
  };

  // Status breakdown per member
  const getMemberBreakdown = () => {
    const breakdown = {};
    
    // Initialize members
    membersList.forEach((m) => {
      breakdown[m] = { Completed: 0, Ongoing: 0, Pending: 0, Blocked: 0, Total: 0 };
    });

    // Populate counts
    filteredEntries.forEach((entry) => {
      const name = entry.assignee || entry.member;
      const statusVal = entry.ticketStatus || entry.status || "Ongoing";
      
      if (breakdown[name]) {
        breakdown[name][statusVal] = (breakdown[name][statusVal] || 0) + 1;
        breakdown[name].Total++;
      } else {
        // If a member was deleted but their entries still exist
        breakdown[name] = { Completed: 0, Ongoing: 0, Pending: 0, Blocked: 0, Total: 0 };
        breakdown[name][statusVal] = 1;
        breakdown[name].Total = 1;
      }
    });

    return breakdown;
  };

  const memberBreakdown = getMemberBreakdown();

  const handlePrint = () => {
    window.print();
  };

  const handleExcelExport = () => {
    exportToExcel(filteredEntries);
  };

  return (
    <Layout>
      <div className="animate-fade-in space-y-6">
        
        {/* Page title and actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Team Reports
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Analyze work completion rates and resource constraints.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700/80 font-bold py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 transition cursor-pointer"
            >
              <Printer size={18} />
              <span>Print PDF / Report</span>
            </button>
            <button
              onClick={handleExcelExport}
              disabled={filteredEntries.length === 0}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition cursor-pointer"
            >
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Print Header (Only visible when printing) */}
        <div className="hidden print-only border-b-2 border-slate-800 pb-4 mb-6">
          <h1 className="text-2xl font-bold uppercase tracking-wide text-slate-950">JSDT Status Report</h1>
          <p className="text-slate-600 text-sm mt-1">
            Report Type: <span className="font-semibold capitalize">{reportPeriod} Report</span> | Date Generated: {new Date().toLocaleDateString("en-GB")}
          </p>
        </div>

        {/* Time Tabs Selector */}
        <div className="flex bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-2xl max-w-md no-print">
          <button
            onClick={() => setReportPeriod("today")}
            className={`flex-1 text-center font-bold py-2 px-3 text-sm rounded-xl transition ${
              reportPeriod === "today"
                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setReportPeriod("weekly")}
            className={`flex-1 text-center font-bold py-2 px-3 text-sm rounded-xl transition ${
              reportPeriod === "weekly"
                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
            }`}
          >
            Weekly (7d)
          </button>
          <button
            onClick={() => setReportPeriod("monthly")}
            className={`flex-1 text-center font-bold py-2 px-3 text-sm rounded-xl transition ${
              reportPeriod === "monthly"
                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
            }`}
          >
            Monthly (30d)
          </button>
        </div>

        {/* Period Summary Header (Printable) */}
        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Calendar size={16} />
            <span>Active entries for chosen range: <strong className="text-slate-900 dark:text-white font-extrabold">{filteredEntries.length}</strong></span>
          </span>
          <span className="text-xs uppercase font-extrabold text-blue-600 dark:text-blue-400 tracking-wider">
            {reportPeriod} Scope
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 print-card">
          <StatusCard
            title="Total Statuses"
            count={stats.total}
            color="text-slate-900 dark:text-white"
            icon={<FileText size={20} className="text-slate-400" />}
          />
          <StatusCard
            title="Completed"
            count={stats.completed}
            color="text-emerald-600 dark:text-emerald-400"
            icon={<CheckCircle2 size={20} className="text-emerald-500" />}
          />
          <StatusCard
            title="Ongoing"
            count={stats.ongoing}
            color="text-amber-600 dark:text-amber-400"
            icon={<Clock size={20} className="text-amber-500" />}
          />
          <StatusCard
            title="Pending"
            count={stats.pending}
            color="text-blue-600 dark:text-blue-400"
            icon={<HelpCircle size={20} className="text-blue-500" />}
          />
          <StatusCard
            title="Blocked"
            count={stats.blocked}
            color="text-red-600 dark:text-red-400"
            icon={<AlertCircle size={20} className="text-red-500" />}
          />
        </div>

        {/* Breakdown & Listing */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Left / Center: Member Wise Breakdown Grid */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-6 shadow-sm print-card space-y-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <User size={20} className="text-blue-500" />
              <span>Team Members Breakdown</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700 text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Team Member</th>
                    <th className="pb-3 text-center font-semibold text-emerald-600 dark:text-emerald-400">Completed</th>
                    <th className="pb-3 text-center font-semibold text-amber-600 dark:text-amber-400">Ongoing</th>
                    <th className="pb-3 text-center font-semibold text-blue-600 dark:text-blue-400">Pending</th>
                    <th className="pb-3 text-center font-semibold text-red-600 dark:text-red-400">Blocked</th>
                    <th className="pb-3 text-right font-semibold">Total Entries</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-700/40">
                  {Object.entries(memberBreakdown).map(([name, data]) => (
                    <tr key={name} className="text-sm hover:bg-slate-50/50 dark:hover:bg-slate-700/10">
                      <td className="py-3 font-bold text-slate-800 dark:text-slate-200">
                        {name}
                      </td>
                      <td className="py-3 text-center font-medium text-emerald-600 dark:text-emerald-400">
                        {data.Completed || "-"}
                      </td>
                      <td className="py-3 text-center font-medium text-amber-600 dark:text-amber-400">
                        {data.Ongoing || "-"}
                      </td>
                      <td className="py-3 text-center font-medium text-blue-600 dark:text-blue-400">
                        {data.Pending || "-"}
                      </td>
                      <td className="py-3 text-center font-medium text-red-600 dark:text-red-400">
                        {data.Blocked || "-"}
                      </td>
                      <td className="py-3 text-right font-semibold text-slate-500 dark:text-slate-400">
                        {data.Total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Status Entries List for Period */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-6 shadow-sm print-card space-y-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              Period Status Feed
            </h2>

            {filteredEntries.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                No entries submitted in this range.
              </div>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                {filteredEntries.map((item) => (
                  <div 
                    key={item.id}
                    className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl space-y-2 hover:border-slate-200 dark:hover:border-slate-700/60 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                        {item.assignee || item.member}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {item.date}
                      </span>
                    </div>
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-sm line-clamp-1">
                      {item.feature || item.task}
                      {item.taskId && <span className="ml-1 text-xs text-slate-400 font-mono">[{item.taskId}]</span>}
                    </h4>
                    <div className="flex items-center justify-between pt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        (item.ticketStatus || item.status) === "Completed" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450" :
                        (item.ticketStatus || item.status) === "Ongoing" ? "bg-amber-50 text-amber-700 dark:bg-amber-955/20 dark:text-amber-400" :
                        (item.ticketStatus || item.status) === "Pending" ? "bg-blue-50 text-blue-700 dark:bg-blue-955/20 dark:text-blue-400" :
                        "bg-red-50 text-red-700 dark:bg-red-955/20 dark:text-red-400"
                      }`}>
                        {item.ticketStatus || item.status}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 italic max-w-[120px] truncate">
                        {item.notes || item.comments || "-"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </Layout>
  );
}

export default Reports;