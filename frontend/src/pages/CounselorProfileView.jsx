import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "../api/axios";
import StudentSidebar from "../components/StudentSidebar";
import Navbar from "../components/Navbar";

const CounselorProfileView = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const location = useLocation();

  const [user, setUser] = useState(location.state?.user || null);

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

  // It loads the counselor profile data
  useEffect(() => {
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
        let found = null;
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i]._id === id) {
            found = response.data[i];
          }
        }
        setCounselor(found);
        fetchLiveStatus(id);
        setLoading(false);
      } catch (error) {
        console.error("Error loading counselor profile", error);
        setLoading(false);
      }
    };
    fetchCounselorData();
  }, [id]);

  // It fetches the live status of the counselor
  const fetchLiveStatus = async (counselorId) => {
    try {
      const res = await axios.get(`/appointments/live-status/${counselorId}`);
      setLiveStatus(res.data);
    } catch (err) {
      console.error("Status error", err);
    }
  };

  // It checks the database for slots that are already taken by other students
  const checkTakenSlots = async (selectedDate) => {
    try {
      const response = await axios.get(
        `/appointments/check?counselorId=${id}&date=${selectedDate}`,
      );
      setBookedSlots(response.data);
    } catch (error) {
      console.error("Error checking taken slots", error);
    }
  };

  // It handles the date change in the booking modal
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    if (!selectedDate) {
      setBookingData({ ...bookingData, date: "", timeSlot: "" });
      setAvailableSlotsForDate([]);
      return;
    }
    const dateObj = new Date(selectedDate);
    const dayNumber = dateObj.getUTCDay();
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayName = dayNames[dayNumber];
    if (dayName === "Saturday" || dayName === "Sunday") {
      alert("Counselors are not available on weekends. Please pick Mon-Fri.");
      setBookingData({ ...bookingData, date: "", timeSlot: "" });
      setAvailableSlotsForDate([]);
      return;
    }
    let counselorSlots = [];
    const allAvailability = counselor.availability || [];
    for (let i = 0; i < allAvailability.length; i++) {
      if (allAvailability[i].day === dayName) {
        counselorSlots.push(allAvailability[i]);
      }
    }
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

  // It handles the topic selection in the booking modal
  const handleTopicToggle = (topicName) => {
    let currentTopics = [...bookingData.topic];
    let exists = false;
    let index = -1;
    for (let i = 0; i < currentTopics.length; i++) {
      if (currentTopics[i] === topicName) {
        exists = true;
        index = i;
      }
    }
    if (exists) {
      let filtered = [];
      for (let i = 0; i < currentTopics.length; i++) {
        if (currentTopics[i] !== topicName) filtered.push(currentTopics[i]);
      }
      setBookingData({ ...bookingData, topic: filtered });
    } else {
      currentTopics.push(topicName);
      setBookingData({ ...bookingData, topic: currentTopics });
    }
  };

  // It handles the booking submission in the booking modal
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
      let topicString = "";
      for (let i = 0; i < bookingData.topic.length; i++) {
        topicString += bookingData.topic[i];
        if (i < bookingData.topic.length - 1) topicString += ", ";
      }
      const response = await axios.post(
        "/appointments/request",
        {
          counselorId: id,
          date: bookingData.date,
          timeSlot: bookingData.timeSlot,
          reason: "[" + topicString + "] " + bookingData.reason,
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

  // It checks if the time slot has already passed for the current day
  const isPastTimeSlot = (slotTime) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const todayStr = year + "-" + month + "-" + day;

    if (bookingData.date !== todayStr) return false;

    const startTimePart = slotTime.split(" - ")[0];
    const timeSplit = startTimePart.split(" ");
    const hourMin = timeSplit[0].split(":");
    let hour = parseInt(hourMin[0]);
    let min = parseInt(hourMin[1]);
    const ampm = timeSplit[1];

    if (ampm === "PM" && hour !== 12) hour = hour + 12;
    if (ampm === "AM" && hour === 12) hour = 0;

    const slotDate = new Date();
    slotDate.setHours(hour, min, 0, 0);

    return today > slotDate;
  };

  // It returns the color of the status label
  const getStatusColor = () => {
    if (liveStatus.status === "Yellow") return "text-amber-600";
    if (liveStatus.status === "Red") return "text-rose-600";
    return "text-emerald-600";
  };

  // It helps to renders the counselor profile page
  if (loading || !counselor) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <Navbar user={user} />
        <div className="flex">
          <StudentSidebar user={user} />
          <main className="flex-1 p-6 flex items-center justify-center">
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
      </div>
    );
  }

  // It groups the availability by day
  const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const groupedAvailability = {};
  const allSlots = counselor.availability || [];
  for (let i = 0; i < allSlots.length; i++) {
    const slot = allSlots[i];
    if (!groupedAvailability[slot.day]) {
      groupedAvailability[slot.day] = [];
    }
    groupedAvailability[slot.day].push(slot.timeSlot);
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar user={user} />
      <div className="flex">
        <StudentSidebar user={user} />

        <main className="flex-1 p-6 overflow-x-hidden">
          <div className="w-full max-w-[1400px] mx-auto px-4">
            {/* It is the button that goes back to the previous page */}
            <button
              className="text-indigo-600 font-black text-xs uppercase mb-4 flex items-center gap-1.5 hover:opacity-70 transition-all"
              onClick={() => navigate(-1)}
            >
              <span className="text-base">←</span> Back to Directory
            </button>

            <div className="bg-white rounded-[32px] border border-gray-200 overflow-hidden shadow-sm w-full">
              {/* It is the counselor profile card section */}
              <div className="flex justify-between items-center p-6 px-10 border-b border-gray-100 bg-white">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-black border border-indigo-100">
                    {counselor.name?.charAt(0)}
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-gray-900">
                      {counselor.name}
                    </h1>
                    <p className="text-gray-500 font-bold text-xs">
                      {counselor.profTitle || "Professional Counselor"}
                    </p>
                    <span
                      className={`${getStatusColor()} text-[9px] font-black uppercase tracking-widest mt-1 block`}
                    >
                      ● {liveStatus.label}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-indigo-600 text-white px-10 py-3.5 rounded-2xl text-xs font-black shadow-lg hover:bg-indigo-700 transition-all"
                >
                  Request Session
                </button>
              </div>

              {/* It is the experience, students helped, and rating section  */}
              <div className="grid grid-cols-3 border-b border-gray-100 bg-[#f8fafc]">
                <div className="flex flex-col items-center justify-center py-6 border-r border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎓</span>
                    <span className="text-base font-black text-gray-800">
                      {counselor.experience || 0}+ Yrs
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                    Experience
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center py-6 border-r border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🤝</span>
                    <span className="text-base font-black text-gray-800">
                      {counselor.studentsHelped || 0}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                    Students Helped
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⭐</span>
                    <span className="text-base font-black text-gray-800">
                      {counselor.rating ? counselor.rating.toFixed(1) : "0.0"}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                    Rating
                  </p>
                </div>
              </div>

              {/* It is the counselor bio section */}
              <div className="p-8 px-10 space-y-8">
                <div>
                  <h4 className="text-[10px] font-black text-indigo-600 uppercase mb-3 tracking-widest">
                    About Counselor
                  </h4>
                  <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {counselor.bio || "No biography provided."}
                    </p>
                  </div>
                </div>

                {/* It is the counselor specialization and education section */}
                <div className="grid grid-cols-2 gap-16">
                  <div>
                    <h4 className="text-[10px] font-black text-indigo-600 uppercase mb-3 tracking-widest">
                      Specialization
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(counselor.specialization || "").split(",").map(
                        (s, i) =>
                          s.trim() && (
                            <span
                              key={i}
                              className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-[11px] font-bold border border-indigo-100"
                            >
                              {s.trim()}
                            </span>
                          ),
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-indigo-600 uppercase mb-3 tracking-widest">
                      Education
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(counselor.qualifications || "").split(",").map(
                        (e, i) =>
                          e.trim() && (
                            <span
                              key={i}
                              className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-[11px] font-bold border border-emerald-100"
                            >
                              ✓ {e.trim()}
                            </span>
                          ),
                      )}
                    </div>
                  </div>
                </div>

                {/* It is the weekly availability section */}
                <div className="pt-6 border-t border-gray-100 bg-[#f1f5f9] -mx-10 px-10 pb-8">
                  <h4 className="text-[10px] font-black text-indigo-600 uppercase mb-5 tracking-widest pt-4 text-center">
                    Weekly Consultation Schedule
                  </h4>
                  <div className="grid grid-cols-5 gap-6">
                    {daysOrder.map((day) => (
                      <div
                        key={day}
                        className="rounded-2xl p-4 border bg-white border-indigo-100 shadow-sm flex flex-col items-center"
                      >
                        <p className="text-[10px] font-black text-indigo-600 uppercase mb-4 text-center border-b-2 border-indigo-50 w-full pb-2">
                          {day}
                        </p>
                        <div className="space-y-2 w-full">
                          {timeSlots.map((slotTime, idx) => {
                            const hasSession =
                              groupedAvailability[day] &&
                              groupedAvailability[day].includes(slotTime);
                            return hasSession ? (
                              <div
                                key={idx}
                                className="bg-indigo-600 text-white text-[8px] font-black p-2.5 rounded-xl text-center shadow-sm h-[38px] flex items-center justify-center"
                              >
                                {slotTime}
                              </div>
                            ) : (
                              <div
                                key={idx}
                                className="bg-indigo-50 text-indigo-300 text-[8px] font-black p-2.5 rounded-xl text-center border border-dashed border-indigo-200 h-[38px] flex items-center justify-center"
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
      </div>

      {/* It is the booking modal section */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white w-full max-w-[650px] rounded-[32px] p-10 shadow-2xl border border-gray-100">
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
              {/* It is the topic selection section in the booking modal */}
              <div>
                <label className="text-[10px] font-black text-indigo-600 uppercase ml-1">
                  Select Topics{" "}
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

              {/* It is the date and time selection section in the booking modal */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-indigo-600 uppercase ml-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toLocaleDateString("en-CA")}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold mt-1 outline-none focus:bg-white"
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

                      let label = slot.timeSlot;
                      if (isBooked) label += " (Full)";
                      else if (isPast) label += " (Passed)";

                      return (
                        <option
                          key={i}
                          value={slot.timeSlot}
                          disabled={isBooked || isPast}
                        >
                          {label}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* It is the textarea section in the booking modal */}
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

              {/* It is the button section in the booking modal */}
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
