import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HealthCenterCard = ({ center, userLocation, onSelect, isSelected = false }) => {
  const getFacilityIcon = (type) => {
    switch (type) {
      case 'hospital':
        return 'Building2';
      case 'clinic':
        return 'Stethoscope';
      case 'specialty':
        return 'Heart';
      case 'emergency':
        return 'Zap';
      default:
        return 'MapPin';
    }
  };

  const getFacilityColor = (type) => {
    switch (type) {
      case 'hospital':
        return 'text-error';
      case 'clinic':
        return 'text-secondary';
      case 'specialty':
        return 'text-accent';
      case 'emergency':
        return 'text-warning';
      default:
        return 'text-primary';
    }
  };

  const handleDirections = () => {
    const url = `https://www.google.com/maps/dir/${userLocation?.lat},${userLocation?.lng}/${center?.lat},${center?.lng}`;
    window.open(url, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${center?.phone}`, '_self');
  };

  return (
    <div 
      className={`bg-card border rounded-lg p-4 cursor-pointer transition-smooth hover:shadow-interactive ${
        isSelected ? 'border-primary shadow-interactive' : 'border-border'
      }`}
      onClick={() => onSelect(center)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3">
          <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${getFacilityColor(center?.type)}`}>
            <Icon name={getFacilityIcon(center?.type)} size={20} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">{center?.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">{center?.address}</p>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span className="flex items-center">
                <Icon name="MapPin" size={12} className="mr-1" />
                {center?.distance} km away
              </span>
              {center?.isOpen && (
                <span className="flex items-center text-secondary">
                  <Icon name="Clock" size={12} className="mr-1" />
                  Open now
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-foreground capitalize">
            {center?.type}
          </div>
          {center?.rating && (
            <div className="flex items-center mt-1">
              <Icon name="Star" size={12} className="text-accent mr-1" />
              <span className="text-xs text-muted-foreground">{center?.rating}</span>
            </div>
          )}
        </div>
      </div>
      {/* Services */}
      {center?.services && center?.services?.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {center?.services?.slice(0, 3)?.map((service, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-muted text-xs text-muted-foreground rounded"
              >
                {service}
              </span>
            ))}
            {center?.services?.length > 3 && (
              <span className="px-2 py-1 bg-muted text-xs text-muted-foreground rounded">
                +{center?.services?.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
      {/* Contact Information */}
      <div className="space-y-2 mb-3">
        {center?.phone && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Icon name="Phone" size={14} className="mr-2" />
            <span>{center?.phone}</span>
          </div>
        )}
        {center?.hours && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Icon name="Clock" size={14} className="mr-2" />
            <span>{center?.hours}</span>
          </div>
        )}
        {center?.languages && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Icon name="Languages" size={14} className="mr-2" />
            <span>{center?.languages?.join(', ')}</span>
          </div>
        )}
      </div>
      {/* Action Buttons */}
      <div className="flex space-x-2">
        <Button 
          variant="default" 
          size="sm" 
          fullWidth
          iconName="Navigation" 
          iconPosition="left"
          onClick={(e) => {
            e?.stopPropagation();
            handleDirections();
          }}
        >
          Directions
        </Button>
        {center?.phone && (
          <Button 
            variant="outline" 
            size="sm"
            iconName="Phone" 
            onClick={(e) => {
              e?.stopPropagation();
              handleCall();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default HealthCenterCard;