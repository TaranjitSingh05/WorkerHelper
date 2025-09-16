import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import HeroSection from './components/HeroSection';
import UserGuideSection from './components/UserGuideSection';
import ArticlesSection from './components/ArticlesSection';
import Footer from './components/Footer';

const Homepage = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Load saved language preference on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('jeevanid-language');
    if (savedLanguage && ['en', 'hi', 'bn', 'pa']?.includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Save language preference when it changes
  useEffect(() => {
    localStorage.setItem('jeevanid-language', currentLanguage);
  }, [currentLanguage]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="pt-15">
        {/* Hero Section */}
        <HeroSection currentLanguage={currentLanguage} />
        
        {/* User Guide Section */}
        <UserGuideSection />
        
        {/* Articles Section */}
        <ArticlesSection currentLanguage={currentLanguage} />
      </main>
      
      {/* Footer */}
      <Footer currentLanguage={currentLanguage} />
    </div>
  );
};

export default Homepage;