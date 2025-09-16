import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SignOutButton } from '@clerk/clerk-react';
import { isDoctor, getUserDisplayName } from '../../utils/roles';
import Icon from '../AppIcon';
import Button from './Button';
import UserAvatar from './UserAvatar';
import LanguageSelector from './LanguageSelector';

const MobileNavigationMenu = ({ 
  isOpen, 
  onClose, 
  navigationItems, 
  currentLanguage, 
  onLanguageChange, 
  activeRoute,
  user,
  isSignedIn,
  workerData,
  onAuthClick,
  onDashboardClick
}) => {
  const [expandedDropdown, setExpandedDropdown] = useState(null);

  const handleDropdownToggle = (index) => {
    setExpandedDropdown(expandedDropdown === index ? null : index);
  };

  const handleLinkClick = () => {
    setExpandedDropdown(null);
    onClose();
  };

  const isActiveRoute = (path) => {
    return activeRoute === path;
  };

  const isActiveDropdown = (items) => {
    return items?.some(item => activeRoute === item?.path);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-1015 md:hidden"
        onClick={onClose}
      />
      {/* Mobile Menu */}
      <div className="fixed top-15 left-0 right-0 bottom-0 bg-card border-t border-border z-1020 md:hidden overflow-y-auto">
        <div className="p-5">
          {/* User Profile Section */}
          {isSignedIn ? (
            <div className="mb-6 pb-4 border-b border-border">
              <div className="flex items-center space-x-3 mb-4">
                <UserAvatar 
                  user={user} 
                  workerData={workerData} 
                  size="md" 
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {getUserDisplayName(user)}
                  </p>
                  {workerData && !isDoctor(user) && (
                    <p className="text-xs text-muted-foreground font-mono">
                      {workerData.health_id}
                    </p>
                  )}
                  {isDoctor(user) && (
                    <p className="text-xs text-muted-foreground">
                      Medical Professional
                    </p>
                  )}
                  {user?.emailAddresses?.[0]?.emailAddress && (
                    <p className="text-xs text-muted-foreground truncate">
                      {user.emailAddresses[0].emailAddress}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => { onDashboardClick(); onClose(); }}
                  variant="outline"
                  size="sm"
                  iconName="BarChart3"
                  iconPosition="left"
                  fullWidth
                >
                  Dashboard
                </Button>
                <SignOutButton>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="LogOut"
                    iconPosition="left"
                    fullWidth
                  >
                    Sign Out
                  </Button>
                </SignOutButton>
              </div>
            </div>
          ) : (
            <div className="mb-6 pb-4 border-b border-border">
              <Button
                onClick={() => { onAuthClick(); onClose(); }}
                variant="default"
                size="md"
                iconName="LogIn"
                iconPosition="left"
                fullWidth
              >
                Sign In / Sign Up
              </Button>
            </div>
          )}
          
          {/* Language Selector */}
          <div className="mb-6 pb-4 border-b border-border">
            <div className="text-sm font-medium text-muted-foreground mb-3">Language</div>
            <LanguageSelector
              currentLanguage={currentLanguage}
              onLanguageChange={onLanguageChange}
              isMobile={true}
            />
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2">
            {navigationItems?.map((item, index) => {
              if (item?.type === 'dropdown') {
                const isDropdownActive = isActiveDropdown(item?.items);
                const isExpanded = expandedDropdown === index;

                return (
                  <div key={index} className="space-y-1">
                    <button
                      onClick={() => handleDropdownToggle(index)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-smooth ${
                        isDropdownActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon name={item?.icon} size={20} />
                        <span className="font-medium">{item?.label}</span>
                      </div>
                      <Icon 
                        name="ChevronDown" 
                        size={16} 
                        className={`transition-transform duration-150 ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {isExpanded && (
                      <div className="ml-4 space-y-1">
                        {item?.items?.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            to={subItem?.path}
                            onClick={handleLinkClick}
                            className={`flex items-center space-x-3 p-3 rounded-lg transition-smooth ${
                              isActiveRoute(subItem?.path)
                                ? 'bg-secondary text-secondary-foreground'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                            }`}
                          >
                            <Icon name={subItem?.icon} size={18} />
                            <div>
                              <div className="font-medium text-sm">{subItem?.label}</div>
                              <div className="text-xs opacity-75 mt-0.5">
                                {subItem?.path === '/health-trends' ?'View health statistics' :'Assess health risks'
                                }
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={index}
                  to={item?.path}
                  onClick={handleLinkClick}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-smooth ${
                    isActiveRoute(item?.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={item?.icon} size={20} />
                  <span className="font-medium">{item?.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Emergency Contact */}
          <div className="mt-8 pt-6 border-t border-border">
            <button className="w-full flex items-center justify-center space-x-2 p-3 bg-error text-error-foreground rounded-lg font-medium transition-smooth hover:bg-opacity-90">
              <Icon name="Phone" size={18} />
              <span>Emergency Contact</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNavigationMenu;