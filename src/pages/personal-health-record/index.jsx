import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useUser } from '@clerk/clerk-react';
import { useClerkAuth } from '../../contexts/ClerkAuthContext';
import Header from '../../components/ui/Header';
import PersonalInfoForm from './components/PersonalInfoForm';
import HealthRecordSuccess from './components/HealthRecordSuccess';
import HealthRecordHeader from './components/HealthRecordHeader';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const PersonalHealthRecord = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const { workerData: existingWorkerData, loading } = useClerkAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workerData, setWorkerData] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Load language preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('workerhelper-language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);
  
  // Check if user already has data and show it
  useEffect(() => {
    if (isSignedIn && existingWorkerData && !showEditForm) {
      // User already has data, show the success view with their data
      setWorkerData({
        ...existingWorkerData,
        healthId: existingWorkerData.health_id,
        qrCodeUrl: existingWorkerData.qr_code_data || `${window.location.origin}/worker/${existingWorkerData.health_id}`
      });
      setShowSuccess(true);
    }
  }, [isSignedIn, existingWorkerData, showEditForm]);

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    
    try {
      // The form component now handles Supabase integration directly
      // and passes back the saved data with healthId
      setWorkerData(formData);
      setShowSuccess(true);
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateNew = () => {
    setShowSuccess(false);
    setWorkerData(null);
    setShowEditForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleEditRecord = () => {
    setShowEditForm(true);
    setShowSuccess(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleCancelEdit = () => {
    setShowEditForm(false);
    if (existingWorkerData) {
      setShowSuccess(true);
    }
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
              {loading ? (
                <div className="bg-card rounded-xl border border-border p-8 text-center">
                  <Icon name="Loader" size={32} className="text-primary animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading your health record...</p>
                </div>
              ) : showSuccess && !showEditForm ? (
                <div className="space-y-6">
                  {/* Edit button for existing users */}
                  {isSignedIn && existingWorkerData && (
                    <div className="text-center">
                      <Button
                        onClick={handleEditRecord}
                        variant="outline"
                        size="lg"
                        iconName="Edit"
                        iconPosition="left"
                      >
                        Edit Health Record
                      </Button>
                    </div>
                  )}
                  <HealthRecordSuccess 
                    workerData={workerData}
                    onCreateNew={handleCreateNew}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Cancel edit button for existing users */}
                  {isSignedIn && existingWorkerData && showEditForm && (
                    <div className="text-center">
                      <Button
                        onClick={handleCancelEdit}
                        variant="ghost"
                        size="sm"
                        iconName="ArrowLeft"
                        iconPosition="left"
                      >
                        Back to Health Record
                      </Button>
                    </div>
                  )}
                  <PersonalInfoForm 
                    onSubmit={handleFormSubmit}
                    isSubmitting={isSubmitting}
                  />
                </div>
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