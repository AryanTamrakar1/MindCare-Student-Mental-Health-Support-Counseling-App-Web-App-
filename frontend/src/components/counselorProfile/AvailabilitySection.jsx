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

const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const AvailabilitySection = ({
  availability,
  setAvailability,
  selectedTime,
  setSelectedTime,
  handleUpdate,
}) => {
  const addSlot = (day) => {
    const alreadyExists = availability.some(
      (item) => item.day === day && item.timeSlot === selectedTime
    );
    if (alreadyExists) {
      alert("Slot already exists!");
      return;
    }
    setAvailability([...availability, { day, timeSlot: selectedTime }]);
  };

  const removeSlot = (index) => {
    setAvailability(availability.filter((_, i) => i !== index));
  };

  return (
    <div className="col-span-5">
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[555px]">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xs font-black text-indigo-600 uppercase">
            Weekly Availability
          </h4>
          <select
            className="bg-gray-50 p-2 rounded-lg outline-none font-black text-indigo-600 text-[10px] border border-gray-100"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          >
            {timeSlots.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto pr-2 mb-4">
          {daysOrder.map((day) => {
            const daySlotsArray = availability
              .map((slot, index) => ({ slot, index }))
              .filter((item) => item.slot.day === day)
              .sort(
                (a, b) =>
                  timeSlots.indexOf(a.slot.timeSlot) -
                  timeSlots.indexOf(b.slot.timeSlot)
              );

            return (
              <div
                key={day}
                className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 flex items-center min-h-[60px]"
              >
                <button
                  onClick={() => addSlot(day)}
                  className="w-7 h-7 bg-indigo-600 text-white rounded-lg font-black text-sm mr-3 hover:bg-indigo-700"
                >
                  +
                </button>

                <span className="font-black text-gray-700 text-[9px] uppercase w-16">
                  {day}
                </span>

                <div className="flex flex-wrap gap-1 flex-1">
                  {daySlotsArray.map((item) => (
                    <span
                      key={item.index}
                      className="bg-white text-indigo-700 px-2 py-1 rounded-md text-[8px] font-black border border-indigo-100 flex items-center gap-1"
                    >
                      {item.slot.timeSlot}
                      <button
                        onClick={() => removeSlot(item.index)}
                        className="text-red-400 hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleUpdate}
          className="w-full bg-indigo-600 text-white py-4 rounded-2xl text-base font-black shadow-lg hover:bg-indigo-700 transition-all active:scale-[0.98]"
        >
          Save All Changes
        </button>
      </section>
    </div>
  );
};

export default AvailabilitySection;