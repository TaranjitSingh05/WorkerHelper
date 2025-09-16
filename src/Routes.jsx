import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/ProtectedRoute";
import DoctorProtectedRoute from "components/DoctorProtectedRoute/index";
import NotFound from "pages/NotFound";
import PredictiveRiskAssessment from './pages/predictive-risk-assessment';
import HealthCentersLocator from './pages/health-centers-locator';
import PersonalHealthRecord from './pages/personal-health-record';
import AboutUsPage from './pages/about-us';
import Homepage from './pages/homepage';
import WorkerDetails from './pages/worker-details';
import ClerkAuthPage from './pages/auth/ClerkAuthPage';
import Dashboard from './pages/dashboard';
import DoctorDashboard from './pages/doctor-dashboard';
import WorkerProfile from './pages/worker-profile';
import FloatingHealthChatbot from './components/FloatingHealthChatbot';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <FloatingHealthChatbot />
      <RouterRoutes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/homepage" replace />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/auth" element={<ClerkAuthPage />} />
        <Route path="/worker/:health_id" element={<WorkerDetails />} />
        
        {/* Protected Routes - Require Authentication */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/personal-health-record" element={<ProtectedRoute><PersonalHealthRecord /></ProtectedRoute>} />
        <Route path="/predictive-risk-assessment" element={<ProtectedRoute><PredictiveRiskAssessment /></ProtectedRoute>} />
        <Route path="/health-centers-locator" element={<ProtectedRoute><HealthCentersLocator /></ProtectedRoute>} />
        
        {/* Doctor Protected Routes - Require Doctor Role */}
        <Route path="/doctor/dashboard" element={<DoctorProtectedRoute><DoctorDashboard /></DoctorProtectedRoute>} />
        <Route path="/doctor/worker/:workerId" element={<DoctorProtectedRoute><WorkerProfile /></DoctorProtectedRoute>} />
        
        {/* Catch all route */}
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
