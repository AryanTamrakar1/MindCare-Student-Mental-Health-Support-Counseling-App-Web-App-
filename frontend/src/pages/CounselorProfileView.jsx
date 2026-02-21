import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import StudentSidebar from "../components/Sidebars/StudentSidebar";
import Navbar from "../components/Navbar";
import CounselorHeader from "../components/counselorProfileView/CounselorHeader";
import CounselorStats from "../components/counselorProfileView/CounselorStats";
import CounselorInfo from "../components/counselorProfileView/CounselorInfo";
import BookingModal from "../components/counselorProfileView/BookingModal";

const CounselorProfileView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [counselor, setCounselor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [liveStatus, setLiveStatus] = useState({
    status: "Green",
    label: "Available",
  });
  const [counselorStats, setCounselorStats] = useState({
    overall: 0,
    studentsHelped: 0,
    totalRatings: 0,
  });
  const [availableSlotsForDate, setAvailableSlotsForDate] = useState([]);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTimeSlot, setBookingTimeSlot] = useState("");
  const [bookingReason, setBookingReason] = useState("");
  const [bookingTopics, setBookingTopics] = useState([]);

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const interval = setInterval(() => loadLiveStatus(id), 60000);
    return () => clearInterval(interval);
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");

      const userRes = await axios.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userRes.data);

      const counselorRes = await axios.get("/auth/counselors");
      const found = counselorRes.data.find((c) => c._id === id);
      setCounselor(found);

      let overall = 0;
      let totalRatings = 0;
      let studentsHelped = 0;

      try {
        const ratingRes = await axios.get(`/ratings/counselor/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        overall = ratingRes.data.overall || 0;
        totalRatings = ratingRes.data.totalRatings || 0;
      } catch {}

      try {
        const countRes = await axios.get(
          `/appointments/completed-count/${id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        studentsHelped = countRes.data.count || 0;
      } catch {}

      setCounselorStats({ overall, totalRatings, studentsHelped });
      loadLiveStatus(id);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const loadLiveStatus = async (counselorId) => {
    try {
      const res = await axios.get(`/appointments/live-status/${counselorId}`);
      setLiveStatus(res.data);
    } catch {}
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const day = d.getDate().toString().padStart(2, "0");
    const month = d.toLocaleString("en-GB", { month: "short" });
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toLocaleDateString("en-CA");
  };

  const handleDateChange = async (e) => {
    const selectedDate = e.target.value;
    if (!selectedDate) {
      setBookingDate("");
      setBookingTimeSlot("");
      setAvailableSlotsForDate([]);
      return;
    }

    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayName = dayNames[new Date(selectedDate).getUTCDay()];

    if (dayName === "Saturday" || dayName === "Sunday") {
      alert("Counselors are not available on weekends. Please pick Mon-Fri.");
      setBookingDate("");
      setBookingTimeSlot("");
      setAvailableSlotsForDate([]);
      return;
    }

    const slotsForDay = (counselor.availability || []).filter(
      (slot) => slot.day === dayName,
    );

    if (slotsForDay.length === 0) {
      alert("The counselor has no sessions set for this day.");
      setBookingDate(selectedDate);
      setBookingTimeSlot("");
      setAvailableSlotsForDate([]);
      return;
    }

    setAvailableSlotsForDate(slotsForDay);
    setBookingDate(selectedDate);
    setBookingTimeSlot("");

    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.get(
        `/appointments/check-availability?counselorId=${id}&date=${formatDate(selectedDate)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setBookedSlots(res.data);
    } catch {
      setBookedSlots([]);
    }
  };

  const handleTopicToggle = (topic) => {
    if (bookingTopics.includes(topic)) {
      setBookingTopics(bookingTopics.filter((t) => t !== topic));
    } else {
      setBookingTopics([...bookingTopics, topic]);
    }
  };

  const isPastTimeSlot = (slotTime) => {
    const today = new Date();
    const todayStr = today.toLocaleDateString("en-CA");
    if (bookingDate !== todayStr) return false;

    const [timeStr, ampm] = slotTime.split(" - ")[0].split(" ");
    let [hour, min] = timeStr.split(":").map(Number);
    if (ampm === "PM" && hour !== 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;

    const slotDate = new Date();
    slotDate.setHours(hour, min, 0, 0);
    return today > slotDate;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!bookingTimeSlot) return alert("Please select a time slot.");
    if (bookingTopics.length === 0)
      return alert("Please select at least one topic.");

    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.post(
        "/appointments/request",
        {
          counselorId: id,
          date: formatDate(bookingDate),
          timeSlot: bookingTimeSlot,
          reason: `[${bookingTopics.join(", ")}] ${bookingReason}`,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert(res.data.message);
      setIsModalOpen(false);
      setBookingDate("");
      setBookingTimeSlot("");
      setBookingReason("");
      setBookingTopics([]);
      loadLiveStatus(id);
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  const handleReasonChange = (e) => {
    setBookingReason(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const buildScheduleMap = () => {
    const map = {};
    (counselor.availability || []).forEach((slot) => {
      if (!map[slot.day]) map[slot.day] = [];
      map[slot.day].push(slot.timeSlot);
    });
    return map;
  };

  const getTopics = () =>
    counselor.specialization
      ? counselor.specialization
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

  const getQualifications = () =>
    counselor.qualifications
      ? counselor.qualifications
          .split(",")
          .map((q) => q.trim())
          .filter(Boolean)
      : [];

  if (loading || !counselor) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex">
        <StudentSidebar user={user} />
        <main className="flex-1 ml-[280px] p-6 flex items-center justify-center">
          {loading ? (
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-indigo-600 font-black text-xs uppercase tracking-widest">
                Loading Profile...
              </p>
            </div>
          ) : (
            <div className="p-10 text-center font-bold">
              Counselor not found.
            </div>
          )}
        </main>
      </div>
    );
  }

  const scheduleMap = buildScheduleMap();
  const topics = getTopics();
  const qualifications = getQualifications();

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <StudentSidebar user={user} />
      <main className="flex-1 ml-[280px] p-10 overflow-x-hidden">
        <div className="w-full mx-auto">
          <div className="flex justify-between items-center mb-8">
            <button
              className="text-indigo-600 font-black text-xs uppercase flex items-center gap-1.5 hover:opacity-70 transition-all"
              onClick={() => navigate(-1)}
            >
              <span className="text-base">←</span> Back to Directory
            </button>
            <Navbar />
          </div>

          <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm w-full">
            <CounselorHeader
              counselor={counselor}
              liveStatus={liveStatus}
              onRequestSession={() => setIsModalOpen(true)}
            />

            <CounselorStats
              counselor={counselor}
              counselorStats={counselorStats}
            />

            <CounselorInfo
              counselor={counselor}
              scheduleMap={scheduleMap}
              topics={topics}
              qualifications={qualifications}
            />
          </div>
        </div>
      </main>

      {isModalOpen && (
        <BookingModal
          counselor={counselor}
          topics={topics}
          bookingTopics={bookingTopics}
          handleTopicToggle={handleTopicToggle}
          bookingDate={bookingDate}
          handleDateChange={handleDateChange}
          getTomorrowDate={getTomorrowDate}
          availableSlotsForDate={availableSlotsForDate}
          bookedSlots={bookedSlots}
          isPastTimeSlot={isPastTimeSlot}
          bookingTimeSlot={bookingTimeSlot}
          setBookingTimeSlot={setBookingTimeSlot}
          bookingReason={bookingReason}
          handleReasonChange={handleReasonChange}
          handleBooking={handleBooking}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default CounselorProfileView;
