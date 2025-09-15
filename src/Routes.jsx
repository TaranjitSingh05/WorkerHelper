import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import PredictiveRiskAssessment from './pages/predictive-risk-assessment';
import HealthCentersLocator from './pages/health-centers-locator';
import PersonalHealthRecord from './pages/personal-health-record';
import HealthTrends from './pages/health-trends';
import AboutUsPage from './pages/about-us';
import Homepage from './pages/homepage';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<AboutUsPage />} />
        <Route path="/predictive-risk-assessment" element={<PredictiveRiskAssessment />} />
        <Route path="/health-centers-locator" element={<HealthCentersLocator />} />
        <Route path="/personal-health-record" element={<PersonalHealthRecord />} />
        <Route path="/health-trends" element={<HealthTrends />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
