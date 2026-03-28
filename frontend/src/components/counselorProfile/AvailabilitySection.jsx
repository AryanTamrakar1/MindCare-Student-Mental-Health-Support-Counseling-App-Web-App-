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
    let alreadyExists = false;
    for (let i = 0; i < availability.length; i++) {
      if (
        availability[i].day === day &&
        availability[i].timeSlot === selectedTime
      ) {
        alreadyExists = true;
        break;
      }
    }
    if (alreadyExists) {
      alert("Slot already exists!");
      return;
    }
    setAvailability([...availability, { day, timeSlot: selectedTime }]);
  };

  const removeSlot = (index) =>
    setAvailability(availability.filter((_, i) => i !== index));

  return (
    <div className="bg-white border border-[#DBEAFE] flex flex-col">
      <div className="px-5 py-4 border-b border-[#EFF6FF] flex items-center justify-between">
        <p className="text-[18px] font-semibold text-[#374151]">
          Weekly availability
        </p>
        <select
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          className="text-[13px] text-[#2563EB] bg-[#EFF6FF] border border-[#DBEAFE] px-2.5 py-1.5 outline-none cursor-pointer"
        >
          {timeSlots.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="px-5 py-3 space-y-1">
        {daysOrder.map((day) => {
          const rawSlots = [];
          for (let i = 0; i < availability.length; i++) {
            if (availability[i].day === day) {
              rawSlots.push({ slot: availability[i], index: i });
            }
          }
          rawSlots.sort(
            (a, b) =>
              timeSlots.indexOf(a.slot.timeSlot) -
              timeSlots.indexOf(b.slot.timeSlot),
          );

          let slotsContent;
          if (rawSlots.length > 0) {
            slotsContent = (
              <div className="flex flex-wrap gap-1.5">
                {rawSlots.map((item) => (
                  <span
                    key={item.index}
                    className="inline-flex items-center gap-1 bg-[#EFF6FF] text-[#1D4ED8] border border-[#DBEAFE] px-2.5 py-1 text-[13px] font-medium"
                  >
                    {item.slot.timeSlot}
                    <button
                      onClick={() => removeSlot(item.index)}
                      className="text-[#93C5FD] hover:text-[#2563EB] text-[14px] leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            );
          } else {
            slotsContent = (
              <p className="text-[13px] text-[#DBEAFE]">No slots</p>
            );
          }

          return (
            <div
              key={day}
              className="flex items-start gap-3 py-2.5 border-b border-[#F0F9FF] last:border-0"
            >
              <button
                onClick={() => addSlot(day)}
                className="w-6 h-6 bg-[#DBEAFE] text-[#1D4ED8] text-[16px] font-medium hover:bg-[#BFDBFE] transition-colors flex-shrink-0 flex items-center justify-center mt-0.5"
              >
                +
              </button>
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <span className="text-[12px] font-medium text-[#9CA3AF] uppercase tracking-wider">
                  {day}
                </span>
                {slotsContent}
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-5 py-4 border-t border-[#EFF6FF]">
        <button
          onClick={() => {
            const confirmed = window.confirm(
              "Are you sure you want to save all changes?",
            );
            if (confirmed) {
              handleUpdate();
            }
          }}
          className="w-full bg-[#2563EB] text-white py-3 text-[16px] font-medium hover:bg-[#1D4ED8] active:scale-[0.99] transition-all"
        >
          Save all changes
        </button>
      </div>
    </div>
  );
};

export default AvailabilitySection;
