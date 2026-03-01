import React from "react";
import {
  ClipboardList,
  Brain,
  PenLine,
  MessageCircle,
  HandHeart,
  Star,
  BookOpen,
  Zap,
  ThumbsUp,
} from "lucide-react";

const POINT_GUIDE = [
  {
    activity: "Attend a Session",
    points: 30,
    icon: <Brain className="w-4 h-4 text-indigo-400 shrink-0" />,
  },
  {
    activity: "Complete Mood Quiz",
    points: 10,
    icon: <ClipboardList className="w-4 h-4 text-indigo-400 shrink-0" />,
  },
  {
    activity: "Post in Forum",
    points: 10,
    icon: <PenLine className="w-4 h-4 text-indigo-400 shrink-0" />,
  },
  {
    activity: "Like a Post",
    points: 10,
    icon: <ThumbsUp className="w-4 h-4 text-indigo-400 shrink-0" />,
  },
  {
    activity: "Help Someone (reply liked)",
    points: 15,
    icon: <HandHeart className="w-4 h-4 text-indigo-400 shrink-0" />,
  },
  {
    activity: "Reply in Forum",
    points: 5,
    icon: <MessageCircle className="w-4 h-4 text-indigo-400 shrink-0" />,
  },
  {
    activity: "Rate a Session",
    points: 5,
    icon: <Star className="w-4 h-4 text-indigo-400 shrink-0" />,
  },
  {
    activity: "Bookmark a Resource",
    points: 5,
    icon: <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />,
  },
];

const PointsDisplay = ({ points, currentStreak, moodTrend }) => {
  function renderMultiplierNotice() {
    if (moodTrend !== "Declining") return null;
    return (
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 flex items-start gap-2">
        <Zap className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-black text-indigo-700 uppercase tracking-wider">
            2x Points Active
          </p>
          <p className="text-xs text-indigo-600 font-semibold mt-0.5">
            You showed up during a tough week. All points doubled!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-black/10 flex flex-col gap-4 h-full">
      <p className="text-xs font-black text-gray-800 uppercase tracking-widest">
        Points & Streak
      </p>

      <div className="flex gap-3">
        <div className="flex-1 bg-indigo-600 rounded-2xl p-4 text-white flex flex-col items-center justify-center gap-1">
          <span className="text-3xl font-black leading-none">{points}</span>
          <span className="text-xs uppercase tracking-widest font-bold opacity-80">
            Points
          </span>
        </div>
        <div className="flex-1 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-1">
          <span className="text-3xl font-black text-amber-600 leading-none">
            {currentStreak}
          </span>
          <span className="text-xs uppercase tracking-widest font-bold text-amber-500">
            Streak
          </span>
        </div>
      </div>

      {renderMultiplierNotice()}

      <div className="flex-1 flex flex-col gap-1">
        <p className="text-xs font-black text-gray-800 uppercase tracking-widest mb-2">
          How to Earn Points
        </p>
        {POINT_GUIDE.map(function (item) {
          return (
            <div
              key={item.activity}
              className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0"
            >
              <div className="flex items-center gap-2">
                {item.icon}
                <span className="text-xs font-semibold text-gray-600">
                  {item.activity}
                </span>
              </div>
              <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg shrink-0">
                +{item.points}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PointsDisplay;
