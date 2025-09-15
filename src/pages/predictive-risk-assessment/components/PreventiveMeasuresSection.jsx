import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Link } from 'react-router-dom';

const PreventiveMeasuresSection = ({ jobType, currentLanguage }) => {
  const getPreventiveMeasures = () => {
    const measures = {
      construction: [
        {
          id: 1,
          title: currentLanguage === 'hi' ? 'सुरक्षा उपकरण पहनें' :
                 currentLanguage === 'bn' ? 'সুরক্ষা সরঞ্জাম পরুন' :
                 currentLanguage === 'pa'? 'ਸੁਰੱਖਿਆ ਸਾਜ਼ੋ-ਸਾਮਾਨ ਪਹਿਨੋ' : 'Wear Safety Equipment',
          description: currentLanguage === 'hi' ? `हमेशा हेलमेट, सेफ्टी बूट्स और ग्लव्स पहनें।\nधूल से बचने के लिए मास्क का उपयोग करें।` :
                       currentLanguage === 'bn' ? `সর্বদা হেলমেট, সেফটি বুট এবং গ্লাভস পরুন।\nধুলো থেকে বাঁচতে মাস্ক ব্যবহার করুন।` :
                       currentLanguage === 'pa' ? `ਹਮੇਸ਼ਾ ਹੈਲਮੈਟ, ਸੇਫਟੀ ਬੂਟ ਅਤੇ ਦਸਤਾਨੇ ਪਹਿਨੋ।\nਧੂੜ ਤੋਂ ਬਚਣ ਲਈ ਮਾਸਕ ਦੀ ਵਰਤੋਂ ਕਰੋ।` :
                       `Always wear helmet, safety boots and gloves.\nUse mask to protect from dust.`,
          icon: 'HardHat',
          priority: 'high'
        },
        {
          id: 2,
          title: currentLanguage === 'hi' ? 'नियमित स्वास्थ्य जांच' :
                 currentLanguage === 'bn' ? 'নিয়মিত স্বাস্থ্য পরীক্ষা' :
                 currentLanguage === 'pa'? 'ਨਿਯਮਿਤ ਸਿਹਤ ਜਾਂਚ' : 'Regular Health Checkups',
          description: currentLanguage === 'hi' ? `साल में दो बार फेफड़ों की जांच कराएं।\nकिसी भी समस्या के लक्षण दिखने पर तुरंत डॉक्टर से मिलें।` :
                       currentLanguage === 'bn' ? `বছরে দুইবার ফুসফুসের পরীক্ষা করান।\nকোনো সমস্যার লক্ষণ দেখা দিলে তৎক্ষণাৎ ডাক্তারের কাছে যান।` :
                       currentLanguage === 'pa' ? `ਸਾਲ ਵਿੱਚ ਦੋ ਵਾਰ ਫੇਫੜਿਆਂ ਦੀ ਜਾਂਚ ਕਰਵਾਓ।\nਕਿਸੇ ਵੀ ਸਮੱਸਿਆ ਦੇ ਲੱਛਣ ਦਿਖਣ 'ਤੇ ਤੁਰੰਤ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ।` :
                       `Get lung checkup twice a year.\nSee doctor immediately if any symptoms appear.`,
          icon: 'Stethoscope',priority: 'medium'
        },
        {
          id: 3,
          title: currentLanguage === 'hi' ? 'सही तकनीक का उपयोग' :
                 currentLanguage === 'bn' ? 'সঠিক কৌশল ব্যবহার' :
                 currentLanguage === 'pa' ? 'ਸਹੀ ਤਕਨੀਕ ਦੀ ਵਰਤੋਂ' :'Use Proper Technique',
          description: currentLanguage === 'hi' ? `भारी सामान उठाते समय घुटनों को मोड़ें।\nकाम के दौरान सही मुद्रा बनाए रखें।` :
                       currentLanguage === 'bn' ? `ভারী জিনিস তোলার সময় হাঁটু ভাঁজ করুন।\nকাজের সময় সঠিক ভঙ্গি বজায় রাখুন।` :
                       currentLanguage === 'pa' ? `ਭਾਰੀ ਸਾਮਾਨ ਚੁੱਕਦੇ ਸਮੇਂ ਗੋਡੇ ਮੋੜੋ।\nਕੰਮ ਦੇ ਦੌਰਾਨ ਸਹੀ ਮੁਦਰਾ ਬਣਾਈ ਰੱਖੋ।` :
                       `Bend knees when lifting heavy items.\nMaintain proper posture during work.`,
          icon: 'User',priority: 'medium'
        }
      ],
      fishery: [
        {
          id: 1,
          title: currentLanguage === 'hi' ? 'त्वचा की सुरक्षा' :
                 currentLanguage === 'bn' ? 'চর্মের সুরক্ষা' :
                 currentLanguage === 'pa' ? 'ਚਮੜੀ ਦੀ ਸੁਰੱਖਿਆ' :'Skin Protection',
          description: currentLanguage === 'hi' ? `वाटरप्रूफ ग्लव्स और बूट्स पहनें।\nकाम के बाद त्वचा को अच्छी तरह धोएं।` :
                       currentLanguage === 'bn' ? `ওয়াটারপ্রুফ গ্লাভস এবং বুট পরুন।\nকাজের পর চর্ম ভালো করে ধুয়ে নিন।` :
                       currentLanguage === 'pa' ? `ਵਾਟਰਪ੍ਰੂਫ ਦਸਤਾਨੇ ਅਤੇ ਬੂਟ ਪਹਿਨੋ।\nਕੰਮ ਦੇ ਬਾਅਦ ਚਮੜੀ ਨੂੰ ਚੰਗੀ ਤਰ੍ਹਾਂ ਧੋਵੋ।` :`Wear waterproof gloves and boots.\nWash skin thoroughly after work.`,icon: 'Shield',priority: 'high'
        }
      ],
      factory: [
        {
          id: 1,
          title: currentLanguage === 'hi' ? 'कान की सुरक्षा' :
                 currentLanguage === 'bn' ? 'কানের সুরক্ষা' :
                 currentLanguage === 'pa' ? 'ਕੰਨ ਦੀ ਸੁਰੱਖਿਆ' :'Ear Protection',
          description: currentLanguage === 'hi' ? `शोर वाली जगह पर ईयर प्लग का उपयोग करें।\nनियमित रूप से सुनने की जांच कराएं।` :
                       currentLanguage === 'bn' ? `শব্দযুক্ত জায়গায় ইয়ার প্লাগ ব্যবহার করুন।\nনিয়মিত শ্রবণশক্তি পরীক্ষা করান।` :
                       currentLanguage === 'pa' ? `ਸ਼ੋਰ ਵਾਲੀ ਜਗ੍ਹਾ 'ਤੇ ਈਅਰ ਪਲੱਗ ਦੀ ਵਰਤੋਂ ਕਰੋ।\nਨਿਯਮਿਤ ਤੌਰ 'ਤੇ ਸੁਣਨ ਦੀ ਜਾਂਚ ਕਰਵਾਓ।` :`Use ear plugs in noisy areas.\nGet hearing checked regularly.`,icon: 'Ear',priority: 'high'
        }
      ],
      agriculture: [
        {
          id: 1,
          title: currentLanguage === 'hi' ? 'सुरक्षित छिड़काव' :
                 currentLanguage === 'bn' ? 'নিরাপদ স্প্রে' :
                 currentLanguage === 'pa' ? 'ਸੁਰੱਖਿਤ ਛਿੜਕਾਅ' :'Safe Spraying',
          description: currentLanguage === 'hi' ? `कीटनाशक छिड़कते समय मास्क और दस्ताने पहनें।\nहवा की दिशा का ध्यान रखें।` :
                       currentLanguage === 'bn' ? `কীটনাশক স্প্রে করার সময় মাস্ক এবং গ্লাভস পরুন।\nবাতাসের দিক খেয়াল রাখুন।` :
                       currentLanguage === 'pa' ? `ਕੀੜੇ-ਮਾਰ ਦਵਾਈ ਛਿੜਕਦੇ ਸਮੇਂ ਮਾਸਕ ਅਤੇ ਦਸਤਾਨੇ ਪਹਿਨੋ।\nਹਵਾ ਦੀ ਦਿਸ਼ਾ ਦਾ ਧਿਆਨ ਰੱਖੋ।` :`Wear mask and gloves when spraying pesticides.\nPay attention to wind direction.`,icon: 'Spray',priority: 'high'
        }
      ],
      domestic: [
        {
          id: 1,
          title: currentLanguage === 'hi' ? 'रसायनों का सुरक्षित उपयोग' :
                 currentLanguage === 'bn' ? 'রাসায়নিকের নিরাপদ ব্যবহার' :
                 currentLanguage === 'pa' ? 'ਰਸਾਇਣਾਂ ਦੀ ਸੁਰੱਖਿਤ ਵਰਤੋਂ' :'Safe Chemical Use',
          description: currentLanguage === 'hi' ? `सफाई के रसायन इस्तेमाल करते समय दस्ताने पहनें।\nकमरे में हवा का आना-जाना बनाए रखें।` :
                       currentLanguage === 'bn' ? `পরিষ্কারের রাসায়নিক ব্যবহারের সময় গ্লাভস পরুন।\nঘরে বাতাস চলাচল বজায় রাখুন।` :
                       currentLanguage === 'pa' ? `ਸਫਾਈ ਦੇ ਰਸਾਇਣ ਵਰਤਦੇ ਸਮੇਂ ਦਸਤਾਨੇ ਪਹਿਨੋ।\nਕਮਰੇ ਵਿੱਚ ਹਵਾ ਦਾ ਆਉਣਾ-ਜਾਣਾ ਬਣਾਈ ਰੱਖੋ।` :`Wear gloves when using cleaning chemicals.\nMaintain ventilation in the room.`,icon: 'ShieldCheck',priority: 'high'
        }
      ],
      transport: [
        {
          id: 1,
          title: currentLanguage === 'hi' ? 'सही बैठने की मुद्रा' :
                 currentLanguage === 'bn' ? 'সঠিক বসার ভঙ্গি' :
                 currentLanguage === 'pa' ? 'ਸਹੀ ਬੈਠਣ ਦੀ ਮੁਦਰਾ' :'Proper Sitting Posture',
          description: currentLanguage === 'hi' ? `सीट को सही ऊंचाई पर रखें।\nहर घंटे में थोड़ी देर के लिए खड़े हों।` :
                       currentLanguage === 'bn' ? `সিট সঠিক উচ্চতায় রাখুন।\nপ্রতি ঘন্টায় কিছুক্ষণের জন্য দাঁড়ান।` :
                       currentLanguage === 'pa' ? `ਸੀਟ ਨੂੰ ਸਹੀ ਉਚਾਈ 'ਤੇ ਰੱਖੋ।\nਹਰ ਘੰਟੇ ਵਿੱਚ ਥੋੜ੍ਹੀ ਦੇਰ ਲਈ ਖੜ੍ਹੇ ਹੋਵੋ।` :
                       `Keep seat at proper height.\nStand for a while every hour.`,
          icon: 'User',
          priority: 'medium'
        }
      ]
    };

    return measures?.[jobType] || measures?.construction;
  };

  const getTexts = () => {
    const texts = {
      en: {
        title: 'Preventive Measures',
        subtitle: 'Follow these guidelines to protect your health',
        priority: {
          high: 'Critical',
          medium: 'Important',
          low: 'Recommended'
        },
        findCenters: 'Find Health Centers',
        createRecord: 'Create Health Record'
      },
      hi: {
        title: 'बचाव के उपाय',
        subtitle: 'अपने स्वास्थ्य की सुरक्षा के लिए इन दिशानिर्देशों का पालन करें',
        priority: {
          high: 'महत्वपूर्ण',
          medium: 'जरूरी',
          low: 'सुझावित'
        },
        findCenters: 'स्वास्थ्य केंद्र खोजें',
        createRecord: 'स्वास्थ्य रिकॉर्ड बनाएं'
      },
      bn: {
        title: 'প্রতিরোধমূলক ব্যবস্থা',
        subtitle: 'আপনার স্বাস্থ্য রক্ষার জন্য এই নির্দেশিকা অনুসরণ করুন',
        priority: {
          high: 'গুরুত্বপূর্ণ',
          medium: 'প্রয়োজনীয়',
          low: 'সুপারিশকৃত'
        },
        findCenters: 'স্বাস্থ্য কেন্দ্র খুঁজুন',
        createRecord: 'স্বাস্থ্য রেকর্ড তৈরি করুন'
      },
      pa: {
        title: 'ਰੋਕਥਾਮ ਦੇ ਉਪਾਅ',
        subtitle: 'ਆਪਣੀ ਸਿਹਤ ਦੀ ਸੁਰੱਖਿਆ ਲਈ ਇਨ੍ਹਾਂ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼ਾਂ ਦਾ ਪਾਲਣ ਕਰੋ',
        priority: {
          high: 'ਮਹੱਤਵਪੂਰਨ',
          medium: 'ਜ਼ਰੂਰੀ',
          low: 'ਸੁਝਾਈ ਗਈ'
        },
        findCenters: 'ਸਿਹਤ ਕੇਂਦਰ ਲੱਭੋ',
        createRecord: 'ਸਿਹਤ ਰਿਕਾਰਡ ਬਣਾਓ'
      }
    };

    return texts?.[currentLanguage] || texts?.en;
  };

  const preventiveMeasures = getPreventiveMeasures();
  const texts = getTexts();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityBg = (priority) => {
    switch (priority) {
      case 'high': return 'bg-error bg-opacity-10';
      case 'medium': return 'bg-warning bg-opacity-10';
      case 'low': return 'bg-success bg-opacity-10';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-card">
      <div className="flex items-center space-x-3 mb-2">
        <div className="w-10 h-10 bg-success bg-opacity-10 rounded-lg flex items-center justify-center">
          <Icon name="Shield" size={20} className="text-success" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">{texts?.title}</h3>
          <p className="text-sm text-muted-foreground">{texts?.subtitle}</p>
        </div>
      </div>
      <div className="space-y-4 mb-6">
        {preventiveMeasures?.map((measure) => (
          <div key={measure?.id} className="border border-border rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getPriorityBg(measure?.priority)}`}>
                <Icon name={measure?.icon} size={20} className={getPriorityColor(measure?.priority)} />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-medium text-foreground">{measure?.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${getPriorityBg(measure?.priority)} ${getPriorityColor(measure?.priority)}`}>
                    {texts?.priority?.[measure?.priority]}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {measure?.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
        <Link to="/health-centers-locator" className="flex-1">
          <Button variant="outline" fullWidth iconName="MapPin" iconPosition="left">
            {texts?.findCenters}
          </Button>
        </Link>
        <Link to="/personal-health-record" className="flex-1">
          <Button variant="default" fullWidth iconName="FileText" iconPosition="left">
            {texts?.createRecord}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PreventiveMeasuresSection;