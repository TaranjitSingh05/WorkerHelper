import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const NewsCard = ({ article, onClick }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text?.length > maxLength ? text?.substring(0, maxLength) + '...' : text;
  };

  return (
    <div 
      className="bg-card border border-border rounded-xl overflow-hidden shadow-card hover:shadow-interactive transition-all duration-300 cursor-pointer group"
      onClick={() => onClick(article)}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={article?.urlToImage || 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop'}
          alt={article?.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-2">
          <Icon name="ExternalLink" size={14} className="text-primary" />
        </div>
      </div>
      {/* Content Section */}
      <div className="p-5">
        {/* Source and Date */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-sm font-medium text-primary">
              {article?.source?.name || 'Health News'}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {formatDate(article?.publishedAt)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
          {truncateText(article?.title, 80)}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {truncateText(article?.description, 120)}
        </p>

        {/* Read More Link */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-primary group-hover:text-primary-foreground">
            <span className="text-sm font-medium">Read Full Article</span>
            <Icon name="ArrowRight" size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Icon name="Clock" size={12} />
            <span className="text-xs">2 min read</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;