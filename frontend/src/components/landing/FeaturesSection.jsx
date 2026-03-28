const FEATURES = [
  { num: "01", title: "Smart Mood Tracking", desc: "A weekly quiz detects whether your mental health is improving, stable, or declining — and guides you toward the right next step." },
  { num: "02", title: "Counselor Matching", desc: "The system reads your quiz history and suggests the counselor whose specialties, availability, and ratings best fit your situation." },
  { num: "03", title: "Anonymous Community Forum", desc: "Post what you're going through without revealing who you are. Read others, reply with support, and feel less alone." },
  { num: "04", title: "Session Booking with Video Calls", desc: "Request a session, choose your time, get approved, and join via Zoom — managed entirely inside the platform." },
  { num: "05", title: "Gamification and Progress", desc: "Earn points and level up from Beginner to Wellness Advocate. Badges reward every consistent step you take." },
  { num: "06", title: "Resource Library", desc: "Recommended videos and articles, organized by topic — stress, anxiety, depression, and skill-gap anxiety — tailored to your history." },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white border-b border-[#e2e2de]">
      <div className="px-12">

        <div className="flex items-end justify-between mb-14 flex-wrap gap-6">
          <div>
            <span className="text-xs font-bold text-blue-600 tracking-[0.1em] uppercase mb-3.5 block">
              Features
            </span>
            <h2 className="text-[clamp(28px,3.5vw,44px)] font-bold text-[#0f0f0e] leading-[1.18] tracking-[-0.025em] m-0 max-w-[480px]">
              Everything a student<br />needs to stay well
            </h2>
          </div>
          <p className="text-[15px] text-[#5a5a56] max-w-[360px] leading-relaxed m-0">
            MindCare brings together the tools, people, and content that students need to navigate university life with confidence.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-px bg-[#e2e2de]">
          {FEATURES.map(({ num, title, desc }) => (
            <div key={num} className="bg-white p-9 px-[30px]">
              <span className="text-[28px] font-bold text-[#ebebea] block mb-[18px] tracking-[-0.03em]">
                {num}
              </span>
              <h3 className="text-[17px] font-bold text-[#0f0f0e] mb-2.5 leading-snug">{title}</h3>
              <p className="text-sm text-[#5a5a56] leading-relaxed m-0">{desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
