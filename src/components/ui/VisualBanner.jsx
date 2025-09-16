import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const VisualBanner = ({ 
  message, 
  emoji, 
  action, 
  actionText, 
  actionIcon, 
  color = "bg-blue-50 border-blue-200", 
  show = true 
}) => {
  const navigate = useNavigate();

  if (!show) return null;

  const handleAction = () => {
    if (action) {
      if (typeof action === 'string') {
        navigate(action);
      } else if (typeof action === 'function') {
        action();
      }
    }
  };

  return (
    <div className={`${color} border rounded-xl p-6 text-center`}>
      <div className="text-4xl mb-3">{emoji}</div>
      <p className="text-gray-800 text-lg mb-4 font-medium">{message}</p>
      {actionText && (
        <Button
          onClick={handleAction}
          variant="default"
          size="lg"
          iconName={actionIcon}
          iconPosition="left"
        >
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default VisualBanner;