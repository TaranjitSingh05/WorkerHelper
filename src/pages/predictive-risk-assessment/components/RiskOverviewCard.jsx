import React from 'react';
import Icon from '../../../components/AppIcon';

const RiskOverviewCard = ({ jobType, currentLanguage }) => {
  const getRiskData = () => {
    const riskData = {
      construction: {
        level: 'high',
        commonRisks: 5,
        preventableCases: '85%',
        icon: 'HardHat',
        color: 'text-error'
      },
      fishery: {
        level: 'high',
        commonRisks: 4,
        preventableCases: '78%',
        icon: 'Fish',
        color: 'text-error'
      },
      factory: {
        level: 'medium',
        commonRisks: 4,
        preventableCases: '82%',
        icon: 'Factory',
        color: 'text-warning'
      },
      agriculture: {
        level: 'medium',
        commonRisks: 3,
        preventableCases: '75%',
        icon: 'Wheat',
        color: 'text-warning'
      },
      domestic: {
        level: 'low',
        commonRisks: 2,
        preventableCases: '90%',
        icon: 'Home',
        color: 'text-success'
      },
      transport: {
        level: 'medium',
        commonRisks: 3,
        preventableCases: '80%',
        icon: 'Truck',
        color: 'text-warning'
      }
    };

    return riskData?.[jobType] || riskData?.construction;
  };

  const getTexts = () => {
    const texts = {
      en: {
        title: 'Risk Overview',
        riskLevel: 'Risk Level',
        commonRisks: 'Common Health Risks',
        preventable: 'Preventable Cases',
        high: 'High',
        medium: 'Medium',
        low: 'Low'
      },
      hi: {
        title: 'जोखिम अवलोकन',
        riskLevel: 'जोखिम स्तर',
        commonRisks: 'सामान्य स्वास्थ्य जोखिम',
        preventable: 'रोकथाम योग्य मामले',
        high: 'उच्च',
        medium: 'मध्यम',
        low: 'कम'
      },
      bn: {
        title: 'ঝুঁকির সংক্ষিপ্ত বিবরণ',
        riskLevel: 'ঝুঁকির মাত্রা',
        commonRisks: 'সাধারণ স্বাস্থ্য ঝুঁকি',
        preventable: 'প্রতিরোধযোগ্য ক্ষেত্রে',
        high: 'উচ্চ',
        medium: 'মাঝারি',
        low: 'কম'
      },
      pa: {
        title: 'ਖਤਰੇ ਦੀ ਸਮੀਖਿਆ',
        riskLevel: 'ਖਤਰੇ ਦਾ ਪੱਧਰ',
        commonRisks: 'ਆਮ ਸਿਹਤ ਖਤਰੇ',
        preventable: 'ਰੋਕਥਾਮ ਯੋਗ ਮਾਮਲੇ',
        high: 'ਉੱਚ',
        medium: 'ਮੱਧਮ',
        low: 'ਘੱਟ'
      }
    };

    return texts?.[currentLanguage] || texts?.en;
  };

  const riskData = getRiskData();
  const texts = getTexts();

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
          <Icon name="BarChart3" size={20} color="white" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">{texts?.title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
            riskData?.level === 'high' ? 'bg-error bg-opacity-10' :
            riskData?.level === 'medium'? 'bg-warning bg-opacity-10' : 'bg-success bg-opacity-10'
          }`}>
            <Icon name={riskData?.icon} size={24} className={riskData?.color} />
          </div>
          <div className="text-sm text-muted-foreground mb-1">{texts?.riskLevel}</div>
          <div className={`text-lg font-semibold ${riskData?.color}`}>
            {texts?.[riskData?.level]}
          </div>
        </div>

        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="w-12 h-12 bg-primary bg-opacity-10 mx-auto mb-3 rounded-full flex items-center justify-center">
            <Icon name="AlertTriangle" size={24} className="text-primary" />
          </div>
          <div className="text-sm text-muted-foreground mb-1">{texts?.commonRisks}</div>
          <div className="text-lg font-semibold text-foreground">{riskData?.commonRisks}</div>
        </div>

        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="w-12 h-12 bg-success bg-opacity-10 mx-auto mb-3 rounded-full flex items-center justify-center">
            <Icon name="Shield" size={24} className="text-success" />
          </div>
          <div className="text-sm text-muted-foreground mb-1">{texts?.preventable}</div>
          <div className="text-lg font-semibold text-success">{riskData?.preventableCases}</div>
        </div>
      </div>
    </div>
  );
};

export default RiskOverviewCard;