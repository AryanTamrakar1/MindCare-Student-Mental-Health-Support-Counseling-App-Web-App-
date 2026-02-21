const CounselorHeader = ({ counselor, liveStatus, onRequestSession }) => {
  const getStatusColor = () => {
    if (liveStatus.status === "Yellow") return "text-amber-600";
    if (liveStatus.status === "Red") return "text-rose-600";
    return "text-emerald-600";
  };

  return (
    <div className="flex justify-between items-center p-8 px-10 border-b border-gray-100 bg-white">
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 border border-indigo-100 overflow-hidden bg-indigo-50">
          {counselor.verificationPhoto ? (
            <img
              src={`http://127.0.0.1:5050/uploads/verifications/${counselor.verificationPhoto}`}
              alt={counselor.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentElement.innerHTML = `<span class="text-indigo-600 font-bold text-2xl">${counselor.name?.charAt(0)}</span>`;
              }}
            />
          ) : (
            <span className="text-indigo-600 font-bold text-3xl">
              {counselor.name?.charAt(0)}
            </span>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 leading-tight">
            {counselor.name}
          </h1>
          <p className="text-gray-500 font-bold text-sm">
            {counselor.profTitle || "Professional Counselor"}
          </p>
          <span
            className={`${getStatusColor()} text-[10px] font-black uppercase tracking-widest mt-1.5 block`}
          >
            ● {liveStatus.label}
          </span>
        </div>
      </div>
      <button
        onClick={onRequestSession}
        className="bg-indigo-600 text-white px-12 py-4 rounded-2xl text-xs font-black shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
      >
        Request Session
      </button>
    </div>
  );
};

export default CounselorHeader;
