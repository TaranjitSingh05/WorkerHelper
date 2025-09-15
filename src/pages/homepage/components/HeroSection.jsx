import React from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const HeroSection = ({ currentLanguage }) => {
  const content = {
    en: {
      title: "Your Health, Your Record, Your Right",
      subtitle: "Empowering Kerala's migrant workers with comprehensive digital health records, multilingual support, and instant access to nearby healthcare facilities.",
      primaryCta: "Get Started",
      secondaryCta: "Learn More",
      features: [
        "Digital Health Records",
        "Multilingual Support", 
        "Nearby Health Centers"
      ]
    },
    hi: {
      title: "आपका स्वास्थ्य, आपका रिकॉर्ड, आपका अधिकार",
      subtitle: "केरल के प्रवासी श्रमिकों को व्यापक डिजिटल स्वास्थ्य रिकॉर्ड, बहुभाषी सहायता और नजदीकी स्वास्थ्य सुविधाओं तक तत्काल पहुंच प्रदान करना।",
      primaryCta: "शुरू करें",
      secondaryCta: "और जानें",
      features: [
        "डिजिटल स्वास्थ्य रिकॉर्ड",
        "बहुभाषी सहायता",
        "नजदीकी स्वास्थ्य केंद्र"
      ]
    },
    bn: {
      title: "আপনার স্বাস্থ্য, আপনার রেকর্ড, আপনার অধিকার",
      subtitle: "কেরালার অভিবাসী শ্রমিকদের ব্যাপক ডিজিটাল স্বাস্থ্য রেকর্ড, বহুভাষিক সহায়তা এবং নিকটবর্তী স্বাস্থ্যসেবা সুবিধার তাৎক্ষণিক অ্যাক্সেস প্রদান।",
      primaryCta: "শুরু করুন",
      secondaryCta: "আরও জানুন",
      features: [
        "ডিজিটাল স্বাস্থ্য রেকর্ড",
        "বহুভাষিক সহায়তা",
        "নিকটবর্তী স্বাস্থ্য কেন্দ্র"
      ]
    },
    pa: {
      title: "ਤੁਹਾਡੀ ਸਿਹਤ, ਤੁਹਾਡਾ ਰਿਕਾਰਡ, ਤੁਹਾਡਾ ਅਧਿਕਾਰ",
      subtitle: "ਕੇਰਲ ਦੇ ਪ੍ਰਵਾਸੀ ਮਜ਼ਦੂਰਾਂ ਨੂੰ ਵਿਆਪਕ ਡਿਜੀਟਲ ਸਿਹਤ ਰਿਕਾਰਡ, ਬਹੁ-ਭਾਸ਼ਾਈ ਸਹਾਇਤਾ ਅਤੇ ਨੇੜਲੀਆਂ ਸਿਹਤ ਸੁਵਿਧਾਵਾਂ ਤੱਕ ਤੁਰੰਤ ਪਹੁੰਚ ਪ੍ਰਦਾਨ ਕਰਨਾ।",
      primaryCta: "ਸ਼ੁਰੂ ਕਰੋ",
      secondaryCta: "ਹੋਰ ਜਾਣੋ",
      features: [
        "ਡਿਜੀਟਲ ਸਿਹਤ ਰਿਕਾਰਡ",
        "ਬਹੁ-ਭਾਸ਼ਾਈ ਸਹਾਇਤਾ",
        "ਨੇੜਲੇ ਸਿਹਤ ਕੇਂਦਰ"
      ]
    }
  };

  const currentContent = content?.[currentLanguage] || content?.en;

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-accent rounded-full blur-3xl"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-5rem)]">
          {/* Content Section */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                {currentContent?.title}
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                {currentContent?.subtitle}
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3">
              {currentContent?.features?.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-border rounded-full px-4 py-2 shadow-sm"
                >
                  <Icon name="Check" size={16} className="text-primary" />
                  <span className="text-sm font-medium text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/personal-health-record">
                <Button
                  variant="default"
                  size="lg"
                  iconName="ArrowRight"
                  iconPosition="right"
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

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Workers Registered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">200+</div>
                <div className="text-sm text-muted-foreground">Health Centers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">4</div>
                <div className="text-sm text-muted-foreground">Languages</div>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white">
              <Image
                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Healthcare workers helping migrant workers"
                className="w-full h-[500px] lg:h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              
              {/* Floating Card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="Heart" size={24} color="white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Digital Health ID</h3>
                    <p className="text-sm text-muted-foreground">Instant access to your complete health record</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/10 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;