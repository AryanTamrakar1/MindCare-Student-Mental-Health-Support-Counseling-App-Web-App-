import React from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { useMoodTrend } from "../../hooks/studentDashboard/useMoodTrend";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="bg-[#0F172A] text-white px-3 py-2 shadow-xl">
        <p className="text-[#64748B] text-[12px] mb-0.5 font-medium">{label}</p>
        <p className="font-bold text-[15px]">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

function getScoreLabel(score) {
  if (score >= 90) return "Feeling Great";
  if (score >= 80) return "Feeling Good";
  if (score >= 70) return "Doing Well";
  if (score >= 60) return "Doing Okay";
  if (score >= 40) return "Not Doing Okay";
  return "Struggling";
}

function getScoreColor(score) {
  if (score >= 90) return "#16A34A";
  if (score >= 80) return "#16A34A";
  if (score >= 70) return "#2563EB";
  if (score >= 60) return "#2563EB";
  if (score >= 40) return "#D97706";
  return "#DC2626";
}

const MoodTrendCard = () => {
  const { trendData, loading } = useMoodTrend();

  if (loading) {
    return (
      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="bg-white border border-[#DBEAFE]">
        <div className="px-6 py-4 border-b border-[#DBEAFE]">
          <p className="text-[17px] font-bold text-[#0F172A] tracking-tight">Weekly Mood Trend</p>
          <p className="text-[13px] text-[#94A3B8] mt-0.5">Your mood score over the last 7 weeks</p>
        </div>
        <div className="p-6">
          <p className="text-[15px] text-[#94A3B8]">Loading...</p>
        </div>
      </div>
    );
  }

  if (trendData.length === 0) {
    return (
      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="bg-white border border-[#DBEAFE]">
        <div className="px-6 py-4 border-b border-[#DBEAFE]">
          <p className="text-[17px] font-bold text-[#0F172A] tracking-tight">Weekly Mood Trend</p>
          <p className="text-[13px] text-[#94A3B8] mt-0.5">Your mood score over the last 7 weeks</p>
        </div>
        <div className="p-6">
          <p className="text-[15px] text-[#94A3B8]">No quiz history yet.</p>
        </div>
      </div>
    );
  }

  const scores = [];
  for (let i = 0; i < trendData.length; i++) {
    scores.push(trendData[i].score);
  }

  const latest = scores[scores.length - 1];

  let sum = 0;
  for (let i = 0; i < scores.length; i++) {
    sum = sum + scores[i];
  }
  const avg = Math.round(sum / scores.length);

  let best = scores[0];
  for (let i = 1; i < scores.length; i++) {
    if (scores[i] > best) {
      best = scores[i];
    }
  }

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="bg-white border border-[#DBEAFE]">
      <div className="px-6 py-4 border-b border-[#DBEAFE]">
        <p className="text-[17px] font-bold text-[#0F172A] tracking-tight">Weekly Mood Trend</p>
        <p className="text-[13px] text-[#94A3B8] mt-0.5">Your mood score over the last 7 weeks</p>
      </div>

      <div className="p-6">
        <div style={{ width: "100%", height: 247, marginLeft: "-12px", marginBottom: "-8px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fontWeight: 600, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis type="number" domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={function (v) { return v + "%"; }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="score" stroke="#2563EB" strokeWidth={2} dot={{ fill: "#2563EB", r: 4, strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6, fill: "#2563EB", stroke: "#fff", strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ marginLeft: "-24px", marginRight: "-24px", marginBottom: "-24px", marginTop: "20px" }} className="grid grid-cols-3 border-t border-[#F1F5F9] divide-x divide-[#F1F5F9]">
          <div className="px-6 py-4">
            <p className="text-[12px] text-[#94A3B8] font-medium mb-1.5 uppercase tracking-wide">Latest</p>
            <div className="flex items-baseline gap-1.5">
              <p className="text-[20px] font-bold tabular-nums leading-none" style={{ color: getScoreColor(latest) }}>{latest}%</p>
              <span className="text-[14px] font-semibold leading-none" style={{ color: getScoreColor(latest) }}>- {getScoreLabel(latest)}</span>
            </div>
          </div>
          <div className="px-6 py-4">
            <p className="text-[12px] text-[#94A3B8] font-medium mb-1.5 uppercase tracking-wide">Average</p>
            <div className="flex items-baseline gap-1.5">
              <p className="text-[20px] font-bold tabular-nums leading-none" style={{ color: getScoreColor(avg) }}>{avg}%</p>
              <span className="text-[14px] font-semibold leading-none" style={{ color: getScoreColor(avg) }}>- {getScoreLabel(avg)}</span>
            </div>
          </div>
          <div className="px-6 py-4">
            <p className="text-[12px] text-[#94A3B8] font-medium mb-1.5 uppercase tracking-wide">Best</p>
            <div className="flex items-baseline gap-1.5">
              <p className="text-[20px] font-bold tabular-nums leading-none" style={{ color: getScoreColor(best) }}>{best}%</p>
              <span className="text-[14px] font-semibold leading-none" style={{ color: getScoreColor(best) }}>- {getScoreLabel(best)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodTrendCard;