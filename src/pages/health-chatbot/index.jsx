import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import HealthChatbot from '../../components/HealthChatbot';
import Icon from '../../components/AppIcon';

const HealthChatbotPage = () => {
  return (
    <>
      <Helmet>
        <title>AI Health Assistant - JeevanID</title>
        <meta name="description" content="Get instant medical guidance from our AI health assistant. Ask questions about symptoms, medications, first aid, and workplace health in multiple languages with voice support." />
        <meta name="keywords" content="AI health assistant, medical chatbot, health questions, symptoms checker, medical guidance, worker health" />
        <meta property="og:title" content="AI Health Assistant - JeevanID" />
        <meta property="og:description" content="Get instant medical guidance from our AI health assistant with voice support in multiple languages." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Health Assistant - JeevanID" />
        <meta name="twitter:description" content="Get instant medical guidance from our AI health assistant with voice support in multiple languages." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4 lg:px-8">
            
            {/* Page Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="Bot" size={24} className="text-white" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">AI Health Assistant</h1>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get instant medical guidance and health information from our AI assistant. 
                Ask questions in your preferred language using text or voice input.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-card rounded-lg border border-border p-6 text-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon name="MessageSquare" size={20} className="text-blue-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Smart Conversations</h3>
                <p className="text-sm text-muted-foreground">
                  Natural language conversations about your health concerns with contextual understanding
                </p>
              </div>
              
              <div className="bg-card rounded-lg border border-border p-6 text-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon name="Mic" size={20} className="text-green-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Voice Support</h3>
                <p className="text-sm text-muted-foreground">
                  Speak your questions and listen to responses in multiple Indian languages
                </p>
              </div>
              
              <div className="bg-card rounded-lg border border-border p-6 text-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon name="Shield" size={20} className="text-purple-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Medical Safety</h3>
                <p className="text-sm text-muted-foreground">
                  Built-in emergency detection and safety guidelines for responsible health guidance
                </p>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
              <div className="flex items-start space-x-3">
                <Icon name="AlertTriangle" size={20} className="text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">Important Medical Disclaimer</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    This AI assistant provides general health information and guidance only. 
                    It does not replace professional medical advice, diagnosis, or treatment. 
                    Always consult with qualified healthcare professionals for medical concerns.
                  </p>
                </div>
              </div>
            </div>

            {/* Chatbot Component */}
            <div className="max-w-4xl mx-auto">
              <HealthChatbot />
            </div>

            {/* Help Section */}
            <div className="max-w-4xl mx-auto mt-8">
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
                  <Icon name="HelpCircle" size={20} className="text-primary" />
                  <span>How to Use the Health Assistant</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">What You Can Ask:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Symptoms and their possible causes</li>
                      <li>• First aid and emergency procedures</li>
                      <li>• Medication information and side effects</li>
                      <li>• Workplace health and safety tips</li>
                      <li>• Preventive care and healthy lifestyle</li>
                      <li>• Mental health support and resources</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Voice Features:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Click the microphone to speak your question</li>
                      <li>• Choose your preferred language from the dropdown</li>
                      <li>• Toggle voice responses on/off</li>
                      <li>• Stop speaking responses anytime</li>
                      <li>• Works in 10+ Indian and international languages</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2 flex items-center space-x-2">
                    <Icon name="AlertCircle" size={16} className="text-red-600" />
                    <span>Emergency Situations</span>
                  </h4>
                  <p className="text-sm text-red-700">
                    For medical emergencies, <strong>call emergency services immediately</strong>:
                  </p>
                  <div className="mt-2 text-sm text-red-700">
                    <strong>India:</strong> 108 (Medical Emergency) | <strong>US/Canada:</strong> 911 | <strong>UK:</strong> 999
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-card border-t border-border py-8">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} JeevanID. All rights reserved.</p>
              <p className="mt-2">
                AI-powered health assistance for worker well-being and safety
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HealthChatbotPage;