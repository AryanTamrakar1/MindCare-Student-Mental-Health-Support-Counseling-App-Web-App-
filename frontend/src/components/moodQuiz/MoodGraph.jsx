import React, { useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

function formatDisplayDate(weekLabel) {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const shortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  for (let i = 0; i < monthNames.length; i++) {
    if (weekLabel.includes(monthNames[i])) {
      const day = weekLabel.replace(monthNames[i], "").replace("2026", "").replace("2025", "").trim();
      return shortNames[i] + " " + day;
    }
  }
  return weekLabel;
}

const MoodGraph = ({ history }) => {
  const [tooltip, setTooltip] = useState(null);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!history || history.length === 0) {
    return (
      <div
        className="bg-white border border-[#DBEAFE] px-8 py-10 text-center"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <p className="text-[14px] text-[#94A3B8]">
          No mood history yet. Complete your first quiz!
        </p>
      </div>
    );
  }

  const sorted = history.slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const w = 700;
  const h = 260;
  const pl = 44;
  const pr = 24;
  const pt = 20;
  const pb = 48;
  const chartW = w - pl - pr;
  const chartH = h - pt - pb;

  const yLabels = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  const getX = (i) =>
    pl +
    (sorted.length === 1 ? chartW / 2 : (i / (sorted.length - 1)) * chartW);
  const getY = (score) => pt + chartH - (score / 100) * chartH;

  const points = sorted.map((entry, i) => ({
    x: getX(i),
    y: getY(entry.moodScore),
    score: entry.moodScore,
    date: formatDisplayDate(entry.weekLabel),
    week: entry.weekLabel,
  }));

  const uniquePoints = points.filter(
    (p, i, arr) => i === 0 || p.week !== arr[i - 1].week,
  );
  const pathD = uniquePoints
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const maxLabels = 6;
  const labelStep = Math.max(1, Math.ceil(uniquePoints.length / maxLabels));
  const labelSet = new Set();
  for (let i = 0; i < uniquePoints.length; i += labelStep) labelSet.add(i);
  if (uniquePoints.length > 0) labelSet.add(uniquePoints.length - 1);

  function getScoreColor(score) {
    if (score >= 90) return "#2563EB";
    if (score >= 80) return "#2563EB";
    if (score >= 70) return "#2563EB";
    if (score >= 60) return "#2563EB";
    if (score >= 40) return "#2563EB";
    return "#2563EB";
  }

  function getScoreLabel(score) {
    if (score >= 90) return "Feeling Great";
    if (score >= 80) return "Feeling Good";
    if (score >= 70) return "Doing Well";
    if (score >= 60) return "Doing Okay";
    if (score >= 40) return "Not Doing Okay";
    return "Struggling";
  }

  const lastScore = uniquePoints[uniquePoints.length - 1]?.score;

  let totalScore = 0;
  for (let i = 0; i < uniquePoints.length; i++) {
    totalScore += uniquePoints[i].score;
  }
  const avgScore = uniquePoints.length > 0 ? Math.round(totalScore / uniquePoints.length) : 0;

  let highScore = 0;
  if (uniquePoints.length > 0) {
    highScore = uniquePoints[0].score;
    for (let i = 1; i < uniquePoints.length; i++) {
      if (uniquePoints[i].score > highScore) {
        highScore = uniquePoints[i].score;
      }
    }
  }

  const highScoreDateIdx = uniquePoints.length > 0 ? uniquePoints.findIndex(p => p.score === highScore) : -1;
  const highScoreDate = highScoreDateIdx !== -1 ? uniquePoints[highScoreDateIdx].date : "";

  const lineColor = "#2563EB";

  return (
    <div
      className="bg-white border border-[#DBEAFE] overflow-hidden"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="px-8 pt-7 pb-5">
        <p className="text-[19px] font-bold text-[#111827]">Mood History</p>
        <p className="text-[14px] text-[#6B7280] mt-1">
          Your weekly mood score over time
        </p>
      </div>

      <div className="grid grid-cols-3 border-t border-b border-[#F1F5F9] divide-x divide-[#F1F5F9]">
        <div className="px-8 py-4">
          <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest mb-1.5">
            Latest
          </p>
          <div className="flex items-baseline gap-1.5">
            <p
              className="text-[22px] font-bold tabular-nums leading-none"
              style={{ color: "#2563EB" }}
            >
              {lastScore}%
            </p>
            <span
              className="text-[22px] font-bold leading-none"
              style={{ color: "#2563EB" }}
            >
              -{getScoreLabel(lastScore)}
            </span>
          </div>
        </div>
        <div className="px-8 py-4">
          <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest mb-1.5">
            Average
          </p>
          <div className="flex items-baseline gap-1.5">
            <p
              className="text-[22px] font-bold tabular-nums leading-none"
              style={{ color: "#2563EB" }}
            >
              {avgScore}%
            </p>
            <span
              className="text-[22px] font-bold leading-none"
              style={{ color: "#2563EB" }}
            >
              -{getScoreLabel(avgScore)}
            </span>
          </div>
        </div>
        <div className="px-8 py-4">
          <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest mb-1.5">
            Best Mood Week
          </p>
          <div className="flex items-baseline gap-1.5">
            <p
              className="text-[22px] font-bold tabular-nums leading-none"
              style={{ color: "#2563EB" }}
            >
              {highScore}%
            </p>
            <span
              className="text-[22px] font-bold leading-none"
              style={{ color: "#2563EB" }}
            >
              - {highScoreDate}
            </span>
          </div>
        </div>
      </div>

      <div style={{ position: "relative" }} className="px-4 pb-4 pt-2">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
          {yLabels.map((label) => {
            const y = getY(label);
            return (
              <g key={label}>
                <line
                  x1={pl}
                  y1={y}
                  x2={w - pr}
                  y2={y}
                  stroke={label === 0 ? "#CBD5E1" : "#F1F5F9"}
                  strokeWidth={label === 0 ? "1.5" : "1"}
                  strokeDasharray={label === 0 ? "0" : "4 3"}
                />
                <text
                  x={pl - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="#94A3B8"
                  fontWeight="600"
                >
                  {label}
                </text>
              </g>
            );
          })}
          <line x1={pl} y1={pt} x2={pl} y2={pt + chartH} stroke="#CBD5E1" strokeWidth="1.5" />
          <line x1={pl} y1={pt + chartH} x2={w - pr} y2={pt + chartH} stroke="#CBD5E1" strokeWidth="1.5" />
          <text x={10} y={pt + chartH / 2} textAnchor="middle" fontSize="10" fill="#CBD5E1" transform={`rotate(-90, 10, ${pt + chartH / 2})`}>
            Score %
          </text>
          <text x={pl + chartW / 2} y={h - 2} textAnchor="middle" fontSize="10" fill="#CBD5E1">
            Week
          </text>
          {hoveredIdx !== null && uniquePoints[hoveredIdx] && (
            <line
              x1={uniquePoints[hoveredIdx].x}
              y1={pt}
              x2={uniquePoints[hoveredIdx].x}
              y2={pt + chartH}
              stroke="#E2E8F0"
              strokeWidth="1"
              strokeDasharray="4 3"
              style={{ pointerEvents: "none" }}
            />
          )}
          <path
            d={pathD}
            fill="none"
            stroke={lineColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {uniquePoints.map((p, i) => {
            const isHovered = hoveredIdx === i;
            const dotColor = getScoreColor(p.score);
            return (
              <g key={i}>
                {labelSet.has(i) && (
                  <text x={p.x} y={pt + chartH + 18} textAnchor="middle" fontSize="10" fill="#94A3B8" fontWeight="500">
                    {p.date}
                  </text>
                )}
                {isHovered && (
                  <circle cx={p.x} cy={p.y} r="9" fill="white" stroke={dotColor} strokeWidth="1.5" opacity="0.3" style={{ pointerEvents: "none" }} />
                )}
                <circle
                  cx={p.x} cy={p.y} r="12" fill="transparent"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => { setTooltip(p); setHoveredIdx(i); }}
                  onMouseLeave={() => { setTooltip(null); setHoveredIdx(null); }}
                />
                <circle cx={p.x} cy={p.y} r={isHovered ? "5" : "3.5"} fill="white" stroke={dotColor} strokeWidth="2.5" style={{ pointerEvents: "none" }} />
              </g>
            );
          })}
        </svg>
        {tooltip && (
          <div
            style={{
              position: "absolute",
              left: `${(tooltip.x / w) * 100}%`,
              top: `${(tooltip.y / h) * 100}%`,
              transform: "translate(-50%, -140%)",
              pointerEvents: "none",
            }}
            className="bg-[#111827] text-white px-4 py-2.5 whitespace-nowrap shadow-xl"
          >
            <p className="text-[15px] font-bold tabular-nums" style={{ color: getScoreColor(tooltip.score) }}>
              {tooltip.score}%
            </p>
            <p className="text-[12px] text-[#94A3B8] mt-0.5">{tooltip.date}</p>
            <div
              style={{
                position: "absolute", bottom: "-5px", left: "50%",
                transform: "translateX(-50%)", width: 0, height: 0,
                borderLeft: "5px solid transparent", borderRight: "5px solid transparent",
                borderTop: "5px solid #111827",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodGraph;