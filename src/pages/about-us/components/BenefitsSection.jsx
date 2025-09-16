import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const BenefitsSection = () => {
  const benefits = [
    {
      icon: "Globe",
      title: "Multilingual Support",
      description: "Available in English, Hindi, Bengali, and Punjabi to serve Kerala's diverse migrant worker population.",
      image: "https://images.pexels.com/photos/7579319/pexels-photo-7579319.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      icon: "FileText",
      title: "Digital Health Records",
      description: "Secure, centralized health records accessible via QR codes for instant medical history retrieval.",
      image: "https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      icon: "MapPin",
      title: "Health Center Locator",
      description: "GPS-enabled location services to find the nearest hospitals and healthcare facilities.",
      image: "https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      icon: "TrendingUp",
      title: "Health Trends & Insights",
      description: "Stay informed about occupation-specific health risks and preventive measures.",
      image: "https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      icon: "Shield",
      title: "Risk Assessment",
      description: "Personalized health risk evaluation based on occupation type and working conditions.",
      image: "https://images.pexels.com/photos/4386370/pexels-photo-4386370.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      icon: "Clock",
      title: "24/7 Accessibility",
      description: "Access your health information and emergency contacts anytime, anywhere in Kerala.",
      image: "https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=600"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            Why Choose JeevanID?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive healthcare solutions designed specifically for migrant workers in Kerala
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits?.map((benefit, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48">
                <Image
                  src={benefit?.image}
                  alt={benefit?.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-lg">
                    <Icon name={benefit?.icon} size={24} className="text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {benefit?.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;