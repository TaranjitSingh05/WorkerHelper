import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import PersonalInfoForm from './components/PersonalInfoForm';
import HealthRecordSuccess from './components/HealthRecordSuccess';
import HealthRecordHeader from './components/HealthRecordHeader';

const PersonalHealthRecord = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workerData, setWorkerData] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Load language preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('workerhelper-language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  // Generate unique Worker Health ID
  const generateWorkerId = () => {
    const prefix = 'WH';
    const timestamp = Date.now()?.toString()?.slice(-6);
    const random = Math.floor(Math.random() * 1000)?.toString()?.padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  };

  // Mock Supabase integration - simulate database storage
  const saveToDatabase = async (formData) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const workerRecord = {
      ...formData,
      workerId: generateWorkerId(),
      createdAt: new Date()?.toISOString(),
      updatedAt: new Date()?.toISOString(),
      status: 'active'
    };

    // In real implementation, this would be:
    // const { data, error } = await supabase
    //   .from('worker_health_records')
    //   .insert([workerRecord])
    //   .select();

    return workerRecord;
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    
    try {
      // Save to mock database
      const savedRecord = await saveToDatabase(formData);
      
      setWorkerData(savedRecord);
      setShowSuccess(true);
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error) {
      console.error('Error saving health record:', error);
      alert('Failed to create health record. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateNew = () => {
    setShowSuccess(false);
    setWorkerData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pageTitle = {
    en: 'Personal Health Record - WorkerHelper',
    hi: 'व्यक्तिगत स्वास्थ्य रिकॉर्ड - WorkerHelper',
    bn: 'ব্যক্তিগত স্বাস্থ্য রেকর্ড - WorkerHelper',
    pa: 'ਨਿੱਜੀ ਸਿਹਤ ਰਿਕਾਰਡ - WorkerHelper'
  };

  const pageDescription = {
    en: 'Create your comprehensive digital health profile with unique Worker Health ID and QR code for easy healthcare access across Kerala.',
    hi: 'केरल में आसान स्वास्थ्य सेवा पहुंच के लिए अनूठी वर्कर हेल्थ आईडी और QR कोड के साथ अपना व्यापक डिजिटल स्वास्थ्य प्रोफाइल बनाएं।',
    bn: 'কেরালা জুড়ে সহজ স্বাস্থ্যসেবা অ্যাক্সেসের জন্য অনন্য ওয়ার্কার হেলথ আইডি এবং QR কোড সহ আপনার ব্যাপক ডিজিটাল স্বাস্থ্য প্রোফাইল তৈরি করুন।',
    pa: 'ਕੇਰਲ ਵਿੱਚ ਆਸਾਨ ਸਿਹਤ ਸੇਵਾ ਪਹੁੰਚ ਲਈ ਵਿਲੱਖਣ ਵਰਕਰ ਹੈਲਥ ਆਈਡੀ ਅਤੇ QR ਕੋਡ ਨਾਲ ਆਪਣਾ ਵਿਆਪਕ ਡਿਜੀਟਲ ਸਿਹਤ ਪ੍ਰੋਫਾਈਲ ਬਣਾਓ।'
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle?.[currentLanguage] || pageTitle?.en}</title>
        <meta name="description" content={pageDescription?.[currentLanguage] || pageDescription?.en} />
        <meta name="keywords" content="health record, worker health, digital health, Kerala, migrant workers, QR code, health ID" />
        <meta property="og:title" content={pageTitle?.[currentLanguage] || pageTitle?.en} />
        <meta property="og:description" content={pageDescription?.[currentLanguage] || pageDescription?.en} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle?.[currentLanguage] || pageTitle?.en} />
        <meta name="twitter:description" content={pageDescription?.[currentLanguage] || pageDescription?.en} />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4 lg:px-8">
            <HealthRecordHeader />
            
            <div className="max-w-4xl mx-auto">
              {showSuccess ? (
                <HealthRecordSuccess 
                  workerData={workerData}
                  onCreateNew={handleCreateNew}
                />
              ) : (
                <PersonalInfoForm 
                  onSubmit={handleFormSubmit}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-card border-t border-border py-8">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center text-sm text-muted-foreground">
              <p>© {new Date()?.getFullYear()} WorkerHelper. All rights reserved.</p>
              <p className="mt-2">
                Secure health record management for migrant workers in Kerala
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default PersonalHealthRecord;