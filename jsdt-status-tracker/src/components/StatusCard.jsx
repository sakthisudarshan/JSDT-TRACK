function StatusCard({ title, count, color, icon }) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl shadow-sm p-6 flex items-center justify-between hover:shadow-md transition-all duration-300">
      <div>
        <h3 className="text-slate-400 dark:text-slate-500 text-xs uppercase tracking-wider font-semibold">{title}</h3>
        <h1 className={`text-3xl font-extrabold mt-2 tracking-tight ${color}`}>
          {count}
        </h1>
      </div>
      {icon && (
        <div className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl">
          {icon}
        </div>
      )}
    </div>
  );
}

export default StatusCard;
