const STEPS = [
  { n: "01", title: "Create your account", desc: "Register as a student in under a minute. No waiting — access is immediate." },
  { n: "02", title: "Take the mood quiz", desc: "A short weekly check-in. The system analyzes your answers and surfaces the support that fits." },
  { n: "03", title: "Connect with a counselor", desc: "Browse or use AI suggestions to find your match. Book a session and join via Zoom at your chosen time." },
];

const COUNSELOR_STEPS = [
  { n: "1", title: "Submit your application", note: "Fill in credentials and specialties" },
  { n: "2", title: "Admin reviews your form", note: "Verified by the platform admin" },
  { n: "3", title: "Receive approval notice", note: "Notified directly on your dashboard" },
  { n: "4", title: "Start accepting sessions", note: "Students can find and book you right away" },
];

const ArrowRight = ({ color = "white" }) => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
    <path d="M3 7h8M8 4l3 3-3 3" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function HowItWorksSection() {
  return (
    <>
      <section id="how-it-works" className="py-24 bg-[#F7F7F5] border-b border-[#e2e2de]">
        <div className="px-12">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-blue-600 tracking-[0.1em] uppercase mb-3.5 block">
              Process
            </span>
            <h2 className="text-[clamp(28px,3.5vw,44px)] font-bold text-[#0f0f0e] leading-[1.18] tracking-[-0.025em] mx-auto mb-4">
              Up and running in three steps
            </h2>
            <p className="text-base text-[#5a5a56] max-w-[440px] mx-auto leading-relaxed">
              Getting mental health support should be simple. Here is how MindCare works for students.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {STEPS.map(({ n, title, desc }, i) => (
              <div key={n} className="bg-white border border-[#e2e2de] p-9 px-7 relative overflow-hidden">
                <span className="absolute top-3 right-[18px] text-[64px] font-bold text-[#f3f3f1] leading-none select-none tracking-[-0.04em]">
                  {n}
                </span>
                <div className="w-8 h-8 bg-blue-600 flex items-center justify-center mb-5">
                  <span className="text-white text-[13px] font-bold">{i + 1}</span>
                </div>
                <h3 className="text-lg font-bold text-[#0f0f0e] mb-2.5 leading-snug">{title}</h3>
                <p className="text-sm text-[#5a5a56] leading-relaxed m-0">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-11">
            <a
              href="/role-selection"
              className="inline-flex items-center gap-2 px-7 py-[13px] text-[15px] font-semibold bg-blue-600 text-white no-underline hover:bg-blue-700 transition-colors duration-150"
            >
              Create your free account
              <ArrowRight color="white" />
            </a>
          </div>
        </div>
      </section>

      {/* For Counselors */}
      <section id="counselors" className="py-24 bg-[#F7F7F5] border-b border-[#e2e2de]">
        <div className="px-12">
          <div className="grid grid-cols-2 gap-20 items-start">
            <div>
              <span className="text-xs font-bold text-blue-600 tracking-[0.1em] uppercase mb-3.5 block">
                For Counselors
              </span>
              <h2 className="text-[clamp(28px,3.5vw,44px)] font-bold text-[#0f0f0e] leading-[1.18] tracking-[-0.025em] mb-5">
                Make a real difference<br />in students' lives.
              </h2>
              <p className="text-base text-[#5a5a56] leading-relaxed mb-9">
                Join MindCare as a verified counselor. Manage your schedule, run Zoom sessions, track your impact, and let students find you — all from your dashboard.
              </p>

              <div className="flex flex-col gap-5 mb-9">
                {[
                  { title: "Admin-verified", desc: "Your credentials are reviewed before you go live" },
                  { title: "Student-rated", desc: "Ratings after each session help you improve and gain trust" },
                  { title: "Full schedule control", desc: "Set your own availability, days, times, and specialties" },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex gap-4">
                    <div className="w-[3px] bg-blue-600 shrink-0 self-stretch" />
                    <div>
                      <p className="text-[15px] font-semibold text-[#0f0f0e] m-0 mb-[3px]">{title}</p>
                      <p className="text-sm text-[#5a5a56] m-0">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="/register/counselor"
                className="inline-flex items-center gap-2 px-7 py-[13px] text-[15px] font-semibold border-[1.5px] border-blue-600 text-blue-600 bg-transparent no-underline hover:bg-blue-50 transition-colors duration-150"
              >
                Apply as a counselor
                <ArrowRight color="#2563EB" />
              </a>
            </div>

            <div className="bg-white border border-[#e2e2de]">
              <div className="px-6 py-4 border-b border-[#e2e2de] bg-[#F7F7F5]">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em] m-0">
                  Approval Process
                </p>
              </div>
              <div className="p-7">
                {COUNSELOR_STEPS.map(({ n, title, note }, i) => (
                  <div key={n} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 bg-blue-600 flex items-center justify-center shrink-0">
                        <span className="text-white text-xs font-bold">{n}</span>
                      </div>
                      {i < COUNSELOR_STEPS.length - 1 && (
                        <div className="w-px flex-1 bg-blue-200 my-1.5 min-h-6" />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className="text-[15px] font-semibold text-[#0f0f0e] m-0 mb-[3px]">{title}</p>
                      <p className="text-[13px] text-gray-400 m-0">{note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-b border-[#e2e2de]">
        <div className="px-12 text-center">
          <span className="text-xs font-bold text-blue-600 tracking-[0.1em] uppercase mb-3.5 block">
            Get Started
          </span>
          <h2 className="text-[clamp(32px,4.5vw,54px)] font-bold text-[#0f0f0e] tracking-[-0.03em] leading-[1.15] mb-5">
            Your wellbeing deserves<br />
            <span className="text-blue-600">real support.</span>
          </h2>
          <p className="text-[17px] text-[#5a5a56] max-w-[460px] mx-auto mb-10 leading-relaxed">
            Join MindCare today. No waiting, no paperwork — just the support system you've been looking for.
          </p>
          <div className="flex gap-2.5 justify-center flex-wrap">
            <a
              href="/role-selection"
              className="inline-flex items-center gap-2 px-7 py-[13px] text-[15px] font-semibold bg-blue-600 text-white no-underline hover:bg-blue-700 transition-colors duration-150"
            >
              Get Started Free
            </a>
            <a
              href="/Login"
              className="inline-flex items-center gap-2 px-7 py-[13px] text-[15px] font-semibold border border-[#e2e2de] bg-white text-[#0f0f0e] no-underline hover:border-gray-400 transition-colors duration-150"
            >
              Log in
            </a>
          </div>
        </div>
      </section>
    </>
  );
}