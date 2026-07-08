import Layout from "../components/layout/layout";
import StatusCard from "../components/StatusCard";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getEntries, getSettings } from "../services/storageService";
import { exportToExcel } from "../utils/excelExport";
import {
  PlusCircle,
  Download,
  AlertCircle,
  CheckCircle2,
  Clock,
  HelpCircle,
  FileText,
  Calendar
} from "lucide-react";

// SVG Doughnut Chart Component
const StatDoughnutChart = ({ completed, ongoing, pending, blocked }) => {
  const total = completed + ongoing + pending + blocked;
  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48">
        <svg width="120" height="120" viewBox="0 0 36 36" className="text-slate-200 dark:text-slate-700 animate-pulse">
          <circle cx="18" cy="18" r="15.915" fill="none" stroke="currentColor" strokeWidth="3.5" />
        </svg>
        <span className="text-slate-400 dark:text-slate-500 text-sm mt-4 font-medium">No status entries yet</span>
      </div>
    );
  }

  const pCompleted = (completed / total) * 100;
  const pOngoing = (ongoing / total) * 100;
  const pPending = (pending / total) * 100;
  const pBlocked = (blocked / total) * 100;

  const offsetCompleted = 0;
  const offsetOngoing = pCompleted;
  const offsetPending = pCompleted + pOngoing;
  const offsetBlocked = pCompleted + pOngoing + pPending;

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="relative">
        <svg width="160" height="160" viewBox="0 0 36 36" className="transform -rotate-90">
          {/* Base Background */}
          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" className="dark:stroke-slate-700" strokeWidth="3.5" />
          
          {/* Completed (Green) */}
          {pCompleted > 0 && (
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="none"
              stroke="#10b981"
              strokeWidth="3.6"
              strokeDasharray={`${pCompleted} ${100 - pCompleted}`}
              strokeDashoffset={-offsetCompleted}
              className="transition-all duration-500"
            />
          )}

          {/* Ongoing (Orange) */}
          {pOngoing > 0 && (
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="3.6"
              strokeDasharray={`${pOngoing} ${100 - pOngoing}`}
              strokeDashoffset={-offsetOngoing}
              className="transition-all duration-500"
            />
          )}

          {/* Pending (Blue) */}
          {pPending > 0 && (
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3.6"
              strokeDasharray={`${pPending} ${100 - pPending}`}
              strokeDashoffset={-offsetPending}
              className="transition-all duration-500"
            />
          )}

          {/* Blocked (Red) */}
          {pBlocked > 0 && (
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="none"
              stroke="#ef4444"
              strokeWidth="3.6"
              strokeDasharray={`${pBlocked} ${100 - pBlocked}`}
              strokeDashoffset={-offsetBlocked}
              className="transition-all duration-500"
            />
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-slate-800 dark:text-white">{total}</span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">Total</span>
        </div>
      </div>
    </div>
  );
};

function Dashboard() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [settings, setSettings] = useState({});
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const data = getEntries();
    const config = getSettings();
    const hour = new Date().getHours();
    let greet = "Hello";
    if (hour < 12) greet = "Good Morning";
    else if (hour < 17) greet = "Good Afternoon";
    else greet = "Good Evening";

    Promise.resolve().then(() => {
      setEntries(data);
      setSettings(config);
      setGreeting(greet);
    });
  }, []);

  const stats = {
    completed: entries.filter((e) => e.status === "Completed").length,
    ongoing: entries.filter((e) => e.status === "Ongoing").length,
    pending: entries.filter((e) => e.status === "Pending").length,
    blocked: entries.filter((e) => e.status === "Blocked").length,
    total: entries.length,
  };

  const handleExport = () => {
    exportToExcel(entries);
  };

  // Get last 5 entries
  const recentActivities = [...entries]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  return (
    <Layout>
      <div className="animate-fade-in space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {greeting}, Sakthi 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Welcome back to <span className="font-semibold text-blue-600 dark:text-blue-400">{settings.companyName || "JSDT"} Status Tracker</span>. Here is the team's summary for today.
            </p>
          </div>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 shadow-sm px-4 py-2 rounded-xl text-sm font-medium self-start md:self-auto">
            <Calendar size={16} />
            <span>{new Date().toLocaleDateString("en-GB", { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
          <StatusCard
            title="Total Entries"
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

        {/* Action Panel & Visual Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Left / Center: Recent Activities & SVG Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                Recent Status Updates
              </h2>
              <button 
                onClick={() => navigate("/history")} 
                className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                View all &rarr;
              </button>
            </div>

            {recentActivities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                <p className="text-slate-400 text-sm">No entries submitted today.</p>
                <button 
                  onClick={() => navigate("/daily-status")}
                  className="mt-4 text-sm bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-bold px-4 py-2 rounded-lg"
                >
                  Create First Entry
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-700 text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                      <th className="pb-3 font-semibold">Member</th>
                      <th className="pb-3 font-semibold">Task</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-700/40">
                    {recentActivities.map((item) => (
                      <tr key={item.id} className="text-sm hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                        <td className="py-3.5 font-semibold text-slate-800 dark:text-slate-200">
                          {item.member}
                        </td>
                        <td className="py-3.5 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                          {item.task}
                        </td>
                        <td className="py-3.5">
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
                        <td className="py-3.5 text-right text-slate-400 dark:text-slate-500 text-xs">
                          {item.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right Column: Chart Breakdown & Quick Actions */}
          <div className="space-y-6">
            
            {/* Status Chart Card */}
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl shadow-sm p-6 flex flex-col justify-between">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
                Status Distribution
              </h2>
              <StatDoughnutChart 
                completed={stats.completed} 
                ongoing={stats.ongoing} 
                pending={stats.pending} 
                blocked={stats.blocked} 
              />
              
              {stats.total > 0 && (
                <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span>Completed ({Math.round((stats.completed / stats.total) * 100)}%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span>Ongoing ({Math.round((stats.ongoing / stats.total) * 100)}%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span>Pending ({Math.round((stats.pending / stats.total) * 100)}%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span>Blocked ({Math.round((stats.blocked / stats.total) * 100)}%)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-32 h-32 bg-blue-600 rounded-full opacity-20 blur-xl"></div>
              
              <h3 className="font-extrabold text-xl mb-2">Quick Actions</h3>
              <p className="text-slate-400 text-sm mb-6">Manage tracking entries and compile export files with speed.</p>
              
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/daily-status")}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition duration-200 shadow-lg shadow-blue-500/20 cursor-pointer"
                >
                  <PlusCircle size={18} />
                  <span>Add Daily Status</span>
                </button>
                
                <button
                  onClick={handleExport}
                  disabled={entries.length === 0}
                  className="w-full bg-white/10 hover:bg-white/15 text-white disabled:opacity-40 disabled:hover:bg-white/10 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition duration-200 cursor-pointer"
                >
                  <Download size={18} />
                  <span>Export Excel File</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </Layout>
  );
}

export default Dashboard;