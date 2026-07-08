function TextArea({ label, rows = 4, ...props }) {
  return (
    <div className="space-y-2">
      <label className="font-medium text-gray-700">
        {label}
      </label>

      <textarea
        rows={rows}
        {...props}
        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
      />
    </div>
  );
}

export default TextArea;