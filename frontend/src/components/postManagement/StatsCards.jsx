import { FileText, MessageSquare } from "lucide-react";

const StatsCards = ({ totalPosts, totalReplies }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
          <FileText size={22} className="text-indigo-600" />
        </div>
        <div>
          <p className="text-2xl font-black text-gray-800">{totalPosts}</p>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
            Total Posts
          </p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
          <MessageSquare size={22} className="text-indigo-600" />
        </div>
        <div>
          <p className="text-2xl font-black text-gray-800">{totalReplies}</p>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
            Total Replies
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
