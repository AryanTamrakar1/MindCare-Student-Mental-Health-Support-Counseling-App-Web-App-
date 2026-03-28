import React from "react";
import { Leaf, Sprout, Flower2, Mountain, Sun } from "lucide-react";

const LevelBadge = ({ level, levelTitle, points, nextLevelPoints }) => {
  const LEVEL_THRESHOLDS = [0, 100, 200, 300, 400];

  function getLevelIcon() {
    if (level === 1) return <Leaf className="w-6 h-6 text-white" />;
    if (level === 2) return <Sprout className="w-6 h-6 text-white" />;
    if (level === 3) return <Flower2 className="w-6 h-6 text-white" />;
    if (level === 4) return <Mountain className="w-6 h-6 text-white" />;
    if (level === 5) return <Sun className="w-6 h-6 text-white" />;
    return <Leaf className="w-6 h-6 text-white" />;
  }

  function getLevelColor() {
    if (level === 1) return "from-blue-400 to-blue-600";
    if (level === 2) return "from-blue-500 to-blue-700";
    if (level === 3) return "from-blue-600 to-blue-800";
    if (level === 4) return "from-blue-700 to-blue-900";
    if (level === 5) return "from-blue-800 to-blue-950";
    return "from-blue-400 to-blue-600";
  }

  function getProgressPercent() {
    if (level >= 5) return 100;
    const currentLevelStart = LEVEL_THRESHOLDS[level - 1];
    const pointsSinceCurrentLevel = points - currentLevelStart;
    const pointsNeededForThisLevel = nextLevelPoints - currentLevelStart;
    const percent = Math.round(
      (pointsSinceCurrentLevel / pointsNeededForThisLevel) * 100,
    );
    if (percent < 0) return 0;
    if (percent > 100) return 100;
    return percent;
  }

  const progressPercent = getProgressPercent();

  const LEVEL_LIST = [
    {
      label: "Trying",
      color: "text-blue-400",
      icon: <Leaf className="w-3 h-3" />,
    },
    {
      label: "Healing",
      color: "text-blue-500",
      icon: <Sprout className="w-3 h-3" />,
    },
    {
      label: "Blooming",
      color: "text-blue-600",
      icon: <Flower2 className="w-3 h-3" />,
    },
    {
      label: "Thriving",
      color: "text-blue-700",
      icon: <Mountain className="w-3 h-3" />,
    },
    {
      label: "Mindful",
      color: "text-blue-800",
      icon: <Sun className="w-3 h-3" />,
    },
  ];

  return (
    <div className="bg-white border border-[#E5E7EB] flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center gap-4">
        <div
          className={`w-14 h-14 bg-gradient-to-br ${getLevelColor()} flex items-center justify-center shadow-md shrink-0`}
        >
          {getLevelIcon()}
        </div>
        <div>
          <p className="text-xs font-black text-gray-800 uppercase tracking-widest">
            Current Level
          </p>
          <h3 className="text-xl font-black text-gray-800">
            Level {level} — {levelTitle}
          </h3>
        </div>
      </div>

      <div className="px-6 py-5 flex flex-col gap-4 flex-1">
        <div>
          <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
            <span>{points} pts earned</span>
            {level < 5 && <span>Next level at {nextLevelPoints} pts</span>}
            {level >= 5 && <span>Maximum level reached!</span>}
          </div>
          <div className="w-full h-3 bg-gray-100 overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${getLevelColor()} transition-all duration-500`}
              style={{ width: progressPercent + "%" }}
            />
          </div>
          <p className="text-xs text-gray-400 font-semibold mt-1.5 text-right">
            {progressPercent}% to next level
          </p>
        </div>

        <div className="flex justify-between mt-auto pt-4 border-t border-gray-100">
          {LEVEL_LIST.map(function (item, index) {
            const isReached = index + 1 <= level;
            return (
              <div
                key={item.label}
                className={`flex items-center gap-1 ${isReached ? item.color : "text-gray-300"}`}
              >
                {item.icon}
                <span className="text-xs font-bold">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LevelBadge;