import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { isDoctor, getDashboardUrl } from '../utils/roles';

const RoleBasedRedirect = ({ children, redirectDoctors = false, redirectWorkers = false }) => {
  const { user, isLoaded } = useUser();

  // Wait for Clerk to load
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is not signed in, let the children component handle it
  if (!user) {
    return children;
  }

  const userIsDoctor = isDoctor(user);
  
  // Redirect doctors away from worker-specific routes
  if (redirectDoctors && userIsDoctor) {
    return <Navigate to="/doctor/dashboard" replace />;
  }

  // Redirect workers away from doctor-specific routes
  if (redirectWorkers && !userIsDoctor) {
    return <Navigate to="/dashboard" replace />;
  }

  // Allow access
  return children;
};

export default RoleBasedRedirect;