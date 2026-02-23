import React, { useState } from "react";

function weekToDate(weekLabel) {
  const parts = weekLabel.split("-W");
  const year = parseInt(parts[0]);
  const week = parseInt(parts[1]);
  const jan4 = new Date(year, 0, 4);
  const startOfWeek1 = new Date(jan4);
  startOfWeek1.setDate(jan4.getDate() - jan4.getDay() + 1);
  const d = new Date(startOfWeek1);
  d.setDate(d.getDate() + (week - 1) * 7);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const MoodGraph = ({ history }) => {
  const [tooltip, setTooltip] = useState(null);

  if (!history || history.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-10 border border-black/10 text-center">
        <p className="text-sm text-gray-400">No mood history yet. Complete your first quiz!</p>
      </div>
    );
  }

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
    pl + (history.length === 1 ? chartW / 2 : (i / (history.length - 1)) * chartW);
  const getY = (score) => pt + chartH - (score / 100) * chartH;

  const points = history.map((entry, i) => ({
    x: getX(i),
    y: getY(entry.moodScore),
    score: entry.moodScore,
    date: weekToDate(entry.weekLabel),
    week: entry.weekLabel,
  }));

  const uniquePoints = points.filter((p, i, arr) => i === 0 || p.week !== arr[i - 1].week);

  const pathD = uniquePoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaD = uniquePoints.length > 0
    ? `${pathD} L ${uniquePoints[uniquePoints.length - 1].x} ${pt + chartH} L ${uniquePoints[0].x} ${pt + chartH} Z`
    : "";

  const maxLabels = 6;
  const labelStep = Math.max(1, Math.ceil(uniquePoints.length / maxLabels));
  const labelSet = new Set();
  for (let i = 0; i < uniquePoints.length; i += labelStep) labelSet.add(i);
  if (uniquePoints.length > 0) labelSet.add(uniquePoints.length - 1);

  function getScoreColor(score) {
    if (score >= 80) return "#22c55e";
    if (score >= 60) return "#3b82f6";
    if (score >= 40) return "#f59e0b";
    return "#ef4444";
  }

  const lastScore = uniquePoints[uniquePoints.length - 1]?.score;
  const lineColor = getScoreColor(lastScore);

  return (
    <div className="bg-white rounded-2xl border border-black/10 overflow-hidden">
      <div className="px-6 pt-5 pb-2 flex items-center justify-between">
        <p className="text-xs text-gray-400 uppercase tracking-widest">Score trend</p>
        {uniquePoints.length >= 2 && (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <span>Latest:</span>
            <span className="font-bold" style={{ color: lineColor }}>{lastScore}%</span>
          </div>
        )}
      </div>

      <div style={{ position: "relative" }}>
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity="0.15" />
              <stop offset="100%" stopColor={lineColor} stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {yLabels.map((label) => {
            const y = getY(label);
            return (
              <g key={label}>
                <line
                  x1={pl}
                  y1={y}
                  x2={w - pr}
                  y2={y}
                  stroke={label === 0 ? "#e5e7eb" : "#f3f4f6"}
                  strokeWidth={label === 0 ? "1.5" : "1"}
                  strokeDasharray={label === 0 ? "0" : "4 3"}
                />
                <text x={pl - 6} y={y + 3} textAnchor="end" fontSize="8" fill="#9ca3af">
                  {label}
                </text>
              </g>
            );
          })}

          <line x1={pl} y1={pt} x2={pl} y2={pt + chartH} stroke="#e5e7eb" strokeWidth="1.5" />
          <line x1={pl} y1={pt + chartH} x2={w - pr} y2={pt + chartH} stroke="#e5e7eb" strokeWidth="1.5" />

          <text
            x={10}
            y={pt + chartH / 2}
            textAnchor="middle"
            fontSize="8"
            fill="#9ca3af"
            transform={`rotate(-90, 10, ${pt + chartH / 2})`}
          >
            Mood Score (%)
          </text>

          <text x={pl + chartW / 2} y={h - 2} textAnchor="middle" fontSize="8" fill="#9ca3af">
            Week
          </text>

          {areaD && <path d={areaD} fill="url(#grad)" />}

          <path
            d={pathD}
            fill="none"
            stroke={lineColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {uniquePoints.map((p, i) => (
            <g key={i}>
              {labelSet.has(i) && (
                <text x={p.x} y={pt + chartH + 14} textAnchor="middle" fontSize="8" fill="#9ca3af">
                  {p.date}
                </text>
              )}
              <circle
                cx={p.x}
                cy={p.y}
                r="10"
                fill="transparent"
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setTooltip(p)}
                onMouseLeave={() => setTooltip(null)}
              />
              <circle cx={p.x} cy={p.y} r="3.5" fill="white" stroke={lineColor} strokeWidth="2" style={{ pointerEvents: "none" }} />
            </g>
          ))}
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
            className="bg-gray-900 text-white text-xs rounded-xl px-3 py-2 whitespace-nowrap shadow-xl"
          >
            <p className="font-bold text-sm">{tooltip.score}%</p>
            <p className="text-gray-400">{tooltip.date}</p>
            <div style={{
              position: "absolute", bottom: "-5px", left: "50%",
              transform: "translateX(-50%)", width: 0, height: 0,
              borderLeft: "5px solid transparent", borderRight: "5px solid transparent",
              borderTop: "5px solid #111827",
            }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodGraph;