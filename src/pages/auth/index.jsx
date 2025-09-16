/**
 * @fileoverview Main Authentication Page Component
 * @description Handles user authentication including sign-in, sign-up, and account linking
 * @author JeevanID Team
 * @version 1.0.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

// Context and Hooks
import { useAuth } from '../../contexts/AuthContext';

// UI Components
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import OTPVerification from './components/OTPVerification';

// Constants and Utilities
import {
  AUTH_TABS,
  LOGIN_METHODS,
  FORM_STEPS,
  OTP_TYPES,
  ROUTES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
} from './constants';
import {
  LAYOUT_STYLES,
  HEADER_STYLES,
  CARD_STYLES,
  TAB_STYLES,
  FORM_STYLES,
  MESSAGE_STYLES,
  getTabClasses
} from './styles';
import {
  validateSignInForm,
  validateSignUpForm,
  validateLinkAccountForm,
  hasValidationErrors
} from './utils/validation';

// ============================================================================
// INITIAL FORM STATES
// ============================================================================

/** Initial state for sign-in form */
const INITIAL_SIGNIN_FORM = {
  email: '',
  workerId: '',
  phoneNumber: ''
};

/** Initial state for sign-up form */
const INITIAL_SIGNUP_FORM = {
  email: '',
  password: '',
  confirmPassword: '',
  fullName: '',
  phoneNumber: ''
};

/** Initial state for link account form */
const INITIAL_LINK_FORM = {
  workerId: '',
  phoneNumber: ''
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * AuthPage Component
 * 
 * A comprehensive authentication page that supports:
 * - Email-based sign-in with OTP verification
 * - Worker ID + Phone number authentication
 * - New user registration with email verification
 * - Account linking for existing worker records
 * 
 * @component
 * @example
 * return (
 *   <Route path="/auth" element={<AuthPage />} />
 * )
 */
const AuthPage = () => {
  // ============================================================================
  // HOOKS AND NAVIGATION
  // ============================================================================

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    signUpWithOTP,
    signIn,
    signInWithOTP,
    signInWithWorkerCredentials,
    linkWorkerAccount,
    user,
    loading
  } = useAuth();

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  /** Current active tab (signin/signup) */
  const [activeTab, setActiveTab] = useState(AUTH_TABS.SIGNIN);
  
  /** Current login method (email/worker) */
  const [loginMethod, setLoginMethod] = useState(LOGIN_METHODS.EMAIL);
  
  /** Current form step (form/otp) */
  const [currentStep, setCurrentStep] = useState(FORM_STEPS.FORM);
  
  /** Form submission state */
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  /** Validation errors */
  const [errors, setErrors] = useState({});
  
  /** Success/info messages */
  const [message, setMessage] = useState('');
  
  /** Show account linking section */
  const [showLinkAccount, setShowLinkAccount] = useState(false);
  
  /** Email for OTP verification */
  const [otpEmail, setOtpEmail] = useState('');
  
  /** Type of OTP verification */
  const [otpType, setOtpType] = useState(OTP_TYPES.SIGNUP);

  // ============================================================================
  // FORM STATES
  // ============================================================================

  /** Sign-in form data */
  const [signInForm, setSignInForm] = useState(INITIAL_SIGNIN_FORM);

  /** Sign-up form data */
  const [signUpForm, setSignUpForm] = useState(INITIAL_SIGNUP_FORM);

  /** Link account form data */
  const [linkForm, setLinkForm] = useState(INITIAL_LINK_FORM);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  /**
   * Redirect authenticated users to dashboard
   */
  useEffect(() => {
    if (user && !loading) {
      const redirect = searchParams.get('redirect') || ROUTES.DASHBOARD;
      navigate(redirect);
    }
  }, [user, loading, navigate, searchParams]);

  /**
   * Set initial tab from URL parameters
   */
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === AUTH_TABS.SIGNUP || tab === AUTH_TABS.SIGNIN) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  /**
   * Clears all error messages and success messages
   */
  const clearMessages = useCallback(() => {
    setErrors({});
    setMessage('');
  }, []);

  /**
   * Handles authentication error messages
   * @param {Error|Object} error - The error object
   * @returns {string} Formatted error message
   */
  const getErrorMessage = useCallback((error) => {
    if (error.message?.includes('User not found')) {
      return ERROR_MESSAGES.USER_NOT_FOUND;
    }
    if (error.message?.includes('User already registered')) {
      return ERROR_MESSAGES.ACCOUNT_EXISTS;
    }
    return error.message || ERROR_MESSAGES.UNEXPECTED_ERROR;
  }, []);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Handles tab switching between signin and signup
   * @param {string} tab - The tab to switch to
   */
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setCurrentStep(FORM_STEPS.FORM);
    clearMessages();
    
    // Update URL without page refresh
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', tab);
    navigate(`/auth?${newParams.toString()}`, { replace: true });
  }, [searchParams, navigate, clearMessages]);

  /**
   * Handles returning from OTP verification to form
   */
  const handleBackToForm = useCallback(() => {
    setCurrentStep(FORM_STEPS.FORM);
    setOtpEmail('');
    clearMessages();
  }, [clearMessages]);

  /**
   * Validates the sign-in form based on current login method
   * @returns {boolean} True if form is valid, false otherwise
   */
  const validateSignIn = useCallback(() => {
    const validationErrors = validateSignInForm(signInForm, loginMethod);
    setErrors(validationErrors);
    return !hasValidationErrors(validationErrors);
  }, [signInForm, loginMethod]);

  /**
   * Validates the sign-up form
   * @returns {boolean} True if form is valid, false otherwise
   */
  const validateSignUp = useCallback(() => {
    const validationErrors = validateSignUpForm(signUpForm);
    setErrors(validationErrors);
    return !hasValidationErrors(validationErrors);
  }, [signUpForm]);

  /**
   * Validates the link account form
   * @returns {boolean} True if form is valid, false otherwise
   */
  const validateLinkAccount = useCallback(() => {
    const validationErrors = validateLinkAccountForm(linkForm);
    setErrors(validationErrors);
    return !hasValidationErrors(validationErrors);
  }, [linkForm]);

  /**
   * Handles sign-in form submission
   * @param {Event} e - Form submit event
   */
  const handleSignIn = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateSignIn()) return;
    
    setIsSubmitting(true);
    clearMessages();

    try {
      if (loginMethod === LOGIN_METHODS.EMAIL) {
        // Send OTP to email for signin
        const { data, error } = await signInWithOTP(signInForm.email);
        
        if (error) {
          setErrors({ general: getErrorMessage(error) });
          return;
        }

        // Show OTP verification screen
        setOtpEmail(signInForm.email);
        setOtpType(OTP_TYPES.EMAIL);
        setCurrentStep(FORM_STEPS.OTP);
        
      } else {
        // Worker ID + Phone signin
        const { data, error } = await signInWithWorkerCredentials(
          signInForm.workerId,
          signInForm.phoneNumber
        );
        
        if (error) {
          setErrors({ general: getErrorMessage(error) });
          return;
        }

        if (data?.email) {
          // OTP sent to worker's email
          setOtpEmail(data.email);
          setOtpType(OTP_TYPES.EMAIL);
          setCurrentStep(FORM_STEPS.OTP);
          setMessage(`Verification code sent to ${data.email}`);
        }
      }
    } catch (error) {
      setErrors({ general: getErrorMessage(error) });
    } finally {
      setIsSubmitting(false);
    }
  }, [signInForm, loginMethod, validateSignIn, clearMessages, getErrorMessage, signInWithOTP, signInWithWorkerCredentials]);

  /**
   * Handles sign-up form submission
   * @param {Event} e - Form submit event
   */
  const handleSignUp = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateSignUp()) return;
    
    setIsSubmitting(true);
    clearMessages();

    try {
      const { data, error } = await signUpWithOTP(
        signUpForm.email,
        signUpForm.password,
        signUpForm.fullName,
        signUpForm.phoneNumber
      );

      if (error) {
        setErrors({ general: getErrorMessage(error) });
        return;
      }

      if (data?.user) {
        // Show OTP verification screen
        setOtpEmail(signUpForm.email);
        setOtpType(OTP_TYPES.SIGNUP);
        setCurrentStep(FORM_STEPS.OTP);
        setMessage(SUCCESS_MESSAGES.CODE_SENT);
      }
    } catch (error) {
      setErrors({ general: getErrorMessage(error) });
    } finally {
      setIsSubmitting(false);
    }
  }, [signUpForm, validateSignUp, clearMessages, getErrorMessage, signUpWithOTP]);

  /**
   * Handles worker account linking
   */
  const handleLinkAccount = useCallback(async () => {
    if (!validateLinkAccount()) return;
    
    setIsSubmitting(true);
    clearMessages();

    try {
      const { success, error } = await linkWorkerAccount(
        linkForm.workerId,
        linkForm.phoneNumber
      );

      if (error) {
        setErrors({ general: getErrorMessage(error) });
      } else if (success) {
        setMessage(SUCCESS_MESSAGES.ACCOUNT_LINKED);
        setShowLinkAccount(false);
        navigate(ROUTES.DASHBOARD);
      }
    } catch (error) {
      setErrors({ general: getErrorMessage(error) });
    } finally {
      setIsSubmitting(false);
    }
  }, [linkForm, validateLinkAccount, clearMessages, getErrorMessage, linkWorkerAccount, navigate]);

  // ============================================================================
  // LOADING STATE
  // ============================================================================

  if (loading) {
    return (
      <div className={LAYOUT_STYLES.PAGE_CONTAINER}>
        <div className="flex items-center justify-center min-h-screen">
          <Icon name="Loader" size={32} className="text-primary animate-spin" />
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <>
      <Helmet>
        <title>Sign In / Sign Up - JeevanID</title>
        <meta name="description" content="Sign in to your JeevanID account or create a new account to manage your health records." />
      </Helmet>
      
      <div className={LAYOUT_STYLES.PAGE_CONTAINER}>
        <Header />
        
        <main className={LAYOUT_STYLES.MAIN_CONTENT}>
          <div className={LAYOUT_STYLES.CONTENT_WRAPPER}>
            <div className={LAYOUT_STYLES.FORM_CONTAINER}>
              
              {/* Page Header */}
              <div className={HEADER_STYLES.CONTAINER}>
                <div className={HEADER_STYLES.ICON_WRAPPER}>
                  <Icon name="Shield" size={32} color="white" />
                </div>
                <h1 className={HEADER_STYLES.TITLE}>Welcome to JeevanID</h1>
                <p className={HEADER_STYLES.SUBTITLE}>
                  Secure access to your health records
                </p>
              </div>

              {/* Auth Card */}
              <div className={CARD_STYLES.MAIN_CARD}>
                
                {currentStep === FORM_STEPS.OTP ? (
                  <OTPVerification 
                    email={otpEmail}
                    type={otpType}
                    onBack={handleBackToForm}
                    onSuccess={() => {
                      const redirect = searchParams.get('redirect') || ROUTES.DASHBOARD;
                      navigate(redirect);
                    }}
                  />
                ) : (
                  <>
                    {/* Tabs */}
                    <div className={TAB_STYLES.CONTAINER}>
                      <button
                        onClick={() => handleTabChange(AUTH_TABS.SIGNIN)}
                        className={getTabClasses(activeTab === AUTH_TABS.SIGNIN)}
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => handleTabChange(AUTH_TABS.SIGNUP)}
                        className={getTabClasses(activeTab === AUTH_TABS.SIGNUP)}
                      >
                        Sign Up
                      </button>
                    </div>

                {/* Messages */}
                {message && (
                  <div className={MESSAGE_STYLES.SUCCESS}>
                    <p className={MESSAGE_STYLES.SUCCESS_TEXT}>{message}</p>
                  </div>
                )}

                {errors.general && (
                  <div className={MESSAGE_STYLES.ERROR}>
                    <p className={MESSAGE_STYLES.ERROR_TEXT}>{errors.general}</p>
                  </div>
                )}

                {/* Sign In Form */}
                {activeTab === AUTH_TABS.SIGNIN && (
                  <form onSubmit={handleSignIn} className={FORM_STYLES.CONTAINER}>
                    
                    {/* Login Method Toggle */}
                    <div className={FORM_STYLES.RADIO_GROUP}>
                      <label className="text-sm font-medium text-foreground">Login Method</label>
                      <div className={FORM_STYLES.RADIO_WRAPPER}>
                        <label className={FORM_STYLES.RADIO_OPTION}>
                          <input
                            type="radio"
                            name="loginMethod"
                            value={LOGIN_METHODS.EMAIL}
                            checked={loginMethod === LOGIN_METHODS.EMAIL}
                            onChange={(e) => setLoginMethod(e.target.value)}
                            className="mr-2"
                          />
                          <span className="text-sm">Email & Password</span>
                        </label>
                        <label className={FORM_STYLES.RADIO_OPTION}>
                          <input
                            type="radio"
                            name="loginMethod"
                            value={LOGIN_METHODS.WORKER}
                            checked={loginMethod === LOGIN_METHODS.WORKER}
                            onChange={(e) => setLoginMethod(e.target.value)}
                            className="mr-2"
                          />
                          <span className="text-sm">Worker ID & Phone</span>
                        </label>
                      </div>
                    </div>

                    {/* Email Field */}
                    {loginMethod === LOGIN_METHODS.EMAIL && (
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
                    {loginMethod === LOGIN_METHODS.WORKER && (
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
                      iconName={loginMethod === LOGIN_METHODS.EMAIL ? 'Mail' : 'LogIn'}
                      iconPosition="left"
                    >
                      {isSubmitting 
                        ? (loginMethod === LOGIN_METHODS.EMAIL ? 'Sending Code...' : 'Validating...') 
                        : (loginMethod === LOGIN_METHODS.EMAIL ? 'Send Code' : 'Continue')}
                    </Button>
                  </form>
                )}

                {/* Sign Up Form */}
                {activeTab === AUTH_TABS.SIGNUP && (
                  <form onSubmit={handleSignUp} className={FORM_STYLES.CONTAINER}>
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
                  <div className={FORM_STYLES.DIVIDER}>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Link Your Health Record</h3>
                    
                    <div className={FORM_STYLES.CONTAINER}>
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
                    onClick={() => navigate(ROUTES.PERSONAL_HEALTH_RECORD)}
                    className={BUTTON_STYLES.FOOTER_LINK}
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