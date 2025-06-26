'use client';
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">ServiceConnect</h3>
            <p className="text-gray-300 mb-4">
              Connecting service providers with customers. Find the perfect services 
              for your events and celebrations.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">Facebook</a>
              <a href="#" className="text-gray-300 hover:text-white">Twitter</a>
              <a href="#" className="text-gray-300 hover:text-white">Instagram</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/explore" className="text-gray-300 hover:text-white">Explore Services</a></li>
              <li><a href="/login" className="text-gray-300 hover:text-white">Join as Provider</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-white">About Us</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-white">Contact Us</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Catering Services</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Photography</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Decoration</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Music & Entertainment</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Transportation</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Makeup & Styling</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-300 text-sm mb-4 md:mb-0">
              © 2024 ServiceConnect. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-300 hover:text-white">Privacy Policy</a>
              <a href="#" className="text-gray-300 hover:text-white">Terms of Service</a>
              <a href="#" className="text-gray-300 hover:text-white">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
