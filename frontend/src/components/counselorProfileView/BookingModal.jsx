const BookingModal = ({
  counselor,
  topics,
  bookingTopics,
  handleTopicToggle,
  bookingDate,
  handleDateChange,
  getTomorrowDate,
  availableSlotsForDate,
  bookedSlots,
  isPastTimeSlot,
  bookingTimeSlot,
  setBookingTimeSlot,
  bookingReason,
  handleReasonChange,
  handleBooking,
  onClose,
}) => {
  return (
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
            onClick={onClose}
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
              {topics.map((topic, i) => {
                const isSelected = bookingTopics.includes(topic);
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
                min={getTomorrowDate()}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold mt-1 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100"
                required
                value={bookingDate}
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
                disabled={!bookingDate || availableSlotsForDate.length === 0}
                value={bookingTimeSlot}
                onChange={(e) => setBookingTimeSlot(e.target.value)}
              >
                <option value="">
                  {bookingDate ? "Select Time" : "Pick Date First"}
                </option>
                {availableSlotsForDate.map((slot, i) => {
                  const isBooked = bookedSlots.includes(slot.timeSlot);
                  const isPast = isPastTimeSlot(slot.timeSlot);
                  const disabled = isBooked || isPast;
                  const label = isPast
                    ? " (Passed)"
                    : isBooked
                      ? " (Booked)"
                      : " (Available)";
                  return (
                    <option key={i} value={slot.timeSlot} disabled={disabled}>
                      {slot.timeSlot}
                      {label}
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
              className="w-full p-5 bg-gray-50 border border-gray-100 rounded-[24px] text-sm font-medium mt-1 outline-none focus:bg-white focus:border-indigo-600 resize-none overflow-hidden transition-all shadow-inner"
              required
              style={{ minHeight: "160px" }}
              value={bookingReason}
              onChange={handleReasonChange}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 py-4 rounded-2xl text-xs font-black text-gray-500 hover:bg-gray-200 transition-colors"
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
  );
};

export default BookingModal;
