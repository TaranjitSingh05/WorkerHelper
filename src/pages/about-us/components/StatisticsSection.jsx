import React from 'react';
import Icon from '../../../components/AppIcon';

const StatisticsSection = () => {
  const statistics = [
    {
      icon: "Users",
      number: "50,000+",
      label: "Registered Workers",
      description: "Migrant workers using JeevanID across Kerala"
    },
    {
      icon: "MapPin",
      number: "500+",
      label: "Health Centers",
      description: "Partnered healthcare facilities in our network"
    },
    {
      icon: "Globe",
      number: "4",
      label: "Languages",
      description: "Multilingual support for diverse communities"
    },
    {
      icon: "Clock",
      number: "24/7",
      label: "Availability",
      description: "Round-the-clock access to health records"
    },
    {
      icon: "Shield",
      number: "99.9%",
      label: "Data Security",
      description: "Secure and encrypted health information"
    },
    {
      icon: "TrendingUp",
      number: "85%",
      label: "Health Improvement",
      description: "Workers report better health outcomes"
    }
  ];

  return (
    <section className="py-20 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Impact by Numbers
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Real results from our commitment to improving migrant worker healthcare in Kerala
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {statistics?.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-colors duration-300">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon name={stat?.icon} size={32} className="text-white" />
                </div>
                
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                  {stat?.number}
                </div>
                
                <div className="text-xl font-semibold text-blue-100 mb-3">
                  {stat?.label}
                </div>
                
                <p className="text-blue-200 leading-relaxed">
                  {stat?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;