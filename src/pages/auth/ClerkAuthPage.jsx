import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { SignIn, SignUp, useUser } from '@clerk/clerk-react';
import { useClerkAuth } from '../../contexts/ClerkAuthContext';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

const ClerkAuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isSignedIn } = useUser();
  const { workerData, linkWorkerAccount } = useClerkAuth();
  
  // Debug logging
  React.useEffect(() => {
    console.log('Clerk Environment:', {
      publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
      isSignedIn,
      user
    });
  }, [isSignedIn, user]);
  
  const [activeTab, setActiveTab] = useState('signin');
  const [showLinkAccount, setShowLinkAccount] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  
  const [linkForm, setLinkForm] = useState({
    workerId: '',
    phoneNumber: ''
  });

  // Check if user is already authenticated
  useEffect(() => {
    if (isSignedIn && user) {
      const redirect = searchParams.get('redirect') || '/dashboard';
      navigate(redirect);
    }
  }, [isSignedIn, user, navigate, searchParams]);

  // Set initial tab from URL params
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'signup' || tab === 'signin') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setErrors({});
    setMessage('');
    // Update URL without page refresh
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', tab);
    navigate(`/auth?${newParams.toString()}`, { replace: true });
  };

  const handleLinkAccount = async (e) => {
    e.preventDefault();
    
    if (!linkForm.workerId || !linkForm.phoneNumber) {
      setErrors({ general: 'Please enter both Worker ID and Phone Number' });
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});

    try {
      const { success, error } = await linkWorkerAccount(
        linkForm.workerId,
        linkForm.phoneNumber
      );

      if (error) {
        setErrors({ general: error.message });
      } else if (success) {
        setMessage('Worker account linked successfully! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error) {
      setErrors({ general: error.message || 'Failed to link account' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If user is signed in but has no worker data, show link account option
  useEffect(() => {
    if (isSignedIn && user && !workerData) {
      setShowLinkAccount(true);
    }
  }, [isSignedIn, user, workerData]);

  const clerkAppearance = {
    elements: {
      formButtonPrimary: 
        "bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors",
      card: "bg-white border border-gray-200 rounded-xl shadow-sm p-0",
      headerTitle: "text-gray-900 text-xl font-semibold",
      headerSubtitle: "text-gray-600",
      socialButtonsBlockButton: 
        "bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 w-full mb-3 shadow-sm",
      socialButtonsBlockButtonText: "font-medium text-gray-700",
      socialButtonsProviderIcon: "w-5 h-5",
      socialButtonsBlock: "w-full space-y-2",
      dividerLine: "bg-gray-200",
      dividerText: "text-gray-500 text-sm",
      formFieldInput: 
        "bg-white border border-gray-300 text-gray-900 rounded-lg py-2 px-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
      formFieldLabel: "text-gray-700 font-medium text-sm",
      footerActionLink: "text-blue-600 hover:text-blue-700",
      formFieldErrorText: "text-red-600 text-sm",
      identityPreviewEditButton: "text-blue-600 hover:text-blue-700"
    },
    variables: {
      colorPrimary: "#2563eb",
      colorBackground: "#ffffff",
      colorInputBackground: "#ffffff",
      colorInputText: "#111827",
      borderRadius: "0.5rem"
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign In / Sign Up - WorkerHelper</title>
        <meta name="description" content="Sign in to your WorkerHelper account or create a new account to manage your health records." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-md mx-auto">
              
              {/* Page Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Shield" size={32} color="white" />
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to WorkerHelper</h1>
                <p className="text-muted-foreground">
                  Secure access to your health records
                </p>
              </div>

              {/* Show link account form if user is signed in but has no worker data */}
              {showLinkAccount && isSignedIn ? (
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="text-center mb-6">
                    <Icon name="Link" size={48} className="text-primary mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-foreground mb-2">
                      Link Your Existing Health Record
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Connect your existing Worker Health ID to access your health records
                    </p>
                  </div>

                  {/* Messages */}
                  {message && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">{message}</p>
                    </div>
                  )}

                  {errors.general && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800">{errors.general}</p>
                    </div>
                  )}

                  <form onSubmit={handleLinkAccount} className="space-y-4">
                    <Input
                      label="Worker Health ID"
                      type="text"
                      placeholder="Enter your Worker Health ID (e.g., WH-ABC123-XYZ789)"
                      value={linkForm.workerId}
                      onChange={(e) => setLinkForm(prev => ({ ...prev, workerId: e.target.value }))}
                      required
                    />

                    <Input
                      label="Phone Number"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={linkForm.phoneNumber}
                      onChange={(e) => setLinkForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      required
                    />

                    <div className="flex space-x-3">
                      <Button
                        type="submit"
                        variant="default"
                        size="lg"
                        loading={isSubmitting}
                        iconName="Link"
                        iconPosition="left"
                        fullWidth
                      >
                        Link Account
                      </Button>
                    </div>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => navigate('/personal-health-record')}
                        className="text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        Don't have a health record? Create one here
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-card rounded-xl border border-border p-6">
                  {/* Tabs */}
                  <div className="flex bg-muted rounded-lg p-1 mb-6">
                    <button
                      onClick={() => handleTabChange('signin')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        activeTab === 'signin' 
                          ? 'bg-background text-foreground shadow-sm' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => handleTabChange('signup')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        activeTab === 'signup' 
                          ? 'bg-background text-foreground shadow-sm' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Sign Up
                    </button>
                  </div>

                  {/* Clerk Auth Components */}
                  <div className="w-full flex justify-center">
                    {activeTab === 'signin' ? (
                      <SignIn 
                        appearance={clerkAppearance}
                        afterSignInUrl="/dashboard"
                        forceRedirectUrl="/dashboard"
                        signUpUrl="/auth?tab=signup"
                      />
                    ) : (
                      <SignUp 
                        appearance={clerkAppearance}
                        afterSignUpUrl="/dashboard"
                        forceRedirectUrl="/dashboard"
                        signInUrl="/auth?tab=signin"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Footer Links */}
              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                  Don't have a health record yet?{' '}
                  <button
                    onClick={() => navigate('/personal-health-record')}
                    className="text-primary hover:underline"
                  >
                    Create one here
                  </button>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ClerkAuthPage;