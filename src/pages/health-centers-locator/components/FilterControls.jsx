import React from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const FilterControls = ({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  isMobile = false 
}) => {
  const facilityTypeOptions = [
    { value: 'all', label: 'All Facilities' },
    { value: 'hospital', label: 'Hospitals' },
    { value: 'clinic', label: 'Clinics' },
    { value: 'specialty', label: 'Specialty Centers' },
    { value: 'emergency', label: 'Emergency Care' }
  ];

  const distanceOptions = [
    { value: '5', label: 'Within 5 km' },
    { value: '10', label: 'Within 10 km' },
    { value: '25', label: 'Within 25 km' },
    { value: '50', label: 'Within 50 km' }
  ];

  const serviceOptions = [
    { value: 'all', label: 'All Services' },
    { value: 'emergency', label: 'Emergency Services' },
    { value: 'pharmacy', label: 'Pharmacy' },
    { value: 'lab', label: 'Laboratory' },
    { value: 'xray', label: 'X-Ray/Imaging' },
    { value: 'multilingual', label: 'Multilingual Staff' }
  ];

  const hasActiveFilters = filters?.facilityType !== 'all' || 
                          filters?.distance !== '25' || 
                          filters?.services !== 'all';

  if (isMobile) {
    return (
      <div className="bg-card border-b border-border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-foreground">Filters</h3>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
            >
              Clear
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 gap-3">
          <Select
            label="Facility Type"
            options={facilityTypeOptions}
            value={filters?.facilityType}
            onChange={(value) => onFilterChange('facilityType', value)}
          />
          
          <Select
            label="Distance"
            options={distanceOptions}
            value={filters?.distance}
            onChange={(value) => onFilterChange('distance', value)}
          />
          
          <Select
            label="Services"
            options={serviceOptions}
            value={filters?.services}
            onChange={(value) => onFilterChange('services', value)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border-b border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-foreground flex items-center">
          <Icon name="Filter" size={18} className="mr-2" />
          Filter Health Centers
        </h3>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
          >
            Clear Filters
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="Facility Type"
          options={facilityTypeOptions}
          value={filters?.facilityType}
          onChange={(value) => onFilterChange('facilityType', value)}
        />
        
        <Select
          label="Distance"
          options={distanceOptions}
          value={filters?.distance}
          onChange={(value) => onFilterChange('distance', value)}
        />
        
        <Select
          label="Services"
          options={serviceOptions}
          value={filters?.services}
          onChange={(value) => onFilterChange('services', value)}
        />
      </div>
    </div>
  );
};

export default FilterControls;