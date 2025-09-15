import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const FAQSection = () => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqs = [
    {
      question: "How secure is my health information on WorkerHelper?",
      answer: "Your health information is protected with bank-level encryption and stored securely in compliance with Indian data protection laws. We never share your personal data without your explicit consent, and you have full control over who can access your health records."
    },
    {
      question: "Can I use WorkerHelper if I don't speak English?",
      answer: "Absolutely! WorkerHelper supports four languages - English, Hindi, Bengali, and Punjabi. You can switch between languages at any time, and all features including forms, instructions, and support are available in your preferred language."
    },
    {
      question: "Is WorkerHelper free to use?",
      answer: "Yes, WorkerHelper is completely free for all migrant workers in Kerala. This service is supported by government partnerships and healthcare providers to ensure no worker faces financial barriers to accessing their health information."
    },
    {
      question: "How do I access my health records in an emergency?",
      answer: "Your health records can be accessed instantly using the QR code generated when you register. Healthcare providers can scan this code to immediately view your medical history, allergies, chronic conditions, and emergency contacts even if you're unconscious."
    },
    {
      question: "What if I change jobs or move to a different location in Kerala?",
      answer: "Your WorkerHelper account and health records move with you. Simply update your occupation and location in your profile, and you'll continue to have access to all features including nearby health center locations and job-specific health risk assessments."
    },
    {
      question: "Can my employer access my health records?",
      answer: "No, your employer cannot access your personal health records without your explicit permission. You control who can view your information. However, you can choose to share specific health clearances or vaccination status if required for work compliance."
    },
    {
      question: "How do I find the nearest hospital using WorkerHelper?",
      answer: "The Health Centers feature uses your phone's GPS to show nearby hospitals and clinics on an interactive map. You can get directions, view contact information, and even see which facilities have partnerships with WorkerHelper for faster service."
    },
    {
      question: "What happens if I lose my phone or forget my login details?",
      answer: "You can recover your account using your registered phone number or email address. Your health records are safely stored in the cloud, so you won't lose any information. Contact our multilingual support team for assistance with account recovery."
    }
  ];

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Common questions about WorkerHelper and digital health records
          </p>
        </div>

        <div className="space-y-4">
          {faqs?.map((faq, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq?.question}
                </h3>
                <div className="flex-shrink-0">
                  <Icon
                    name={expandedFAQ === index ? "ChevronUp" : "ChevronDown"}
                    size={20}
                    className="text-gray-600"
                  />
                </div>
              </button>
              
              {expandedFAQ === index && (
                <div className="px-6 pb-6">
                  <div className="border-t pt-4">
                    <p className="text-gray-700 leading-relaxed">
                      {faq?.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-16 text-center">
          <div className="bg-blue-50 rounded-2xl p-8">
            <Icon name="HelpCircle" size={48} className="text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Our multilingual support team is here to help you 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center justify-center space-x-2 text-blue-600">
                <Icon name="Phone" size={16} />
                <span className="font-medium">+91-800-WORKER (966537)</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-blue-600">
                <Icon name="Mail" size={16} />
                <span className="font-medium">support@workerhelper.kerala.gov.in</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;