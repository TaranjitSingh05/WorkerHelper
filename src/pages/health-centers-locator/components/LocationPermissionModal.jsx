import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LocationPermissionModal = ({ isOpen, onClose, onAllowLocation, onManualEntry }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-xl shadow-modal max-w-md w-full p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="MapPin" size={32} className="text-primary" />
            </div>
            
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Enable Location Access
            </h3>
            
            <p className="text-muted-foreground mb-6">
              We need your location to find nearby health centers and hospitals. Your location data is only used to show relevant facilities and is not stored.
            </p>
            
            <div className="space-y-3">
              <Button 
                variant="default" 
                fullWidth 
                iconName="MapPin" 
                iconPosition="left"
                onClick={onAllowLocation}
              >
                Allow Location Access
              </Button>
              
              <Button 
                variant="outline" 
                fullWidth 
                iconName="Edit" 
                iconPosition="left"
                onClick={onManualEntry}
              >
                Enter Location Manually
              </Button>
              
              <Button 
                variant="ghost" 
                fullWidth
                onClick={onClose}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LocationPermissionModal;