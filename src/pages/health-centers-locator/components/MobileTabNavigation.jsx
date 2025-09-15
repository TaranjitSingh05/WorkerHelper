import React from 'react';
import Icon from '../../../components/AppIcon';

const MobileTabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'map', label: 'Map', icon: 'Map' },
    { id: 'list', label: 'List', icon: 'List' }
  ];

  return (
    <div className="bg-card border-b border-border">
      <div className="flex">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => onTabChange(tab?.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium transition-smooth ${
              activeTab === tab?.id
                ? 'text-primary border-b-2 border-primary bg-primary bg-opacity-5' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name={tab?.icon} size={18} />
            <span>{tab?.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileTabNavigation;