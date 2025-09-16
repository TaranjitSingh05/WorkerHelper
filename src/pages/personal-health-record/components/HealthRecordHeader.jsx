import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const HealthRecordHeader = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Load language preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('JeevanID-language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const content = {
    en: {
      title: "Personal Health Record",
      subtitle: "Create your comprehensive digital health profile",
      description: "Secure your health information with a unique Worker Health ID and QR code for easy healthcare access across Kerala.",
      features: [
        "Unique Worker Health ID generation",
        "QR code for quick healthcare access",
        "Secure digital health profile",
        "Multilingual support"
      ]
    },
    hi: {
      title: "व्यक्तिगत स्वास्थ्य रिकॉर्ड",
      subtitle: "अपना व्यापक डिजिटल स्वास्थ्य प्रोफाइल बनाएं",
      description: "केरल में आसान स्वास्थ्य सेवा पहुंच के लिए अपनी स्वास्थ्य जानकारी को अनूठी वर्कर हेल्थ आईडी और QR कोड के साथ सुरक्षित करें।",
      features: [
        "अनूठी वर्कर हेल्थ आईडी जेनरेशन",
        "त्वरित स्वास्थ्य सेवा पहुंच के लिए QR कोड",
        "सुरक्षित डिजिटल स्वास्थ्य प्रोफाइल",
        "बहुभाषी समर्थन"
      ]
    },
    bn: {
      title: "ব্যক্তিগত স্বাস্থ্য রেকর্ড",
      subtitle: "আপনার ব্যাপক ডিজিটাল স্বাস্থ্য প্রোফাইল তৈরি করুন",
      description: "কেরালা জুড়ে সহজ স্বাস্থ্যসেবা অ্যাক্সেসের জন্য একটি অনন্য ওয়ার্কার হেলথ আইডি এবং QR কোড দিয়ে আপনার স্বাস্থ্য তথ্য সুরক্ষিত করুন।",
      features: [
        "অনন্য ওয়ার্কার হেলথ আইডি জেনারেশন",
        "দ্রুত স্বাস্থ্যসেবা অ্যাক্সেসের জন্য QR কোড",
        "নিরাপদ ডিজিটাল স্বাস্থ্য প্রোফাইল",
        "বহুভাষিক সহায়তা"
      ]
    },
    pa: {
      title: "ਨਿੱਜੀ ਸਿਹਤ ਰਿਕਾਰਡ",
      subtitle: "ਆਪਣਾ ਵਿਆਪਕ ਡਿਜੀਟਲ ਸਿਹਤ ਪ੍ਰੋਫਾਈਲ ਬਣਾਓ",
      description: "ਕੇਰਲ ਵਿੱਚ ਆਸਾਨ ਸਿਹਤ ਸੇਵਾ ਪਹੁੰਚ ਲਈ ਇੱਕ ਵਿਲੱਖਣ ਵਰਕਰ ਹੈਲਥ ਆਈਡੀ ਅਤੇ QR ਕੋਡ ਨਾਲ ਆਪਣੀ ਸਿਹਤ ਜਾਣਕਾਰੀ ਨੂੰ ਸੁਰੱਖਿਅਤ ਕਰੋ।",
      features: [
        "ਵਿਲੱਖਣ ਵਰਕਰ ਹੈਲਥ ਆਈਡੀ ਜਨਰੇਸ਼ਨ",
        "ਤੇਜ਼ ਸਿਹਤ ਸੇਵਾ ਪਹੁੰਚ ਲਈ QR ਕੋਡ",
        "ਸੁਰੱਖਿਅਤ ਡਿਜੀਟਲ ਸਿਹਤ ਪ੍ਰੋਫਾਈਲ",
        "ਬਹੁਭਾਸ਼ੀ ਸਹਾਇਤਾ"
      ]
    }
  };

  const currentContent = content?.[currentLanguage] || content?.en;

  return (
    <div className="text-center mb-8 lg:mb-12">
      {/* Main Title */}
      <div className="mb-6">
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
          {currentContent?.title}
        </h1>
        <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
          {currentContent?.subtitle}
        </p>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          {currentContent?.description}
        </p>
      </div>
      {/* Feature Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {currentContent?.features?.map((feature, index) => {
          const icons = ['IdCard', 'QrCode', 'Shield', 'Globe'];
          return (
            <div key={index} className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={icons?.[index]} size={16} color="white" />
              </div>
              <span className="text-sm font-medium text-foreground text-left">
                {feature}
              </span>
            </div>
          );
        })}
      </div>
      {/* Security Notice */}
      <div className="mt-8 p-4 bg-success/10 border border-success/20 rounded-lg max-w-2xl mx-auto">
        <div className="flex items-center justify-center space-x-2 text-success">
          <Icon name="Lock" size={16} />
          <span className="text-sm font-medium">
            Your health information is encrypted and securely stored
          </span>
        </div>
      </div>
    </div>
  );
};

export default HealthRecordHeader;