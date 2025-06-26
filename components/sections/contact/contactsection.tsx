import React, { useState } from 'react';
import { Mail, Phone, MapPin, X } from 'lucide-react';
import ContactForm from './contactform';

const contactItems = [
  {
    icon: <Mail className="w-6 h-6" />,
    title: 'Email Us',
    content: 'hello@example.com',
  },
  {
    icon: <Phone className="w-6 h-6" />,
    title: 'Call Us',
    content: '+1 (555) 123-4567',
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: 'Visit Us',
    content: '123 Business Ave, Suite 100, CA 94107',
  },
];

export default function ContactSection() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <section className="bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Get in Touch</h2>
          <p className="text-lg text-gray-600">
            Have a question or want to work together? We'd love to hear from you.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {contactItems.map((item, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <div className="bg-blue-100 rounded-full p-3 w-fit mx-auto mb-4">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.content}</p>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-semibold transition-colors"
          >
            Send Message
          </button>
        </div>
        
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="bg-white rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Contact Us</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <ContactForm />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
