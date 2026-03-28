import { FileText, MessageSquare } from "lucide-react";

const StatsCards = ({ totalPosts, totalReplies }) => {
  return (
    <div className="grid grid-cols-2 gap-4 flex-shrink-0">
      <div className="bg-white border border-[#E5E9F2] px-5 py-5 flex items-center gap-4">
        <div className="w-11 h-11 bg-[#EEF2FF] flex items-center justify-center flex-shrink-0">
          <FileText size={19} className="text-[#2563EB]" strokeWidth={2} />
        </div>
        <div>
          <p className="text-[30px] font-bold text-[#111827] leading-none">{totalPosts}</p>
          <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-widest mt-1.5">Total Posts</p>
        </div>
      </div>
      <div className="bg-white border border-[#E5E9F2] px-5 py-5 flex items-center gap-4">
        <div className="w-11 h-11 bg-[#EEF2FF] flex items-center justify-center flex-shrink-0">
          <MessageSquare size={19} className="text-[#2563EB]" strokeWidth={2} />
        </div>
        <div>
          <p className="text-[30px] font-bold text-[#111827] leading-none">{totalReplies}</p>
          <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-widest mt-1.5">Total Replies</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;