import React from "react";
import { FloatingNav, Hero, LogoMarquee } from "@/components/landing/LandingTop";
import { TemplatesSection, BuilderShowcase, AnalyticsSection, ProductsSection } from "@/components/landing/LandingFeatures";
import { AssistantSection, Testimonials, PricingSection, FinalCTA, Footer } from "@/components/landing/LandingFooter";

export default function Home() {
  return (
    <>
      <FloatingNav />
      <Hero />
      <LogoMarquee />
      <TemplatesSection />
      <BuilderShowcase />
      <AnalyticsSection />
      <ProductsSection />
      <AssistantSection />
      <Testimonials />
      <PricingSection />
      <FinalCTA />
      <Footer />
    </>
  );
}
