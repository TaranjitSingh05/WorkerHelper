import React from 'react';
import Icon from '../../../components/AppIcon';

const StatsOverview = ({ totalArticles, lastUpdated, categories }) => {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const stats = [
    {
      icon: 'Newspaper',
      label: 'Total Articles',
      value: totalArticles || 0,
      color: 'text-primary'
    },
    {
      icon: 'Clock',
      label: 'Last Updated',
      value: lastUpdated ? formatTime(lastUpdated) : 'Just now',
      color: 'text-secondary'
    },
    {
      icon: 'Tag',
      label: 'Categories',
      value: categories || 6,
      color: 'text-accent'
    },
    {
      icon: 'TrendingUp',
      label: 'Trending Topics',
      value: 'Workplace Safety',
      color: 'text-success'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats?.map((stat, index) => (
        <div key={index} className="bg-card border border-border rounded-xl p-6 text-center">
          <div className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3 ${stat?.color}`}>
            <Icon name={stat?.icon} size={20} />
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">
            {stat?.value}
          </div>
          <div className="text-sm text-muted-foreground">
            {stat?.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;