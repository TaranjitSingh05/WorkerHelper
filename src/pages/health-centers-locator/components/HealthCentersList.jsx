import React from 'react';
import Icon from '../../../components/AppIcon';
import HealthCenterCard from './HealthCenterCard';

const HealthCentersList = ({ 
  healthCenters, 
  userLocation, 
  selectedCenter, 
  onCenterSelect,
  isLoading = false,
  className = ""
}) => {
  if (isLoading) {
    return (
      <div className={`bg-card rounded-lg p-6 ${className}`}>
        <div className="space-y-4">
          {[...Array(5)]?.map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-muted rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!healthCenters || healthCenters?.length === 0) {
    return (
      <div className={`bg-card rounded-lg p-8 text-center ${className}`}>
        <Icon name="MapPin" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          No Health Centers Found
        </h3>
        <p className="text-muted-foreground mb-4">
          We couldn't find any health centers in your area. Try adjusting your filters or expanding your search radius.
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-card rounded-lg ${className}`}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">
            Nearby Health Centers
          </h3>
          <span className="text-sm text-muted-foreground">
            {healthCenters?.length} facilities found
          </span>
        </div>
      </div>
      <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
        {healthCenters?.map((center) => (
          <HealthCenterCard
            key={center?.id}
            center={center}
            userLocation={userLocation}
            onSelect={onCenterSelect}
            isSelected={selectedCenter?.id === center?.id}
          />
        ))}
      </div>
    </div>
  );
};

export default HealthCentersList;