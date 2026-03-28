import React from "react";
import { useBookingModal } from "../../hooks/counselorProfileView/useBookingModal";

const BookingModal = ({ counselor, topics }) => {
  const {
    bookedSlots,
    availableSlotsForDate,
    bookingDate,
    bookingTimeSlot,
    setBookingTimeSlot,
    bookingReason,
    bookingTopics,
    handleDateChange,
    handleTopicToggle,
    isPastTimeSlot,
    handleReasonChange,
    handleBooking,
    handleClose,
    getTomorrowDate,
  } = useBookingModal();

  const inputStyle = {
    width: "100%", padding: "12px 14px",
    border: "1px solid #e5e7eb",
    fontSize: "14px", color: "#1a1d2e",
    background: "#fafafa", outline: "none",
    marginTop: "6px", boxSizing: "border-box",
  };

  const labelStyle = {
    fontSize: "14px", color: "#111827",
    fontWeight: "600", display: "block",
  };

  let selectOpacity = 1;
  if (!bookingDate || availableSlotsForDate.length === 0) selectOpacity = 0.5;

  let defaultOptionText = "Pick a date first";
  if (bookingDate) defaultOptionText = "Select time";

  return (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(26,29,46,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, padding: "16px",
      }}
    >
      <div
        style={{
          background: "#fff", width: "100%", maxWidth: "640px",
          padding: "32px",
          maxHeight: "90vh", overflowY: "auto",
          boxSizing: "border-box", border: "1px solid #ebebeb",
          boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
          <div>
            <h5 style={{ fontSize: "18px", fontWeight: "700", color: "#1a1d2e", marginBottom: "4px" }}>
              Request a session
            </h5>
            <p style={{ fontSize: "13px", color: "#8b8fa8" }}>
              Book your session with {counselor.name}
            </p>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: "none", border: "none",
              fontSize: "22px", color: "#8b8fa8",
              cursor: "pointer", lineHeight: 1, padding: "0",
            }}
          >
            ×
          </button>
        </div>

        <div style={{ height: "1px", background: "#f0f0f0", margin: "0 -32px 24px -32px" }} />

        <form onSubmit={handleBooking}>

          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>Select topics</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "10px" }}>
              {topics.map((topic, i) => {
                let isSelected = false;
                for (let j = 0; j < bookingTopics.length; j++) {
                  if (bookingTopics[j] === topic) { isSelected = true; break; }
                }

                let topicBorder = "1px solid #e5e7eb";
                let topicBg = "#fafafa";
                let topicColor = "#5c6080";
                if (isSelected) {
                  topicBorder = "1px solid #2563EB";
                  topicBg = "#EEF2FF";
                  topicColor = "#2563EB";
                }

                return (
                  <label
                    key={i}
                    style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      padding: "10px 14px",
                      border: topicBorder,
                      background: topicBg,
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleTopicToggle(topic)}
                      style={{ width: "15px", height: "15px", accentColor: "#2563EB", flexShrink: 0 }}
                    />
                    <span style={{ fontSize: "13px", color: topicColor, fontWeight: "500" }}>
                      {topic}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div style={{ height: "1px", background: "#f0f0f0", marginBottom: "24px" }} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
            <div>
              <label style={labelStyle}>Preferred date</label>
              <input
                type="date" min={getTomorrowDate()} required
                value={bookingDate}
                onChange={(e) => handleDateChange(e, counselor)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Available time slot</label>
              <select
                required
                disabled={!bookingDate || availableSlotsForDate.length === 0}
                value={bookingTimeSlot}
                onChange={(e) => setBookingTimeSlot(e.target.value)}
                style={{ ...inputStyle, opacity: selectOpacity }}
              >
                <option value="">{defaultOptionText}</option>
                {availableSlotsForDate.map((slot, i) => {
                  const isBooked = bookedSlots.includes(slot.timeSlot);
                  const isPast = isPastTimeSlot(slot.timeSlot);
                  const disabled = isBooked || isPast;
                  let label = " (Available)";
                  if (isPast) label = " (Passed)";
                  else if (isBooked) label = " (Booked)";
                  return (
                    <option key={i} value={slot.timeSlot} disabled={disabled}>
                      {slot.timeSlot}{label}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div style={{ height: "1px", background: "#f0f0f0", marginBottom: "24px" }} />

          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>Reason for session</label>
            <textarea
              placeholder="Tell the counselor what you would like to discuss..."
              required
              value={bookingReason}
              onChange={handleReasonChange}
              style={{ ...inputStyle, minHeight: "120px", resize: "none", overflow: "hidden", lineHeight: 1.6 }}
            />
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              type="button" onClick={handleClose}
              style={{
                flex: 1, padding: "13px",
                background: "#f4f5fb", color: "#5c6080",
                border: "1px solid #e4e6f0",
                fontSize: "14px", fontWeight: "600",
                cursor: "pointer", transition: "background 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#e4e6f0"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#f4f5fb"; }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 2, padding: "13px",
                background: "#2563EB", color: "#fff",
                border: "none",
                fontSize: "14px", fontWeight: "600",
                cursor: "pointer", transition: "background 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#1D4ED8"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#2563EB"; }}
            >
              Send request
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default BookingModal;