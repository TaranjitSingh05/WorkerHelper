import React from 'react';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-emerald-50 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Empowering
                <span className="text-blue-600 block">Migrant Workers</span>
                in Kerala
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                JeevanID bridges the healthcare gap for migrant workers through digital health records, multilingual support, and accessible medical services across Kerala.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="default" 
                size="lg"
                onClick={() => navigate('/personal-health-record')}
                className="px-8"
              >
                Get Started Today
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/health-centers-locator')}
                className="px-8"
              >
                Find Health Centers
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.pexels.com/photos/7579831/pexels-photo-7579831.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Healthcare workers helping migrant workers"
                className="w-full h-96 lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Floating Stats Card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">50,000+</div>
                <div className="text-sm text-gray-600">Workers Registered</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;