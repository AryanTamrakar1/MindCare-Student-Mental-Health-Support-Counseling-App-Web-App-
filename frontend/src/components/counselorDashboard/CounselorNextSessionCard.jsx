import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarClock, Clock, ArrowRight } from "lucide-react";
import API from "../../api/axios";

const CounselorNextSessionCard = () => {
  const [nextSession, setNextSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await API.get("/appointments/my-sessions", {
          headers: { Authorization: "Bearer " + token },
        });
        const sessions = res.data;
        let upcoming = null;
        for (let i = 0; i < sessions.length; i++) {
          if (sessions[i].status === "Approved") {
            upcoming = sessions[i];
            break;
          }
        }
        setNextSession(upcoming);
      } catch (err) {}
      setLoading(false);
    };
    fetchSessions();
  }, []);

  function handleClick() {
    navigate("/counselor-sessions");
  }

  let studentName = "None";
  if (nextSession && nextSession.studentId && nextSession.studentId.name) {
    studentName = nextSession.studentId.name;
  }

  let displayValue = "—";
  if (!loading) {
    displayValue = studentName;
  }

  let subtitleText = "Your schedule is clear";
  if (!loading && nextSession) {
    subtitleText = "Upcoming approved session";
  }

  let buttonText = "View Sessions";
  if (!loading && nextSession) {
    buttonText = "View Session";
  }

  const hasSession = !loading && nextSession !== null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md hover:border-slate-300 transition-all duration-200">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
          <CalendarClock size={18} className="text-indigo-600" />
        </div>
        <div>
          <p className="text-[11px] font-semibold tracking-widest uppercase text-slate-400">
            Next Session
          </p>
          <p className="text-3xl font-black tracking-tight leading-tight text-indigo-600">
            {displayValue}
          </p>
        </div>
      </div>

      {hasSession && (
        <div className="flex gap-2 mb-5">
          <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
            <CalendarClock size={12} className="text-indigo-500 shrink-0" />
            <span className="text-xs font-semibold text-slate-600 truncate">
              {nextSession.date}
            </span>
          </div>
          <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
            <Clock size={12} className="text-indigo-500 shrink-0" />
            <span className="text-xs font-semibold text-slate-600 truncate">
              {nextSession.timeSlot}
            </span>
          </div>
        </div>
      )}

      <p className="text-xs text-slate-400 font-medium border-t border-slate-100 pt-4 mb-5">
        {subtitleText}
      </p>

      {!loading && (
        <button
          onClick={handleClick}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-colors duration-150 flex items-center justify-center gap-2"
        >
          {buttonText} <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
};

export default CounselorNextSessionCard;
