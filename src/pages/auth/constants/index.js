/**
 * @fileoverview Authentication constants and configuration
 * @author JeevanID Team
 * @version 1.0.0
 */

// ============================================================================
// AUTHENTICATION CONSTANTS
// ============================================================================

/**
 * Available authentication tabs
 * @readonly
 * @enum {string}
 */
export const AUTH_TABS = {
  SIGNIN: 'signin',
  SIGNUP: 'signup'
};

/**
 * Login method types
 * @readonly
 * @enum {string}
 */
export const LOGIN_METHODS = {
  EMAIL: 'email',
  WORKER: 'worker'
};

/**
 * Form step types
 * @readonly
 * @enum {string}
 */
export const FORM_STEPS = {
  FORM: 'form',
  OTP: 'otp'
};

/**
 * OTP verification types
 * @readonly
 * @enum {string}
 */
export const OTP_TYPES = {
  SIGNUP: 'signup',
  EMAIL: 'email'
};

// ============================================================================
// VALIDATION CONSTANTS
// ============================================================================

/**
 * Form validation patterns and limits
 * @readonly
 */
export const VALIDATION = {
  EMAIL_PATTERN: /\S+@\S+\.\S+/,
  PHONE_PATTERN: /^\d{10}$/,
  MIN_PASSWORD_LENGTH: 6,
  OTP_LENGTH: 6,
  OTP_EXPIRY_TIME: 300 // 5 minutes in seconds
};

// ============================================================================
// UI CONSTANTS
// ============================================================================

/**
 * Default redirect paths
 * @readonly
 */
export const ROUTES = {
  DASHBOARD: '/dashboard',
  PERSONAL_HEALTH_RECORD: '/personal-health-record'
};

/**
 * Message types for user feedback
 * @readonly
 * @enum {string}
 */
export const MESSAGE_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning'
};

// ============================================================================
// ERROR MESSAGES
// ============================================================================

/**
 * Standard error messages for consistent user experience
 * @readonly
 */
export const ERROR_MESSAGES = {
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Please enter a valid email',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_MIN_LENGTH: `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`,
  PASSWORD_CONFIRM_REQUIRED: 'Please confirm your password',
  PASSWORD_MISMATCH: 'Passwords do not match',
  FULLNAME_REQUIRED: 'Full name is required',
  PHONE_REQUIRED: 'Phone number is required',
  PHONE_INVALID: 'Please enter a valid 10-digit phone number',
  WORKER_ID_REQUIRED: 'Worker ID is required',
  OTP_REQUIRED: 'Please enter all 6 digits',
  OTP_EXPIRED: 'Verification code has expired. Please request a new one.',
  OTP_INVALID: 'Invalid verification code. Please try again.',
  UNEXPECTED_ERROR: 'An unexpected error occurred',
  VERIFICATION_FAILED: 'Verification failed. Please try again.',
  RESEND_FAILED: 'Failed to resend code. Please try again.',
  ACCOUNT_EXISTS: 'An account with this email already exists',
  USER_NOT_FOUND: 'No account found with this email address',
  LINK_ACCOUNT_REQUIRED: 'Please enter both Worker ID and Phone Number'
};

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================

/**
 * Standard success messages
 * @readonly
 */
export const SUCCESS_MESSAGES = {
  CODE_SENT: 'Verification code sent to your email',
  ACCOUNT_LINKED: 'Worker account linked successfully! You can now access your dashboard.',
  ACCOUNT_LINKED_REDIRECT: 'Worker account linked successfully! Redirecting to dashboard...'
};