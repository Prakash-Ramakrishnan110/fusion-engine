import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AnnouncementStrip from "@/components/AnnouncementStrip";
import StartupBenefits from "@/components/StartupBenefits";
import TrustSignals from "@/components/TrustSignals";
import SolutionsTabs from "@/components/SolutionsTabs";
import BigStats from "@/components/BigStats";
import LogoStrip from "@/components/LogoStrip";
import HowWeHelp from "@/components/HowWeHelp";
import CaseStudies from "@/components/CaseStudies";
import Founder from "@/components/Founder";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <AnnouncementStrip />
        <StartupBenefits />
        <TrustSignals />
        <SolutionsTabs />
        <BigStats />
        <LogoStrip />
        <HowWeHelp />
        <CaseStudies />
        <Founder />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
