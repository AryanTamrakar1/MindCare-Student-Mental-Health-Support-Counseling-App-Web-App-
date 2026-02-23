import React, { useState, useEffect } from "react";
import API from "../../api/axios";

const DailyCheckIn = () => {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);

  const emojis = [
    { mood: 1, emoji: "😔", label: "Very Bad" },
    { mood: 2, emoji: "😟", label: "Bad" },
    { mood: 3, emoji: "😐", label: "Okay" },
    { mood: 4, emoji: "🙂", label: "Good" },
    { mood: 5, emoji: "😊", label: "Great" },
  ];

  useEffect(() => {
    const checkToday = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await API.get("/quiz/checkin/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const today = new Date().toISOString().split("T")[0];
        if (res.data.find((entry) => entry.date === today)) {
          setAlreadyDone(true);
          setSubmitted(true);
        }
      } catch (error) {
        console.error("Error checking today's check-in", error);
      }
    };
    checkToday();
  }, []);

  const handleSubmit = async () => {
    if (selected === null) return;
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      await API.post("/quiz/checkin", { mood: selected }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Check-in error", error);
    }
    setLoading(false);
  };

  if (alreadyDone || submitted) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-black/10 text-center">
        <p className="text-sm text-gray-500">
          {alreadyDone ? "You already checked in today! See you tomorrow." : "Check-in saved! See you tomorrow."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-black/10">
      <p className="text-sm text-gray-500 mb-5">How are you feeling today?</p>
      <div className="flex justify-between gap-3 mb-5">
        {emojis.map((item) => (
          <button
            key={item.mood}
            onClick={() => setSelected(item.mood)}
            className={`flex flex-col items-center flex-1 py-4 rounded-2xl border-2 transition-all duration-200
              ${selected === item.mood
                ? "border-blue-500 bg-blue-50 scale-105"
                : "border-gray-100 bg-gray-50 hover:border-blue-300 hover:bg-blue-50"
              }`}
          >
            <span className="text-3xl mb-2">{item.emoji}</span>
            <span className={`text-xs ${selected === item.mood ? "text-blue-600 font-semibold" : "text-gray-400"}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        disabled={selected === null || loading}
        className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? "Saving..." : "Submit Check-In"}
      </button>
    </div>
  );
};

export default DailyCheckIn;