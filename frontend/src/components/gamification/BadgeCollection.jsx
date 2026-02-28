import React from "react";
import {
  ClipboardList,
  Brain,
  Mic,
  HandHeart,
  CalendarCheck,
  RotateCcw,
  BookOpen,
  Users,
  Trophy,
  Shield,
  Lock,
} from "lucide-react";

const ALL_BADGES = [
  {
    name: "First Step",
    description: "Completed your first mood quiz",
    icon: <ClipboardList className="w-5 h-5" />,
    color: "bg-green-100 text-green-600 border-green-200",
    earnedColor: "bg-green-500",
  },
  {
    name: "Session Starter",
    description: "Attended your first counseling session",
    icon: <Brain className="w-5 h-5" />,
    color: "bg-indigo-100 text-indigo-600 border-indigo-200",
    earnedColor: "bg-indigo-500",
  },
  {
    name: "First Voice",
    description: "Made your first post in the community forum",
    icon: <Mic className="w-5 h-5" />,
    color: "bg-sky-100 text-sky-600 border-sky-200",
    earnedColor: "bg-sky-500",
  },
  {
    name: "The Helper",
    description: "Helped someone in the community forum",
    icon: <HandHeart className="w-5 h-5" />,
    color: "bg-pink-100 text-pink-600 border-pink-200",
    earnedColor: "bg-pink-500",
  },
  {
    name: "Being Consistent",
    description: "Completed the quiz 3 weeks in a row",
    icon: <CalendarCheck className="w-5 h-5" />,
    color: "bg-teal-100 text-teal-600 border-teal-200",
    earnedColor: "bg-teal-500",
  },
  {
    name: "The Comeback",
    description: "Returned to the app after being away",
    icon: <RotateCcw className="w-5 h-5" />,
    color: "bg-orange-100 text-orange-600 border-orange-200",
    earnedColor: "bg-orange-500",
  },
  {
    name: "The Resource Explorer",
    description: "Bookmarked 5 different resources",
    icon: <BookOpen className="w-5 h-5" />,
    color: "bg-yellow-100 text-yellow-600 border-yellow-200",
    earnedColor: "bg-yellow-500",
  },
  {
    name: "The Community Pillar",
    description: "Made 10 interactions in the community forum",
    icon: <Users className="w-5 h-5" />,
    color: "bg-violet-100 text-violet-600 border-violet-200",
    earnedColor: "bg-violet-500",
  },
  {
    name: "The MindCare Champion",
    description: "Completed all activity types in one month",
    icon: <Trophy className="w-5 h-5" />,
    color: "bg-amber-100 text-amber-600 border-amber-200",
    earnedColor: "bg-amber-500",
  },
  {
    name: "The Resilient One",
    description: "Showed up even when your mood was declining",
    icon: <Shield className="w-5 h-5" />,
    color: "bg-rose-100 text-rose-600 border-rose-200",
    earnedColor: "bg-rose-500",
  },
];

const BadgeCollection = ({ badges }) => {
  function isEarned(badgeName) {
    for (let i = 0; i < badges.length; i++) {
      if (badges[i].name === badgeName) return true;
    }
    return false;
  }

  function getEarnedDate(badgeName) {
    for (let i = 0; i < badges.length; i++) {
      if (badges[i].name === badgeName) {
        const date = new Date(badges[i].earnedAt);
        return date.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      }
    }
    return null;
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-black/10 flex flex-col gap-5 h-full">
      <div className="flex items-center justify-between">
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
          Badges & Achievements
        </p>
        <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          {badges.length} / {ALL_BADGES.length} earned
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {ALL_BADGES.map(function (badge) {
          const earned = isEarned(badge.name);
          const earnedDate = getEarnedDate(badge.name);
          return (
            <div
              key={badge.name}
              className={`rounded-xl p-4 border flex items-start gap-3 transition-all ${earned ? badge.color : "bg-gray-50 border-gray-200 opacity-50"}`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${earned ? badge.earnedColor + " text-white" : "bg-gray-200 text-gray-400"}`}
              >
                {earned ? badge.icon : <Lock className="w-4 h-4" />}
              </div>
              <div className="flex flex-col gap-0.5">
                <p
                  className={`text-xs font-black ${earned ? "text-gray-800" : "text-gray-400"}`}
                >
                  {badge.name}
                </p>
                <p
                  className={`text-xs font-medium leading-snug ${earned ? "text-gray-500" : "text-gray-400"}`}
                >
                  {badge.description}
                </p>
                {earned && earnedDate && (
                  <p className="text-xs font-bold text-gray-400 mt-1">
                    {earnedDate}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BadgeCollection;
