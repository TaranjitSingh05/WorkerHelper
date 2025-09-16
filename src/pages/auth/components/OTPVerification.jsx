/**
 * @fileoverview OTP Verification Component
 * @description Handles OTP verification for email authentication
 * @author JeevanID Team
 * @version 1.0.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// UI Components
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

// Context and Hooks
import { useAuth } from '../../../contexts/AuthContext';

// Constants and Utilities
import {
  VALIDATION,
  ERROR_MESSAGES,
  ROUTES
} from '../constants';
import {
  HEADER_STYLES,
  OTP_STYLES,
  MESSAGE_STYLES,
  BUTTON_STYLES,
  getOTPInputClasses,
  getResendButtonClasses
} from '../styles';
import {
  formatTime,
  validateOTP,
  isOTPComplete
} from '../utils/validation';

// ============================================================================
// PROP TYPES AND INTERFACES
// ============================================================================

/**
 * OTPVerification Component Props
 * @typedef {Object} OTPVerificationProps
 * @property {string} email - Email address for OTP verification
 * @property {string} [type='signup'] - Type of verification (signup/email)
 * @property {Function} [onBack] - Callback for back button
 * @property {Function} [onSuccess] - Callback for successful verification
 */

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * OTPVerification Component
 * 
 * Provides a user-friendly OTP verification interface with:
 * - Auto-focus and navigation between input fields
 * - Auto-submission when all fields are filled
 * - Countdown timer and resend functionality
 * - Clipboard paste support
 * - Comprehensive error handling
 * 
 * @component
 * @param {OTPVerificationProps} props - Component props
 * @example
 * return (
 *   <OTPVerification
 *     email="user@example.com"
 *     type="signup"
 *     onBack={() => setStep('form')}
 *     onSuccess={(data) => navigate('/dashboard')}
 *   />
 * )
 */
const OTPVerification = ({ email, type = 'signup', onBack, onSuccess }) => {
  // ============================================================================
  // HOOKS AND NAVIGATION
  // ============================================================================

  const navigate = useNavigate();
  const { verifyOTP, signInWithOTP, loading } = useAuth();
  
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  /** OTP digits array */
  const [otp, setOtp] = useState(Array(VALIDATION.OTP_LENGTH).fill(''));
  
  /** Error message */
  const [error, setError] = useState('');
  
  /** Form submission state */
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  /** Countdown timer in seconds */
  const [timeLeft, setTimeLeft] = useState(VALIDATION.OTP_EXPIRY_TIME);
  
  /** Whether resend is available */
  const [canResend, setCanResend] = useState(false);
  
  /** Input field references */
  const inputRefs = useRef([]);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  /**
   * Focus first input on component mount
   */
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  /**
   * Countdown timer effect
   */
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Handles OTP input field changes
   * @param {number} index - Index of the input field
   * @param {string} value - New value
   */
  const handleInputChange = useCallback((index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < VALIDATION.OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (isOTPComplete(newOtp)) {
      handleSubmit(newOtp.join(''));
    }
  }, [otp]);

  /**
   * Handles keyboard navigation in OTP inputs
   * @param {number} index - Index of the input field
   * @param {KeyboardEvent} e - Keyboard event
   */
  const handleKeyDown = useCallback((index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < VALIDATION.OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [otp]);

  /**
   * Handles paste events for OTP input
   * @param {ClipboardEvent} e - Clipboard event
   */
  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, VALIDATION.OTP_LENGTH);
    
    if (digits.length === VALIDATION.OTP_LENGTH) {
      const newOtp = digits.split('');
      setOtp(newOtp);
      setError('');
      // Auto-submit
      handleSubmit(digits);
    }
  }, []);

  /**
   * Handles OTP submission and verification
   * @param {string|null} otpCode - OTP code to verify
   */
  const handleSubmit = useCallback(async (otpCode = null) => {
    const code = otpCode || otp.join('');
    
    const validationError = validateOTP(code);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const { data, error } = await verifyOTP(email, code, type);

      if (error) {
        if (error.message?.includes('expired')) {
          setError(ERROR_MESSAGES.OTP_EXPIRED);
        } else if (error.message?.includes('invalid')) {
          setError(ERROR_MESSAGES.OTP_INVALID);
        } else {
          setError(error.message || ERROR_MESSAGES.VERIFICATION_FAILED);
        }
        
        // Clear OTP on error and focus first input
        setOtp(Array(VALIDATION.OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
        return;
      }

      if (data?.user) {
        if (onSuccess) {
          onSuccess(data);
        } else {
          // Default success behavior - redirect to dashboard
          navigate(ROUTES.DASHBOARD);
        }
      }
    } catch (error) {
      setError(error.message || ERROR_MESSAGES.VERIFICATION_FAILED);
      setOtp(Array(VALIDATION.OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setIsSubmitting(false);
    }
  }, [otp, email, type, verifyOTP, onSuccess, navigate]);

  /**
   * Handles OTP resend functionality
   */
  const handleResend = useCallback(async () => {
    if (!canResend) return;

    setIsSubmitting(true);
    setError('');

    try {
      const { error } = await signInWithOTP(email);

      if (error) {
        setError(ERROR_MESSAGES.RESEND_FAILED);
      } else {
        setTimeLeft(VALIDATION.OTP_EXPIRY_TIME); // Reset timer
        setCanResend(false);
        setOtp(Array(VALIDATION.OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      setError(ERROR_MESSAGES.RESEND_FAILED);
    } finally {
      setIsSubmitting(false);
    }
  }, [canResend, email, signInWithOTP]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className={HEADER_STYLES.CONTAINER}>
        <div className={HEADER_STYLES.ICON_WRAPPER}>
          <Icon name="Mail" size={32} color="white" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Verify Your Email
        </h1>
        <p className="text-muted-foreground text-sm">
          We've sent a 6-digit verification code to
        </p>
        <p className="text-foreground font-medium">{email}</p>
      </div>

      {/* OTP Input */}
      <div className="mb-6">
        <div className={OTP_STYLES.CONTAINER}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className={getOTPInputClasses(!!digit)}
              disabled={isSubmitting}
            />
          ))}
        </div>

        {/* Timer */}
        <div className={timeLeft > 0 ? OTP_STYLES.TIMER_TEXT : OTP_STYLES.EXPIRED_TEXT}>
          {timeLeft > 0 ? (
            <span>Code expires in {formatTime(timeLeft)}</span>
          ) : (
            <span>Verification code has expired</span>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className={MESSAGE_STYLES.ERROR}>
          <p className={MESSAGE_STYLES.ERROR_TEXT}>{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-5">
        {/* Submit Button */}
        <Button
          onClick={() => handleSubmit()}
          variant="default"
          size="lg"
          loading={isSubmitting}
          disabled={!isOTPComplete(otp)}
          fullWidth
          iconName="Check"
          iconPosition="left"
        >
          {isSubmitting ? 'Verifying...' : 'Verify Code'}
        </Button>

        {/* Resend Button */}
        <div className="text-center">
          <button
            onClick={handleResend}
            disabled={!canResend || isSubmitting}
            className={getResendButtonClasses(canResend)}
          >
            {canResend ? 'Resend verification code' : `Resend code (${formatTime(timeLeft)})`}
          </button>
        </div>

        {/* Back Button */}
        {onBack && (
          <div className="text-center">
            <button
              onClick={onBack}
              disabled={isSubmitting}
              className={BUTTON_STYLES.BACK_BUTTON}
            >
              ← Back to sign {type === 'signup' ? 'up' : 'in'}
            </button>
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className={MESSAGE_STYLES.HELP_CONTAINER}>
        <h4 className={MESSAGE_STYLES.HELP_TITLE}>Didn't receive the code?</h4>
        <div className={MESSAGE_STYLES.HELP_TEXT}>
          <p>• Check your spam/junk folder</p>
          <p>• Make sure {email} is correct</p>
          <p>• Wait a few minutes for delivery</p>
          <p>• Use the resend option above</p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;