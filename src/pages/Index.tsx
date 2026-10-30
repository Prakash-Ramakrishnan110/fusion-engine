import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SolutionsTabs from "@/components/SolutionsTabs";
import LogoStrip from "@/components/LogoStrip";
import CaseStudies from "@/components/CaseStudies";
import Founder from "@/components/Founder";
import FAQ from "@/components/FAQ";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import usePageMeta from "@/hooks/usePageMeta";

const Index = () => {
  usePageMeta("Home");
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <SolutionsTabs />
        <LogoStrip />
        <CaseStudies />
        <Founder />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
