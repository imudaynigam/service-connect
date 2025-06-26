'use client';
import React, { useEffect, useState } from 'react';
import { X, Menu } from 'lucide-react';

const Header = ({ onLogin, onSignup }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      <header
        className={`${isScrolled ? 'bg-blue-900' : 'bg-transparent'} fixed w-full z-50 p-4 transition-colors`}
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-white text-xl font-bold">ServiceConnect</h1>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6">
            <a href="#home" className="text-white hover:text-blue-200 transition-colors">Home</a>
            <a href="#about" className="text-white hover:text-blue-200 transition-colors">About</a>
            <a href="#contact" className="text-white hover:text-blue-200 transition-colors">Contact</a>
          </nav>
          
          {/* Desktop Buttons */}
          <div className="hidden md:flex gap-3">
            <button
              onClick={onLogin}
              className="px-4 py-2 text-white border border-white rounded hover:bg-white hover:text-blue-900 transition-colors"
            >
              Login
            </button>
            <button
              onClick={onSignup}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Signup
            </button>
          </div>
          
          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-white" onClick={toggleSidebar}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>
      
      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={closeSidebar}
          />
          <div className="fixed top-0 right-0 z-50 w-64 h-full bg-blue-900 p-4">
            <div className="flex justify-end">
              <button onClick={closeSidebar} className="text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="mt-8 flex flex-col space-y-4">
              <a href="#home" className="text-white hover:text-blue-200 transition-colors" onClick={closeSidebar}>
                Home
              </a>
              <a href="#about" className="text-white hover:text-blue-200 transition-colors" onClick={closeSidebar}>
                About
              </a>
              <a href="#contact" className="text-white hover:text-blue-200 transition-colors" onClick={closeSidebar}>
                Contact
              </a>
            </nav>
            <div className="mt-8 flex flex-col space-y-4">
              <button
                onClick={() => {
                  onLogin();
                  closeSidebar();
                }}
                className="px-4 py-2 text-white border border-white rounded hover:bg-white hover:text-blue-900 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => {
                  onSignup();
                  closeSidebar();
                }}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Signup
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
