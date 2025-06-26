import React from 'react';

const features = [
  {
    icon: '/images/verified.jpg',
    title: 'Verified Providers',
    description:
      'All service providers are thoroughly vetted for quality and reliability.',
  },
  {
    icon: '/images/booking.jpg',
    title: 'Easy Booking',
    description: 'Book services instantly with our streamlined platform.',
  },
  {
    icon: '/images/connection.jpg',
    title: 'Easy Connection',
    description:
      'Connect with service providers near your location easily.',
  },
];

const AboutSection = () => (
  <section className="bg-gray-100 py-16 px-4">
    <div className="max-w-6xl mx-auto text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Why Choose ServiceConnect?
      </h2>
      <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
        We connect customers with trusted service providers. From event management 
        to daily needs, we ensure a seamless experience.
      </p>
      
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {features.map((f, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <img
              src={f.icon}
              alt={f.title}
              className="w-16 h-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-bold text-gray-800 mb-3">{f.title}</h3>
            <p className="text-gray-600">{f.description}</p>
          </div>
        ))}
      </div>
      
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-semibold transition-colors">
        Learn More
      </button>
    </div>
  </section>
);

export default AboutSection;
