import { Star, Users, Award, TrendingUp } from "lucide-react";

const StarDisplay = ({ value, size = 15 }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={size}
        className={
          s <= Math.round(value)
            ? "fill-yellow-400 text-yellow-400"
            : "fill-[#E2E8F0] text-[#E2E8F0]"
        }
      />
    ))}
  </div>
);

const RatingStatsCards = ({ overall, totalRatings, strongestLabel, strongestVal }) => {
  let scoreLevel = "Needs Work";
  if (overall >= 4.5) scoreLevel = "Excellent";
  else if (overall >= 3.5) scoreLevel = "Good";
  else if (overall >= 2.5) scoreLevel = "Average";

  let scoreLevelColor = "text-red-500";
  if (overall >= 4.5) scoreLevelColor = "text-green-600";
  else if (overall >= 3.5) scoreLevelColor = "text-[#2563EB]";
  else if (overall >= 2.5) scoreLevelColor = "text-yellow-600";

  const cards = [
    {
      key: "overall",
      icon: Star,
      bg: "bg-yellow-50", border: "border-yellow-200", iconColor: "text-yellow-500",
      value: overall.toFixed(1),
      label: "Overall Rating",
      sub: <StarDisplay value={overall} size={13} />,
    },
    {
      key: "totalRatings",
      icon: Users,
      bg: "bg-[#EFF6FF]", border: "border-[#DBEAFE]", iconColor: "text-[#2563EB]",
      value: totalRatings,
      label: "Total Ratings",
      sub: <span className="text-[13px] text-[#6B7280]">from students</span>,
    },
    {
      key: "strongest",
      icon: Award,
      bg: "bg-emerald-50", border: "border-emerald-200", iconColor: "text-emerald-600",
      value: strongestLabel,
      label: "Strongest Area",
      sub: <span className="text-[13px] text-[#6B7280]">{strongestVal.toFixed(2)} / 5 avg</span>,
      smallValue: true,
    },
    {
      key: "level",
      icon: TrendingUp,
      bg: "bg-[#EFF6FF]", border: "border-[#DBEAFE]", iconColor: "text-[#1D4ED8]",
      value: scoreLevel,
      label: "Score Level",
      sub: <span className="text-[13px] text-[#6B7280]">{overall.toFixed(2)} weighted avg</span>,
      smallValue: true,
      valueColor: scoreLevelColor,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-5 mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.key} className="bg-white border border-[#DBEAFE] px-6 py-5 flex items-center gap-5">
            <div className={`w-12 h-12 ${card.bg} border ${card.border} flex items-center justify-center flex-shrink-0`}>
              <Icon size={22} className={card.iconColor} strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className={`font-bold leading-none ${card.smallValue ? "text-[20px]" : "text-[28px]"} ${card.valueColor || "text-[#111827]"} truncate`}>
                {card.value}
              </p>
              <p className="text-[13px] font-medium text-[#6B7280] mt-1.5">{card.label}</p>
              {card.sub && <div className="mt-1.5">{card.sub}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RatingStatsCards;