import { createContext, useContext, useState } from "react";
import axios from "../../api/axios";
import { useCounselorProfileViewContext } from "./CounselorProfileViewContext";

const BookingModalContext = createContext(null);

export const BookingModalProvider = ({ children }) => {
  const { id, setIsModalOpen, liveStatus } = useCounselorProfileViewContext();
  const [bookedSlots, setBookedSlots] = useState([]);
  const [availableSlotsForDate, setAvailableSlotsForDate] = useState([]);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTimeSlot, setBookingTimeSlot] = useState("");
  const [bookingReason, setBookingReason] = useState("");
  const [bookingTopics, setBookingTopics] = useState([]);

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

  const handleDateChange = async (e, counselor) => {
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

    const slotsForDay = [];
    const allSlots = counselor.availability || [];
    for (let i = 0; i < allSlots.length; i++) {
      if (allSlots[i].day === dayName) {
        slotsForDay.push(allSlots[i]);
      }
    }

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
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setBookedSlots(res.data);
    } catch {
      setBookedSlots([]);
    }
  };

  const handleTopicToggle = (topic) => {
    if (bookingTopics.includes(topic)) {
      const updated = [];
      for (let i = 0; i < bookingTopics.length; i++) {
        if (bookingTopics[i] !== topic) {
          updated.push(bookingTopics[i]);
        }
      }
      setBookingTopics(updated);
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

  const handleReasonChange = (e) => {
    setBookingReason(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
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
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setBookingDate("");
    setBookingTimeSlot("");
    setBookingReason("");
    setBookingTopics([]);
    setAvailableSlotsForDate([]);
    setBookedSlots([]);
  };

  return (
    <BookingModalContext.Provider
      value={{
        bookedSlots,
        availableSlotsForDate,
        bookingDate,
        setBookingDate,
        bookingTimeSlot,
        setBookingTimeSlot,
        bookingReason,
        setBookingReason,
        bookingTopics,
        setBookingTopics,
        handleDateChange,
        handleTopicToggle,
        isPastTimeSlot,
        handleReasonChange,
        handleBooking,
        handleClose,
        getTomorrowDate,
        formatDate,
      }}
    >
      {children}
    </BookingModalContext.Provider>
  );
};

export const useBookingModalContext = () => {
  const ctx = useContext(BookingModalContext);
  if (!ctx)
    throw new Error(
      "useBookingModalContext must be used inside BookingModalProvider"
    );
  return ctx;
};