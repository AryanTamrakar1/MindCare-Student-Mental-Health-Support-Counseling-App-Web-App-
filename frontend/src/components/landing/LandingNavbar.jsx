import { useState, useEffect } from "react";

export default function LandingNavbar({ scrollTo }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] bg-white border-b transition-[border-color] duration-200 ${
        scrolled ? "border-[#e2e2de]" : "border-transparent"
      }`}
    >
      <div className="px-12 h-[68px] grid grid-cols-3 items-center">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="bg-transparent border-0 cursor-pointer p-0 w-fit"
        >
          <img
            src="/MindCareLogo.png"
            alt="MindCare"
            className="h-10 w-auto object-contain"
          />
        </button>

        <div className="flex items-center justify-center gap-10">
          {[
            { l: "Features", id: "features" },
            { l: "How It Works", id: "how-it-works" },
            { l: "For Counselors", id: "counselors" },
          ].map(({ l, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="bg-transparent border-0 cursor-pointer text-base font-medium text-[#5a5a56] hover:text-[#0f0f0e] transition-colors duration-150"
            >
              {l}
            </button>
          ))}
        </div>

        <div className="flex gap-2 items-center justify-end">
          <a
            href="/Login"
            className="px-5 py-2.5 text-[15px] font-medium text-[#5a5a56] no-underline"
          >
            Log in
          </a>
          <a
            href="/role-selection"
            className="px-[22px] py-2.5 text-[15px] font-semibold text-white bg-blue-600 no-underline"
          >
            Get Started
          </a>
        </div>
      </div>
    </nav>
  );
}
