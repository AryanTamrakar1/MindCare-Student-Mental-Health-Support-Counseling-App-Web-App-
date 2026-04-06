import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { useCounselorDashboard } from "../../hooks/counselorDashboard/useCounselorDashboard";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        className="bg-[#0F172A] text-white px-3 py-2 shadow-xl"
      >
        <p className="text-[#64748B] text-[12px] mb-0.5 font-medium">{label}</p>
        <p className="font-bold text-[13px]">{payload[0].value} sessions</p>
      </div>
    );
  }
  return null;
};

const SessionCompletionChart = ({ selectedYear }) => {
  const { allSessions } = useCounselorDashboard();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = [];
  for (let i = 0; i < 12; i++) {
    let count = 0;
    for (let j = 0; j < allSessions.length; j++) {
      const session = allSessions[j];
      const d = new Date(session.createdAt);
      if (
        session.status === "Completed" &&
        d.getMonth() === i &&
        d.getFullYear() === selectedYear
      ) {
        count += 1;
      }
    }
    chartData.push({ month: MONTHS[i], Completed: count });
  }

  if (!mounted) return null;

  let maxVal = 0;
  for (let i = 0; i < chartData.length; i++) {
    if (chartData[i].Completed > maxVal) {
      maxVal = chartData[i].Completed;
    }
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={chartData}
        margin={{ top: 4, right: 4, bottom: 0, left: -16 }}
        barCategoryGap="35%"
      >
        <CartesianGrid
          strokeDasharray="4 4"
          stroke="#F1F5F9"
          vertical={false}
        />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 13, fontWeight: 600, fill: "#94A3B8" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#94A3B8" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#EFF6FF" }} />
        <Bar dataKey="Completed" radius={0} >
          {chartData.map((entry, index) => {
            let barFill = "#BFDBFE";
            if (entry.Completed === maxVal && maxVal > 0) {
              barFill = "#1D4ED8";
            }
            return <Cell key={index} fill={barFill} />;
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SessionCompletionChart;