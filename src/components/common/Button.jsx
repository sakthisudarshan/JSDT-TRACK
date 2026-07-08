function Button({ children, onClick, color = "bg-blue-600" }) {
  return (
    <button
      onClick={onClick}
      className={`${color} text-white px-5 py-3 rounded-lg hover:opacity-90 transition`}
    >
      {children}
    </button>
  );
}

export default Button;