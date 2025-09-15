import React, { useEffect } from 'react';
import Header from '../../components/ui/Header';
import HeroSection from './components/HeroSection';
import MissionSection from './components/MissionSection';
import BenefitsSection from './components/BenefitsSection';
import StatisticsSection from './components/StatisticsSection';
import TestimonialsSection from './components/TestimonialsSection';
import PartnershipsSection from './components/PartnershipsSection';
import FAQSection from './components/FAQSection';
import CallToActionSection from './components/CallToActionSection';

const AboutUsPage = () => {
  useEffect(() => {
    // Set page title
    document.title = 'About Us - WorkerHelper | Empowering Migrant Workers in Kerala';
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-15">
        <HeroSection />
        <MissionSection />
        <BenefitsSection />
        <StatisticsSection />
        <TestimonialsSection />
        <PartnershipsSection />
        <FAQSection />
        <CallToActionSection />
      </main>
    </div>
  );
};

export default AboutUsPage;