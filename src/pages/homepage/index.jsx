import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import HeroSection from './components/HeroSection';
import ArticlesSection from './components/ArticlesSection';
import CallToActionSection from './components/CallToActionSection';
import Footer from './components/Footer';

const Homepage = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Load saved language preference on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('workerhelper-language');
    if (savedLanguage && ['en', 'hi', 'bn', 'pa']?.includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Save language preference when it changes
  useEffect(() => {
    localStorage.setItem('workerhelper-language', currentLanguage);
  }, [currentLanguage]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="pt-15">
        {/* Hero Section */}
        <HeroSection currentLanguage={currentLanguage} />
        
        {/* Articles Section */}
        <ArticlesSection currentLanguage={currentLanguage} />
        
        {/* Call to Action Section */}
        <CallToActionSection currentLanguage={currentLanguage} />
      </main>
      
      {/* Footer */}
      <Footer currentLanguage={currentLanguage} />
    </div>
  );
};

export default Homepage;