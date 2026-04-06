const BACKEND_URL = "http://localhost:5050";

const FormField = ({ label, value }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[12px] font-semibold text-[#6B7280]">{label}</label>
    <div className="px-4 py-3 bg-[#F9FAFB] border border-[#E5E9F2] text-[14px] font-medium text-[#111827]">
      {value}
    </div>
  </div>
);

function getSpecializations(selectedUser) {
  if (!selectedUser.specialization) return ["General"];
  const parts = selectedUser.specialization.split(",");
  const trimmedParts = [];
  for (let i = 0; i < parts.length; i++) {
    const trimmed = parts[i].trim();
    if (trimmed.length > 0) {
      trimmedParts.push(trimmed);
    }
  }
  if (trimmedParts.length === 0) return ["General"];
  return trimmedParts;
}

function getExperience(selectedUser) {
  if (selectedUser.experience) return selectedUser.experience + " years";
  return "N/A";
}

function getVerificationPhotoSrc(selectedUser) {
  if (!selectedUser.verificationPhoto) return "";
  return selectedUser.verificationPhoto;
}
function handleImgError(e) {
  e.target.src = "https://via.placeholder.com/300?text=No+Document";
}

const ApplicantModal = ({ selectedUser, onClose, onAction }) => {
  if (!selectedUser) return null;

  const specializations = getSpecializations(selectedUser);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ backgroundColor: "rgba(0,0,0,0.3)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="bg-white w-full max-w-[600px] max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">

        <div className="flex items-center justify-between px-8 py-5 border-b border-[#EFEFEF] flex-shrink-0">
          <div>
            <p className="text-[13px] font-semibold text-[#9CA3AF]">Application Review</p>
            <h2 className="text-[20px] font-bold text-[#111827] leading-tight mt-0.5">
              {selectedUser.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F3F4F6] transition-all"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-6">

          <div>
            <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-4 pb-2 border-b border-[#F1F1F1]">
              Personal Information
            </p>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Full Name" value={selectedUser.name} />
              <FormField label="Email Address" value={selectedUser.email} />
              <FormField label="Phone Number" value={selectedUser.phone || "N/A"} />
              <FormField label="Years of Experience" value={getExperience(selectedUser)} />
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-4 pb-2 border-b border-[#F1F1F1]">
              Professional Details
            </p>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Qualification" value={selectedUser.qualifications || "Not provided"} />
              <FormField label="License No." value={selectedUser.licenseNo || "N/A"} />
            </div>
            <div className="mt-4 flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-[#6B7280]">Specialization</label>
              <div className="px-4 py-3 bg-[#F9FAFB] border border-[#E5E9F2] flex flex-wrap gap-2">
                {specializations.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-[12px] font-semibold text-[#2563EB] bg-[#EEF2FF] border border-[#C7D2FE]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-4 pb-2 border-b border-[#F1F1F1]">
              Statement of Purpose
            </p>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-[#6B7280]">Statement</label>
              <div className="px-4 py-3.5 bg-[#F9FAFB] border border-[#E5E9F2] text-[14px] text-[#374151] leading-relaxed min-h-[100px]">
                {selectedUser.bio || "No statement provided."}
              </div>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-4 pb-2 border-b border-[#F1F1F1]">
              Photo Verification
            </p>
            <div className="border border-[#E5E9F2] bg-[#F9FAFB] min-h-[160px] flex items-center justify-center overflow-hidden">
              {selectedUser.verificationPhoto && (
                <img
                  src={getVerificationPhotoSrc(selectedUser)}
                  alt="Verification"
                  className="w-full h-auto max-h-[300px] object-contain"
                  onError={handleImgError}
                />
              )}
              {!selectedUser.verificationPhoto && (
                <p className="text-[13px] text-[#9CA3AF]">No document uploaded</p>
              )}
            </div>
          </div>

        </div>

        <div className="px-8 py-5 border-t border-[#EFEFEF] flex gap-3 flex-shrink-0 bg-[#FAFAFA]">
          <button
            onClick={() => onAction(selectedUser._id, "Approved")}
            className="flex-1 py-3 text-[14px] font-semibold text-white bg-[#111827] hover:bg-[#1F2937] transition-colors"
          >
            Approve
          </button>
          <button
            onClick={() => onAction(selectedUser._id, "Rejected")}
            className="flex-1 py-3 text-[14px] font-semibold text-[#DC2626] bg-white border border-[#FECACA] hover:bg-[#FEF2F2] transition-colors"
          >
            Decline
          </button>
        </div>

      </div>
    </div>
  );
};

export default ApplicantModal;