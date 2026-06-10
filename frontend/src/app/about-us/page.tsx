import AboutHero from "./_components/AboutHero";
import TeamSection from "./_components/TeamSection";
import VisionMission from "./_components/VisionMision"; // Pastikan ejaan file benar (Mision vs Mission)
import HistorySection from "./_components/HistorySection";
import BenefitSection from "./_components/BenefitSection";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <main className="w-full min-h-screen bg-[#FAF8F1]">
      <AboutHero />
      <HistorySection />
      <VisionMission />
       <BenefitSection />
      <TeamSection />
      <Footer />
    </main>
  );
}
