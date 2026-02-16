import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import StudentSidebar from "../components/StudentSidebar";
import Navbar from "../components/Navbar";

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
  const [bookingData, setBookingData] = useState({
    reason: "",
    date: "",
    timeSlot: "",
    topic: [],
  });
  const [availableSlotsForDate, setAvailableSlotsForDate] = useState([]);

  const timeSlots = [
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 01:00 PM",
    "01:00 PM - 02:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM",
  ];

  useEffect(() => {
    fetchCounselorData();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const interval = setInterval(() => {
      fetchLiveStatus(id);
    }, 60000);
    return () => clearInterval(interval);
  }, [id]);

  const formatDateForBackend = (dateString) => {
    const dateObj = new Date(dateString);
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = dateObj.toLocaleString("en-GB", { month: "short" });
    const year = dateObj.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const fetchCounselorData = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");

      if (!user && token) {
        const userRes = await axios.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);
      }

      const response = await axios.get("/auth/counselors");
      const foundCounselor = response.data.find((c) => c._id === id);

      setCounselor(foundCounselor);
      fetchLiveStatus(id);
      setLoading(false);
    } catch (error) {
      console.error("Error loading counselor profile", error);
      setLoading(false);
    }
  };

  const fetchLiveStatus = async (counselorId) => {
    try {
      const res = await axios.get(`/appointments/live-status/${counselorId}`);
      setLiveStatus(res.data);
    } catch (err) {
      console.error("Status error", err);
    }
  };

  const checkTakenSlots = async (selectedDate) => {
    try {
      const token = sessionStorage.getItem("token");
      const formattedDate = formatDateForBackend(selectedDate);

      const response = await axios.get(
        `/appointments/check-availability?counselorId=${id}&date=${formattedDate}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setBookedSlots(response.data);
    } catch (error) {
      console.error("Error checking taken slots:", error);
      setBookedSlots([]);
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    if (!selectedDate) {
      setBookingData({ ...bookingData, date: "", timeSlot: "" });
      setAvailableSlotsForDate([]);
      return;
    }

    const dateObj = new Date(selectedDate);
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayName = dayNames[dateObj.getUTCDay()];

    if (dayName === "Saturday" || dayName === "Sunday") {
      alert("Counselors are not available on weekends. Please pick Mon-Fri.");
      setBookingData({ ...bookingData, date: "", timeSlot: "" });
      setAvailableSlotsForDate([]);
      return;
    }

    const counselorSlots = (counselor.availability || []).filter(
      (slot) => slot.day === dayName,
    );

    if (counselorSlots.length === 0) {
      alert("The counselor has no sessions set for this day.");
      setBookingData({ ...bookingData, date: selectedDate, timeSlot: "" });
      setAvailableSlotsForDate([]);
      return;
    }

    setAvailableSlotsForDate(counselorSlots);
    setBookingData({ ...bookingData, date: selectedDate, timeSlot: "" });
    checkTakenSlots(selectedDate);
  };

  const handleTopicToggle = (topicName) => {
    const currentTopics = [...bookingData.topic];

    if (currentTopics.includes(topicName)) {
      const filtered = currentTopics.filter((t) => t !== topicName);
      setBookingData({ ...bookingData, topic: filtered });
    } else {
      currentTopics.push(topicName);
      setBookingData({ ...bookingData, topic: currentTopics });
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!bookingData.timeSlot) {
      alert("Please select a time slot.");
      return;
    }
    if (bookingData.topic.length === 0) {
      alert("Please select at least one topic.");
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      const topicString = bookingData.topic.join(", ");
      const formattedDate = formatDateForBackend(bookingData.date);

      const response = await axios.post(
        "/appointments/request",
        {
          counselorId: id,
          date: formattedDate,
          timeSlot: bookingData.timeSlot,
          reason: `[${topicString}] ${bookingData.reason}`,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      alert(response.data.message);
      setIsModalOpen(false);
      setBookingData({ reason: "", date: "", timeSlot: "", topic: [] });
      fetchLiveStatus(id);
    } catch (error) {
      alert(error.response?.data?.message || "Booking failed");
    }
  };

  const isPastTimeSlot = (slotTime) => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    if (bookingData.date !== todayStr) return false;

    const startTimePart = slotTime.split(" - ")[0];
    const [timeStr, ampm] = startTimePart.split(" ");
    const [hourStr, minStr] = timeStr.split(":");
    let hour = parseInt(hourStr);
    const min = parseInt(minStr);
    if (ampm === "PM" && hour !== 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;

    const slotDate = new Date();
    slotDate.setHours(hour, min, 0, 0);

    return today > slotDate;
  };

  const getStatusColor = () => {
    if (liveStatus.status === "Yellow") return "text-amber-600";
    if (liveStatus.status === "Red") return "text-rose-600";
    return "text-emerald-600";
  };

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

  const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const groupedAvailability = {};

  (counselor.availability || []).forEach((slot) => {
    if (!groupedAvailability[slot.day]) {
      groupedAvailability[slot.day] = [];
    }
    groupedAvailability[slot.day].push(slot.timeSlot);
  });

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
                onClick={() => setIsModalOpen(true)}
                className="bg-indigo-600 text-white px-12 py-4 rounded-2xl text-xs font-black shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
              >
                Request Session
              </button>
            </div>

            <div className="grid grid-cols-3 border-b border-gray-100 bg-[#f8fafc]">
              <div className="flex flex-col items-center justify-center py-8 border-r-2 border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎓</span>
                  <span className="text-xl font-black text-gray-800">
                    {counselor.experience || 0}+ Yrs
                  </span>
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">
                  Experience
                </p>
              </div>
              <div className="flex flex-col items-center justify-center py-8 border-r-2 border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🤝</span>
                  <span className="text-xl font-black text-gray-800">
                    {counselor.studentsHelped || 0}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">
                  Students Helped
                </p>
              </div>
              <div className="flex flex-col items-center justify-center py-8">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <span className="text-xl font-black text-gray-800">
                    {counselor.rating ? counselor.rating.toFixed(1) : "0.0"}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">
                  Rating
                </p>
              </div>
            </div>

            <div className="p-10 px-12 space-y-10">
              <div>
                <h4 className="text-[11px] font-black text-indigo-600 uppercase mb-4 tracking-[0.2em]">
                  About Counselor
                </h4>
                <div className="bg-slate-50 p-7 rounded-3xl border border-slate-100 shadow-inner">
                  <p className="text-slate-600 text-base leading-relaxed font-medium">
                    {counselor.bio || "No biography provided."}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-20">
                <div>
                  <h4 className="text-[11px] font-black text-indigo-600 uppercase mb-4 tracking-[0.2em]">
                    Specialization
                  </h4>
                  <div className="flex flex-wrap gap-2.5">
                    {(counselor.specialization || "").split(",").map(
                      (s, i) =>
                        s.trim() && (
                          <span
                            key={i}
                            className="bg-indigo-50 text-indigo-700 px-5 py-2.5 rounded-xl text-xs font-bold border border-indigo-100"
                          >
                            {s.trim()}
                          </span>
                        ),
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-indigo-600 uppercase mb-4 tracking-[0.2em]">
                    Education
                  </h4>
                  <div className="flex flex-wrap gap-2.5">
                    {(counselor.qualifications || "").split(",").map(
                      (e, i) =>
                        e.trim() && (
                          <span
                            key={i}
                            className="bg-emerald-50 text-emerald-700 px-5 py-2.5 rounded-xl text-xs font-bold border border-emerald-100"
                          >
                            ✓ {e.trim()}
                          </span>
                        ),
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 bg-[#f8fafc] -mx-12 px-12 pb-12">
                <h4 className="text-[11px] font-black text-indigo-600 uppercase mb-8 tracking-[0.2em] pt-4 text-center">
                  Weekly Consultation Schedule
                </h4>
                <div className="grid grid-cols-5 gap-6">
                  {daysOrder.map((day) => (
                    <div
                      key={day}
                      className="rounded-3xl p-5 border bg-white border-slate-200 shadow-sm flex flex-col items-center"
                    >
                      <p className="text-[10px] font-black text-indigo-600 uppercase mb-5 text-center border-b-2 border-indigo-50 w-full pb-3">
                        {day}
                      </p>
                      <div className="space-y-3 w-full">
                        {timeSlots.map((slotTime, idx) => {
                          const hasSession =
                            groupedAvailability[day]?.includes(slotTime);
                          return hasSession ? (
                            <div
                              key={idx}
                              className="bg-indigo-600 text-white text-[9px] font-black p-3 rounded-xl text-center shadow-md shadow-indigo-100 h-[42px] flex items-center justify-center"
                            >
                              {slotTime}
                            </div>
                          ) : (
                            <div
                              key={idx}
                              className="bg-slate-50 text-slate-300 text-[9px] font-black p-3 rounded-xl text-center border border-dashed border-slate-200 h-[42px] flex items-center justify-center"
                            >
                              No Session
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[1000] px-4">
          <div className="bg-white w-full max-w-[900px] rounded-[32px] p-10 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="relative mb-6 text-center">
              <h5 className="text-xl font-black text-gray-900">
                Request a Session
              </h5>
              <p className="text-[15px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                Book your session with {counselor.name}
              </p>
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute -top-4 -right-4 text-gray-400 hover:text-red-500 font-black text-2xl p-2"
              >
                ×
              </button>
              <div className="w-full h-px bg-indigo-50 mt-6"></div>
            </div>

            <form onSubmit={handleBooking} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-indigo-600 uppercase ml-1">
                  Select Topics
                </label>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {(counselor.specialization || "").split(",").map((s, i) => {
                    const topic = s.trim();
                    if (!topic) return null;
                    const isSelected = bookingData.topic.includes(topic);
                    return (
                      <label
                        key={i}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? "bg-indigo-50 border-indigo-300"
                            : "bg-gray-50 border-gray-100 hover:border-indigo-200"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleTopicToggle(topic)}
                          className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span
                          className={`text-xs font-bold ${isSelected ? "text-indigo-900" : "text-gray-500"}`}
                        >
                          {topic}
                        </span>
                      </label>
                    );
                  })}
                </div>
                <div className="w-full h-px bg-indigo-50 mt-8"></div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-indigo-600 uppercase ml-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    min={(() => {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      return tomorrow.toLocaleDateString("en-CA");
                    })()}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold mt-1 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100"
                    required
                    value={bookingData.date}
                    onChange={handleDateChange}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-indigo-600 uppercase ml-1">
                    Available Time Slot
                  </label>
                  <select
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold mt-1 outline-none focus:bg-white focus:border-indigo-600 disabled:opacity-50"
                    required
                    disabled={
                      !bookingData.date || availableSlotsForDate.length === 0
                    }
                    value={bookingData.timeSlot}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        timeSlot: e.target.value,
                      })
                    }
                  >
                    <option value="">
                      {bookingData.date ? "Select Time" : "Pick Date First"}
                    </option>
                    {availableSlotsForDate.map((slot, i) => {
                      const isBooked = bookedSlots.includes(slot.timeSlot);
                      const isPast = isPastTimeSlot(slot.timeSlot);

                      let availabilityLabel = "";
                      let isDisabled = false;

                      if (isPast) {
                        availabilityLabel = " (Passed)";
                        isDisabled = true;
                      } else if (isBooked) {
                        availabilityLabel = " (Booked)";
                        isDisabled = true;
                      } else {
                        availabilityLabel = " (Available)";
                        isDisabled = false;
                      }

                      return (
                        <option
                          key={i}
                          value={slot.timeSlot}
                          disabled={isDisabled}
                        >
                          {slot.timeSlot}
                          {availabilityLabel}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div>
                <div className="w-full h-px bg-indigo-50 mb-6"></div>
                <label className="text-[10px] font-black text-indigo-600 uppercase ml-1">
                  Reason for Session (Detailed)
                </label>
                <textarea
                  placeholder="Tell the counselor a bit about what you want to discuss..."
                  className="w-full p-5 bg-gray-50 border border-gray-100 rounded-[24px] text-sm font-medium h-40 mt-1 outline-none focus:bg-white focus:border-indigo-600 resize-y transition-all shadow-inner"
                  required
                  value={bookingData.reason}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, reason: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  className="flex-1 bg-gray-100 py-4 rounded-2xl text-xs font-black text-gray-500 hover:bg-gray-200 transition-colors"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-[2] bg-indigo-600 text-white py-4 rounded-2xl text-xs font-black shadow-xl shadow-indigo-100 hover:scale-[0.98] transition-all"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounselorProfileView;
