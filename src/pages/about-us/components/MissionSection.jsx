import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const MissionSection = () => {
  const missionPoints = [
    {
      icon: "Heart",
      title: "Healthcare Access",
      description: "Ensuring every migrant worker has access to quality healthcare services regardless of language barriers."
    },
    {
      icon: "Shield",
      title: "Digital Health Records",
      description: "Secure, portable health records that workers can access anytime, anywhere in Kerala."
    },
    {
      icon: "Users",
      title: "Community Support",
      description: "Building a supportive ecosystem connecting workers, healthcare providers, and government services."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            Our Mission
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            To revolutionize healthcare accessibility for migrant workers in Kerala by providing comprehensive digital health solutions that break down language and geographical barriers.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            {missionPoints?.map((point, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon name={point?.icon} size={24} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {point?.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {point?.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Healthcare mission in action"
                className="w-full h-96 object-cover"
              />
            </div>
            
            {/* Mission Quote */}
            <div className="absolute -bottom-8 -right-8 bg-emerald-600 text-white p-6 rounded-xl shadow-lg max-w-xs">
              <p className="text-sm font-medium">
                "Every worker deserves dignified healthcare access in their own language."
              </p>
              <div className="text-xs mt-2 opacity-90">- WorkerHelper Team</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;