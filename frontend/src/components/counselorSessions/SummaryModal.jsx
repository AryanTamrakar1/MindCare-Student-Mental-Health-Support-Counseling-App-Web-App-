import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { PenLine, X, CheckCircle, FileText } from "lucide-react";
import { fmtShort } from "../../utils/counselorSession/sessionhelper";

const SummaryModal = ({ session, onClose, onSaved }) => {
  const [text, setText] = useState("");
  const [existing, setExisting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!session) return;
    const fetchExisting = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.get(`/sessions/summary/${session._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const s = res.data.summary ? res.data.summary : "";
        setExisting(s);
        setText(s);
      } catch {
        setExisting(null);
        setText("");
      } finally {
        setLoading(false);
      }
    };
    fetchExisting();
  }, [session]);

  const handleSave = async () => {
    if (!text.trim()) return;
    setSaving(true);
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        "/sessions/summary",
        { appointmentId: session._id, summary: text.trim() },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setSaved(true);
      setExisting(text.trim());
      if (onSaved) {
        onSaved(session._id, text.trim());
      }
      setTimeout(() => setSaved(false), 2500);
    } catch {
      alert("Could not save summary.");
    } finally {
      setSaving(false);
    }
  };

  if (!session) return null;

  let studentName = "Student";
  if (session.studentId && session.studentId.name) {
    studentName = session.studentId.name;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden"
      >
        <div className="px-8 pt-7 pb-6 flex items-start justify-between border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <PenLine size={26} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900">
                {existing ? "Edit Summary" : "Write Summary"}
              </h2>
              <p className="text-sm text-gray-400 font-medium mt-0.5">
                {studentName} · {fmtShort(session.date)} · {session.timeSlot}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <X size={16} className="text-gray-600" />
          </button>
        </div>

        <div className="px-8 py-8">
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-16">
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-400 font-medium">Loading…</span>
            </div>
          ) : (
            <>
              <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-4">
                {existing ? "Summary of the session for the student" : "Write notes to help the student"}
              </p>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={14}
                placeholder="Write your session notes here..."
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-5 text-sm text-gray-700 font-medium leading-relaxed resize-y min-h-[260px] focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all placeholder:text-gray-300"
              />
              <p className="text-[10px] text-gray-400 font-medium mt-2 text-right">
                {text.length} characters
              </p>
            </>
          )}
        </div>

        <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex items-center gap-3">
          {saved ? (
            <div className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-50 border border-emerald-100">
              <CheckCircle size={15} className="text-emerald-600" />
              <span className="text-emerald-700 font-black text-sm uppercase">Summary Saved!</span>
            </div>
          ) : (
            <button
              onClick={handleSave}
              disabled={!text.trim() || saving}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-all
                ${text.trim() && !saving ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <FileText size={15} />
                  {existing ? "Update Summary" : "Save Summary"}
                </>
              )}
            </button>
          )}
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 uppercase tracking-wider transition-colors shadow-sm flex-shrink-0"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryModal;