import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';

const LanguageSelector = ({ currentLanguage, onLanguageChange, isMobile = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' }
  ];

  const currentLang = languages?.find(lang => lang?.code === currentLanguage) || languages?.[0];

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLanguageSelect = (languageCode) => {
    onLanguageChange(languageCode);
    setIsOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event?.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  if (isMobile) {
    return (
      <div className="space-y-2">
        {languages?.map((language) => (
          <button
            key={language?.code}
            onClick={() => handleLanguageSelect(language?.code)}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-smooth ${
              currentLanguage === language?.code
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-muted'
            }`}
          >
            <span className="text-lg">{language?.flag}</span>
            <span className="font-medium">{language?.name}</span>
            {currentLanguage === language?.code && (
              <Icon name="Check" size={16} className="ml-auto" />
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={handleToggle}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Select language"
      >
        <span className="text-base">{currentLang?.flag}</span>
        <span>{currentLang?.name}</span>
        <Icon 
          name="ChevronDown" 
          size={14} 
          className={`transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-40 bg-popover border border-border rounded-lg shadow-interactive z-1010">
          <div className="py-2">
            {languages?.map((language) => (
              <button
                key={language?.code}
                onClick={() => handleLanguageSelect(language?.code)}
                className={`w-full flex items-center space-x-3 px-4 py-2 text-left text-sm transition-smooth ${
                  currentLanguage === language?.code
                    ? 'bg-muted text-foreground font-medium'
                    : 'text-popover-foreground hover:bg-muted'
                }`}
              >
                <span className="text-base">{language?.flag}</span>
                <span>{language?.name}</span>
                {currentLanguage === language?.code && (
                  <Icon name="Check" size={14} className="ml-auto text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;