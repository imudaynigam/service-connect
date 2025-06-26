'use client';
import { X } from 'lucide-react';
import Link from 'next/link';
import ProfileSection from './ProfileSection';
import MainServiceNav from './MainServiceNav';
import AdditionalServiceNav from './AdditionalServiceNav';
import LogoutButton from './LogoutButton';

interface SidebarProps {
  onClose: () => void;
  onLogout: () => void;
  onServiceClick: (type: 'main' | 'additional') => void;
  hasServices: boolean;
}

export default function Sidebar({
  onClose,
  onLogout,
  onServiceClick,
  hasServices,
}: SidebarProps) {
  return (
    <div className="bg-white shadow-lg border-r border-gray-200 w-64 min-h-screen">
      <div className="p-6">
        {/* Mobile close button */}
        <div className="flex items-center justify-between mb-8 md:mb-8">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-800">ServiceHub</h1>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <ProfileSection />
        
        <nav className="mt-8 space-y-2">
          <Link 
            href="/dashboard" 
            className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
            onClick={onClose}
          >
            <svg className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
            </svg>
            Dashboard
          </Link>
          
          <Link 
            href="/edit-profile" 
            className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
            onClick={onClose}
          >
            <svg className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Edit Profile
          </Link>
          
          <Link 
            href="/notifications" 
            className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
            onClick={onClose}
          >
            <svg className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4.19A2 2 0 006.03 3h11.94c.7 0 1.36.37 1.72.97L20.5 6H4.5l1.75-2.81zM4 6v12a2 2 0 002 2h12a2 2 0 002-2V6H4z" />
            </svg>
            Notifications
          </Link>
          
          <Link 
            href="/message" 
            className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
            onClick={onClose}
          >
            <svg className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Messages
          </Link>
        </nav>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <LogoutButton onLogout={onLogout} />
        </div>
      </div>
    </div>
  );
}
