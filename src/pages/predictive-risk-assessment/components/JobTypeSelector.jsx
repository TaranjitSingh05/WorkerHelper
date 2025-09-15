import React from 'react';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const JobTypeSelector = ({ selectedJob, onJobChange, currentLanguage }) => {
  const jobOptions = [
    { 
      value: 'construction', 
      label: currentLanguage === 'hi' ? 'निर्माण कार्य' : 
             currentLanguage === 'bn' ? 'নির্মাণ কাজ' : 
             currentLanguage === 'pa' ? 'ਨਿਰਮਾਣ ਕੰਮ' : 'Construction Work',
      description: currentLanguage === 'hi' ? 'भवन निर्माण, सड़क निर्माण' : 
                   currentLanguage === 'bn' ? 'ভবন নির্মাণ, রাস্তা নির্মাণ' : 
                   currentLanguage === 'pa' ? 'ਇਮਾਰਤ ਨਿਰਮਾਣ, ਸੜਕ ਨਿਰਮਾਣ' : 'Building construction, road work'
    },
    { 
      value: 'fishery', 
      label: currentLanguage === 'hi' ? 'मत्स्य पालन' : 
             currentLanguage === 'bn' ? 'মৎস্য চাষ' : 
             currentLanguage === 'pa' ? 'ਮੱਛੀ ਪਾਲਣ' : 'Fishery Work',
      description: currentLanguage === 'hi' ? 'मछली पकड़ना, समुद्री कार्य' : 
                   currentLanguage === 'bn' ? 'মাছ ধরা, সামুদ্রিক কাজ' : 
                   currentLanguage === 'pa' ? 'ਮੱਛੀ ਫੜਨਾ, ਸਮੁੰਦਰੀ ਕੰਮ' : 'Fishing, marine operations'
    },
    { 
      value: 'factory', 
      label: currentLanguage === 'hi' ? 'कारखाना कार्य' : 
             currentLanguage === 'bn' ? 'কারখানার কাজ' : 
             currentLanguage === 'pa' ? 'ਫੈਕਟਰੀ ਕੰਮ' : 'Factory Work',
      description: currentLanguage === 'hi' ? 'विनिर्माण, असेंबली लाइन' : 
                   currentLanguage === 'bn' ? 'উৎপাদন, অ্যাসেম্বলি লাইন' : 
                   currentLanguage === 'pa' ? 'ਨਿਰਮਾਣ, ਅਸੈਂਬਲੀ ਲਾਈਨ' : 'Manufacturing, assembly line'
    },
    { 
      value: 'agriculture', 
      label: currentLanguage === 'hi' ? 'कृषि कार्य' : 
             currentLanguage === 'bn' ? 'কৃষি কাজ' : 
             currentLanguage === 'pa' ? 'ਖੇਤੀ ਕੰਮ' : 'Agriculture Work',
      description: currentLanguage === 'hi' ? 'खेती, फसल की देखभाल' : 
                   currentLanguage === 'bn' ? 'চাষাবাদ, ফসলের যত্ন' : 
                   currentLanguage === 'pa' ? 'ਖੇਤੀ, ਫਸਲ ਦੀ ਦੇਖਭਾਲ' : 'Farming, crop management'
    },
    { 
      value: 'domestic', 
      label: currentLanguage === 'hi' ? 'घरेलू कार्य' : 
             currentLanguage === 'bn' ? 'গৃহস্থালির কাজ' : 
             currentLanguage === 'pa' ? 'ਘਰੇਲੂ ਕੰਮ' : 'Domestic Work',
      description: currentLanguage === 'hi' ? 'सफाई, खाना बनाना' : 
                   currentLanguage === 'bn' ? 'পরিষ্কার, রান্না' : 
                   currentLanguage === 'pa' ? 'ਸਫਾਈ, ਖਾਣਾ ਬਣਾਉਣਾ' : 'Cleaning, cooking'
    },
    { 
      value: 'transport', 
      label: currentLanguage === 'hi' ? 'परिवहन कार्य' : 
             currentLanguage === 'bn' ? 'পরিবহন কাজ' : 
             currentLanguage === 'pa' ? 'ਆਵਾਜਾਈ ਕੰਮ' : 'Transport Work',
      description: currentLanguage === 'hi' ? 'ड्राइविंग, लोडिंग' : 
                   currentLanguage === 'bn' ? 'ড্রাইভিং, লোডিং' : 
                   currentLanguage === 'pa' ? 'ਡਰਾਈਵਿੰਗ, ਲੋਡਿੰਗ' : 'Driving, loading'
    }
  ];

  const getTitle = () => {
    switch (currentLanguage) {
      case 'hi': return 'अपना व्यवसाय चुनें';
      case 'bn': return 'আপনার পেশা নির্বাচন করুন';
      case 'pa': return 'ਆਪਣਾ ਕਿੱਤਾ ਚੁਣੋ';
      default: return 'Select Your Occupation';
    }
  };

  const getDescription = () => {
    switch (currentLanguage) {
      case 'hi': return 'अपने काम के प्रकार के आधार पर स्वास्थ्य जोखिमों को समझें';
      case 'bn': return 'আপনার কাজের ধরন অনুযায়ী স্বাস্থ্য ঝুঁকি বুঝুন';
      case 'pa': return 'ਆਪਣੇ ਕੰਮ ਦੀ ਕਿਸਮ ਅਨੁਸਾਰ ਸਿਹਤ ਖਤਰੇ ਸਮਝੋ';
      default: return 'Understand health risks based on your type of work';
    }
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-card">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <Icon name="Briefcase" size={20} color="white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">{getTitle()}</h2>
          <p className="text-sm text-muted-foreground">{getDescription()}</p>
        </div>
      </div>

      <Select
        options={jobOptions}
        value={selectedJob}
        onChange={onJobChange}
        placeholder={
          currentLanguage === 'hi' ? 'व्यवसाय चुनें...' :
          currentLanguage === 'bn' ? 'পেশা নির্বাচন করুন...' :
          currentLanguage === 'pa'? 'ਕਿੱਤਾ ਚੁਣੋ...' : 'Choose occupation...'
        }
        searchable
        className="mt-2"
      />
    </div>
  );
};

export default JobTypeSelector;