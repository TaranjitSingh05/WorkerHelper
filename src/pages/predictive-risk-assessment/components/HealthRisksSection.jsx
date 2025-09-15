import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HealthRisksSection = ({ jobType, currentLanguage }) => {
  const [expandedRisk, setExpandedRisk] = useState(null);

  const getHealthRisks = () => {
    const risks = {
      construction: [
        {
          id: 1,
          name: currentLanguage === 'hi' ? 'श्वसन संबंधी समस्याएं' :
                currentLanguage === 'bn' ? 'শ্বাসযন্ত্রের সমস্যা' :
                currentLanguage === 'pa'? 'ਸਾਹ ਦੀਆਂ ਸਮੱਸਿਆਵਾਂ' : 'Respiratory Problems',
          icon: 'Lungs',
          severity: 'high',
          description: currentLanguage === 'hi' ? `धूल, सीमेंट और रसायनों के संपर्क से फेफड़ों में समस्या हो सकती है।\nलंबे समय तक इनके संपर्क में रहने से अस्थमा और सिलिकोसिस हो सकता है।` :
                       currentLanguage === 'bn' ? `ধুলো, সিমেন্ট এবং রাসায়নিকের সংস্পর্শে ফুসফুসের সমস্যা হতে পারে।\nদীর্ঘ সময় এগুলোর সংস্পর্শে থাকলে হাঁপানি এবং সিলিকোসিস হতে পারে।` :
                       currentLanguage === 'pa' ? `ਧੂੜ, ਸੀਮੈਂਟ ਅਤੇ ਰਸਾਇਣਾਂ ਦੇ ਸੰਪਰਕ ਨਾਲ ਫੇਫੜਿਆਂ ਵਿੱਚ ਸਮੱਸਿਆ ਹੋ ਸਕਦੀ ਹੈ।\nਲੰਬੇ ਸਮੇਂ ਤੱਕ ਇਨ੍ਹਾਂ ਦੇ ਸੰਪਰਕ ਵਿੱਚ ਰਹਿਣ ਨਾਲ ਦਮਾ ਅਤੇ ਸਿਲਿਕੋਸਿਸ ਹੋ ਸਕਦਾ ਹੈ।` :
                       `Exposure to dust, cement and chemicals can cause lung problems.\nProlonged exposure can lead to asthma and silicosis.`,
          symptoms: currentLanguage === 'hi' ? ['सांस लेने में कठिनाई', 'खांसी', 'छाती में दर्द'] :
                    currentLanguage === 'bn' ? ['শ্বাস নিতে কষ্ট', 'কাশি', 'বুকে ব্যথা'] :
                    currentLanguage === 'pa' ? ['ਸਾਹ ਲੈਣ ਵਿੱਚ ਮੁਸ਼ਕਿਲ', 'ਖੰਘ', 'ਛਾਤੀ ਵਿੱਚ ਦਰਦ'] :
                    ['Difficulty breathing', 'Cough', 'Chest pain']
        },
        {
          id: 2,
          name: currentLanguage === 'hi' ? 'चोट और दुर्घटनाएं' :
                currentLanguage === 'bn' ? 'আঘাত এবং দুর্ঘটনা' :
                currentLanguage === 'pa'? 'ਸੱਟ ਅਤੇ ਦੁਰਘਟਨਾਵਾਂ' : 'Injuries and Accidents',
          icon: 'Bandage',
          severity: 'high',
          description: currentLanguage === 'hi' ? `ऊंचाई से गिरना, मशीनों से चोट और भारी सामान उठाने से चोट लग सकती है।\nसुरक्षा उपकरणों का उपयोग न करने से गंभीर दुर्घटनाएं हो सकती हैं।` :
                       currentLanguage === 'bn' ? `উচ্চতা থেকে পড়া, যন্ত্রপাতি থেকে আঘাত এবং ভারী জিনিস তোলার কারণে আঘাত লাগতে পারে।\nসুরক্ষা সরঞ্জাম ব্যবহার না করলে গুরুতর দুর্ঘটনা হতে পারে।` :
                       currentLanguage === 'pa' ? `ਉਚਾਈ ਤੋਂ ਡਿੱਗਣਾ, ਮਸ਼ੀਨਾਂ ਤੋਂ ਸੱਟ ਅਤੇ ਭਾਰੀ ਸਾਮਾਨ ਚੁੱਕਣ ਨਾਲ ਸੱਟ ਲੱਗ ਸਕਦੀ ਹੈ।\nਸੁਰੱਖਿਆ ਸਾਜ਼ੋ-ਸਾਮਾਨ ਦੀ ਵਰਤੋਂ ਨਾ ਕਰਨ ਨਾਲ ਗੰਭੀਰ ਦੁਰਘਟਨਾਵਾਂ ਹੋ ਸਕਦੀਆਂ ਹਨ।` :
                       `Falls from height, machinery injuries and lifting heavy materials can cause injuries.\nNot using safety equipment can lead to serious accidents.`,
          symptoms: currentLanguage === 'hi' ? ['फ्रैक्चर', 'कटना', 'मांसपेशियों में खिंचाव'] :
                    currentLanguage === 'bn' ? ['হাড় ভাঙা', 'কাটা', 'পেশীতে টান'] :
                    currentLanguage === 'pa' ? ['ਹੱਡੀ ਟੁੱਟਣਾ', 'ਕੱਟਣਾ', 'ਮਾਸਪੇਸ਼ੀਆਂ ਵਿੱਚ ਖਿੱਚ'] :
                    ['Fractures', 'Cuts', 'Muscle strain']
        }
      ],
      fishery: [
        {
          id: 1,
          name: currentLanguage === 'hi' ? 'त्वचा संबंधी समस्याएं' :
                currentLanguage === 'bn' ? 'চর্মের সমস্যা' :
                currentLanguage === 'pa'? 'ਚਮੜੀ ਦੀਆਂ ਸਮੱਸਿਆਵਾਂ' : 'Skin Problems',
          icon: 'Droplets',
          severity: 'medium',
          description: currentLanguage === 'hi' ? `नमक के पानी और रसायनों के संपर्क से त्वचा में जलन हो सकती है।\nलंबे समय तक पानी में रहने से फंगल इन्फेक्शन हो सकता है।` :
                       currentLanguage === 'bn' ? `লবণাক্ত পানি এবং রাসায়নিকের সংস্পর্শে চর্মে জ্বালাপোড়া হতে পারে।\nদীর্ঘ সময় পানিতে থাকলে ফাঙ্গাল ইনফেকশন হতে পারে।` :
                       currentLanguage === 'pa' ? `ਨਮਕੀਨ ਪਾਣੀ ਅਤੇ ਰਸਾਇਣਾਂ ਦੇ ਸੰਪਰਕ ਨਾਲ ਚਮੜੀ ਵਿੱਚ ਜਲਣ ਹੋ ਸਕਦੀ ਹੈ।\nਲੰਬੇ ਸਮੇਂ ਤੱਕ ਪਾਣੀ ਵਿੱਚ ਰਹਿਣ ਨਾਲ ਫੰਗਲ ਇਨਫੈਕਸ਼ਨ ਹੋ ਸਕਦਾ ਹੈ।` :
                       `Contact with salt water and chemicals can cause skin irritation.\nProlonged water exposure can lead to fungal infections.`,
          symptoms: currentLanguage === 'hi' ? ['खुजली', 'लालिमा', 'छाले'] :
                    currentLanguage === 'bn' ? ['চুলকানি', 'লালভাব', 'ফোসকা'] :
                    currentLanguage === 'pa' ? ['ਖਾਰਸ਼', 'ਲਾਲੀ', 'ਛਾਲੇ'] :
                    ['Itching', 'Redness', 'Blisters']
        }
      ],
      factory: [
        {
          id: 1,
          name: currentLanguage === 'hi' ? 'सुनने की समस्या' :
                currentLanguage === 'bn' ? 'শ্রবণশক্তির সমস্যা' :
                currentLanguage === 'pa'? 'ਸੁਣਨ ਦੀ ਸਮੱਸਿਆ' : 'Hearing Problems',
          icon: 'Ear',
          severity: 'medium',
          description: currentLanguage === 'hi' ? `तेज़ आवाज़ और मशीनों के शोर से सुनने की क्षमता कम हो सकती है।\nलंबे समय तक शोर में काम करने से स्थायी नुकसान हो सकता है।` :
                       currentLanguage === 'bn' ? `তীব্র আওয়াজ এবং যন্ত্রের শব্দে শ্রবণশক্তি কমে যেতে পারে।\nদীর্ঘ সময় শব্দে কাজ করলে স্থায়ী ক্ষতি হতে পারে।` :
                       currentLanguage === 'pa' ? `ਤੇਜ਼ ਆਵਾਜ਼ ਅਤੇ ਮਸ਼ੀਨਾਂ ਦੇ ਸ਼ੋਰ ਨਾਲ ਸੁਣਨ ਦੀ ਸਮਰੱਥਾ ਘੱਟ ਹੋ ਸਕਦੀ ਹੈ।\nਲੰਬੇ ਸਮੇਂ ਤੱਕ ਸ਼ੋਰ ਵਿੱਚ ਕੰਮ ਕਰਨ ਨਾਲ ਸਥਾਈ ਨੁਕਸਾਨ ਹੋ ਸਕਦਾ ਹੈ।` :
                       `Loud noise and machine sounds can reduce hearing ability.\nWorking in noise for long periods can cause permanent damage.`,
          symptoms: currentLanguage === 'hi' ? ['कान में दर्द', 'सुनाई न देना', 'कान बजना'] :
                    currentLanguage === 'bn' ? ['কানে ব্যথা', 'শুনতে না পাওয়া', 'কান বাজা'] :
                    currentLanguage === 'pa' ? ['ਕੰਨ ਵਿੱਚ ਦਰਦ', 'ਸੁਣਾਈ ਨਾ ਦੇਣਾ', 'ਕੰਨ ਵਜਣਾ'] :
                    ['Ear pain', 'Hearing loss', 'Ringing ears']
        }
      ],
      agriculture: [
        {
          id: 1,
          name: currentLanguage === 'hi' ? 'कीटनाशक विषाक्तता' :
                currentLanguage === 'bn' ? 'কীটনাশক বিষক্রিয়া' :
                currentLanguage === 'pa'? 'ਕੀੜੇ-ਮਾਰ ਜ਼ਹਿਰ' : 'Pesticide Poisoning',
          icon: 'Skull',
          severity: 'high',
          description: currentLanguage === 'hi' ? `कीটनাশकों के संपर্क से विषाक्तता हो सकती है।\nसुरक्षा उपकरण न पहनने से गंभीर स्वास्थ्य समस्याएं हो सकती हैं।` :
                       currentLanguage === 'bn' ? `কীটনাশকের সংস্পর্শে বিষক্রিয়া হতে পারে।\nসুরক্ষা সরঞ্জাম না পরলে গুরুতর স্বাস্থ্য সমস্যা হতে পারে।` :
                       currentLanguage === 'pa' ? `ਕੀੜੇ-ਮਾਰ ਦਵਾਈਆਂ ਦੇ ਸੰਪਰਕ ਨਾਲ ਜ਼ਹਿਰ ਹੋ ਸਕਦਾ ਹੈ।\nਸੁਰੱਖਿਆ ਸਾਜ਼ੋ-ਸਾਮਾਨ ਨਾ ਪਹਿਨਣ ਨਾਲ ਗੰਭੀਰ ਸਿਹਤ ਸਮੱਸਿਆਵਾਂ ਹੋ ਸਕਦੀਆਂ ਹਨ।` :
                       `Exposure to pesticides can cause poisoning.\nNot wearing protective equipment can lead to serious health problems.`,
          symptoms: currentLanguage === 'hi' ? ['मतली', 'चक्कर आना', 'सिरदर्द'] :
                    currentLanguage === 'bn' ? ['বমি ভাব', 'মাথা ঘোরা', 'মাথাব্যথা'] :
                    currentLanguage === 'pa' ? ['ਜੀ ਮਿਚਲਾਉਣਾ', 'ਚੱਕਰ ਆਉਣਾ', 'ਸਿਰਦਰਦ'] :
                    ['Nausea', 'Dizziness', 'Headache']
        }
      ],
      domestic: [
        {
          id: 1,
          name: currentLanguage === 'hi' ? 'रसायनिक जलन' :
                currentLanguage === 'bn' ? 'রাসায়নিক পোড়া' :
                currentLanguage === 'pa'? 'ਰਸਾਇਣਿਕ ਜਲਣ' : 'Chemical Burns',
          icon: 'Flame',
          severity: 'medium',
          description: currentLanguage === 'hi' ? `सफाई के रसायनों से त्वचा और आंखों में जलन हो सकती है।\nसही तरीके से उपयोग न करने से नुकसान हो सकता है।` :
                       currentLanguage === 'bn' ? `পরিষ্কারের রাসায়নিক থেকে চর্ম এবং চোখে জ্বালাপোড়া হতে পারে।\nসঠিক উপায়ে ব্যবহার না করলে ক্ষতি হতে পারে।` :
                       currentLanguage === 'pa' ? `ਸਫਾਈ ਦੇ ਰਸਾਇਣਾਂ ਨਾਲ ਚਮੜੀ ਅਤੇ ਅੱਖਾਂ ਵਿੱਚ ਜਲਣ ਹੋ ਸਕਦੀ ਹੈ।\nਸਹੀ ਤਰੀਕੇ ਨਾਲ ਵਰਤੋਂ ਨਾ ਕਰਨ ਨਾਲ ਨੁਕਸਾਨ ਹੋ ਸਕਦਾ ਹੈ।` :
                       `Cleaning chemicals can cause skin and eye irritation.\nImproper use can lead to damage.`,
          symptoms: currentLanguage === 'hi' ? ['त्वचा में जलन', 'आंखों में दर्द', 'सांस लेने में कठिनाई'] :
                    currentLanguage === 'bn' ? ['চর্মে জ্বালাপোড়া', 'চোখে ব্যথা', 'শ্বাস নিতে কষ্ট'] :
                    currentLanguage === 'pa' ? ['ਚਮੜੀ ਵਿੱਚ ਜਲਣ', 'ਅੱਖਾਂ ਵਿੱਚ ਦਰਦ', 'ਸਾਹ ਲੈਣ ਵਿੱਚ ਮੁਸ਼ਕਿਲ'] :
                    ['Skin irritation', 'Eye pain', 'Breathing difficulty']
        }
      ],
      transport: [
        {
          id: 1,
          name: currentLanguage === 'hi' ? 'पीठ और गर्दन की समस्या' :
                currentLanguage === 'bn' ? 'পিঠ এবং ঘাড়ের সমস্যা' :
                currentLanguage === 'pa'? 'ਪਿੱਠ ਅਤੇ ਗਰਦਨ ਦੀ ਸਮੱਸਿਆ' : 'Back and Neck Problems',
          icon: 'User',
          severity: 'medium',
          description: currentLanguage === 'hi' ? `लंबे समय तक बैठने और भारी सामान उठाने से पीठ दर्द हो सकता है।\nगलत मुद्रा में काम करने से गर्दन में दर्द हो सकता है।` :
                       currentLanguage === 'bn' ? `দীর্ঘ সময় বসে থাকা এবং ভারী জিনিস তোলার কারণে পিঠে ব্যথা হতে পারে।\nভুল ভঙ্গিতে কাজ করলে ঘাড়ে ব্যথা হতে পারে।` :
                       currentLanguage === 'pa' ? `ਲੰਬੇ ਸਮੇਂ ਤੱਕ ਬੈਠਣ ਅਤੇ ਭਾਰੀ ਸਾਮਾਨ ਚੁੱਕਣ ਨਾਲ ਪਿੱਠ ਦਰਦ ਹੋ ਸਕਦਾ ਹੈ।\nਗਲਤ ਮੁਦਰਾ ਵਿੱਚ ਕੰਮ ਕਰਨ ਨਾਲ ਗਰਦਨ ਵਿੱਚ ਦਰਦ ਹੋ ਸਕਦਾ ਹੈ।` :
                       `Long sitting and lifting heavy items can cause back pain.\nWorking in wrong posture can cause neck pain.`,
          symptoms: currentLanguage === 'hi' ? ['पीठ दर्द', 'गर्दन में अकड़न', 'मांसपेशियों में दर्द'] :
                    currentLanguage === 'bn' ? ['পিঠে ব্যথা', 'ঘাড় শক্ত', 'পেশীতে ব্যথা'] :
                    currentLanguage === 'pa' ? ['ਪਿੱਠ ਦਰਦ', 'ਗਰਦਨ ਵਿੱਚ ਅਕੜਨ', 'ਮਾਸਪੇਸ਼ੀਆਂ ਵਿੱਚ ਦਰਦ'] :
                    ['Back pain', 'Neck stiffness', 'Muscle pain']
        }
      ]
    };

    return risks?.[jobType] || risks?.construction;
  };

  const getTexts = () => {
    const texts = {
      en: {
        title: 'Common Health Risks',
        symptoms: 'Common Symptoms',
        learnMore: 'Learn More',
        showLess: 'Show Less',
        high: 'High Risk',
        medium: 'Medium Risk',
        low: 'Low Risk'
      },
      hi: {
        title: 'सामान्य स्वास्थ्य जोखिम',
        symptoms: 'सामान्य लक्षण',
        learnMore: 'और जानें',
        showLess: 'कम दिखाएं',
        high: 'उच्च जोखिम',
        medium: 'मध्यम जोखिम',
        low: 'कम जोखिम'
      },
      bn: {
        title: 'সাধারণ স্বাস্থ্য ঝুঁকি',
        symptoms: 'সাধারণ লক্ষণ',
        learnMore: 'আরও জানুন',
        showLess: 'কম দেখান',
        high: 'উচ্চ ঝুঁকি',
        medium: 'মাঝারি ঝুঁকি',
        low: 'কম ঝুঁকি'
      },
      pa: {
        title: 'ਆਮ ਸਿਹਤ ਖਤਰੇ',
        symptoms: 'ਆਮ ਲੱਛਣ',
        learnMore: 'ਹੋਰ ਜਾਣੋ',
        showLess: 'ਘੱਟ ਦਿਖਾਓ',
        high: 'ਉੱਚ ਖਤਰਾ',
        medium: 'ਮੱਧਮ ਖਤਰਾ',
        low: 'ਘੱਟ ਖਤਰਾ'
      }
    };

    return texts?.[currentLanguage] || texts?.en;
  };

  const healthRisks = getHealthRisks();
  const texts = getTexts();

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getSeverityBg = (severity) => {
    switch (severity) {
      case 'high': return 'bg-error bg-opacity-10';
      case 'medium': return 'bg-warning bg-opacity-10';
      case 'low': return 'bg-success bg-opacity-10';
      default: return 'bg-muted';
    }
  };

  const toggleExpanded = (riskId) => {
    setExpandedRisk(expandedRisk === riskId ? null : riskId);
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-error bg-opacity-10 rounded-lg flex items-center justify-center">
          <Icon name="AlertTriangle" size={20} className="text-error" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">{texts?.title}</h3>
      </div>
      <div className="space-y-4">
        {healthRisks?.map((risk) => (
          <div key={risk?.id} className="border border-border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getSeverityBg(risk?.severity)}`}>
                  <Icon name={risk?.icon} size={20} className={getSeverityColor(risk?.severity)} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium text-foreground">{risk?.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${getSeverityBg(risk?.severity)} ${getSeverityColor(risk?.severity)}`}>
                      {texts?.[risk?.severity]}
                    </span>
                  </div>
                  
                  {expandedRisk === risk?.id && (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {risk?.description}
                      </p>
                      
                      <div>
                        <h5 className="text-sm font-medium text-foreground mb-2">{texts?.symptoms}:</h5>
                        <div className="flex flex-wrap gap-2">
                          {risk?.symptoms?.map((symptom, index) => (
                            <span key={index} className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                              {symptom}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleExpanded(risk?.id)}
                iconName={expandedRisk === risk?.id ? "ChevronUp" : "ChevronDown"}
                iconPosition="right"
              >
                {expandedRisk === risk?.id ? texts?.showLess : texts?.learnMore}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthRisksSection;