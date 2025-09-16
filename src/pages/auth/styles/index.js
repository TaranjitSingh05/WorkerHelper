/**
 * @fileoverview Authentication component styling utilities
 * @author JeevanID Team
 * @version 1.0.0
 */

// ============================================================================
// LAYOUT STYLES
// ============================================================================

/**
 * Main page layout styles
 * @readonly
 */
export const LAYOUT_STYLES = {
  PAGE_CONTAINER: 'min-h-screen bg-gradient-to-b from-background via-muted/30 to-background',
  MAIN_CONTENT: 'pt-20 pb-20',
  CONTENT_WRAPPER: 'container mx-auto px-4 lg:px-8',
  FORM_CONTAINER: 'max-w-md mx-auto'
};

// ============================================================================
// HEADER STYLES
// ============================================================================

/**
 * Header section styling
 * @readonly
 */
export const HEADER_STYLES = {
  CONTAINER: 'text-center mb-10',
  ICON_WRAPPER: 'w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl shadow-lg shadow-primary/20 ring-1 ring-primary/20 flex items-center justify-center mx-auto mb-5',
  TITLE: 'text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2',
  SUBTITLE: 'text-sm md:text-base text-muted-foreground'
};

// ============================================================================
// CARD STYLES
// ============================================================================

/**
 * Card component styling
 * @readonly
 */
export const CARD_STYLES = {
  MAIN_CARD: 'bg-card/90 backdrop-blur-sm rounded-2xl border border-border/60 p-6 md:p-8 shadow-lg shadow-black/5',
  LINK_CARD: 'bg-card/90 backdrop-blur-sm rounded-2xl border border-border/60 p-6 md:p-8 shadow-lg shadow-black/5'
};

// ============================================================================
// TAB STYLES
// ============================================================================

/**
 * Tab navigation styling
 * @readonly
 */
export const TAB_STYLES = {
  CONTAINER: 'flex bg-muted/60 rounded-xl p-1.5 mb-7',
  BUTTON_BASE: 'flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200',
  BUTTON_ACTIVE: 'bg-background text-foreground shadow-sm ring-1 ring-border/70',
  BUTTON_INACTIVE: 'text-muted-foreground hover:text-foreground/90'
};

// ============================================================================
// FORM STYLES
// ============================================================================

/**
 * Form component styling
 * @readonly
 */
export const FORM_STYLES = {
  CONTAINER: 'space-y-5',
  RADIO_GROUP: 'space-y-3',
  RADIO_WRAPPER: 'flex gap-3',
  RADIO_OPTION: 'flex items-center rounded-md border border-border/70 px-3 py-2 cursor-pointer hover:bg-muted/50 transition-colors',
  DIVIDER: 'mt-8 pt-8 border-t border-border/60'
};

// ============================================================================
// MESSAGE STYLES
// ============================================================================

/**
 * Message and alert styling
 * @readonly
 */
export const MESSAGE_STYLES = {
  SUCCESS: 'mb-4 p-3 bg-blue-50/70 border border-blue-200 rounded-lg',
  SUCCESS_TEXT: 'text-sm text-blue-900',
  ERROR: 'mb-4 p-3 bg-red-50/70 border border-red-200 rounded-lg',
  ERROR_TEXT: 'text-sm text-red-900',
  HELP_CONTAINER: 'mt-6 p-4 bg-muted/60 rounded-xl border border-border/40',
  HELP_TITLE: 'text-sm font-medium text-foreground mb-2',
  HELP_TEXT: 'text-xs text-muted-foreground space-y-1'
};

// ============================================================================
// OTP STYLES
// ============================================================================

/**
 * OTP input styling
 * @readonly
 */
export const OTP_STYLES = {
  CONTAINER: 'flex justify-center gap-3 mb-4',
  INPUT_BASE: 'w-12 h-12 text-center text-lg font-semibold border-2 rounded-xl transition-all duration-200',
  INPUT_FILLED: 'border-primary bg-primary/10 shadow-sm ring-1 ring-primary/20',
  INPUT_EMPTY: 'border-border/70 hover:border-primary/50 hover:bg-muted/30',
  INPUT_FOCUS: 'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
  TIMER_TEXT: 'text-center text-sm text-muted-foreground',
  EXPIRED_TEXT: 'text-center text-sm text-warning'
};

// ============================================================================
// BUTTON STYLES
// ============================================================================

/**
 * Button and link styling
 * @readonly
 */
export const BUTTON_STYLES = {
  RESEND_ENABLED: 'text-sm text-primary hover:text-primary/80 transition-colors',
  RESEND_DISABLED: 'text-sm text-muted-foreground cursor-not-allowed',
  BACK_BUTTON: 'text-sm text-muted-foreground hover:text-foreground transition-colors',
  FOOTER_LINK: 'text-primary hover:text-primary/80 transition-colors'
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Combines CSS classes conditionally
 * @param {string} baseClasses - Base CSS classes
 * @param {string} conditionalClasses - Classes to apply conditionally
 * @param {boolean} condition - Condition to check
 * @returns {string} Combined CSS classes
 */
export const combineClasses = (baseClasses, conditionalClasses, condition) => {
  return condition ? `${baseClasses} ${conditionalClasses}` : baseClasses;
};

/**
 * Gets tab button classes based on active state
 * @param {boolean} isActive - Whether the tab is active
 * @returns {string} CSS classes for the tab button
 */
export const getTabClasses = (isActive) => {
  return combineClasses(
    TAB_STYLES.BUTTON_BASE,
    isActive ? TAB_STYLES.BUTTON_ACTIVE : TAB_STYLES.BUTTON_INACTIVE,
    true
  );
};

/**
 * Gets OTP input classes based on state
 * @param {boolean} hasValue - Whether the input has a value
 * @returns {string} CSS classes for the OTP input
 */
export const getOTPInputClasses = (hasValue) => {
  const baseClasses = `${OTP_STYLES.INPUT_BASE} ${OTP_STYLES.INPUT_FOCUS}`;
  const stateClasses = hasValue ? OTP_STYLES.INPUT_FILLED : OTP_STYLES.INPUT_EMPTY;
  return `${baseClasses} ${stateClasses}`;
};

/**
 * Gets resend button classes based on enabled state
 * @param {boolean} isEnabled - Whether the button is enabled
 * @returns {string} CSS classes for the resend button
 */
export const getResendButtonClasses = (isEnabled) => {
  return isEnabled ? BUTTON_STYLES.RESEND_ENABLED : BUTTON_STYLES.RESEND_DISABLED;
};