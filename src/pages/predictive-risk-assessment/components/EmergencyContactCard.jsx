import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmergencyContactCard = ({ currentLanguage }) => {
  const getTexts = () => {
    const texts = {
      en: {
        title: 'Emergency Contacts',
        subtitle: 'Important numbers for health emergencies',
        ambulance: 'Ambulance',
        healthHelpline: 'Health Helpline',
        poisonControl: 'Poison Control',
        call: 'Call Now'
      },
      hi: {
        title: 'आपातकालीन संपर्क',
        subtitle: 'स्वास्थ्य आपातकाल के लिए महत्वपूर्ण नंबर',
        ambulance: 'एम्बुलेंस',
        healthHelpline: 'स्वास्थ्य हेल्पलाइन',
        poisonControl: 'विष नियंत्रण',
        call: 'अभी कॉल करें'
      },
      bn: {
        title: 'জরুরি যোগাযোগ',
        subtitle: 'স্বাস্থ্য জরুরি অবস্থার জন্য গুরুত্বপূর্ণ নম্বর',
        ambulance: 'অ্যাম্বুলেন্স',
        healthHelpline: 'স্বাস্থ্য হেল্পলাইন',
        poisonControl: 'বিষ নিয়ন্ত্রণ',
        call: 'এখনই কল করুন'
      },
      pa: {
        title: 'ਐਮਰਜੈਂਸੀ ਸੰਪਰਕ',
        subtitle: 'ਸਿਹਤ ਐਮਰਜੈਂਸੀ ਲਈ ਮਹੱਤਵਪੂਰਨ ਨੰਬਰ',
        ambulance: 'ਐਂਬੂਲੈਂਸ',
        healthHelpline: 'ਸਿਹਤ ਹੈਲਪਲਾਈਨ',
        poisonControl: 'ਜ਼ਹਿਰ ਨਿਯੰਤਰਣ',
        call: 'ਹੁਣੇ ਕਾਲ ਕਰੋ'
      }
    };

    return texts?.[currentLanguage] || texts?.en;
  };

  const texts = getTexts();

  const emergencyContacts = [
    {
      id: 1,
      name: texts?.ambulance,
      number: '108',
      icon: 'Ambulance',
      color: 'text-error',
      bgColor: 'bg-error bg-opacity-10'
    },
    {
      id: 2,
      name: texts?.healthHelpline,
      number: '104',
      icon: 'Phone',
      color: 'text-primary',
      bgColor: 'bg-primary bg-opacity-10'
    },
    {
      id: 3,
      name: texts?.poisonControl,
      number: '1066',
      icon: 'AlertTriangle',
      color: 'text-warning',
      bgColor: 'bg-warning bg-opacity-10'
    }
  ];

  const handleCall = (number) => {
    window.open(`tel:${number}`, '_self');
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-error bg-opacity-10 rounded-lg flex items-center justify-center">
          <Icon name="Phone" size={20} className="text-error" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">{texts?.title}</h3>
          <p className="text-sm text-muted-foreground">{texts?.subtitle}</p>
        </div>
      </div>
      <div className="space-y-3">
        {emergencyContacts?.map((contact) => (
          <div key={contact?.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${contact?.bgColor}`}>
                <Icon name={contact?.icon} size={20} className={contact?.color} />
              </div>
              <div>
                <h4 className="font-medium text-foreground">{contact?.name}</h4>
                <p className="text-lg font-semibold text-muted-foreground">{contact?.number}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCall(contact?.number)}
              iconName="Phone"
              iconPosition="left"
            >
              {texts?.call}
            </Button>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-muted rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-primary mt-0.5" />
          <p className="text-xs text-muted-foreground">
            {currentLanguage === 'hi' ? 'ये नंबर 24/7 उपलब्ध हैं। किसी भी स्वास्थ्य आपातकाल में तुरंत कॉल करें।' :
             currentLanguage === 'bn' ? 'এই নম্বরগুলি ২৪/৭ উপলব্ধ। যেকোনো স্বাস্থ্য জরুরি অবস্থায় তৎক্ষণাৎ কল করুন।' :
             currentLanguage === 'pa'? 'ਇਹ ਨੰਬਰ 24/7 ਉਪਲਬਧ ਹਨ। ਕਿਸੇ ਵੀ ਸਿਹਤ ਐਮਰਜੈਂਸੀ ਵਿੱਚ ਤੁਰੰਤ ਕਾਲ ਕਰੋ।' : 'These numbers are available 24/7. Call immediately in any health emergency.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContactCard;