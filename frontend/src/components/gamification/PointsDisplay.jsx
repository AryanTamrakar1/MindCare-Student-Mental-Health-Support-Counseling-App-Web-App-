import React from "react";
import {
  ClipboardList, Brain, PenLine, MessageCircle,
  HandHeart, Star, BookOpen, ThumbsUp,
} from "lucide-react";

const POINT_GUIDE = [
  { activity: "Attend a Session", points: 30, icon: <Brain className="w-4 h-4 text-blue-400 shrink-0" /> },
  { activity: "Complete Mood Quiz", points: 10, icon: <ClipboardList className="w-4 h-4 text-blue-400 shrink-0" /> },
  { activity: "Post in Forum", points: 10, icon: <PenLine className="w-4 h-4 text-blue-400 shrink-0" /> },
  { activity: "Like a Post", points: 10, icon: <ThumbsUp className="w-4 h-4 text-blue-400 shrink-0" /> },
  { activity: "Help Someone (reply liked)", points: 15, icon: <HandHeart className="w-4 h-4 text-blue-400 shrink-0" /> },
  { activity: "Reply in Forum", points: 5, icon: <MessageCircle className="w-4 h-4 text-blue-400 shrink-0" /> },
  { activity: "Rate a Session", points: 5, icon: <Star className="w-4 h-4 text-blue-400 shrink-0" /> },
  { activity: "Bookmark a Resource", points: 5, icon: <BookOpen className="w-4 h-4 text-blue-400 shrink-0" /> },
];

const PointsDisplay = ({ points, currentStreak }) => {
  return (
    <div className="bg-white border border-[#E5E7EB] flex flex-col h-full overflow-hidden">

      <div className="px-6 py-4 border-b border-[#E5E7EB]">
        <p className="text-[15px] font-black text-gray-800 uppercase tracking-widest">
          Points & Streak
        </p>
      </div>

      <div className="px-6 py-5 flex flex-col gap-4">
        <div className="flex gap-3">
          <div className="flex-1 bg-blue-600 p-4 text-white flex flex-col items-center justify-center gap-1">
            <span className="text-3xl font-black leading-none">{points}</span>
            <span className="text-xs uppercase tracking-widest font-bold opacity-80">Points</span>
          </div>
          <div className="flex-1 bg-blue-50 border border-blue-200 p-4 flex flex-col items-center justify-center gap-1">
            <span className="text-3xl font-black text-blue-600 leading-none">{currentStreak}</span>
            <span className="text-xs uppercase tracking-widest font-bold text-blue-500">Streak</span>
          </div>
        </div>
      </div>

      <div style={{ marginLeft: "-1px", marginRight: "-1px" }} className="border-t border-b border-[#E5E7EB] px-6 py-4">
        <p className="text-xs font-black text-gray-800 uppercase tracking-widest">
          How to Earn Points
        </p>
      </div>

      <div className="px-6 py-4 flex flex-col gap-1 flex-1">
        {POINT_GUIDE.map(function (item) {
          return (
            <div key={item.activity} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-2">
                {item.icon}
                <span className="text-xs font-semibold text-gray-600">{item.activity}</span>
              </div>
              <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 shrink-0">
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