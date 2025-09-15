import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const Footer = ({ currentLanguage }) => {
  const content = {
    en: {
      tagline: "Empowering migrant workers with digital health solutions",
      quickLinks: "Quick Links",
      healthServices: "Health Services",
      support: "Support & Help",
      contact: "Contact Information",
      emergency: "Emergency Helpline",
      email: "Email Support",
      address: "Kerala Health Department\nThiruvananthapuram, Kerala 695001",
      copyright: "All rights reserved. WorkerHelper - Kerala Health Initiative",
      links: {
        home: "Home",
        about: "About Us",
        healthTrends: "Health Trends",
        riskAssessment: "Risk Assessment",
        healthCenters: "Health Centers",
        personalRecord: "Personal Record"
      },
      services: {
        digitalRecords: "Digital Health Records",
        qrAccess: "QR Code Access",
        multiLanguage: "Multilingual Support",
        emergencyAccess: "Emergency Access"
      },
      supportLinks: {
        help: "Help Center",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
        feedback: "Feedback"
      }
    },
    hi: {
      tagline: "डिजिटल स्वास्थ्य समाधानों के साथ प्रवासी श्रमिकों को सशक्त बनाना",
      quickLinks: "त्वरित लिंक",
      healthServices: "स्वास्थ्य सेवाएं",
      support: "सहायता और मदद",
      contact: "संपर्क जानकारी",
      emergency: "आपातकालीन हेल्पलाइन",
      email: "ईमेल सहायता",
      address: "केरल स्वास्थ्य विभाग\nतिरुवनंतपुरम, केरल 695001",
      copyright: "सभी अधिकार सुरक्षित। WorkerHelper - केरल स्वास्थ्य पहल",
      links: {
        home: "होम",
        about: "हमारे बारे में",
        healthTrends: "स्वास्थ्य रुझान",
        riskAssessment: "जोखिम मूल्यांकन",
        healthCenters: "स्वास्थ्य केंद्र",
        personalRecord: "व्यक्तिगत रिकॉर्ड"
      },
      services: {
        digitalRecords: "डिजिटल स्वास्थ्य रिकॉर्ड",
        qrAccess: "QR कोड एक्सेस",
        multiLanguage: "बहुभाषी सहायता",
        emergencyAccess: "आपातकालीन पहुंच"
      },
      supportLinks: {
        help: "सहायता केंद्र",
        privacy: "गोपनीयता नीति",
        terms: "सेवा की शर्तें",
        feedback: "फीडबैक"
      }
    },
    bn: {
      tagline: "ডিজিটাল স্বাস্থ্য সমাধানের মাধ্যমে অভিবাসী শ্রমিকদের ক্ষমতায়ন",
      quickLinks: "দ্রুত লিঙ্ক",
      healthServices: "স্বাস্থ্য সেবা",
      support: "সহায়তা ও সাহায্য",
      contact: "যোগাযোগের তথ্য",
      emergency: "জরুরি হেল্পলাইন",
      email: "ইমেইল সহায়তা",
      address: "কেরালা স্বাস্থ্য বিভাগ\nতিরুবনন্তপুরম, কেরালা ৬৯৫০০১",
      copyright: "সকল অধিকার সংরক্ষিত। WorkerHelper - কেরালা স্বাস্থ্য উদ্যোগ",
      links: {
        home: "হোম",
        about: "আমাদের সম্পর্কে",
        healthTrends: "স্বাস্থ্য প্রবণতা",
        riskAssessment: "ঝুঁকি মূল্যায়ন",
        healthCenters: "স্বাস্থ্য কেন্দ্র",
        personalRecord: "ব্যক্তিগত রেকর্ড"
      },
      services: {
        digitalRecords: "ডিজিটাল স্বাস্থ্য রেকর্ড",
        qrAccess: "QR কোড অ্যাক্সেস",
        multiLanguage: "বহুভাষিক সহায়তা",
        emergencyAccess: "জরুরি অ্যাক্সেস"
      },
      supportLinks: {
        help: "সহায়তা কেন্দ্র",
        privacy: "গোপনীয়তা নীতি",
        terms: "সেবার শর্তাবলী",
        feedback: "মতামত"
      }
    },
    pa: {
      tagline: "ਡਿਜੀਟਲ ਸਿਹਤ ਹੱਲਾਂ ਨਾਲ ਪ੍ਰਵਾਸੀ ਮਜ਼ਦੂਰਾਂ ਨੂੰ ਸਸ਼ਕਤ ਬਣਾਉਣਾ",
      quickLinks: "ਤੁਰੰਤ ਲਿੰਕ",
      healthServices: "ਸਿਹਤ ਸੇਵਾਵਾਂ",
      support: "ਸਹਾਇਤਾ ਅਤੇ ਮਦਦ",
      contact: "ਸੰਪਰਕ ਜਾਣਕਾਰੀ",
      emergency: "ਐਮਰਜੈਂਸੀ ਹੈਲਪਲਾਈਨ",
      email: "ਈਮੇਲ ਸਹਾਇਤਾ",
      address: "ਕੇਰਲ ਸਿਹਤ ਵਿਭਾਗ\nਤਿਰੁਵਨੰਤਪੁਰਮ, ਕੇਰਲ 695001",
      copyright: "ਸਾਰੇ ਅਧਿਕਾਰ ਸੁਰੱਖਿਅਤ। WorkerHelper - ਕੇਰਲ ਸਿਹਤ ਪਹਿਲ",
      links: {
        home: "ਘਰ",
        about: "ਸਾਡੇ ਬਾਰੇ",
        healthTrends: "ਸਿਹਤ ਰੁਝਾਨ",
        riskAssessment: "ਜੋਖਮ ਮੁਲਾਂਕਣ",
        healthCenters: "ਸਿਹਤ ਕੇਂਦਰ",
        personalRecord: "ਨਿੱਜੀ ਰਿਕਾਰਡ"
      },
      services: {
        digitalRecords: "ਡਿਜੀਟਲ ਸਿਹਤ ਰਿਕਾਰਡ",
        qrAccess: "QR ਕੋਡ ਪਹੁੰਚ",
        multiLanguage: "ਬਹੁ-ਭਾਸ਼ਾਈ ਸਹਾਇਤਾ",
        emergencyAccess: "ਐਮਰਜੈਂਸੀ ਪਹੁੰਚ"
      },
      supportLinks: {
        help: "ਸਹਾਇਤਾ ਕੇਂਦਰ",
        privacy: "ਗੁਪਤਤਾ ਨੀਤੀ",
        terms: "ਸੇਵਾ ਦੀਆਂ ਸ਼ਰਤਾਂ",
        feedback: "ਫੀਡਬੈਕ"
      }
    }
  };

  const currentContent = content?.[currentLanguage] || content?.en;
  const currentYear = new Date()?.getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Heart" size={24} color="white" />
              </div>
              <span className="text-xl font-bold text-foreground">WorkerHelper</span>
            </div>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              {currentContent?.tagline}
            </p>
            
            {/* Emergency Contact */}
            <div className="bg-error/10 border border-error/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Phone" size={16} className="text-error" />
                <span className="text-sm font-medium text-error">
                  {currentContent?.emergency}
                </span>
              </div>
              <a 
                href="tel:108" 
                className="text-lg font-bold text-error hover:text-error/80 transition-colors"
              >
                108
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {currentContent?.quickLinks}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/homepage" 
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  {currentContent?.links?.home}
                </Link>
              </li>
              <li>
                <Link 
                  to="/about-us" 
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  {currentContent?.links?.about}
                </Link>
              </li>
              <li>
                <Link 
                  to="/health-trends" 
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  {currentContent?.links?.healthTrends}
                </Link>
              </li>
              <li>
                <Link 
                  to="/predictive-risk-assessment" 
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  {currentContent?.links?.riskAssessment}
                </Link>
              </li>
              <li>
                <Link 
                  to="/health-centers-locator" 
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  {currentContent?.links?.healthCenters}
                </Link>
              </li>
              <li>
                <Link 
                  to="/personal-health-record" 
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  {currentContent?.links?.personalRecord}
                </Link>
              </li>
            </ul>
          </div>

          {/* Health Services */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {currentContent?.healthServices}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Icon name="FileText" size={14} className="text-primary" />
                <span className="text-muted-foreground text-sm">
                  {currentContent?.services?.digitalRecords}
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Icon name="QrCode" size={14} className="text-primary" />
                <span className="text-muted-foreground text-sm">
                  {currentContent?.services?.qrAccess}
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Icon name="Globe" size={14} className="text-primary" />
                <span className="text-muted-foreground text-sm">
                  {currentContent?.services?.multiLanguage}
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Icon name="Zap" size={14} className="text-primary" />
                <span className="text-muted-foreground text-sm">
                  {currentContent?.services?.emergencyAccess}
                </span>
              </li>
            </ul>

            {/* Support Links */}
            <h4 className="text-md font-medium text-foreground mt-6 mb-3">
              {currentContent?.support}
            </h4>
            <ul className="space-y-2">
              <li>
                <button className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  {currentContent?.supportLinks?.help}
                </button>
              </li>
              <li>
                <button className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  {currentContent?.supportLinks?.privacy}
                </button>
              </li>
              <li>
                <button className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  {currentContent?.supportLinks?.terms}
                </button>
              </li>
              <li>
                <button className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  {currentContent?.supportLinks?.feedback}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {currentContent?.contact}
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <Icon name="Mail" size={14} className="text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    {currentContent?.email}
                  </span>
                </div>
                <a 
                  href="mailto:support@workerhelper.kerala.gov.in"
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  support@workerhelper.kerala.gov.in
                </a>
              </div>

              <div>
                <div className="flex items-start space-x-2 mb-1">
                  <Icon name="MapPin" size={14} className="text-muted-foreground mt-0.5" />
                  <span className="text-sm font-medium text-foreground">
                    {currentContent?.address?.split('\n')?.[0]}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  {currentContent?.address?.split('\n')?.[1]}
                </p>
              </div>

              {/* Social Links */}
              <div className="pt-4">
                <div className="flex space-x-3">
                  <button className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Icon name="Facebook" size={16} />
                  </button>
                  <button className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Icon name="Twitter" size={16} />
                  </button>
                  <button className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Icon name="Instagram" size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} {currentContent?.copyright}
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-muted-foreground">Powered by</span>
              <div className="flex items-center space-x-1">
                <Icon name="Heart" size={12} className="text-error" />
                <span className="text-xs font-medium text-foreground">Kerala Government</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;