import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CallToActionSection = ({ currentLanguage }) => {
  const content = {
    en: {
      title: "Ready to Take Control of Your Health?",
      subtitle: "Join thousands of migrant workers who have already digitized their health records and gained access to better healthcare in Kerala.",
      primaryCta: "Create Health Record",
      secondaryCta: "Learn About Us",
      features: [
        {
          title: "Instant Access",
          description: "Get your health records anywhere, anytime with QR code technology"
        },
        {
          title: "Multilingual Support",
          description: "Available in English, Hindi, Bengali, and Punjabi languages"
        },
        {
          title: "Find Health Centers",
          description: "Locate nearby hospitals and clinics with our interactive map"
        }
      ],
      stats: {
        workers: "50,000+",
        workersLabel: "Registered Workers",
        centers: "200+",
        centersLabel: "Partner Health Centers",
        languages: "4",
        languagesLabel: "Supported Languages"
      }
    },
    hi: {
      title: "अपने स्वास्थ्य पर नियंत्रण रखने के लिए तैयार हैं?",
      subtitle: "हजारों प्रवासी श्रमिकों के साथ जुड़ें जिन्होंने पहले से ही अपने स्वास्थ्य रिकॉर्ड को डिजिटल बनाया है और केरल में बेहतर स्वास्थ्य सेवा तक पहुंच प्राप्त की है।",
      primaryCta: "स्वास्थ्य रिकॉर्ड बनाएं",
      secondaryCta: "हमारे बारे में जानें",
      features: [
        {
          title: "तत्काल पहुंच",
          description: "QR कोड तकनीक के साथ कहीं भी, कभी भी अपने स्वास्थ्य रिकॉर्ड प्राप्त करें"
        },
        {
          title: "बहुभाषी सहायता",
          description: "अंग्रेजी, हिंदी, बंगाली और पंजाबी भाषाओं में उपलब्ध"
        },
        {
          title: "स्वास्थ्य केंद्र खोजें",
          description: "हमारे इंटरैक्टिव मैप के साथ नजदीकी अस्पताल और क्लिनिक खोजें"
        }
      ],
      stats: {
        workers: "50,000+",
        workersLabel: "पंजीकृत श्रमिक",
        centers: "200+",
        centersLabel: "साझेदार स्वास्थ्य केंद्र",
        languages: "4",
        languagesLabel: "समर्थित भाषाएं"
      }
    },
    bn: {
      title: "আপনার স্বাস্থ্যের নিয়ন্ত্রণ নিতে প্রস্তুত?",
      subtitle: "হাজার হাজার অভিবাসী শ্রমিকদের সাথে যোগ দিন যারা ইতিমধ্যে তাদের স্বাস্থ্য রেকর্ড ডিজিটাইজ করেছেন এবং কেরালায় উন্নত স্বাস্থ্যসেবার অ্যাক্সেস পেয়েছেন।",
      primaryCta: "স্বাস্থ্য রেকর্ড তৈরি করুন",
      secondaryCta: "আমাদের সম্পর্কে জানুন",
      features: [
        {
          title: "তাৎক্ষণিক অ্যাক্সেস",
          description: "QR কোড প্রযুক্তির সাথে যেকোনো জায়গায়, যেকোনো সময় আপনার স্বাস্থ্য রেকর্ড পান"
        },
        {
          title: "বহুভাষিক সহায়তা",
          description: "ইংরেজি, হিন্দি, বাংলা এবং পাঞ্জাবি ভাষায় উপলব্ধ"
        },
        {
          title: "স্বাস্থ্য কেন্দ্র খুঁজুন",
          description: "আমাদের ইন্টারঅ্যাক্টিভ ম্যাপের সাথে নিকটবর্তী হাসপাতাল এবং ক্লিনিক খুঁজে পান"
        }
      ],
      stats: {
        workers: "50,000+",
        workersLabel: "নিবন্ধিত শ্রমিক",
        centers: "200+",
        centersLabel: "অংশীদার স্বাস্থ্য কেন্দ্র",
        languages: "4",
        languagesLabel: "সমর্থিত ভাষা"
      }
    },
    pa: {
      title: "ਆਪਣੀ ਸਿਹਤ ਦਾ ਕੰਟਰੋਲ ਲੈਣ ਲਈ ਤਿਆਰ ਹੋ?",
      subtitle: "ਹਜ਼ਾਰਾਂ ਪ੍ਰਵਾਸੀ ਮਜ਼ਦੂਰਾਂ ਨਾਲ ਜੁੜੋ ਜਿਨ੍ਹਾਂ ਨੇ ਪਹਿਲਾਂ ਹੀ ਆਪਣੇ ਸਿਹਤ ਰਿਕਾਰਡ ਨੂੰ ਡਿਜੀਟਲ ਬਣਾਇਆ ਹੈ ਅਤੇ ਕੇਰਲ ਵਿੱਚ ਬਿਹਤਰ ਸਿਹਤ ਸੇਵਾ ਤੱਕ ਪਹੁੰਚ ਪ੍ਰਾਪਤ ਕੀਤੀ ਹੈ।",
      primaryCta: "ਸਿਹਤ ਰਿਕਾਰਡ ਬਣਾਓ",
      secondaryCta: "ਸਾਡੇ ਬਾਰੇ ਜਾਣੋ",
      features: [
        {
          title: "ਤੁਰੰਤ ਪਹੁੰਚ",
          description: "QR ਕੋਡ ਤਕਨਾਲੋਜੀ ਨਾਲ ਕਿਤੇ ਵੀ, ਕਦੇ ਵੀ ਆਪਣੇ ਸਿਹਤ ਰਿਕਾਰਡ ਪ੍ਰਾਪਤ ਕਰੋ"
        },
        {
          title: "ਬਹੁ-ਭਾਸ਼ਾਈ ਸਹਾਇਤਾ",
          description: "ਅੰਗਰੇਜ਼ੀ, ਹਿੰਦੀ, ਬੰਗਾਲੀ ਅਤੇ ਪੰਜਾਬੀ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਉਪਲਬਧ"
        },
        {
          title: "ਸਿਹਤ ਕੇਂਦਰ ਲੱਭੋ",
          description: "ਸਾਡੇ ਇੰਟਰਐਕਟਿਵ ਮੈਪ ਨਾਲ ਨੇੜਲੇ ਹਸਪਤਾਲ ਅਤੇ ਕਲੀਨਿਕ ਲੱਭੋ"
        }
      ],
      stats: {
        workers: "50,000+",
        workersLabel: "ਰਜਿਸਟਰਡ ਮਜ਼ਦੂਰ",
        centers: "200+",
        centersLabel: "ਸਾਂਝੀਦਾਰ ਸਿਹਤ ਕੇਂਦਰ",
        languages: "4",
        languagesLabel: "ਸਮਰਥਿਤ ਭਾਸ਼ਾਵਾਂ"
      }
    }
  };

  const currentContent = content?.[currentLanguage] || content?.en;

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-secondary rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-accent rounded-full blur-2xl"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {currentContent?.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto mb-8">
            {currentContent?.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/personal-health-record">
              <Button
                variant="default"
                size="lg"
                iconName="Plus"
                iconPosition="left"
                className="w-full sm:w-auto"
              >
                {currentContent?.primaryCta}
              </Button>
            </Link>
            <Link to="/about-us">
              <Button
                variant="outline"
                size="lg"
                iconName="Info"
                iconPosition="left"
                className="w-full sm:w-auto"
              >
                {currentContent?.secondaryCta}
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {currentContent?.features?.map((feature, index) => (
            <div
              key={index}
              className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-card hover:shadow-interactive transition-all duration-300 text-center"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon 
                  name={index === 0 ? 'Zap' : index === 1 ? 'Globe' : 'MapPin'} 
                  size={24} 
                  className="text-primary" 
                />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature?.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature?.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-card/60 backdrop-blur-sm rounded-3xl p-8 shadow-card">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                {currentContent?.stats?.workers}
              </div>
              <div className="text-sm text-muted-foreground">
                {currentContent?.stats?.workersLabel}
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-secondary mb-2">
                {currentContent?.stats?.centers}
              </div>
              <div className="text-sm text-muted-foreground">
                {currentContent?.stats?.centersLabel}
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-accent mb-2">
                {currentContent?.stats?.languages}
              </div>
              <div className="text-sm text-muted-foreground">
                {currentContent?.stats?.languagesLabel}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;