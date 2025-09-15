import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';

const HealthInfoDropdown = ({ item, isActive }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef?.current) {
      clearTimeout(timeoutRef?.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = () => {
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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef?.current) {
        clearTimeout(timeoutRef?.current);
      }
    };
  }, []);

  return (
    <div 
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={handleClick}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth flex items-center space-x-2 ${
          isActive || isOpen
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Icon name={item?.icon} size={16} />
        <span>{item?.label}</span>
        <Icon 
          name="ChevronDown" 
          size={14} 
          className={`transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-popover border border-border rounded-lg shadow-interactive z-1010">
          <div className="py-2">
            {item?.items?.map((subItem, index) => (
              <Link
                key={index}
                to={subItem?.path}
                onClick={handleItemClick}
                className="flex items-center space-x-3 px-4 py-3 text-sm text-popover-foreground hover:bg-muted transition-smooth"
              >
                <Icon name={subItem?.icon} size={16} className="text-muted-foreground" />
                <div>
                  <div className="font-medium">{subItem?.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {subItem?.path === '/health-trends' ?'View health statistics and trends' :'Assess your health risks'
                    }
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthInfoDropdown;