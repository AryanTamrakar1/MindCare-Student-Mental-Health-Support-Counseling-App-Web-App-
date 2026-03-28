import { AlertCircle } from "lucide-react";

const QUESTIONS = [
  { key: "professionalism", label: "Professionalism", color: "#1E3A8A" },
  { key: "clarity", label: "Clarity", color: "#1D4ED8" },
  { key: "empathy", label: "Empathy", color: "#2563EB" },
  { key: "helpfulness", label: "Helpfulness", color: "#3B82F6" },
  { key: "overallSatisfaction", label: "Overall Satisfaction", color: "#60A5FA" },
];

function getAverage(averages, key) {
  if (!averages) return 0;
  if (averages[key]) return averages[key];
  return 0;
}

function getLabel(avg) {
  if (avg >= 4.5) return { text: "Excellent", color: "#16A34A" };
  if (avg >= 3.5) return { text: "Good", color: "#2563EB" };
  if (avg >= 2.5) return { text: "Average", color: "#D97706" };
  return { text: "Needs Work", color: "#DC2626" };
}

const PieChart = ({ averages }) => {
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const r = 105;
  const sw = 70;
  const circumference = 2 * Math.PI * r;

  const values = QUESTIONS.map((q) => getAverage(averages, q.key));

  let total = 0;
  for (let i = 0; i < values.length; i++) {
    total += values[i];
  }
  if (total === 0) return null;

  let cumPct = 0;
  const slices = values.map((v, i) => {
    const pct = v / total;
    const startPct = cumPct;
    const offset = circumference * (1 - cumPct);
    const dash = circumference * pct;
    const gap = circumference - dash;
    cumPct += pct;
    return { dash, gap, offset, color: QUESTIONS[i].color, label: QUESTIONS[i].label, pct, startPct };
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#EFF6FF" strokeWidth={sw} />
      {slices.map((s, i) => (
        <circle
          key={i}
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={s.color}
          strokeWidth={sw}
          strokeDasharray={`${s.dash} ${s.gap}`}
          strokeDashoffset={s.offset}
          style={{ transform: `rotate(-90deg)`, transformOrigin: `${cx}px ${cy}px` }}
        />
      ))}
      {slices.map((s, i) => {
        const angle = -Math.PI / 2 + (2 * Math.PI * s.startPct);
        const half = sw / 2 + 2;
        const x1 = cx + (r - half) * Math.cos(angle);
        const y1 = cy + (r - half) * Math.sin(angle);
        const x2 = cx + (r + half) * Math.cos(angle);
        const y2 = cy + (r + half) * Math.sin(angle);
        return <line key={`div-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="3" />;
      })}
      <text x={cx} y={cy - 10} textAnchor="middle" fontSize="36" fontWeight="700" fill="#111827" fontFamily="'Plus Jakarta Sans', sans-serif">
        {(total / values.length).toFixed(1)}
      </text>
      <text x={cx} y={cy + 16} textAnchor="middle" fontSize="13" fontWeight="600" fill="#94A3B8" fontFamily="'Plus Jakarta Sans', sans-serif">
        out of 5
      </text>
    </svg>
  );
};

const RatingBreakdown = ({ averages, weakestLabel, weakVal }) => {
  return (
    <div className="flex flex-col gap-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {weakVal < 4 && (
        <div className="bg-white border border-[#DBEAFE] px-6 py-4 flex items-start gap-4">
          <div className="w-9 h-9 bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
            <AlertCircle size={16} className="text-orange-500" strokeWidth={2} />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-[#111827]">
              Focus area: <span className="text-orange-600">{weakestLabel}</span>
            </p>
            <p className="text-[13px] text-[#6B7280] mt-0.5">
              Your lowest-rated category at {weakVal.toFixed(2)}/5. Students value improvement here most.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white border border-[#DBEAFE] overflow-hidden">
        <div className="px-8 py-5 border-b border-[#DBEAFE]">
          <p className="text-[17px] font-bold text-[#0F172A]">Category Breakdown</p>
          <p className="text-[14px] text-[#6B7280] mt-1">Average score per quality area across all rated sessions</p>
        </div>

        <div className="grid" style={{ gridTemplateColumns: "1.2fr 1px 1fr" }}>

          <div className="p-8 flex items-center justify-center">
            <div style={{ width: "100%", maxWidth: 420 }}>
              <PieChart averages={averages} />
            </div>
          </div>

          <div className="bg-[#DBEAFE]" />

          <div className="flex flex-col overflow-hidden">
            <div className="px-8 py-4 border-b border-[#DBEAFE]">
              <p className="text-[13px] font-bold text-[#111827] uppercase tracking-widest">
                Element of Evaluation
              </p>
            </div>

            <div className="px-8 py-6 flex flex-col gap-5">
              {QUESTIONS.map((q) => {
                const avg = getAverage(averages, q.key);
                const pct = Math.round((avg / 5) * 100);
                const lbl = getLabel(avg);
                return (
                  <div key={q.key}>
                    <p className="text-[15px] font-semibold text-[#111827] mb-2">{q.label}</p>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[14px] font-bold" style={{ color: q.color }}>{pct}%</span>
                      <span className="text-[13px] text-[#94A3B8]">
                        Average : <span className="font-semibold" style={{ color: lbl.color }}>{lbl.text}</span>
                      </span>
                    </div>
                    <div className="w-full h-3 bg-[#EFF6FF] overflow-hidden">
                      <div
                        className="h-full transition-all duration-300"
                        style={{ width: `${pct}%`, background: q.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      <div className="bg-white border border-[#DBEAFE] overflow-hidden">
        <div className="px-8 py-5 border-b border-[#DBEAFE]">
          <p className="text-[17px] font-bold text-[#0F172A]"> Bar Chart of Element of Evaluation</p>
          <p className="text-[14px] text-[#6B7280] mt-1">Score comparison across all quality dimensions</p>
        </div>

        <div className="px-8 py-8">
          <div className="flex gap-4">
            <div className="flex flex-col justify-between items-end shrink-0 pb-8" style={{ width: 24, height: 220 }}>
              {[5, 4, 3, 2, 1, 0].map((v) => (
                <span key={v} className="text-[11px] text-[#94A3B8] font-semibold leading-none">{v}</span>
              ))}
            </div>

            <div className="flex-1 flex flex-col">
              <div className="relative" style={{ height: 180 }}>
                {[0, 1, 2, 3, 4, 5].map((v) => (
                  <div
                    key={v}
                    className="absolute w-full border-t border-dashed border-[#E9F0FB]"
                    style={{ bottom: `${(v / 5) * 100}%`, left: 0, right: 0 }}
                  />
                ))}
                <div className="absolute bottom-0 left-0 right-0 flex items-end gap-4 px-2" style={{ height: "100%" }}>
                  {QUESTIONS.map((q) => {
                    const avg = getAverage(averages, q.key);
                    const barHeightPx = (avg / 5) * 180;
                    return (
                      <div key={q.key} className="flex-1 flex flex-col items-center" style={{ height: "100%", justifyContent: "flex-end" }}>
                        <span className="text-[12px] font-bold mb-1" style={{ color: q.color }}>{avg.toFixed(1)}</span>
                        <div style={{ width: "100%", height: barHeightPx, background: q.color, minHeight: 4, transition: "height 0.5s" }} />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-4 px-2 mt-2">
                {QUESTIONS.map((q) => (
                  <div key={q.key} className="flex-1 text-center">
                    <span className="text-[11px] font-semibold text-[#6B7280] leading-tight" style={{ display: "block" }}>
                      {q.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-5 mt-6 pt-5 border-t border-[#EFF6FF]">
            {QUESTIONS.map((q) => {
              const avg = getAverage(averages, q.key);
              const lbl = getLabel(avg);
              return (
                <div key={q.key} className="flex items-center gap-2">
                  <div className="w-3 h-3 shrink-0" style={{ background: q.color }} />
                  <span className="text-[13px] font-medium text-[#374151]">{q.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
};

export default RatingBreakdown;