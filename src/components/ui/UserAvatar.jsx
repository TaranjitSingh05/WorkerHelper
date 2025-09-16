import React from 'react';
import Icon from '../AppIcon';

const UserAvatar = ({ 
  user, 
  workerData, 
  size = 'md', 
  className = '',
  showBorder = false 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32
  };

  const borderClass = showBorder ? 'border-2 border-primary' : 'border border-border';
  
  if (user?.imageUrl) {
    return (
      <img 
        src={user.imageUrl} 
        alt={user.firstName || workerData?.full_name || 'User'}
        className={`${sizeClasses[size]} rounded-full object-cover ${borderClass} ${className}`}
        loading="lazy"
      />
    );
  }

  return (
    <div className={`${sizeClasses[size]} bg-primary rounded-full flex items-center justify-center ${borderClass} ${className}`}>
      <Icon name="User" size={iconSizes[size]} color="white" />
    </div>
  );
};

export default UserAvatar;