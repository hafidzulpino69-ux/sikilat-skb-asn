import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PromoSection from "@/components/PromoSection";
import LeaderboardSection from "@/components/LeaderboardSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FCF4E7]">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <PromoSection />
        <LeaderboardSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
}
