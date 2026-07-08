function Input({
  label,
  ...props
}) {
  return (
    <div className="space-y-2">
      <label className="font-medium">
        {label}
      </label>

      <input
        {...props}
        className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export default Input;