import React from 'react';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FilterControls = ({ 
  sortBy, 
  setSortBy, 
  category, 
  setCategory, 
  onRefresh, 
  isLoading 
}) => {
  const sortOptions = [
    { value: 'publishedAt', label: 'Latest First' },
    { value: 'relevancy', label: 'Most Relevant' },
    { value: 'popularity', label: 'Most Popular' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Health News' },
    { value: 'occupational', label: 'Occupational Health' },
    { value: 'disease', label: 'Disease Prevention' },
    { value: 'safety', label: 'Workplace Safety' },
    { value: 'mental', label: 'Mental Health' },
    { value: 'nutrition', label: 'Nutrition & Wellness' }
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left Section - Filters */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="flex-1 min-w-0">
            <Select
              label="Sort By"
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
              className="w-full"
            />
          </div>
          <div className="flex-1 min-w-0">
            <Select
              label="Category"
              options={categoryOptions}
              value={category}
              onChange={setCategory}
              className="w-full"
            />
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={onRefresh}
            loading={isLoading}
            iconName="RefreshCw"
            iconPosition="left"
            className="whitespace-nowrap"
          >
            Refresh News
          </Button>
          <div className="hidden sm:flex items-center space-x-2 text-muted-foreground">
            <Icon name="Info" size={16} />
            <span className="text-sm">Updated every hour</span>
          </div>
        </div>
      </div>

      {/* Mobile Info */}
      <div className="sm:hidden mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Icon name="Info" size={14} />
          <span className="text-xs">News updated every hour</span>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;