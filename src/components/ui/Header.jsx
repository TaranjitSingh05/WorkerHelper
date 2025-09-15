import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import HealthInfoDropdown from './HealthInfoDropdown';
import MobileNavigationMenu from './MobileNavigationMenu';
import LanguageSelector from './LanguageSelector';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const location = useLocation();
  const headerRef = useRef(null);

  const navigationItems = [
    { label: 'Home', path: '/homepage', icon: 'Home' },
    { label: 'About Us', path: '/about-us', icon: 'Info' },
    { 
      label: 'Health Info', 
      type: 'dropdown',
      icon: 'Heart',
      items: [
        { label: 'Health Trends', path: '/health-trends', icon: 'TrendingUp' },
        { label: 'Risk Assessment', path: '/predictive-risk-assessment', icon: 'Shield' }
      ]
    },
    { label: 'Health Centers', path: '/health-centers-locator', icon: 'MapPin' },
    { label: 'Personal Info', path: '/personal-health-record', icon: 'User' }
  ];

  const isActiveRoute = (path) => {
    return location?.pathname === path;
  };

  const isActiveDropdown = (items) => {
    return items?.some(item => location?.pathname === item?.path);
  };

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language);
    // Integration with i18next would happen here
    console.log('Language changed to:', language);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location?.pathname]);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef?.current && !headerRef?.current?.contains(event?.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <header 
      ref={headerRef}
      className="fixed top-0 left-0 right-0 bg-card border-b border-border z-1000"
    >
      <div className="w-full h-15 px-5 flex items-center justify-between">
        {/* Logo Section */}
        <Link 
          to="/homepage" 
          className="flex items-center space-x-3 transition-smooth hover:opacity-80"
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Heart" size={20} color="white" />
          </div>
          <span className="text-xl font-semibold text-foreground">
            WorkerHelper
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems?.map((item, index) => {
            if (item?.type === 'dropdown') {
              return (
                <HealthInfoDropdown
                  key={index}
                  item={item}
                  isActive={isActiveDropdown(item?.items)}
                />
              );
            }

            return (
              <Link
                key={index}
                to={item?.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth flex items-center space-x-2 ${
                  isActiveRoute(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={16} />
                <span>{item?.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Language Selector - Desktop */}
          <div className="hidden md:block">
            <LanguageSelector
              currentLanguage={currentLanguage}
              onLanguageChange={handleLanguageChange}
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
            aria-label="Toggle mobile menu"
          >
            <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={20} />
          </button>
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      <MobileNavigationMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        navigationItems={navigationItems}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        activeRoute={location?.pathname}
      />
    </header>
  );
};

export default Header;