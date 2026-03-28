import LandingNavbar from "../components/landing/LandingNavbar";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import FooterSection from "../components/landing/FooterSection";

export default function LandingPage() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="font-['Plus_Jakarta_Sans',sans-serif]">
      <LandingNavbar scrollTo={scrollTo} />
      <HeroSection scrollTo={scrollTo} />
      <FeaturesSection />
      <HowItWorksSection />
      <FooterSection scrollTo={scrollTo} />
    </div>
  );
}