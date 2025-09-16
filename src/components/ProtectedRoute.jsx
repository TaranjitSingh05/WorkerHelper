import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import Icon from './AppIcon';

const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useUser();

  // Show loading while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader" size={32} className="text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to homepage if not signed in
  if (!isSignedIn) {
    return <Navigate to="/homepage" replace />;
  }

  // Render the protected component if signed in
  return children;
};

export default ProtectedRoute;