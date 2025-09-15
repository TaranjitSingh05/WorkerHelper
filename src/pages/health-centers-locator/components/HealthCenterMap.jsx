import React, { useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';

const HealthCenterMap = ({ 
  userLocation, 
  healthCenters, 
  selectedCenter, 
  onCenterSelect,
  className = "" 
}) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!userLocation) return;

    // Initialize map with user location
    const initializeMap = () => {
      // This would integrate with Leaflet.js in a real implementation
      console.log('Initializing map with location:', userLocation);
      console.log('Health centers:', healthCenters);
    };

    initializeMap();
  }, [userLocation, healthCenters]);

  const handleCenterClick = (center) => {
    onCenterSelect(center);
  };

  if (!userLocation) {
    return (
      <div className={`bg-muted rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-8">
          <Icon name="MapPin" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Enable location access to view map
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-card rounded-lg overflow-hidden ${className}`}>
      {/* Map Container - Using Google Maps iframe as fallback */}
      <div className="w-full h-full">
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title="Health Centers Map"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${userLocation?.lat},${userLocation?.lng}&z=14&output=embed`}
          className="border-0"
        />
      </div>
      {/* Map Controls */}
      <div className="absolute top-4 right-4 space-y-2">
        <button className="w-10 h-10 bg-card border border-border rounded-lg shadow-card flex items-center justify-center hover:bg-muted transition-smooth">
          <Icon name="Plus" size={16} />
        </button>
        <button className="w-10 h-10 bg-card border border-border rounded-lg shadow-card flex items-center justify-center hover:bg-muted transition-smooth">
          <Icon name="Minus" size={16} />
        </button>
        <button className="w-10 h-10 bg-card border border-border rounded-lg shadow-card flex items-center justify-center hover:bg-muted transition-smooth">
          <Icon name="Navigation" size={16} />
        </button>
      </div>
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card border border-border rounded-lg shadow-card p-3">
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-foreground">Your Location</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-error rounded-full"></div>
            <span className="text-foreground">Hospitals</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-secondary rounded-full"></div>
            <span className="text-foreground">Clinics</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent rounded-full"></div>
            <span className="text-foreground">Specialty Centers</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthCenterMap;