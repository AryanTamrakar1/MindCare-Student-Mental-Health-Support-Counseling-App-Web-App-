import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";
import { TrendingUp, Minus, TrendingDown } from "lucide-react";

const MoodChart = ({ moodBreakdown }) => {
  const chartData = [
    { label: "Positive", value: moodBreakdown.positive },
    { label: "Neutral", value: moodBreakdown.neutral },
    { label: "Negative", value: moodBreakdown.negative },
  ];

  const statusItems = [
    {
      label: "Positive (Good)",
      value: moodBreakdown.positive,
      color: "bg-indigo-500",
      icon: TrendingUp,
    },
    {
      label: "Neutral (Average)",
      value: moodBreakdown.neutral,
      color: "bg-yellow-400",
      icon: Minus,
    },
    {
      label: "Negative",
      value: moodBreakdown.negative,
      color: "bg-red-400",
      icon: TrendingDown,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-full flex flex-col">
      <p className="text-[11px] font-black text-gray-800 uppercase tracking-widest mb-1">
        Student Mood Breakdown
      </p>
      <p className="text-gray-400 text-xs mb-4">
        Based on all weekly quiz submissions
      </p>
      <div className="border-b border-gray-100 mb-5"></div>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 10, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fontWeight: "bold" }}
              label={{
                value: "Mood Category",
                position: "insideBottom",
                offset: -15,
                fontSize: 11,
                fill: "#6b7280",
              }}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              allowDecimals={false}
              label={{
                value: "Students",
                angle: -90,
                position: "insideLeft",
                offset: 10,
                fontSize: 11,
                fill: "#6b7280",
              }}
            />
            <Tooltip />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              <LabelList
                dataKey="value"
                position="top"
                style={{ fontSize: 11, fontWeight: "bold", fill: "#374151" }}
              />
              {chartData.map((entry, index) => {
                const colors = ["#4f46e5", "#f59e0b", "#ef4444"];
                return <Cell key={index} fill={colors[index]} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="border-t border-gray-100 mt-5 pt-4">
        <p className="text-[11px] font-black text-gray-800 uppercase tracking-widest mb-3">
          Mood Breakdown
        </p>
        <div className="flex flex-wrap gap-3">
          {statusItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <span className="text-xs font-bold text-gray-600">
                  {item.label}: {item.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MoodChart;
