import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { useAuth } from '../../../contexts/AuthContext';

const OTPVerification = ({ email, type = 'signup', onBack, onSuccess }) => {
  const navigate = useNavigate();
  const { verifyOTP, signInWithOTP, loading } = useAuth();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    // Countdown timer
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      handleSubmit(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, 6);
    
    if (digits.length === 6) {
      const newOtp = digits.split('');
      setOtp(newOtp);
      setError('');
      // Auto-submit
      handleSubmit(digits);
    }
  };

  const handleSubmit = async (otpCode = null) => {
    const code = otpCode || otp.join('');
    
    if (code.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const { data, error } = await verifyOTP(email, code, type);

      if (error) {
        if (error.message.includes('expired')) {
          setError('Verification code has expired. Please request a new one.');
        } else if (error.message.includes('invalid')) {
          setError('Invalid verification code. Please try again.');
        } else {
          setError(error.message);
        }
        // Clear OTP on error
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        return;
      }

      if (data?.user) {
        if (onSuccess) {
          onSuccess(data);
        } else {
          // Default success behavior - redirect to dashboard
          navigate('/dashboard');
        }
      }
    } catch (error) {
      setError(error.message || 'Verification failed. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setIsSubmitting(true);
    setError('');

    try {
      const { error } = await signInWithOTP(email);

      if (error) {
        setError('Failed to resend code. Please try again.');
      } else {
        setTimeLeft(300); // Reset timer
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
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
        <div className="flex justify-center space-x-3 mb-4">
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
              className={`w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg transition-colors ${
                digit 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              } focus:border-primary focus:outline-none`}
              disabled={isSubmitting}
            />
          ))}
        </div>

        {/* Timer */}
        <div className="text-center text-sm text-muted-foreground">
          {timeLeft > 0 ? (
            <span>Code expires in {formatTime(timeLeft)}</span>
          ) : (
            <span className="text-warning">Verification code has expired</span>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-4">
        {/* Submit Button */}
        <Button
          onClick={() => handleSubmit()}
          variant="default"
          size="lg"
          loading={isSubmitting}
          disabled={otp.join('').length !== 6}
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
            className={`text-sm transition-colors ${
              canResend 
                ? 'text-primary hover:text-primary/80' 
                : 'text-muted-foreground cursor-not-allowed'
            }`}
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
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to sign {type === 'signup' ? 'up' : 'in'}
            </button>
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h4 className="text-sm font-medium text-foreground mb-2">Didn't receive the code?</h4>
        <div className="text-xs text-muted-foreground space-y-1">
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