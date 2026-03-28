import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useMoodScore } from "../../hooks/studentDashboard/useMoodScore";

const COLORS = [
  "#1E3A8A",
  "#1E40AF",
  "#1D4ED8",
  "#2563EB",
  "#3B82F6",
  "#60A5FA",
  "#0284C7",
  "#0EA5E9",
  "#38BDF8",
  "#7DD3FC",
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        className="bg-[#0F172A] text-white px-3 py-2 shadow-xl"
      >
        <span className="font-medium text-[13px]">{payload[0].name}:</span>{" "}
        <span className="font-bold text-[13px] text-[#93C5FD]">
          {payload[0].value}/5
        </span>
      </div>
    );
  }
  return null;
};

const MoodScoreCard = () => {
  const { analysis, loading } = useMoodScore();
  const [active, setActive] = useState(null);

  function getScoreLabel(val) {
    if (val >= 4.5) return "Excellent";
    if (val >= 3.5) return "Good";
    if (val >= 2.5) return "Fair";
    if (val >= 1.5) return "Low";
    return "Poor";
  }

  function getScoreColor(val) {
    if (val >= 4.5) return "#1D4ED8"; 
    if (val >= 3.5) return "#2563EB"; 
    if (val >= 2.5) return "#93C5FD"; 
    if (val >= 1.5) return "#F97316"; 
    return "#EF4444";
  }

  if (loading) {
    return (
      <div
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        className="bg-white border border-[#DBEAFE]"
      >
        <div className="px-6 py-4 border-b border-[#DBEAFE]">
          <p className="text-[17px] font-bold text-[#0F172A] tracking-tight">
            Wellness Breakdown
          </p>
          <p className="text-[13px] text-[#94A3B8] mt-0.5">
            Your average score per wellness category
          </p>
        </div>
        <div className="p-6">
          <p className="text-[15px] text-[#94A3B8]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!analysis || !analysis.hasEnoughData || !analysis.categoryAverages) {
    return (
      <div
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        className="bg-white border border-[#DBEAFE]"
      >
        <div className="px-6 py-4 border-b border-[#DBEAFE]">
          <p className="text-[17px] font-bold text-[#0F172A] tracking-tight">
            Wellness Breakdown
          </p>
          <p className="text-[13px] text-[#94A3B8] mt-0.5">
            Your average score per wellness category
          </p>
        </div>
        <div className="p-6">
          <p className="text-[15px] text-[#94A3B8]">
            Complete your first quiz to see your breakdown.
          </p>
        </div>
      </div>
    );
  }

  const chartData = [];
  const categoryEntries = Object.entries(analysis.categoryAverages);
  for (let i = 0; i < categoryEntries.length; i++) {
    const name = categoryEntries[i][0];
    const value = categoryEntries[i][1];
    chartData.push({ name, value });
  }

  let total = 0;
  for (let i = 0; i < chartData.length; i++) {
    total = total + chartData[i].value;
  }
  const avgOverall = (total / chartData.length).toFixed(1);

  let centerValue = avgOverall;
  let centerSub = "avg / 5";
  let centerName = "";

  if (active !== null) {
    if (chartData[active]) {
      centerValue = chartData[active].value;
      centerSub = "/ 5";
      centerName = chartData[active].name;
    }
  }

  let showCenterName = false;
  if (centerName.length > 0) {
    showCenterName = true;
  }

  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className="bg-white border border-[#DBEAFE] flex flex-col"
    >
      <div className="px-6 py-4 border-b border-[#DBEAFE]">
        <p className="text-[17px] font-bold text-[#0F172A] tracking-tight">
          Wellness Breakdown
        </p>
        <p className="text-[13px] text-[#94A3B8] mt-0.5">
          Your average score per wellness category
        </p>
      </div>

      <div className="p-6 flex flex-col gap-5">
        <div style={{ width: "100%", height: 260, position: "relative" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={68}
                outerRadius={130}
                dataKey="value"
                strokeWidth={3}
                stroke="#EFF6FF"
                onMouseEnter={function (_, index) {
                  setActive(index);
                }}
                onMouseLeave={function () {
                  setActive(null);
                }}
              >
                {chartData.map(function (entry, index) {
                  let opacity = 1;
                  if (active !== null) {
                    if (active !== index) {
                      opacity = 0.2;
                    }
                  }

                  return (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                      opacity={opacity}
                    />
                  );
                })}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <span className="text-[40px] font-bold text-[#0F172A] leading-none">
              {centerValue}
            </span>
            <span className="text-[13px] text-[#94A3B8] font-medium mt-1">
              {centerSub}
            </span>
            {showCenterName && (
              <span className="text-[12px] text-[#2563EB] font-semibold mt-1.5 text-center leading-tight px-4">
                {centerName}
              </span>
            )}
          </div>
        </div>

        <div className="border border-[#DBEAFE]">
          <div className="px-4 py-3 border-b border-[#DBEAFE] bg-[#F8FAFF]">
            <p className="text-[14px] font-semibold text-[#475569] uppercase tracking-[0.08em]">
              Category Scores
            </p>
          </div>
          <div className="divide-y divide-[#EFF6FF]">
            {chartData.map(function (entry, index) {
              const barWidth = Math.round((entry.value / 5) * 100);
              return (
                <div
                  key={entry.name}
                  className="flex items-center gap-3 px-4 py-3"
                  onMouseEnter={() => setActive(index)}
                  onMouseLeave={() => setActive(null)}
                  style={{
                    background: active === index ? "#EFF6FF" : "transparent",
                    cursor: "default",
                    transition: "background 0.1s",
                  }}
                >
                  <div
                    className="w-2.5 h-2.5 shrink-0"
                    style={{ background: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-[14px] font-medium text-[#374151] flex-1 truncate">
                    {entry.name}
                  </span>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <div className="w-[56px] h-1.5 bg-[#EFF6FF] overflow-hidden">
                      <div
                        className="h-full transition-all duration-300"
                        style={{
                          width: barWidth + "%",
                          background: COLORS[index % COLORS.length],
                        }}
                      />
                    </div>
                    <span
                      className="text-[14px] font-bold w-[20px] text-right"
                      style={{ color: COLORS[index % COLORS.length] }}
                    >
                      {entry.value}
                    </span>
                    <span
                      className="text-[13px] font-semibold w-[56px] text-right"
                      style={{ color: getScoreColor(entry.value) }}
                    >
                      {getScoreLabel(entry.value)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodScoreCard;