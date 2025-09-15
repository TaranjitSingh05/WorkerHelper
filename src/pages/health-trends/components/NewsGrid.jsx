import React from 'react';
import NewsCard from './NewsCard';
import SkeletonCard from './SkeletonCard';
import Icon from '../../../components/AppIcon';


const NewsGrid = ({ articles, isLoading, onArticleClick }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 })?.map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (!articles || articles?.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="Newspaper" size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No Articles Found</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          We couldn't find any health news articles at the moment. Please try refreshing or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles?.map((article, index) => (
        <NewsCard
          key={`${article?.url}-${index}`}
          article={article}
          onClick={onArticleClick}
        />
      ))}
    </div>
  );
};

export default NewsGrid;