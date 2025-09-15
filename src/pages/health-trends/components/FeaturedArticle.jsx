import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FeaturedArticle = ({ article, onClick }) => {
  if (!article) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text?.length > maxLength ? text?.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl overflow-hidden mb-8 group cursor-pointer" onClick={() => onClick(article)}>
      <div className="flex flex-col lg:flex-row">
        {/* Content Section */}
        <div className="flex-1 p-8 lg:p-12 text-white">
          <div className="flex items-center space-x-2 mb-4">
            <div className="bg-white bg-opacity-20 rounded-full px-3 py-1">
              <span className="text-sm font-medium">Featured Article</span>
            </div>
            <div className="bg-white bg-opacity-20 rounded-full p-1">
              <Icon name="Star" size={14} />
            </div>
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold mb-4 leading-tight">
            {truncateText(article?.title, 100)}
          </h1>

          <p className="text-lg opacity-90 mb-6 leading-relaxed">
            {truncateText(article?.description, 200)}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4 text-sm opacity-80">
              <div className="flex items-center space-x-2">
                <Icon name="Calendar" size={16} />
                <span>{formatDate(article?.publishedAt)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Building" size={16} />
                <span>{article?.source?.name || 'Health News'}</span>
              </div>
            </div>

            <Button
              variant="secondary"
              iconName="ArrowRight"
              iconPosition="right"
              className="bg-white text-primary hover:bg-opacity-90 self-start sm:self-auto"
            >
              Read Full Story
            </Button>
          </div>
        </div>

        {/* Image Section */}
        <div className="lg:w-96 h-64 lg:h-auto relative overflow-hidden">
          <Image
            src={article?.urlToImage || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop'}
            alt={article?.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black from-0% via-transparent to-transparent lg:bg-gradient-to-l lg:from-transparent lg:to-black lg:to-0%"></div>
          <div className="absolute top-4 right-4 bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-2">
            <Icon name="ExternalLink" size={16} className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedArticle;