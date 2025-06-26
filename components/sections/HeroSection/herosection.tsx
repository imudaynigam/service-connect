import React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface HeroProps {
  onGetStarted?: () => void;
  onExploreServices: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted, onExploreServices }) => (
  <section className="relative min-h-screen flex items-center justify-center">
    {/* Background */}
    <div 
      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/heroBG.jpg')" }}
    ></div>
    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
    
    {/* Content */}
    <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">
        Find the Perfect
        <span className="block text-blue-400">Service Provider</span>
      </h1>
      <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
        Connect with trusted service providers for your events. From catering to photography, 
        decoration to entertainment - everything you need in one place.
      </p>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white bg-opacity-10 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Easy Discovery</h3>
          <p className="text-sm text-gray-300">Find verified service providers in your area.</p>
        </div>
        <div className="bg-white bg-opacity-10 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Verified Providers</h3>
          <p className="text-sm text-gray-300">All providers are verified for quality.</p>
        </div>
        <div className="bg-white bg-opacity-10 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Direct Contact</h3>
          <p className="text-sm text-gray-300">Connect directly with service providers.</p>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onExploreServices}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Explore Services
        </button>
        <Link
          href="/login"
          className="bg-white text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Join as Provider
        </Link>
      </div>
    </div>
  </section>
);

export default Hero;
