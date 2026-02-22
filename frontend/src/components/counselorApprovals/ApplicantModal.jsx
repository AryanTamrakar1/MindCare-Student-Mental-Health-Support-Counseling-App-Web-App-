const BACKEND_URL = "http://localhost:5050";

const ApplicantModal = ({ selectedUser, onClose, onAction }) => {
  if (!selectedUser) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] max-w-2xl w-full my-8 shadow-2xl relative overflow-y-auto max-h-[90vh]">
        <div className="p-10">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-black">
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900">
                  {selectedUser.name}
                </h2>
                <p className="text-gray-500 font-medium">
                  {selectedUser.email}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition text-2xl"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">
                Qualification
              </p>
              <p className="font-bold text-gray-800">
                {selectedUser.qualifications || "Not Provided"}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">
                License No.
              </p>
              <p className="font-bold text-gray-800">
                {selectedUser.licenseNo || "N/A"}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">
                Phone
              </p>
              <p className="font-bold text-gray-800">
                {selectedUser.phone || "N/A"}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">
                Experience
              </p>
              <p className="font-bold text-gray-800">
                {selectedUser.experience
                  ? `${selectedUser.experience} Years`
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2">
              Specialization
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-bold border border-indigo-100">
                {selectedUser.specialization || "General"}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-3">
              Verification Document
            </p>
            <div className="rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 min-h-[200px] flex items-center justify-center">
              {selectedUser.verificationPhoto ? (
                <img
                  src={`${BACKEND_URL}/${selectedUser.verificationPhoto}`}
                  alt="Verification"
                  className="w-full h-auto max-h-[400px] object-contain"
                  onError={(e) => {
                    if (
                      !selectedUser.verificationPhoto.includes("verifications")
                    ) {
                      e.target.src = `${BACKEND_URL}/uploads/verifications/${selectedUser.verificationPhoto}`;
                    }
                  }}
                />
              ) : (
                <p className="text-gray-400 italic">No Photo Uploaded</p>
              )}
            </div>
          </div>

          <div className="mb-10">
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2">
              Statement of Purpose
            </p>
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
              <p className="text-sm text-gray-600 leading-relaxed italic whitespace-pre-wrap text-justify">
                "{selectedUser.bio || "No statement provided."}"
              </p>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-50">
            <button
              onClick={() => onAction(selectedUser._id, "Approved")}
              className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition active:scale-95 shadow-lg shadow-emerald-100"
            >
              Approve Professional
            </button>
            <button
              onClick={() => onAction(selectedUser._id, "Rejected")}
              className="flex-1 bg-white text-rose-500 border-2 border-rose-100 py-4 rounded-2xl font-bold hover:bg-rose-50 transition active:scale-95"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantModal;