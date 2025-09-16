import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UserGuideSection = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const guideSteps = [
    {
      id: 1,
      title: "Sign Up / Login",
      subtitle: "Create your account or sign in",
      description: "Click the 'Sign In / Sign Up' button and create your account using email, Google, or Facebook.",
      icon: "UserPlus",
      color: "bg-blue-500",
      image: "📱", // We'll use emojis as placeholder images
      points: [
        "Use your email address",
        "Or sign in with Google/Facebook",
        "Safe and secure registration"
      ]
    },
    {
      id: 2,
      title: "Create Health Record",
      subtitle: "Fill in your personal information",
      description: "Provide your basic details like name, age, blood group, and work information to create your health record.",
      icon: "FileText",
      color: "bg-green-500",
      image: "📋",
      points: [
        "Enter your full name",
        "Add your date of birth",
        "Include blood group and allergies",
        "Add work details"
      ]
    },
    {
      id: 3,
      title: "Get Your QR Code",
      subtitle: "Receive your unique health ID",
      description: "After creating your record, you'll get a unique QR code that healthcare providers can scan.",
      icon: "QrCode",
      color: "bg-purple-500",
      image: "📊",
      points: [
        "Unique QR code generated",
        "Healthcare providers can scan it",
        "Quick access to your health info",
        "Download or share easily"
      ]
    },
    {
      id: 4,
      title: "Use Healthcare Services",
      subtitle: "Show your QR code to doctors",
      description: "At hospitals or clinics, show your QR code to healthcare providers for instant access to your health information.",
      icon: "Heart",
      color: "bg-red-500",
      image: "🏥",
      points: [
        "Show QR code to doctors",
        "Instant health information access",
        "No paperwork needed",
        "Emergency contact available"
      ]
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-6">
            <Icon name="BookOpen" size={32} color="white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How to Use JeevanID
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simple steps to create your digital health record. No reading required - just follow the pictures!
          </p>
        </div>

        {/* Visual Step Guide */}
        <div className="max-w-6xl mx-auto mb-16">
          {/* Step Navigation */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2">
              {guideSteps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    activeStep === index 
                      ? 'bg-primary scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Step ${step.id}`}
                />
              ))}
            </div>
          </div>

          {/* Active Step Display */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Step Content */}
              <div>
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`w-16 h-16 ${guideSteps[activeStep].color} rounded-full flex items-center justify-center`}>
                    <Icon name={guideSteps[activeStep].icon} size={24} color="white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">
                      Step {activeStep + 1} of {guideSteps.length}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {guideSteps[activeStep].title}
                    </h3>
                    <p className="text-gray-600">
                      {guideSteps[activeStep].subtitle}
                    </p>
                  </div>
                </div>

                <p className="text-lg text-gray-700 mb-6">
                  {guideSteps[activeStep].description}
                </p>

                {/* Key Points */}
                <ul className="space-y-3 mb-6">
                  {guideSteps[activeStep].points.map((point, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                        <Icon name="Check" size={14} className="text-green-600" />
                      </div>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>

                {/* Navigation Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                    disabled={activeStep === 0}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setActiveStep(Math.min(guideSteps.length - 1, activeStep + 1))}
                    disabled={activeStep === guideSteps.length - 1}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>

              {/* Visual Representation */}
              <div className="text-center">
                <div className="w-48 h-48 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-4">
                  <div className="text-8xl">
                    {guideSteps[activeStep].image}
                  </div>
                </div>
                <div className={`w-24 h-2 ${guideSteps[activeStep].color} rounded-full mx-auto`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserGuideSection;