import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { canAccessDoctorPanel, getUserDisplayName } from '../../utils/roles';
import Button from '../ui/Button';
import Icon from '../AppIcon';

const DoctorProtectedRoute = ({ children }) => {
  const { user, isLoaded, isSignedIn } = useUser();

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader" size={32} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-card rounded-xl border border-border p-8 text-center max-w-md mx-auto">
          <Icon name="Lock" size={48} className="text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Doctor Access Required</h2>
          <p className="text-muted-foreground mb-6">
            Please sign in with your doctor credentials to access the medical panel.
          </p>
          <Button
            variant="default"
            size="lg"
            onClick={() => window.location.href = '/sign-in'}
            iconName="LogIn"
            iconPosition="left"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  // Check if user has doctor access
  if (!canAccessDoctorPanel(user)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-card rounded-xl border border-border p-8 text-center max-w-md mx-auto">
          <Icon name="ShieldAlert" size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-4">
            Hi {getUserDisplayName(user)}, you don't have permission to access the doctor panel.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            This area is restricted to authorized medical professionals only. 
            If you believe this is an error, please contact your administrator.
          </p>
          <div className="space-y-3">
            <Button
              variant="default"
              size="lg"
              onClick={() => window.location.href = '/dashboard'}
              iconName="Home"
              iconPosition="left"
            >
              Go to Dashboard
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = '/'}
              iconName="ArrowLeft"
              iconPosition="left"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated and has doctor access, render children
  return <>{children}</>;
};

export default DoctorProtectedRoute;