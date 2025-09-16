import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser, SignOutButton } from '@clerk/clerk-react';
import { useClerkAuth } from '../../contexts/ClerkAuthContext';
import { isDoctor, getDashboardUrl, getUserDisplayName } from '../../utils/roles';
import Icon from '../AppIcon';
import Button from './Button';
import UserAvatar from './UserAvatar';
import HealthInfoDropdown from './HealthInfoDropdown';
import MobileNavigationMenu from './MobileNavigationMenu';
import LanguageSelector from './LanguageSelector';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const location = useLocation();
  const navigate = useNavigate();
  const headerRef = useRef(null);
  
  const { user, isSignedIn } = useUser();
  const { workerData } = useClerkAuth();

  // Define different navigation items based on user role
  const publicNavigationItems = [
    { label: 'Home', path: '/homepage', icon: 'Home' },
    { label: 'About Us', path: '/about-us', icon: 'Info' }
  ];

  const workerNavigationItems = [
    { label: 'Home', path: '/homepage', icon: 'Home' },
    { label: 'About Us', path: '/about-us', icon: 'Info' },
    { label: 'Risk Assessment', path: '/predictive-risk-assessment', icon: 'Shield' },
    { label: 'Health Centers', path: '/health-centers-locator', icon: 'MapPin' },
    { label: 'Personal Info', path: '/personal-health-record', icon: 'User' }
  ];

  const doctorNavigationItems = [
    { label: 'Home', path: '/homepage', icon: 'Home' },
    { label: 'About Us', path: '/about-us', icon: 'Info' },
    { label: 'Find Workers', path: '/doctor/dashboard', icon: 'Search' },
  ];

  // Get navigation items based on user role
  const getNavigationItems = () => {
    if (!isSignedIn) return publicNavigationItems;
    if (isDoctor(user)) return doctorNavigationItems;
    return workerNavigationItems;
  };

  const navigationItems = getNavigationItems();

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

  const handleAuthClick = () => {
    navigate('/auth');
  };

  const handleDashboardClick = () => {
    const dashboardUrl = getDashboardUrl(user);
    navigate(dashboardUrl);
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
            JeevanID
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
          {/* Authentication Section - Desktop */}
          {isSignedIn ? (
            <div className="hidden md:flex items-center space-x-3">
              {/* User Info */}
              <div className="flex items-center space-x-2">
                <UserAvatar 
                  user={user} 
                  workerData={workerData} 
                  size="sm" 
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    {getUserDisplayName(user)}
                  </span>
                  {workerData && !isDoctor(user) && (
                    <span className="text-xs text-muted-foreground">
                      {workerData.health_id}
                    </span>
                  )}
                  {isDoctor(user) && (
                    <span className="text-xs text-muted-foreground">
                      Medical Professional
                    </span>
                  )}
                </div>
              </div>
              
              {/* Dashboard Button */}
              <Button
                onClick={handleDashboardClick}
                variant="outline"
                size="sm"
                iconName="BarChart3"
                iconPosition="left"
              >
                Dashboard
              </Button>
              
              {/* Sign Out Button */}
              <SignOutButton>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="LogOut"
                  iconPosition="left"
                >
                  Sign Out
                </Button>
              </SignOutButton>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-3">
              <Button
                onClick={handleAuthClick}
                variant="default"
                size="sm"
                iconName="LogIn"
                iconPosition="left"
              >
                Sign In / Sign Up
              </Button>
            </div>
          )}
          
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
        user={user}
        isSignedIn={isSignedIn}
        workerData={workerData}
        onAuthClick={handleAuthClick}
        onDashboardClick={handleDashboardClick}
      />
    </header>
  );
};

export default Header;