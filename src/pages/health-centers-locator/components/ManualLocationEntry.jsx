import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ManualLocationEntry = ({ isOpen, onClose, onLocationSubmit }) => {
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!location?.trim()) {
      setError('Please enter a location');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Mock geocoding - in real app would use geocoding service
      const mockCoordinates = {
        lat: 10.8505 + (Math.random() - 0.5) * 0.1,
        lng: 76.2711 + (Math.random() - 0.5) * 0.1,
        address: location
      };
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      onLocationSubmit(mockCoordinates);
      onClose();
    } catch (err) {
      setError('Unable to find location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-xl shadow-modal max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-foreground">
              Enter Your Location
            </h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Location"
              type="text"
              placeholder="Enter city, area, or address"
              value={location}
              onChange={(e) => setLocation(e?.target?.value)}
              error={error}
              required
            />
            
            <div className="text-sm text-muted-foreground">
              <Icon name="Info" size={16} className="inline mr-2" />
              Enter your current location to find nearby health centers
            </div>
            
            <div className="flex space-x-3">
              <Button 
                type="submit" 
                variant="default" 
                fullWidth 
                loading={isLoading}
                iconName="Search" 
                iconPosition="left"
              >
                Find Health Centers
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ManualLocationEntry;