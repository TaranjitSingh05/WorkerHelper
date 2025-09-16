import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import OTPVerification from './components/OTPVerification';

const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signUpWithOTP, signIn, signInWithOTP, signInWithWorkerCredentials, linkWorkerAccount, user, loading } = useAuth();
  
  const [activeTab, setActiveTab] = useState('signin'); // 'signin' or 'signup'
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'worker'
  const [currentStep, setCurrentStep] = useState('form'); // 'form' or 'otp'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [showLinkAccount, setShowLinkAccount] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpType, setOtpType] = useState('signup');

  // Form states
  const [signInForm, setSignInForm] = useState({
    email: '',
    workerId: '',
    phoneNumber: ''
  });

  const [signUpForm, setSignUpForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: ''
  });

  const [linkForm, setLinkForm] = useState({
    workerId: '',
    phoneNumber: ''
  });

  // Check if user is already authenticated
  useEffect(() => {
    if (user && !loading) {
      const redirect = searchParams.get('redirect') || '/dashboard';
      navigate(redirect);
    }
  }, [user, loading, navigate, searchParams]);

  // Set initial tab from URL params
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'signup' || tab === 'signin') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const clearErrors = () => {
    setErrors({});
    setMessage('');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentStep('form');
    clearErrors();
    // Update URL without page refresh
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', tab);
    navigate(`/auth?${newParams.toString()}`, { replace: true });
  };

  const handleBackToForm = () => {
    setCurrentStep('form');
    setOtpEmail('');
    clearErrors();
  };

  const validateSignInForm = () => {
    const newErrors = {};

    if (loginMethod === 'email') {
      if (!signInForm.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(signInForm.email)) {
        newErrors.email = 'Please enter a valid email';
      }
    } else {
      if (!signInForm.workerId.trim()) {
        newErrors.workerId = 'Worker ID is required';
      }

      if (!signInForm.phoneNumber.trim()) {
        newErrors.phoneNumber = 'Phone number is required';
      } else if (!/^\d{10}$/.test(signInForm.phoneNumber.replace(/\D/g, ''))) {
        newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignUpForm = () => {
    const newErrors = {};

    if (!signUpForm.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(signUpForm.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!signUpForm.password) {
      newErrors.password = 'Password is required';
    } else if (signUpForm.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!signUpForm.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (signUpForm.password !== signUpForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!signUpForm.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!signUpForm.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(signUpForm.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    
    if (!validateSignInForm()) return;
    
    setIsSubmitting(true);
    clearErrors();

    try {
      if (loginMethod === 'email') {
        // Send OTP to email for signin
        const { data, error } = await signInWithOTP(signInForm.email);
        
        if (error) {
          if (error.message.includes('User not found')) {
            setErrors({ general: 'No account found with this email address' });
          } else {
            setErrors({ general: error.message });
          }
          return;
        }

        // Show OTP verification screen
        setOtpEmail(signInForm.email);
        setOtpType('email');
        setCurrentStep('otp');
        
      } else {
        // Worker ID + Phone signin
        const { data, error } = await signInWithWorkerCredentials(
          signInForm.workerId,
          signInForm.phoneNumber
        );
        
        if (error) {
          setErrors({ general: error.message });
          return;
        }

        if (data?.email) {
          // OTP sent to worker's email
          setOtpEmail(data.email);
          setOtpType('email');
          setCurrentStep('otp');
          setMessage(`Verification code sent to ${data.email}`);
        }
      }
    } catch (error) {
      setErrors({ general: error.message || 'An unexpected error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (!validateSignUpForm()) return;
    
    setIsSubmitting(true);
    clearErrors();

    try {
      const { data, error } = await signUpWithOTP(
        signUpForm.email,
        signUpForm.password,
        signUpForm.fullName,
        signUpForm.phoneNumber
      );

      if (error) {
        if (error.message.includes('User already registered')) {
          setErrors({ general: 'An account with this email already exists' });
        } else {
          setErrors({ general: error.message });
        }
        return;
      }

      if (data?.user) {
        // Show OTP verification screen
        setOtpEmail(signUpForm.email);
        setOtpType('signup');
        setCurrentStep('otp');
        setMessage('Verification code sent to your email');
      }
    } catch (error) {
      setErrors({ general: error.message || 'An unexpected error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLinkAccount = async () => {
    if (!linkForm.workerId || !linkForm.phoneNumber) return;
    
    setIsSubmitting(true);
    clearErrors();

    try {
      const { success, error } = await linkWorkerAccount(
        linkForm.workerId,
        linkForm.phoneNumber
      );

      if (error) {
        setErrors({ general: error.message });
      } else if (success) {
        setMessage('Worker account linked successfully! You can now access your dashboard.');
        setShowLinkAccount(false);
        navigate('/dashboard');
      }
    } catch (error) {
      setErrors({ general: error.message || 'Failed to link account' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Icon name="Loader" size={32} className="text-primary animate-spin" />
      </div>
    );
  }

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

              {/* Auth Card */}
              <div className="bg-card rounded-xl border border-border p-6">
                
                {currentStep === 'otp' ? (
                  <OTPVerification 
                    email={otpEmail}
                    type={otpType}
                    onBack={handleBackToForm}
                    onSuccess={() => {
                      const redirect = searchParams.get('redirect') || '/dashboard';
                      navigate(redirect);
                    }}
                  />
                ) : (
                  <>
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

                {/* Sign In Form */}
                {activeTab === 'signin' && (
                  <form onSubmit={handleSignIn} className="space-y-4">
                    
                    {/* Login Method Toggle */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-foreground">Login Method</label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="loginMethod"
                            value="email"
                            checked={loginMethod === 'email'}
                            onChange={(e) => setLoginMethod(e.target.value)}
                            className="mr-2"
                          />
                          <span className="text-sm">Email & Password</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="loginMethod"
                            value="worker"
                            checked={loginMethod === 'worker'}
                            onChange={(e) => setLoginMethod(e.target.value)}
                            className="mr-2"
                          />
                          <span className="text-sm">Worker ID & Phone</span>
                        </label>
                      </div>
                    </div>

                    {/* Email Field */}
                    {loginMethod === 'email' && (
                      <Input
                        label="Email"
                        type="email"
                        placeholder="Enter your email to receive OTP"
                        value={signInForm.email}
                        onChange={(e) => setSignInForm(prev => ({ ...prev, email: e.target.value }))}
                        error={errors.email}
                        description="We'll send a 6-digit code to verify your identity"
                        required
                      />
                    )}

                    {/* Worker ID/Phone Fields */}
                    {loginMethod === 'worker' && (
                      <>
                        <Input
                          label="Worker ID"
                          type="text"
                          placeholder="Enter your Worker Health ID"
                          value={signInForm.workerId}
                          onChange={(e) => setSignInForm(prev => ({ ...prev, workerId: e.target.value }))}
                          error={errors.workerId}
                          required
                        />

                        <Input
                          label="Phone Number"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={signInForm.phoneNumber}
                          onChange={(e) => setSignInForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                          error={errors.phoneNumber}
                          required
                        />
                      </>
                    )}

                    <Button
                      type="submit"
                      variant="default"
                      size="lg"
                      loading={isSubmitting}
                      fullWidth
                      iconName={loginMethod === 'email' ? 'Mail' : 'LogIn'}
                      iconPosition="left"
                    >
                      {isSubmitting 
                        ? (loginMethod === 'email' ? 'Sending Code...' : 'Validating...') 
                        : (loginMethod === 'email' ? 'Send Code' : 'Continue')}
                    </Button>
                  </form>
                )}

                {/* Sign Up Form */}
                {activeTab === 'signup' && (
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <Input
                      label="Full Name"
                      type="text"
                      placeholder="Enter your full name"
                      value={signUpForm.fullName}
                      onChange={(e) => setSignUpForm(prev => ({ ...prev, fullName: e.target.value }))}
                      error={errors.fullName}
                      required
                    />

                    <Input
                      label="Email"
                      type="email"
                      placeholder="Enter your email"
                      value={signUpForm.email}
                      onChange={(e) => setSignUpForm(prev => ({ ...prev, email: e.target.value }))}
                      error={errors.email}
                      required
                    />

                    <Input
                      label="Password"
                      type="password"
                      placeholder="Create a password (min. 6 characters)"
                      value={signUpForm.password}
                      onChange={(e) => setSignUpForm(prev => ({ ...prev, password: e.target.value }))}
                      error={errors.password}
                      required
                    />

                    <Input
                      label="Confirm Password"
                      type="password"
                      placeholder="Confirm your password"
                      value={signUpForm.confirmPassword}
                      onChange={(e) => setSignUpForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      error={errors.confirmPassword}
                      required
                    />

                    <Input
                      label="Phone Number"
                      type="tel"
                      placeholder="Enter your 10-digit phone number"
                      value={signUpForm.phoneNumber}
                      onChange={(e) => setSignUpForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      error={errors.phoneNumber}
                      description="Required for account verification and health record management"
                      required
                    />

                    <Button
                      type="submit"
                      variant="default"
                      size="lg"
                      loading={isSubmitting}
                      fullWidth
                      iconName="UserPlus"
                      iconPosition="left"
                    >
                      {isSubmitting ? 'Creating Account...' : 'Create Account & Send Code'}
                    </Button>
                  </form>
                )}

                {/* Link Account Section */}
                {showLinkAccount && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Link Your Health Record</h3>
                    
                    <div className="space-y-4">
                      <Input
                        label="Worker ID"
                        type="text"
                        placeholder="Enter your Worker Health ID"
                        value={linkForm.workerId}
                        onChange={(e) => setLinkForm(prev => ({ ...prev, workerId: e.target.value }))}
                      />

                      <Input
                        label="Phone Number"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={linkForm.phoneNumber}
                        onChange={(e) => setLinkForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      />

                      <div className="flex space-x-3">
                        <Button
                          onClick={handleLinkAccount}
                          variant="default"
                          size="md"
                          loading={isSubmitting}
                          iconName="Link"
                          iconPosition="left"
                        >
                          Link Account
                        </Button>
                        <Button
                          onClick={() => setShowLinkAccount(false)}
                          variant="outline"
                          size="md"
                        >
                          Skip for Now
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                  </>
                )}
              </div>

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

export default AuthPage;