export default function FooterSection({ scrollTo }) {
  return (
    <footer className="bg-[#F7F7F5] border-t border-[#e2e2de] pt-16 pb-8">
      <div className="px-12">
        <div className="grid grid-cols-[2fr_1fr_1fr] gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3.5">
              <img
                src="/MindCareLogo2.png"
                alt="MindCare"
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-[#5a5a56] leading-relaxed max-w-[300px] mb-4">
              Online mental health counseling built for university and college
              students in Nepal.
            </p>
            <p className="text-xs text-gray-400">
              Final Year Project — React, Express, MongoDB
            </p>
          </div>

          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-4">
              Platform
            </p>
            {[
              { l: "Features", id: "features" },
              { l: "How It Works", id: "how-it-works" },
              { l: "For Counselors", id: "counselors" },
            ].map(({ l, id }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="block bg-transparent border-0 cursor-pointer text-[15px] text-[#5a5a56] py-[5px] px-0 text-left hover:text-[#0f0f0e] transition-colors duration-150 font-normal w-full"
              >
                {l}
              </button>
            ))}
          </div>

          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-4">
              Account
            </p>
            {[
              { label: "Register as Student", href: "/role-selection" },
              { label: "Apply as Counselor", href: "/register/counselor" },
              { label: "Log In", href: "/Login" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="block text-[15px] text-[#5a5a56] py-[5px] no-underline hover:text-[#0f0f0e] transition-colors duration-150"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-[#e2e2de] pt-6 text-center">
          <p className="text-[13px] text-gray-400 m-0">
            &copy; 2026 MindCare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
