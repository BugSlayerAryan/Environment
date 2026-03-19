import Navbar from "../LandingPageComponents/Navbar";
import Hero from "../LandingPageComponents/Hero";
import Features from "../LandingPageComponents/Features";
import DashboardPreview from "../LandingPageComponents/DashboardPreview";
import MapSection from "../LandingPageComponents/MapSection";
import Benefits from "../LandingPageComponents/Benefits";
import Technology from "../LandingPageComponents/Technology";
import UseCases from "../LandingPageComponents/UseCases";
import CTA from "../LandingPageComponents/CTA";
import Footer from "../LandingPageComponents/Footer";


export default function LandingPage() {
  return (
    <div className="font-sans text-slate-900 bg-white overflow-x-hidden">
      <Navbar />
      <main className="pt-20">
        <Hero />
        <Features />
        <DashboardPreview />
        <MapSection />
        <Benefits />
        <Technology />
        <UseCases />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}