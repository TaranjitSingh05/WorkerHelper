import React from "react";
import { ClerkProvider } from '@clerk/clerk-react';
import { ClerkAuthProvider } from "./contexts/ClerkAuthContext";
import Routes from "./Routes";

// Get Clerk publishable key from environment variables
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error('Missing Clerk Publishable Key');
}

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <ClerkAuthProvider>
        <Routes />
      </ClerkAuthProvider>
    </ClerkProvider>
  );
}

export default App;
