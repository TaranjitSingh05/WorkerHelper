import React from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ArticlesSection = ({ currentLanguage }) => {
  const content = {
    en: {
      title: "Health Information & Success Stories",
      subtitle: "Stay informed with the latest health trends and read inspiring stories from fellow workers",
      viewAll: "View All Articles",
      readMore: "Read More",
      categories: {
        health: "Health Tips",
        success: "Success Story",
        news: "Health News"
      }
    },
    hi: {
      title: "स्वास्थ्य जानकारी और सफलता की कहानियां",
      subtitle: "नवीनतम स्वास्थ्य रुझानों से अवगत रहें और साथी कर्मचारियों की प्रेरणादायक कहानियां पढ़ें",
      viewAll: "सभी लेख देखें",
      readMore: "और पढ़ें",
      categories: {
        health: "स्वास्थ्य सुझाव",
        success: "सफलता की कहानी",
        news: "स्वास्थ्य समाचार"
      }
    },
    bn: {
      title: "স্বাস্থ্য তথ্য ও সফলতার গল্প",
      subtitle: "সর্বশেষ স্বাস্থ্য প্রবণতা সম্পর্কে অবগত থাকুন এবং সহকর্মীদের অনুপ্রেরণামূলক গল্প পড়ুন",
      viewAll: "সব নিবন্ধ দেখুন",
      readMore: "আরও পড়ুন",
      categories: {
        health: "স্বাস্থ্য টিপস",
        success: "সফলতার গল্প",
        news: "স্বাস্থ্য সংবাদ"
      }
    },
    pa: {
      title: "ਸਿਹਤ ਜਾਣਕਾਰੀ ਅਤੇ ਸਫਲਤਾ ਦੀਆਂ ਕਹਾਣੀਆਂ",
      subtitle: "ਨਵੀਨਤਮ ਸਿਹਤ ਰੁਝਾਨਾਂ ਨਾਲ ਜਾਣੂ ਰਹੋ ਅਤੇ ਸਾਥੀ ਕਰਮਚਾਰੀਆਂ ਦੀਆਂ ਪ੍ਰੇਰਣਾਦਾਇਕ ਕਹਾਣੀਆਂ ਪੜ੍ਹੋ",
      viewAll: "ਸਾਰੇ ਲੇਖ ਦੇਖੋ",
      readMore: "ਹੋਰ ਪੜ੍ਹੋ",
      categories: {
        health: "ਸਿਹਤ ਸੁਝਾਅ",
        success: "ਸਫਲਤਾ ਦੀ ਕਹਾਣੀ",
        news: "ਸਿਹਤ ਸਮਾਚਾਰ"
      }
    }
  };

  const articles = [
    {
      id: 1,
      category: "health",
      title: {
        en: "Preventing Heat Stroke in Construction Work",
        hi: "निर्माण कार्य में हीट स्ट्रोक से बचाव",
        bn: "নির্माণ কাজে হিট স্ট্রোকের প্রতিরোধ",
        pa: "ਉਸਾਰੀ ਕੰਮ ਵਿੱਚ ਹੀਟ ਸਟ੍ਰੋਕ ਤੋਂ ਬਚਾਅ"
      },
      description: {
        en: "Essential tips for construction workers to stay safe during Kerala\'s hot weather conditions and prevent heat-related illnesses.",
        hi: "केरल की गर्म मौसम की स्थिति के दौरान निर्माण श्रमिकों के लिए सुरक्षित रहने और गर्मी संबंधी बीमारियों से बचने के लिए आवश्यक सुझाव।",
        bn: "কেরালার গরম আবহাওয়ার পরিস্থিতিতে নির্माণ শ্রমিকদের নিরাপদ থাকার এবং তাপ-সম্পর্কিত অসুস্থতা প্রতিরোধের জন্য প্রয়োজনীয় টিপস।",
        pa: "ਕੇਰਲ ਦੇ ਗਰਮ ਮੌਸਮ ਦੀਆਂ ਸਥਿਤੀਆਂ ਦੌਰਾਨ ਉਸਾਰੀ ਮਜ਼ਦੂਰਾਂ ਲਈ ਸੁਰੱਖਿਤ ਰਹਿਣ ਅਤੇ ਗਰਮੀ ਸੰਬੰਧੀ ਬਿਮਾਰੀਆਂ ਤੋਂ ਬਚਣ ਲਈ ਜ਼ਰੂਰੀ ਸੁਝਾਅ।"
      },
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      readTime: "5 min read",
      date: "2025-01-10"
    },
    {
      id: 2,
      category: "success",
      title: {
        en: "From Worker to Health Ambassador: Ravi's Journey",
        hi: "मजदूर से स्वास्थ्य राजदूत तक: रवि की यात्रा",
        bn: "শ্রমিক থেকে স্বাস্থ্য দূত: রবির যাত্রা",
        pa: "ਮਜ਼ਦੂਰ ਤੋਂ ਸਿਹਤ ਰਾਜਦੂਤ ਤੱਕ: ਰਵੀ ਦੀ ਯਾਤਰਾ"
      },
      description: {
        en: "How a construction worker from Bihar became a health advocate for his community using WorkerHelper\'s digital health records.",
        hi: "कैसे बिहार का एक निर्माण मजदूर WorkerHelper के डिजिटल स्वास्थ्य रिकॉर्ड का उपयोग करके अपने समुदाय के लिए स्वास्थ्य अधिवक्ता बन गया।",
        bn: "কীভাবে বিহারের একজন নির্माণ শ্রমিক WorkerHelper-এর ডিজিটাল স্বাস্থ্য রেকর্ড ব্যবহার করে তার সম্প্রদায়ের জন্য স্বাস্থ্য অ্যাডভোকেট হয়ে উঠেছেন।",
        pa: "ਕਿਵੇਂ ਬਿਹਾਰ ਦਾ ਇੱਕ ਉਸਾਰੀ ਮਜ਼ਦੂਰ WorkerHelper ਦੇ ਡਿਜੀਟਲ ਸਿਹਤ ਰਿਕਾਰਡ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਆਪਣੇ ਭਾਈਚਾਰੇ ਲਈ ਸਿਹਤ ਐਡਵੋਕੇਟ ਬਣ ਗਿਆ।"
      },
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      readTime: "8 min read",
      date: "2025-01-08"
    },
    {
      id: 3,
      category: "news",
      title: {
        en: "Kerala Launches New Health Initiative for Migrant Workers",
        hi: "केरल ने प्रवासी श्रमिकों के लिए नई स्वास्थ्य पहल शुरू की",
        bn: "কেরালা অভিবাসী শ্রমিকদের জন্য নতুন স্বাস্থ্য উদ্যোগ চালু করেছে",
        pa: "ਕੇਰਲ ਨੇ ਪ੍ਰਵਾਸੀ ਮਜ਼ਦੂਰਾਂ ਲਈ ਨਵੀਂ ਸਿਹਤ ਪਹਿਲ ਸ਼ੁਰੂ ਕੀਤੀ"
      },
      description: {
        en: "The state government announces comprehensive healthcare coverage and digital health ID program for all registered migrant workers.",
        hi: "राज्य सरकार ने सभी पंजीकृत प्रवासी श्रमिकों के लिए व्यापक स्वास्थ्य कवरेज और डिजिटल स्वास्थ्य आईडी कार्यक्रम की घोषणा की।",
        bn: "রাজ্য সরকার সমস্ত নিবন্ধিত অভিবাসী শ্রমিকদের জন্য ব্যাপক স্বাস্থ্যসেবা কভারেজ এবং ডিজিটাল স্বাস্থ্য আইডি প্রোগ্রাম ঘোষণা করেছে।",
        pa: "ਰਾਜ ਸਰਕਾਰ ਨੇ ਸਾਰੇ ਰਜਿਸਟਰਡ ਪ੍ਰਵਾਸੀ ਮਜ਼ਦੂਰਾਂ ਲਈ ਵਿਆਪਕ ਸਿਹਤ ਕਵਰੇਜ ਅਤੇ ਡਿਜੀਟਲ ਸਿਹਤ ਆਈਡੀ ਪ੍ਰੋਗਰਾਮ ਦੀ ਘੋਸ਼ਣਾ ਕੀਤੀ।"
      },
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      readTime: "6 min read",
      date: "2025-01-12"
    },
    {
      id: 4,
      category: "health",
      title: {
        en: "Mental Health Support for Fishery Workers",
        hi: "मत्स्य श्रमिकों के लिए मानसिक स्वास्थ्य सहायता",
        bn: "মৎস্য শ্রমিকদের জন্য মানসিক স্বাস্থ্য সহায়তা",
        pa: "ਮੱਛੀ ਪਾਲਣ ਮਜ਼ਦੂਰਾਂ ਲਈ ਮਾਨਸਿਕ ਸਿਹਤ ਸਹਾਇਤਾ"
      },
      description: {
        en: "Understanding the unique mental health challenges faced by fishery workers and available support resources in Kerala.",
        hi: "मत्स्य श्रमिकों द्वारा सामना की जाने वाली अनूठी मानसिक स्वास्थ्य चुनौतियों और केरल में उपलब्ध सहायता संसाधनों को समझना।",
        bn: "মৎস্য শ্রমিকদের সম্মুখীন হওয়া অনন্য মানসিক স্বাস্থ্য চ্যালেঞ্জ এবং কেরালায় উপলব্ধ সহায়তা সংস্থানগুলি বোঝা।",
        pa: "ਮੱਛੀ ਪਾਲਣ ਮਜ਼ਦੂਰਾਂ ਦੁਆਰਾ ਸਾਹਮਣਾ ਕੀਤੀਆਂ ਜਾਣ ਵਾਲੀਆਂ ਵਿਲੱਖਣ ਮਾਨਸਿਕ ਸਿਹਤ ਚੁਣੌਤੀਆਂ ਅਤੇ ਕੇਰਲ ਵਿੱਚ ਉਪਲਬਧ ਸਹਾਇਤਾ ਸਰੋਤਾਂ ਨੂੰ ਸਮਝਣਾ।"
      },
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      readTime: "7 min read",
      date: "2025-01-05"
    },
    {
      id: 5,
      category: "success",
      title: {
        en: "Digital Health Records Save Lives: Priya\'s Emergency",
        hi: "डिजिटल स्वास्थ्य रिकॉर्ड जीवन बचाते हैं: प्रिया की आपातकाल",
        bn: "ডিজিটাল স্বাস্থ্য রেকর্ড জীবন বাঁচায়: প্রিয়ার জরুরি অবস্থা",
        pa: "ਡਿਜੀਟਲ ਸਿਹਤ ਰਿਕਾਰਡ ਜਾਨਾਂ ਬਚਾਉਂਦੇ ਹਨ: ਪ੍ਰਿਯਾ ਦੀ ਐਮਰਜੈਂਸੀ"
      },
      description: {
        en: "How instant access to digital health records helped save a factory worker's life during a medical emergency in Kochi.",
        hi: "कैसे डिजिटल स्वास्थ्य रिकॉर्ड तक तत्काल पहुंच ने कोच्चि में एक चिकित्सा आपातकाल के दौरान एक कारखाना मजदूर की जान बचाने में मदद की।",
        bn: "কীভাবে ডিজিটাল স্বাস্থ্য রেকর্ডের তাৎক্ষণিক অ্যাক্সেস কোচিতে একটি চিকিৎসা জরুরি অবস্থার সময় একজন কারখানা শ্রমিকের জীবন বাঁচাতে সাহায্য করেছিল।",
        pa: "ਕਿਵੇਂ ਡਿਜੀਟਲ ਸਿਹਤ ਰਿਕਾਰਡ ਦੀ ਤੁਰੰਤ ਪਹੁੰਚ ਨੇ ਕੋਚੀ ਵਿੱਚ ਇੱਕ ਮੈਡੀਕਲ ਐਮਰਜੈਂਸੀ ਦੌਰਾਨ ਇੱਕ ਫੈਕਟਰੀ ਮਜ਼ਦੂਰ ਦੀ ਜਾਨ ਬਚਾਉਣ ਵਿੱਚ ਮਦਦ ਕੀਤੀ।"
      },
      image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      readTime: "6 min read",
      date: "2025-01-03"
    },
    {
      id: 6,
      category: "news",
      title: {
        en: "New Mobile Health Clinics for Remote Work Sites",
        hi: "दूरदराज के कार्य स्थलों के लिए नए मोबाइल स्वास्थ्य क्लिनिक",
        bn: "দূরবর্তী কর্মক্ষেত্রের জন্য নতুন মোবাইল স্বাস্থ্য ক্লিনিক",
        pa: "ਦੂਰ-ਦੁਰਾਡੇ ਦੇ ਕੰਮ ਦੇ ਸਥਾਨਾਂ ਲਈ ਨਵੇਂ ਮੋਬਾਈਲ ਸਿਹਤ ਕਲੀਨਿਕ"
      },
      description: {
        en: "Kerala introduces mobile health units to reach migrant workers at construction sites and remote locations across the state.",
        hi: "केरल ने राज्य भर में निर्माण स्थलों और दूरदराज के स्थानों पर प्रवासी श्रमिकों तक पहुंचने के लिए मोबाइल स्वास्थ्य इकाइयों की शुरुआत की।",
        bn: "কেরালা রাজ্য জুড়ে নির্মাণ সাইট এবং দূরবর্তী স্থানে অভিবাসী শ্রমিকদের কাছে পৌঁছানোর জন্য মোবাইল স্বাস্থ্য ইউনিট চালু করেছে।",
        pa: "ਕੇਰਲ ਨੇ ਰਾਜ ਭਰ ਵਿੱਚ ਉਸਾਰੀ ਸਾਈਟਾਂ ਅਤੇ ਦੂਰ-ਦੁਰਾਡੇ ਦੇ ਸਥਾਨਾਂ \'ਤੇ ਪ੍ਰਵਾਸੀ ਮਜ਼ਦੂਰਾਂ ਤੱਕ ਪਹੁੰਚਣ ਲਈ ਮੋਬਾਈਲ ਸਿਹਤ ਯੂਨਿਟਾਂ ਦੀ ਸ਼ੁਰੂਆਤ ਕੀਤੀ।"
      },
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      readTime: "4 min read",
      date: "2025-01-01"
    }
  ];

  const currentContent = content?.[currentLanguage] || content?.en;

  const getCategoryColor = (category) => {
    switch (category) {
      case 'health':
        return 'bg-primary/10 text-primary';
      case 'success':
        return 'bg-secondary/10 text-secondary';
      case 'news':
        return 'bg-accent/10 text-accent';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'health':
        return 'Heart';
      case 'success':
        return 'Trophy';
      case 'news':
        return 'Newspaper';
      default:
        return 'FileText';
    }
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {currentContent?.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {currentContent?.subtitle}
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {articles?.map((article) => (
            <article
              key={article?.id}
              className="bg-card rounded-2xl shadow-card hover:shadow-interactive transition-all duration-300 overflow-hidden group"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={article?.image}
                  alt={article?.title?.[currentLanguage] || article?.title?.en}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(article?.category)}`}>
                    <Icon name={getCategoryIcon(article?.category)} size={12} />
                    <span>{currentContent?.categories?.[article?.category]}</span>
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-3">
                  <span>{article?.date}</span>
                  <span>•</span>
                  <span>{article?.readTime}</span>
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {article?.title?.[currentLanguage] || article?.title?.en}
                </h3>

                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {article?.description?.[currentLanguage] || article?.description?.en}
                </p>

                <Button
                  variant="ghost"
                  size="sm"
                  iconName="ArrowRight"
                  iconPosition="right"
                  className="p-0 h-auto font-medium text-primary hover:text-primary/80"
                >
                  {currentContent?.readMore}
                </Button>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link to="/health-trends">
            <Button
              variant="outline"
              size="lg"
              iconName="ExternalLink"
              iconPosition="right"
            >
              {currentContent?.viewAll}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;