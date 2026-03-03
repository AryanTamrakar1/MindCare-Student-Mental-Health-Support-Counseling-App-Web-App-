import {
  Users,
  UserCheck,
  CalendarCheck,
  FileText,
  MessageSquare,
  Star,
} from "lucide-react";

const cards = [
  {
    key: "totalStudents",
    label: "Total Students",
    icon: Users,
    color: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    key: "totalCounselors",
    label: "Approved Counselors",
    icon: UserCheck,
    color: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    key: "totalSessions",
    label: "Completed Sessions",
    icon: CalendarCheck,
    color: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  {
    key: "totalPosts",
    label: "Forum Posts",
    icon: FileText,
    color: "bg-yellow-50",
    iconColor: "text-yellow-600",
  },
  {
    key: "totalReplies",
    label: "Forum Replies",
    icon: MessageSquare,
    color: "bg-pink-50",
    iconColor: "text-pink-600",
  },
  {
    key: "averageRating",
    label: "Avg Counselor Rating",
    icon: Star,
    color: "bg-orange-50",
    iconColor: "text-orange-500",
  },
];

const OverviewCards = ({ data }) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.key}
            className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm"
          >
            <div
              className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center`}
            >
              <Icon size={22} className={card.iconColor} />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-800">
                {data[card.key]}
              </p>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                {card.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OverviewCards;
