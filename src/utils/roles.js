// Role-based authentication utilities for WorkerHelper

// User roles
export const USER_ROLES = {
  WORKER: 'worker',
  DOCTOR: 'doctor',
  ADMIN: 'admin'
};

// Check if user has doctor role
export const isDoctor = (user) => {
  if (!user) return false;
  
  // Check if user has doctor role in Clerk metadata
  const publicMetadata = user.publicMetadata || {};
  const role = publicMetadata.role || USER_ROLES.WORKER; // Default to worker
  
  return role === USER_ROLES.DOCTOR;
};

// Check if user has admin role
export const isAdmin = (user) => {
  if (!user) return false;
  
  const publicMetadata = user.publicMetadata || {};
  const role = publicMetadata.role || USER_ROLES.WORKER;
  
  return role === USER_ROLES.ADMIN;
};

// Check if user has worker role (default)
export const isWorker = (user) => {
  if (!user) return false;
  
  const publicMetadata = user.publicMetadata || {};
  const role = publicMetadata.role || USER_ROLES.WORKER;
  
  return role === USER_ROLES.WORKER;
};

// Get user role
export const getUserRole = (user) => {
  if (!user) return null;
  
  const publicMetadata = user.publicMetadata || {};
  return publicMetadata.role || USER_ROLES.WORKER;
};

// Get user's display name based on role
export const getUserDisplayName = (user) => {
  if (!user) return 'Unknown User';
  
  const role = getUserRole(user);
  const firstName = user.firstName || '';
  const lastName = user.lastName || '';
  const email = user.emailAddresses?.[0]?.emailAddress || '';
  
  const fullName = `${firstName} ${lastName}`.trim();
  
  switch (role) {
    case USER_ROLES.DOCTOR:
      return fullName ? `Dr. ${fullName}` : `Dr. ${email.split('@')[0]}`;
    case USER_ROLES.ADMIN:
      return fullName ? `Admin ${fullName}` : `Admin ${email.split('@')[0]}`;
    default:
      return fullName || email.split('@')[0] || 'User';
  }
};

// Check if user can access doctor panel
export const canAccessDoctorPanel = (user) => {
  return isDoctor(user) || isAdmin(user);
};

// Check if user can access admin panel
export const canAccessAdminPanel = (user) => {
  return isAdmin(user);
};

// Get dashboard URL based on user role
export const getDashboardUrl = (user) => {
  const role = getUserRole(user);
  
  switch (role) {
    case USER_ROLES.DOCTOR:
      return '/doctor/dashboard';
    case USER_ROLES.ADMIN:
      return '/admin/dashboard';
    default:
      return '/dashboard';
  }
};

// Doctor-specific utilities
export const generateReportId = () => {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = now.toTimeString().slice(0, 5).replace(/:/g, '');
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  
  return `MR-${dateStr}-${timeStr}-${random}`;
};

// Validate worker health ID format
export const isValidWorkerHealthId = (healthId) => {
  if (!healthId || typeof healthId !== 'string') return false;
  
  // Check if it matches the format WH-XXXXX-XXXXX
  const healthIdPattern = /^WH-[A-Z0-9]+-[A-Z0-9]+$/i;
  return healthIdPattern.test(healthId);
};

// Medical report utilities
export const REPORT_TYPES = [
  'General Examination',
  'Emergency Visit',
  'Follow-up',
  'Specialist Consultation',
  'Lab Results',
  'Imaging Report',
  'Vaccination Record',
  'Occupational Health',
  'Pre-employment Medical',
  'Fitness Certificate',
  'Other'
];

export const formatReportDate = (date) => {
  if (!date) return 'N/A';
  
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

export const getReportTypeColor = (reportType) => {
  const colors = {
    'General Examination': 'bg-blue-100 text-blue-800',
    'Emergency Visit': 'bg-red-100 text-red-800',
    'Follow-up': 'bg-green-100 text-green-800',
    'Specialist Consultation': 'bg-purple-100 text-purple-800',
    'Lab Results': 'bg-yellow-100 text-yellow-800',
    'Imaging Report': 'bg-indigo-100 text-indigo-800',
    'Vaccination Record': 'bg-teal-100 text-teal-800',
    'Occupational Health': 'bg-orange-100 text-orange-800',
    'Pre-employment Medical': 'bg-cyan-100 text-cyan-800',
    'Fitness Certificate': 'bg-lime-100 text-lime-800',
    'Other': 'bg-gray-100 text-gray-800'
  };
  
  return colors[reportType] || colors['Other'];
};