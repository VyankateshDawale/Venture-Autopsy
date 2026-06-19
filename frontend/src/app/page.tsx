import { HeroSection } from "@/components/landing/HeroSection";
import { LiveAgentBoard } from "@/components/landing/LiveAgentBoard";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { InvestigationTypesSection } from "@/components/landing/InvestigationTypesSection";
import { SpecialistNetworkSection } from "@/components/landing/SpecialistNetworkSection";
import { SampleInvestigationsSection } from "@/components/landing/SampleInvestigationsSection";
import { PlatformMetricsSection } from "@/components/landing/PlatformMetricsSection";
import { StartSection } from "@/components/landing/StartSection";
import { FooterSection } from "@/components/landing/FooterSection";

export default function Home() {
  return (
    <main className="relative bg-background">
      <HeroSection />
      <LiveAgentBoard />
      <HowItWorksSection />
      <InvestigationTypesSection />
      <SpecialistNetworkSection />
      <SampleInvestigationsSection />
      <PlatformMetricsSection />
      <StartSection />
      <FooterSection />
    </main>
  );
}
