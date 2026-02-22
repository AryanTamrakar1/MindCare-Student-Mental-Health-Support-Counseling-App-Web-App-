import { Star, TrendingUp } from "lucide-react";

const QUESTIONS = [
  {
    key: "professionalism",
    label: "Professionalism",
    description: "How professional was the counselor?",
    color: "bg-indigo-500",
    light: "bg-indigo-50 text-indigo-700 border-indigo-100",
  },
  {
    key: "clarity",
    label: "Clarity",
    description: "How clearly did the counselor communicate?",
    color: "bg-purple-500",
    light: "bg-purple-50 text-purple-700 border-purple-100",
  },
  {
    key: "empathy",
    label: "Empathy",
    description: "How empathetic did the counselor feel?",
    color: "bg-pink-500",
    light: "bg-pink-50 text-pink-700 border-pink-100",
  },
  {
    key: "helpfulness",
    label: "Helpfulness",
    description: "How helpful was the session for the student?",
    color: "bg-emerald-500",
    light: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  {
    key: "overallSatisfaction",
    label: "Overall Satisfaction",
    description: "Overall satisfaction with the session.",
    color: "bg-yellow-500",
    light: "bg-yellow-50 text-yellow-700 border-yellow-100",
  },
];

function getAverage(averages, key) {
  if (!averages) return 0;
  if (averages[key]) return averages[key];
  return 0;
}

const StarDisplay = ({ value, size = 14 }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={size}
        className={
          s <= Math.round(value)
            ? "fill-yellow-400 text-yellow-400"
            : "fill-gray-200 text-gray-200"
        }
      />
    ))}
  </div>
);

const ProgressBar = ({ value, colorClass }) => (
  <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
    <div
      className={`h-full rounded-full transition-all duration-700 ${colorClass}`}
      style={{ width: `${(value / 5) * 100}%` }}
    />
  </div>
);

const RatingBreakdown = ({ averages, weakestLabel, weakVal }) => {
  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
        <div className="px-7 py-5 border-b border-gray-100 flex items-center gap-3">
          <TrendingUp size={18} className="text-indigo-500" />
          <h3 className="text-base font-black text-gray-800">
            Breakdown by Question
          </h3>
        </div>

        <div className="px-7 py-6 flex flex-col gap-6">
          {QUESTIONS.map((q) => {
            const avg = getAverage(averages, q.key);
            return (
              <div key={q.key}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-wider ${q.light}`}
                    >
                      {q.label}
                    </span>
                    <p className="text-xs text-gray-400 font-medium">
                      {q.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <StarDisplay value={avg} size={14} />
                    <span className="text-sm font-black text-gray-700 w-10 text-right">
                      {avg.toFixed(2)}
                    </span>
                  </div>
                </div>
                <ProgressBar value={avg} colorClass={q.color} />
              </div>
            );
          })}
        </div>
      </div>

      
    </>
  );
};

export default RatingBreakdown;
