import React from "react";
import { Leaf, Sprout, Flower2, Mountain, Triangle } from "lucide-react";

const LevelBadge = ({ level, levelTitle, points, nextLevelPoints }) => {
  const LEVEL_THRESHOLDS = [0, 100, 250, 500, 800];

  function getLevelIcon() {
    if (level === 1) return <Leaf className="w-6 h-6 text-white" />;
    if (level === 2) return <Sprout className="w-6 h-6 text-white" />;
    if (level === 3) return <Flower2 className="w-6 h-6 text-white" />;
    if (level === 4) return <Mountain className="w-6 h-6 text-white" />;
    if (level === 5) return <Triangle className="w-6 h-6 text-white" />;
    return <Leaf className="w-6 h-6 text-white" />;
  }

  function getLevelColor() {
    if (level === 1) return "from-green-400 to-green-600";
    if (level === 2) return "from-teal-400 to-teal-600";
    if (level === 3) return "from-pink-400 to-pink-600";
    if (level === 4) return "from-indigo-400 to-indigo-600";
    if (level === 5) return "from-amber-400 to-amber-600";
    return "from-green-400 to-green-600";
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
      label: "Seedling",
      color: "text-green-500",
      icon: <Leaf className="w-3 h-3" />,
    },
    {
      label: "Climber",
      color: "text-teal-500",
      icon: <Sprout className="w-3 h-3" />,
    },
    {
      label: "Mindful",
      color: "text-pink-500",
      icon: <Flower2 className="w-3 h-3" />,
    },
    {
      label: "Sherpa",
      color: "text-indigo-500",
      icon: <Mountain className="w-3 h-3" />,
    },
    {
      label: "Summit",
      color: "text-amber-500",
      icon: <Triangle className="w-3 h-3" />,
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-black/10 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getLevelColor()} flex items-center justify-center shadow-md`}
        >
          {getLevelIcon()}
        </div>
        <div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
            Current Level
          </p>
          <h3 className="text-xl font-black text-gray-800">
            Level {level} — {levelTitle}
          </h3>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
          <span>{points} pts earned</span>
          {level < 5 && <span>Next level at {nextLevelPoints} pts</span>}
          {level >= 5 && <span>Maximum level reached!</span>}
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${getLevelColor()} transition-all duration-500`}
            style={{ width: progressPercent + "%" }}
          />
        </div>
        <p className="text-xs text-gray-400 font-semibold mt-1.5 text-right">
          {progressPercent}% to next level
        </p>
      </div>

      <div className="flex justify-between mt-1">
        {LEVEL_LIST.map(function (item) {
          return (
            <div
              key={item.label}
              className={`flex items-center gap-1 ${item.color}`}
            >
              {item.icon}
              <span className="text-xs font-bold">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LevelBadge;
