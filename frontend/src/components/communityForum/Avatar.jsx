const Avatar = ({ role, photo, name }) => {
  if (role === "Counselor" && photo) {
    return (
      <img
        src={`http://127.0.0.1:5050/uploads/verifications/${photo}`}
        alt={name}
        className="w-8 h-8 rounded-full border-2 border-indigo-200 object-cover flex-shrink-0"
      />
    );
  }
  if (role === "Counselor") {
    return (
      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
        <span className="text-indigo-600 font-black text-sm">
          {name?.charAt(0) || "C"}
        </span>
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
      <svg
        className="w-4 h-4 text-gray-400"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
      </svg>
    </div>
  );
};

export default Avatar;
