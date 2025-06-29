'use client';
import { X, Plus, Layers } from 'lucide-react';
import Link from 'next/link';
import ProfileSection from './ProfileSection';
import MainServiceNav from './MainServiceNav';
import AdditionalServiceNav from './AdditionalServiceNav';
import LogoutButton from './LogoutButton';

interface SidebarProps {
  onClose: () => void;
  onLogout: () => void;
  onServiceClick: (type: 'main' | 'additional') => void;
  onNav: (view: 'add' | 'main' | 'additional') => void;
}

export default function Sidebar({
  onClose,
  onLogout,
  onServiceClick,
  onNav,
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
          <button 
            className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group w-full"
            onClick={() => { onNav('add'); onClose(); }}
          >
            <svg className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add a Service
          </button>
          <button 
            className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group w-full"
            onClick={() => { onNav('main'); onClose(); }}
          >
            <svg className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            </svg>
            Main Services
          </button>
          <button 
            className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group w-full"
            onClick={() => { onNav('additional'); onClose(); }}
          >
            <Layers className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500" />
            Additional Services
          </button>
        </nav>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <LogoutButton onLogout={onLogout} />
        </div>
      </div>
    </div>
  );
}
