import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { useNavigate } from 'react-router-dom';

const CallToActionSection = () => {
  const navigate = useNavigate();

  const actionItems = [
    {
      icon: "UserPlus",
      title: "Create Your Health Record",
      description: "Register now and get your digital health ID with QR code",
      action: () => navigate('/personal-health-record'),
      buttonText: "Get Started",
      variant: "default"
    },
    {
      icon: "MapPin",
      title: "Find Health Centers",
      description: "Locate nearby hospitals and healthcare facilities",
      action: () => navigate('/health-centers-locator'),
      buttonText: "Find Centers",
      variant: "outline"
    },
    {
      icon: "TrendingUp",
      title: "Check Health Trends",
      description: "Stay informed about health risks in your occupation",
      action: () => navigate('/health-trends'),
      buttonText: "View Trends",
      variant: "secondary"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-emerald-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Join thousands of migrant workers in Kerala who are already using JeevanID to manage their healthcare needs effectively.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {actionItems?.map((item, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/20 transition-colors duration-300">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name={item?.icon} size={32} className="text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-4">
                {item?.title}
              </h3>
              
              <p className="text-blue-100 mb-6 leading-relaxed">
                {item?.description}
              </p>
              
              <Button
                variant={item?.variant}
                onClick={item?.action}
                className="w-full"
              >
                {item?.buttonText}
              </Button>
            </div>
          ))}
        </div>

        {/* Emergency Contact Banner */}
        <div className="bg-red-600 rounded-2xl p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Icon name="Phone" size={32} className="text-white mr-3" />
            <h3 className="text-2xl font-bold text-white">Emergency Contact</h3>
          </div>
          
          <p className="text-red-100 mb-6 text-lg">
            For medical emergencies, call immediately:
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="bg-white/20 rounded-lg px-6 py-3">
              <div className="text-white font-bold text-xl">108</div>
              <div className="text-red-100 text-sm">Kerala Ambulance</div>
            </div>
            
            <div className="bg-white/20 rounded-lg px-6 py-3">
              <div className="text-white font-bold text-xl">102</div>
              <div className="text-red-100 text-sm">Medical Helpline</div>
            </div>
            
            <div className="bg-white/20 rounded-lg px-6 py-3">
              <div className="text-white font-bold text-xl">+91-800-WORKER</div>
              <div className="text-red-100 text-sm">JeevanID Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;