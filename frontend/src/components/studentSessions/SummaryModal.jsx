import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { X, FileText } from "lucide-react";
import { fmtShort } from "../../utils/studentSessions/sessionhelper";

const SummaryModal = ({ session, onClose }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    const fetchSummary = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.get(`/sessions/summary/${session._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.summary) {
          setSummary(res.data.summary);
        } else {
          setSummary(null);
        }
      } catch {
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [session]);

  if (!session) return null;

  let counselorName = "Counselor";
  if (session.counselorId && session.counselorId.name) {
    counselorName = session.counselorId.name;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden"
      >
        <div className="px-8 pt-7 pb-6 flex items-start justify-between border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <FileText size={26} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900">
                Session Summary
              </h2>
              <p className="text-sm text-gray-400 font-medium mt-0.5">
                {counselorName} · {fmtShort(session.date)} · {session.timeSlot}
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
              <span className="text-sm text-gray-400 font-medium">
                Loading summary…
              </span>
            </div>
          ) : summary ? (
            <div className="bg-gray-50 rounded-2xl px-8 py-7 border border-gray-100">
              <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-4">
                Session Summary Written by {counselorName}
              </p>
              <p className="text-sm text-gray-700 font-medium leading-relaxed whitespace-pre-wrap text-justify">
                {summary}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center">
                <FileText size={24} className="text-gray-300" />
              </div>
              <p className="text-sm font-black text-gray-400">No Summary Yet</p>
              <p className="text-xs text-gray-400 text-center max-w-[200px]">
                The counselor hasn't written a summary for this session yet.
              </p>
            </div>
          )}
        </div>

        <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 uppercase tracking-wider transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryModal;