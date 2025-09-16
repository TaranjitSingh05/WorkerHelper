import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [workerData, setWorkerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setSession(session);
          setUser(session?.user || null);
          if (session?.user) {
            await fetchWorkerData(session.user.id);
          }
        }
      } catch (error) {
        console.error('Error in getSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          await fetchWorkerData(session.user.id);
        } else {
          setWorkerData(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchWorkerData = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('workers_data')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') { // Not "no rows returned"
          console.error('Error fetching worker data:', error);
        }
        setWorkerData(null);
      } else {
        setWorkerData(data);
      }
    } catch (error) {
      console.error('Error in fetchWorkerData:', error);
      setWorkerData(null);
    }
  };

  const signUp = async (email, password, metadata = {}) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in signUp:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signUpWithOTP = async (email, password, fullName, phoneNumber) => {
    try {
      setLoading(true);
      
      // First create the user account
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone_number: phoneNumber
          }
        }
      });

      if (error) {
        throw error;
      }

      if (data.user && !data.user.email_confirmed_at) {
        // Send OTP to email for verification
        const { error: otpError } = await supabase.auth.signInWithOtp({
          email: email,
          options: {
            shouldCreateUser: false
          }
        });

        if (otpError) {
          console.error('Error sending OTP:', otpError);
          // Don't throw here, user is created but OTP failed
        }
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in signUpWithOTP:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in signIn:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signInWithOTP = async (email) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: false
        }
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in signInWithOTP:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (email, token, type = 'email') => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: type
      });

      if (error) {
        throw error;
      }

      // If this is a signup verification, create worker profile
      if (data.user && type === 'signup') {
        const userData = data.user.user_metadata;
        if (userData.full_name && userData.phone_number) {
          await supabase.rpc('create_worker_profile_otp', {
            p_user_id: data.user.id,
            p_full_name: userData.full_name,
            p_phone_number: userData.phone_number
          });
        }
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in verifyOTP:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signInWithWorkerCredentials = async (healthId, phoneNumber) => {
    try {
      setLoading(true);
      
      // Validate worker credentials and get user info
      const { data, error } = await supabase
        .rpc('validate_worker_credentials_otp', {
          p_health_id: healthId,
          p_phone_number: phoneNumber
        });

      if (error) {
        throw new Error('Failed to validate worker credentials');
      }

      if (!data || data.length === 0) {
        throw new Error('Invalid Worker ID or Phone Number. Please check your credentials.');
      }

      const workerInfo = data[0];
      
      if (!workerInfo.email || !workerInfo.user_id) {
        throw new Error('This Worker ID is not linked to an account. Please sign up first.');
      }

      // Send OTP to the email associated with this worker
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: workerInfo.email,
        options: {
          shouldCreateUser: false
        }
      });

      if (otpError) {
        throw new Error('Failed to send verification code. Please try again.');
      }

      return { data: { email: workerInfo.email, worker: workerInfo }, error: null };

    } catch (error) {
      console.error('Error in signInWithWorkerCredentials:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const linkWorkerAccount = async (healthId, phoneNumber) => {
    try {
      if (!user) {
        throw new Error('Must be logged in to link worker account');
      }

      const { data, error } = await supabase
        .rpc('link_worker_to_user', {
          p_health_id: healthId,
          p_phone_number: phoneNumber,
          p_user_id: user.id
        });

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error('Worker record not found or already linked to another account');
      }

      // Refresh worker data
      await fetchWorkerData(user.id);
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Error in linkWorkerAccount:', error);
      return { success: false, error };
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      setUser(null);
      setWorkerData(null);
      setSession(null);
      
      return { error: null };
    } catch (error) {
      console.error('Error in signOut:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) {
        throw error;
      }

      return { error: null };
    } catch (error) {
      console.error('Error in resetPassword:', error);
      return { error };
    }
  };

  const updateProfile = async (updates) => {
    try {
      setLoading(true);
      
      // Update auth user metadata if provided
      if (updates.email || updates.password || updates.data) {
        const { error } = await supabase.auth.updateUser({
          email: updates.email,
          password: updates.password,
          data: updates.data
        });

        if (error) {
          throw error;
        }
      }

      // Update worker data if provided
      if (updates.workerData && workerData) {
        const { error } = await supabase
          .from('workers_data')
          .update(updates.workerData)
          .eq('user_id', user.id);

        if (error) {
          throw error;
        }

        // Refresh worker data
        await fetchWorkerData(user.id);
      }

      return { error: null };
    } catch (error) {
      console.error('Error in updateProfile:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    workerData,
    loading,
    signUp,
    signUpWithOTP,
    signIn,
    signInWithOTP,
    signInWithWorkerCredentials,
    verifyOTP,
    linkWorkerAccount,
    signOut,
    resetPassword,
    updateProfile,
    fetchWorkerData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;