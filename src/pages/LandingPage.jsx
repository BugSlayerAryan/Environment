import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import DashboardPreview from "../components/DashboardPreview";
import MapSection from "../components/MapSection";
import Benefits from "../components/Benefits";
import Technology from "../components/Technology";
import UseCases from "../components/UseCases";
import CTA from "../components/CTA";
import Footer from "../components/Footer";


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