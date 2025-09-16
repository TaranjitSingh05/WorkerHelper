import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';

import FilterControls from './components/FilterControls';
import NewsGrid from './components/NewsGrid';
import SkeletonCard from './components/SkeletonCard';
import FeaturedArticle from './components/FeaturedArticle';
import StatsOverview from './components/StatsOverview';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const HealthTrends = () => {
  const [articles, setArticles] = useState([]);
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('publishedAt');
  const [category, setCategory] = useState('all');
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [lastUpdated, setLastUpdated] = useState(new Date()?.toISOString());

  // Mock health news data
  const mockArticles = [
    {
      title: "New Guidelines for Construction Worker Safety Released by Kerala Health Department",
      description: "The Kerala State Health Department has issued comprehensive safety guidelines for construction workers, focusing on heat-related illness prevention and proper use of personal protective equipment during monsoon season.",
      url: "https://example.com/construction-safety-guidelines",
      urlToImage: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop",
      publishedAt: "2025-01-14T10:30:00Z",
      source: { name: "Kerala Health News" },
      category: "occupational"
    },
    {
      title: "Fishery Workers Face Increased Risk of Respiratory Infections During Monsoon",
      description: "Recent studies show that fishery workers in coastal Kerala are experiencing higher rates of respiratory infections. Health experts recommend preventive measures including proper ventilation and regular health screenings.",
      url: "https://example.com/fishery-worker-health",
      urlToImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
      publishedAt: "2025-01-13T14:15:00Z",
      source: { name: "Coastal Health Monitor" },
      category: "occupational"
    },
    {
      title: "Mental Health Support Programs Launched for Migrant Workers",
      description: "Kerala government launches comprehensive mental health support programs specifically designed for migrant workers, offering counseling services in multiple languages including Hindi, Bengali, and Punjabi.",
      url: "https://example.com/mental-health-support",
      urlToImage: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop",
      publishedAt: "2025-01-12T09:45:00Z",
      source: { name: "Kerala Mental Health Initiative" },
      category: "mental"
    },
    {
      title: "Factory Workers Report Higher Rates of Skin Allergies Due to Chemical Exposure",
      description: "A comprehensive study reveals that factory workers in Kerala\'s industrial sectors are experiencing increased skin allergies. New safety protocols and protective equipment guidelines have been introduced.",
      url: "https://example.com/factory-worker-allergies",
      urlToImage: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop",
      publishedAt: "2025-01-11T16:20:00Z",
      source: { name: "Industrial Health Watch" },
      category: "safety"
    },
    {
      title: "Nutrition Programs for Construction Workers Show Positive Health Outcomes",
      description: "Pilot nutrition programs implemented across construction sites in Kerala demonstrate significant improvements in worker health, energy levels, and reduced sick days among participants.",
      url: "https://example.com/nutrition-programs",
      urlToImage: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop",
      publishedAt: "2025-01-10T11:30:00Z",
      source: { name: "Worker Wellness Today" },
      category: "nutrition"
    },
    {
      title: "Heat Stroke Prevention Campaign Targets Outdoor Workers",
      description: "With rising temperatures, Kerala health authorities launch an intensive heat stroke prevention campaign targeting outdoor workers including construction, agriculture, and transportation sectors.",
      url: "https://example.com/heat-stroke-prevention",
      urlToImage: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop",
      publishedAt: "2025-01-09T13:10:00Z",
      source: { name: "Public Health Kerala" },
      category: "disease"
    },
    {
      title: "Digital Health Records System Reduces Medical Errors for Migrant Workers",
      description: "Implementation of digital health record systems across Kerala healthcare facilities shows 40% reduction in medical errors and improved treatment outcomes for migrant worker patients.",
      url: "https://example.com/digital-health-records",
      urlToImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
      publishedAt: "2025-01-08T08:45:00Z",
      source: { name: "Healthcare Innovation Kerala" },
      category: "all"
    },
    {
      title: "Workplace Injury Rates Drop 25% Following New Safety Protocols",
      description: "Implementation of enhanced workplace safety protocols across Kerala's industrial and construction sectors results in significant reduction in worker injuries and improved overall safety standards.",
      url: "https://example.com/workplace-injury-reduction",
      urlToImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop",
      publishedAt: "2025-01-07T15:25:00Z",
      source: { name: "Safety First Kerala" },
      category: "safety"
    },
    {
      title: "Vaccination Drive Targets High-Risk Occupational Groups",
      description: "Kerala health department launches targeted vaccination campaigns for high-risk occupational groups including healthcare workers, construction workers, and factory employees to prevent seasonal diseases.",
      url: "https://example.com/vaccination-drive",
      urlToImage: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&h=300&fit=crop",
      publishedAt: "2025-01-06T12:00:00Z",
      source: { name: "Kerala Vaccination Program" },
      category: "disease"
    }
  ];

  // Load language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('JeevanID-language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  // Simulate API call to fetch articles
  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let filteredArticles = [...mockArticles];
      
      // Filter by category
      if (category !== 'all') {
        filteredArticles = filteredArticles?.filter(article => 
          article?.category === category
        );
      }
      
      // Sort articles
      filteredArticles?.sort((a, b) => {
        if (sortBy === 'publishedAt') {
          return new Date(b.publishedAt) - new Date(a.publishedAt);
        } else if (sortBy === 'relevancy') {
          return Math.random() - 0.5; // Random for demo
        } else if (sortBy === 'popularity') {
          return Math.random() - 0.5; // Random for demo
        }
        return 0;
      });
      
      setArticles(filteredArticles);
      setFeaturedArticle(filteredArticles?.[0] || null);
      setLastUpdated(new Date()?.toISOString());
      setIsLoading(false);
    };

    fetchArticles();
  }, [sortBy, category]);

  const handleArticleClick = (article) => {
    // Open article in new tab
    window.open(article?.url, '_blank', 'noopener,noreferrer');
  };

  const handleRefresh = () => {
    setLastUpdated(new Date()?.toISOString());
    // Trigger re-fetch
    const event = new Date();
    setSortBy(sortBy); // Trigger useEffect
  };

  const getPageTitle = () => {
    const titles = {
      en: 'Health Trends - JeevanID',
      hi: 'स्वास्थ्य रुझान - JeevanID',
      bn: 'স্বাস্থ্য প্রবণতা - JeevanID',
      pa: 'ਸਿਹਤ ਰੁਝਾਨ - JeevanID'
    };
    return titles?.[currentLanguage] || titles?.en;
  };

  const getContent = () => {
    const content = {
      en: {
        pageTitle: 'Health Trends & News',
        pageSubtitle: 'Stay informed with the latest health news and trends affecting migrant workers in Kerala',
        noArticles: 'No articles found for the selected filters.',
        tryDifferent: 'Try selecting different filters or refresh the page.'
      },
      hi: {
        pageTitle: 'स्वास्थ्य रुझान और समाचार',
        pageSubtitle: 'केरल में प्रवासी श्रमिकों को प्रभावित करने वाली नवीनतम स्वास्थ्य समाचार और रुझानों से अवगत रहें',
        noArticles: 'चयनित फ़िल्टर के लिए कोई लेख नहीं मिला।',
        tryDifferent: 'विभिन्न फ़िल्टर का चयन करने या पृष्ठ को रीफ्रेश करने का प्रयास करें।'
      },
      bn: {
        pageTitle: 'স্বাস্থ্য প্রবণতা ও সংবাদ',
        pageSubtitle: 'কেরালার অভিবাসী শ্রমিকদের প্রভাবিত করে এমন সর্বশেষ স্বাস্থ্য সংবাদ এবং প্রবণতা সম্পর্কে অবগত থাকুন',
        noArticles: 'নির্বাচিত ফিল্টারের জন্য কোনো নিবন্ধ পাওয়া যায়নি।',
        tryDifferent: 'বিভিন্ন ফিল্টার নির্বাচন করুন বা পৃষ্ঠা রিফ্রেশ করুন।'
      },
      pa: {
        pageTitle: 'ਸਿਹਤ ਰੁਝਾਨ ਅਤੇ ਖ਼ਬਰਾਂ',
        pageSubtitle: 'ਕੇਰਲ ਵਿੱਚ ਪ੍ਰਵਾਸੀ ਮਜ਼ਦੂਰਾਂ ਨੂੰ ਪ੍ਰਭਾਵਿਤ ਕਰਨ ਵਾਲੀਆਂ ਨਵੀਨਤਮ ਸਿਹਤ ਖ਼ਬਰਾਂ ਅਤੇ ਰੁਝਾਨਾਂ ਨਾਲ ਜਾਣੂ ਰਹੋ',
        noArticles: 'ਚੁਣੇ ਗਏ ਫਿਲਟਰਾਂ ਲਈ ਕੋਈ ਲੇਖ ਨਹੀਂ ਮਿਲਿਆ।',
        tryDifferent: 'ਵੱਖ-ਵੱਖ ਫਿਲਟਰ ਚੁਣਨ ਜਾਂ ਪੰਨਾ ਰਿਫਰੈਸ਼ ਕਰਨ ਦੀ ਕੋਸ਼ਿਸ਼ ਕਰੋ।'
      }
    };
    return content?.[currentLanguage] || content?.en;
  };

  const content = getContent();

  return (
    <>
      <Helmet>
        <title>{getPageTitle()}</title>
        <meta name="description" content="Stay updated with the latest health trends and news affecting migrant workers in Kerala. Get insights on occupational health, disease prevention, and workplace safety." />
        <meta name="keywords" content="health trends, migrant workers, Kerala health news, occupational health, workplace safety" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-20">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                  {content?.pageTitle}
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  {content?.pageSubtitle}
                </p>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Stats Overview */}
              <StatsOverview 
                totalArticles={articles?.length}
                lastUpdated={lastUpdated}
                categories={6}
              />

              {/* Filter Controls */}
              <FilterControls
                sortBy={sortBy}
                setSortBy={setSortBy}
                category={category}
                setCategory={setCategory}
                onRefresh={handleRefresh}
                isLoading={isLoading}
              />

              {/* Featured Article */}
              {!isLoading && featuredArticle && (
                <FeaturedArticle
                  article={featuredArticle}
                  onClick={handleArticleClick}
                />
              )}

              {/* News Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 9 })?.map((_, index) => (
                    <SkeletonCard key={index} />
                  ))}
                </div>
              ) : articles?.length > 0 ? (
                <NewsGrid
                  articles={articles?.slice(1)} // Exclude featured article
                  isLoading={false}
                  onArticleClick={handleArticleClick}
                />
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon name="Newspaper" size={32} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {content?.noArticles}
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    {content?.tryDifferent}
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleRefresh}
                    iconName="RefreshCw"
                    iconPosition="left"
                  >
                    Refresh News
                  </Button>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default HealthTrends;