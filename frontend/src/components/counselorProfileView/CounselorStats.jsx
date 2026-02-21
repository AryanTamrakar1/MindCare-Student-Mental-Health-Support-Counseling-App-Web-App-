import { Star, Users, GraduationCap } from "lucide-react";

const CounselorStats = ({ counselor, counselorStats }) => {
  return (
    <div className="grid grid-cols-3 border-b border-gray-100 bg-[#f8fafc]">
      <div className="flex flex-col items-center justify-center py-8 border-r-2 border-slate-200 gap-1.5">
        <div className="flex items-center gap-2">
          <GraduationCap size={22} className="text-indigo-400" />
          <span className="text-xl font-black text-gray-800">
            {counselor.experience || 0}+ Yrs
          </span>
        </div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Experience
        </p>
      </div>
      <div className="flex flex-col items-center justify-center py-8 border-r-2 border-slate-200 gap-1.5">
        <div className="flex items-center gap-2">
          <Users size={22} className="text-indigo-400" />
          <span className="text-xl font-black text-gray-800">
            {counselorStats.studentsHelped}
          </span>
        </div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Students Helped
        </p>
      </div>
      <div className="flex flex-col items-center justify-center py-8 gap-1.5">
        <div className="flex items-center gap-2">
          <Star size={22} className="text-yellow-400 fill-yellow-400" />
          <span className="text-xl font-black text-gray-800">
            {counselorStats.overall > 0
              ? counselorStats.overall.toFixed(1)
              : "0.0"}
          </span>
        </div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Rating
        </p>
      </div>
    </div>
  );
};

export default CounselorStats;
