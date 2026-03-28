import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { X, FileText } from "lucide-react";
import { fmtShort } from "../../utils/sessionHelper.js";
import { useStudentSessions } from "../../hooks/studentSessions/useStudentSessions";

const SummaryModal = () => {
  const { summarySession: session, setSummarySession } = useStudentSessions();
  const onClose = () => setSummarySession(null);

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

  let showLoading = false;
  if (loading) {
    showLoading = true;
  }

  let showSummary = false;
  if (!loading && summary) {
    showSummary = true;
  }

  let showNoSummary = false;
  if (!loading && !summary) {
    showNoSummary = true;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} onClick={onClose}>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      <div onClick={(e) => e.stopPropagation()} className="relative bg-white border border-[#E2E8F0] shadow-2xl w-full max-w-2xl overflow-hidden">

        <div className="px-8 pt-7 pb-5 flex items-start justify-between border-b border-[#F1F5F9]">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-blue-50 border border-[#DBEAFE] flex items-center justify-center flex-shrink-0">
              <FileText size={20} className="text-[#2563EB]" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-[#111827]">Session Summary</h2>
              <p className="text-[13px] text-[#6B7280] mt-0.5">
                {counselorName} · {fmtShort(session.date)} · {session.timeSlot}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 hover:bg-[#F1F5F9] flex items-center justify-center transition flex-shrink-0">
            <X size={15} className="text-[#6B7280]" strokeWidth={2} />
          </button>
        </div>

        <div className="px-8 py-7">
          {showLoading && (
            <div className="flex items-center justify-center gap-3 py-14">
              <div className="w-5 h-5 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
              <span className="text-[13px] text-[#94A3B8] font-medium">Loading summary…</span>
            </div>
          )}

          {showSummary && (
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] px-7 py-6">
              <p className="text-[11px] font-semibold text-[#2563EB] uppercase tracking-widest mb-4">
                Written by {counselorName}
              </p>
              <p className="text-[14px] text-[#374151] font-medium leading-relaxed whitespace-pre-wrap">
                {summary}
              </p>
            </div>
          )}

          {showNoSummary && (
            <div className="flex flex-col items-center justify-center py-14 gap-3">
              <div className="w-12 h-12 bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center">
                <FileText size={20} className="text-[#CBD5E1]" strokeWidth={1.8} />
              </div>
              <p className="text-[14px] font-semibold text-[#94A3B8]">No Summary Yet</p>
              <p className="text-[13px] text-[#94A3B8] text-center max-w-[220px]">
                The counselor hasn't written a summary for this session yet.
              </p>
            </div>
          )}
        </div>

        <div className="px-8 py-5 bg-[#F8FAFC] border-t border-[#F1F5F9] flex justify-end">
          <button onClick={onClose} className="px-7 py-2.5 text-[13px] font-semibold text-white bg-[#2563EB] hover:bg-blue-700 transition">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryModal;