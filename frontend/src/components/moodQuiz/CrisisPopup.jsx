import React, { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import API from "../../api/axios";

const CrisisPopup = () => {
  const [show, setShow] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    const checkCrisis = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await API.get("/smart/mood-analysis", {
          headers: { Authorization: "Bearer " + token },
        });

        const alreadyAcknowledged =
          sessionStorage.getItem("crisisAcknowledged");

        if (res.data.isCrisis && !alreadyAcknowledged) {
          setShow(true);
        }
      } catch (err) {
        console.error("Crisis check failed", err);
      }
    };
    checkCrisis();
  }, []);

  const handleAcknowledge = () => {
    sessionStorage.setItem("crisisAcknowledged", "true");
    setShow(false);
    setAcknowledged(true);
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl mx-4">
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center">
            <AlertTriangle size={32} className="text-red-500" />
          </div>
        </div>

        <h2 className="text-xl font-black text-gray-800 text-center mb-2">
          Hey, we're a bit worried about you.
        </h2>

        <p className="text-sm text-gray-500 text-center leading-relaxed mb-2">
          Your mood score this week is quite low. That's okay — it happens to
          everyone. But we don't want you to go through this alone.
        </p>

        <p className="text-sm text-gray-500 text-center leading-relaxed mb-6">
          Please consider booking a session with a counselor this week. Even
          just one conversation can make a real difference.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleAcknowledge}
            className="w-full bg-red-500 hover:bg-red-600 text-white text-sm font-black py-3 rounded-xl transition"
          >
            I understand, I'll take care of myself
          </button>
          <button
            onClick={handleAcknowledge}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-sm font-semibold py-3 rounded-xl transition"
          >
            Dismiss for now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrisisPopup;
