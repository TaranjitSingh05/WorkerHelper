import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "রাহুল দাস",
      occupation: "Construction Worker",
      location: "Kochi",
      language: "Bengali",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300",
      quote: "JeevanID আমার জীবন পরিবর্তন করেছে। এখন আমি সহজেই ডাক্তারের কাছে আমার স্বাস্থ্য রেকর্ড দেখাতে পারি।",
      translation: "JeevanID has changed my life. Now I can easily show my health records to doctors.",
      rating: 5
    },
    {
      name: "प्रीति शर्मा",
      occupation: "Factory Worker",
      location: "Thiruvananthapuram",
      language: "Hindi",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300",
      quote: "मुझे अपनी भाषा में स्वास्थ्य जानकारी मिलती है। यह बहुत मददगार है।",
      translation: "I get health information in my language. This is very helpful.",
      rating: 5
    },
    {
      name: "ਗੁਰਪ੍ਰੀਤ ਸਿੰਘ",
      occupation: "Fishery Worker",
      location: "Kollam",
      language: "Punjabi",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300",
      quote: "ਮੈਨੂੰ ਨੇੜਲੇ ਹਸਪਤਾਲ ਲੱਭਣ ਵਿੱਚ ਬਹੁਤ ਮਦਦ ਮਿਲਦੀ ਹੈ।",
      translation: "I get great help in finding nearby hospitals.",
      rating: 5
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={16}
        className={index < rating ? "text-yellow-400 fill-current" : "text-gray-300"}
      />
    ));
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            What Workers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real stories from migrant workers who have benefited from JeevanID
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials?.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="relative">
                  <Image
                    src={testimonial?.image}
                    alt={testimonial?.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <Icon name="Check" size={12} className="text-white" />
                  </div>
                </div>
                
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">{testimonial?.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial?.occupation}</p>
                  <p className="text-xs text-gray-500">{testimonial?.location}</p>
                </div>
              </div>

              <div className="flex items-center mb-4">
                {renderStars(testimonial?.rating)}
                <span className="ml-2 text-sm text-gray-600">({testimonial?.rating}.0)</span>
              </div>

              <blockquote className="text-gray-700 mb-4 leading-relaxed">
                "{testimonial?.quote}"
              </blockquote>

              <div className="text-sm text-gray-500 italic border-t pt-4">
                Translation: "{testimonial?.translation}"
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <span className="text-xs text-gray-400">Verified User</span>
                <span className="text-xs text-blue-600 font-medium">{testimonial?.language}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;