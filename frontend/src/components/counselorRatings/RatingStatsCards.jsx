import { Star, Users, Award } from "lucide-react";

const StarDisplay = ({ value, size = 16 }) => (
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

const RatingStatsCards = ({
  overall,
  totalRatings,
  strongestLabel,
  strongestVal,
}) => {
  return (
    <div className="grid grid-cols-3 gap-5 mb-8">
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-5 col-span-1">
        <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-yellow-100">
          <Star size={28} className="text-yellow-400 fill-yellow-400" />
        </div>
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
            Overall Rating
          </p>
          <p className="text-4xl font-black text-gray-800 leading-none">
            {overall.toFixed(1)}
            <span className="text-lg text-gray-400 font-bold"> /5</span>
          </p>
          <div className="mt-2">
            <StarDisplay value={overall} size={16} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-5">
        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-indigo-100">
          <Users size={26} className="text-indigo-500" />
        </div>
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
            Total Ratings
          </p>
          <p className="text-4xl font-black text-gray-800 leading-none">
            {totalRatings}
          </p>
          <p className="text-xs text-gray-400 font-bold mt-1">from students</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-5">
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-emerald-100">
          <Award size={26} className="text-emerald-500" />
        </div>
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
            Strongest Area
          </p>
          <p className="text-base font-black text-gray-800 leading-tight">
            {strongestLabel}
          </p>
          <p className="text-xs text-gray-400 font-bold mt-1">
            {strongestVal.toFixed(2)} / 5
          </p>
        </div>
      </div>
    </div>
  );
};

export default RatingStatsCards;
