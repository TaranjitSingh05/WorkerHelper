import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { supabase } from '../utils/supabase';

const ClerkAuthContext = createContext({});

export const useClerkAuth = () => {
  const context = useContext(ClerkAuthContext);
  if (!context) {
    throw new Error('useClerkAuth must be used within a ClerkAuthProvider');
  }
  return context;
};

export const ClerkAuthProvider = ({ children }) => {
  const { user, isLoaded: userLoaded } = useUser();
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const [workerData, setWorkerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      // Wait for Clerk to load
      if (!userLoaded || !authLoaded) {
        return;
      }

      setLoading(true);

      try {
        if (isSignedIn && user) {
          // User is signed in, fetch their worker data
          await fetchWorkerData(user.id);
        } else {
          // User is not signed in
          setWorkerData(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setWorkerData(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [user, isSignedIn, userLoaded, authLoaded]);

  const fetchWorkerData = async (clerkUserId) => {
    try {
      const { data, error } = await supabase
        .from('workers_data')
        .select('*')
        .eq('user_id', clerkUserId)
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

  const createWorkerProfile = async (clerkUserId, profileData) => {
    try {
      // Generate a unique health ID
      const generateHealthId = () => {
        const timestamp = Date.now().toString(36);
        const randomPart = Math.random().toString(36).substring(2, 8);
        return `WH-${timestamp}-${randomPart}`.toUpperCase();
      };

      const healthId = generateHealthId();
      const qrCodeUrl = `${window.location.origin}/worker/${healthId}`;

      const workerDataPayload = {
        user_id: clerkUserId,
        health_id: healthId,
        full_name: profileData.fullName || user?.fullName || '',
        phone_number: profileData.phoneNumber || user?.primaryPhoneNumber?.phoneNumber || '',
        qr_code_data: qrCodeUrl,
        created_at: new Date().toISOString(),
        // Initialize other fields as empty - user can fill them later
        date_of_birth: profileData.dateOfBirth || null,
        age: profileData.age || null,
        gender: profileData.gender || null,
        address: profileData.address || null,
        occupation_type: profileData.occupationType || null,
        contractor_name: profileData.contractorName || null,
        blood_group: profileData.bloodGroup || null,
        allergies: profileData.allergies || null,
        chronic_diseases: profileData.chronicDiseases || null,
        vaccination_status: profileData.vaccinationStatus || null
      };

      const { data, error } = await supabase
        .from('workers_data')
        .insert([workerDataPayload])
        .select()
        .single();

      if (error) {
        console.error('Error creating worker profile:', error);
        throw error;
      }

      setWorkerData(data);
      return { data, error: null };
    } catch (error) {
      console.error('Error in createWorkerProfile:', error);
      return { data: null, error };
    }
  };

  const updateWorkerProfile = async (updates) => {
    try {
      if (!user?.id || !workerData) {
        throw new Error('User must be logged in and have worker data to update');
      }

      const { error } = await supabase
        .from('workers_data')
        .update(updates)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      // Refresh worker data
      await fetchWorkerData(user.id);
      
      return { error: null };
    } catch (error) {
      console.error('Error in updateWorkerProfile:', error);
      return { error };
    }
  };

  const linkWorkerAccount = async (healthId, phoneNumber) => {
    try {
      if (!user?.id) {
        throw new Error('Must be logged in to link worker account');
      }

      // Find worker record by health_id and phone_number
      const { data: workerRecord, error: findError } = await supabase
        .from('workers_data')
        .select('*')
        .eq('health_id', healthId)
        .eq('phone_number', phoneNumber)
        .is('user_id', null) // Only unlinked records
        .single();

      if (findError || !workerRecord) {
        throw new Error('Worker record not found or already linked to another account');
      }

      // Link the record to the current user
      const { error: updateError } = await supabase
        .from('workers_data')
        .update({ 
          user_id: user.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', workerRecord.id);

      if (updateError) {
        throw updateError;
      }

      // Refresh worker data
      await fetchWorkerData(user.id);
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Error in linkWorkerAccount:', error);
      return { success: false, error };
    }
  };

  const value = {
    // Clerk user data
    user,
    isSignedIn,
    loading,
    
    // Worker data from Supabase
    workerData,
    
    // Helper functions
    fetchWorkerData,
    createWorkerProfile,
    updateWorkerProfile,
    linkWorkerAccount
  };

  return (
    <ClerkAuthContext.Provider value={value}>
      {children}
    </ClerkAuthContext.Provider>
  );
};

export default ClerkAuthContext;