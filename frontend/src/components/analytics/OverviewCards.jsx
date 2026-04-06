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
    bg: "bg-blue-50",
    border: "border-blue-300",
    iconColor: "text-blue-600",
  },
  {
    key: "totalCounselors",
    label: "Approved Counselors",
    icon: UserCheck,
    bg: "bg-green-50",
    border: "border-green-300",
    iconColor: "text-green-600",
  },
  {
    key: "totalSessions",
    label: "Completed Sessions",
    icon: CalendarCheck,
    bg: "bg-blue-50",
    border: "border-blue-300",
    iconColor: "text-blue-600",
  },
  {
    key: "totalPosts",
    label: "Forum Posts",
    icon: FileText,
    bg: "bg-yellow-50",
    border: "border-yellow-300",
    iconColor: "text-yellow-600",
  },
  {
    key: "totalReplies",
    label: "Forum Replies",
    icon: MessageSquare,
    bg: "bg-red-50",
    border: "border-red-300",
    iconColor: "text-red-600",
  },
  {
    key: "averageRating",
    label: "Avg Counselor Rating",
    icon: Star,
    bg: "bg-orange-50",
    border: "border-orange-300",
    iconColor: "text-orange-600",
  },
];

const OverviewCards = ({ data }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.key}
            className="bg-white border border-blue-200 px-6 py-5 flex items-center gap-5"
          >
            <div
              className={`w-12 h-12 ${card.bg} border ${card.border} flex items-center justify-center flex-shrink-0`}
            >
              <Icon size={22} className={card.iconColor} strokeWidth={2} />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 leading-none">
                {data[card.key]}
              </p>
              <p className="text-sm font-medium text-gray-500 mt-1.5">
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
