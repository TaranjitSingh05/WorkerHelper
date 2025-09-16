import { createClient } from '@supabase/supabase-js';

// Get Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug: Log environment variables (remove in production)
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key exists:', !!supabaseAnonKey);
console.log('Anon Key length:', supabaseAnonKey?.length);

// Validate that environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  console.error('URL:', supabaseUrl);
  console.error('Key exists:', !!supabaseAnonKey);
  throw new Error('Supabase URL and Anon Key must be provided in environment variables');
}

// Create and export Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// Helper function to generate unique Worker Health ID
export const generateWorkerHealthId = () => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `WH-${timestamp}-${randomPart}`.toUpperCase();
};

// Helper function to generate consistent Worker Health ID from user ID
export const generateConsistentWorkerHealthId = (userId) => {
  if (!userId) {
    // For anonymous users, generate random ID
    return generateWorkerHealthId();
  }
  
  // Create a hash-like ID from user ID for consistency
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert to positive number and pad with zeros
  const hashStr = Math.abs(hash).toString().padStart(8, '0');
  const userPrefix = userId.substring(0, 4).toUpperCase().replace(/[^A-Z0-9]/g, 'X');
  
  return `WH-${userPrefix}-${hashStr}`;
};

// Helper function to generate QR code data URL
export const generateQRCodeDataURL = async (data) => {
  // QRCode.react component will handle the generation
  // This function returns the data to be encoded
  return data;
};