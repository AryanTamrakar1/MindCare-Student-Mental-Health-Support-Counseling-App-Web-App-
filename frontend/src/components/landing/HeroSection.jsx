const ArrowRight = ({ color = "white" }) => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
    <path
      d="M3 7h8M8 4l3 3-3 3"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function HeroSection({ scrollTo }) {
  return (
    <section className="pt-28 pb-20 border-b border-[#e2e2de] bg-white">
      <div className="px-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-[7px] border border-blue-200 bg-blue-50 px-[14px] py-[5px] mb-7">
            <div className="w-1.5 h-1.5 bg-blue-600" />
            <span className="text-xs font-bold text-blue-600 tracking-[0.07em] uppercase">
              Built for students in Nepal
            </span>
          </div>

          <h1 className="text-[clamp(38px,5vw,60px)] font-bold leading-[1.1] text-[#0f0f0e] mb-[22px] tracking-[-0.03em]">
            Mental health support,{" "}
            <span className="text-blue-600">built for you.</span>
          </h1>

          <p className="text-[17px] leading-relaxed text-[#5a5a56] mb-9 max-w-[480px] mx-auto">
            MindCare connects university students with qualified counselors,
            weekly mood tracking, and a community that understands — all in one
            place.
          </p>

          <div className="flex gap-2.5 flex-wrap justify-center mb-[52px]">
            <a
              href="/role-selection"
              className="inline-flex items-center gap-2 px-7 py-[13px] text-[15px] font-semibold bg-blue-600 text-white no-underline hover:bg-blue-700 transition-colors duration-150"
            >
              Get Started Free
              <ArrowRight color="white" />
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("how-it-works");
              }}
              className="inline-flex items-center gap-2 px-7 py-[13px] text-[15px] font-semibold border border-[#e2e2de] bg-white text-[#0f0f0e] no-underline hover:border-gray-400 transition-colors duration-150 cursor-pointer"
            >
              See how it works
            </a>
          </div>

          <div className="flex gap-10 border-t border-[#e2e2de] pt-8 justify-center">
            {[
              { value: "10+", label: "Core features" },
              { value: "Zoom", label: "Integrated video sessions" },
              { value: "Free", label: "For students" },
            ].map(({ value, label }) => (
              <div key={value}>
                <p className="text-[22px] font-bold text-[#0f0f0e] m-0 tracking-tight">
                  {value}
                </p>
                <p className="text-xs text-gray-400 mt-[3px] m-0">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
