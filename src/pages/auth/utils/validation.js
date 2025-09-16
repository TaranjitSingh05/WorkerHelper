/**
 * @fileoverview Authentication form validation utilities
 * @author JeevanID Team
 * @version 1.0.0
 */

import { VALIDATION, ERROR_MESSAGES } from '../constants';

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validates email format and presence
 * @param {string} email - Email to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateEmail = (email) => {
  if (!email?.trim()) {
    return ERROR_MESSAGES.EMAIL_REQUIRED;
  }
  
  if (!VALIDATION.EMAIL_PATTERN.test(email)) {
    return ERROR_MESSAGES.EMAIL_INVALID;
  }
  
  return null;
};

/**
 * Validates password strength and presence
 * @param {string} password - Password to validate
 * @returns {string|null} Error message or null if valid
 */
export const validatePassword = (password) => {
  if (!password) {
    return ERROR_MESSAGES.PASSWORD_REQUIRED;
  }
  
  if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
    return ERROR_MESSAGES.PASSWORD_MIN_LENGTH;
  }
  
  return null;
};

/**
 * Validates password confirmation
 * @param {string} password - Original password
 * @param {string} confirmPassword - Password confirmation
 * @returns {string|null} Error message or null if valid
 */
export const validatePasswordConfirm = (password, confirmPassword) => {
  if (!confirmPassword) {
    return ERROR_MESSAGES.PASSWORD_CONFIRM_REQUIRED;
  }
  
  if (password !== confirmPassword) {
    return ERROR_MESSAGES.PASSWORD_MISMATCH;
  }
  
  return null;
};

/**
 * Validates phone number format
 * @param {string} phoneNumber - Phone number to validate
 * @returns {string|null} Error message or null if valid
 */
export const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber?.trim()) {
    return ERROR_MESSAGES.PHONE_REQUIRED;
  }
  
  const cleanPhone = phoneNumber.replace(/\\D/g, '');
  if (!VALIDATION.PHONE_PATTERN.test(cleanPhone)) {
    return ERROR_MESSAGES.PHONE_INVALID;
  }
  
  return null;
};

/**
 * Validates full name presence
 * @param {string} fullName - Full name to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateFullName = (fullName) => {
  if (!fullName?.trim()) {
    return ERROR_MESSAGES.FULLNAME_REQUIRED;
  }
  
  return null;
};

/**
 * Validates worker ID presence
 * @param {string} workerId - Worker ID to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateWorkerId = (workerId) => {
  if (!workerId?.trim()) {
    return ERROR_MESSAGES.WORKER_ID_REQUIRED;
  }
  
  return null;
};

/**
 * Validates OTP code format
 * @param {string} otp - OTP code to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateOTP = (otp) => {
  if (!otp || otp.length !== VALIDATION.OTP_LENGTH) {
    return ERROR_MESSAGES.OTP_REQUIRED;
  }
  
  return null;
};

// ============================================================================
// FORM VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validates sign-in form data
 * @param {Object} formData - Form data to validate
 * @param {string} formData.email - User email
 * @param {string} formData.workerId - Worker ID
 * @param {string} formData.phoneNumber - Phone number
 * @param {string} loginMethod - Login method ('email' or 'worker')
 * @returns {Object} Validation errors object
 */
export const validateSignInForm = (formData, loginMethod) => {
  const errors = {};
  
  if (loginMethod === 'email') {
    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;
  } else {
    const workerIdError = validateWorkerId(formData.workerId);
    if (workerIdError) errors.workerId = workerIdError;
    
    const phoneError = validatePhoneNumber(formData.phoneNumber);
    if (phoneError) errors.phoneNumber = phoneError;
  }
  
  return errors;
};

/**
 * Validates sign-up form data
 * @param {Object} formData - Form data to validate
 * @param {string} formData.email - User email
 * @param {string} formData.password - User password
 * @param {string} formData.confirmPassword - Password confirmation
 * @param {string} formData.fullName - User full name
 * @param {string} formData.phoneNumber - Phone number
 * @returns {Object} Validation errors object
 */
export const validateSignUpForm = (formData) => {
  const errors = {};
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;
  
  const passwordConfirmError = validatePasswordConfirm(formData.password, formData.confirmPassword);
  if (passwordConfirmError) errors.confirmPassword = passwordConfirmError;
  
  const fullNameError = validateFullName(formData.fullName);
  if (fullNameError) errors.fullName = fullNameError;
  
  const phoneError = validatePhoneNumber(formData.phoneNumber);
  if (phoneError) errors.phoneNumber = phoneError;
  
  return errors;
};

/**
 * Validates link account form data
 * @param {Object} formData - Form data to validate
 * @param {string} formData.workerId - Worker ID
 * @param {string} formData.phoneNumber - Phone number
 * @returns {Object} Validation errors object
 */
export const validateLinkAccountForm = (formData) => {
  const errors = {};
  
  const workerIdError = validateWorkerId(formData.workerId);
  if (workerIdError) errors.workerId = workerIdError;
  
  const phoneError = validatePhoneNumber(formData.phoneNumber);
  if (phoneError) errors.phoneNumber = phoneError;
  
  return errors;
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Checks if validation errors object has any errors
 * @param {Object} errors - Validation errors object
 * @returns {boolean} True if there are errors, false otherwise
 */
export const hasValidationErrors = (errors) => {
  return Object.keys(errors).length > 0;
};

/**
 * Formats time in MM:SS format
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Sanitizes phone number by removing non-digit characters
 * @param {string} phoneNumber - Phone number to sanitize
 * @returns {string} Sanitized phone number
 */
export const sanitizePhoneNumber = (phoneNumber) => {
  return phoneNumber?.replace(/\\D/g, '') || '';
};

/**
 * Checks if OTP is complete (all digits filled)
 * @param {string[]} otpArray - Array of OTP digits
 * @returns {boolean} True if OTP is complete, false otherwise
 */
export const isOTPComplete = (otpArray) => {
  return otpArray.every(digit => digit !== '') && otpArray.join('').length === VALIDATION.OTP_LENGTH;
};