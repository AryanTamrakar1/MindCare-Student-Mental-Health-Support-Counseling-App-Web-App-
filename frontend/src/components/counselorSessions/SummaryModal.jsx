import React from "react";
import { PenLine, X, CheckCircle, FileText } from "lucide-react";
import { fmtShort } from "../../utils/sessionHelper.js";
import { SummaryModalProvider } from "../../context/counselorSessions/SummaryModalContext";
import { useSummaryModal } from "../../hooks/counselorSessions/useSummaryModal";

const SummaryModalInner = ({ session, onClose }) => {
  const {
    text,
    existing,
    loading,
    saving,
    saved,
    handleSave,
    handleTextChange,
  } = useSummaryModal();

  if (!session) return null;

  let studentName = "Student";
  if (session.studentId && session.studentId.name) {
    studentName = session.studentId.name;
  }

  let modalTitle = "Write Summary";
  if (existing) modalTitle = "Edit Summary";

  let textareaLabel = "Write notes to help the student";
  if (existing) textareaLabel = "Summary of the session for the student";

  let saveButtonLabel = "Save Summary";
  if (existing) saveButtonLabel = "Update Summary";

  let saveButtonClass = "bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed border-[#E5E7EB]";
  if (text.trim() && !saving) saveButtonClass = "bg-[#2563EB] text-white hover:bg-blue-700 border-[#2563EB] shadow-md shadow-blue-200";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white shadow-2xl w-full max-w-4xl overflow-hidden border border-[#E2E8F0]"
      >

        <div className="px-8 pt-7 pb-6 flex items-start justify-between border-b border-[#E2E8F0]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 border border-[#DBEAFE] flex items-center justify-center flex-shrink-0">
              <PenLine size={26} className="text-[#2563EB]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#111827]">
                {modalTitle}
              </h2>
              <p className="text-sm text-[#6B7280] font-medium mt-0.5">
                {studentName} · {fmtShort(session.date)} · {session.timeSlot}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center transition-colors flex-shrink-0 border border-[#E5E7EB]"
          >
            <X size={16} className="text-[#6B7280]" />
          </button>
        </div>

        <div className="px-8 py-8">
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-16">
              <div className="w-6 h-6 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-[#6B7280] font-medium">Loading…</span>
            </div>
          ) : (
            <>
              <p className="text-[9px] font-black text-[#2563EB] uppercase tracking-widest mb-4">
                {textareaLabel}
              </p>
              <textarea
                value={text}
                onChange={handleTextChange}
                placeholder="Write your session notes here..."
                style={{ height: "500px" }}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] px-6 py-5 text-sm text-[#374151] font-medium leading-relaxed resize-none overflow-y-auto max-h-[600px] focus:outline-none focus:bg-white transition-all placeholder:text-[#9CA3AF] text-justify"
              />
              <p className="text-[10px] text-[#9CA3AF] font-medium mt-2 text-right">
                {text.length} characters
              </p>
            </>
          )}
        </div>

        <div className="px-8 py-5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center gap-3">
          {saved ? (
            <div className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-50 border border-emerald-200">
              <CheckCircle size={15} className="text-emerald-600" />
              <span className="text-emerald-700 font-black text-sm uppercase">
                Summary Saved!
              </span>
            </div>
          ) : (
            <button
              onClick={handleSave}
              disabled={!text.trim() || saving}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-black uppercase tracking-wider transition-all border ${saveButtonClass}`}
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <FileText size={15} />
                  {saveButtonLabel}
                </>
              )}
            </button>
          )}
          <button
            onClick={onClose}
            className="px-6 py-3 text-xs font-black text-white bg-[#2563EB] hover:bg-blue-700 uppercase tracking-wider transition-colors shadow-sm flex-shrink-0 border border-[#2563EB]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const SummaryModal = ({ session, onClose, onSaved }) => {
  return (
    <SummaryModalProvider session={session} onClose={onClose} onSaved={onSaved}>
      <SummaryModalInner session={session} onClose={onClose} />
    </SummaryModalProvider>
  );
};

export default SummaryModal;