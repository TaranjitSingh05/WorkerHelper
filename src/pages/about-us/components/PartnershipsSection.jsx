import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const PartnershipsSection = () => {
  const partners = [
    {
      name: "Kerala Health Department",
      type: "Government Partner",
      logo: "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=200",
      description: "Official partnership for migrant worker healthcare initiatives"
    },
    {
      name: "ASTER Hospitals",
      type: "Healthcare Provider",
      logo: "https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=200",
      description: "Network of hospitals providing specialized care"
    },
    {
      name: "Rajagiri Hospital",
      type: "Medical Center",
      logo: "https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=200",
      description: "Emergency and specialized medical services"
    },
    {
      name: "Kerala Labour Department",
      type: "Government Agency",
      logo: "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=200",
      description: "Worker welfare and safety programs"
    }
  ];

  const endorsements = [
    {
      quote: "WorkerHelper has significantly improved healthcare accessibility for migrant workers across Kerala.",
      author: "Dr. Priya Nair",
      position: "Director, Kerala Health Services",
      image: "https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      quote: "This platform bridges the critical gap between workers and healthcare providers.",
      author: "Rajesh Kumar",
      position: "Labour Commissioner, Kerala",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            Trusted Partnerships
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Working together with government agencies and healthcare providers to serve migrant workers better
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {partners?.map((partner, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src={partner?.logo}
                  alt={partner?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2">{partner?.name}</h3>
              <div className="text-sm text-blue-600 font-medium mb-3">{partner?.type}</div>
              <p className="text-sm text-gray-600 leading-relaxed">{partner?.description}</p>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-center">
                  <Icon name="CheckCircle" size={16} className="text-green-500 mr-2" />
                  <span className="text-xs text-green-600 font-medium">Verified Partner</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Endorsements */}
        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl">
          <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 text-center mb-12">
            Government Endorsements
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            {endorsements?.map((endorsement, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Image
                    src={endorsement?.image}
                    alt={endorsement?.author}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <blockquote className="text-gray-700 mb-4 leading-relaxed italic">
                    "{endorsement?.quote}"
                  </blockquote>
                  
                  <div>
                    <div className="font-semibold text-gray-900">{endorsement?.author}</div>
                    <div className="text-sm text-gray-600">{endorsement?.position}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnershipsSection;