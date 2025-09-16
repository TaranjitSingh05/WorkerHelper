import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import JobTypeSelector from './components/JobTypeSelector';
import RiskOverviewCard from './components/RiskOverviewCard';
import HealthRisksSection from './components/HealthRisksSection';
import PreventiveMeasuresSection from './components/PreventiveMeasuresSection';
import EmergencyContactCard from './components/EmergencyContactCard';
import Icon from '../../components/AppIcon';

const PredictiveRiskAssessment = () => {
  const [selectedJob, setSelectedJob] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('JeevanID_language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const getPageTexts = () => {
    const texts = {
      en: {
        title: 'Predictive Risk Assessment',
        subtitle: 'Understand health risks specific to your occupation and learn how to prevent them',
        selectJobFirst: 'Select Your Job Type',
        selectJobDescription: 'Please select your occupation type above to view personalized health risk assessment and preventive measures.',
        noJobSelected: 'No occupation selected'
      },
      hi: {
        title: 'भविष्यवाणी जोखिम मूल्यांकन',
        subtitle: 'अपने व्यवसाय के लिए विशिष्ट स्वास्थ्य जोखिमों को समझें और उन्हें रोकने का तरीका जानें',
        selectJobFirst: 'अपना काम का प्रकार चुनें',
        selectJobDescription: 'व्यक्तिगत स्वास्थ्य जोखिम मूल्यांकन और बचाव के उपाय देखने के लिए कृपया ऊपर अपना व्यवसाय चुनें।',
        noJobSelected: 'कोई व्यवसाय नहीं चुना गया'
      },
      bn: {
        title: 'ভবিষ্যদ্বাণীমূলক ঝুঁকি মূল্যায়ন',
        subtitle: 'আপনার পেশার জন্য নির্দিষ্ট স্বাস্থ্য ঝুঁকি বুঝুন এবং সেগুলি প্রতিরোধের উপায় জানুন',
        selectJobFirst: 'আপনার কাজের ধরন নির্বাচন করুন',
        selectJobDescription: 'ব্যক্তিগত স্বাস্থ্য ঝুঁকি মূল্যায়ন এবং প্রতিরোধমূলক ব্যবস্থা দেখতে অনুগ্রহ করে উপরে আপনার পেশা নির্বাচন করুন।',
        noJobSelected: 'কোনো পেশা নির্বাচিত নয়'
      },
      pa: {
        title: 'ਭਵਿੱਖਬਾਣੀ ਜੋਖਮ ਮੁਲਾਂਕਣ',
        subtitle: 'ਆਪਣੇ ਕਿੱਤੇ ਲਈ ਖਾਸ ਸਿਹਤ ਖਤਰਿਆਂ ਨੂੰ ਸਮਝੋ ਅਤੇ ਉਨ੍ਹਾਂ ਨੂੰ ਰੋਕਣ ਦਾ ਤਰੀਕਾ ਜਾਣੋ',
        selectJobFirst: 'ਆਪਣੇ ਕੰਮ ਦੀ ਕਿਸਮ ਚੁਣੋ',
        selectJobDescription: 'ਵਿਅਕਤੀਗਤ ਸਿਹਤ ਜੋਖਮ ਮੁਲਾਂਕਣ ਅਤੇ ਰੋਕਥਾਮ ਦੇ ਉਪਾਅ ਦੇਖਣ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਉੱਪਰ ਆਪਣਾ ਕਿੱਤਾ ਚੁਣੋ।',
        noJobSelected: 'ਕੋਈ ਕਿੱਤਾ ਨਹੀਂ ਚੁਣਿਆ ਗਿਆ'
      }
    };

    return texts?.[currentLanguage] || texts?.en;
  };

  const pageTexts = getPageTexts();

  const handleJobChange = (jobType) => {
    setSelectedJob(jobType);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {pageTexts?.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {pageTexts?.subtitle}
            </p>
          </div>

          {/* Job Type Selector */}
          <div className="mb-8">
            <JobTypeSelector
              selectedJob={selectedJob}
              onJobChange={handleJobChange}
              currentLanguage={currentLanguage}
            />
          </div>

          {selectedJob ? (
            <div className="space-y-8">
              {/* Risk Overview */}
              <RiskOverviewCard
                jobType={selectedJob}
                currentLanguage={currentLanguage}
              />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Health Risks Section */}
                  <HealthRisksSection
                    jobType={selectedJob}
                    currentLanguage={currentLanguage}
                  />

                  {/* Preventive Measures Section */}
                  <PreventiveMeasuresSection
                    jobType={selectedJob}
                    currentLanguage={currentLanguage}
                  />
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <EmergencyContactCard currentLanguage={currentLanguage} />
                </div>
              </div>
            </div>
          ) : (
            /* No Job Selected State */
            (<div className="text-center py-16">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="Briefcase" size={32} className="text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {pageTexts?.selectJobFirst}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {pageTexts?.selectJobDescription}
              </p>
            </div>)
          )}
        </div>
      </main>
    </div>
  );
};

export default PredictiveRiskAssessment;